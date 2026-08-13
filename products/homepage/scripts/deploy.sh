#!/usr/bin/env bash
#
# 홈페이지 빌드 + 배포 (정적 export → S3 → CloudFront 무효화).
#
# 사용:
#   ./scripts/deploy.sh dev    # 프리뷰(전용 CloudFront)
#   ./scripts/deploy.sh prd    # 실서비스 www.fainders.ai (확인 프롬프트)
#
# 설정은 deploy/<target>.env 에서 읽는다. AWS 자격증명은 `aws` CLI가 별도 관리
# (aws configure / SSO / 환경변수). 사전조건: pnpm install 완료, aws CLI 로그인.
#
set -euo pipefail

TARGET="${1:-}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"          # products/homepage
REPO_ROOT="$(cd "$HERE/../.." && pwd)"            # platform-system
ENV_FILE="$HERE/deploy/${TARGET}.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "사용법: ./scripts/deploy.sh <dev|prd>"
  echo "설정 파일 없음: $ENV_FILE"
  exit 1
fi

# shellcheck disable=SC1090
set -a; . "$ENV_FILE"; set +a

echo "▶ 타깃: $TARGET"
echo "  S3: $S3_DEST"
echo "  CloudFront: $CLOUDFRONT_ID  ($PREVIEW_URL)"
echo "  noindex=$NOINDEX  flat_html=$FLAT_HTML  delete=$DELETE"
echo "  제외: *_original* ${SYNC_EXCLUDES:-}"

# PRD 안전 확인
if [ "$TARGET" = "prd" ]; then
  echo "⚠️  실서비스(www.fainders.ai) 루트 배포입니다."
  printf "진행하려면 'deploy-prd' 를 정확히 입력: "
  read -r ANS
  [ "$ANS" = "deploy-prd" ] || { echo "취소됨."; exit 1; }
fi

OUT="$HERE/out"

echo "▶ 빌드..."
( cd "$REPO_ROOT" && pnpm --filter fai-homepage build )

# 모바일 가로 오버플로우 게이트 — 오버플로우 시 배포 중단(About EN 햄버거 사라짐 류 재발 방지).
echo "▶ 모바일 가로 오버플로우 검사..."
( cd "$HERE" && node scripts/check-mobile-overflow.mjs )

# noindex 주입(프리뷰 색인 방지)
if [ "$NOINDEX" = "true" ]; then
  echo "▶ noindex 메타 주입..."
  find "$OUT" -name '*.html' -type f -print0 \
    | xargs -0 perl -pi -e 's#<head>#<head><meta name="robots" content="noindex,nofollow">#'
fi

# flat <dir>.html 생성(라이브 CF 함수 /foo/→/foo.html 호환)
if [ "$FLAT_HTML" = "true" ]; then
  echo "▶ flat html 생성(CF 함수 호환)..."
  ( cd "$OUT" && find . -mindepth 2 -name index.html | while read -r f; do cp "$f" "$(dirname "$f").html"; done )
fi

# 필수 standalone 페이지 누락 방지 — out/에 없으면 배포 중단(public/ 에서 빠졌는지 확인)
REQUIRED_FILES=(
  "contact-bakery-vco.html"
  "contact-van-vco.html"
  "naverc27da09292da484463448fab767cc3eb.html"  # 네이버 사이트 인증
)
for rf in "${REQUIRED_FILES[@]}"; do
  [ -f "$OUT/$rf" ] || { echo "❌ 필수 standalone 파일 누락: out/$rf — 배포 중단. products/homepage/public/ 확인."; exit 1; }
done
echo "▶ 필수 standalone 페이지 확인 OK (${#REQUIRED_FILES[@]}개)"

# 배포 버전 마커 — 실제로 올라간 커밋을 /version.json 으로 남겨 staleness를 기계 검출.
# (develop 머지만 하고 dev 재배포를 빠뜨려 수정이 프리뷰에 반영 안 된 채 QA로 넘어간
#  HOM-45/46/47/48/51/52/55 재발을 구조적으로 막는다. QA는 아래 한 줄로 최신여부 확인:
#    curl -s $PREVIEW_URL/version.json  vs  git rev-parse HEAD)
echo "▶ 버전 마커 생성(out/version.json)..."
DEPLOY_SHA="$(git -C "$REPO_ROOT" rev-parse HEAD)"
DEPLOY_BRANCH="$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD)"
if [ -n "$(git -C "$REPO_ROOT" status --porcelain)" ]; then DEPLOY_DIRTY="true"; else DEPLOY_DIRTY="false"; fi
DEPLOY_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
cat > "$OUT/version.json" <<EOF
{
  "target": "$TARGET",
  "sha": "$DEPLOY_SHA",
  "branch": "$DEPLOY_BRANCH",
  "dirty": $DEPLOY_DIRTY,
  "deployedAt": "$DEPLOY_TIME"
}
EOF
[ "$DEPLOY_DIRTY" = "true" ] && echo "  ⚠️  워킹트리 dirty 상태로 배포 — 커밋 안 된 변경이 섞여 있음."

# S3 동기화 (_original 백업은 항상 제외)
echo "▶ S3 업로드..."
SYNC_ARGS=(--exclude "*_original*")
# 타깃별 추가 제외 경로(공백 구분, <target>.env 의 SYNC_EXCLUDES).
#
# PRD는 버킷 **루트**에 --delete 로 sync 하는데, dev 프리뷰가 같은 버킷의
# homepage_v2/ prefix 에 산다. 제외하지 않으면 PRD 배포 때마다 프리뷰 537개 객체가
# 통째로 삭제되고, 매번 dev 를 수동 재배포해야 복구된다(2026-08-05에도 PRD 3분 뒤
# dev 를 다시 올린 흔적이 있음). 배포 순서에 의존하는 대신 구조로 막는다.
for ex in ${SYNC_EXCLUDES:-}; do SYNC_ARGS+=(--exclude "$ex"); done
[ "$DELETE" = "true" ] && SYNC_ARGS+=(--delete)
aws s3 sync "$OUT" "$S3_DEST" "${SYNC_ARGS[@]}" --only-show-errors --region "$AWS_REGION"

# CloudFront 무효화
echo "▶ CloudFront 무효화..."
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*" \
  --query "Invalidation.Status" --output text

echo "✅ 배포 완료 → $PREVIEW_URL"
echo "   배포 커밋: $DEPLOY_BRANCH @ ${DEPLOY_SHA:0:7}  (dirty=$DEPLOY_DIRTY)"
echo "   최신여부 확인: curl -s $PREVIEW_URL/version.json  ↔  git rev-parse HEAD"
