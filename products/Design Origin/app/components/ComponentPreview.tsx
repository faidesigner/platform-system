"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { NextIntlClientProvider } from "next-intl";
import {
  ArrowUpIcon,
  Button,
  CardItem,
  Checkbox,
  CheckboxField,
  Drawer,
  DrawerListItem,
  DrawerMenu,
  Dropdown,
  GlobeIcon,
  HoverDropdown,
  IconButton,
  IcoTxtButton,
  Label,
  LineInput,
  LanguageSwitcher,
  Marquee,
  MegaMenuPanel,
  MegaNavMenu,
  Menu,
  NavigationBar,
  ProgressBar,
  ScrollTopButton,
  Scrollbar,
  SocialIcon,
  TabletDrawerMenu,
  Toast,
  GlobalUtilityMenu,
  Header,
  Footer,
  InViewVideo,
  LogoMarquee,
  CustomerSupportGraphic,
} from "@fai/ui";
import type { ComponentPreviewKey } from "./componentCatalog";

type ControlOption = { label: string; value: string };

function SegmentedControl({ label, value, options, onChange }: { label: string; value: string; options: ControlOption[]; onChange: (value: string) => void }) {
  return <div className="origin-demo-control"><span>{label}</span><div role="group" aria-label={label} className="origin-demo-segmented">{options.map((option) => <button type="button" key={option.value} aria-pressed={value === option.value} className={value === option.value ? "is-selected" : undefined} onClick={() => onChange(option.value)}>{option.label}</button>)}</div></div>;
}

function ToggleControl({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="origin-demo-toggle"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>;
}

type DemoLayout = "compact" | "wide" | "viewport";

function DemoFrame({ children, controls, layout = "compact" }: { children: React.ReactNode; controls?: React.ReactNode; layout?: DemoLayout }) {
  return <><section aria-label="Interactive canvas" className={`origin-component-stage origin-component-stage--${layout}`}><div className="origin-component-stage-content">{children}</div></section>{controls ? <section className="origin-demo-controls" aria-label="Component controls"><h2>Controls</h2><div>{controls}</div></section> : null}</>;
}

function PreviewBoard({ children }: { children: React.ReactNode }) {
  return <div className="origin-preview-board">{children}</div>;
}

function PreviewGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <section className="origin-preview-group"><p>{label}</p><div>{children}</div></section>;
}

export function ComponentPreview({ type }: { type: ComponentPreviewKey }) {
  const [buttonTone, setButtonTone] = useState<"primary" | "secondary" | "tertiary">("primary");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [iconVariant, setIconVariant] = useState<"primary" | "secondary" | "tertiary" | "assistive">("tertiary");
  const [icoLoading, setIcoLoading] = useState(false);
  const [labelShape, setLabelShape] = useState<"square" | "round">("square");
  const [checked, setChecked] = useState(true);
  const [partial, setPartial] = useState(false);
  const [inputValue, setInputValue] = useState("Design Origin");
  const [inputError, setInputError] = useState(false);
  const [step, setStep] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastText, setToastText] = useState("Changes have been saved.");

  const navItems = [
    { label: "Products", href: "#products", dropdown: true, dropdownItems: [{ label: "Design Origin", href: "#design-origin" }] },
    { label: "Company", href: "#company" },
  ] as const;

  switch (type) {
    case "button": return <DemoFrame controls={<><SegmentedControl label="Interactive tone" value={buttonTone} onChange={(value) => setButtonTone(value as typeof buttonTone)} options={[{ label: "Primary", value: "primary" }, { label: "Secondary", value: "secondary" }, { label: "Tertiary", value: "tertiary" }]} /><ToggleControl label="Loading" checked={buttonLoading} onChange={setButtonLoading} /></>}><PreviewBoard><PreviewGroup label="Tone"><Button tone="primary">Primary</Button><Button tone="secondary">Secondary</Button><Button tone="tertiary">Tertiary</Button><Button tone="assistive">Assistive</Button><Button tone="brandAssistive">Brand assistive</Button></PreviewGroup><PreviewGroup label="Size"><Button size="xl">XL</Button><Button size="l">L</Button><Button size="m">M</Button><Button size="s">S</Button></PreviewGroup><PreviewGroup label="State"><Button disabled>Disabled</Button><Button loading>Loading</Button><Button shape="round">Round</Button><Button tone={buttonTone} loading={buttonLoading}>Interactive</Button></PreviewGroup></PreviewBoard></DemoFrame>;
    case "iconButton": return <DemoFrame controls={<SegmentedControl label="Interactive variant" value={iconVariant} onChange={(value) => setIconVariant(value as typeof iconVariant)} options={[{ label: "Primary", value: "primary" }, { label: "Secondary", value: "secondary" }, { label: "Tertiary", value: "tertiary" }, { label: "Assistive", value: "assistive" }]} />}><PreviewBoard><PreviewGroup label="Variant"><IconButton icon="arrowshapeRight" variant="primary" aria-label="Primary" /><IconButton icon="arrowshapeRight" variant="secondary" aria-label="Secondary" /><IconButton icon="arrowshapeRight" variant="tertiary" aria-label="Tertiary" /><IconButton icon="arrowshapeRight" variant="assistive" aria-label="Assistive" /></PreviewGroup><PreviewGroup label="Size"><IconButton icon="arrowshapeRight" size="XL" aria-label="Extra large" /><IconButton icon="arrowshapeRight" size="L" aria-label="Large" /><IconButton icon="arrowshapeRight" size="M" aria-label="Medium" /><IconButton icon="arrowshapeRight" size="S" aria-label="Small" /></PreviewGroup><PreviewGroup label="State"><IconButton icon="arrowshapeRight" disabled aria-label="Disabled" /><IconButton icon="arrowshapeRight" shape="square" aria-label="Square" /><IconButton icon="arrowshapeRight" variant={iconVariant} aria-label="Interactive" /></PreviewGroup></PreviewBoard></DemoFrame>;
    case "icoTxtButton": return <DemoFrame controls={<ToggleControl label="Interactive loading" checked={icoLoading} onChange={setIcoLoading} />}><PreviewBoard><PreviewGroup label="Variant"><IcoTxtButton variant="primary">Primary</IcoTxtButton><IcoTxtButton variant="secondary">Secondary</IcoTxtButton><IcoTxtButton variant="tertiary">Tertiary</IcoTxtButton></PreviewGroup><PreviewGroup label="Icon position"><IcoTxtButton variant="secondary" icon={<ArrowRight aria-hidden="true" />}>Leading</IcoTxtButton><IcoTxtButton variant="secondary" icon={<ArrowRight aria-hidden="true" />} iconPosition="right">Trailing</IcoTxtButton></PreviewGroup><PreviewGroup label="State"><IcoTxtButton disabled>Disabled</IcoTxtButton><IcoTxtButton isLoading>Loading</IcoTxtButton><IcoTxtButton variant="secondary" isLoading={icoLoading}>Interactive</IcoTxtButton></PreviewGroup></PreviewBoard></DemoFrame>;
    case "label": return <DemoFrame controls={<SegmentedControl label="Interactive shape" value={labelShape} onChange={(value) => setLabelShape(value as typeof labelShape)} options={[{ label: "Square", value: "square" }, { label: "Round", value: "round" }]} />}><PreviewBoard><PreviewGroup label="Size"><Label size="L">Large</Label><Label size="M">Medium</Label><Label size="S">Small</Label></PreviewGroup><PreviewGroup label="Shape"><Label size="M" shape="square">Square</Label><Label size="M" shape="round">Round</Label><Label size="M" shape={labelShape}>Interactive</Label></PreviewGroup></PreviewBoard></DemoFrame>;
    case "cardItem": return <DemoFrame><PreviewBoard><PreviewGroup label="Content"><div className="origin-component-card-preview"><CardItem><Label size="S">CardItem</Label><h3>Reusable surface</h3><p>공통 카드 컨테이너 안에 실제 제품 콘텐츠를 배치합니다.</p></CardItem></div></PreviewGroup><PreviewGroup label="Compact content"><div className="origin-component-card-preview"><CardItem><Label size="S" shape="round">New</Label><h3>Card title</h3></CardItem></div></PreviewGroup></PreviewBoard></DemoFrame>;
    case "checkbox": return <DemoFrame controls={<><ToggleControl label="Partial" checked={partial} onChange={setPartial} /><ToggleControl label="Selected" checked={checked} onChange={setChecked} /></>}><PreviewBoard><PreviewGroup label="State"><Checkbox checked={false} /><Checkbox checked /><Checkbox checked="partial" /><Checkbox disabled /></PreviewGroup><PreviewGroup label="Validation"><Checkbox error /><Checkbox checked error /><Checkbox checked={partial ? "partial" : checked} onChange={setChecked} /></PreviewGroup></PreviewBoard></DemoFrame>;
    case "checkboxField": return <DemoFrame controls={<ToggleControl label="Interactive selected" checked={checked} onChange={setChecked} />}><PreviewBoard><PreviewGroup label="State"><CheckboxField label="Default" checked={false} /><CheckboxField label="Selected" checked /><CheckboxField label="Disabled" disabled /><CheckboxField label="Error" error /></PreviewGroup><PreviewGroup label="Interactive"><CheckboxField label="Receive product updates" checked={checked} onChange={setChecked} /></PreviewGroup></PreviewBoard></DemoFrame>;
    case "lineInput": return <DemoFrame controls={<ToggleControl label="Interactive error" checked={inputError} onChange={setInputError} />}><PreviewBoard><PreviewGroup label="Default"><div className="origin-component-input-preview"><LineInput label="Component name" placeholder="Enter a name" value="" onChange={() => undefined} /></div></PreviewGroup><PreviewGroup label="State"><div className="origin-component-input-preview"><LineInput label="Filled" value="Design Origin" onChange={() => undefined} required /><LineInput label="Error" value="" onChange={() => undefined} error helpText="Enter a component name to continue." /><LineInput label="Disabled" value="Unavailable" onChange={() => undefined} disabled /></div></PreviewGroup><PreviewGroup label="Interactive"><div className="origin-component-input-preview"><LineInput label="Component name" value={inputValue} onChange={setInputValue} required error={inputError} helpText={inputError ? "Enter a component name to continue." : undefined} /></div></PreviewGroup></PreviewBoard></DemoFrame>;
    case "dropdown": return <DemoFrame layout="wide"><PreviewBoard><PreviewGroup label="Compact"><Dropdown size="S" triggerEl={(open, onToggle) => <button type="button" onClick={onToggle} className="origin-component-preview-trigger">Small <ChevronDown className={open ? "rotate-180" : undefined} aria-hidden="true" /></button>} items={[{ label: "Default option", href: "#default" }, { label: "Secondary option", href: "#secondary" }]} /><Dropdown size="M" triggerEl={(open, onToggle) => <button type="button" onClick={onToggle} className="origin-component-preview-trigger">Medium <ChevronDown className={open ? "rotate-180" : undefined} aria-hidden="true" /></button>} items={[{ label: "Default option", href: "#default" }, { label: "Secondary option", href: "#secondary" }]} /></PreviewGroup><PreviewGroup label="Mega menu"><Dropdown size="L" trigger="click" triggerEl={(open, onToggle) => <button type="button" onClick={onToggle} className="origin-component-preview-trigger">Large <ChevronDown className={open ? "rotate-180" : undefined} aria-hidden="true" /></button>} groups={[{ heading: "Products", items: [{ label: "Design Origin", href: "#design-origin", description: "Shared UI components" }] }]} /></PreviewGroup></PreviewBoard></DemoFrame>;
    case "menu": return <DemoFrame layout="wide"><PreviewBoard><PreviewGroup label="Vertical"><Menu size="S" items={[{ label: "Overview", href: "#overview", active: true }, { label: "Properties", href: "#properties" }, { label: "Behavior", href: "#behavior" }]} /><Menu size="M" items={[{ label: "Overview", href: "#overview", active: true }, { label: "Properties", href: "#properties" }, { label: "Behavior", href: "#behavior" }]} /></PreviewGroup><PreviewGroup label="Horizontal"><Menu size="L" items={[{ label: "Overview", href: "#overview", active: true }, { label: "Properties", href: "#properties" }, { label: "Behavior", href: "#behavior" }]} /></PreviewGroup></PreviewBoard></DemoFrame>;
    case "hoverDropdown": return <DemoFrame layout="wide"><PreviewBoard><PreviewGroup label="Hover"><HoverDropdown trigger={(open) => <button type="button" className="origin-component-preview-trigger">Hover menu <ChevronDown className={open ? "rotate-180" : undefined} aria-hidden="true" /></button>} panel={<Menu size="S" items={[{ label: "First action", href: "#first" }, { label: "Second action", href: "#second" }]} />} /><HoverDropdown trigger={(open) => <button type="button" className="origin-component-preview-trigger">With active item <ChevronDown className={open ? "rotate-180" : undefined} aria-hidden="true" /></button>} panel={<Menu size="M" items={[{ label: "Overview", href: "#overview", active: true }, { label: "Properties", href: "#properties" }]} />} /></PreviewGroup></PreviewBoard></DemoFrame>;
    case "progressBar": return <DemoFrame controls={<SegmentedControl label="Interactive step" value={String(step)} onChange={(value) => setStep(Number(value))} options={[0, 1, 2, 3].map((value) => ({ label: String(value + 1), value: String(value) }))} />}><PreviewBoard><PreviewGroup label="Progress"><div className="origin-component-progress-preview"><ProgressBar count={4} activeIndex={0} onChange={() => undefined} duration={2400} /><ProgressBar count={4} activeIndex={2} onChange={() => undefined} duration={2400} /><ProgressBar count={4} activeIndex={3} onChange={() => undefined} duration={2400} /></div></PreviewGroup><PreviewGroup label="Interactive"><div className="origin-component-progress-preview"><ProgressBar count={4} activeIndex={step} onChange={setStep} duration={2400} getAriaLabel={(index) => `Preview step ${index + 1}`} /></div></PreviewGroup></PreviewBoard></DemoFrame>;
    case "drawer": return <DemoFrame><PreviewBoard><PreviewGroup label="Closed"><Button tone="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button></PreviewGroup><PreviewGroup label="Content"><div className="origin-component-preview-drawer-menu"><DrawerMenu><DrawerListItem label="Component overview" href="#overview" /><DrawerListItem label="Properties" href="#properties" /></DrawerMenu></div></PreviewGroup></PreviewBoard><Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}><DrawerMenu><DrawerListItem label="Component overview" onClick={() => setDrawerOpen(false)} /><DrawerListItem label="Properties" onClick={() => setDrawerOpen(false)} /></DrawerMenu></Drawer></DemoFrame>;
    case "drawerMenu": return <DemoFrame layout="wide"><PreviewBoard><PreviewGroup label="Default"><div className="origin-component-preview-drawer-menu"><DrawerMenu><DrawerListItem label="Component overview" href="#overview" /><DrawerListItem label="Properties" href="#properties" /></DrawerMenu></div></PreviewGroup><PreviewGroup label="Long list"><div className="origin-component-preview-drawer-menu"><DrawerMenu><DrawerListItem label="Overview" href="#overview" /><DrawerListItem label="Properties" href="#properties" /><DrawerListItem label="Usage" href="#usage" /><DrawerListItem label="Accessibility" href="#accessibility" /></DrawerMenu></div></PreviewGroup></PreviewBoard></DemoFrame>;
    case "scrollbar": return <DemoFrame layout="wide"><PreviewBoard><PreviewGroup label="Horizontal overflow"><Scrollbar className="origin-component-preview-scrollbar"><div className="origin-component-preview-scrollbar-content">Scrollable component content</div></Scrollbar></PreviewGroup><PreviewGroup label="Dense content"><Scrollbar className="origin-component-preview-scrollbar"><div className="origin-component-preview-scrollbar-content">Design tokens / Foundation / Components / Patterns / Guidelines / Resources</div></Scrollbar></PreviewGroup></PreviewBoard></DemoFrame>;
    case "scrollTopButton": return <DemoFrame><div className="origin-component-scroll-top-preview"><p>페이지를 300px 이상 아래로 스크롤하면 실제 버튼이 화면 오른쪽 아래에 나타납니다.</p><ScrollTopButton /></div></DemoFrame>;
    case "marquee": return <DemoFrame layout="wide"><PreviewBoard><PreviewGroup label="Default"><Marquee speed={18} ariaLabel="Component capabilities"><li className="origin-component-preview-marquee-item">Design tokens</li><li className="origin-component-preview-marquee-item">Reusable UI</li><li className="origin-component-preview-marquee-item">Motion system</li></Marquee></PreviewGroup><PreviewGroup label="Fast"><Marquee speed={8} ariaLabel="Component capabilities"><li className="origin-component-preview-marquee-item">Foundation</li><li className="origin-component-preview-marquee-item">Components</li><li className="origin-component-preview-marquee-item">Guidelines</li></Marquee></PreviewGroup></PreviewBoard></DemoFrame>;
    case "logoMarquee": return <DemoFrame layout="wide"><PreviewBoard><PreviewGroup label="Default"><LogoMarquee speed={18} logos={[{ src: "/component-preview.svg", alt: "Design Origin" }, { src: "/component-preview.svg", alt: "Shared UI" }, { src: "/component-preview.svg", alt: "Foundation" }]} /></PreviewGroup><PreviewGroup label="Fast"><LogoMarquee speed={8} logos={[{ src: "/component-preview.svg", alt: "Design Origin" }, { src: "/component-preview.svg", alt: "Shared UI" }, { src: "/component-preview.svg", alt: "Foundation" }]} /></PreviewGroup></PreviewBoard></DemoFrame>;
    case "inViewVideo": return <DemoFrame layout="wide"><InViewVideo src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" className="origin-component-preview-video" /></DemoFrame>;
    case "customerSupportGraphic": return <DemoFrame><CustomerSupportGraphic className="origin-component-preview-graphic" /></DemoFrame>;
    case "commonIcons": return <DemoFrame><div className="origin-component-preview-row"><ArrowUpIcon className="origin-component-preview-icon" /><GlobeIcon className="origin-component-preview-icon" /><SocialIcon name="linkedin" className="origin-component-preview-icon" /></div></DemoFrame>;
    case "navigationBar": return <DemoFrame layout="viewport"><NavigationBar navItems={navItems} /></DemoFrame>;
    case "header": return <DemoFrame layout="viewport"><Header /></DemoFrame>;
    case "footer": return <DemoFrame layout="viewport"><Footer brandLogo={<span className="origin-component-footer-brand" aria-label="Fainders.AI">Fainders.AI</span>} /></DemoFrame>;
    case "languageSwitcher": return <DemoFrame layout="wide"><NextIntlClientProvider locale="ko" messages={{}}><LanguageSwitcher onLocaleChange={() => undefined} /></NextIntlClientProvider></DemoFrame>;
    case "megaNavMenu": return <DemoFrame layout="wide"><MegaNavMenu isTransparent={false} navItems={navItems} /></DemoFrame>;
    case "megaMenuPanel": return <DemoFrame layout="wide"><div className="origin-component-mega-panel"><MegaMenuPanel title="Products" items={[{ label: "Design Origin", description: "Shared UI components", href: "#design-origin", image: "/component-preview.svg" }]} /></div></DemoFrame>;
    case "globalUtilityMenu": return <DemoFrame layout="wide"><div className="origin-component-utility-preview"><GlobalUtilityMenu navItems={navItems} onClose={() => undefined} /></div></DemoFrame>;
    case "tabletDrawerMenu": return <DemoFrame layout="wide"><div className="origin-component-preview-drawer-menu"><TabletDrawerMenu productItems={[{ label: "Design Origin", href: "#design-origin" }]} /></div></DemoFrame>;
    case "toast": return <DemoFrame layout="wide"><Toast text={toastText} buttonLabel="Undo" onButtonClick={() => setToastText("Changes have been restored.")} /></DemoFrame>;
  }
}
