# i18n 마케팅 검수 대상 (en/ja 초벌 번역)

> next-intl 전면 번역 작업의 en/ja 초벌 번역을 누적 기록한다. 각 항목은 마케팅/현지화 검수 후 확정한다.
> **번역 금지 대상**(고유명사·URL·실데이터: 전화 02-6191-0049 / 주소 / 사업자번호 809-86-01657 / contact@fainders.ai)은 검수 대상 아님.

## Phase 1 — common · nav · footer (2026-07-01)

### nav (네비게이션 라벨)
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| nav.products | 제품 | Products | 製品 |
| nav.about | 회사소개 | About | 会社概要 |
| nav.media | 미디어 | Media | メディア |
| nav.careers | 채용 | Careers | 採用 |
| nav.contact | 문의하기 | Contact | お問い合わせ |

### common.cta (공용 CTA — 이번 페이즈에 nav.contact만 실제 배선, 나머지 키는 후속 페이즈에서 소비)
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| common.cta.contact | 문의하기 | Contact | お問い合わせ |
| common.cta.requestDemo | 도입 문의하기 | Request a Demo | 導入のお問い合わせ |
| common.cta.learnMore | 자세히 알아보기 | Learn More | 詳しく見る |
| common.cta.more | 더보기 | More | もっと見る |
| common.cta.quickChat | 빠른 상담하기 | Quick Chat | かんたん相談 |
| common.cta.reviewsMore | 실제 도입 후기 더보기 | More Customer Stories | 導入事例をもっと見る |
| common.cta.mediaMore | 더 알아보기 | Learn More | 詳しく見る |

### footer (푸터 라벨 — 값은 실데이터라 번역 안 함, 라벨만 번역)
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| footer.company | (주) 파인더스에이아이 | Fainders.AI Inc. | Fainders.AI Inc. |
| footer.labels.ceo | 대표이사 | CEO | 代表取締役 |
| footer.labels.tel | 전화 | Tel | 電話 |
| footer.labels.address | 주소 | Address | 住所 |
| footer.labels.bizNo | 사업자등록번호 | Business Reg. No. | 事業者登録番号 |
| footer.labels.email | 이메일 문의 | Email | メールでのお問い合わせ |
| footer.policies.privacy | 개인정보 처리방침 | Privacy Policy | プライバシーポリシー |
| footer.policies.cctv | 영상정보처리기기 운영 · 관리 방침 | CCTV Operation & Management Policy | 映像情報処理機器 運営・管理方針 |

### 회사명(footer.company) 처리 결정 — 검수 필요
- **결정:** 한국어는 등기 상호 그대로 `(주) 파인더스에이아이` 유지. en/ja는 영문 법인 표기 `Fainders.AI Inc.`로 통일.
- **근거:** 상호는 고유명사이나 한글 상호를 en/ja 사용자에게 그대로 노출하면 가독성이 떨어짐. 영문 법인명이 존재하므로 이를 사용.
- **검수 포인트:** `Fainders.AI Inc.`가 실제 등기/영문 공식 표기와 일치하는지 법무·마케팅 확인 필요. 일본어권에서 별도 표기(株式会社 등)가 필요한지도 확인.

### 기타 검수 포인트
- `footer.policies.cctv` en/ja는 의역. 법적 문서명(정책 정식 명칭)과 일치시킬지 검토 필요.
- `common.cta.reviewsMore`(실제 도입 후기 더보기) en "More Customer Stories" / ja "導入事例をもっと見る"는 후속 페이즈에서 실제 섹션 문맥과 함께 재검토.

## Phase 2 — home (2026-07-01)

### home.hero (히어로 헤드라인)
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| home.hero.title1 | 리테일의 미래 | The Future of Retail | リテールの未来 |
| home.hero.title2 | 한발 먼저 시작하세요 | Start One Step Ahead | 一歩先に始めましょう |
| home.hero.tagline | No Staff, No Problem. | No Staff, No Problem. (원문 유지) | No Staff, No Problem. (원문 유지 — 직역 시 어색해 영문 태그라인 유지) |
| home.hero.subtitle | Next-Gen AI Retail Automation | Next-Gen AI Retail Automation (원문 유지) | Next-Gen AI Retail Automation (원문 유지 — 마케팅 태그라인, 일본 시장에서도 영문 노출 관행 감안) |

**검수 포인트:** `tagline`/`subtitle`은 원래 한국어 화면에도 영문 그대로 노출되던 마케팅 태그라인. ja를 직역(スタッフ不要、問題なし。등)할지 원문 유지할지는 브랜드 가이드 확인 후 확정 필요 — 현재는 원문 유지로 초벌 처리.

### home.whyFai (Why FAI 카드)
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| home.whyFai.headline | Why FAI | Why FAI (고유 섹션명 유지) | Why FAI (고유 섹션명 유지) |
| home.whyFai.subheadline | 멈춤 없이, 인건비 추가 없이, 대기줄 없이\n효율적인 매장 운영을 할 수 있습니다. | No stoppages, no added labor cost, no waiting in line\nRun your store at peak efficiency. | 止まらず、人件費を増やさず、待ち時間もなく\n効率的な店舗運営ができます。|
| home.whyFai.items.0.title | 멈춤 없이 매끄러운 결제 | Seamless, uninterrupted checkout | 止まらないスムーズな決済 |
| home.whyFai.items.0.description | 바코드 스캔 없이 쓱 올려두면 결제가 끝나요\n쾌적한 결제 경험이 우리 매장의 매출을 바꿔요 | No barcode scanning — just set items down and checkout is done\nA smooth checkout experience changes your store's revenue | バーコードスキャン不要、置くだけで決済完了\n快適な決済体験が店舗の売上を変えます |
| home.whyFai.items.1.title | 최소 인력으로 최대 효율을 | Maximum efficiency, minimum staff | 最小限の人員で最大の効率を |
| home.whyFai.items.1.description | 단순 계산 업무는 똑똑한 AI에 맡기고, 사장님은 더 가치 있는 매장 관리에 집중하세요 | Let smart AI handle simple calculations, so you can focus on higher-value store management | 単純な計算業務は賢いAIに任せ、オーナー様はより価値のある店舗管理に集中できます |
| home.whyFai.items.2.title | 막힘없는 고객 경험 | A seamless customer experience | ストレスのない顧客体験 |
| home.whyFai.items.2.description | 대기 시간이 줄어든 만큼 기분 좋게 매장을 나선 손님들은 이곳을 다시 찾게 될 거예요 | With shorter wait times, customers leave happier and are more likely to come back | 待ち時間が減った分、気持ちよく店舗を後にしたお客様はまた戻ってきます |

**참고:** `subheadline`은 컴포넌트 계약(prop)에는 존재하나 원본 JSX에도 렌더링되지 않던 미노출 필드 — 번역은 준비해뒀으나 현재 화면에 보이지 않음. 향후 노출 시 재검수.

### home.customers
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| home.customers.title | Customers | Customers (고유 섹션명 유지) | Customers (고유 섹션명 유지) |

CTA는 `common.cta.reviewsMore` 재사용(신규 키 없음).

### home.efficiency (스탯 라벨 — 숫자 자체는 번역 대상 아님)
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| home.efficiency.title | Efficiency | Efficiency (고유 섹션명 유지) | Efficiency (고유 섹션명 유지) |
| home.efficiency.subtitle | 숫자로 증명된 압도적 퍼포먼스, 매장의 기준을 바꿉니다 | Proven performance in numbers, redefining the standard for stores | 数字で証明された圧倒的なパフォーマンスが、店舗の基準を変えます |
| home.efficiency.stats.0.label | 결제 정확도 | Payment accuracy | 決済精度 |
| home.efficiency.stats.0.description | 오차 없는 완벽한 비전 AI | Flawless vision AI with zero error | 誤差のない完璧なビジョンAI |
| home.efficiency.stats.1.label | 고객 대기시간 감소 | Reduced customer wait time | 顧客待ち時間の削減 |
| home.efficiency.stats.1.labelCaption | (VCO 도입 전후 비교) | (before/after VCO adoption) | (VCO導入前後比較) |
| home.efficiency.stats.1.description | 이탈을 막는 초고속 결제 | Ultra-fast checkout that stops churn | 離脱を防ぐ超高速決済 |
| home.efficiency.stats.2.label | 매출 증가율 | Revenue growth rate | 売上増加率 |
| home.efficiency.stats.2.description | 피크타임 회전율 극대화 | Maximized turnover during peak hours | ピークタイムの回転率を最大化 |

### home.ctaBanner
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| home.ctaBanner.titleLine1 | 지금 매장에 도입하고 | Deploy it in your store today | 今すぐ店舗に導入して |
| home.ctaBanner.titleLine2 | 최대 효율을 경험을 해보세요 | and experience maximum efficiency | 最大の効率を体験してください |

CTA 버튼은 `common.cta.requestDemo` 재사용(신규 키 없음). 원본 `<br className="min-[769px]:hidden" />`(모바일 전용 줄바꿈, 의미상 줄바꿈 아님)을 보존하기 위해 title을 2줄로 분리 — 언어별 줄바꿈 위치가 자연스러운지 검수 필요.

### 기타 검수 포인트 (Phase 2)
- `home.hero.tagline` / `home.hero.subtitle`의 ja 원문 유지 여부(직역 vs 영문 유지) — 브랜드팀 확인 필요.
- `home.ctaBanner.titleLine1/2` 2분할이 en/ja 각각에서 모바일 줄바꿈 위치상 자연스러운지 확인 필요.
- `home.customers.title`, `home.efficiency.title`, `home.whyFai.headline`은 섹션 고유 라벨로 판단해 3개 언어 모두 영문 원문 유지 — 검수 시 이 판단에 이견 있으면 재조정.

---

## Phase 3: products (en/ja 초벌 — 마케팅 검수 필요)

> 제품·기능 고유명사(VCO, VISION CHECK-OUT, WALK-THROUGH, STANDARD/MICRO STORE), 고객사·브랜드(GS25, CU, PX24, Niseko 등), 날짜(`23.10 등), 카테고리 표기(Bakery&Cafe 등)는 번역하지 않고 원문 유지. heroTitle("VISION CHECK-OUT", "What is WALK-THROUGH?")도 브랜드 표현이라 config 유지. CTA는 `common.cta.requestDemo` 재사용.

### products.visionCheckout — 주요 검수 포인트
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| heroSubtitle | 차세대 AI 무인 결제 솔루션 | Next-Gen AI Autonomous Checkout Solution | 次世代AI無人決済ソリューション |
| featuresTitle | VCO는 무엇이 다를까요? | What makes VCO different? | VCOは何が違うのでしょうか？ |
| features.2.title | 오차없이 정확한 99.9% 인식률 | Flawless 99.9% recognition accuracy | 誤差のない正確な99.9%の認識率 |
| benefitsTitle | 어떻게 달라질까요? | How does it change things? | どのように変わるのでしょうか？ |
| reviews.1.quote.1.text | 시간당 360명 | 360 people per hour | 1時間あたり360名 |

- 리뷰 인용문의 emphasis 세그먼트(quote.N.1.text)는 구두점 앞뒤 공백으로 문장을 이어붙이므로, en/ja에서 문장이 자연스럽게 연결되는지 검수 필요(특히 조사·어순 차이).
- reviews.*.store/role(점포명·직함)의 en/ja 표기(예: "Mannameal Bakery", "マンナミル・ベーカリー", "General Manager, Song Ju-hee")는 실제 고객사 공식 표기 확인 필요.
- industries.*.label("Bakery&Cafe" 등)은 카테고리 고유표기로 판단해 3개 언어 모두 원문 유지.

### products.unmannedStore — 주요 검수 포인트
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| heroSubtitle | 세상에서 가장 경제적인 무인 매장 솔루션 | The world's most economical autonomous store solution | 世界で最も経済的な無人店舗ソリューション |
| storeTypes.0.subtitle | 30평 이하의 소형 매장 무인화 | Automating small stores under 100 sqm | 約100平米以下の小型店舗の無人化 |
| storeTypes.1.subtitle | 5평 내외 유휴 공간… | …idle space of around 16 sqm | …約16平米前後の遊休スペース |
| caseStudies.micro.1.description | 3.5평 규모 초소형 무인매장 | ultra-compact 11.5 sqm unmanned store | 約11.5平米規模の超小型無人店舗 |

- **평(坪) 단위 환산 검수 필요**: 30평→100㎡, 5평→16㎡, 3.5평→11.5㎡로 근사 환산했음. 정확한 수치·표기 정책(㎡ vs sqft vs 평 유지) 브랜드팀 확정 필요.
- sectionTitle "Walk-through는 무엇이 다를까요?"의 en/ja는 "What makes Walk-through different?" / "Walk-throughは何が違うのでしょうか？"로 번역(제품명 Walk-through는 유지).

### 미배선(잔존 UI 텍스트) — 별도 결정 필요
- 접근성 텍스트(aria-label "이전"/"다음"/"이전 케이스"/"다음 케이스", 리뷰 이미지 alt `${store} 전경`)는 Phase 3 필드 범위(공용 common 네임스페이스) 밖이라 현행 한국어 유지. 공용 a11y 키(common.a11y.*)로 별도 처리 권장 — 현재 en/ja 페이지에서도 한국어로 렌더됨(비가시 접근성 텍스트).
