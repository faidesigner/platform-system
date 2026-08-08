"use client";

import { useState, type ReactNode } from "react";
import {
  DrawerListItem,
  DrawerMenu,
  IcoTxtButton,
  LanguageSwitcher,
  MegaMenuPanel,
  Scrollbar,
  Spinner,
  Switch,
  Tab,
  TabList,
  TabMenu,
  TextArea,
  Thumbnail,
} from "@fai/ui";

function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-full w-full">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="h-full w-full">
      <path d="M8 1l1.854 3.756L14 5.528l-3 2.924.708 4.124L8 10.5l-3.708 2.076L5 8.452 2 5.528l4.146-.772L8 1z" />
    </svg>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-m border-b border-border-subtle py-2xl">
      <div className="flex flex-col gap-2xs">
        <h2 className="text-body font-semibold text-primary">{title}</h2>
        <p className="text-body-s text-secondary">{description}</p>
      </div>
      <div className="flex flex-wrap items-start gap-m">{children}</div>
    </section>
  );
}

const megaItems = [
  {
    label: "무인매장",
    description: "입장부터 결제까지 자동화된 매장 운영",
    href: "/ko/products#micro-store",
    image: "/images/customers/01-bakery-mannamil.jpg",
  },
  {
    label: "푸드코트",
    description: "혼잡한 식음 공간을 빠르게 처리",
    href: "/ko/products#food-court",
    image: "/images/customers/03-foodCourt-niseko-2.jpg",
  },
  {
    label: "리테일",
    description: "일상 매장에 맞춘 비전 결제 경험",
    href: "/ko/products#retail",
    image: "/images/customers/06-retail-wellstory.jpeg",
  },
] as const;

export default function PlaygroundPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");

  return (
    <main className="min-h-screen bg-surface py-5xl text-primary">
      <div className="container flex flex-col">
        <header className="flex flex-col gap-xs border-b border-border-subtle pb-2xl">
          <p className="text-body-s font-medium text-secondary">Component Preview</p>
          <h1 className="text-title-s font-bold text-primary">토큰 연결 수정 컴포넌트</h1>
        </header>

        <Section
          title="Spinner"
          description="Astryx API를 FAI foundation 토큰에 맞춘 size, shade, label 로딩 인디케이터"
        >
          <div className="flex items-center gap-xl rounded-fai-s border border-border-subtle bg-100 p-xl">
            <Spinner size="sm" aria-label="작은 로딩 상태" />
            <Spinner size="md" aria-label="기본 로딩 상태" />
            <Spinner size="lg" label="로딩 중" />
            <Spinner size="md" shade="subtle" aria-label="보조 로딩 상태" />
          </div>
          <div className="flex items-center gap-xl rounded-fai-s bg-fill-strong p-xl">
            <Spinner size="sm" shade="onMedia" aria-label="미디어 로딩 상태" />
            <Spinner size="md" shade="onMedia" aria-label="미디어 로딩 상태" />
            <Spinner size="lg" shade="onMedia" aria-label="미디어 로딩 상태" />
          </div>
        </Section>

        <Section
          title="Switch"
          description="즉시 반영되는 설정을 위한 controlled switch"
        >
          <div className="flex w-full max-w-md flex-col gap-l rounded-fai-s border border-border-subtle bg-100 p-xl">
            <Switch
              label="알림 받기"
              description="새 소식과 업데이트 알림을 받습니다."
              value={notificationsEnabled}
              onChange={setNotificationsEnabled}
              labelSpacing="spread"
            />
            <Switch label="자동 저장" value labelPosition="start" labelSpacing="spread" />
            <Switch label="프리미엄 기능" value={false} isDisabled disabledMessage="구독 후 사용할 수 있습니다." />
          </div>
        </Section>

        <Section
          title="Tab"
          description="Tab, TabList, TabMenu를 하나의 controlled 탐색 그룹으로 구성"
        >
          <div className="flex w-full flex-col gap-l">
            <TabList value={activeTab} onChange={setActiveTab} layout="fill" hasDivider aria-label="제품 정보">
              <Tab value="overview" label="개요" />
              <Tab value="products" label="제품" />
              <Tab value="support" label="지원" />
              <TabMenu
                label="더보기"
                options={[
                  { value: "settings", label: "설정" },
                  { value: "history", label: "활동 기록" },
                ]}
              />
            </TabList>
            <p className="text-body-s text-secondary">선택된 항목: {activeTab}</p>
          </div>
        </Section>

        <Section
          title="TextArea"
          description="상태 메시지, 비동기 처리, 글자 수 표시를 지원하는 controlled multiline field"
        >
          <div className="w-full max-w-lg">
            <TextArea
              label="문의 내용"
              description="요청 사항을 구체적으로 작성해 주세요."
              value={message}
              onChange={setMessage}
              placeholder="내용을 입력하세요"
              maxLength={100}
              isRequired
            />
          </div>
          <div className="w-full max-w-lg">
            <TextArea
              label="검토 의견"
              value="확인이 필요한 내용입니다."
              status={{ type: "error", message: "내용을 다시 확인해 주세요." }}
              onChange={() => undefined}
            />
          </div>
        </Section>

        <Section
          title="Thumbnail"
          description="64px 이미지 미리보기의 기본, placeholder, loading, disabled 상태"
        >
          <Thumbnail
            src="/images/customers/01-bakery-mannamil.jpg"
            alt="만나밀 베이커리 매장"
            label="bakery.jpg"
            onClick={() => undefined}
            onRemove={() => undefined}
          />
          <Thumbnail label="업로드 대기" />
          <Thumbnail label="파일 불러오는 중" isLoading />
          <Thumbnail
            src="/images/customers/03-foodCourt-niseko-2.jpg"
            alt="니세코 푸드코트"
            label="food-court.jpg"
            isLoading
          />
          <Thumbnail
            src="/images/customers/06-retail-wellstory.jpeg"
            alt="웰스토리 리테일 매장"
            label="retail.jpg"
            isDisabled
            onClick={() => undefined}
          />
        </Section>

        <Section
          title="IcoTxtButton"
          description="padding, gap, radius를 Tailwind 토큰 클래스로 연결한 아이콘+텍스트 버튼"
        >
          <IcoTxtButton variant="primary" size="XL" icon={<ArrowRight />} iconPosition="right">
            Primary XL
          </IcoTxtButton>
          <IcoTxtButton variant="primary" size="L" shape="round" icon={<ArrowRight />} iconPosition="right">
            Round L
          </IcoTxtButton>
          <IcoTxtButton variant="secondary" size="L" icon={<StarIcon />}>
            Secondary L
          </IcoTxtButton>
          <IcoTxtButton variant="tertiary" size="M" icon={<StarIcon />}>
            Tertiary M
          </IcoTxtButton>
          <IcoTxtButton variant="primary" size="S">
            Small
          </IcoTxtButton>
          <IcoTxtButton variant="primary" size="L" isLoading>
            저장
          </IcoTxtButton>
        </Section>

        <Section
          title="Scrollbar"
          description="py-s px-2xs gap-0으로 연결한 스크롤 컨테이너"
        >
          <Scrollbar className="max-w-sm rounded-fai-s border border-border-subtle bg-100">
            <div className="flex gap-s">
              {["제품", "회사소개", "미디어", "채용", "문의하기", "고객지원"].map((label) => (
                <span
                  key={label}
                  className="shrink-0 rounded-fai-s bg-fill-faint px-m py-xs text-body-s text-secondary"
                >
                  {label}
                </span>
              ))}
            </div>
          </Scrollbar>
        </Section>

        <Section
          title="LanguageSwitcher"
          description="gap-xs, rounded-fai-s, p-s로 연결한 언어 전환 UI"
        >
          <div className="rounded-fai-s border border-border-subtle bg-100 p-m">
            <LanguageSwitcher onLocaleChange={() => undefined} />
          </div>
          <div className="dark rounded-fai-s bg-fill-strong p-m text-inverse">
            <LanguageSwitcher isDarkMode onLocaleChange={() => undefined} />
          </div>
        </Section>

        <Section
          title="DrawerPrimitives"
          description="DrawerMenu, DrawerListItem의 padding/radius/text를 Tailwind 토큰 클래스로 연결"
        >
          <div className="w-full max-w-md overflow-hidden rounded-fai-m border border-border-subtle bg-100">
            <DrawerMenu>
              <DrawerListItem label="제품" rightIcon={<ArrowRight />} />
              <DrawerListItem label="회사소개" href="/ko/about" />
              <DrawerListItem label="미디어" href="/ko/media" />
              <DrawerListItem label="채용" href="https://faindersai.career.greetinghr.com/ko/home" isExternal />
            </DrawerMenu>
          </div>
        </Section>

        <Section
          title="MegaMenuPanel"
          description="컨테이너 padding/radius와 내부 gap, 이미지 radius를 Tailwind 토큰 클래스로 연결"
        >
          <div className="w-full">
            <MegaMenuPanel title="제품" items={megaItems} />
          </div>
        </Section>
      </div>
    </main>
  );
}
