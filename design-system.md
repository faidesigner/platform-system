# 🚀 Global Design System (Master Guide)

## ⚠️ Source of Truth (진실의 원천)
모든 수치의 최종 권한은 **.json** 파일에 있습니다. .md 파일은 정책 설명용이며, 피그마 반영 및 코드 생성 시에는 반드시 **.json 데이터를 최우선**합니다.

## 🏗️ 1. Directory Structure
- 📁 **foundation/**: 디자인 원자 데이터 (Color, Typo, Spacing 등)
- 📁 **components/**: 플랫폼별 부품 명세 (`/web`, `/tablet`)
- 📄 **component-template.md**: 신규 컴포넌트 생성 시 복사하여 사용하는 표준 양식

## 🧱 2. Common Rules (공통 규칙)
- **Naming**: 모든 Key 값은 `kebab-case`를 사용한다. (예: `bg-color`)
- **Units**: 수치는 반드시 단위를 포함한 `string`으로 작성한다. (예: `"16px"`, `"1.2rem"`)
- **Tokens**: 직접적인 값 대신 `foundation/`의 토큰 경로를 참조한다.
- **Tailwind**: `web/` 폴더 작업 시 대응하는 Tailwind 클래스를 병기한다. (`"tailwind": "gap-2"`)

## 🤖 3. AI Execution & Mapping Rules
- **Reference**: 컴포넌트 생성 전 반드시 `foundation/` 데이터를 먼저 로드하라.
- **Validation**: 누락 데이터 발견 시 `"MISSING_FROM_DESIGN"`으로 표기하고 `_description`에 내용을 적는다.
- **Alert**: 작업 완료 후 **"⚠️ 데이터 누락 알림: [항목] 확인 필요"** 메시지를 출력하라.
