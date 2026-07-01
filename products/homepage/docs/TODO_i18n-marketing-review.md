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
