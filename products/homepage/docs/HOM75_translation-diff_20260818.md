> ## ⚠️ 이 대조표는 불완전하다 (2026-08-19 검증)
>
> ko 원문을 조인 키로 써서 **`media.*` 키를 한 건도 다루지 않았다**(유튜브 탭 미대조 → 실제로 15건 불일치).
> 또 ko가 변경된 행과 시트 줄바꿈 규약 행을 놓친다. CSV 직접 대조 결과 고유 (key, locale) 불일치는
> 이 문서의 65건이 아니라 **89건 + 유튜브 15건**이었고, 이 중 1건(`contact.complete.title` en)은 오탐이었다.
>
> **최신 기준선과 실행 계획은 `HOM75_plan_20260819.md`를 볼 것.** 이 문서는 기록용으로만 남긴다.

# HOM-75 번역 시트 ↔ messages 대조표

생성: 2026-08-18 / 시트: **Homepage text source**(2026-08-11 갱신) / 대조 기준 커밋: develop `410604b`

## 왜 이 문서가 있나

시트가 2026-08-11에 갱신됐는데 코드의 마지막 번역 반영은 2026-08-05다. 6일치가 밀려 있다.
**ko 원문을 조인 키**로 시트 271행을 messages(ko/en/ja)와 대조한 결과를 아래에 남긴다.

## ⚠️ 기계적 일괄 덮어쓰기 금지

시트가 항상 정답이 아니다. 아래 세 가지가 섞여 있다.

1. **코드 쪽이 "마케팅 확정안"으로 문서화된 건** — 예: `products.visionCheckout.reviews.1.category` 는
   시트가 `給食`이지만 코드는 `社員食堂・学生食堂`이고, `i18n/messageConsistency.test.ts` 에
   "일본어권에서는 사내·학생 식당으로 풀어 쓰는 것이 마케팅 확정안"이라는 근거가 남아 있다.
   시트로 덮으면 확정된 결정을 되돌리고 테스트도 깨진다.
2. **이후 의도적으로 바꾼 건** — ja 주소 `キル` 표기(도로명주소 번역 규정)와 `〒06628` 우편번호,
   일본 법인 정보. 시트에는 아직 옛 값이라 되돌아갈 위험이 있다(시트 수정 요청은 Slack 공유 완료).
3. **행 오배치 의심** — 뜻이 완전히 다른 쌍이 있다. 시트에서 순서가 바뀌었거나 ko 조인이 잘못
   걸린 경우다. 기존 회귀 테스트가 막으려던 "번역문 오배치" 유형이라 그대로 넣으면 사고가 난다.

## 제외 범위

카드에 명시된 대로 **ja 푸터 추가분(시트 16:20행)은 이 작업에서 제외**한다.

## 적용 절차 제안

1. 아래 "실제 내용 불일치"를 한 건씩 ko 원문 매칭을 재확인하며 반영(오배치 차단)
2. "판단 필요"는 마케팅 확인 후 결정 — 코드 확정안 vs 최신 시트
3. "공백·줄바꿈 차이"는 디자인 의도(줄바꿈)인지 확인 후 반영
4. 적용 후 `pnpm test`(특히 `messageConsistency.test.ts`) 통과 + ko/en/ja 렌더 실측

---


## 실제 내용 불일치 — 55건

> 시트가 최신일 가능성이 높다. 다만 뜻이 완전히 다른 쌍은 행 오배치를 의심할 것.

### `home.hero.tagline` (en)

| | 값 |
|---|---|
| ko 원문 | No Staff, No Problem. |
| **시트** | Trouble Finding Staff? |
| 코드 | Trouble Finding Staff? No Problem. |

### `home.hero.subtitle` (ja)

| | 값 |
|---|---|
| ko 원문 | Next-Gen AI Retail Automation |
| **시트** | 次世代AIリテールソリューション |
| 코드 | 次世代AIリテールオートメーション |

### `home.hero.subtitle` (en)

| | 값 |
|---|---|
| ko 원문 | Next-Gen AI Retail Automation |
| **시트** | Start with AI Retail Automation |
| 코드 | Next-Gen AI Retail Automation |

### `home.whyFai.items.1.title` (ja)

| | 값 |
|---|---|
| ko 원문 | 최소 인력으로 최대 효율을 |
| **시트** | 店舗運営をシンプルに |
| 코드 | 店舗運営をもっとシンプルに |

### `home.whyFai.items.1.title` (en)

| | 값 |
|---|---|
| ko 원문 | 최소 인력으로 최대 효율을 |
| **시트** | Smarter Staffing |
| 코드 | Still Running, Even Short-Handed |

### `home.whyFai.items.1.description` (en)

| | 값 |
|---|---|
| ko 원문 | 단순 계산 업무는 똑똑한 AI에 맡기고, 사장님은 더 가치 있는 매장 관리에 집중하세요 |
| **시트** | AI handles the checkout Your staff handles the store |
| 코드 | AI handles the checkout, your staff handles the store |

### `home.whyFai.items.2.title` (en)

| | 값 |
|---|---|
| ko 원문 | 막힘없는 고객 경험 |
| **시트** | Seamless Shopping |
| 코드 | Seamless Customer Experience |

### `common.cta.reviewsMore` (en)

| | 값 |
|---|---|
| ko 원문 | 실제 도입 후기 더보기 |
| **시트** | Case Studies |
| 코드 | More Customer Stories |

### `home.efficiency.subtitle` (en)

| | 값 |
|---|---|
| ko 원문 | 숫자로 증명된 압도적 퍼포먼스, 매장의 기준을 바꿉니다 |
| **시트** | Proven in live stores |
| 코드 | The numbers speak for themselves |

### `products.visionCheckout.heroSubtitle` (en)

| | 값 |
|---|---|
| ko 원문 | 차세대 AI 무인 결제 솔루션 |
| **시트** | Powerful AI Self-Checkout with 14 Cameras |
| 코드 | The Next Generation of AI Self-Checkout |

### `products.visionCheckout.features.0.description` (ja)

| | 값 |
|---|---|
| ko 원문 | 국내 유일 멀티뷰 3D 인식 기술을 적용했어요 |
| **시트** | マルチビュー3D認識技術を採用しています |
| 코드 | マルチビュー3D認識技術を採用 |

### `products.visionCheckout.features.0.description` (en)

| | 값 |
|---|---|
| ko 원문 | 국내 유일 멀티뷰 3D 인식 기술을 적용했어요 |
| **시트** | Nothing gets past 14 AI cameras |
| 코드 | Sees every item in 3D, from every angle |

### `products.visionCheckout.features.1.description` (ja)

| | 값 |
|---|---|
| ko 원문 | 사용 중인 POS 그대로 사용할 수 있어요 |
| **시트** | 注文から決済まで、1台で完結します |
| 코드 | 専用管理システムから売上データをいつでも確認できます |

### `products.visionCheckout.benefitsTitle` (en)

| | 값 |
|---|---|
| ko 원문 | 어떻게 달라질까요? |
| **시트** | What Can You Expect? |
| 코드 | What Changes for Your Store? |

### `products.visionCheckout.benefits.0.eyebrow` (en)

| | 값 |
|---|---|
| ko 원문 | 구매 과정의 간소화 |
| **시트** | Seamless Checkout |
| 코드 | Frictionless Checkout |

### `products.visionCheckout.benefits.0.items.0.subtitle` (en)

| | 값 |
|---|---|
| ko 원문 | 쉬운 사용법 |
| **시트** | Intuitive UX |
| 코드 | Easy to Use |

### `products.visionCheckout.benefits.0.items.1.subtitle` (en)

| | 값 |
|---|---|
| ko 원문 | 품목 제한 없는 AI 인식 기술 |
| **시트** | Customer-Friendly Self-Service |
| 코드 | Whatever You Sell, AI Reads It |

### `products.visionCheckout.benefits.0.items.1.description` (en)

| | 값 |
|---|---|
| ko 원문 | 바코드가 없는 상품인 빵, 샐러드, 구내식당 메뉴, 부품까지 3D Vision AI가 정확히 인식하여 품목 제한 없이 무인화가 가능해요 |
| **시트** | Easier to use than self-checkout |
| 코드 | Pastries, salads, cafeteria meals, even nuts and bolts: Vision AI rings them all up |

### `products.visionCheckout.benefits.1.eyebrow` (en)

| | 값 |
|---|---|
| ko 원문 | 인력 리스크 관리 |
| **시트** | Smarter Staffing |
| 코드 | The Staffing Issue? No Problem |

### `products.visionCheckout.benefits.1.title` (en)

| | 값 |
|---|---|
| ko 원문 | 구인 스트레스 없는 매장 |
| **시트** | Optimize Your Store Operation |
| 코드 | Short-Staffed? No Problem |

### `products.visionCheckout.benefits.1.items.0.description` (en)

| | 값 |
|---|---|
| ko 원문 | VCO가 단순 계산 업무를 대신하여 사장님의 인건비 부담이 줄어 합리적인 매장 운영이 가능해요 |
| **시트** | VCO covers the checkout, your staff focuses elsewhere |
| 코드 | VCO covers the checkout, Your staff focus elsewhere |

### `products.visionCheckout.benefits.1.items.1.subtitle` (en)

| | 값 |
|---|---|
| ko 원문 | 근무자 채용 및 교육 부담 해소 |
| **시트** | Up to Speed From Day One |
| 코드 | Never Needs Hiring or Training |

### `products.visionCheckout.benefits.2.eyebrow` (en)

| | 값 |
|---|---|
| ko 원문 | 수익성 개선 |
| **시트** | Boost Your Margins |
| 코드 | Sell More, Spend Less |

### `products.visionCheckout.benefits.2.items.1.subtitle` (en)

| | 값 |
|---|---|
| ko 원문 | 디지털 소외 없는 언택트 환경 |
| **시트** | Longer Working Hours |
| 코드 | Self-Service Everyone Can Use |

### `products.visionCheckout.industriesDescription` (en)

| | 값 |
|---|---|
| ko 원문 | 짧은 시간에 많은 사람이 몰리는 공간에서 바코드 없는 물건도 빠르게 결제할 수 있어요 |
| **시트** | Where Crowds Surge and Self-Checkout Kiosks Fall Short |
| 코드 | Fast checkout for crowded venues, barcode or not |

### `products.visionCheckout.reviewsTitle` (en)

| | 값 |
|---|---|
| ko 원문 | 고객사 도입 후기 |
| **시트** | Case Studies |
| 코드 | Customer Stories |

### `products.visionCheckout.reviews.1.store` (en)

| | 값 |
|---|---|
| ko 원문 | 대형급식 W사 관리자 |
| **시트** | Manager, major cafeteria operator 'W' |
| 코드 | Manager, major foodservice operator 'W' |

### `products.visionCheckout.reviews.2.category` (en)

| | 값 |
|---|---|
| ko 원문 | 리조트 |
| **시트** | Ski Resort |
| 코드 | Resort |

### `products.unmannedStore.effectsTitle` (en)

| | 값 |
|---|---|
| ko 원문 | WALK-THROUGH의 효과를 경험해 보세요 |
| **시트** | What Can You Expect? |
| 코드 | What You Get With WALK-THROUGH |

### `products.unmannedStore.effectCards.0.description` (en)

| | 값 |
|---|---|
| ko 원문 | 최소 인력으로 운영해요 |
| **시트** | Staff smarter |
| 코드 | Runs without extra hires |

### `products.unmannedStore.effectCards.1.title` (en)

| | 값 |
|---|---|
| ko 원문 | 결제 무인화 |
| **시트** | Unmanned Checkout |
| 코드 | Automated Checkout |

### `products.unmannedStore.effectCards.1.description` (ja)

| | 값 |
|---|---|
| ko 원문 | 바코드를 찍을 필요 없어요 |
| **시트** | バーコードスキャンは 不要です |
| 코드 | バーコードのスキャンは不要です |

### `products.unmannedStore.effectCards.2.description` (en)

| | 값 |
|---|---|
| ko 원문 | 실시간으로 현황을 알려줘요 |
| **시트** | Monitor real-time status from anywhere |
| 코드 | Real-time status, wherever you are |

### `products.unmannedStore.effectList.0.title` (en)

| | 값 |
|---|---|
| ko 원문 | 차별화된 VISION-AI 기술력 |
| **시트** | Fits Any Venue |
| 코드 | How Our VISION-AI Is Different |

### `contact.interests.store.options.standard-store` (ja)

| | 값 |
|---|---|
| ko 원문 | STANDARD STORE |
| **시트** | STANDARD STORE |
| 코드 | 標準店舗 |

### `products.unmannedStore.storeTypes.0.cards.1.description` (ja)

| | 값 |
|---|---|
| ko 원문 | 실제 운영 중인 매장들에서 검증된 우수한 정확도를 바탕으로 새로운 매장을 시작해보세요 |
| **시트** | 実際に運営中の店舗で実証された高精度により 新しい店舗を安心してスタートできます |
| 코드 | 実際に運営中の店舗で実証された高精度をもとに、新しい店舗を安心してスタートできます |

### `products.unmannedStore.storeTypes.0.cards.1.description` (en)

| | 값 |
|---|---|
| ko 원문 | 실제 운영 중인 매장들에서 검증된 우수한 정확도를 바탕으로 새로운 매장을 시작해보세요 |
| **시트** | Trust the solution with a proven track record |
| 코드 | Launch with accuracy already proven in live stores |

### `products.unmannedStore.storeTypes.0.cards.2.title` (en)

| | 값 |
|---|---|
| ko 원문 | 운영 효율성 증대 |
| **시트** | Store Operations at Your Fingertips |
| 코드 | Smarter Store Operations |

### `products.unmannedStore.storeTypes.0.cards.2.description` (ja)

| | 값 |
|---|---|
| ko 원문 | 오프라인도 온라인처럼 매장 내 데이터를 활용해 최적의 운영 방향성을 결정하세요 |
| **시트** | オフラインでもオンラインのように店舗データを活用し 最適な運営を実現します |
| 코드 | オフラインでもオンラインのように店舗データを活用し、最適な運営を実現します |

### `products.unmannedStore.storeTypes.0.cards.2.description` (en)

| | 값 |
|---|---|
| ko 원문 | 오프라인도 온라인처럼 매장 내 데이터를 활용해 최적의 운영 방향성을 결정하세요 |
| **시트** | Read the data on the app, and run your store like an online one |
| 코드 | Run offline like online, letting in-store data drive your decisions |

### `contact.interests.store.options.micro-store` (ja)

| | 값 |
|---|---|
| ko 원문 | MICRO STORE |
| **시트** | MICRO STORE |
| 코드 | 小型店舗（5坪以下） |

### `products.unmannedStore.storeTypes.1.cards.0.description` (ja)

| | 값 |
|---|---|
| ko 원문 | 규격화된 선조립 공법으로, 가장 저렴한 가격에 무인화 매장을 도입하세요 |
| **시트** | 規格化されたプレハブ工法により 低コストで無人店舗を導入できます |
| 코드 | 規格化されたプレハブ工法により、低コストで無人店舗を導入できます |

### `products.unmannedStore.storeTypes.1.cards.0.description` (en)

| | 값 |
|---|---|
| ko 원문 | 규격화된 선조립 공법으로, 가장 저렴한 가격에 무인화 매장을 도입하세요 |
| **시트** | Standardized and modular |
| 코드 | Standardized pre-assembly makes it the most affordable way to go unmanned |

### `products.unmannedStore.storeTypes.1.cards.2.title` (en)

| | 값 |
|---|---|
| ko 원문 | 유휴 공간의 수익화 |
| **시트** | Flexible Layout |
| 코드 | Monetize Idle Space |

### `about.hero.eyebrow` (en)

| | 값 |
|---|---|
| ko 원문 | 리테일 혁신 |
| **시트** | Retail AI |
| 코드 | Retail Innovation |

### `about.investors.groups.0.caption` (en)

| | 값 |
|---|---|
| ko 원문 | 누적 127억원 투자 유치를 통해, 글로벌 사업성과 성장성을 인정받고 있습니다 |
| **시트** | ₩12.7B raised to date |
| 코드 | ₩12.7B raised to date, backing our global growth |

### `about.investors.groups.1.caption` (en)

| | 값 |
|---|---|
| ko 원문 | 정부의 주요 딥테크 육성 프로그램에 선정되며, 시장을 선도할 압도적인 기술력을 인정받았습니다. |
| **시트** | Selected for Korea's deep-tech support programs |
| 코드 | Selected for Korea's deep-tech support programs. |

### `about.people.cards.0.title` (en)

| | 값 |
|---|---|
| ko 원문 | AI로 세상을 더 이롭게 만드는 기술을 만드는 일 |
| **시트** | We want to build AI that moves the world forward |
| 코드 | We build AI that leaves the world better than we found it |

### `about.people.cards.2.title` (ja)

| | 값 |
|---|---|
| ko 원문 | 기술보다 문제, 속도보다 방향, 구현보다 경험을 고민해요 |
| **시트** | 技術より課題、スピードより方向性、実装より体験 |
| 코드 | 技術より課題、スピードより方向性、実装より体験を大切にしています |

### `about.people.cards.2.title` (en)

| | 값 |
|---|---|
| ko 원문 | 기술보다 문제, 속도보다 방향, 구현보다 경험을 고민해요 |
| **시트** | Problems over tech, customer experience over deployment |
| 코드 | Problems over tech, direction over speed, experience over deployment |

### `about.people.cards.3.title` (ja)

| | 값 |
|---|---|
| ko 원문 | 일본 리테일 시장의 새로운 미래를 만들고 있어요 |
| **시트** | 日本のリテール市場に、新しい未来を |
| 코드 | 日本のリテール市場に、新しい未来をつくっています |

### `contact.interests.store.options.standard-store` (ja)

| | 값 |
|---|---|
| ko 원문 | STANDARD STORE |
| **시트** | STANDARD STORE |
| 코드 | 標準店舗 |

### `contact.interests.store.options.micro-store` (ja)

| | 값 |
|---|---|
| ko 원문 | MICRO STORE |
| **시트** | MICRO STORE |
| 코드 | 小型店舗（5坪以下） |

### `contact.complete.title` (en)

| | 값 |
|---|---|
| ko 원문 | 문의 주셔서 정말 감사합니다 |
| **시트** | Thanks for reaching out\! |
| 코드 | Thanks for reaching out! |

### `contact.complete.buttonLabel` (ja)

| | 값 |
|---|---|
| ko 원문 | 계속 둘러보기 |
| **시트** | トップページへ戻る |
| 코드 | サイトへ戻る |


## 판단 필요 — 12건

> 코드 쪽에 문서화된 확정안이거나 ko 원문이 여러 키에 중복 매칭된 건. 사람 확인 필요.

### `about.management.members.0.name` (ja)

| | 값 |
|---|---|
| ko 원문 | 함명원 |
| **시트** | Myungwon Ham |
| 코드 | Myungwon Ham（ハム・ミョンウォン） |

### `about.management.members.1.name` (ja)  ⚠️ ko 중복매칭

| | 값 |
|---|---|
| ko 원문 | 왕민권 |
| **시트** | Minkwon Wang |
| 코드 | Minkwon Wang（ワン・ミングォン） |

### `footer.addressValue` (ja)

| | 값 |
|---|---|
| ko 원문 | 06628 서울특별시 서초구 강남대로51길 1, 511타워 13층 |
| **시트** | 韓国 ソウル特別市 瑞草区 江南大路51ギル1 511タワー13階 |
| 코드 | 〒06628 韓国 ソウル特別市 瑞草区 江南大路51キル 1 511タワー13階 |

### `products.visionCheckout.benefits.1.items.0.subtitle` (ja)  ⚠️ ko 중복매칭

| | 값 |
|---|---|
| ko 원문 | 인건비 절감 |
| **시트** | 人件費を削減 |
| 코드 | 人件費の削減 |

### `products.visionCheckout.benefits.1.items.0.subtitle` (en)  ⚠️ ko 중복매칭

| | 값 |
|---|---|
| ko 원문 | 인건비 절감 |
| **시트** | Save on Operating Costs |
| 코드 | Save on OPEX |

### `products.visionCheckout.reviews.1.category` (ja)  ⚠️ ko 중복매칭

| | 값 |
|---|---|
| ko 원문 | 급식 |
| **시트** | 給食 |
| 코드 | 社員食堂・学生食堂 |

### `products.visionCheckout.benefits.1.items.0.subtitle` (en)  ⚠️ ko 중복매칭

| | 값 |
|---|---|
| ko 원문 | 인건비 절감 |
| **시트** | Save on Operating Costs |
| 코드 | Save on OPEX |

### `about.management.members.0.name` (ja)

| | 값 |
|---|---|
| ko 원문 | 함명원 |
| **시트** | Myungwon Ham |
| 코드 | Myungwon Ham（ハム・ミョンウォン） |

### `about.management.members.1.name` (ja)  ⚠️ ko 중복매칭

| | 값 |
|---|---|
| ko 원문 | 왕민권 |
| **시트** | Minkwon Wang |
| 코드 | Minkwon Wang（ワン・ミングォン） |

### `about.management.members.2.name` (ja)  ⚠️ ko 중복매칭

| | 값 |
|---|---|
| ko 원문 | 홍석범 |
| **시트** | Sukbom Hong |
| 코드 | Sukbum Hong（ホン・ソクボム） |

### `about.management.members.3.name` (ja)

| | 값 |
|---|---|
| ko 원문 | 이현규 |
| **시트** | Hyunkyu Lee |
| 코드 | Hyunkyu Lee（イ・ヒョンギュ） |

### `products.visionCheckout.reviews.0.category` (ja)  ⚠️ ko 중복매칭

| | 값 |
|---|---|
| ko 원문 | 베이커리 |
| **시트** | ベーカリー・カフェ |
| 코드 | ベーカリー |


## 공백·줄바꿈 차이만 — 3건

> 시트의 공백이 디자인상 줄바꿈 지시일 수 있다.

### `products.visionCheckout.benefits.1.title` (ja)

| | 값 |
|---|---|
| ko 원문 | 구인 스트레스 없는 매장 |
| **시트** | 人手不足に悩まない 店舗運営 |
| 코드 | 人手不足に悩まない店舗運営 |

### `products.unmannedStore.effectCards.0.description` (ja)

| | 값 |
|---|---|
| ko 원문 | 최소 인력으로 운영해요 |
| **시트** | 最小限の人員で 店舗運営を実現します |
| 코드 | 最小限の人員で店舗運営を実現します |

### `products.unmannedStore.effectCards.2.description` (ja)

| | 값 |
|---|---|
| ko 원문 | 실시간으로 현황을 알려줘요 |
| **시트** | リアルタイムで 状況を把握できます |
| 코드 | リアルタイムで状況を把握できます |

