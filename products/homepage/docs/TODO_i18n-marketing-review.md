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
