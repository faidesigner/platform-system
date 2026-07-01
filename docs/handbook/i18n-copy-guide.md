# 카피/번역 편집 가이드 (기획·개발 공용)

홈페이지의 문구를 바꾸거나 번역을 추가할 때 참조. (에이전트 자동화 규칙은 `.claude/skills/homepage-i18n`)

## 카피는 어디에 있나
- **모든 화면 문구** → `products/homepage/messages/{ko,en,ja}.json`
  - `ko.json`=한국어, `en.json`=영어, `ja.json`=일본어. **세 파일의 키(경로)는 항상 동일**해야 한다.
- 이미지/영상/링크 주소, 아이콘, 색상 → `config/site.ts`(문구 아님).

## 문구 바꾸기 (기획자)
1. 바꾸려는 텍스트를 `ko.json`에서 검색해 키를 찾는다(예: `home.hero.title`).
2. **같은 키를 `en.json`·`ja.json`에서도** 함께 수정(언어별 값).
3. 새 문구/섹션이면 세 파일 모두에 **동일한 키**로 추가.
4. 개발자에게 빌드·검증 요청(또는 아래 검증 실행).

## 번역하면 안 되는 것 (원문 유지)
- 고유명사: Fainders.AI, FAI, VCO, VISION CHECK-OUT, WALK-THROUGH, STANDARD/MICRO STORE
- 고객사·투자사·인명, URL·이미지 경로, 이메일/전화/주소/사업자번호, 숫자·단위
- `MISSING_FROM_DESIGN`(디자인 미확정 표시)

## 로케일 규칙
- 일본어 코드는 **`ja`** (국가코드 `jp` 아님).
- `ko`=한국어(색인 대상). `en`/`ja`는 번역 완성도에 따라 색인 정책이 정해짐.
- 초벌 번역은 **`products/homepage/docs/TODO_i18n-marketing-review.md`** 에 검수 대상으로 남긴다(브랜드 카피·언론 헤드라인·로마자 표기 등은 반드시 사람 검수).

## 알려진 공백
- 미디어 페이지의 **YouTube 영상 제목**(RSS 동기)과 **Retail Tech Letter 제목**(Stibee)은 외부에서 주기적으로 갱신돼 정적 번역이 안 된다 → en/ja에서 한국어로 보일 수 있음. 정책 결정 필요(자동번역/숨김/수용).

## 검증 (개발자)
```bash
cd products/homepage
# 키 동기 확인 (ko=en=ja)
node -e "const w=(x,p='')=>x&&typeof x==='object'&&!Array.isArray(x)?Object.entries(x).flatMap(([k,v])=>w(v,p?p+'.'+k:k)):[p];const L=l=>new Set(w(require('./messages/'+l+'.json')));const ko=L('ko'),en=L('en'),ja=L('ja');const d=(a,b)=>[...a].filter(x=>!b.has(x));console.log('sizes',ko.size,en.size,ja.size,'diffs',d(ko,en),d(en,ko),d(ko,ja),d(ja,ko))"
pnpm build && pnpm test
```
- 로케일 오염(엉뚱한 언어 노출)은 Playwright 스윕으로 확인(`homepage-i18n` 스킬 참조).
