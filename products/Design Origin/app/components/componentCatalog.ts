export type ComponentPreviewKey =
  | "button"
  | "iconButton"
  | "icoTxtButton"
  | "label"
  | "cardItem"
  | "checkbox"
  | "checkboxField"
  | "lineInput"
  | "dropdown"
  | "menu"
  | "hoverDropdown"
  | "progressBar"
  | "drawer"
  | "drawerMenu"
  | "scrollbar"
  | "scrollTopButton"
  | "marquee"
  | "logoMarquee"
  | "inViewVideo"
  | "customerSupportGraphic"
  | "commonIcons"
  | "navigationBar"
  | "header"
  | "footer"
  | "languageSwitcher"
  | "megaNavMenu"
  | "megaMenuPanel"
  | "globalUtilityMenu"
  | "tabletDrawerMenu"
  | "toast";

export type ComponentCatalogItem = {
  name: string;
  slug: string;
  source: string;
  group: string;
  summary: string;
  preview: ComponentPreviewKey;
  notes: string[];
};

export type ComponentProperty = {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: string;
};

export const componentCatalog: ComponentCatalogItem[] = [
  { name: "Button", slug: "button", source: "packages/ui/components/Button.tsx", group: "Actions", summary: "CTA 우선순위를 표현하는 기본 버튼입니다.", preview: "button", notes: ["Actions가 명확한 경우에만 사용합니다.", "tone은 화면 안의 CTA 우선순위에 따라 선택합니다."] },
  { name: "IconButton", slug: "icon-button", source: "packages/ui/components/button/IconButton.tsx", group: "Actions", summary: "아이콘만으로 동작을 전달하는 버튼입니다.", preview: "iconButton", notes: ["의미를 설명하는 aria-label을 항상 제공합니다.", "툴바, 닫기, 이전·다음 이동에 사용합니다."] },
  { name: "IcoTxtButton", slug: "ico-txt-button", source: "packages/ui/components/button/IcoTxtButton.tsx", group: "Actions", summary: "아이콘과 텍스트를 결합한 명령 버튼입니다.", preview: "icoTxtButton", notes: ["짧고 동사 중심의 레이블에 사용합니다.", "아이콘은 레이블의 의미를 보조합니다."] },
  { name: "Label", slug: "label", source: "packages/ui/components/label/Label.tsx", group: "Display", summary: "상태와 분류를 표시하는 작은 라벨입니다.", preview: "label", notes: ["상태와 분류 정보에 우선 사용합니다.", "콘텐츠 제목보다 강한 위계를 만들지 않습니다."] },
  { name: "CardItem", slug: "card-item", source: "packages/ui/components/card/CardItem.tsx", group: "Display", summary: "반복 콘텐츠를 담는 기본 카드 컨테이너입니다.", preview: "cardItem", notes: ["반복 목록의 개별 항목에 사용합니다.", "카드 안에 카드를 중첩하지 않습니다."] },
  { name: "Checkbox", slug: "checkbox", source: "packages/ui/components/Checkbox.tsx", group: "Forms", summary: "선택, 해제, partial 상태를 입력하는 체크박스입니다.", preview: "checkbox", notes: ["독립 라벨이 필요하면 CheckboxField를 사용합니다.", "partial은 하위 선택이 일부만 완료된 경우에 사용합니다."] },
  { name: "CheckboxField", slug: "checkbox-field", source: "packages/ui/components/CheckboxField.tsx", group: "Forms", summary: "체크박스와 텍스트 라벨을 하나로 묶은 입력 필드입니다.", preview: "checkboxField", notes: ["동의와 다중 옵션 선택에 사용합니다.", "라벨만으로 선택 결과를 이해할 수 있어야 합니다."] },
  { name: "LineInput", slug: "line-input", source: "packages/ui/components/LineInput.tsx", group: "Forms", summary: "하단 라인 형태의 텍스트 입력 필드입니다.", preview: "lineInput", notes: ["필수 입력은 label과 함께 명확히 표시합니다.", "에러 문구는 해결 방법을 포함합니다."] },
  { name: "Dropdown", slug: "dropdown", source: "packages/ui/components/Dropdown.tsx", group: "Navigation", summary: "선택지 목록을 열어 고르는 드롭다운입니다.", preview: "dropdown", notes: ["현재 선택값과 placeholder를 구분합니다.", "긴 목록은 검색 또는 별도 선택 화면을 검토합니다."] },
  { name: "Menu", slug: "menu", source: "packages/ui/components/Menu.tsx", group: "Navigation", summary: "관련 탐색 또는 액션 항목을 묶어 보여주는 메뉴입니다.", preview: "menu", notes: ["관련 항목만 짧게 그룹화합니다.", "파괴적인 액션은 별도 위계로 분리합니다."] },
  { name: "HoverDropdown", slug: "hover-dropdown", source: "packages/ui/components/hover-dropdown/HoverDropdown.tsx", group: "Navigation", summary: "데스크톱 hover로 열리는 보조 메뉴입니다.", preview: "hoverDropdown", notes: ["데스크톱 보조 탐색에 사용합니다.", "터치 환경에서도 열 수 있는 경로를 함께 제공합니다."] },
  { name: "ProgressBar", slug: "progress-bar", source: "packages/ui/components/ProgressBar.tsx", group: "Feedback", summary: "다단계 작업의 진행 상태를 보여주는 바입니다.", preview: "progressBar", notes: ["단계 수와 현재 위치를 함께 전달합니다.", "진행 상태는 실제 작업 상태와 동기화합니다."] },
  { name: "Drawer", slug: "drawer", source: "packages/ui/components/ui/Drawer.tsx", group: "Overlay", summary: "화면 위에 보조 콘텐츠를 여는 드로어입니다.", preview: "drawer", notes: ["현재 맥락을 유지한 채 보조 작업을 제공할 때 사용합니다.", "닫기 동작과 포커스 이동을 함께 확인합니다."] },
  { name: "DrawerMenu", slug: "drawer-menu", source: "packages/ui/components/navigation/DrawerPrimitives.tsx", group: "Overlay", summary: "드로어 안의 탐색 목록을 구성하는 primitive입니다.", preview: "drawerMenu", notes: ["Drawer 안에서 관련 탐색 링크를 정리할 때 사용합니다.", "항목 레이블은 목적지를 명확히 설명합니다."] },
  { name: "Scrollbar", slug: "scrollbar", source: "packages/ui/components/Scrollbar.tsx", group: "Utility", summary: "가로 또는 세로 스크롤 영역을 다루는 컨테이너입니다.", preview: "scrollbar", notes: ["제한된 영역에서만 사용합니다.", "스크롤 가능한 콘텐츠가 있다는 단서를 함께 제공합니다."] },
  { name: "ScrollTopButton", slug: "scroll-top-button", source: "packages/ui/components/ScrollTopButton.tsx", group: "Utility", summary: "페이지 스크롤 위치에 따라 나타나는 상단 이동 버튼입니다.", preview: "scrollTopButton", notes: ["긴 문서형 페이지에서 사용합니다.", "실제 페이지가 300px 이상 내려갔을 때 자연스럽게 노출됩니다."] },
  { name: "Marquee", slug: "marquee", source: "packages/ui/components/marquee/Marquee.tsx", group: "Motion", summary: "반복 콘텐츠를 연속적으로 흐르게 하는 마키입니다.", preview: "marquee", notes: ["짧고 반복 가능한 항목에 사용합니다.", "핵심 정보는 마키에만 의존하지 않습니다."] },
  { name: "LogoMarquee", slug: "logo-marquee", source: "packages/ui/components/LogoMarquee.tsx", group: "Motion", summary: "파트너 또는 고객 로고를 연속적으로 보여주는 마키입니다.", preview: "logoMarquee", notes: ["동일한 비중의 로고 목록에 사용합니다.", "각 로고에는 브랜드를 설명하는 alt를 제공합니다."] },
  { name: "InViewVideo", slug: "in-view-video", source: "packages/ui/components/in-view-video/InViewVideo.tsx", group: "Motion", summary: "화면 안에 들어올 때 재생하고 벗어나면 멈추는 영상입니다.", preview: "inViewVideo", notes: ["자동 재생 영상은 muted와 playsInline을 유지합니다.", "감소된 모션 환경에서는 재생하지 않습니다."] },
  { name: "CustomerSupportGraphic", slug: "customer-support-graphic", source: "packages/ui/components/CustomerSupportGraphic.tsx", group: "Graphics", summary: "고객 지원 맥락을 전달하는 공통 그래픽입니다.", preview: "customerSupportGraphic", notes: ["지원 안내와 피드백 UI에 사용합니다.", "의미를 전달하는 주변 텍스트와 함께 배치합니다."] },
  { name: "Common Icons", slug: "common-icons", source: "packages/ui/components/common/Icon", group: "Graphics", summary: "의미 기반의 공통 아이콘 모음입니다.", preview: "commonIcons", notes: ["아이콘만으로 의미가 충분하지 않으면 레이블을 함께 제공합니다.", "장식용 아이콘은 보조 기술에서 제외합니다."] },
  { name: "NavigationBar", slug: "navigation-bar", source: "packages/ui/components/NavigationBar.tsx", group: "Navigation", summary: "제품의 글로벌 탐색과 모바일 드로어를 제공하는 내비게이션 바입니다.", preview: "navigationBar", notes: ["제품의 최상위 탐색에 사용합니다.", "navItems로 제품별 정보 구조를 전달합니다."] },
  { name: "Header", slug: "header", source: "packages/ui/components/Header.tsx", group: "Layout", summary: "사이트 제목과 전역 탐색을 제공하는 헤더입니다.", preview: "header", notes: ["페이지 맥락을 유지하는 상단 탐색에 사용합니다.", "모바일에서는 메뉴 버튼으로 항목을 전환합니다."] },
  { name: "Footer", slug: "footer", source: "packages/ui/components/footer/Footer.tsx", group: "Layout", summary: "회사 정보, 정책 링크, 보조 탐색을 제공하는 푸터입니다.", preview: "footer", notes: ["사이트 공통 하단 정보에 사용합니다.", "정책과 외부 링크는 최신 정보를 유지합니다."] },
  { name: "LanguageSwitcher", slug: "language-switcher", source: "packages/ui/components/navigation/LanguageSwitcher.tsx", group: "Navigation", summary: "현재 locale을 표시하고 언어 변경 이벤트를 전달합니다.", preview: "languageSwitcher", notes: ["next-intl locale provider 안에서 사용합니다.", "제품의 실제 locale 변경 로직을 onLocaleChange에 연결합니다."] },
  { name: "MegaNavMenu", slug: "mega-nav-menu", source: "packages/ui/components/navigation/MegaNavMenu.tsx", group: "Navigation", summary: "일반 링크와 대형 드롭다운을 조립하는 데스크톱 탐색 메뉴입니다.", preview: "megaNavMenu", notes: ["정보량이 많은 전역 탐색에 사용합니다.", "dropdownItems 또는 megaMenuPanel을 명시적으로 전달합니다."] },
  { name: "MegaMenuPanel", slug: "mega-menu-panel", source: "packages/ui/components/navigation/MegaMenuPanel.tsx", group: "Navigation", summary: "메가 메뉴 안에서 제품 또는 콘텐츠 카드를 보여주는 패널입니다.", preview: "megaMenuPanel", notes: ["MegaNavMenu의 megaMenuPanel에 배치합니다.", "각 항목은 목적지와 설명, 이미지가 필요합니다."] },
  { name: "GlobalUtilityMenu", slug: "global-utility-menu", source: "packages/ui/components/navigation/GlobalUtilityMenu.tsx", group: "Navigation", summary: "언어와 보조 링크를 포함하는 글로벌 유틸리티 메뉴입니다.", preview: "globalUtilityMenu", notes: ["드로어 안의 보조 탐색에 사용합니다.", "링크를 선택하면 onClose로 현재 메뉴를 닫습니다."] },
  { name: "TabletDrawerMenu", slug: "tablet-drawer-menu", source: "packages/ui/components/navigation/TabletDrawerMenu.tsx", group: "Navigation", summary: "태블릿과 모바일의 계층형 탐색 메뉴입니다.", preview: "tabletDrawerMenu", notes: ["productItems를 전달해 제품 아코디언을 구성합니다.", "onNavigate에 드로어 닫기 같은 후속 동작을 연결합니다."] },
  { name: "Toast", slug: "toast", source: "packages/ui/components/Toast.tsx", group: "Feedback", summary: "피드백 메시지와 보조 액션을 함께 제공하는 토스트입니다.", preview: "toast", notes: ["작업 결과를 짧고 명확하게 전달합니다.", "보조 액션은 하나의 되돌리기 또는 다음 행동으로 제한합니다."] },
];

export const componentLinks = componentCatalog.map((item) => ({ href: `/components/${item.slug}`, label: item.name, slug: item.slug }));

export const componentProperties: Record<string, ComponentProperty[]> = {
  Button: [
    { name: "tone", type: '"primary" | "secondary" | "tertiary" | "assistive" | "brandAssistive"', defaultValue: '"primary"', description: "버튼의 시각적 우선순위입니다." },
    { name: "size", type: '"xl" | "l" | "m" | "s"', defaultValue: '"m"', description: "버튼 크기입니다." },
    { name: "shape", type: '"square" | "round"', defaultValue: '"square"', description: "모서리 형태입니다." },
    { name: "loading", type: "boolean", defaultValue: "false", description: "로딩 상태를 표시하고 입력을 막습니다." },
    { name: "children", type: "ReactNode", required: true, description: "버튼 레이블입니다." },
  ],
  IconButton: [
    { name: "icon", type: "ReactNode | arrow icon", required: true, description: "동작을 전달하는 아이콘입니다." },
    { name: "variant", type: '"primary" | "secondary" | "tertiary" | "assistive"', defaultValue: '"tertiary"', description: "버튼 스타일입니다." },
    { name: "size", type: '"XL" | "L" | "M" | "S"', defaultValue: '"L"', description: "터치 영역과 아이콘 크기입니다." },
    { name: "shape", type: '"square" | "circle"', defaultValue: '"circle"', description: "외곽 형태입니다." },
  ],
  IcoTxtButton: [
    { name: "children", type: "ReactNode", required: true, description: "버튼 레이블입니다." },
    { name: "icon", type: "ReactNode", description: "레이블을 보조하는 아이콘입니다." },
    { name: "iconPosition", type: '"left" | "right"', defaultValue: '"left"', description: "아이콘 위치입니다." },
    { name: "isLoading", type: "boolean", defaultValue: "false", description: "로딩 상태를 표시합니다." },
  ],
  Label: [{ name: "children", type: "ReactNode", required: true, description: "라벨 텍스트입니다." }, { name: "size", type: '"L" | "M" | "S"', defaultValue: '"L"', description: "라벨 크기입니다." }, { name: "shape", type: '"square" | "round"', defaultValue: '"square"', description: "라벨 형태입니다." }],
  CardItem: [{ name: "children", type: "ReactNode", required: true, description: "카드 안에 배치할 콘텐츠입니다." }],
  Checkbox: [{ name: "checked", type: 'boolean | "partial"', defaultValue: "false", description: "선택 또는 partial 상태입니다." }, { name: "onChange", type: "(checked: boolean) => void", description: "선택 상태 변경 이벤트입니다." }, { name: "disabled", type: "boolean", defaultValue: "false", description: "비활성 상태를 설정합니다." }, { name: "error", type: "boolean", defaultValue: "false", description: "에러 상태를 표시합니다." }],
  CheckboxField: [{ name: "label", type: "string", required: true, description: "체크박스 옆 레이블입니다." }, { name: "checked", type: 'boolean | "partial"', description: "선택 상태입니다." }, { name: "onChange", type: "(checked: boolean) => void", description: "선택 상태 변경 이벤트입니다." }],
  LineInput: [{ name: "label", type: "string", required: true, description: "입력 필드 제목입니다." }, { name: "value", type: "string", required: true, description: "현재 입력값입니다." }, { name: "onChange", type: "(value: string) => void", required: true, description: "입력값 변경 이벤트입니다." }, { name: "error", type: "boolean", defaultValue: "false", description: "에러 상태를 표시합니다." }, { name: "helpText", type: "string", description: "보조 또는 에러 문구입니다." }],
  Dropdown: [{ name: "triggerEl", type: "(open, onToggle) => ReactNode", required: true, description: "트리거 UI를 렌더링합니다." }, { name: "size", type: '"S" | "M" | "L" | "XL"', defaultValue: '"M"', description: "패널 크기입니다." }, { name: "items", type: "DropdownItem[]", description: "표시할 항목입니다." }],
  Menu: [{ name: "size", type: '"S" | "M" | "L" | "XL"', defaultValue: '"M"', description: "메뉴 레이아웃입니다." }, { name: "items", type: "MenuItem[]", description: "메뉴 항목 목록입니다." }],
  HoverDropdown: [{ name: "trigger", type: "ReactNode", required: true, description: "열림을 유도하는 트리거입니다." }, { name: "panel", type: "ReactNode", required: true, description: "열릴 패널 콘텐츠입니다." }, { name: "className", type: "string", description: "루트 래퍼 클래스입니다." }],
  ProgressBar: [{ name: "count", type: "number", required: true, description: "전체 단계 수입니다." }, { name: "activeIndex", type: "number", required: true, description: "현재 활성 단계의 0-base index입니다." }, { name: "onChange", type: "(index: number) => void", required: true, description: "단계 선택 시 호출합니다." }, { name: "duration", type: "number", defaultValue: "4000", description: "활성 바 진행 시간(ms)입니다." }],
  Drawer: [{ name: "isOpen", type: "boolean", required: true, description: "드로어 열림 상태입니다." }, { name: "onClose", type: "() => void", required: true, description: "닫기 이벤트입니다." }, { name: "children", type: "ReactNode", required: true, description: "드로어 내부 콘텐츠입니다." }],
  DrawerMenu: [{ name: "children", type: "ReactNode", required: true, description: "드로어 메뉴 항목입니다." }],
  Scrollbar: [{ name: "children", type: "ReactNode", description: "스크롤 영역의 콘텐츠입니다." }],
  ScrollTopButton: [{ name: "props", type: "-", description: "별도 props 없이 window scroll을 감지합니다." }],
  Marquee: [{ name: "children", type: "ReactNode", required: true, description: "반복 노출할 콘텐츠입니다." }, { name: "speed", type: "number", defaultValue: "30", description: "한 바퀴 소요 시간(초)입니다." }, { name: "ariaLabel", type: "string", description: "영역의 접근성 레이블입니다." }],
  LogoMarquee: [{ name: "logos", type: "LogoItem[]", required: true, description: "src와 alt를 가진 로고 목록입니다." }, { name: "speed", type: "number", defaultValue: "30", description: "한 바퀴 소요 시간(초)입니다." }, { name: "tileOpacity", type: "number", defaultValue: "10", description: "로고 타일 배경의 불투명도입니다." }],
  InViewVideo: [{ name: "src", type: "string", required: true, description: "재생할 영상 경로입니다." }, { name: "poster", type: "string", description: "영상이 준비되기 전 표시할 poster 이미지입니다." }, { name: "className", type: "string", description: "video 요소에 전달할 스타일 클래스입니다." }],
  CustomerSupportGraphic: [{ name: "className", type: "string", description: "그래픽의 크기와 색상을 조정하는 클래스입니다." }],
  "Common Icons": [{ name: "className", type: "string", description: "아이콘 크기와 색상 클래스입니다." }, { name: "name", type: '"linkedin" | "instagram"', description: "SocialIcon의 브랜드 아이콘입니다." }],
  NavigationBar: [{ name: "navItems", type: "NavItem[]", description: "제품의 글로벌 탐색 항목입니다." }, { name: "desktopLangSwitcher", type: "(isTransparent) => ReactNode", description: "데스크톱 언어 전환 UI를 주입합니다." }, { name: "mobileLangSwitcher", type: "(isDarkMode) => ReactNode", description: "모바일 언어 전환 UI를 주입합니다." }],
  Header: [{ name: "props", type: "-", description: "현재 구현은 내부 siteConfig와 현재 pathname을 사용합니다." }],
  Footer: [{ name: "brandLogo", type: "ReactNode", description: "제품의 asset 경로에 맞는 브랜드 마크를 주입합니다." }],
  LanguageSwitcher: [{ name: "onLocaleChange", type: "(code: string) => void", required: true, description: "새 locale 선택 시 호출합니다." }, { name: "isDarkMode", type: "boolean", defaultValue: "false", description: "어두운 배경에서의 색상 상태를 설정합니다." }],
  MegaNavMenu: [{ name: "isTransparent", type: "boolean", required: true, description: "투명 헤더 컨텍스트의 텍스트 상태입니다." }, { name: "navItems", type: "NavItem[]", required: true, description: "일반 또는 dropdown 탐색 항목입니다." }],
  MegaMenuPanel: [{ name: "title", type: "string", required: true, description: "패널 제목입니다." }, { name: "items", type: "MegaMenuItemData[]", required: true, description: "설명, 목적지, 이미지를 포함한 카드 목록입니다." }],
  GlobalUtilityMenu: [{ name: "navItems", type: "NavItem[]", required: true, description: "표시할 보조 탐색 항목입니다." }, { name: "onClose", type: "() => void", required: true, description: "메뉴를 닫는 이벤트입니다." }, { name: "langRow", type: "ReactNode", description: "상단에 배치할 언어 전환 UI입니다." }],
  TabletDrawerMenu: [{ name: "productItems", type: "TabletDrawerMenuItem[]", description: "아코디언 안에 표시할 제품 메뉴입니다." }, { name: "onNavigate", type: "() => void", description: "링크 선택 후 호출합니다." }],
  Toast: [{ name: "text", type: "string", required: true, description: "표시할 피드백 메시지입니다." }, { name: "buttonLabel", type: "string", required: true, description: "보조 액션 레이블입니다." }, { name: "onButtonClick", type: "() => void", description: "보조 액션 이벤트입니다." }],
};

export function getComponentBySlug(slug: string) {
  return componentCatalog.find((item) => item.slug === slug);
}
