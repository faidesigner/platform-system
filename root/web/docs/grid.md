# Web Layout Grid System

본 Grid System은 웹 환경을 기준으로 설계되었습니다.

모든 Grid 구조는 CSS 기반 반응형 웹 레이아웃을 기준으로 설계합니다.

사용 범위:

- B2B Admin
- Dashboard
- Responsive Web

본 시스템은 과도한 넓이 확장보다 정보 밀도와 가독성의 균형을 우선합니다.

레이아웃 시스템은 아래 기준을 우선합니다.

- 명확한 정보 위계
- 안정적인 여백 구조
- 반응형 확장성
- 디자인 ↔ 코드 일관성

---

# Breakpoints

| 이름 | Width |
| --- | --- |
| mobile | 390 |
| tablet | 768 |
| laptop | 1280 |
| desktop | 1440 |
| desktopLarge | 1920 |

---

# Grid 규칙

## Mobile

- 4 Columns
- Gutter: 16
- Container Padding: 20

사용 목적

- 모바일 홈페이지
- 빠른 액션 중심 화면
- 간단한 조회 화면

---

## Tablet

- 8 Columns
- Gutter: 20
- Container Padding: 24

사용 목적

- 태블릿 반응형 대응
- 사이드 패널 구조
- 간단한 테이블 화면

---

## Laptop

- 8 Columns
- Gutter: 20
- Container Padding: 24
- Max Content Width: 1120

사용 목적

- 작은 데스크탑 환경
- 운영 중심 B2B 화면
- 데이터 밀도가 높은 화면

---

## Desktop

- 12 Columns
- Gutter: 24
- Container Padding: 32
- Max Content Width: 1200

기본 데스크탑 레이아웃.

사용 목적

- 어드민 대시보드
- 데이터 관리 화면
- 분석 및 운영 화면

---

## Desktop Large

- 12 Columns
- Gutter: 24
- Container Padding: 40
- Max Content Width: 1440

사용 목적

- 넓은 모니터 환경
- 홈페이지 / 마케팅 페이지
- 여백감이 필요한 화면

---

# Layout 원칙

## Container Padding

Container Padding은
화면 가장자리와 콘텐츠 사이의 기본 안전 여백입니다.

모든 레이아웃은
Container Padding을 반드시 유지해야 합니다.

UI 요소를 화면 끝에 직접 붙이지 않습니다.

---

# 반응형 규칙

## Desktop → Tablet

- 12 Columns → 8 Columns 축소
- 정보 위계를 유지
- 좌우 여백을 점진적으로 축소

---

## Tablet → Mobile

- 핵심 액션 우선 노출
- 사이드 패널 접기
- 테이블 단순화
- 보조 액션 축소

---

# 디자인 시스템 규칙

- 임의 Spacing 값 사용 금지
- 임의 Grid 구조 생성 금지
- 정의된 Layout Token만 사용
- Container Padding 일관성 유지
- 모든 반응형 환경에서 동일한 구조 원칙 유지

---

# 코드 생성 규칙

AI / Cursor / MCP / Figma 자동화 사용 시:

- 반드시 Layout Token 사용
- 반드시 Breakpoint 기준 준수
- 시스템 외 Grid 구조 생성 금지
- 재사용 가능한 반응형 패턴 우선 사용
