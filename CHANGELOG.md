# 📑 CHANGELOG

모든 시스템의 변경 사항은 역순(최신순)으로 기록합니다.

## [Unreleased] - 2026-09-02

### 🛠 Fixed

#### QA 재신고 6건 — 5건 수정, 1건은 "의도된 설계"로 판정 (2026-09-01 김성태 피드백)

**❶ `/about` ja 파트너 문구 줄바꿈 3줄로 재편**
- `グローバル市場をリードするパートナーとともに / 技術を超えた…` 2줄 → `グローバル市場をリードする / パートナーとともに / 技術を超えた…` 3줄
- ja만 ko·en보다 한 줄 많아진다. `messageConsistency.test.ts`의 `lineCountMayDiffer`를 **양방향 예외**로 고쳤다 — 기존 코드는 "ko에 있는데 en/ja에 없는" 방향만 봐서, ja가 더 긴 경우를 키 desync로 오탐했다
- `sheet-decisions.json`도 3줄 기준으로 갱신(시트 셀은 여전히 2줄)

**❷ 무인매장 사례 카드 매장명 2회 중복 — en·ja 동시 발생**
- 카드 제목은 `StoreCaseStudies.tsx`에서 **`brand / store`로 이어 붙여** 렌더된다. 그런데 en·ja의 `brand`가 `"GS25 DX LAB\nGasan Smart Store"`처럼 매장명을 통째로 품고 있어 화면에 `GS25 DX LAB Gasan Smart Store / Gasan Smart Store`가 나왔다 (ko는 처음부터 정상)
- `brand`를 `"GS25 DX LAB"`으로 정리. 번역 시트 일괄 반영 때 brand 칸에 "브랜드+매장명"을 통째로 적어 넣으면 조용히 재발하는 종류라 규칙 자체를 테스트로 고정했다

**❸ `/about` 정부기관 로고 2종 누락분 추가 (과기정통부·KISA)**
- `investors.groups.government`에 2행 신설 — 부처(과학기술정보통신부) → 산하기관(KISA) 순
- 로고는 각 기관 **공식 CI**에서 취득: 과기정통부는 `msit.go.kr` 배포 SVG를 2x PNG로 렌더, KISA는 `kisa.or.kr/604`(상징 CI) 가로 시그니처
- 두 로고 모두 가로:세로 ≈ 5:1로 맞춰 기존 중소벤처기업부 로고와 시각적 크기를 맞췄다. 세로형 KISA 시그니처(2.7:1)를 쓰면 혼자 두 배로 커진다
- `AboutLogos`의 로고행 래퍼를 `items-start` → `items-center`로 변경 — 행마다 개수가 다를 수 있게 됐고(3+2), 기존 3+3 그룹의 렌더는 바뀌지 않는다

**❹ 무인매장 ja 브랜드명 띄어쓰기** — `羅州Tech Friendly` → `羅州 Tech Friendly` (ko `나주 테크프렌들리`에 있던 공백이 번역에서 탈락)

**❺ `/about` en 이현규 CSO 경력** — `Consultant, BCG` → `Consultant, Deloitte`
- ⚠️ **ko(`전 BCG 컨설턴트`)·ja(`元BCGコンサルタント`)는 요청 범위 밖이라 그대로 뒀다.** 번역 오류가 아니라 사실 정보 불일치이므로 3개 로케일 정합이 필요하면 별도 확인이 필요하다

#### ja unmannedStore MICRO STORE 설명 오타 — `プレファブ` → `プレハブ`

- prefab의 표준 일본어 표기는 `プレハブ`다. `storeTypes.1.description`에 `プレファブ工法`이 들어가 있었다
- **같은 화면 5줄 아래 `cards.0.description`은 `プレハブ工法`으로 맞게 적혀 있었다** — 한 페이지에 같은 단어가 두 표기로 공존한 셈. 시트(product-store 46행)도 `プレハブ`가 정답이었으니, 시트 셀을 코드로 옮기는 과정의 전사 오류다
- 수정 후 시트 46행 3줄과 **완전 일치** 확인:
  ```
  5坪前後の空きスペースを有効活用        ← subtitle (font-weight 600, 볼드)
  1日で設置可能なプレハブ工法により        ← description 1줄
  手軽に無人店舗を導入できます            ← description 2줄
  ```
- 렌더 실측: subtitle `font-weight: 600` / description `400`, 둘 다 `white-space: pre-line`으로 지정 줄바꿈 유지

**대조 도구 사각지대를 확인했다**
- `scripts/sync-messages.mjs`는 ko 원문으로 조인하는데, 이 행은 **시트 한 셀(3줄)을 코드가 subtitle·description 두 키로 쪼개** 갖는다. 어느 키도 셀 전체와 같지 않아 조인이 실패하고 "ko 미매칭 65행"에 묻힌다 — 실측으로 리포트에 이 키가 **0건** 등장하는 것을 확인했다
- 즉 split-cell 행은 도구가 구조적으로 못 본다. 도구를 고치는 건 65행의 분류를 통째로 바꾸는 작업이라 이번 범위 밖으로 두고, 대신 표기 규칙을 테스트로 못박았다

### 🧪 Tests
- `i18n/jaLoanwordSpelling.test.ts` 🆕 — ja 외래어 **오기 blocklist**. 카피 취향이 아니라 표준 표기 문제만 담아 문구가 정당하게 바뀌어도 오탐하지 않는다. blocklist 자체가 썩는 것(정답 표기가 코드에서 사라짐)도 함께 검사. 오타를 되돌려 재현 확인(`storeTypes.1.description` 지목, 1 failed)

#### about Management 카드 — 좁은 폭에서 인물마다 초록 배경·사진 위치가 어긋남

QA: "width가 좁을 때 세로 4칸으로 나올 때 초록색 배경 위치, 몸의 위치가 사람마다 달라진다"(`/en/about/`).

**원인** — 카드 폭이 **텍스트 길이로 결정**되고 있었다.
- 썸네일 컨테이너가 `w-full`인데, `w-full`은 부모(카드) 폭의 100%다. 카드는 grid item이면서 `justify-items-center`(=`justify-self: center`)라 **폭이 지정돼 있지 않았고**, 그러면 카드 폭 = 자식들의 max-content = **라벨(학력·경력) 텍스트 길이**가 된다
- 그 안의 네임박스(`left-0`, 220px 고정)와 인물 사진(`right-0`, 207px 고정)은 **절대배치**라 컨테이너 폭에 직접 매달려 있다. 컨테이너 폭이 사람마다 다르면 둘 사이 간격이 그대로 달라진다
- 실측(PRD, en, 500px 뷰포트):
  | 인물 | 카드 폭 | 사진 좌측 오프셋 |
  |---|---|---|
  | Myungwon Ham | 258px | +51px |
  | Minkwon Wang | 265px | +59px |
  | **Sukbum Hong** | **215px** | **+7px** ← 네임박스(220px)가 카드보다 넓어 사진이 초록 배경을 거의 덮었다 |
  | Hyunkyu Lee | 256px | +49px |
- 카드마다 개별 중앙정렬이라 좌측 시작점도 달랐다(66/62/88/67px) — 네 행이 세로로 정렬되지 않았다
- tablet~laptop 구간(1열 + 가로형 카드)도 같은 이유로 좌측 시작점이 어긋났다(900px에서 161~187px)

**수정**
- grid item에 `w-full max-w-[312px] tablet:max-w-none` — 세로 1열 구간에서 카드 폭을 **텍스트와 무관하게 확정**한다. `w-full + max-w` 조합이라 312px보다 좁은 뷰포트(360px 등)에서는 자연히 줄어들어 가로 오버플로우가 없다
- `justify-items-center laptop:justify-items-stretch` → `justify-items-center tablet:justify-items-stretch` — 가로형 카드는 폭이 라벨 길이만큼 달라지므로 중앙정렬하면 좌측이 어긋난다. tablet부터 stretch로 좌측 정렬을 고정
- 검증(ko·en·ja × 360/390/500/700/900/1100/1440px = 21조합): `thumbW` **312 단일값**, 네임박스 오프셋 **0**, 사진 오프셋 **105** — 네 인물 전부 동일. 가로 오버플로우 0

**이게 왜 여태 안 잡혔나 — 게이트가 다른 컴포넌트를 보고 있었다**
- `check-about-layout.mjs`는 `span.bg-mint-400` + `article` 셀렉터로 **People(メンバー) 카드**만 재고 있었다(HOM-98/99 대응). Management 카드는 **무검사 구간**이었다
- Management 기하 검사 추가: 네 카드의 `thumbW`·네임박스 오프셋·사진 오프셋이 **모두 같아야** 통과. 수정을 되돌려 재현 확인 — `임원카드 편차 19~69px`로 exit 1, 수정 후 0px

#### about ja Management 이름 — 카타카나 병기 제거 (사진에 가려 잘림)

- ja Management 카드의 이름 칸은 **180px 고정폭**이다. `Myungwon Ham（ハム・ミョンウォン）`처럼 카타카나를 병기하면 두 줄로 밀리고, **둘째 줄이 인물 사진에 가려**진다(`overflow: visible`이라 잘린 채 그대로 노출)
- 4명 모두 영문명만으로 정리 — ko 페이지와 같은 한 줄 표기가 된다
- **メンバー 카드는 카타카나를 유지한다.** 이건 취향이 아니라 시트 지정값이다(실측 2026-09-02):
  | 자리 | 시트 행 | ja |
  |---|---|---|
  | Management | aboutUs 9·16·22·28 | `Myungwon Ham` / `Minkwon Wang` / `Sukbom Hong` / `Hyunkyu Lee` — **영문명만** |
  | メンバー 카드 | aboutUs 38·41 | `Sukbum Hong（ホン・ソクボム）` / `Minkwon Wang（ワン・ミングォン）` — **카타카나 병기** |
- `sheet-decisions.json`: Management 이름 선언 4건 중 **3건 삭제**(코드가 시트와 같아져 선언할 것이 없다). `members.2.name`(홍석범)만 유지 — 시트 ja가 `Sokbom Hong` 오표기라 남는 이격은 로마자 통일분이다
- `members.1.name`(ja) 선언 신설 — ko 원문 `왕민권`이 시트 두 행(16·41)에 중복돼 조인이 41행(카타카나 병기)에 엇갈려 붙는다. 급식 건과 같은 가짜 이격이다. 버킷 B 1건 → 0건

#### 조사: 석범님 영문 표기 — 코드는 이미 통일돼 있고, 남은 건 ja PDF 1곳

`Sukbum Hong`으로 통일 요청을 받고 전수 조사했다.
- **코드/messages는 전부 `Sukbum Hong`**이다(en·ja Management·メンバー 4자리). 시트 ja `Sokbom Hong`·en `Sokbom Hong` 오표기에 대해 `sheet-decisions.json`이 이미 코드를 정답으로 고정하고 있다
- `Seokbeom Hong`은 **PDF 안에만** 있다. `pdftotext` 전수 검색 결과:
  | 파일 | 표기 | 서빙 여부 |
  |---|---|---|
  | `FaindersAI_プライバシーポリシー_個人情報保護方針_2026-1.pdf` | `Seokbeom Hong（ホン・ソクボム、CTO）` — 個人情報保護管理者 칸 | **현재 서빙 중** |
  | `FaindersAI_プライバシーポリシー(個人情報保護方針).pdf` | 동일 | 코드에서 참조 안 됨(사문서) |
  | ko `_2026-1.pdf` | `홍석범`(한글) | 서빙 중 — 로마자 아님 |
  | en `_2026-1.pdf` | 이름 없음 | 서빙 중 |
- **코드로 고칠 수 없는 건이다.** 법무 문서이고 원본이 `.docx`(개인정보 담당 보유)다. PDF 텍스트를 직접 손대면 서식·페이지네이션이 깨지고, ja는 `#page=4` 앵커가 第8条에 결합돼 있어 재생성 시 앵커도 다시 맞춰야 한다(그 앵커는 이제 `check-privacy-cookie.mjs`가 지킨다)
- **조치: 김진영님께 ja 처리방침 `Seokbeom Hong` → `Sukbum Hong` 정정 요청 필요.** 교체본 받으면 PDF 교체 + 앵커 재확인까지 이쪽에서 처리한다

#### main Key Numbers `99.70%` → `99.7%` (3개 로케일 동시)

- 원인은 번역이 아니라 **컴포넌트의 숫자 서식**이었다. `EfficiencySection`의 `{ target: 99.7, decimals: 2 }`가 `toFixed(2)`로 `99.70%`를 찍었다
- 그 `decimals: 2`에 달려 있던 주석이 `// 시트 표기가 99.70% (소수점 2자리) — main 22행`이었다. 즉 **스프레드시트가 소수점 자리를 자동으로 늘린 서식 artifact를 근거로 삼은 것**이다. 시트 실측: main 22행 ko·ja `99.70%` / en `99.7%` — 시트 안에서도 로케일마다 다르다
- `decimals: 1`로 정정. 숫자는 messages가 아니라 코드에 있어 **로케일 무관**이므로 한 곳 수정으로 ko·en·ja가 함께 고쳐진다

**구조** — 이 숫자는 대조 도구의 사정권 밖이었다
- `scripts/sync-messages.mjs`는 messages 키만 본다. Key Numbers 숫자는 코드에 있어 시트가 틀려도 코드가 틀려도 **아무것도 잡지 않는다**
- `components/sections/home/efficiencyStats.ts` 🆕 로 숫자를 떼어냈다(`EfficiencySection`은 async 서버 컴포넌트라 vitest에서 그대로 import하기 어렵다). 화면 표시 문자열을 테스트로 고정

#### aboutUs en 3건 — 시트 확정본 반영

| 키 | before | after | 근거 |
|---|---|---|---|
| `about.people.cards.1.title` | We hire people who don't shy away from hard problems | **We hire people who tackle hard problems** | 시트 aboutUs 35행 |
| `about.management.members.3.career.0` | Business Planning Group, ⏎ NICE Information Service | **Consultant, Deloitte** | 시트 aboutUs 30행 |
| `about.management.members.3.career.1` | Consultant, Deloitte | **Consultant, BCG** | 시트 aboutUs 31행 |
| `about.management.members.1.career.0` | Founded & exited a VC-backed startup (CEO) | **Founded & exited a startup (CEO)** | 시트 aboutUs 19행 |

**Deloitte 자리 정정** — 2026-09-01에 내가 잘못 넣었다.
- 지시는 "en `Consultant, BCG` → `Consultant, Deloitte`"였고 문자 그대로 **BCG 줄**에 넣었다. 그러나 시트는 **NICE평가정보 줄(30행)**을 Deloitte로 바꾸고 BCG 줄(31행)은 그대로 둔다
- 의도 확인(2026-09-02 사용자): "영어권 사용자들이 더 익숙할 만한 전 회사로 바꾼 것". BCG는 영어권에서 이미 유명해 바꿀 이유가 없고, NICE평가정보가 생소한 쪽이다 — 시트 배치가 맞다
- 결과: en은 `Consultant, Deloitte` + `Consultant, BCG` 2줄. **ko·ja는 그대로**(`전 나이스평가정보 사업기획단`·`전 BCG 컨설턴트`) — en만 영어권 인지도 기준으로 다르게 쓰는 **의도된 로케일 분기**다

**`VC-backed` 선언 철회** — 2026-08-31 결정을 뒤집는다.
- 그때는 시트가 `VC-backed`를 떨어뜨린 것을 과압축으로 보고 코드를 정답으로 선언했다(`sheet-decisions.json`). 이번 지시로 시트가 맞는 것이 확정돼 **선언을 삭제**했다 — 코드가 시트와 같아졌으므로 선언할 것이 없고, 남겨두면 `codeValue`가 어긋나 대조 도구가 실제 이격을 숨긴다
- 참고로 당시 근거였던 "ko 원문 `전 Funded 창업(CEO)&매각`의 'Funded'가 소실됐다"는 해석은 재검토가 필요해 보인다. ja가 `元Funded CEO（創業・Exit）`로 **Funded를 회사명(고유명사)으로** 다루고 있어, en의 `VC-backed`는 회사명을 형용사로 오역한 것일 가능성이 크다. 지금 en은 회사명을 아예 안 쓰는 시트 확정본이다

**결과:** 대조 리포트 버킷 A(문구 반영 검토 대상) **4건 → 1건**(남은 1건은 ja storeTypes 줄바꿈 ↔ `、` 차이)

#### product/vco ja 리뷰 카테고리 `給食` → `社員食堂` (시트 갱신 반영)

- 시트 실측으로 확인하고 반영했다: **product-vco 43행 ja가 `給食` → `社員食堂`으로 갱신**돼 있다. `products.visionCheckout.reviews.1.category`만 바뀐다
- 자리마다 다른 표기를 쓰는 것이 시트의 의도다(2026-08-31 일본팀 확인). 실측값:
  | 자리 | 시트 행 | ja |
  |---|---|---|
  | 리뷰 카테고리 `reviews.1.category` | product-vco 43 | `社員食堂` ← 이번 변경 |
  | 업종 라벨 `industries.1.label` | product-vco 39 | `社員食堂・学生食堂` |
  | 문의 관심분야 `contact…catering` | contactUs 14 | `社員食堂・学生食堂` |

**`sheet-decisions.json` 정리 — 선언 하나가 사실과 달랐다**
- `reviews.1.category`(ja) 선언의 `codeValue`가 `給食`이라 그대로 두면 대조 도구가 실제 이격을 숨긴다. `社員食堂` 기준으로 갱신
- `contact.interests.vco.options.catering`(ja) 선언의 사유가 **틀려 있었다** — "시트는 옛 값 `給食`"이라고 적혀 있었지만 실측하면 시트도 `社員食堂・学生食堂`으로 코드와 같다. 선언이 필요한 진짜 이유는 다른 것이었다: **ko 원문 `급식`이 시트 두 행에 중복돼 대조 도구의 ko 조인이 서로 엇갈린다**(이 키는 product-vco 43행에 붙고, 리뷰 카테고리는 contactUs 14행에 붙는다). 사유를 실측 기준으로 다시 씀
- 결과: 대조 도구의 `AMBIGUOUS`(ko 원문 중복매칭) 버킷이 **1건 → 0건**. DECIDED 30 → 31

**남긴 것** — 요청 범위 밖이라 손대지 않은 `給食` 2곳
- `reviews.1.store` = `大手給食会社 W社 ご担当者` — 시트 product-vco 46행과 **일치**한다
- `media.retailTechLetter.letterTitles.23` — 뉴스레터 발행 제목(Stibee 외부 콘텐츠)

#### 맞춤형 광고 설정 링크 — 모바일에서 빈 화면 (데스크톱만 동작)

QA 재지적("광고설정 링크 모바일일 때랑 데스크톱일 때랑 다르다")을 파고든 결과, 앞선 "코드 결함 아님" 판정은 **데스크톱 한정**이었다. 링크 자체는 두 환경이 동일한 마크업이고(footer desktop·compact 섹션 모두 `/privacy-cookie/{locale}.html`, `target=_blank`), 갈라지는 지점은 **도착지 페이지**였다.

**원인** — 중간 페이지가 `<embed type="application/pdf">` 하나에만 의존했다.
- HTML 표준상 embed/object의 PDF 표시 가능 여부는 UA 능력이고 `navigator.pdfViewerEnabled`가 그대로 드러낸다. **iOS의 모든 브라우저와 Chrome for Android는 이 값이 false**이고, 그때 embed는 아무것도 그리지 않는다
- 즉 데스크톱은 조항 페이지가 열리고 모바일은 **백지**였다. 데스크톱 크로미움만 보면 영원히 통과한다 (실제로 그렇게 통과해 왔다)

**수정** — 인라인 PDF에 대한 의존을 끊었다.
- 인라인 PDF 가능: 기존대로 `<embed ...#page=N>`로 조항 페이지 렌더 (데스크톱 동작 불변)
- 불가능: `location.replace`로 **PDF 원문 직행** — 백지 대신 문서를 준다. `replace`라 뒤로 가기에 중간 페이지가 끼지 않는다
- 판별이 틀렸거나 JS가 꺼진 경우: 상단 바의 '원문 PDF 열기' 링크가 **항상** 살아 있다. 탐지 실패가 막다른 길이 되지 않게 하는 것이 이 바의 존재 이유다
- 검증: 데스크톱 = en PDF 4쪽(⑤ opt out of personalized advertising) 착지 / `pdfViewerEnabled=false` 주입 = `…Privacy%20Policy_2026-1.pdf#page=4`로 리다이렉트 확인

**구조 정리** — 세 파일 손관리를 그만뒀다.
- `scripts/lib/privacyCookiePages.mjs` 🆕 — 로케일별 spec(PDF·페이지·제목·검증용 조항 문자열) **단일 출처** + 렌더러
- `scripts/gen-privacy-cookie.mjs` 🆕 — `public/privacy-cookie/{ko,en,ja}.html` 생성기. 기존 3파일은 "복붙하지 말 것" 주석에만 의존했고 실제로 ja 페이지 번호가 틀어진 적이 있다
- `scripts/check-privacy-cookie.mjs` 🆕 — **배포 게이트**(deploy.sh 편입). 산출물 `out/`에서 ① embed·폴백 링크·리다이렉트가 같은 PDF를 가리키는지 ② PDF 실물이 있는지 ③ **`pdftotext`로 해당 페이지에 조항 문자열이 실제로 있는지** 검사. ja `page`를 5로 바꿔 게이트가 2026-08-25 사고(第10条 오착지)를 그대로 잡는 것을 확인했다

#### 판정 정정: Privacy Policy ↔ Ad Preferences "동일 문서"는 의도된 설계가 맞다

- QA 신고 "두 링크의 문서가 같다"는 **의도된 설계**다. 2026-08-20 김진영(개인정보 담당)이 제시한 옵션2 중 **'개인정보 처리방침 2조 5항으로 이동'**을 채택한 결과이고, 나머지 갈래였던 'META 광고 환경설정 직링크'는 선택되지 않았다
- 앵커 동작은 dev 실배포본에서 실측 확인: ko `#page=3` / en `#page=4` / ja `#page=4` 모두 쿠키·맞춤형 광고 조항에 정확히 착지한다. 즉 링크가 깨진 것이 아니라 **같은 PDF의 다른 페이지**다
- 코드 변경 없음

### 🧪 Tests
- `i18n/privacyCookiePages.test.ts` 🆕 — 체크인된 3개 HTML이 생성기 출력과 일치하는지(드리프트 차단), 인라인 PDF 없이도 원문에 닿는 경로가 있는지, embed·폴백·리다이렉트가 같은 PDF를 가리키는지, PDF 경로가 URL 인코딩됐는지(CloudFront는 raw 공백 거부)
- `i18n/caseStudyLabels.test.ts` 🆕 — 3개 로케일 전 사례 카드에 대해 `brand`의 어느 줄도 `store`와 같지 않음을 강제(18케이스). 옛 값(`GS25 DX LAB\nGasan Smart Store`)을 되돌리면 즉시 실패하는 것을 확인했다
- `i18n/messageConsistency.test.ts` — `lineCountMayDiffer` 양방향화 + 예외 썩음 가드를 "어느 로케일에도 없는 키"로 완화

**검증:** vitest **281 PASS** / eslint 0 problems / `next build` 성공 / 배포 게이트 6종 통과 / 시트 대조 AMBIGUOUS 0건 · 버킷 A 1건 / dev 서버 렌더 실측(ja 3줄 span, `GS25 DX LAB / Gasan Smart Store`, `羅州 Tech Friendly / CU 安心スマート店`, `Consultant, Deloitte`, 정부 로고 5종, 광고설정 링크 데스크톱·모바일 양쪽)

---

## [Unreleased] - 2026-08-31 (3)

### 🛠 Fixed

#### QA 재신고 8건 처리 — 실배포본 대조 후 실이격 3건만 수정

QA가 올린 8건을 **dev 실배포본(`f1c8101`) HTML을 내려받아 전수 대조**했다. 5건은 이미 반영돼 있었고(재현 실패), 실제로 남아 있던 건 3건이다. "미반영"으로 보고된 항목을 코드만 보고 다시 고치면 오히려 이미 확정된 문구를 되돌린다.

**❶ 언어 스위처 라벨 — 국가코드가 언어코드 자리에 있었다 (`KO/EN/JP`·`KR/EN/JP` → `KO/EN/JA`)**
- 스위처가 **세 벌** 있었고 셋 다 자기 배열을 들고 있었다: 데스크톱 드롭다운(homepage) `KO/EN/JP`, 모바일 드로어(`@fai/ui`) `KR/EN/JP`, `NavigationBar` 폴백 `KO/EN/JA`. 한 곳만 고치면 나머지가 남는 구조라 실제로 과거에 `NavigationBar`만 고쳐진 채 방치돼 있었다
- `KR`·`JP`는 ISO 3166-1 **국가코드**다. 라우팅 locale·메시지 파일·`<html lang>`이 전부 ISO 639-1 언어코드(`ko`/`en`/`ja`)이므로 라벨도 언어코드로 통일한다
- 잠재 결함: `NavigationBar`의 폴백 스위처가 **라벨을 소문자로 내려 `document.documentElement.lang`을 채우고** 있었다. 라벨이 `KR`/`JP`였다면 `lang="kr"`·`lang="jp"` — BCP-47상 무효한 서브태그가 조용히 박힌다. 라벨이 아니라 **코드**를 쓰도록 정정
- `packages/ui/components/navigation/locales.ts` 🆕 — `LOCALE_OPTIONS` 단일 출처. 세 컴포넌트가 전부 여기를 본다
- 디자인 문서도 함께 정정: `root/components/web/layout/navigation-bar.md`(언어선택 `JP`→`JA`), `root/foundation/docs/typography-w.md`(`JP`→`JA`)

**❷ 무인매장 3열 카드 세로 정렬 어긋남 — 문구 길이에 결합된 인덱스 특례**
- `StoreEffects`의 첫 카드 제목만 `items-center` + 음수 좌우 마진 특례를 받고 있었다. en 문구가 `Save on / Operating Costs` **2줄**이던 시절, 2줄 높이 박스 안에서는 center와 start가 같아 티가 안 났다
- 시트 갱신(`5301cd9`)이 문구를 `Save on Costs` **1줄**로 줄이자 첫 카드 제목만 세로 가운데로 내려와 2·3번과 어긋났다. 문구를 고친 쪽은 레이아웃 특례의 존재를 알 수 없다
- 인덱스 특례를 제거하고 세 카드 모두 상단 정렬 + `whitespace-pre-line`으로 통일

**❸ `/about` 왕민권 이력 — 한 줄 압축 과정에서 `VC-backed`가 소실**
- 2026-08-31 시트 갱신분이 `Founded & exited a / VC-backed startup (CEO)` 2줄을 `Founded & exited a startup (CEO)`로 바꿨다. 줄바꿈만 없애면 되는데 **`VC-backed`까지 떨어졌다** — ko 원문 `전 Funded 창업(CEO)&매각`의 'Funded'가 사라진 셈
- `Founded & exited a VC-backed startup (CEO)` 한 줄로 정정 + `sheet-decisions.json`에 선언(시트 재제안 차단)

**재현 실패(이미 반영됨) 5건** — dev 실배포본에서 확인
- 컨택트 폼 동의문구·`Ad Preferences` 링크 정상 / 푸터 로고·사명 간격 정상(HOM-94 게이트가 지키는 중)
- `/products/unmanned-store` en 히어로 `WALK-THROUGH` · 첫 카드 `Save on Costs` 반영됨 (ko·ja 히어로가 `What is WALK-THROUGH?`인 것은 시트 지정값이라 의도된 차이)
- STANDARD/MICRO STORE 카피는 `5301cd9`에서 `Tailor to your layout` → `Tailored to your layout`로 이미 갱신 — QA가 본 화면이 그 직전 배포본이었다. storeTypes 재정렬 반영건과 **동일 건 맞다**
- Efficiency 통계 ko·ja `(VCO 도입 전후 비교)` 괄호 **중복 아님** — 실배포본 DOM에서 1회만 렌더

### 🧪 Tests
- `components/layout/LanguageSwitcher.locales.test.tsx` 🆕 — 단일 출처 값 + 데스크톱·모바일 두 스위처의 **실제 렌더 결과**를 함께 강제. 상수만 검사하면 한쪽 컴포넌트가 자기 배열로 되돌아가는 걸 못 잡는다
- `components/sections/products/StoreEffects.test.tsx` 🆕 — 세 카드 제목의 클래스 동일성·인라인 style 부재·음수 마진 부재. 문구가 몇 줄이 되든 인덱스 특례가 다시 들어오면 실패한다

**검증:** vitest **247 PASS** / lint 0 problems / 게이트 4종 통과 / 빌드 산출물에서 `KO·EN·JA`, h3 클래스 3개 동일, `VC-backed` 직접 확인

---

## [Unreleased] - 2026-08-31 (2)

### 🛠 Fixed

#### 번역 시트 전수 대조 — 34건 반영 (HOM-75, products/homepage)

일본 BD가 "product/unmannedStore 페이지는 수정 내용이 전부 반영되어 있지 않다"고 지적했는데, 대조 도구는 **CONTENT 0 / AMBIGUOUS 0**을 보고하고 있었다.

**도구가 못 본 이유 — ko 조인 맹점**
- 도구는 ko 원문을 조인 키로 쓴다 → **ko가 수정된 행은 영원히 대조되지 않고, 그 행의 en·ja 이격까지 함께 사라진다**
- "ko 미매칭 80건"으로 뭉뚱그려 보고될 뿐이었고 그 안에 실이격이 묻혀 있었다 (product-store 한 탭에서만 23행)
- `sheetDiff.mjs`에 **ja·en 역매칭** 추가 — ko 조인 실패 시 ja·en 값으로 키를 역추적(ja·en은 ko보다 덜 바뀌므로 앵커가 된다)
- 결과: 미매칭 80 → 68, 숨어 있던 CONTENT 2 · AMBIGUOUS 4 · WHITESPACE 2가 즉시 드러남

**리뷰 인용문이 en·ja에서 두 번 렌더되고 있었다** (가장 심각)
- 인용문은 강조를 위해 `quote.0/1/2` 조각으로 나뉘어 이어붙는 구조인데, 8/25 반영 때 시트의 **완결된 한 문장**을 조각 구조를 무시하고 `quote.2`에 통째로 넣었다
- 앞 조각(구버전 번역)이 남아 화면에 문장이 두 번 나갔다. ko만 정상, **en·ja 6개 리뷰 전부** 이 상태
- 시트 전문을 조각으로 다시 나누고 **이어붙인 결과가 시트 전문과 정확히 같은지 검증**한 뒤 반영

**케이스 스터디 날짜가 번역되지 않고 있었다**
- `date`가 `site.ts` 값 그대로 흘러 전 로케일에 한국식 `'23.10` 노출. 시트 en은 `Oct '23`
- messages로 이관 + `page.tsx`에 `t()` 배선 (6건 × 3로케일)

**그 외 반영**
- product-store 22건 — ko 오타(`결제까기`→`결제까지`) / en 문구 6건 / ja 줄바꿈·문구 11건 / storeTypes subtitle·description en·ja 재정렬
- vco ko 2건 / main efficiency 라벨 ko·ja 괄호 부연 누락 / `about.people.title` ko(People→Team) / `contact.meta.description` ja / whyFai en / benefits ja 줄바꿈 / industries en(`Bakery&Cafe`→`Bakery & Cafe`)

### ➕ Added

- `i18n/reviewQuotes.test.ts` 🆕 — 인용문 조각을 이어붙였을 때 문장이 두 번 들어가지 않는지, 인용부호가 열고 닫히는지 검사
  - **개수 기반 판정**이라 `"` 처럼 여닫이가 같은 문자도 오탐 없이 잡는다(정상 2개 / 중복 4개)
  - 키 단위 대조로는 각 조각이 "시트 어딘가와 비슷"해 절대 드러나지 않는 종류다

### 🧪 Tests
- `sheetDiff.test.mjs` — "ko 매칭 실패 시 diff 없음"을 기대하던 테스트를 **역매칭으로 이격을 찾아낸다**로 갱신. 예전 동작이 곧 이번 사고의 원인이었다
- `sheet-decisions.json` — Case Studies eyebrow(영문 고정) 오탐 2건 선언

**검증:** vitest **233 PASS** / lint 0 problems / 게이트 4종 통과 / 재대조 CONTENT·AMBIGUOUS·WHITESPACE **전부 0**
실브라우저 전수 확인(탭·캐러셀 순차 클릭으로 숨은 콘텐츠까지) — 신규 문구 31건 + 케이스 스터디 21건 노출, **구값 잔존 0건**. dev `f1305d3` 실배포본에서도 재확인

---

## [Unreleased] - 2026-08-31

### 🛠 Fixed

#### JP-BD 요청 반영 (HOM-101, Critical — packages/ui + products/homepage)

**❶ 개인정보 처리방침 노출 — 로케일별 분기** (2026-08-28 김진영 확정)
- ko는 개정 안내 모달 유지 / en·ja는 모달 없이 **로케일 문서로 직행**
  - 이전 규칙(8/25)은 "개정 안내는 한국어로만"이라 en·ja에도 **읽을 수 없는 한국어 모달**이 떴다
  - 개정 고지는 한국 개인정보보호법상 의무이고 en·ja는 대상이 아니다. 번역본을 만들지 않는 원칙은 유지
- `@fai/ui`의 `POLICY_HREFS.privacy` 하드코딩 폴백 **제거** — 구버전 **한국어** PDF였다. 모달만 끄면 여기로 떨어져 일본·영어 사용자에게 한국어 문서가 열린다(Hyeyoung Shin 지적 사항이 정확히 이것). 미주입이면 링크를 아예 렌더하지 않는다
- `#page=N` 미지정 — 처리방침은 1페이지부터. 조항 점프는 '맞춤형 광고 설정' 전용
- ⚠️ **`encodeURI` 필수** — en 파일명에 공백이 있다. 로컬 정적 서버는 raw 공백도 200을 주지만 CloudFront는 거부한다(실측: 공백 HTTP 000 / `%20` HTTP 200). **로컬·테스트만 보면 통과하고 배포에서만 깨지는 종류**

**❷ footer 일본법인 정보** (2026-08-28 Hyeyoung Shin 요청)
- `日本法人` 라벨 제거 / 법인명 볼드 / 소재지 추가 / ja 메일 행 미노출
- '법인'을 1급 개념(`FooterEntity`)으로 승격 — 본사와 **동일한 블록 구조**(볼드 법인명 헤더 + 하위 행)로 렌더. 기존 `extraInfo`는 평평한 한 행이라 위계가 달랐다
- 법인명 헤더 클래스를 상수로 공유 — 문자열 복사로 맞추면 한쪽만 바뀌어 어긋난다

**❷-후속 ja 메시지 번들에서 메일 주소 제거**
- dev 배포본 `/ja/` **소스**에 `contact_jp@fainders.ai`가 남아 있었다. 렌더된 footer에는 없지만 next-intl이 메시지 번들을 HTML script 페이로드로 직렬화한다
- 스팸 크롤러는 렌더 결과가 아니라 소스를 긁는다 — 번들에서 제거
- `FooterBridge`는 `showEmail`일 때만 `t()` 호출. 미노출 로케일에서 호출하면 MISSING_MESSAGE가 나는데 **그게 의도** — 결정이 깨지면 드러난다

### ✅ Verified

- **HOM-88** StoreEffects 3열 카드 정렬 — 1920/1440에서 h3 높이 78px 균일, 하단 편차 **0**. 1280 이하도 균일
  - 8/28 시점에는 **실제로 작동하지 않고 있었다** — `desktop:h-[4.875rem]`이 클래스 뒤 공백 없는 `${...}` 보간에 걸려 유실. HOM-100과 동일 원인이며 `1b3feb2`에서 함께 정정됐다

### 🧪 Tests
- 기존 테스트 3건은 **삭제가 아니라 갱신** — 요구사항이 바뀐 것이지 회귀 방어가 불필요해진 게 아니다. 이전 규칙·변경 근거·이유를 각 주석에 남겼다
  - `ja 이메일은 일본팀 주소를 쓴다` → `이메일은 ko·en만 노출하고 ja에서는 감춘다`
  - `en·ja로 전환해도 개정 안내는 한국어로만` → `en·ja에는 개정 안내를 아예 띄우지 않는다`
  - `locale-policy.test.ts`의 `ja.showEmail` 기대값
- `messageConsistency.test.ts` — 키 집합 정합성 가드를 무력화하지 않고 ja 의도적 제거 키를 근거와 함께 명시 선언. 선언이 썩는 것(ko에서 키가 사라졌는데 예외만 남는 것)도 함께 막는다
- 신규: 처리방침 링크 URL 인코딩 / `#page` 미지정 / 법인 블록 렌더 / 메시지 번들 누출

**검증:** vitest **225 PASS** / lint 0 problems / 배포 게이트 4종 통과 / dev `88c08e0` 실측 확인

---

## [Unreleased] - 2026-08-28 (3)

### 🛠 Fixed

#### footer 배경색 유실 (HOM-100, Critical — packages/ui + products/homepage)
- 원인은 CSS도 토큰도 아니라 **Tailwind 클래스 추출 실패**였다. 클래스 문자 바로 뒤에 공백 없이 `${...}` 보간이 붙으면 추출기가 보는 토큰이 잘려 **유틸리티가 생성되지 않는다** — 클래스는 HTML에 붙어 있고 CSS 규칙만 없으므로 스타일이 조용히 사라진다
- 같은 패턴 6곳을 전수 정정. 그중 **2곳이 실제 유실 상태**였다
  - `packages/ui .../Footer.tsx:274` — footer 배경 (HOM-100)
  - `.../StoreEffects.tsx:107` — desktop 높이(1440px↑). PR #11의 3열 카드 제목 높이 통일이 **1440px 이상에서 작동하지 않고 있었다**
  - 나머지 4곳(Footer:171 / CtaBanner:61 / StoreTypes:77 / ProductFeatures:152)은 같은 클래스를 다른 파일에서도 써서 우연히 살아 있었다 — 그 사용처가 사라지면 똑같이 터진다
- 검증: footer computed background `rgb(245,245,245)` (= `#F5F5F5`, 카드 기대값) / dev 실배포 CSS에 `.bg-bg-200{background-color:var(--color-bg-200)}` 존재 확인

#### Tailwind 스캔 범위 — 주석 속 클래스가 프로덕션 CSS로 새던 문제
- **게이트가 자기 주석 때문에 스스로 무력화됐다.** 배경색 게이트를 넣고 사고 형태로 되돌려 테스트했는데 통과했다 — 그 게이트 스크립트 주석에 적은 클래스명이 CSS로 유입돼 "유실이 없는 것처럼" 만들었다
- v4의 자동 소스 감지는 `.gitignore` 밖 모든 파일을 훑는다. `tailwind.config.ts`의 negation 패턴은 **v4에서 적용되지 않으며**, 그 사실이 주석과 어긋난 채 방치돼 있었다 (테스트 파일 카나리 클래스로 실증)
- `globals.css`에서 `@import "tailwindcss" source(none)` + `@source` 화이트리스트로 범위 고정
  - `@source not "..."`은 postcss 8.4.31이 prelude를 파싱하지 못해 빌드가 깨진다(`CssSyntaxError: Unknown word`)
  - CSS 주석 안에 glob(별표 두 개 + 슬래시 + 별표)을 쓰면 `*/`가 포함돼 주석이 조기 종료된다 — 한 번 밟았다
- 과다 배제 검증: 소스의 단순 클래스 **275개 전수 대조 → 누락 0건** (오탐 4건은 템플릿 변수명 파편 3 + Tailwind marker `peer` 1)

### ➕ Added

#### 재발 방지 가드 (products/homepage)
- `app/tailwindExtraction.test.ts` 🆕 — 클래스 뒤 공백 없는 `${...}` 보간 금지. 유실 여부와 무관하게 **패턴 자체**를 막는다(산출 CSS 사후 대조는 variant 이스케이프로 오탐이 많다)
  - ⚠️ 이 파일에는 실제 클래스명을 쓰지 않았다 — 테스트 파일도 스캔 대상이라 여기 적은 클래스가 지키려는 회귀를 되살린다(실제로 한 번 밟았다)
- `check-footer-layout.mjs` 불변식 ④ — footer **computed** backgroundColor가 투명이면 배포 중단
- 두 가드 모두 사고 형태로 되돌려 실제 실패 확인 (정적 가드는 `Footer.tsx:274`를 정확히 지목 / 게이트는 9개 조합 전부 `rgba(0,0,0,0)`로 exit=1)

### ✅ Verified (QA 카드 실측 검증)
- **HOM-102** 개처방 모달 반응형 — 768/430/390/360px 전부 여백 24px · 버튼 화면 내
- **HOM-103** ShowcaseSection 썸네일 — 1920→1000px에서 비율 **1.292 일정** 유지 (768px 이하 모바일 레이아웃 전환)
- **HOM-99** about 라벨 정렬 — 7폭 × 3로케일 우측 여백 편차 **0px**

---

## [Unreleased] - 2026-08-28 (2)

### 🛠 Fixed

#### 루트 산출물 유실 — Meta 도메인 인증·언어 감지 (products/homepage)
- `app/page.tsx`(useEffect → /ko 리다이렉트) 제거. 정적 export에서 **Next 라우트가 `public/index.html`을 덮어쓴다** (주석의 서술과 반대)
- 실측: `out/index.html` 5,456 bytes(Next 빈 페이지) → `facebook-domain-verification`·`navigator.language` 둘 다 소실. 제거 후 1,905 bytes로 복구
- 영향: iOS 전환 광고 성과 누락(2026-08-05 김진영 요청 항목) / en·ja 방문자 전원 `/ko` 강제 / 크롤러가 루트에서 읽을 내용 없음

#### AboutPeople 라벨 위치 편차 (HOM-99 재발, products/homepage)
- PR #11이 라벨을 `<p>` 인라인으로 합치며 우측 정렬이 빠져 ja@1440 편차 **227px**로 회귀 (379/408/534/307)
- `justify-between` + `shrink-0`으로 우측 정렬 복구 → 7폭 × 3로케일 편차 **0px**
- `ㅣ` 간격 통일(PR #11 의도)과 위치 고정은 한 줄에서 양립 불가 — 라벨을 다음 줄로 내리는 대안을 코드 주석에 남김(디자인 판단 대기)

#### ESLint가 실행조차 되지 않던 상태 (products/homepage)
- `pnpm lint`가 `TypeError: Converting circular structure to JSON`으로 실패 → **"커밋 전 lint 통과" 규칙이 조용히 무력화**돼 있었다
- 원인: eslint-config-next 16은 flat config를 직접 export하는데 구식 `FlatCompat`으로 extends 해 configs가 자기참조
- 복구 후 드러난 9 errors / 4 warnings 전부 정리 → **0 problems**
  - `ShowcaseSection`: `YoutubeThumb` 리셋 effect 제거 → `key={videoId}` 재마운트 리셋 / `startSlide` 선언 순서 정정
  - `StoreCaseStudies`: `useEffect(() => setActive(0), [cases])` → 렌더 중 클램프. `cases`는 참조 비교라 부모가 매 렌더 새 배열을 주면 **매 렌더 선택 초기화**되는 잠재 버그였다
  - `StoreEffects`: 삼항 문장 → if/else / `AnimatedStat`·`RetailTechLetterSection`: 근거 주석 + 국소 disable
  - `scripts/**/*.js`(Node CJS)·테스트 파일(next/image mock) config 예외

#### 번역 시트 정합 2건 (HOM-75, products/homepage)
- `effectCards.0.title` en 줄바꿈: 레이아웃 목적이므로 `i18n/sheet-decisions.json`에 선언(시트 수정 아님)
- `about.people.cards.1.title` ko: `…사람들과 함께` → `…사람들과 함께해요` (시트 기준)
- 대조 도구가 **ko를 조인 키로 쓰므로** ko가 어긋난 행은 en/ja 불일치도 함께 못 본다 — PR #11이 en을 고치며 드러났다

### ➕ Added

#### 배포 게이트 2종 신설 (products/homepage) — 총 4종
- `scripts/check-root-html.mjs` — **산출물** `out/index.html`의 Meta 인증·언어 감지 존재 + 루트 점유 라우트 부재
  - 기존 `tests/landingTags.test.ts`는 `public/index.html`(소스)만 읽어 vitest 212개가 통과한 채 회귀했다. 검사 대상이 한 단계 앞이었다
  - 정적 테스트("루트 라우트 점유 금지")도 함께 추가해 빌드 전 조기 실패
- `scripts/check-about-layout.mjs` — 라벨 우측 정렬 편차 ≤1px / 카드 화면 이탈 금지(HOM-98) / 이미지 비율 9:5
  - 좌측 x가 아니라 **우측 여백**으로 측정 — 라벨 텍스트 길이가 사람마다 달라 우측 정렬이 맞아도 좌측 x는 다르다
  - 7폭 × 3로케일 21개 조합. PR #11 상태로 되돌리면 21개 전부 실패함을 확인
- 두 게이트 모두 주입 손상으로 실제 실패하는지 검증 후 `deploy.sh` 배선

### 🔄 Changed

#### 배포 게이트 공용 인프라 추출 (products/homepage)
- `scripts/lib/staticPreview.mjs` 신설 — `withPreview()` / `measurePage()`
- 기존 두 게이트에 MIME 표·`resolveFile`·`startServer`·`findChrome`이 글자 단위로 중복돼 있었다. 세 번째 추가 시점에 3중복이 되므로 추출
- 서빙 규칙(trailingSlash 해석 등)이 게이트마다 갈라지면 "게이트는 통과하는데 배포물은 다르다"가 발생한다 — 한 곳에만 둔다
- 이관 전후 출력 동일 확인: 오버플로우 3×7 / footer 3×3

---

## [Unreleased] - 2026-08-28

### 🔄 Changed

#### AboutPeople 라벨 인라인 정렬 (products/homepage)
- 이름·직책·라벨을 별도 flex row 대신 `<p>` 인라인으로 통합 — `ㅣ` 구분선 간격 완전 일치
- 라벨 `<span>`: `inline-flex items-center bg-mint-400 px-s text-body-xs font-medium`

#### ShowcaseSection 데스크탑 썸네일 반응형 대응 (products/homepage)
- 고정값 `w-[672px] h-[520px] aspect-auto` → `w-[min(672px,58.95%)] aspect-[672/520]` 비율 유지 반응형으로 교체
- 모바일 고정 높이(`max-[768px]:h-[335px] aspect-auto`) 제거 → `aspect-[960/472]`로 통일

#### StoreEffects 첫 번째 카드 타이틀 2줄 처리 및 전체 높이 정렬 (products/homepage)
- 첫 번째 카드 h3에 음수 마진(`-mx-xl desktop-s:-mx-4xl`) 적용 — 카드 패딩 영역까지 타이틀 너비 확장
- `\n` + `style={{ whiteSpace: 'pre-wrap' }}`으로 "Save on / Operating Costs" 줄바꿈 위치 고정
- 전체 h3 고정 높이를 3×line-height → **2×line-height** 기준으로 하향 조정
  - base `4.5rem` → `3rem` / tablet `5.625rem` → `3.75rem` / desktop-s `6.75rem` → `4.5rem` / desktop `7.3125rem` → `4.875rem`
- 2·3번 카드 h3: `items-center` → `items-start` 상단 정렬 변경

#### en.json 문구 수정 (products/homepage)
- StoreEffects 첫 번째 카드 타이틀: `"Save on Operating Costs"` → `"Save on\nOperating Costs"`
- AboutPeople 두 번째 카드 타이틀: `"We work with people who run toward hard problems, not away from them"` → `"We focus on hiring people who do not shy away from hard problems"`

---

## [Unreleased] - 2026-08-27

### 🔄 Changed

#### Footer 반응형 브레이크포인트 개선 — EN·JA wideCompact 지원 (packages/ui + products/homepage)

**Footer.tsx (packages/ui)**
- `wideCompact?: boolean` prop 추가 → `fai-footer--wide` CSS 클래스 조건부 적용
- 로고 영역: `gap-6` → `gap-xl`, `fai-footer__logo-area` BEM 클래스 + `paddingRight: var(--spacing-5XL, 80px)` style 적용
- 컨텐츠 영역: `fai-footer__contents` / `fai-footer__contents-inner` BEM 클래스로 gap(48px, named token 없음) CSS 파일 관리
- Compact 로고: `fai-footer__logo shrink-0` 추가 — SNS 버튼에 밀려 축소되지 않도록 고정
- Compact 간격: `pt-[var(--padding-ml,18px)] gap-[var(--spacing-3XL,40px)]` → `pt-ml gap-3xl` named token 적용
- Compact info/policies gap: `gap-[var(--spacing-MS,12px)]` → `gap-ms` named token 적용
- 스크롤 버튼 위치: `bottom-[var(--size-56)] right-[var(--size-56)]` → `bottom-4xl right-4xl` named token 적용
- 전화번호 `noWrapValue: true` 추가 (HOM-94) — ja에서 `+82-2-6191-` / `0049` 로 끊기는 현상 방지

**footer.css (packages/ui)**
- KO 브레이크포인트: `960px` → `1280px` 상향 (아코디언 포함 콘텐츠 기준)
- EN·JA 브레이크포인트: `≤1100px` compact 전환 / `≥1101px` desktop 복원 미디어쿼리 추가 (`.fai-footer--wide` 조건)
- BEM 규칙 추가: `.fai-footer__logo-area` (padding-right 80px + flex-shrink:0) · `.fai-footer__contents` (gap 48px) · `.fai-footer__contents-inner` (gap 48px) · `.fai-footer__logo` (flex-shrink:0)

**FooterBridge.tsx (products/homepage)**
- `wideCompact={locale !== 'ko'}` prop 연결 — KO만 1280px, EN·JA는 1100px에서 compact 전환

**globals.css (products/homepage)**
- Turbopack 심링크 핫리로드 미감지 회피 목적으로 Footer 반응형 CSS 섹션 추가
- BEM 규칙 포함: `fai-footer__logo-area` · `fai-footer__contents` · `fai-footer__contents-inner` · `fai-footer__logo`

#### CtaBanner JA 420px 이하 폰트 보정 (products/homepage)
- `useLocale()` 추가, `locale === 'ja'` 조건으로 h2에 `max-[419px]:text-body-xl` 적용
- JA 타이틀이 420px 이하에서 `text-title-s`를 유지할 경우 버튼과 겹치는 문제 해소

---

## [Unreleased] - 2026-08-25 (PR#10 develop 머지 + 후속 정정)

develop `0b62b9a` / dev 프리뷰 배포 완료 / `pnpm test` 209 PASS.
PR#10(`feat/v3-sync-0820-0825`)을 develop에 머지하고, 리뷰에서 나온 결함을 정정했다.

### 🐛 Fixed

#### 개정 안내 모달 시행일 오류 (HOM-66) — `440b2c8`
모달 문구가 8/6 초안값을 담고 있어 **법정 고지 오류** 상태였다. 공식 PDF 실물과 대조해 정정.
- 시행일자 `2026년 8월 12일` → **`2026년 8월 28일`**
- PDF 링크 라벨 `(2026. 8. 13. 시행)` → `(2026. 8. 28. 시행)`
  ※ 같은 본문 안에서 "12일 시행"과 "8.13. 시행"이 어긋나 있었다(시트 원문의 모순 — 시트도 정정 필요)
- 공고일 `2026년 8월 6일` → **`2026년 8월 21일`** (사전고지 7일 요건에 맞춘 간격)
- 문의 메일 `sbhong@fainders.ai` → `contact@fainders.ai` (PDF에는 이미 반영됐던 값)
- 회귀 가드 4종 추가(`FooterBridge.test.tsx`) — 날짜·연락처·ko-only 노출 고정

#### ja 개인정보처리방침 PDF가 수정 전 버전 (HOM-91) — `02a617d`
- 연락처 `+82-2-6191-0049` → `03-6821-7191` (사업자정보는 일본법인인데 연락처만 한국 번호였다)
- 이메일 `contact@fainders.ai` → `contact_jp@fainders.ai`
- 일본어 한자 깨짐 → Noto Sans JP 계열
- 변환: docx → pandoc HTML → headless Chrome print-to-PDF.
  xelatex 경로는 폐기 — `contact_jp`의 `_`가 결합문자 U+0332로 깨지고 표 행 구조가 붕괴했다.

#### 동의 문구 법 요건 미충족 (HOM-78) — `a0509a5`
- **거부권·불이익 고지 신설**(`contact.form.privacyInfo.refusal`, ko/en/ja).
  법 제15조 제2항 제4호 — 목적·항목·보유기간 3요소만으로는 요건 미충족(2026-08-06 검토 지적)
- 문구를 번역 시트 확정본(`contactUs` CU01 27·28행, 8/25 14:29 확정)으로 교체
- 회귀 테스트 3종 — 동의 미체크 시 전송 차단 / 4요소 화면 표시 / fillRequired 동의 포함
  ※ PR#10이 필수 체크박스를 추가하면서 기존 제출 테스트를 갱신하지 않아 깨져 있었다

#### footer cctv 키 잠복 회귀 (HOM-61) — `a0509a5`
`POLICY_HREFS.cctv = '/document/cctv-policy.pdf'` 폴백이 남아 있어, `cookieHref` 미주입 시
**HOM-61에서 제거한 영상정보처리기기 방침 링크가 되살아났다**(파일이 아직 존재해 404도 아니다).
- `footer.policies.cctv` → `footer.policies.adSettings` (ko/en/ja + `FooterLabels` + `FooterBridge`)
- `POLICY_HREFS.cctv` 상수 삭제. `cookieHref`가 없으면 폴백이 아니라 **행 자체를 렌더하지 않는다**

### 🔄 Changed

#### 시트 정합 en 2건 (HOM-75) — `a0509a5`
- `footer.policies.adSettings` `Personalized Ad Settings` → `Ad Preferences`
- `products.unmannedStore.effectCards.1.title` `AI Auto Checkout` → `AI Checkout`
- 시트 대조 CONTENT 26 → 24건

#### 개정 안내 en/ja 본문 제거 (HOM-66) — `440b2c8`
`modalConfig = MODAL_CONFIG.ko`로 이미 항상 한국어만 노출해 en/ja 76행은 도달 불가능한 죽은 코드였다.
근거: 2026-08-25 김진영(개인정보 담당) "개정 안내는 한국어로만 진행해주시면 됩니다".
처리방침 PDF 자체는 ko/en/ja 3종 유지 — 고지문만 한국어다.

#### 머지 충돌 해소 2건 — `cc90e79`
PR#10 base(`79b544f`)가 HOM-75 번역 반영분보다 앞서 갈라져 같은 키를 양쪽에서 건드렸다.
- en `effectCards.1.title`: 8/24 시트 기준인 PR#10 채택
- ja `effectCards.1`: title은 PR#10, description은 develop(HOM-75 승인 줄바꿈)을 결합

---

## [Unreleased] - 2026-08-25 (v3 sync: 8/20~8/24)

### 🔄 Changed

#### HOM-73 ImageSection 스크롤 안 넘어감 버그 수정 (products/homepage)
- `page.tsx` `ImageSection`에 `pinDuration="70vh"` 추가
- `HeroSection.tsx` lenis snap `distanceThreshold: "30%" → "10%"` + 섹션 높이 `h-[180vh] → h-[125vh]`

#### HOM-71 EfficiencySection JA 언어 전환 시 정렬 수정 (products/homepage)
- stat 너비 고정(`laptop:w-[326px]`, `desktop:w-[361px]`) + `justify-between`
- `desktop-s`(961px~1279px) 세로 배치 + `laptop`(1280px+) 가로 배치, bar `flex-1`

#### HOM-85 RetailTechLetterSection ISSUE NO 라벨 제거 (products/homepage)
- 항목별 ISSUE NO. 라벨·번호 제거, `Label` import 정리

#### ProductIndustries 768px 이하 카드 간격 수정 (products/homepage)
- `gap-m` → `gap-5xl`(80px)

#### HeroSection 반응형 비디오 박스·타이틀 개선 (products/homepage)
- 1440px+ `min(480px)`, 1600px+ `min(568px)·466px·font-display-l`

#### WhyFaiSection 1600px+ 카드 높이 조정 (products/homepage)
- `min-[1600px]:h-[480px]` 추가

#### ContactUsSection 개인정보 동의 폼 개선 (products/homepage)
- `Checkbox` 컴포넌트로 교체 + `privacyInfo` 목적·항목·보유기간 테이블 추가

#### StoreEffects 그래픽·텍스트 수정 (packages/ui + products/homepage)
- `EffectGraphic.tsx`: `payment-2.svg` → `payment-3.svg`, `remote.svg` → `remote-2.svg`
- SVG 자산 추가: `root/assets/graphics/payment-3.svg`, `remote-2.svg`
- 결제 카드 타이틀: `'결제 무인화'` → `'AI 자동 결제'`

#### Footer 전면 개선 (packages/ui + products/homepage)
- `footer.css` 데스크톱 `padding-inline: var(--padding-8XL)` CSS 이관 (Tailwind arbitrary 불안정 해소)
- `InfoRow` whitespace-nowrap 조건부, contentsArea `min-w-0`, row2Info `w-max`, gap 토큰 정비
- 1440px+ 폰트 위계 상향, InfoRow gap 120px, SNS 아이콘 1600px+ M 사이즈
- `cookieHref` prop 추가, flatMap key index 기반으로 JA 중복 key 해소
- `PrivacyRevisionModal` 컴포넌트 추가 (packages/ui), index.ts export 등록
- `FooterBridge.tsx`: MODAL_CONFIG KO·EN·JA 개정 안내 모달, `policies.cctv` 연결, privacy-cookie URL 주입

#### privacy-cookie 중간 HTML + 개인정보 PDF 추가 (products/homepage)
- `public/privacy-cookie/ko·en·ja.html`: embed #page 방식으로 Chrome PDF 버그 우회
- `public/contact-us/` KO·EN·JA 2026-1·2023 버전 PDF 추가

#### i18n ko·en·ja.json 갱신 (products/homepage)
- `footer.policies.cctv` 번역 키 추가 (ko: "맞춤형 광고 설정" / en: "Personalized Ad Settings" / ja: "パーソナライズ広告の設定")
- `effectCards[1].title` 갱신 (ko: "AI 자동 결제" / en: "AI Auto Checkout" / ja: "AI自動決済")
- `contactUs.privacyNotice` 텍스트 개편 + `privacyInfo` 목적·항목·보유기간 키 추가
- `en.json` AboutManagement CEO·CTO·CSO 학력·경력 줄바꿈 처리

#### ShowcaseSection 유튜브 썸네일 UI 개선 + Shorts 영상 제거 (products/homepage)
- 썸네일 영역 데스크톱 고정 `w-[672px] h-[520px] flex-none` 적용
- 썸네일 표시 방식 `object-cover` → `object-contain` + `bg-black` 레터박스
- 썸네일 wrapper 좌우 2px 클리핑: `inset-0` → `inset-y-0 -left-[2px] -right-[2px]`
- `youtube-curation.json` exclude에 Shorts 영상 7개 추가
- `youtube-showcase.json` Shorts 7개 제거 (21개 → 14개)

---

## [Unreleased] - 2026-07-15

### 🔄 Changed

#### StoreEffects 그래픽 언어 전환 누락 수정 + 카드 높이 통일 + JA 타이틀 수정 (products/homepage)
- `card.title`(번역 텍스트) → `card.icon`(로케일 독립 키)으로 `EffectGraphic` 키 참조 변경 — EN/JA 전환 시 그래픽 누락 해소
- `siteConfig` effectCards `icon` 값 `MISSING_FROM_DESIGN` → `EffectIconKey` 실제 값으로 수정
- 카드 컨테이너 `items-start` → `items-stretch` — 언어별 텍스트 길이 차이에 따른 높이 통일
- `ja.json`: `遠隔運営が可能` → `遠隔運営可能` 텍스트 수정

#### CustomersSection 420px 이하 버튼 텍스트 숨김 + 타이틀-버튼 중앙 정렬 (products/homepage)
- 420px 이하에서 '실제 도입 후기 더보기' 텍스트 숨김, 아이콘만 노출 (`max-[421px]:hidden`)
- 타이틀-버튼 수직 정렬 `items-end` → `items-center`

#### Footer JA locale 이메일 문의 행 숨김 + 타이틀-본문 간격 토큰 수정 (packages/ui, products/homepage)
- `Footer`: `hideEmail` prop 추가 — JA locale에서 이메일 문의 행 미노출
- `FooterBridge`: `useLocale()` 기반으로 `hideEmail={locale === 'ja'}` 주입
- `InfoRow` 및 compact 섹션 타이틀-본문 간격 `--spacing-2XL` (32px, `gap-x-2xl`) 적용

#### SmoothScroll 언어 전환 스크롤 복원 flash·상단고정 완전 수정 (products/homepage)
- `useLayoutEffect([pathname, locale])` 추가 — paint 이전 동기 복원으로 KO 전환 깜빡임 해소, rAF 재시도로 RSC 스트리밍 지연 로드 대응
- URL 기반 플래그(`localeHandledUrlRef`) 도입 — boolean 플래그 대신 URL 문자열로 React Strict Mode 이중 호출 시에도 `{type:'top'}` 발동 방지 (JA/EN 상단 고정 해소)
- 다른 URL 이동 시 플래그 초기화 — 이후 동일 URL 재방문 시 scroll-to-top 정상 동작 보장
- NavigationBar `window.scrollTo(0)` 제거 — 라우트 전환 스크롤 단일 책임 (SmoothScroll)
- ContactUsSection scroll-to-top useEffect 제거 — 언어 전환 시 위치 복원 충돌 해소

#### SmoothScroll 언어 전환 시 스크롤 위치 복원 누락 수정 (products/homepage)
- dev(Turbopack) SPA 모드에서 locale 변경 시 `[locale]` 레이아웃이 remount 없이 update로 처리되어 `[pathname]` 단독 deps로는 언어 전환 감지 불가 → `[pathname, locale]`로 변경
- `SmoothScroll.test.tsx`: `next-intl` mock(`useLocale: () => 'ko'`) 추가로 회귀 테스트 유지

#### ContactUsSection toast 1440px 이상 중앙 정렬 (products/homepage)
- `desktop:mx-auto` 추가 — 1440px 미만 좌측 정렬 유지, 1440px 이상에서 `max-w-[1140px]` 범위 내 중앙 정렬

#### NavigationBar 라우트 진입 시 배경 transition 순간 깜빡임 제거 (packages/ui)
- `skipTransition` 상태 추가 — 라우트 변경 직후 배경 opacity transition 비활성화 후 `requestAnimationFrame`으로 복원
- 라우트별 초기 투명 상태(`isHome` / `isProductDetail` / `isMedia`) 즉시 적용하여 진입 시 깜빡임 방지
- 기존 700ms 크로스페이드는 스크롤 인터랙션 구간에서만 유지

#### ProductReviews store 없을 때 구분자 `|` 노출 버그 수정 (products/homepage)
- `review.role` 존재 여부만 체크하던 조건을 `review.store && review.role` 병렬 체크로 수정
- ja.json `visionCheckout.reviews.3.store` 빈 문자열 케이스에서 구분자가 노출되던 문제 해결

#### ja.json 리뷰 3번 store 값 빈 문자열로 수정 (products/homepage)
- `visionCheckout.reviews.3.store`: `"リテール"` → `""` — 카테고리와 store 중복 표기 제거

### ✨ Added

#### 유튜브 쇼케이스 언어별 노출 제외 (hideInLocales, HOM-25) (products/homepage)
- `youtube-curation.json`에 `hideInLocales`(videoId→숨길 로케일 배열) 규칙 추가 — 재싱크·재배포에도 유지되는 수동 소스
- `sync-youtube.mjs`가 규칙을 `youtube-showcase.json` 각 영상 `hideInLocales` 필드로 전파(구움)
- `lib/showcaseVisibility.ts`(`visibleShowcaseVideos`) 순수 필터 + 단위테스트 5건, `media/page.tsx`가 현재 로케일 기준 필터링
- 적용: 영어 소개영상(`fSzG6pXZx-w`)→en 전용 / 일본어 사용법(`U12evbt9Aoo`)→ja 전용 / 한국어 사용법(`NZf1qo6LS8w`)→en에서만 숨김
- 영어 소개영상 2건(`lLDFJ-3rs2U` [Intro], `VJSlS3ujdEo` Super Swift)을 RSS 창(최신 15개) 밖이라 `manual`로 고정 + en 전용 노출(번역 완료 전까지)
- 정적 export 검증: /ko·/en·/ja media HTML에서 5개 영상 로케일별 노출/제외 정확히 반영 확인

#### homepage-design SKILL.md 생성 (.claude/skills/homepage-design/)
- 홈페이지 디자인/개발 패턴 가이드 스킬 파일 신규 생성
- Foundation 토큰 계층, 브레이크포인트, 다크 모드, 그리드, GA 이벤트, i18n, 슬라이더 패턴 등 핵심 규칙 문서화
- CHANGELOG 분석 기반 15개 항목 추가 반영

#### ProductReviews ja 전용 4번째 리뷰 카드 (products/homepage)
- 일본어 로케일(`ja`) + `vision-check-out` 슬리그 조건 시 4번째 카드 동적 추가
- 카드 스펙: cafeteria 아이콘, 민트 컬러(`--color-text-basic-positive`), 이미지 `vco-review-retail-hibinoma-final.webp`
- 콘텐츠: Comma Store 직영점 (東京都江東区豊洲) — ja.json `visionCheckout.reviews.3` 키 추가

### 🔄 Changed

#### SmoothScroll top 스크롤 rAF 지연 (products/homepage)
- `action.type === 'top'` 시 `applyScroll(0)` 호출을 `requestAnimationFrame`으로 감싸 비동기 실행
- SPA 이동(`next dev`) 중 Lenis RAF 루프가 `immediate: true` scrollTo를 덮어쓰는 경합 방지
- `restore`·`anchor` 케이스와 실행 방식 통일 — HOM-12·HOM-15-2 dev 환경 재발 수정

#### ProductReviews 리뷰 섹션 타이틀 ja 수정 (products/homepage)
- `ja.json` `visionCheckout.reviewsTitle` — `"お客様の導入事例"` → `"VCO導入・運用事例"`

#### ProductReviews 슬라이더 우측 패딩 및 스냅 (products/homepage)
- 마지막 카드 `snap-start` → `snap-end` + 컨테이너 `scroll-pr` 추가 — 스냅백 없이 우측 패딩 정상 표시
- 컨테이너 `pr` 값을 `pl`과 동일한 breakpoint/토큰으로 적용 (`--padding-XL` / `--padding-8XL` / desktop calc)
- 이미지 높이 `h-[420px]` 고정, `items-stretch` 통일

#### AboutPeople 슬라이더 우측 패딩 및 스냅 (products/homepage)
- ProductReviews와 동일 조건 적용: `pr`/`scroll-pr` 추가, 마지막 카드 `snap-end`

---

## [Unreleased] - 2026-07-14

### 🔄 Changed

#### HeroSection 클라이언트 로고 롤링 (products/homepage)
- 7-Eleven, Tokyu Land 로고 제거

#### ShowcaseSection 모바일 대응 (products/homepage)
- 420px 이하 텍스트·썸네일 패널 내부 패딩 `var(--padding-XL, 24px)` 적용
- ProgressBar 절대좌표 위치 수정 — 내부 패딩 기준에 맞게 wrapper div로 분리

#### ProductFeatures 모바일 수정 (products/homepage)
- 768px 이하 상단 카드 2개 우하단 `border-bottom-right-radius: var(--cornerRadius-M, 16px)` 복원
- 420px 이하 상단·하단 카드 높이 `auto`로 수정 — 이미지 잘림 방지

#### NewsSection 콘텐츠 업데이트 (products/homepage)
- 4번째 기사 카드 제거 및 i18n 키 재번호 (ko/en/ja)
- 6번째 기사 링크 → 닛케이 기사 URL, 썸네일 → `nikkei-hfx-2026.jpg`

#### ProductReviews 리조트 카드 (products/homepage)
- 3번째 카드(일본 닛세코 리조트) 문구 교체 — "AI 도입 이후 계산 속도 약 2~3배 향상"
- 이미지 `vco-review-resort.jpg` → `vco-review-resort-final.webp`

### ✨ Added

#### ProgressBar barClassName prop (packages/ui)
- 개별 바 높이를 인스턴스별로 오버라이드할 수 있는 `barClassName` prop 추가

#### ja.json 신규 추가 (products/homepage)
- 일본어 로케일 메시지 파일 `ja.json` 추가 (기존 `jp.json` 대체)

---

## [Unreleased] - 2026-07-09

### 🔄 Changed

#### HeroSection 네비 색상 전환 타이밍 개선 (products/homepage)
- 비디오 박스 확장 애니메이션 90% 시점(540ms)에 네비 색상 전환 — 깜빡임 방지
- `navTimerRef`로 타이머 관리, 복귀 시 즉시 취소 후 collapsed 발행

#### NavigationBar 배경 전환 부드럽게 개선 (packages/ui)
- 배경색 직접 전환 → **opacity 레이어 크로스페이드** 방식으로 변경
- `duration-700 ease-out`으로 부드러운 페이드 인/아웃 적용
- 투명 모드: 배경 레이어 `opacity-0`, 라이트 모드: `opacity-100`

#### HeroSection Dim Overlay 연하게 조정 (products/homepage)
- `rgba(0,0,0,0.4)` → `rgba(0,0,0,0.25)` (40% → 25%)

---

## [Unreleased] - 2026-07-08 (4)

### 🔄 Changed

#### HeroSection 스크롤 스냅 인터랙션 (products/homepage)
- Lenis Snap 기반 2단계 스냅 방식 도입 (접힘↔펼침)
- 섹션 높이 `h-[400vh]` → `h-[180vh]` 축소 (스냅 방식에 최적화)
- `EXPANDED_STOP` 상수로 펼침 지점 비율 조절 가능 (기본값 0.5)
- proximity 타입, 30% 거리 임계값, 1.4s duration, easeOutExpo 이징
- `expandedRef` 사용으로 불필요한 리렌더 방지

#### 스크롤 성능 최적화 (packages/ui)
- `NavigationBar.tsx`: `transparentRef`/`shadowRef` 도입 — 스크롤 이벤트에서 상태 변경 시에만 setState 호출
- `ScrollTopButton.tsx`: `visibleRef` 도입 — 스크롤 이벤트에서 상태 변경 시에만 setState 호출
- 동작/디자인 100% 동일, 리렌더 빈도 최소화

---

## [Unreleased] - 2026-07-08 (3)

### 🔄 Changed

#### ShowcaseSection (products/homepage)
- 썸네일 자동 전환 속도 5000ms → 3500ms
- 슬라이드 애니메이션: 구 이미지 좌측 이탈 + 신 이미지 우측 진입 (400ms ease-in-out)
- `animating` StrictMode 버그 수정: cleanup에서 `animatingRef` 리셋으로 영구 고착 방지
- 텍스트 패널·썸네일 패널 내부 패딩 `var(--padding-2-xl, 32px)` 토큰 적용
- 유튜브 카드 ↔ 소셜 카드 간격 `var(--spacing-2XL, 32px)` 토큰 적용
- 소셜 카드 간 간격 `var(--spacing-XL, 24px)` 토큰 적용
- ProgressBar 굵기 `h-2xs`(4px) → `h-[3px]`

#### StoreEffects (products/homepage)
- 아코디언 트리거 호버·클릭 제거 → IntersectionObserver 스크롤 기반 단독 제어
- 뷰포트 진입 시 인덱스 오름차순 큐 → 350ms 간격 순차 오픈, 1회 고정

#### CtaBanner (products/homepage)
- 이중 버튼(`max-[420px]:hidden` / `min-[421px]:hidden`) → 단일 XL 버튼으로 통합

#### MegaMenuPanel (@fai/ui)
- 이미지 영역 그라데이션 오버레이 제거

## [Unreleased] - 2026-07-08 (2)

### 🐛 Fixed

#### revert 누락 항목 재적용 (packages/ui, products/homepage)
- `packages/ui/components/Footer.tsx`: `text-[13px] leading-[20px]` → `text-body-xs leading-[1.25rem]` (4곳)
- `packages/ui/components/NavigationBar.tsx`: `JP` → `JA`, hasShadow 스크롤 로직, `transition-all`, `shadow-M`, lang span `text-body`
- `packages/ui/components/navigation/LanguageSwitcher.tsx`: locale `jp` → `ja`, font-size/lineHeight CSS vars
- `products/homepage/app/[locale]/products/[slug]/page.tsx`: `generateStaticParams` locale×slug 전체 조합 복원
- `products/homepage/components/sections/contact/ContactUsSection.tsx`: color 토큰 hex fallback 제거, semantic 토큰 교체

#### Foundation 토큰 규칙 위반 수정 (products/homepage, packages/ui)
- `ContactUsSection.tsx`: `--font-size-*` / `--font-lineHeight-*` 13곳 → Tailwind 텍스트 토큰 교체
- `ProductReviews.tsx`: CSS-in-JS `--font-size-*` → `--w-text-*-size` / `--w-text-*-lineHeight`
- `LanguageSwitcher.tsx` (homepage): inline style font 토큰 교체
- `NewsSection.tsx`: `text-[length:var(--font-size-15)]` → `text-body-ms` (2곳)
- `EfficiencySection.tsx`: `text-[length:var(--font-size-14)]` → `text-body-s`
- `globals.css`: `body { font-family: var(--w-font-family) }` 추가 — ja 로케일 폰트 전환
- `tailwind.config.ts`: `fontFamily.base: ['var(--w-font-family)']` 적용

#### BenefitGraphic 아이콘 반응형 사이즈 (packages/ui, root/assets)
- `staffing.svg` / `checkout-flow.svg` / `profitability.svg`: `width="40" height="40"` 제거 → CSS className이 SVG viewport 완전 제어
- `BenefitGraphic.tsx`: `width/height={undefined}` 핵 제거, `className={className}` 클린 방식 적용

#### ProductFeatures 카드 반응형 높이 (products/homepage)
- Card 0·1 `≤960px`: `height: 640px` 고정
- Card 0·1 `≤768px`: `height: 435px`, 이미지 영역 분리
- Card 0·1 `421px~768px`: 이미지 `aspect-ratio: 420/291` — 너비 비례 자동 높이
- Card 0·1 `≤420px`: 카드 `435px`, 이미지 `291px` 고정
- Card 2 `≤960px`: 컨테이너 `height: auto`, 이미지 `aspect-ratio: 456/633` — 960px 기준 633px
- Card 2 `≤768px`: 컨테이너 `height: auto`, 이미지 `aspect-ratio: 420/291`
- Card 2 `≤420px`: 카드 `435px`, 이미지 `291px` 고정

## [Unreleased] - 2026-07-09

### ✨ Added

#### RetailTechLetter 썸네일 (products/homepage)
- `config/retail-tech-letter.json` 전체 레터(31개)에 `thumbnailUrl` 필드 추가
  - id 1–6: `https://img.stibee.com/98052_1696503402.png`
  - id 7–31: `https://img.stibee.com/98052_1714470037.png`

### 🐛 Fixed

#### Foundation 문서 정합성 (root/foundation/docs)
- `typography-w.md`: `html[lang='jp']` → `html[lang='ja']` 오타 수정
- `typography.md`: `M PLUS 2 Variable` → `M PLUS 2` (Google Fonts 실제 font-family명 정정), `JP` → `JA`
- `typography.json`: `'M PLUS 2 Variable'` → `'M PLUS 2', system-ui, sans-serif`
- `color-global.md`: 구버전 → 상세 버전 (팔레트 표·size 스케일·사용 규칙·파일 구조 포함)
- `color-semantic.md`: 구버전 → 상세 버전 (bg/color/border/sand 실제 토큰 값·다크모드·Tailwind 예시 포함)

#### Foundation 문서 추가 (products/homepage/root/foundation/docs)
- `typography.md`: ja 로케일 M PLUS 2 폰트 항목 추가

## [Unreleased] - 2026-07-08

### ✨ Added

#### localeScroll (products/homepage)
- `lib/localeScroll.ts` 신규 생성 — 로케일 전환 시 스크롤 위치 sessionStorage 저장/복원 유틸
- `peekLocaleScroll` (read-only) / `clearLocaleScroll` (rAF 콜백 내 삭제) 분리로 React StrictMode 이중 실행 대응

### 🔄 Changed

#### SmoothScroll (products/homepage)
- 로케일 전환 시 sessionStorage에 저장된 scrollY 복원 로직 추가
- popstate(뒤로/앞으로) 감지 후 브라우저 복원 위치로 Lenis 내부 상태 동기화

#### LanguageSwitcher / NavigationBarBridge (products/homepage)
- 로케일 전환 직전 `saveLocaleScroll()` 호출 추가

#### globals.css (products/homepage)
- `--color-filled-basic-fourth` 토큰 추가: `:root` light(`--color-gray-30`), `.dark` dark(`--color-gray-800`)

#### ProductReviews (products/homepage)
- 리뷰 슬라이더 카드 이미지 ≤960px: 고정 크기 → `flex:1 + aspect-ratio:613/460` 비율 대응

#### ProductFeatures (products/homepage)
- Card 0·1 모바일 레이아웃(텍스트 상단 / 이미지 하단) 적용 범위 `≤420px` → `≤768px` 확장
- Card 1 이미지 영역 background-position 우측 정렬(`100%`)
- Card 2 description `whitespace-pre-line` 적용, 줄바꿈 추가

#### ImageSection (products/homepage)
- 데스크탑(≥1440px) `object-bottom` → `object-center` 이미지 중앙 정렬

#### StoreTypes (products/homepage)
- 카드 그리드 `≤768px` 1열 레이아웃 적용 (`max-[768px]:grid-cols-1`)
- wide 카드 `col-span-1` 적용 범위 `≤420px` → `≤768px`
- wide 카드 이미지 `≤768px` `object-position: center` 오버라이드 (`.fai-storetype-wide-img`)
- 카드 높이 `≤768px` 520px, `≤420px` 460px (`fai-storetype-card` style 블록)

### 🐛 Fixed

#### LanguageSwitcher / NavigationBar (@fai/ui)
- 모바일 언어 전환 로케일 코드 `jp` → `ja` 수정 (잘못된 `/jp/` 라우팅 → 404 버그)
- NavigationBar 내부 fallback switcher `LANGUAGES` 배열 `'JP'` → `'JA'`
- `root/foundation/docs/typography-w.md` `html[lang='jp']` → `html[lang='ja']`

#### products/[slug]/page.tsx (products/homepage)
- `generateStaticParams` `slug`만 반환하던 문제 수정 → `locale × slug` 전체 조합 반환
- Next.js 16 `output: export` 환경에서 `/ko|en|ja/products/*` 404 발생하던 버그 해결

### 🔄 Changed

#### Foundation 토큰 규칙 준수

- **Footer** (`@fai/ui`): `text-[13px] leading-[20px]` → `text-body-xs leading-[1.25rem]`
- **ContactUsSection** (products/homepage): `--font-size-*` / `--font-lineHeight-*` / `--m-text-*` 프리미티브 토큰 → `--w-*` web 토큰 교체, hex fallback 제거
- **RetailTechLetterSection** (products/homepage): `border-[var(--color-border-tertiary,#E4E6E7)]` 복원, `#EDF2F5` → `var(--color-bg-200)`, hex fallback 제거

---

## [3.6.0] - 2026-07-06

### 🔄 Changed

#### ProductFeatures (products/homepage)
- Card 0·1·2 데스크탑(>960px) 내부 패딩 `--size-48` → `--padding-3-xl` (40px)
- 960px 이하 Card 0·1·2 패딩 `--padding-2-xl` (32px) 적용
- Card 2 960px 이하 레이아웃: flex-row (텍스트 좌 / 이미지 우 50%) 사이드바이사이드 배치
- Card 2 420px 이하 레이아웃: flex-column 스택, `flex-direction` 및 `flex` 리셋 버그 수정
- Card 2 데스크탑 높이 `tablet:h-[430px]` 유지

#### StoreEffects (products/homepage)
- 아코디언 리스트 트리거 방식 변경: 호버·클릭 제거 → IntersectionObserver 스크롤 기반 단독 제어
- 아이템 뷰포트 진입 시 인덱스 오름차순 큐 → 350ms 간격 순차 오픈
- 1회 열린 아이템 영구 고정 (닫힘 없음), observer disconnect

#### CtaBanner (products/homepage)
- 모바일 이중 버튼 버그 수정: `max-[420px]:hidden` / `min-[421px]:hidden` 임의 브레이크포인트 제거 → 단일 XL 버튼으로 통합

#### MegaMenuPanel (@fai/ui)
- 메가메뉴 이미지 영역 그라데이션 오버레이 제거

#### ShowcaseSection (products/homepage)
- 썸네일 자동 전환 속도 5000ms → 3500ms
- 텍스트 패널 타이틀 영역 `min-h` 고정 (모바일 112px / 데스크탑 136px) — 영상 전환 시 위치 흔들림 방지
- 영상 전환 슬라이드 애니메이션 추가: 구 이미지 좌측 이탈 + 신 이미지 우측 진입 (400ms ease-in-out)
- `animating` deps 버그 수정: StrictMode cleanup으로 타이머 취소 후 `animating` 영구 고착 방지

---

## [3.5.0] - 2026-07-01

### ✨ Added

#### GA4 버튼 클릭 이벤트 계측
- 3종 커스텀 이벤트 `interest_click`(관심) / `lead_acquisition_click`(잠재) / `inquiry_complete`(문의완료)를 12개 지점(네비·홈·제품·미디어·푸터·문의, 데스크톱+모바일)에 계측
- 공통 파라미터 `location`/`label`, gtag 접점은 `lib/analytics/track.ts` 단일 소스
- 공용 `@fai/ui`는 분석 비종속(제네릭 콜백 prop), GA 명칭은 homepage 브릿지에만
- dataLayer 실측 검증 10/10 통과

#### 문의 폼 Zapier 전송 연동
- `ContactUsSection` 제출 시 라이브 `contact-us`와 동일한 Zapier 웹훅으로 전송 (`lib/contact/payload.ts`)
- 관심사 → `solution[]`, 세부 항목 → `content` 자동 생성, `utm_*`/`referrer` 캡처
- 포맷: form-urlencoded + JSON.stringify body (Zap 매핑 호환). 실전 전송 5건 200/success 검증

#### 로케일별 SEO 메타데이터
- `config/site.ts` `seo` 맵(ko/en/ja) → title/description/keywords/OG를 `[locale]/layout.tsx`에서 로케일별 생성
- `<html lang>` 로케일별, hreflang(ko/en/ja + x-default=ko), OG 이미지 1200×630

#### 테스트 인프라
- vitest + @testing-library/react + jsdom 도입, 순수 로직·문의 폼 흐름 테스트

### 🔄 Changed

- **일본어 로케일 코드 `jp` → `ja`** (ISO 639-1 준수, 국가코드 오용 교정). `/jp/*` 경로 제거
- 루트 레이아웃을 `app/[locale]/layout.tsx`로 병합(로케일별 `<html lang>`), `app/layout.tsx` 제거
- `@fai/ui` NavigationBar·MegaNavMenu·Menu·Footer·TabletDrawerMenu에 옵셔널 분석 콜백 prop 추가(하위 호환)

### 🐛 Fixed

- `trackEvent` SSR no-op 가드 — 정적 export 프리렌더 시 `window` 미존재 크래시 방지
- `CtaBanner` "도입 문의하기" CTA가 로케일 누락으로 404 → locale-aware 라우팅
- `@fai/ui` Footer SNS 링크에 `target="_blank"`/`rel` 추가(새 탭)
- 죽은 코드 정리: 로컬 `Footer.tsx`·고아 `ScrollTopButton.tsx`·미사용 `siteConfig.fullName` 제거

## [3.4.2] - 2026-06-24

### 🐛 Fixed

#### WhyFaiSection 비디오 좌우 검정 프레임
- `WhyFaiSection` — 호버 시 비디오 좌우 촬영 환경 노출 버그 수정
  - 원인: 비디오(800×694)와 카드(364×320) 비율이 근접해 `object-cover`가 영상 전체 너비를 노출
  - 수정: `scale-[1.15]` 적용 → 좌우 각 7.5% 확대 크롭, 래퍼 `overflow-hidden`으로 클리핑

### 🔄 Changed

#### 회사소개 페이지 섹션 레이아웃
- `AboutHero`, `AboutManagement`, `AboutPartners`, `AboutPeople`, `AboutLogos` — 1440px 이상 뷰포트에서 콘텐츠 중앙 정렬 적용 (`max-w-[1440px] mx-auto`)
- `AboutPeople` 가로 스크롤 컨테이너: 1440px 이상에서 `pl-[calc(((100vw-1440px)/2)+var(--padding-8XL))]`로 시작점 동기화

#### AboutPeople 카드 링크
- `target="_blank"` → 동일 창 이동으로 변경, 뒤로가기 스크롤 위치 복원 (`sessionStorage` + `setTimeout`)

#### 푸터 SNS 링크
- LinkedIn / YouTube / Instagram href를 실제 채널 URL로 업데이트 (`Footer.tsx`, `footer/Footer.tsx` 동시 반영)

#### ContactUsSection 토스트
- 768px 이하: 아이콘 숨김, 텍스트 "카카오톡 채널로 문의하세요"
- 420px 이하: 토스트 제거, 풀너비 버튼만 노출 (dark 토큰 적용)
- 토스트 패딩 768px 이하 한 단계 낮춤

#### AboutManagement CTO 학력
- "서울대학교 전기컴퓨터공학 학사/박사(Ph.D)" → 줄바꿈 적용 (`\n`)

## [3.4.1] - 2026-06-24

### 🔄 Changed

#### 미디어 페이지 섹션 레이아웃
- `ShowcaseSection`, `NewsSection`, `RetailTechLetterSection` — 1440px 이상 뷰포트에서 콘텐츠 중앙 정렬 적용
  - `section`은 `w-full` + 배경색만 유지 (배경 풀 뷰포트)
  - 내부 래퍼 `div`에 `max-w-[1440px] mx-auto` 추가, 기존 패딩/gap/pt/pb 값 그대로 유지

## [3.4.0] - 2026-06-24

### ✨ Added

#### 디자인 토큰 신규
- `products/homepage/app/globals.css` — `--color-icon-optional-brand-primary` 시맨틱 토큰 추가 (light: `--color-green-600`, dark: `--color-green-500`)

### 🔄 Changed

#### 아이콘 폴더 승격 (packages/ui)
- `packages/ui/components/common/Icon/` — `products/homepage/components/common/Icon/` 전체 이동 (ArrowUpIcon, BenefitGraphic, ChevronIcon, EffectGraphic, GlobeIcon, IcArrowRight16, IcRequiredDot, ReviewIcon, SocialIcon 9개 파일)
- import 경로 7개 파일 일괄 교체: `@/components/common/Icon/` → `@fai/ui/components/common/Icon/` (LanguageSwitcher, ShowcaseSection, ScrollTopButton, ContactUsSection, ProductBenefits, ProductReviews, StoreEffects)

#### SVG → SVGR 전환 (인라인 SVG 제거)
- `ReviewIcon.tsx` — 인라인 SVG → `bakery.svg`, `cafeteria.svg`, `resort.svg` SVGR import
- `SocialIcon.tsx` — 인라인 SVG → `linkedin-brand.svg`, `instagram-brand.svg` SVGR import
- `ArrowUpIcon.tsx` — 인라인 SVG → `arrow-up.svg` SVGR import (기본 className `w-[24px] h-[24px]`)
- `ChevronIcon.tsx` — 인라인 SVG → `chevron-down.svg` SVGR import (`open` prop → `rotate-180` className)
- `GlobeIcon.tsx` — 인라인 SVG → `globe.svg` SVGR import
- `IcArrowRight16.tsx` — 인라인 SVG → `ic-arrow-right-16.svg` SVGR import
- `IcRequiredDot.tsx` — 인라인 SVG → `ic-required-dot.svg` SVGR import; `className="text-[var(--color-icon-optional-brand-primary)]"` 컬러 토큰 적용

#### SVG 파일명 정리
- `review-bakery.svg` → `bakery.svg`, `review-cafeteria.svg` → `cafeteria.svg`, `review-resort.svg` → `resort.svg` (review- prefix 제거)
- `sns-instagram.svg` → `instagram.svg`, `sns-linkedin.svg` → `linkedin.svg`, `sns-youtube.svg` → `youtube.svg` (sns- prefix 제거)
- `social-instagram.svg` → `instagram-brand.svg`, `social-linkedin.svg` → `linkedin-brand.svg` (social- prefix 제거, brand 구분 명칭)

#### SVG currentColor 전환
- `root/assets/icon/arrow-up.svg` — `fill="white"` → `fill="currentColor"`
- `root/assets/icon/ic-required-dot.svg` — `fill="var(--fai-bg-brand)"` → `fill="currentColor"`
- `root/assets/icon/bakery.svg`, `cafeteria.svg`, `resort.svg` — 컬러 fills → `fill="currentColor"`
- `root/assets/icon/file.svg`, `window.svg`, `next.svg`, `vercel.svg` — `#666`/`#000`/`#fff` → `fill="currentColor"`

#### Turbopack SVGR 설정
- `products/homepage/next.config.ts` — Turbopack용 `turbopack.rules` 최상위 키 추가 (`*.svg` → `@svgr/webpack` 로더); Webpack `webpack()` 설정은 Turbopack에서 무시되므로 별도 분리

#### StoreEffects import 정정
- `products/homepage/components/sections/products/StoreEffects.tsx` — `EffectIcon` → `EffectGraphic` import 및 타입 캐스팅 교체

#### 문의하기 ContactUsSection 반응형·UX 개선
- **진입 스크롤** — 문의하기 버튼 클릭 후 진입 시 항상 최상단(`lenisRef.current.scrollTo(0, { immediate: true })`)으로 뷰포트 열리도록 `useEffect` 추가
- **완료 스크롤** — 폼 제출 후 완료 화면 전환 시 `sectionRef` 기준 → 절대 최상단(`0`) 스크롤로 수정
- **완료 화면 폰트** — h2: ≤768px `28px/42px`, ≥769px `36px/54px`; p: ≤768px `18px/27px`, ≥769px `20px/30px`
- **완료 화면 패딩** — ≤960px `px-[var(--padding-XL)]`, ≥961px `px-0`

### 🐛 Fixed

#### React 상태 업데이트 에러 해결
- `products/homepage/components/sections/home/AnimatedStat.tsx` — `let mounted = true` 마운트 가드 + cleanup에서 `startedRef.current = false` 리셋 추가 (Strict Mode 이중 호출 대응)
- `products/homepage/components/sections/home/HeroSection.tsx` — `useMotionValueEvent` → `useEffect` + `scrollYProgress.on("change", cb)` 교체 (마운트 전 상태 업데이트 경고 제거)

---

## [3.3.0] - 2026-06-23

### 🐛 Fixed

#### 언어 전환 라우팅
- `packages/ui/components/navigation/LanguageSwitcher.tsx` — `next/navigation` 의존성 제거, `onLocaleChange: (code: string) => void` 콜백 prop 추가. 라우팅 로직을 컴포넌트 외부로 분리해 next-intl 미인식 문제 해결
- `NavigationBarBridge.tsx` — `useRouter` + `usePathname` from `@/i18n/navigation` 추가, `handleLocaleChange`에서 `router.push(pathname, { locale: code })` 호출 → 모바일 언어 전환도 next-intl 라우터 사용
- `products/homepage/components/layout/LanguageSwitcher.tsx` — `handleSelect`에 `if (code === locale) { setOpen(false); return; }` 가드 추가: 현재 언어 재클릭 시 라우팅 이벤트 방지 (모바일은 기존 가드 유지)

---

## [3.2.0] - 2026-06-23

### ✨ Added

#### ShowcaseSection 자동 슬라이드
- `ShowcaseSection.tsx` — `useEffect` + `setTimeout(5000ms)` 기반 자동 전환 타이머 추가: `index` 변경 시 타이머 리셋, 마지막 → 첫 번째 무한 루프, 화살표·프로그레스바 수동 클릭 시에도 타이머 재시작
- `ShowcaseSection.tsx` — `ProgressBar`에 `duration={DURATION}` 전달해 게이지 애니메이션과 자동 전환 시간 동기화

### 🔄 Changed

#### ProgressBar 게이지 애니메이션 (B 방식)
- `packages/ui/components/ProgressBar.tsx` — `i <= activeIndex ? w-full : w-0` 단순 토글 → 3단계 분기로 변경
  - `i < activeIndex`: `w-full` 즉시 완료
  - `i === activeIndex`: `@keyframes fai-progress-fill` CSS 애니메이션으로 0%→100% 서서히 채워짐, `key={fill-${activeIndex}}`로 인덱스 변경 시 애니메이션 재시작 보장
  - `i > activeIndex`: div 미렌더 (빈 상태)
- `duration` prop 추가 (기본값 `4000ms`) — 호출부에서 채워지는 시간 조정 가능

#### next.config.ts
- `images.remotePatterns`에 `{ protocol: "https", hostname: "i.ytimg.com" }` 추가 — YouTube 동적 썸네일 Next.js `<Image>` 안전 로드 허용

---

## [3.1.0] - 2026-06-23

### 🔄 Changed

#### 반응형 타이포그래피
- `HeroSection.tsx`, `ProductHero.tsx`, `HeroShell.tsx`(StoreHero), `AboutHero.tsx` — Hero 섹션 타이틀 폰트 사이즈 통일: ≤768px `text-title-xl`(48px), ≤420px `max-[420px]:text-title-l`(36px), ≥769px 기존 tablet/desktop 위계 유지

#### 반응형 레이아웃
- `HeroSection.tsx` — 비디오 확장 구간 타이틀↔CTA 간격 `gap-l` → `gap-[var(--spacing-2XL,32px)]`
- `ProductHero.tsx` — 동일 간격 `gap-l` → `gap-[var(--spacing-2XL,32px)]` (≤768px)
- `CtaBanner.tsx` — 960이하 단일 컬럼 대응: `tablet:` → `min-[961px]:`, `<br>` ≤768px에서만 표시
- `StoreTypes.tsx` — 1440이상 콘텐츠 중앙 고정 (`desktop:max-w-[1440px] desktop:mx-auto`), ≤960px 카드 높이 상단 540px·하단 320px
- `StoreEffects.tsx` — 내부 컨테이너 좌우 패딩 `min-[961px]:px-[var(--padding-6-xl,100px)]`, ≥1440px 중앙 고정; 카드·아코디언 패딩 `p-xl desktop-s:p-4xl`
- `ProductReviews.tsx` — 1440이상 타이틀 정렬 `desktop:pl-[calc((100vw_-_1440px)_/_2_+_var(--padding-8XL))]` + `desktop:scroll-pl-[...]`
- `ContactUsSection.tsx` — 상단 패딩 `pt-[var(--padding-8-xl,_150px)]` → `pt-6xl`(100px, ≤960px) / `desktop-s:pt-[200px]`(≥961px) 분리
- `AboutManagement.tsx`, `AboutPeople.tsx`, `AboutPartners.tsx` — h2 `max-[420px]:text-title-m` 추가
- `AboutLogos.tsx` — caption `max-[420px]:text-body-s` 추가

#### 디자인 토큰 점검·교체
- `ScrollTopButton.tsx` — `rounded-[999px]` → `rounded-fai-circle`, `right/top-[56px]` → `right/top-4xl`
- `Toast.tsx` — `rounded-[999px]` → `rounded-fai-circle`, titleSection↔버튼 `gap-m` 추가
- `ContactUsSection.tsx` — `rounded-[999px]` → `rounded-fai-circle`, toast 컨텐츠 `gap-m` 추가
- `Tabs.tsx` — `gap-[32px]` → `gap-2xl`, `gap-[8px]` → `gap-s`, `px-[24px]` → `px-xl`
- `StoreCaseStudies.tsx` — `gap-[4px]` → `gap-2xs` (2개소)
- `StoreTypes.tsx` — `gap-[4px]` → `gap-2xs`
- `NewsSection.tsx` — `gap-[12px]` → `gap-ms`
- `Footer.tsx` (legacy) — `gap-[40px]` → `gap-3xl`, `md:py-[56px]` → `md:py-4xl`, `md:px-[150px]` → `md:px-[var(--padding-8XL)]`
- `packages/ui/footer/Footer.tsx` — `py-[56px] px-[150px]` → `py-4xl px-[var(--padding-8XL)]`, `pb-[56px]` → `pb-4xl`

#### 코드 최적화 (기능·구조 변경 없음)
- `EfficiencySection.tsx` — inline style 객체 12개 → 1개로 축소: dead code(`statsWrapperStyle`, `statContainerStyle`) 제거, layout-only style 객체 5개 → className으로 이동, color/typography style 4개 단순화
- `ProductFeatures.tsx` — Card 0·1 동일 JSX 중복 → `CARD_BG` 상수 + `if (i < 2)` 단일 코드 경로로 통합 (~25줄 제거)
- `packages/ui/footer/Footer.tsx` — 데스크톱 row1·row2 동일 렌더링 → `InfoRow` 컴포넌트 추출
- `ContactUsSection.tsx` — Figma Dev Mode 잔여 `data-node-id` 속성 14개 제거

#### ContactUsSection 추가 개선
- toast 768이하 텍스트 → "카카오톡 채널로 간편 문의하세요" (`tablet:hidden`/`hidden tablet:block` 분기)

#### packages/ui/footer 신규 파일
- `packages/ui/components/footer/Footer.tsx`, `footer.css` — 반응형 토글 CSS 기반 Footer 컴포넌트 신규 추가 (>960px 데스크톱 / ≤960px compact 레이아웃 분리; `fai-footer__` BEM 클래스; ScrollTopButton ≤420px 숨김)

---

## [3.0.0] - 2026-06-22

### 🔄 Changed
- `products/homepage/components/sections/products/ProductIndustries.tsx` — 768px 이하 카드 세로 스택, 타이틀/본문 폰트 반응형 축소, 좌우 버튼 768px 이하 숨김
- `products/homepage/components/sections/products/ProductReviews.tsx` — 960px/768px 반응형 CSS 블록 추가 (카드 너비 `min()` 함수 반응형, 768px 이하 세로 배치·이미지 하단 정렬, 폰트 단계 축소)
- `products/homepage/components/sections/products/StoreEffects.tsx` — 상단 3열 카드 768px 이하 세로 전환, 960px/768px 패딩·폰트 반응형 단계 축소, 아코디언 리스트 반응형 패딩 적용
- `products/homepage/components/sections/products/StoreTypes.tsx` — 960px/768px/420px 폰트 단계 축소, 420px 이하 1열 그리드 전환, 카드 높이·패딩 반응형 대응 (`max-[420px]:grid-cols-1`, `max-[420px]:h-[536px]`, `max-[768px]:p-3xl`, `max-[420px]:p-xl`)
- `products/homepage/components/ui/Tabs.tsx` — 960px/768px 탭 폰트·패딩·보더 반응형 축소 (`var(--w-title-S-size)`, `var(--padding-ms)`, `border-b-[3px]`)
- `products/homepage/components/sections/contact/ContactUsSection.tsx` — 상단 패딩 200px, 960px/1280px 좌우 패딩 단계 대응, 420px 이하 타이틀·폼 텍스트 폰트 축소, 토스트 본문 420px 이하 숨김
- `products/homepage/components/sections/media/NewsSection.tsx` — 768px 이하 1열 그리드 전환, 카드 이미지 높이 367px 고정
- `packages/ui/components/NavigationBar.tsx` — active 텍스트 색상 버그 수정, font-bold inner span 이동
- `packages/ui/components/navigation/TabletDrawerMenu.tsx` — 드로어 메뉴 구조 개선
- `packages/ui/components/navigation/LanguageSwitcher.tsx` — 언어 스위처 로직 개선
- `packages/ui/components/ui/Drawer.tsx` — Drawer 컴포넌트 개선
- `packages/ui/index.ts` — export 업데이트

### 🗑️ Removed
- `packages/ui/components/navigation/TabletNavigationBar.tsx` — TabletNavigationBar 컴포넌트 삭제 (통합)

---

## [2.9.0] - 2026-06-22

### ✅ Added
- `packages/ui/components/navigation/MegaMenuPanel.tsx` — MegaNav 패널 컴포넌트 신규 생성
- `packages/ui/components/Scrollbar.tsx` — 공통 Scrollbar 컴포넌트 신규 생성
- `products/homepage/app/[locale]/about/` — About 페이지 신규 생성
- `products/homepage/app/[locale]/contact/` — Contact 페이지 신규 생성
- `products/homepage/app/[locale]/media/` — Media 페이지 신규 생성
- `products/homepage/app/[locale]/playground/` — Playground 페이지 신규 생성
- `products/homepage/assets/icon/ArrowUpIcon.tsx`, `BenefitIcon.tsx`, `ChevronIcon.tsx`, `EffectIcon.tsx`, `GlobeIcon.tsx`, `IcArrowRight16.tsx`, `IcRequiredDot.tsx`, `SocialIcon.tsx` — 아이콘 컴포넌트 다수 신규 생성
- `products/homepage/components/sections/products/StoreCaseStudies.tsx`, `StoreEffects.tsx`, `StoreHero.tsx`, `StoreInteractiveContainer.tsx`, `StoreTypes.tsx` — 스토어 섹션 컴포넌트 신규 생성
- `products/homepage/components/sections/CtaBanner.tsx` — CTA 배너 섹션 신규 생성
- `products/homepage/config/types.ts` — 공통 타입 정의 신규 추가
- `products/homepage/i18n/`, `messages/` — 다국어 라우팅 및 메시지 파일 추가
- `products/homepage/components/ui/` — 공통 UI 컴포넌트 디렉토리 신규 생성

### 🔄 Changed
- `packages/ui/components/NavigationBar.tsx` — 네비게이션 바 스크롤 인터랙션 및 상태 로직 개선
- `packages/ui/components/navigation/MegaNavMenu.tsx` — MegaNav 메뉴 구조 및 렌더링 개선
- `packages/ui/components/LineInput.tsx` — LineInput 컴포넌트 전면 리팩토링
- `packages/ui/components/HoverDropdown.tsx` — HoverDropdown 인터랙션 개선
- `packages/ui/components/ui/Drawer.tsx` — Drawer 컴포넌트 개선
- `packages/ui/components/Header.tsx` — Header 컴포넌트 수정
- `packages/ui/components/Footer.tsx` — Footer 컴포넌트 수정
- `packages/ui/index.ts` — 신규 컴포넌트 export 추가
- `packages/ui/package.json` — 패키지 의존성 업데이트
- `products/homepage/components/sections/contact/ContactUsSection.tsx` — Contact 폼 대규모 리팩토링 (레이아웃·유효성 검사·UX 전면 개편)
- `products/homepage/components/sections/products/ProductHero.tsx` — Hero 섹션 레이아웃 및 콘텐츠 개선
- `products/homepage/components/sections/products/ProductBenefits.tsx` — Benefits 섹션 리팩토링
- `products/homepage/components/sections/products/ProductFeatures.tsx` — Features 섹션 구조 정리
- `products/homepage/components/sections/products/ProductIndustries.tsx` — Industries 섹션 개선
- `products/homepage/components/sections/products/ProductReviews.tsx` — Reviews 섹션 리팩토링
- `products/homepage/app/[locale]/products/[slug]/page.tsx` — 제품 상세 페이지 섹션 조립 업데이트
- `products/homepage/assets/icon/ReviewIcon.tsx` — ReviewIcon 컴포넌트 리팩토링
- `products/homepage/config/site.ts` — 사이트 설정 데이터 업데이트
- `products/homepage/tailwind.config.ts` — Tailwind 설정 업데이트

---

## [2.8.0] - 2026-06-20

### ✅ Added
- `products/homepage/components/sections/home/EfficiencySection.tsx` — 홈 Efficiency 섹션 신규 생성 (풀스크린 비디오 배경·scrim·`AnimatedStat` 3단 스탯; 반응형 padding·타이포; `pinDuration` prop)

### 🔄 Changed
- `products/homepage/app/[locale]/page.tsx` — `EfficiencySection` 조립; `HeroSection`에 `clientLogos` 파트너 로고 전달; `CustomersSection` `linkHref`를 VCO 리뷰 앵커(`/products/vision-check-out#product-reviews`)로 연결
- `products/homepage/components/layout/NavigationBarBridge.tsx` — `desktopLangSwitcher`·`mobileLangSwitcher` prop으로 homepage `LanguageSwitcher` 데스크톱/모바일 variant 주입
- `packages/ui/components/NavigationBar.tsx` — 제품 상세(`isProductDetail`) 히어로 구간(100vh) 스크롤 투명 헤더; 미디어(`isMedia`) 페이지 항상 라이트 배경 고정; 초기 `isTransparent`를 `!isHome && !isMedia`로 조정
- `products/homepage/components/sections/products/StoreCaseStudies.tsx` — `cases` 변경 시 `active` 인덱스 `useEffect`로 리셋

---

## [2.7.0] - 2026-06-19

### ✅ Added
- `packages/ui/components/navigation/TabletNavigationBar.tsx` — 태블릿(768–960px) 전용 독립 헤더 컴포넌트 전면 재설계 (`logo`, `isDarkMode`, `renderDrawer` props; 내부 open 상태 관리; 햄버거/X 토글; pathname 변경 시 드로어 자동 닫기; 다크/라이트 모드 배경색 분기)
- `packages/ui/components/navigation/TabletDrawerMenu.tsx` — 태블릿 드로어 메뉴 컴포넌트 신규 생성 (아코디언 드롭다운, 외부 링크, 내부 링크 처리; locale prefix 자동 부착)
- `packages/ui/components/navigation/LanguageSwitcher.tsx` — 태블릿 언어 전환 컴포넌트 신규 생성 (KR/EN/JP 인라인 버튼; `isDarkMode` 다크/라이트 텍스트 컬러 분기; `next/navigation` + `useLocale` 기반 locale 전환)
- `packages/ui/package.json` — `next-intl >=4` peerDependency 추가

### 🔄 Changed
- `packages/ui/components/NavigationBar.tsx` — 태블릿 구간 아키텍처 분리: 메인 `<header>` `tablet:hidden min-[961px]:block` 적용, 독립 `TabletNavigationBar` 사이드카 렌더링, 모바일 `Drawer` 단순화 (`GlobalUtilityMenu` 전용)
- `packages/ui/components/Header.tsx` — 태블릿 구간 `TabletNavigationBar` 연결 정리 (신규 인터페이스 대응)
- `packages/ui/index.ts` — `TabletNavigationBar`, `TabletDrawerMenu`, `LanguageSwitcher` export 추가; 구 `TabletNavItem` 타입 제거
- `products/homepage/components/sections/products/StoreEffects.tsx` — `EffectIcon name` prop `as EffectIconKey` 타입 캐스팅으로 빌드 에러 수정
- 드로어(태블릿/모바일) 내부 언어 전환 영역(`langRow`) 제거 — `TabletDrawerMenu`, `GlobalUtilityMenu` 에 `langRow` 미전달

---

## [2.6.0] - 2026-06-19
### ✅ Added
- `packages/ui/components/Scrollbar.tsx` — 스크롤 영역 래퍼 원자 컴포넌트 (`forwardRef`, padding·overflow-auto 토큰 명세)
- `products/homepage/assets/icon/EffectIcon.tsx` — StoreEffects 효과 카드 아이콘 팩토리 (인건비 절감·결제 무인화·원격 운영 가능)
- `products/homepage/assets/icon/GlobeIcon.tsx` — LanguageSwitcher 글로벌 아이콘
- `products/homepage/assets/icon/SocialIcon.tsx` — ShowcaseSection LinkedIn·Instagram 아이콘 팩토리
- `products/homepage/assets/icon/ChevronIcon.tsx` · `ArrowUpIcon.tsx` — 네비·CTA용 화살표 아이콘
- `products/homepage/app/globals.css` — 전역 커스텀 스크롤바 스타일 (`::-webkit-scrollbar`, `scrollbar-color` thin)

### 🔄 Changed
- `packages/ui/components/ui/Drawer.tsx` — 모바일 드로어 본문 `div` → `Scrollbar` 래퍼로 교체
- `packages/ui/index.ts` — `Scrollbar`·`ScrollbarProps` export 추가
- `packages/ui/components/LineInput.tsx` — `forwardRef` 전환; `maxLength`·`onBlur` prop 추가; 피그마 명세 패딩·border·helpText 레이아웃 정밀 교정
- `products/homepage/components/sections/products/ProductBenefits.tsx` — `motion.div` + `scrollFadeInUp` 스프링 진입 애니메이션; `container`·semantic spacing 토큰 (`gap-7xl`, `sticky top-7xl`)
- `products/homepage/components/sections/products/StoreEffects.tsx` — 인라인 SVG → `EffectIcon` 팩토리 연동
- `products/homepage/components/layout/LanguageSwitcher.tsx` — `GlobeIcon` 글로벌 에셋 import
- `products/homepage/components/sections/media/ShowcaseSection.tsx` — `SocialIcon` 팩토리로 SNS 아이콘 통합
- `products/homepage/config/site.ts` — VCO `heroVideo`·benefit 루프 영상 경로 실제 에셋 바인딩; `clientLogos` Orange Planet 추가; unmanned-store 히어로 `store-hero.png`; contact `complete` 블록·`bg-gradation-n.png` 경로
- `packages/ui/components/Footer.tsx` — 대표이사 표기 `함명원ㆍ왕민권`으로 업데이트

---

## [2.5.0] - 2026-06-18
### ✅ Added
- `packages/ui/components/navigation/MegaMenuPanel.tsx` — 메가 메뉴 범용 패널 컴포넌트 신규 생성 (CSS background + 그라데이션 오버레이, `bgStyle` per-item 배경 포지션/사이즈, hover 시 brand primary 컬러 + scale 애니메이션, `MegaMenuItemData` / `MegaMenuPanelProps` 타입 export)
- `products/homepage/components/ui/ProductMegaMenu.tsx` — 제품 메가 메뉴 래퍼 컴포넌트 신규 생성 (locale prefix 처리 후 `MegaMenuPanel` 주입)
- `packages/ui/index.ts` — `MegaMenuPanel`, `MegaMenuItemData`, `MegaMenuPanelProps` export 추가
- `products/homepage/config/site.ts` — `productMenu` 배열 SoT 추가 (VISION CHECK-OUT / UNMANNED STORE; 이미지 경로 + `bgStyle` 포지션 데이터 포함)
- `products/homepage/tailwind.config.ts` — `boxShadow` extend 블록 추가 (XS/S/M/L/XL/XXL → `var(--shadow-*)` 토큰); spacing `ml/5xl/6xl/7xl/8xl/9xl` 토큰 추가

### 🔄 Changed
- `packages/ui/components/NavigationBar.tsx`
  - `navItems?: readonly NavItem[]` prop 추가 — 미지정 시 내부 `NAV_ITEMS` 사용, homepage에서 `megaMenuPanel` 주입 가능하도록 오버라이드 지원
  - 우측 액션 div `self-stretch` 추가 → LanguageSwitcher가 헤더 전체 높이를 채워 `top: 100%` = 헤더 하단 정렬 보장
- `packages/ui/components/hover-dropdown/HoverDropdown.tsx`
  - `wrapperClassName?` prop 추가 — 지정 시 기본 `"relative"` 제거, 메가 메뉴 패널의 containing block을 `<header>`(position: fixed)로 상승시킬 때 사용
  - `panelClassName?` prop 추가 — 패널 위치/크기 완전 오버라이드 가능
- `packages/ui/components/navigation/MegaNavMenu.tsx`
  - `NavItem`에 `megaMenuPanel?: ReactNode` 필드 추가
  - `megaMenuPanel` 지정 시 `HoverDropdown` 브랜치로 분기 렌더링 (패널 위치: `top-[calc(100%+var(--spacing-2XS,4px))] left-xl right-xl desktop:left-[150px] desktop:right-[150px]`)
  - 트리거 버튼 active `font-bold` → inner `<span>`으로 이동 (isTransparent context-aware 색상 유지)
- `packages/ui/components/ui/Drawer.tsx` — 관련 스타일 조정
- `products/homepage/components/layout/NavigationBarBridge.tsx` — `NAV_ITEMS` + `ProductMegaMenu` 주입 구조로 재작성; `navItems` prop으로 `NavigationBar`에 전달
- `products/homepage/components/layout/LanguageSwitcher.tsx`
  - 데스크톱 wrapper `self-stretch` 추가 → 헤더 높이 채움
  - 드롭다운 컨테이너 border `0.5px solid var(--color-border-tertiary)` 통일
  - 드롭다운 gap `top: calc(100% + var(--spacing-2XS, 4px))` 적용
- `products/homepage/components/sections/home/HeroSection.tsx`
  - CTA 행 패딩 `px-[150px]` 고정 → `px-l tablet:px-xl desktop:px-[150px]` 반응형으로 변경

---

## [2.4.0] - 2026-06-17
### ✅ Added
- `products/homepage/assets/icon/IcRequiredDot.tsx` — 필수 입력 dot 마커 아이콘 컴포넌트 신규 추출 (8×8, `--fai-bg-brand` CSS 변수 fill, `aria-hidden`)
- `products/homepage/assets/icon/IcArrowRight16.tsx` — CustomersSection 링크 버튼용 오른쪽 화살표 아이콘 (16×16, `currentColor` mask 방식)
- `products/homepage/config/types.ts` — `ContactComplete` 인터페이스 추가 (`title`, `subCopy`, `buttonLabel`, `backgroundAsset`); `ContactConfig`에 `complete: ContactComplete` 필드 추가

### 🔄 Changed
- `products/homepage/components/sections/contact/ContactUsSection.tsx`
  - **완료 화면** — 제출 후 `submitted` 상태 전환, 완료 타이틀·서브카피·`[btn/icoTxt/square/primary/XL]` 버튼 렌더링; `dark` wrapper로 버튼 다크 모드 CSS 변수 강제 해석
  - **배경 이미지 분리** — `!submitted` / `submitted` 조건별 독립 `<Image>` 렌더링 (form: `bg-gradation-n.png`, complete: `bg-gradation-confirm-n.png`)
  - **즉시 스크롤** — `flushSync(setSubmitted(true))` 후 `lenisRef.current.scrollTo(section, { immediate: true })` / `window.scrollTo({ behavior: "instant" })` 분기 처리 (Lenis 인터셉트 우회)
  - **완료 화면 중앙 정렬** — content wrapper 조건부 `h-svh items-center justify-center` 적용
  - **handleContinue** — `setState(EMPTY_STATE)` · `setSubmitted(false)` 제거 → `router.push("/")` 단독 호출 (완료 화면 플래시 제거)
  - **Toast 마크업** — `<Toast>` 컴포넌트 + `window.open` → `<a href target="_blank">` + `<CustomerSupportIcon>` 인라인 구조로 교체; `dark` wrapper 다크 시맨틱 토큰 적용
  - **컬러 토큰 교정** — 임의 hex/RGB → `--color-*` / `--fai-*` CSS 변수 + hex fallback 전면 재정렬 (toast·complete 화면 전체)
  - **leading 토큰 교정** — `leading-[1.5]` 임의값 7곳 → `--font-lineHeight-{14,18,20,36}` 파운데이션 토큰으로 교체
  - **IcRequiredDot 도입** — 인라인 SVG → `@/assets/icon/IcRequiredDot` 컴포넌트 import로 전환
- `products/homepage/config/site.ts` — `contact.backgroundAsset` → `bg-gradation-n.png`; `contact.complete` 데이터 블록 추가 (title·subCopy·buttonLabel·backgroundAsset)

---

## [2.3.0] - 2026-06-17
### ✅ Added
- `packages/ui/components/Checkbox.tsx` — 순수 체크박스 원자 컴포넌트 신규 생성 (unchecked·checked·partial·disabled·error 5가지 상태; SVG mask 방식 체크·부분선택 아이콘; `useId` 기반 mask ID 충돌 방지)

### 🔄 Changed
- `packages/ui/components/CheckboxField.tsx` — peer CSS 방식 → `Checkbox` 원자 컴포넌트 합성 구조로 전면 리팩토링; `disabled`·`error` prop 추가; boxLabel 래퍼 `justify-center` 제거·`px-[var(--padding-none,0)]` 정렬 명세 반영
- `packages/ui/components/LineInput.tsx` — `error`·`helpText`·`disabled` prop 추가; 상태별 border 분기(`border-border-error`/`border-border-disabled`/`focus-within:border-border-brand`); required 점 SVG → span 교체; `fai-*` 오염 토큰 → 올바른 시맨틱 클래스로 전면 정정
- `packages/ui/index.ts` — `Checkbox`·`CheckboxState` export 추가
- `products/homepage/components/sections/contact/ContactUsSection.tsx` — `errors: Record<string, string>` 상태 추가; 제출 시 회사명·성함·이메일 정규식 유효성 검사; 입력 시 해당 필드 에러 실시간 초기화; `LineInput`에 `error`·`helpText` prop 전달
- `products/homepage/config/types.ts` — `ContactField` 인터페이스에 `errorMessage?: string` 필드 추가
- `products/homepage/config/site.ts` — 필수 입력 필드(company·name·email)에 `errorMessage` 값 추가

---

## [2.2.0] - 2026-06-17
### ✅ Added
- `products/homepage/app/[locale]/contact/page.tsx` — 문의하기 라우트 신규 구축 (`ContactUsSection` 조립)
- `products/homepage/components/sections/contact/ContactUsSection.tsx` — 문의 폼 섹션; `siteConfig.contact` SoT 바인딩; 배경 그라데이션 이미지·폼 검증(회사명·성함·이메일); VCO/STORE 관심 항목 체크박스; `IcoTxtButton` submit; 하단 `Toast` 카카오 채널 CTA
- `packages/ui/components/LineInput.tsx` — 라인 스타일 입력 필드 (label·required·error·helpText)
- `packages/ui/components/CheckboxField.tsx` — 문의 관심 항목용 체크박스 필드
- `packages/ui/components/Toast.tsx` — 하단 고정형 CTA Toast (`CustomerSupportIcon` + primary pill 버튼)
- `packages/ui/components/CustomerSupportIcon.tsx` — Toast 전용 40×40 SVG 아이콘
- `products/homepage/config/site.ts` — `contact` SoT 완비 (title·subCopy·form·fields·interests·toast·backgroundAsset); 네비 `문의` → `/contact` 링크
- `products/homepage/config/types.ts` — `ContactConfig`·`ContactField`·`ContactInterestGroup` 등 문의 타입 계약 추가

### 🔄 Changed
- `packages/ui/index.ts` — `LineInput`·`CheckboxField`·`Toast`·`CustomerSupportIcon` export 추가
- `products/homepage/components/sections/home/WhyFaiSection.tsx` — sand 시맨틱 토큰·spacing 토큰 기반 클래스 체계 정리 (`bg-sand-filled-primary/tertiary`, `text-sand-text-*`)

---

## [2.1.0] - 2026-06-16
### ✅ Added
- `products/homepage/components/sections/products/StoreInteractiveContainer.tsx` — StoreTypes·StoreCaseStudies 탭 상태 공유 컨테이너 (`activeTabKey` lift); 탭 전환 시 해당 키의 case study 목록 연동 렌더링
- `products/homepage/config/types.ts` — 제품·홈·미디어·회사소개 SoT 타입 계약 분리 (`ProductConfig`, `caseStudies: Record<string, CaseStudy[]>` 등)

### 🔄 Changed
- `products/homepage/app/[locale]/products/[slug]/page.tsx` — `StoreTypes`·`StoreCaseStudies` 직접 조립 → `StoreInteractiveContainer` 단일 래퍼로 교체
- `products/homepage/components/sections/products/StoreTypes.tsx` — 탭 상태 `activeKey`·`onTabChange` prop 외부화; 카드 배경 `bg-sand-200`·semantic 타이포·spacing 토큰 적용; `objectPosition` per-card 지원
- `products/homepage/config/site.ts` — `caseStudies`를 탭 키(`standard`·`micro`) 기반 `Record<string, CaseStudy[]>` 구조로 전환; unmanned-store 도입 사례 데이터 탭별 분리
- `products/homepage/components/sections/products/ProductFeatures.tsx` — `bg-sand-filled-tertiary`·`rounded-fai-m`·semantic 텍스트 토큰 정리
- `products/homepage/components/sections/products/ProductBenefits.tsx` — `container`·design token 클래스 체계로 inline style 제거
- `products/homepage/components/sections/products/ProductIndustries.tsx` — semantic 타이포·spacing 토큰 정리
- `products/homepage/components/sections/products/ProductHero.tsx` — `heroVideo` 폴백·HeroShell 정렬 레이아웃
- `products/homepage/components/sections/products/ProductReviews.tsx` — 패딩 배분형 full-bleed 슬라이더·`imageObjectPosition`·토큰 클래스 체계
- `products/homepage/assets/icon/ReviewIcon.tsx` — 32×32 mask SVG (bakery·cafeteria·resort) 및 semantic icon 토큰 적용
- `products/homepage/tailwind.config.ts` — container·sand 팔레트 관련 보완

---

## [2.0.0] - 2026-06-15
### ✅ Added
- `packages/ui/components/button/IconButton.tsx` — `secondary` variant 추가 (bg-filled-optional-brand-secondaryBtn, text-text-basic-primary)

### 🔄 Changed
- `packages/ui/components/navigation/MegaNavMenu.tsx` — [채용] 외부 링크 렌더링 전면 리팩토링: `NavItem`에 `ariaLabel?` 필드 추가; regular segment에서 `external` 항목 분리 후 독립 렌더링 (w-[83px] h-3xl, py-s px-ms gap-3xs, 대각선 화살표 SVG); `dark:` prefix로 투명/라이트 모드 텍스트 색상 분기; 드롭다운 트리거 버튼 `cursor-pointer` 추가; `ArrowUpRight` (lucide) → 디자이너 명세 SVG 교체; `Fragment` import 추가
- `packages/ui/components/navigation/GlobalUtilityMenu.tsx` — 모바일 외부 링크([채용]) `aria-label={item.ariaLabel}` 연동; `ArrowUpRight` (lucide) → 디자이너 명세 SVG 교체 (mask ID `_m` 접미사로 충돌 방지)
- `packages/ui/components/NavigationBar.tsx` — NAV_ITEMS 채용 항목에 `ariaLabel: "파인더스에이아이 채용 홈 바로가기(새창)"` 주입
- `products/homepage/components/layout/LanguageSwitcher.tsx` — 데스크톱 트리거 `trigger="click"` → `trigger="hover"` 전환 (Dropdown 내장 hover 딜레이 클로즈 활용); 데스크톱·모바일 버튼 `cursor-pointer` 추가
- `products/homepage/components/sections/media/ShowcaseSection.tsx` — SocialCard `LinkedInIcon`·`InstagramIcon` SVG 추가; SocialCard 레이아웃 재구성 (group/card named group 기반 대각선 스와이프 애니메이션); ProgressBar `<button>` 인터랙티브 구조 리팩토링; YouTube CTA `<a>` 외부링크 래퍼 추가; section gap `gap-3xl` 토큰 교정
- `products/homepage/config/site.ts` — socials href 실제 URL(Instagram·LinkedIn) 주입

---

## [1.9.0] - 2026-06-12
### ✅ Added
- `packages/ui/components/button/IcoTxtButton.tsx` — 아이콘+텍스트 결합 버튼 공통 컴포넌트 신규 생성 (XL/L/M/S 4단계 사이즈, Primary/Secondary variant, Square/Round shape, S+Square 전용 6px radius 예외 규칙, isImpact/isLoading, after: 오버레이 다중 배경 패턴)
- `products/homepage/components/layout/Footer.tsx` — 홈페이지 전용 Footer 신규 생성 (ScrollTopButton 컴포넌트 조립)
- `products/homepage/components/layout/ScrollTopButton.tsx` — Framer Motion 롤링 교체 애니메이션 적용 탑 스크롤 버튼 (motion.div 상태 전파 + ReactNode icon 주입, 스크롤 300px fade-in/out)
- `products/homepage/app/[locale]/playground/page.tsx` — IcoTxtButton 전체 조합(Variant/Size/Shape/Impact/Loading/Disabled) 사용 예시 페이지
- `packages/ui/index.ts` — `IcoTxtButton`, `IcoTxtButtonProps` export 추가

### 🔄 Changed
- `packages/ui/components/button/IconButton.tsx` — 전면 개편: XL/L/M/S 4단계 사이즈 매트릭스(paddingMap/iconSizeMap), after: 가상 오버레이 인터랙션 패턴, 원형 고정(shape morphing 제거), Framer Motion 의존성 제거 → CSS group 기반 롤링 애니메이션, ReactNode icon prop 수용 통로 개방, 인터랙션 색상 CSS 변수 단독 참조(fallback rgba/hex 제거)
- `packages/ui/components/button/IcoTxtButton.tsx` — 인터랙션 색상 CSS 변수 단독 참조 교체(다크 모드 자동 대응)
- `packages/ui/components/ScrollTopButton.tsx` — Framer Motion spring 애니메이션 적용 (scroll visibility 유지)
- `products/homepage/components/sections/about/AboutPeople.tsx` — titleSection과 buttonSection 동일 행(flex justify-between) 나란히 배치로 레이아웃 개편
- `products/homepage/components/sections/products/ProductReviews.tsx` — 타이틀 섹션에 좌우 화살표 버튼 추가 (AboutPeople 구조 통일), `size="L"` 교정
- `packages/ui/components/button/IconButton.tsx` — size prop `"l"|"xl"` → `"L"|"XL"` 대문자 표기 통일; 기존 호출부(AboutPeople, ProductReviews, ScrollTopButton) 일괄 교정

---

## [1.8.0] - 2026-06-11
### ✅ Added
- `.cursorrules` — 3대 아키텍처 규칙 및 3단계 사고 프로토콜 프로젝트 루트 등록
- `products/homepage/app/[locale]/about/page.tsx` — 회사소개 라우트 신규 구축 (AboutHero → AboutPartners → AboutLogos → AboutManagement 순차 조립)
- `products/homepage/components/sections/about/AboutLogos.tsx` — 투자사·정부지원 로고 그리드 섹션 신규 생성
- `products/homepage/components/sections/about/AboutManagement.tsx` — 경영진 소개 섹션 신규 생성 (겹침 레이아웃·NAME_GRADIENT·페이드 마스크)
- `products/homepage/config/site.ts` — `aboutConfig`에 `investors`(investment·government 그룹)·`management`(4인 멤버) SoT 완비

### 🔄 Changed
- `products/homepage/config/site.ts` — `management.members` photo 경로 실제 파일명(`member-{role}-{id}.png`)으로 정정; 홍석범 CTO 학력 `\n` 개행 삽입
- `products/homepage/components/sections/about/AboutManagement.tsx` — 썸네일 `312×280` 규격; `fill` + `relative` 래퍼로 Image 렌더링 안정화; name박스 `top-1/2 -translate-y-1/2` 수직 중앙 정렬; stroke `border-t-[0.5px] border-[var(--color-border-secondary)]` 0.5px 정밀 구분선; `whitespace-pre-line` 개행 렌더링
- `root/foundation/docs/spacing.md` — cornerRadius 전체 스케일 테이블 추가
- `products/homepage/root/foundation/docs/spacing.md` — `fai-` 접두어 Tailwind 예시 정정; cornerRadius `none`·`2xs` 행 추가 및 `xs` rem 값 교정
- `root/foundation/docs/color-semantic.md` / `products/homepage/root/foundation/docs/color-semantic.md` — sand 시맨틱 토큰 섹션 추가
- `root/foundation/docs/color-global.md` / `products/homepage/root/foundation/docs/color-global.md` — sand 팔레트 행 추가

---

## [1.7.0] - 2026-06-10
### ✅ Added
- `products/homepage/components/sections/products/StoreHero.tsx` — 이미지 히어로; `HeroShell` + next/image 풀블리드·그라데이션 오버레이
- `products/homepage/components/sections/products/StoreEffects.tsx` — 효과 카드·리스트 섹션; 인터랙션 아이콘 SVG·탭 전환 UI
- `products/homepage/components/sections/products/StoreTypes.tsx` — 매장 유형 탭·카드 그리드; `@/components/ui/Tabs` 연동
- `products/homepage/components/sections/products/StoreCaseStudies.tsx` — 도입 사례 캐러셀; 브랜드·매장·이미지 바인딩
- `products/homepage/components/layout/HeroShell.tsx` — 제품 히어로 공통 셸 (미디어 슬롯·CTA·locale-aware 링크)
- `products/homepage/components/ui/Tabs.tsx` — StoreTypes용 탭 UI 컴포넌트
- `products/homepage/config/site.ts` — `heroType`·`heroVideo`·`heroImage` 분기; `unmanned-store` effects·storeTypes·caseStudies SoT 완비; storeTypes 카드 이미지 경로 `/images/` 프리픽스 교정

### 🔄 Changed
- `products/homepage/components/ui/Tabs.tsx` — 래퍼 `flex-1` 제거; `justify-center items-center gap-[32px]` 피그마 정렬 명세 적용
- `products/homepage/components/sections/products/StoreTypes.tsx` — 카드 섹션 래퍼 `flex flex-col gap-[40px]`; 섹션 타이틀 `text-[36px] leading-[54px]`; 카드 프레임 `p-[48px] rounded-[16px] bg-[#ECEAE4]`; 일반 카드 `h-[640px]` / 와이드 카드 `h-[430px]`; 오버레이 `rgba(23,25,28,0.50→0.00)`; 타이포 `text-[28px] font-semibold` / `text-[#D2D3D5] text-[18px]` 피그마 전면 동기화
- `products/homepage/app/[locale]/products/[slug]/page.tsx` — `heroType` video/image 분기 (`ProductHero` / `StoreHero`); StoreEffects·StoreTypes·StoreCaseStudies 통합; `unmanned-store` CtaBanner 제외
- `products/homepage/assets/icon/ReviewIcon.tsx` — 32×32 피그마 mask SVG 전면 교체 (bakery·cafeteria·resort); semantic `icon-tag-category` 토큰 적용
- `products/homepage/components/sections/products/ProductHero.tsx` — `MISSING_FROM_DESIGN` 폴백 비디오; HeroShell 명세 정렬 레이아웃
- `products/homepage/components/sections/products/ProductReviews.tsx` — `"use client"`·`sliderRef`; 패딩 배분형 full-bleed 슬라이더 (`pl/pr/scroll-pl` 150px); 디자인 토큰·`bg-surface-alt` 클래스 체계; `imageObjectPosition` 분기
- `products/homepage/components/sections/products/ProductBenefits.tsx` — `container`·semantic 타이포·spacing 토큰으로 inline style 제거
- `products/homepage/components/sections/products/ProductFeatures.tsx` — `bg-sand-filled-tertiary`·`rounded-fai-m`·semantic 텍스트 토큰 적용
- `products/homepage/components/sections/products/ProductIndustries.tsx` — semantic 타이포·spacing 토큰 정리

---

## [1.6.0] - 2026-06-09
### ✅ Added
- `products/homepage/app/[locale]/products/[slug]/page.tsx` — 제품 상세 페이지 신규 구축; ProductHero·ProductFeatures·ProductBenefits·ProductIndustries·ProductReviews 섹션 순차 통합
- `products/homepage/components/sections/products/ProductIndustries.tsx` — 주요 적용 산업 섹션; next/image fill 모드, 그라데이션 오버레이, 모바일 반응형
- `products/homepage/components/sections/products/ProductReviews.tsx` — 고객사 도입 후기 섹션; Peek & Snap 가로 슬라이더, QuoteSegment 배열 기반 강조 렌더링, 모바일 반응형
- `products/homepage/assets/icon/ReviewIcon.tsx` — 리뷰 아이콘 팩토리 컴포넌트 신규 생성 (bakery·cafeteria·resort SVG 완비); 글로벌 에셋 경로로 정착
- `products/homepage/config/site.ts` — `QuoteSegment` 타입 export 추가; VCO reviews 데이터 세그먼트 배열 구조로 전면 개편 (emphasis 필드 기반 강조 문구 분리)

### 🔄 Changed
- `products/homepage/components/sections/products/ProductFeatures.tsx` — 데스크탑 컨테이너 패딩 150px 정합; 카드 0·1·2 텍스트 래퍼 분리(z-10), 배경 이미지 피그마 정밀 수치 반영
- `products/homepage/components/sections/products/ProductBenefits.tsx` — BenefitIcon·InViewVideo 연동; BenefitItem subtitle 타입 교정; 미디어/텍스트 블록 sticky 레이아웃
- `products/homepage/components/sections/products/ProductReviews.tsx` — split 기반 highlight 로직 → QuoteSegment 배열 map 렌더링으로 전면 교체; 아이콘 래퍼 p-[12px] 교정; import 경로 @/assets/icon으로 이전; 후기 이미지 `next/image` `fill`·`object-cover`·`sizes` 최적화 체결; `bg-fill-faint` 플레이스홀더 → 실제 에셋 바인딩; `alt={`${review.store} 전경`}` 접근성 적용
- `products/homepage/config/site.ts` — heroTitle (VCO) 제거; features 이미지 경로 실제 에셋으로 교체; benefits·industries·reviews 전체 데이터 완비; quote string → QuoteSegment[] 구조 전환; reviews `image` 확장자 `.webp` → `.png` (`/products/reviews/vco-review-{bakery,cafeteria,resort}.png`)
- `products/homepage/tailwind.config.ts` — container screens.desktop 1140px→1440px, padding.desktop 9.375rem(150px) 교정

### 🗑️ Removed
- `products/homepage/components/sections/products/icons/ReviewIcon.tsx` — assets/icon/으로 이전 후 삭제

---

## [1.5.0] - 2026-06-08
### ✅ Added
- `packages/ui/components/navigation/GlobalUtilityMenu.tsx` — 글로벌 유틸리티 메뉴 컴포넌트 신규 작성; Dropdown(S)·Menu(M) 래핑 아키텍처, 드롭다운/외부링크/내부링크 분기 렌더링, locale prefix 처리, Drawer onClose 버블링 제어(stopPropagation)
- `products/homepage/public/images/main/imageSection-hero-2.png` — 히어로 섹션 대체 이미지 추가

### 🔄 Changed
- `packages/ui/components/marquee/Marquee.tsx` — CSS 변수(`--marquee-duration`) inline style 방식으로 전환 (Tailwind 동적 클래스 빌드 타임 스캔 이슈 해결); 풀블리드 래퍼에서 `-mx-[50vw]` 제거로 뷰포트 오프셋 버그 수정
- `packages/ui/components/Header.tsx` — 문의하기 CTA 버튼에 디자인 시스템 토큰 적용 (`rounded-fai-s`, `bg-fill-strong`, `px-l`, `py-s`, `text-body-s`, `text-inverse`)
- `packages/ui/components/Button.tsx` — tone/size/shape/impact/loading 옵션 체계 전면 정비; foundation 토큰 기반 스타일링 적용 (`py-m`, `px-xl`, `h-3xl`, `rounded-fai-s/circle` 등)
- `products/homepage/app/[locale]/layout.tsx` — main 영역 상단 패딩 `pt-4xl` 적용

---

## [1.4.0] - 2026-06-05
### 🔄 Changed
- `products/homepage/public/images/` — 디렉토리 구조 정비: `homepage/` → `main/`으로 리네임, `customers/`, `videos/` 디렉토리 신규 생성
- `products/homepage/app/[locale]/page.tsx` — `ImageSection` src를 `/images/main/imageSection-hero.png`로 교체, `priority` 명시; `CUSTOMER_IMAGES` 배열 실제 파일명 + `name` 안정 키로 전면 업데이트
- `products/homepage/components/sections/CustomersSection.tsx` — `CustomerImage` 인터페이스에 `name` 필드 추가; `DEFAULT_IMAGES` 배열을 실제 파일명 및 디자이너 지정 순서(01~07)로 재정렬; `<Image />` 방식을 `fill` → `width={369} height={420}` 고정 치수로 전환(CLS 차단); `key={i}` → `key={image.name}` 안정 키로 교체; 서브카피 문구 업데이트
- `products/homepage/components/sections/CtaBanner.tsx` — `<Image fill>` 기반 멀티 레이어 구조 완성(`-z-20` 배경 / `-z-10` 그라데이션 스크림 / `z-10` 콘텐츠); h2 타이틀에 `flex-1 text-[36px]` 피그마 정밀 수치 반영

### ✅ Added
- `products/homepage/public/images/customers/` — 실제 고객사 이미지 7종 배치 (bakery-hansangmin, bakery-mannamil→mannamil, foodCourt-niseko-1/2, retail-hibinoma/shokunoma/wellstory)
- `products/homepage/public/images/main/` — `imageSection-hero.png`, `cta-banner-gradation.png` 배치
- `products/homepage/public/videos/` — 디렉토리 신규 생성 (`.gitkeep`)

---

## [1.3.0] - 2026-06-05
### ✅ Added
- `products/homepage/components/sections/HeroSection.tsx` — `packages/ui`에서 로컬 이전, `@fai/ui`에서 LogoMarquee import
- `products/homepage/components/sections/ImageSection.tsx` — `packages/ui`에서 로컬 이전; sticky 스크롤 핀(pinDuration 200vh), `object-cover object-bottom`, `h-dvh`
- `products/homepage/components/sections/AnimatedStat.tsx` — 뷰포트 진입 시 숫자 셔플→정착 애니메이션 (IntersectionObserver + rAF, easeOutQuint)
- `products/homepage/components/SmoothScroll.tsx` — Lenis 기반 전역 부드러운 스크롤 (duration 1.6, easeOutExpo)
- `lenis ^1.3.23` 패키지 설치

### 🔄 Changed
- `products/homepage/components/sections/CaseStudySection.tsx` — AnimatedStat 연결; STATS 데이터를 `target/decimals/suffix` 구조로 변경 (3초, 99.7%, 12000건)
- `products/homepage/components/sections/AnimatedStat.tsx` — 셔플 1400ms·정착 1800ms, 범위 ±20%, ~15fps 제한, easeOutQuint으로 스무스하게 조정
- `products/homepage/app/[locale]/layout.tsx` — SmoothScroll로 전체 레이아웃 래핑
- `packages/ui/index.ts` — HeroSection, ImageSection export 제거 (로컬 이전)
- `products/homepage/app/[locale]/page.tsx` — 실제 고객사 이미지 경로 및 `imageSection-hero.png` 적용

### 🗑️ Removed
- `packages/ui/components/HeroSection.tsx` export (products/homepage로 이전)
- `packages/ui/components/sections/ImageSection.tsx` export (products/homepage로 이전)

## [1.2.0] - 2026-06-04
### ✅ Added
- `packages/ui/components/navigation/DesktopMenu.tsx` — HoverDropdown 래핑, `useParams` 기반 locale-aware 링크
- `packages/ui/components/navigation/MobileMenu.tsx` — Drawer 연동, 콘텐츠 렌더링 전담
- `packages/ui/components/ui/HoverDropdown.tsx` — 호버 드롭다운 뼈대 컴포넌트 (trigger 렌더 함수 패턴)
- `packages/ui/components/ui/Drawer.tsx` — 모바일 오버레이 껍데기 컴포넌트

### 🔄 Changed
- `packages/ui/components/NavigationBar.tsx` — DesktopMenu·MobileMenu·Drawer 래핑 아키텍처로 전면 리팩토링; NAV_ITEMS에 `dropdownItems` 필드 추가; contact 버튼에 Button 디자인 시스템 토큰 적용
- `packages/ui/components/Header.tsx` — `@/config/site` 외부 의존 제거, 데이터 인라인으로 전환
- `packages/ui/index.ts` — DesktopMenu·MobileMenu·HoverDropdown·Drawer·NavItem 타입 export 추가

### 🗑️ Removed
- `products/homepage/root/components/` 디렉토리 전체 삭제 (NavigationBar·DesktopMenu·MobileMenu·HoverDropdown·Drawer·Button·Footer·Header·HeroSection)
- 모든 컴포넌트를 `packages/ui/components/`로 완전 이전, 파편화 해소

### 🏛️ Architecture
- 3대 아키텍처 규칙 정착: `packages/ui` = 공통 부품 창고 / `root/` = 글로벌 토큰 통제실 / `products/` = 최종 조립 공장
- `products/homepage/root/`에 디자인 토큰(JSON/CSS)만 잔류

---

## [Unreleased] - 2026-06-04
### 🐛 Fixed
- `next-intl` 미설치로 발생하던 `i18n/request.ts` 타입·모듈 해석 오류 해결 (루트 `npm install`)
- `src/app`과 `app` 중복으로 인한 `@/components/NavigationBarBridge` 빌드 실패 해결

### ✅ Changed
- `LanguageSwitcher`, `NavigationBarBridge`를 `products/homepage/components/`로 정리 (`@/*` alias와 일치)
- `app/[locale]/layout.tsx`에서 `NavigationBar` 대신 `NavigationBarBridge` 사용 (locale 전환 UI 연동)
- 중복 `products/homepage/src/` 디렉터리 제거

## [1.0.0] - 2026-03-31
### ✅ Added
- 디자인 시스템 초기 아키텍처 구축
- `design-system.md` (마스터 가이드) 수립
- `component-template.md` (표준 양식) 수립
- 기본 폴더 구조 생성 (`foundation/`, `components/web/`, `components/tablet/`)

### 🏗️ In Progress
- `foundation/` 내 글로벌 컬러 및 타이포그래피 데이터 입립 예정
- 웹/태블릿 공용 버튼 컴포넌트 설계 중
