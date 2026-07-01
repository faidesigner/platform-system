# Phase 1 Report — common · nav · footer i18n

브랜치 `feat/i18n-translations` / 워크트리 `platform-system-i18n`. 게이트 `pnpm build && pnpm test` 통과.

## 1. messages 키 추가 (ko/en/ja 3벌 동기 — 22 keys 동일)

### common.cta (공용 CTA — 이번 페이즈엔 키 정의만, 소비는 nav.contact만)
| key | ko | en | ja |
|-----|----|----|----|
| common.cta.contact | 문의하기 | Contact | お問い合わせ |
| common.cta.requestDemo | 도입 문의하기 | Request a Demo | 導入のお問い合わせ |
| common.cta.learnMore | 자세히 알아보기 | Learn More | 詳しく見る |
| common.cta.more | 더보기 | More | もっと見る |
| common.cta.quickChat | 빠른 상담하기 | Quick Chat | かんたん相談 |
| common.cta.reviewsMore | 실제 도입 후기 더보기 | More Customer Stories | 導入事例をもっと見る |
| common.cta.mediaMore | 더 알아보기 | Learn More | 詳しく見る |

### nav
| key | ko | en | ja |
|-----|----|----|----|
| nav.products | 제품 | Products | 製品 |
| nav.about | 회사소개 | About | 会社概要 |
| nav.media | 미디어 | Media | メディア |
| nav.careers | 채용 | Careers | 採用 |
| nav.contact | 문의하기 | Contact | お問い合わせ |

### footer (값은 실데이터 유지, 라벨만 번역)
| key | ko | en | ja |
|-----|----|----|----|
| footer.company | (주) 파인더스에이아이 | Fainders.AI Inc. | Fainders.AI Inc. |
| footer.labels.ceo | 대표이사 | CEO | 代表取締役 |
| footer.labels.tel | 전화 | Tel | 電話 |
| footer.labels.address | 주소 | Address | 住所 |
| footer.labels.bizNo | 사업자등록번호 | Business Reg. No. | 事業者登録番号 |
| footer.labels.email | 이메일 문의 | Email | メールでのお問い合わせ |
| footer.policies.privacy | 개인정보 처리방침 | Privacy Policy | プライバシーポリシー |
| footer.policies.cctv | 영상정보처리기기 운영 · 관리 방침 | CCTV Operation & Management Policy | 映像情報処理機器 運営・管理方針 |

기존 `products.*`(고유명사) 유지. 키 동기 검증: ko=en=ja=22 keys, 완전 일치.

## 2. @fai/ui props 추가 (next-intl import 0 — 주석에서만 언급)

- **`Footer`** (`packages/ui/components/footer/Footer.tsx`): `labels?: FooterLabels` 추가.
  - `FooterLabels` = { company, ceo, tel, address, bizNo, email, privacy, cctv } (전부 optional).
  - 실데이터 값(전화/주소/사업자번호/이메일)은 컴포넌트 내부 `VALUES` 상수로 **비번역 유지**, 정책 href도 `POLICY_HREFS`로 유지. 라벨만 props로 주입.
  - 미지정 시 `DEFAULT_LABELS`(현행 한국어)로 폴백 → 하위호환 유지. `PolicyLinks`/`InfoRow`는 인자로 데이터를 받도록 리팩터(하드코딩 상수 제거).
  - `SnsButtons` aria는 고유명사(LinkedIn/YouTube/Instagram)라 번역 대상 아님 → prop 미추가.
- **`NavigationBar`** (`packages/ui/components/NavigationBar.tsx`): `contactLabel?: string`(기본 "문의하기") + `drawerLabels?: DrawerLabels` 추가.
- **`TabletDrawerMenu`** (`packages/ui/components/navigation/TabletDrawerMenu.tsx`): `labels?: DrawerLabels` 추가.
  - `DrawerLabels` = { products, about, media, careers, contact } (optional). 미지정 시 `DEFAULT_DRAWER_LABELS`(한국어) 폴백.
  - onItemClick/onContactClick/onNavigate GA 배선 유지. onItemClick payload의 label도 주입된 번역 라벨로 통일(href는 라우트 그대로), 데스크톱 계약과 정합.
- **`packages/ui/index.ts`**: `FooterLabels`, `DrawerLabels`, `TabletDrawerMenuProps` 타입 export 추가.

구조 파손 없음 — 기존 prop 기본값이 전부 현행 한국어라 다른 소비자/하위호환 안전. 게이트 이전에 escalate 사유 없음.

## 3. 브릿지 배선 (homepage — 클라이언트)

- **`NavigationBarBridge.tsx`**: `useTranslations('nav')`로 `navItems` 라벨 동적 생성, `contactLabel={t('contact')}`, `drawerLabels`(products/about/media/careers/contact) 전달. onContactClick GA label도 `t('contact')`로. (채용 external href의 aria-label "파인더스에이아이 채용 홈..."은 고유명사라 한국어 유지.)
- **`FooterBridge.tsx`**: `useTranslations('footer')`로 `labels` 객체 구성해 `Footer`에 전달. GA onSocialClick 유지.

## 4. 게이트 결과

- `pnpm build`: ✅ Compiled successfully, TypeScript OK, 26/26 static pages 생성 (/ko /en /ja 프리렌더).
- `pnpm test`: ✅ 4 files / 13 tests passed.

## 5. 로케일별 렌더 증거 (out/{ko,en,ja}/index.html grep)

**Nav 라벨**
- ko: 제품 / 회사소개 / 미디어 / 채용
- en: Products / About / Media / Careers
- ja: 製品 / 会社概要 / メディア / 採用

**Footer 라벨**
- ko: 대표이사 / 전화 / 주소 / 사업자등록번호 / 개인정보 처리방침
- en: CEO / Tel / Address / Business Reg. No. / Privacy Policy
- ja: 代表取締役 / 電話 / 住所 / 事業者登録番号 / プライバシーポリシー

**회사명 / Contact CTA**
- ko: (주) 파인더스에이아이 / 문의하기
- en: Fainders.AI Inc. / Contact
- ja: Fainders.AI Inc. / お問い合わせ

**실데이터 불변(3 로케일 동일)**: `02-6191-0049`, `809-86-01657`, `contact@fainders.ai` 모두 그대로.

## 6. 마케팅 검수 로그

`products/homepage/docs/TODO_i18n-marketing-review.md` 신규 작성. nav/CTA/footer en·ja 초벌 + 회사명 처리 결정(한글 상호 유지 / en·ja `Fainders.AI Inc.`, 등기 영문표기·일본어 법인표기 확인 필요) 기록.

## 7. 우려/후속

- en/ja 출력에 잔존한 `문의하기`는 `common.cta.requestDemo`(도입 문의하기)로 Phase 2(home CTA) 소관 — 이번 페이즈 범위 아님, 정상.
- 미사용 레거시 `packages/ui/components/Footer.tsx`(index에서 export 안 함)는 손대지 않음 — 하드코딩 한국어 잔존하나 데드코드. 정리 시 별도 판단 필요.
- `common.cta.*` 다수 키는 정의만 하고 후속 페이즈에서 소비 — 계획상 허용됨.
