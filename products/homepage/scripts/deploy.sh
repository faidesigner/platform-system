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

# S3 동기화 (_original 백업은 항상 제외)
echo "▶ S3 업로드..."
SYNC_ARGS=(--exclude "*_original*")
[ "$DELETE" = "true" ] && SYNC_ARGS+=(--delete)
aws s3 sync "$OUT" "$S3_DEST" "${SYNC_ARGS[@]}" --only-show-errors --region "$AWS_REGION"

# CloudFront 무효화
echo "▶ CloudFront 무효화..."
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*" \
  --query "Invalidation.Status" --output text

echo "✅ 배포 완료 → $PREVIEW_URL"
