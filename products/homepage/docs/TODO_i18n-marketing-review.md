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

## Phase 3 오염 수정 (2026-07-01) — Playwright 스윕으로 발견된 누락 필드

Phase 3에서 en/ja에 한국어 원문이 그대로 렌더되던 2개 필드를 추가 번역·배선함. `products.visionCheckout.reviews.<i>.category`, `products.unmannedStore.caseStudies.{standard,micro}.<i>.store`.

### products.visionCheckout.reviews[].category (설명 태그 — 번역 대상)
| index | ko | en (초벌) | ja (초벌) |
|-------|----|-----------|-----------|
| 0 | 베이커리 | Bakery | ベーカリー |
| 1 | 급식 | Foodservice | 給食 |
| 2 | 리조트 | Resort | リゾート |

### products.unmannedStore.caseStudies.standard[].store — **고유 지점명 포함, 마케팅/현지화 검수 필요**
| index | ko | en (초벌 — 로마자 표기) | ja (초벌 — 로마자 표기) | 비고 |
|-------|----|--------------------------|--------------------------|------|
| 0 | 가산스마트점 | Gasan Smart Store | 加山スマート店 | 고유 지점명 — 공식 영문/일문 표기 확인 필요 |
| 1 | 자체 운영 매장 | Self-operated store | 自社運営店舗 | 순수 설명어 — 번역 확정 |
| 2 | CU 안심스마트점포 | CU Ansim Smart Store | CU アンシムスマート店舗 | 고유 지점명(CU 브랜드 공식 영문 표기 "Ansim Smart Store" 확인 필요) |
| 3 | "Worker Shop" | "Worker Shop" (원문 유지) | "Worker Shop" (원문 유지) | 이미 영문 브랜드명 |

### products.unmannedStore.caseStudies.micro[].store — **고유 지점명, 마케팅/현지화 검수 필요**
| index | ko | en (초벌 — 로마자 표기) | ja (초벌 — 로마자 표기) | 비고 |
|-------|----|--------------------------|--------------------------|------|
| 0 | 을지로점 | Euljiro branch | 乙支路店 | 고유 지점명 — 로마자/한자 표기 확인 필요 |
| 1 | 화곡점 | Hwagok branch | 禾谷店 | 고유 지점명 — 로마자/한자 표기 확인 필요 |

**검수 포인트:** 위 4개 고유 지점명(가산스마트점/CU 안심스마트점포/을지로점/화곡점)의 en/ja 표기는 초벌 로마자·한자 번역이며, 실제 고객사(GS25, CU, PX24)의 공식 영문/일문 브랜드 표기와 일치하는지 마케팅팀 확인 전까지는 확정 아님.

## Phase 4 — about (2026-07-01)

### about.hero
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| about.hero.eyebrow | 리테일 혁신 | Retail Innovation | リテール革新 |
| about.hero.title.0 | 고객이 리테일의 본질에 | So Customers Can Focus | お客様がリテールの本質に |
| about.hero.title.1 | 집중할 수 있도록 | on What Retail Is Really About | 集中できるように |

**검수 포인트:** 2줄 헤드라인을 en/ja는 자연스러운 어순으로 재구성(1:1 줄바꿈 대응 아님) — 레이아웃에서 줄바꿈 위치가 어색하지 않은지 디자인 확인 필요.

### about.partners / about.investors
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| about.partners.title | Partners | Partners (고유 섹션명 유지) | Partners (고유 섹션명 유지) |
| about.partners.description.0-1 | 글로벌 시장 리더들과 / 기술 그 이상의 가치를 만들어가고 있습니다 | Working with global market leaders, / we're creating value that goes beyond technology | グローバル市場のリーダーたちと / 技術以上の価値を作り上げています |
| about.investors.groups.0.caption | 누적 127억원 투자 유치를 통해... | With KRW 12.7B in cumulative funding, we've earned recognition for our global business performance and growth potential | 累計127億ウォンの投資誘致を通じて... |
| about.investors.groups.1.caption | 정부의 주요 딥테크 육성 프로그램에... | Selected for major government deep-tech development programs, recognized for technology that leads the market. | 政府の主要ディープテック育成プログラムに... |

**검수 포인트:** "누적 127억원"은 en에서 "KRW 12.7B"로 통화·단위 표기 변환(원문 숫자 유지하되 통화 표기를 국제 표준 축약형으로 치환). 실제 투자 유치 총액이 변경되면 3개 로케일 모두 갱신 필요 — 숫자가 하드코딩이라 자동 동기화 안 됨.

### about.management — 학력/경력 처리 방식
기관·학교·회사명(고유명사)은 유지하고, 연결어·서술어만 번역. 예:
| ko | en | ja |
|----|----|----|
| 전 삼성전자 | Former Samsung Electronics | 元サムスン電子 |
| KAIST 전산학 학사 | B.S. in Computer Science, KAIST | KAIST 計算学 学士 |
| 서울대학교 전기컴퓨터공학 학사/박사(Ph.D) | B.S./Ph.D. in Electrical & Computer Engineering, Seoul National University | ソウル大学校 電気コンピュータ工学 学士/博士（Ph.D） |
| 전 Funded 창업(CEO)&매각 | Former Founder & CEO, Funded (acquired) | 元Funded創業（CEO）＆売却 |

**검수 포인트:** en 표기에서 "학사"→"B.S.", "석사"→"M.S.", "박사"→"Ph.D." 등 학위 축약 표기가 실제 이력서/공식 프로필과 일치하는지, 그리고 인명(함명원/왕민권/홍석범/이현규 등)은 이번 스코프에서 로마자 변환하지 않고 한글 그대로 유지했음 — en/ja 화면에 한글 인명이 노출되는 것이 브랜드 가이드상 허용되는지 마케팅 확인 필요. 로마자 표기가 필요하면 별도 라운드에서 `about.management.members[].name`(현재 config 고정값)에 로케일별 로마자 변형을 추가해야 함.

### about.people
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| about.people.title | People | People (고유 섹션명 유지) | People (고유 섹션명 유지) |
| about.people.subtitle | 파인더스에이아이의 멤버들을 만나보세요 | Meet the members of Fainders.AI | ファインダーズエーアイのメンバーを紹介します |
| about.people.cards.0.title | AI로 세상을 더 이롭게 만드는 기술을 만드는 일 | Building technology that makes the world better with AI | AIで世界をより良くする技術をつくる仕事 |
| about.people.cards.1.title | 문제를 피하지 않고 끝까지 해결하는 사람들과 함께 | Working with people who solve problems all the way through, without avoiding them | 問題から逃げず最後まで解決する仲間たちと共に |
| about.people.cards.2.title | 기술보다 문제, 속도보다 방향, 구현보다 경험을 고민해요 | Thinking about the problem before the technology, the direction before the speed, the experience before the implementation | 技術より課題、スピードより方向性、実装より体験を考えます |
| about.people.cards.3.title | 일본 리테일 시장의 새로운 미래를 만들고 있어요 | Building a new future for Japan's retail market | 日本のリテール市場に新しい未来をつくっています |
| about.people.cards.2.role | BE 개발 | BE Engineer | BE開発 |

**검수 포인트:** 인터뷰 카피(카드 title)는 인터뷰이 발언의 의역 초벌 — 실제 인터뷰 원문/영문 보도자료가 있다면 그것과 대조해 재작성 권장. `config/site.ts`의 `people.cards[2,3]._description`("카피 — 디자인에서 미확인") 메모는 여전히 유효 — 해당 카피가 최종 디자인 확정본인지 재확인 필요.

### common.a11y (신규 공용 네임스페이스) — Phase 3 잔여 이슈 일부 해소
Phase 3에서 지적됐던 "aria-label 이전/다음이 en/ja에서도 한국어로 렌더" 문제를 Phase 4에서 `common.a11y.prev`/`common.a11y.next`로 해결하고 `AboutPeople`에 배선함.
| key | ko | en | ja |
|-----|----|----|----|
| common.a11y.prev | 이전 | Previous | 前へ |
| common.a11y.next | 다음 | Next | 次へ |

**잔존 이슈:** `components/sections/products/ProductReviews.tsx`의 동일한 aria-label("이전"/"다음")은 Phase 4 스코프(about만) 밖이라 미수정 — 이제 재사용 가능한 `common.a11y.*` 키가 존재하므로, products 섹션을 다시 건드리는 후속 작업(또는 별도 소규모 패치)에서 이 키로 교체 권장.

### about.people.interviewAriaLabel (신규 — 접근성 텍스트, ICU 보간)
`{card.name} 직무 인터뷰 보기` 하드코딩을 `about.people.interviewAriaLabel`("{name} 직무 인터뷰 보기" 템플릿)로 이전. en "View {name}'s job interview" / ja "{name} の職務インタビューを見る". `name`은 인명(고유명사, 미번역)이 그대로 보간됨.

### 스코프 제외 — image alt (비가시 접근성 텍스트)
아래 `alt` 값들은 plan 지시대로 "화면 비노출(innerText 아님)"이라 이번 스코프에서 번역하지 않고 config 원문(한국어) 유지:
- `aboutConfig.hero.image.alt` ("Fainders.AI 오피스 전경")
- `aboutConfig.management.members[].photo.alt` (예: "함명원 CEO")
- `aboutConfig.people.cards[].image.alt` (예: "홍석범 CTO 인터뷰")

**검수 포인트:** en/ja 페이지에서도 스크린리더 사용자에게는 이 alt 텍스트가 한국어로 노출됨. 접근성 관점에서는 다국어 alt도 필요하므로, 후속 페이즈(또는 전체 완료 후 스캔)에서 번역 여부를 최종 결정 필요.

## Phase 5 — media (2026-07-01)

### media.news (FAI News — 언론 보도 헤드라인, 실제 기사 제목 번역)
`config/site.ts`의 `media.items[]`(14개, 그중 1개는 빈 썸네일 폴백 UI 확인용 테스트 카드) `title`/`description`/`thumbnailAlt`를 `media.news.items.<i>.*`로 이전, en/ja 초벌 번역. **이 항목들은 실제 한국 언론사 기사 헤드라인이므로 번역 정확성·뉘앙스·보도 매체명 표기가 특히 중요 — 외부 노출 전 마케팅/PR 검수 필수.**

| index | ko (원문 헤드라인) | en (초벌) | ja (초벌) |
|-------|---------------------|-----------|-----------|
| 0 | 파인더스에이아이, 프리B 50억 투자 유치…AI 무인매장 솔루션 확대 | Fainders.AI Raises KRW 5B in Pre-Series B, Expanding AI Unmanned Store Solutions | ファインダーズAI、プレシリーズBで50億ウォン調達…AI無人店舗ソリューションを拡大 |
| 1 | 파인더스에이아이, 삼성웰스토리와 'AI 자동 계산대' 협업… | Fainders.AI Partners with Samsung Welstory on 'AI Self-Checkout,' … | ファインダーズAI、サムスンウェルストーリーと『AI自動レジ』で協業… |
| 2 | 파인더스에이아이, 싱가포르 세븐일레븐에 AI 완전 무인 편의점 구현 | Fainders.AI Deploys Fully Unmanned AI Convenience Store at 7-Eleven Singapore | ファインダーズAI、シンガポールのセブンイレブンに完全無人AIコンビニを導入 |
| 3 | 파인더스에이아이, 日 대형 리조트 레스토랑에 AI 셀프 계산대 제공 | Fainders.AI Supplies AI Self-Checkout to Major Resort Restaurant in Japan | ファインダーズAI、日本の大型リゾートレストランにAIセルフレジを提供 |
| 4 | 도큐부동산 등, 니세코 도큐 그란 히라후 레스토랑 'NEST813'… PoC 착수 | Tokyu Land and Partners Launch AI Self-Checkout PoC at 'NEST813' Restaurant… | 東急不動産など、ニセコ東急グラン・ヒラフのレストラン『NEST813』でPoCを開始 |
| 5 | 파인더스AI, 글로벌 액셀러레이션 프로그램 'HFX' 최종 선정 | Fainders.AI Selected for Global Acceleration Program 'HFX' | ファインダーズAI、グローバルアクセラレーションプログラム『HFX』に最終選定 |
| 6 | 한국 리테일 AI 스타트업, 라이프스타일 랩 'TOYONOMA'… PoC 스토어 오픈 | Korean Retail AI Startup Opens PoC Store at Lifestyle Lab 'TOYONOMA' | 韓国のリテールAIスタートアップ、ライフスタイルラボ『TOYONOMA』にPoCストアをオープン |
| 7 | "물건 골라 나가면 바로 결제"...무인 스토어 2호점 오픈 | "Pick Up and Walk Out, Payment Done"... Fainders.AI Opens Second Unmanned Store | 「商品を選んで出るだけで決済完了」…無人ストア2号店をオープン |
| 8 | 파인더스에이아이, AI 무인 마이크로 스토어 오픈 | Fainders.AI Opens AI Unmanned Micro Store | ファインダーズAI、AI無人マイクロストアをオープン |
| 9 | 파인더스AI, 중기부 '아기유니콘' 선정…해외 진출 시동 | Fainders.AI Selected as a 'Baby Unicorn' by the Ministry of SMEs… | ファインダーズAI、韓国中小ベンチャー企業部『ベビーユニコーン』に選定… |
| 10 | 파인더스에이아이, GS리테일과 AI 완전 무인 편의점 구현 | Fainders.AI Deploys Fully Unmanned AI Convenience Store with GS Retail | ファインダーズAI、GSリテールと完全無人AIコンビニを実現 |
| 11 | '파인더스에이아이', 71억원 규모 시리즈 A 투자 유치 | AI Unmanned Store Startup Fainders.AI Raises KRW 7.1B in Series A Funding | ファインダーズAI、71億ウォン規模のシリーズA投資を誘致 |
| 12 | '파인더스에이아이' 6억원 투자 유치 | AI Unmanned Store Startup Fainders.AI Raises KRW 600M in Seed Funding | ファインダーズAI、6億ウォンのシード投資を誘致 |
| 13 | [빈 이미지 폴백 UI 확인용 카드] (테스트 카드, 실서비스 문구 아님) | [Card for Verifying Empty Image Fallback UI] | 【画像なしフォールバックUI確認用カード】 |

**검수 포인트:**
- 보도 매체명(머니투데이/이코노미스트/GS리테일 등)은 본문에 없어 그대로 두었으나, 실제 en/ja 배포 시 언론사·매체명 표기 방식(현지 매체명 병기 여부)을 검토 필요.
- "끌림벤처스" → en "Kkeullim Ventures"(음역), 고유명사 표기가 실제 영문 공식 표기와 일치하는지 확인 필요.
- 금액 단위(억원/万円/등) 표기 방식 — en/ja 모두 "KRW 5B"/"50億ウォン"처럼 원화 그대로 표기. 현지 통화 환산 병기 여부는 마케팅 판단 필요.
- item 13은 디자인 QA용 테스트 카드(빈 썸네일 폴백 확인)이며 실제 뉴스가 아님 — 프로덕션 배포 전 제거 여부 확인 권장(기존부터 존재하던 이슈, 이번 Phase 5 스코프 밖).

### media.showcase (섹션 라벨만 번역 — 실제 영상 데이터는 번역 대상 아님)
| key | ko | en | ja |
|-----|----|----|----|
| media.showcase.title | Media | Media (고유 섹션명 유지) | メディア |
| media.showcase.youtube.channelLabel | YouTube | YouTube (고유명사 유지) | YouTube (고유명사 유지) |
| media.showcase.youtube.ctaLabel | 더 알아보기 | Learn More | 詳しく見る |
| media.showcase.youtube.a11y.prevVideo | 이전 영상 | Previous video | 前の動画 |
| media.showcase.youtube.a11y.nextVideo | 다음 영상 | Next video | 次の動画 |
| media.showcase.youtube.a11y.goToVideo | 영상 {index}로 이동 | Go to video {index} | 動画{index}へ移動 |
| media.showcase.socials.followAriaLabel | {label} 바로가기 | Visit {label} | {label}へ移動 |

`config/site.ts`의 `mediaShowcase.youtube.videos[]`(2개, 플레이스홀더 포함)도 스펙대로 `media.showcase.youtube.videos.<i>.*`로 번역해뒀으나, **이 배열은 실제로 어디서도 소비되지 않는 죽은 코드**(실제 렌더는 `config/youtube-showcase.json`을 사용). 컴포넌트 배선 시 확인됨 — 정리(제거) 여부는 별도 결정 필요.

### ⚠️ 구조적 미해결 — 외부 동기화 콘텐츠(YouTube RSS·Stibee)는 번역 불가 상태로 en/ja에 노출됨
`MediaShowcaseSection`이 실제로 렌더하는 영상 데이터(`config/youtube-showcase.json`, `scripts/sync-youtube.mjs`가 채널 RSS에서 생성, 13개 영상)와 `RetailTechLetterSection`이 렌더하는 레터 목록(`config/retail-tech-letter.json`, `scripts/sync-stibee.mjs`가 Stibee API에서 생성, 31개 레터)은:
- **정적 `messages/*.json` 인덱스 키로 매핑 불가** — 리싱크할 때마다 항목 순서/개수/내용이 바뀌는 외부 소스이기 때문에, 지금 번역해봐야 다음 `sync-youtube.mjs`/`sync-stibee.mjs` 실행 시 인덱스가 어긋나 오번역이 됨.
- 결과적으로 `/en/media`, `/ja/media`에서 YouTube 쇼케이스 카드(현재 13개 영상 중 한국어/일본어 원문 혼재)와 Retail Tech Letter 목록(31개, 전부 한국어 제목)이 **로케일과 무관하게 원문(주로 한국어) 그대로 노출**됨. 이는 "en/ja에 한국어가 남지 않도록" 요구사항을 이 두 섹션에서는 충족하지 못함.
- **왜 이렇게 뒀는가:** Phase 5 지시서의 번역 대상은 `config/site.ts`의 `siteConfig.media`/`mediaShowcase`/`retailTechLetter`(정적 구조)였고, 실제 렌더 데이터인 두 JSON은 지시서 작성 시점에 존재를 알기 어려웠던 별도의 동적 동기화 파이프라인. 정적 텍스트 이전 패턴(Phase 1~4와 동일한 인덱스 키 방식)을 그대로 적용할 수 없는 근본적으로 다른 데이터 소스.
- **권장 해결 방향(택 1, 마케팅·엔지니어링 합의 필요):**
  1. **번역 API 파이프라인 추가**: `sync-youtube.mjs`/`sync-stibee.mjs` 실행 시 각 언어로 자동 번역(예: DeepL/OpenAI API)해서 `youtube-showcase.{ko,en,ja}.json` 등으로 3벌 저장 — 유지보수 비용 증가, 번역 품질 관리 필요.
  2. **로케일별 노출 제한**: en/ja에서는 이 두 섹션을 아예 숨기거나(예: "한국어 채널입니다" 안내로 대체) YouTube/Stibee 원문 링크만 노출.
  3. **현행 유지 + 명시적 정책 문서화**: "이 두 섹션은 다국어 미지원, 원문(한국어/영상 원어) 그대로 노출"을 공식 정책으로 명시하고 QA/마케팅에 공지.
- 이 이슈는 Phase 5 완료 정의("en/ja 한국어 잔존 0")를 완전히 충족하지 못하게 만드는 유일한 항목이며, **최종 페이즈(전체 완료 후 스캔) 또는 별도 티켓에서 반드시 재검토 필요.**

### media.retailTechLetter (섹션 라벨만 번역 — 레터 목록 자체는 위 이슈 참고)
| key | ko | en | ja |
|-----|----|----|----|
| media.retailTechLetter.title | Retail Tech Letter | Retail Tech Letter (고유 섹션명 유지) | Retail Tech Letter (고유 섹션명 유지) |
| media.retailTechLetter.description | 리테일 기술 트렌드와... 구독해보세요. | A newsletter covering retail technology trends... | リテールテックのトレンドと...購読しましょう。 |
| media.retailTechLetter.ctaLabel | 레터 구독하기 | Subscribe to the Letter | レターを購読する |

**참고:** `retailTechLetter.description`은 `config/site.ts`에는 존재하지만 `RetailTechLetterSection` 컴포넌트에서 실제로 렌더되지 않는 죽은 필드(기존부터 그러함, Phase 5에서 변경 없음) — messages에는 스펙대로 번역해뒀으나 화면에는 보이지 않음.

---

## Phase 6 — contact (문의 페이지)

담당 마케팅/현지화 검수 대상. 고유명사(Fainders.AI, VCO, STANDARD/MICRO STORE, KakaoTalk), URL, 이메일 형식은 번역하지 않음.

| 키 | 한국어(ko) | 영어(en) | 일본어(ja) |
|----|-----------|---------|-----------|
| contact.meta.title | 문의하기 | Contact | お問い合わせ |
| contact.meta.description | 도입 고민부터 커스텀 솔루션 제안까지 전문가가 직접 답변해드립니다. | From adoption questions to custom solution proposals, our experts answer you directly. | 導入のご相談からカスタムソリューションのご提案まで、専門家が直接お答えします。 |
| contact.title (3줄) | 도입 고민부터 / 커스텀 솔루션 제안까지 / 전문가가 직접 답변해드립니다 | From adoption questions / to custom solution proposals, / our experts answer you directly | 導入のご相談から / カスタムソリューションのご提案まで / 専門家が直接お答えします |
| contact.subCopy.highlight | 맞춤형 솔루션 제안 | a tailored solution proposal | 最適なソリューションのご提案 |
| contact.subCopy.rest / line2 | 을 위해 문의 폼을 작성해주시면 / 담당자가 빠르게 연락드릴게요 | , just fill out the inquiry form and / our team will get back to you promptly | のため、お問い合わせフォームにご記入いただければ / 担当者が迅速にご連絡いたします |
| contact.form.connectTitle | 연락드릴 정보를 입력해 주세요 | Enter your contact details | ご連絡先をご入力ください |
| contact.form.requiredLabel | 필수 입력 | Required | 必須入力 |
| contact.form.selectTitle | 문의하고 싶은 정보를 선택해 주세요 | Select the information you'd like to inquire about | お問い合わせになりたい情報をお選びください |
| contact.form.submitLabel | 문의하기 | Submit inquiry | お問い合わせ |
| contact.form.privacyNotice (before/link/after) | 귀하의 문의에 답변하기 위해 수집된 데이터의 / 개인정보 처리방침 / 에 동의합니다 | I agree to the / Privacy Policy / regarding the data collected to respond to your inquiry | お問い合わせへの回答のために収集されるデータの / 個人情報の取り扱い方針 / に同意します |
| contact.fields.company.{label,placeholder,errorMessage} | 회사명 / 회사명 / 회사명을 입력해 주세요. | Company / Company / Please enter your company name. | 会社名 / 会社名 / 会社名をご入力ください。 |
| contact.fields.name.* | 성함 / 성함 / 성함을 입력해 주세요. | Name / Name / Please enter your name. | お名前 / お名前 / お名前をご入力ください。 |
| contact.fields.email.* | 이메일 / name@example.com / 이메일을 입력해 주세요. | Email / name@example.com / Please enter your email. | メール / name@example.com / メールアドレスをご入力ください。 |
| contact.fields.phone.{label,placeholder} | 전화번호 / 전화번호 | Phone / Phone | 電話番号 / 電話番号 |
| contact.interests.vco.group / multipleLabel | VCO / (복수선택 가능) | VCO / (multiple selection allowed) | VCO / （複数選択可） |
| contact.interests.vco.options.bakery/catering/special-venue/etc | 베이커리 / 급식 / 특수 입지(경기장/공연장/리조트) / 기타 | Bakery / Catering / Special venue (stadium/arena/resort) / Other | ベーカリー / 給食 / 特殊立地（スタジアム/公演会場/リゾート） / その他 |
| contact.interests.store.group / options | STORE / STANDARD STORE / MICRO STORE | STORE / STANDARD STORE / MICRO STORE | STORE / STANDARD STORE / MICRO STORE |
| contact.toast.text | 간단한 솔루션 문의는 카카오톡 채널을 이용해 주세요 | For quick solution inquiries, please use our KakaoTalk channel | 簡単なソリューションのお問い合わせはKakaoTalkチャンネルをご利用ください |
| contact.toast.textShort | 카카오톡 채널로 문의하세요 | Ask us on the KakaoTalk channel | KakaoTalkチャンネルでお問い合わせ |
| contact.toast.buttonLabel | 빠른 상담하기 | Quick consultation | すぐに相談する |
| contact.complete.title | 문의 주셔서 정말 감사합니다 | Thank you so much for reaching out | お問い合わせいただき誠にありがとうございます |
| contact.complete.subCopy (before/highlight/after) | 내용을 확인하고 / 평균 2~3일 이내 / 담당자가 연락드리겠습니다 | We'll review your message and / within 2–3 days on average / our team will get in touch | 内容を確認のうえ、 / 平均2〜3日以内 / に担当者がご連絡いたします |
| contact.complete.buttonLabel | 계속 둘러보기 | Keep exploring | 引き続き見る |

**주의(설계 결정):** `config/site.ts`의 `interests[].options[].label`(한국어)은 Zapier 리드 payload의 `content` 필드(영업팀이 읽음)를 만들기 위해 **의도적으로 한국어로 유지**함. UI 표시는 위 `contact.interests.*.options.*` 메시지 키로 로케일별 렌더 — 라벨이 config/messages에 이중 존재하는 것은 의도된 설계(payload=한국어 고정, UI=현지화). `lib/contact/payload.ts` 및 그 테스트는 미변경.

**KakaoTalk 표기:** 카카오 채널명은 en/ja에서 "KakaoTalk"으로 표기(브랜드 고유명사). 한국어는 "카카오톡" 유지.

---

## Phase 7 — i18n cleanup: 주소 로마자화 · 무인매장 지명 로마자화 · en/ja 색인 전환 (2026-07-01)

기존 스캔에서 누락됐던 실데이터 VALUE(주소)와 케이스 스터디 브랜드 지명 프리픽스를 로마자화. **아래 로마자 표기는 모두 초벌(best-effort) — 마케팅/현지화 담당자의 네이티브 검수 확정 필요.**

### footer.addressValue (실주소 — 이전까지 전 로케일 한국어 고정이었음)
| key | ko | en (초벌) | ja (초벌) |
|-----|----|-----------|-----------|
| footer.addressValue | 0662 서울특별시 서초구 강남대로51길 1, 511타워 13층 | 13F, 511 Tower, 1 Gangnam-daero 51-gil, Seocho-gu, Seoul, Republic of Korea | ソウル特別市 瑞草区 江南大路51ギル 1, 511タワー 13階 |

- 우편번호(0662)는 en/ja 표기에서 생략(해외 발신 기준 도로명주소 관용 표기 우선) — 우편번호 포함 여부는 마케팅 검수 시 재확인.
- ja 표기는 한자/가나 혼용 로마자化 초벌이며, 정식 일본어 주소 표기 컨벤션(丁目/番地 등 사용 안 함, 한국 도로명주소를 그대로 훈독 표기) 검수 필요.

### products.unmannedStore.caseStudies.standard[].brand (지명 프리픽스)
| index | ko | en (초벌) | ja (초벌) |
|-------|----|-----------|-----------|
| standard.0 | GS25 DX LAB | GS25 DX LAB (고유명사 유지) | GS25 DX LAB (고유명사 유지) |
| standard.1 | Super Swift | Super Swift (고유명사 유지) | Super Swift (고유명사 유지) |
| standard.2 | 나주 테크프렌들리 | Naju Tech-Friendly | ナジュ テックフレンドリー |
| standard.3 | 판교 Alphadom | Pangyo Alphadom | パンギョ Alphadom |
| micro.0 / micro.1 | PX24 | PX24 (고유명사 유지) | PX24 (고유명사 유지) |

- "나주"→"Naju"/"ナジュ", "판교"→"Pangyo"/"パンギョ"는 국토교통부 로마자 표기법 기준 표준 표기(검수 시 재확인 권장).
- "테크프렌들리"는 원래 한국어 조어(영어 "Tech Friendly"의 한글 표기)라 en에서는 원의도대로 역변환(`Tech-Friendly`), ja에서는 가타카나 음역(`テックフレンドリー`) 처리 — 실제 브랜드/매장 공식 영문·일문 표기가 있다면 그것으로 교체 필요.

### 색인 정책 전환 (en/ja noindex → index)
- `app/[locale]/layout.tsx`: `robots.index`를 로케일 무관 `true`로 전환(기존엔 `locale === defaultLocale`로 ko만 색인).
- `app/sitemap.ts`: `INDEXED_LOCALE="ko"` 단일값 제거, `routing.locales`(ko/en/ja) 전체를 순회해 로케일별 URL 생성.
- 전제: Phase 1~7 번역이 완료되어 en/ja 본문에 한국어 잔존이 없다는 가정하에 전환. 위 Phase 5 항목(YouTube/Stibee 동기화 콘텐츠 미번역)은 여전히 미해결 상태로 en/ja에 한국어 원문이 일부 노출되므로, **완전한 "en/ja 한국어 잔존 0" 달성 전 색인 전환의 SEO 리스크**(다국어 사이트에서 미번역 콘텐츠 노출 시 품질 신호 저하 가능)를 마케팅/SEO 담당자와 재확인 권장.

---

## Phase 8 — 인명 로마자화 + Retail Tech Letter 목록 제목 번역 (2026-07-02)

Phase 4에서 "이번 스코프에서 로마자 변환하지 않고 한글 그대로 유지"로 남겨뒀던 인명을 en/ja에서 로마자 표기로 전환(`about.management.members.<i>.name`, `about.people.cards.<i>.name`, `footer.ceoValue` 신규 키). ja는 en과 동일한 로마자 표기 재사용(일본어 가나 음역 대신 영문 표기 선택 — 브랜드 가이드 확인 필요). 함께 `aboutConfig.management.members[].photo.alt` / `aboutConfig.people.cards[].image.alt`에 하드코딩돼 있던 한글 이름도 번역된 이름으로 재조합해 en/ja alt 텍스트의 한글 잔존을 제거함(기존 Phase 4 "스코프 제외" 항목 중 인명 관련 부분 해소 — `hero.image.alt`는 인명이 아니라서 이번 스코프 밖, 미해결로 유지).

### 인명 로마자 표기 — **전원 초벌(best-effort), 네이티브/본인 확인 전까지 미확정**
| 한글 | en/ja 표기 | 비고 |
|------|-----------|------|
| 함명원 | Myungwon Ham | CEO — Management + Footer(ceoValue)에서 사용 |
| 왕민권 | Minkwon Wang | CEO — Management + People + Footer(ceoValue)에서 사용 |
| 홍석범 | Sukbum Hong | CTO — Management + People에서 사용 |
| 이현규 | Hyunkyu Lee | CSO — Management에서만 사용 |
| 박성빈 | Sungbin Park | BE 개발 — People에서만 사용, **로마자 표기 확정 근거 없음(추정)** |
| 이지민 | Jimin Lee | CEO(Fainders.AI Japan) — People에서만 사용, **로마자 표기 확정 근거 없음(추정)** |

**검수 포인트:**
- 6명 모두 여권/명함 등 공식 로마자 표기 확인 필요(성명 로마자 표기는 개인마다 관행이 다름 — 예: "Hong Sukbum" vs "Sukbum Hong" 성/이름 순서, "Wang" vs "Wang(g)" 등).
- 특히 박성빈·이지민은 Management(임원진) 목록에 없어 참고할 기존 영문 표기가 없었던 완전 추정치 — 본인 확인 필수.
- ja는 가나 음역(예: ハム・ミョンウォン) 대신 영문 로마자를 그대로 재사용했음. 일본어권 사용자 가독성·브랜드 가이드 관점에서 가나 음역이 필요한지 별도 확인 필요.
- `footer.ceoValue`(en/ja: "Myungwon Ham · Minkwon Wang")의 구분자는 ko 원문의 "ㆍ"(가운뎃점) 대신 국제적으로 통용되는 " · "(중점)을 사용 — 표기 통일성 검토 필요.

### media.showcase.videoOverrides — 유튜브 쇼케이스 영상 title/description 번역(오버라이드 맵, HOM-25)
`config/youtube-showcase.json`은 RSS 재싱크마다 재생성되는 외부 동기화 데이터라, `retailTechLetter.letterTitles`와 동일하게 videoId로 매핑하는 `media.showcase.videoOverrides.<videoId>.{title,description}` 오버라이드 키를 도입(`app/[locale]/media/page.tsx`에서 `t.has()`로 존재 여부 확인 후 적용).

| videoId | ko | en | ja |
|---------|----|----|----|
| lLDFJ-3rs2U | 파인더스에이아이ㅣAI 무인 매장 소개 / AI 무인매장 솔루션으로 운영되는 Super Swift와 GS25 DX LAB 가산스마트점을 소개합니다. | 원문(영상 자체가 영문) 그대로 유지 | **미번역 — 영문 원문을 임시 값으로 사용 중** |
| VJSlS3ujdEo | 파인더스에이아이ㅣAI 무인매장 Super Swift / AI 솔루션 기반의 무인매장 스토어 Super Swift, 리테일의 미래를 파인더스에이아이에서 만나보세요. | 원문(영상 자체가 영문) 그대로 유지 | **미번역 — 영문 원문을 임시 값으로 사용 중** |

**검수 포인트:** 두 영상 모두 `youtube-curation.json`의 `hideInLocales`에 `ja`가 남아있어 ja 로케일에는 아직 노출되지 않음(영문 원문이 그대로 노출되는 걸 막기 위한 의도적 게이팅). ja 실번역이 확정되면 (1) 위 videoOverrides의 ja 값을 실제 일본어로 교체하고 (2) `hideInLocales`에서 해당 videoId의 `ja`를 제거해야 노출됨.

### media.retailTechLetter.letterTitles.1~31 — Stibee 레터 목록 제목 번역(오버라이드 맵)
`config/retail-tech-letter.json`은 Stibee API 리싱크 시마다 재생성되는 외부 동기화 데이터라 `title`(ko) 자체는 건드리지 않고, id로 매핑하는 `media.retailTechLetter.letterTitles.<id>` 오버라이드 키를 신규 추가(ko/en/ja 31개씩, 총 93개 키). `app/[locale]/media/page.tsx`에서 `t.has()`로 존재 여부를 확인해 있으면 번역을 얹고, 없으면(향후 리싱크로 신규 id 추가 시) ko 원문을 그대로 노출 — 로케일 간 동작이 통일됨(신규 레터는 번역 전까지 3개 로케일 모두 한국어로 보임).

**전체 31개 en/ja 초벌 번역 — 마케팅/PR 검수 필수(외부 발행된 실제 뉴스레터 제목의 재번역이므로 오역·뉘앙스 차이가 그대로 노출됨):**
- 고유명사는 유지: Fainders.AI/FAI/VCO/PX24, 세븐일레븐→7-Eleven, 아마존고→Amazon Go, 창이공항→Changi Airport, NRF, AVITA, 뚜쥬루→Toujours.
- `[리테일 테크 레터]` 프리픽스는 en `[Retail Tech Letter]`, ja `[リテールテックレター]`로 통일 번역.
- id 31/27/26/20/15/14/8/4의 ko 원문에 사용된 유니코드 특수 따옴표(‘’/“”)와 id 20의 이중 공백 오탈자는 원본(`config/retail-tech-letter.json`)과 **바이트 단위로 동일하게** 보존함(최초 구현 시 직선 따옴표로 오기입했던 것을 재수정) — en/ja는 표준 따옴표(' " )로 정규화해 번역.
- 31개 제목 목록·번역 전문은 `messages/{ko,en,ja}.json`의 `media.retailTechLetter.letterTitles` 참조(양이 많아 이 문서에는 요약만 기재).
- **검수 포인트:** 언론 보도 헤드라인(Phase 5)과 마찬가지로 실제 발행된 뉴스레터 제목의 번역이므로 정확성·톤 검수가 특히 중요. id 30/15의 인용구("도입하지 않을 이유 없다"/"2025년, 무인 매장 확산 위한 글로벌 진출 원년")는 실제 인터뷰이 발언 의역 — 원문 발언 기록이 있다면 대조 권장.

## Phase 9 — YouTube 쇼케이스 영상 전체 title/description 초벌 번역 (2026-07-16)

배경(HOM-25 Notion 코멘트 결정): "뉴스레터·뉴스는 강제 번역해서 보여주는데 유튜브는 어떻게 할지" 질의에 대해 "번역 작업 완료(8월 말) 전까지 자동 번역 처리로 대응"으로 결정됨. 이 코드베이스에는 실시간 번역 API 파이프라인이 없으므로(Phase 5에서 검토했던 3가지 방향 중 API 파이프라인 신설은 채택 안 함), 기존 `media.showcase.videoOverrides.<videoId>` 오버라이드 메커니즘(Phase 8)을 그대로 확장해 **아직 오버라이드가 없던 영상 17건**에 en/ja 초벌 번역을 추가함. **노출 조건(`youtube-curation.json`의 `hideInLocales`/`manual`)은 이번 작업에서 전혀 변경하지 않음** — 기존과 동일한 영상이 동일한 로케일에 노출된다.

**대상에서 제외한 영상(번역 불필요, 사유):**
- `U12evbt9Aoo` — 원어가 일본어이고 `hideInLocales:["ko","en"]`라 ja에서만 노출됨(네이티브 텍스트라 번역 대상 아님).
- `fSzG6pXZx-w` — 원어가 영어이고 `hideInLocales:["ko","ja"]`라 en에서만 노출됨(네이티브 텍스트라 번역 대상 아님).
- `lLDFJ-3rs2U`, `VJSlS3ujdEo` — Phase 8에서 이미 ko 오버라이드 완료(en은 원어라 이번에 손대지 않음). ja는 여전히 미번역(위 Phase 8 항목 참고, hideInLocales로 게이팅 중이라 노출에는 영향 없음).

**신규 오버라이드 추가 17건(원어=한국어, en/ja 초벌 번역 추가. ko 값은 원문 그대로 복사 — 3로케일 키 동기화 목적):**

| videoId | 제목(ko 원문) |
|---------|--------------|
| am92ZPQxrmo | AI 알바생~ [빵 인식부터, 주문, 계산까지 무엇을 도와드릴까요?] |
| K2ueKcophSc | 요즘빵집근황[빵순이들의 천국에 루시퍼의 등장이라...(더보기)] |
| 8_zRbYyScQQ | VCO 빵지순례 [ep2.비밀베이커리 예술의 전당점] |
| 6mdVuqYxWI8 | 틀린그림찾기(ep2.아티제) |
| SQVWhX_U3f4 | AI는 망고 케이크를 구별할 수 있을까?(ep1. 틀린그림찾기 뚜쥬루 망고케이크) |
| hPLD6RDw64M | VCO 챌린지 [빵집 대기 시간을 줄여주는 마법의 기술] |
| EAJYPdhpTAo | VCO 빵지순례 [ep1. 한상민과자점 신검단중앙역점] |
| M44Ig8m4BfU | 파인더스에이아이 VCO 현장 도입 사례ㅣ천안 뚜쥬루과자점, 일본 훗카이도 니세코 리조트 |
| 20XzJavnjyY | 파인더스에이아이ㅣAI 무인 매장 Super Swift |
| SRBp_bmPk5o | 파인더스에이아이ㅣVCO 베이커리 사용방법(진동벨, 결제 과정 포함) |
| XZ3gEzfrWN0 | 파인더스에이아이 VCO는 뭐가 다른가요?③ |
| _0FCk3XMS5w | 파인더스에이아이 VCO는 뭐가 다른가요?② |
| 1E0bPZMJZ-o | 파인더스에이아이 VCO는 뭐가 다른가요?① |
| NZf1qo6LS8w | 파인더스에이아이ㅣ베이커리 AI 무인 자동 계산대 VCO 사용법 (en은 `hideInLocales`로 현재 비노출 — 정책 변경 대비 선제 번역) |
| DSTIFkS5Nw8 | Fainders.AI 매장 무인화 솔루션 소개 영상 (한글 자막) |
| Qon4TWeBsdQ | VCO(Vision Check-out) 베이커리 소개 영상 |
| OetI0X56u3k | 파인더스에이아이ㅣAI 무인 자동 계산대 VCO(Vision Check-out) 소개 |

전문(en/ja 번역 텍스트)은 `messages/{ko,en,ja}.json`의 `media.showcase.videoOverrides` 참조(양이 많아 문서에는 목록만 기재).

**검수 포인트:**
- 초벌 번역이며 실제 마케팅팀 확정 번역(8월 말 예정)으로 교체 필요 — 교체 시 이 표의 videoId를 체크리스트로 사용.
- 쇼츠 해시태그(#파인더스에이아이 등)는 en `#FaindersAI`, ja `#ファインダーズAI`로 통일 표기(브랜드명이라 유지, 일반 단어 해시태그는 의미 번역).
- `M44Ig8m4BfU` 설명의 수치(99.7%/75%/15%)·원호 번호(⑴⑵⑶)는 원문 그대로 보존.
- `XZ3gEzfrWN0`/`_0FCk3XMS5w`/`1E0bPZMJZ-o`(VCO는 뭐가 다른가요 시리즈)의 `[타사]`/`[파인더스에이아이 VCO]` 대괄호 라벨도 함께 번역(`[Other Companies]`/`[Fainders.AI VCO]`, `[他社]`/`[ファインダーズAI VCO]`) — 원문 구조·줄바꿈 유지.
- 유튜브 영상 자체(썸네일/자막)에 한국어 원문이 그대로 남아있는 건 이번 스코프 밖(제목/설명 메타데이터만 번역 대상, 영상 콘텐츠 자체는 불변).
