# Components Catalog Contract

## Purpose

Design Origin의 Components 페이지는 디자이너와 개발자가 다음 두 가지를 확인하는 공통 카탈로그다.

1. 현재 재사용 가능한 공통 컴포넌트가 무엇인지 확인한다.
2. 각 컴포넌트가 어떤 상태와 property로 실제 동작하는지 직접 확인한다.

## Ownership And Boundaries

- 이 문서는 `products/Design Origin`이 소유한다.
- `packages/ui`는 컴포넌트 구현, public export, 타입 계약만 소유한다.
- Design Origin의 demo는 `packages/ui`의 public API만 import한다.
- demo를 위해 `packages/ui` 컴포넌트의 CSS, 위치, 상태를 강제로 덮어쓰지 않는다.
- Design Origin과 `packages/ui`가 별도 repository로 분리되어도 이 문서와 demo는 유지되어야 한다.

## Catalog Scope

Components 페이지에는 독립적으로 재사용 가능한 공통 컴포넌트만 등록한다.

### Included

- Actions: Button, IconButton, IcoTxtButton
- Forms: Checkbox, CheckboxField, LineInput, Dropdown
- Display: Label, CardItem
- Feedback: ProgressBar, Toast
- Navigation: Menu, HoverDropdown, NavigationBar, LanguageSwitcher, MegaNavMenu, MegaMenuPanel, GlobalUtilityMenu, TabletDrawerMenu
- Overlay: Drawer, DrawerMenu
- Utility: Scrollbar, ScrollTopButton, Marquee, LogoMarquee, InViewVideo, CustomerSupportGraphic, Common Icons
- Layout: Header, Footer

## Detail Page Structure

각 컴포넌트 상세 페이지는 아래 순서를 따른다.

1. Interactive canvas
   - 실제 `packages/ui` 컴포넌트를 렌더링한다.
   - 선택한 state와 variant가 즉시 보인다.
2. Controls
   - tone, size, loading, disabled, open 등 공개 property를 직접 조작한다.
3. Properties
   - Required와 Optional을 구분해 name, type, default, description을 보여준다.
4. Behavior
   - 클릭, 선택, 열림/닫힘, validation처럼 사용자에게 보이는 동작을 설명한다.

## Demo Rules

- demo에는 실제 public property만 사용한다.
- demo를 성립시키기 위한 mock data는 Design Origin 내부에 둔다.
- 제품 route, locale provider, media asset이 필수라면 그 dependency를 숨기지 않는다.
- 독립 실행이 불가능한 컴포넌트는 `ready`로 표시하지 않는다.
- preview canvas는 컴포넌트의 원래 position, scroll, visibility 규칙을 강제로 변경하지 않는다.

## Registration Criteria

컴포넌트가 Components 카탈로그에 `ready`로 등록되려면 아래를 모두 충족해야 한다.

- 실제 `packages/ui` public export를 사용한다.
- 디자이너가 주요 property와 상태를 보고 조작할 수 있다.
- keyboard, focus, open/close 등 핵심 interaction이 실제 제품과 같은 방식으로 동작한다.
- typecheck와 production build를 통과한다.

이 기준을 충족하지 못하면 카탈로그에는 노출하지 않거나 `planned` 상태로 관리한다.
