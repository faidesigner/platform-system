"use client";
import * as React from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { lenisRef } from "@/components/layout/SmoothScroll";
import { siteConfig } from "@/config/site";
import { localePolicy } from "@/config/locale-policy";
import type { GaLocation } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track";
import { buildContactPayload, parseUtm, ZAPIER_CONTACT_URL } from "@/lib/contact/payload";
import { LineInput } from "@fai/ui/components/LineInput";
import { CheckboxField } from "@fai/ui/components/CheckboxField";
import { Checkbox } from "@fai/ui/components/Checkbox";
import { IcoTxtButton } from "@fai/ui/components/button/IcoTxtButton";
import { CustomerSupportGraphic } from "@fai/ui/components/CustomerSupportGraphic";
import { IcRequiredDot } from "@fai/ui/components/common/Icon/IcRequiredDot";

const { contact } = siteConfig;

type FormState = {
  values: Record<string, string>;
  interests: Record<string, boolean>;
  errors: Record<string, string>;
};

const EMPTY_STATE: FormState = { values: {}, interests: {}, errors: {} };

// config interests 그룹 순서(VCO, STORE) → messages namespace 키 매핑.
// 구조/option value는 config 유지, 표시 텍스트만 messages에서 로드.
const INTEREST_GROUP_KEYS = ["vco", "store"] as const;

const PRIVACY_POLICY_HREFS: Record<string, string> = {
  ko: "/contact-us/FaindersAI_%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8_2026-1.pdf",
  en: "/contact-us/FaindersAI_Privacy%20Policy_2026-1.pdf",
  ja: "/contact-us/FaindersAI_%E3%83%97%E3%83%A9%E3%82%A4%E3%83%90%E3%82%B7%E3%83%BC%E3%83%9D%E3%83%AA%E3%82%B7%E3%83%BC_%E5%80%8B%E4%BA%BA%E6%83%85%E5%A0%B1%E4%BF%9D%E8%AD%B7%E6%96%B9%E9%87%9D_2026-1.pdf",
};

export function ContactUsSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const router = useRouter();

  // 상담 토스트 채널은 로케일마다 다르다(HOM-72): ko=카카오톡, ja=LINE, en=미노출.
  const { contactChat } = localePolicy(locale);
  const privacyHref = PRIVACY_POLICY_HREFS[locale] ?? PRIVACY_POLICY_HREFS.ko;
  // GA location도 채널을 따라간다 — 토스트는 channel이 있을 때만 렌더되므로 kakao가 안전한 기본값.
  const chatLocation: GaLocation = contactChat.channel === "line" ? "contact_line" : "contact_kakao";
  const [state, setState] = React.useState<FormState>(EMPTY_STATE);
  const [submitted, setSubmitted] = React.useState(false);
  const [privacyChecked, setPrivacyChecked] = React.useState(false);
  const [privacyError, setPrivacyError] = React.useState(false);

  const sectionRef = React.useRef<HTMLElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  // scroll-to-top 제거: SmoothScroll이 라우트 진입 시 { type: 'top' } 액션으로 처리하며,
  // 언어 전환 시에는 { type: 'restore' }로 이전 위치를 복원한다.
  // 이 useEffect를 유지하면 RSC 스트리밍 Commit 2(페이지 콘텐츠)에서 마운트될 때
  // SmoothScroll의 rAF 복원 이후에 scroll-to-0이 덮어써지는 충돌이 발생한다.

  const validateField = (key: string, value: string): string => {
    if (key === "company" && (!value || value.trim() === "")) return t("fields.company.errorMessage");
    if (key === "name" && (!value || value.trim() === "")) return t("fields.name.errorMessage");
    if (key === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!value || !emailRegex.test(value)) return t("fields.email.errorMessage");
    }
    return "";
  };

  const setValue = (key: string, value: string) =>
    setState((s) => ({
      ...s,
      values: { ...s.values, [key]: value },
      errors: { ...s.errors, [key]: "" },
    }));

  const toggleInterest = (value: string, checked: boolean) =>
    setState((s) => ({ ...s, interests: { ...s.interests, [value]: checked } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    const { company, name, email } = state.values;

    if (!company || company.trim() === "") {
      newErrors.company = t("fields.company.errorMessage");
    }
    if (!name || name.trim() === "") {
      newErrors.name = t("fields.name.errorMessage");
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = t("fields.email.errorMessage");
    }

    if (!privacyChecked) setPrivacyError(true);

    if (Object.keys(newErrors).length > 0 || !privacyChecked) {
      flushSync(() => {
        setState((s) => ({ ...s, errors: newErrors }));
      });
      if (formRef.current) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(formRef.current, { duration: 0.5, offset: 0 });
        } else {
          formRef.current.scrollIntoView({ block: "start" });
        }
      }
      return;
    }

    // 라이브 contact-us와 동일한 Zapier 웹훅 전송.
    // 포맷 고정: Content-Type은 form-urlencoded, body는 JSON 문자열
    // (application/json으로 보내면 Zap 필드 매핑이 비어 들어감).
    const payload = buildContactPayload({
      values: state.values,
      interests: state.interests,
      utm: parseUtm(typeof window !== "undefined" ? window.location.search : ""),
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });
    try {
      await fetch(ZAPIER_CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // 전송 실패해도 사용자 UX는 완료 처리(라이브 동작 동일). 리드 유실만 경고 로그.
      console.warn("[contact submit] Zapier 전송 실패:", err);
    }

    trackEvent("inquiry_complete", { location: "contact_form", label: "문의하기" });
    flushSync(() => { setSubmitted(true); });
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleContinue = () => {
    router.push("/");
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-svh overflow-hidden bg-black"
     
    >
      {/* 배경 — 기본 화면 */}
      {!submitted && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={contact.backgroundAsset}
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1440px) 100vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.30)_0%,rgba(0,0,0,0.30)_100%)]" />
        </div>
      )}

      {/* 배경 — 완료 화면 */}
      {submitted && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={contact.complete.backgroundAsset}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.30)_0%,rgba(0,0,0,0.30)_100%)]" />
        </div>
      )}

      {/* content wrapper */}
      <div className={`relative z-10 flex w-full ${
        submitted
          ? "h-svh items-center justify-center"
          : "flex-col items-start px-[var(--padding-XL)] min-[961px]:px-[var(--padding-5XL,_80px)] laptop:px-[var(--padding-8XL)] pt-6xl desktop-s:pt-[200px] pb-[var(--padding-5XL,80px)] gap-[var(--spacing-5XL,80px)]"
      }`}>

        {submitted ? (
          /* ───────── 제출 완료 화면 — form + toast 완전 대체 ───────── */
          <div className="flex w-full flex-col items-center justify-center gap-[var(--spacing-3XL,40px)] text-center px-[var(--padding-XL)] min-[961px]:px-0">
            <div className="flex flex-col items-center gap-[var(--spacing-M,16px)]">
              <h2 className="text-title-m min-[769px]:text-title-l font-bold text-text-inverse">
                {t("complete.title")}
              </h2>
              <p className="text-body-l min-[769px]:text-body-xl font-medium">
                <span className="text-text-inverse">{t("complete.subCopy.before")}</span>
                <span className="text-brand-text">{t("complete.subCopy.highlight")}</span>
                <span className="text-text-inverse">{t("complete.subCopy.after")}</span>
              </p>
            </div>
            <div className="dark">
              <IcoTxtButton
                type="button"
                variant="primary"
                size="XL"
                shape="square"
                className="w-[320px]"
                onClick={handleContinue}
              >
                {t("complete.buttonLabel")}
              </IcoTxtButton>
            </div>
          </div>
        ) : (
          /* ───────── 기본 화면 (contentsArea + toast) ───────── */
          <>
            {/* contentsArea */}
            <div
              className="flex items-start gap-[var(--spacing-3XL,40px)] self-stretch w-full lg:flex-row flex-col"
             
            >
              {/* titleSection */}
              <div className="flex flex-1 flex-col items-start gap-[var(--spacing-XL,24px)] min-w-0">
                <h2
                  className="self-stretch max-[421px]:text-body-xl text-title-m desktop-s:text-title-l font-bold leading-[var(--w-title-L-lineHeight,3.375rem)] text-inverse"
                 
                >
                  {(t.raw("title") as string[]).map((line, idx, arr) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
                <p
                  className="self-stretch max-[421px]:text-body text-body-l desktop-s:text-body-xl font-medium leading-[var(--w-text-XL-lineHeight,1.875rem)]"

                >
                  <span className="text-brand-text">{t("subCopy.highlight")}</span>
                  <span className="text-inverse">
                    {t("subCopy.rest")}
                    <br />
                    {t("subCopy.line2")}
                  </span>
                </p>
              </div>

              {/* form */}
              <form
                ref={formRef}
                noValidate
                onSubmit={handleSubmit}
                className="flex flex-col items-start p-[var(--padding-3-xl,40px)] gap-[var(--spacing-4XL,56px)] flex-1 self-stretch rounded-fai-xl bg-fill-inverse min-w-0"
               
              >
                <div className="flex w-full flex-col gap-[var(--spacing-4XL,56px)]">
                  {/* contents/contact — 연락처 입력 */}
                  <div className="flex flex-col items-start gap-[var(--spacing-XL,24px)] self-stretch w-full">
                    {/* title */}
                    <div className="flex justify-between items-end self-stretch w-full">
                      <p className="text-secondary max-[421px]:text-body text-body-xl font-bold">
                        {t("form.connectTitle")}
                      </p>
                      {/* titleItems — 필수 입력 범례 */}
                      <div className="flex items-center p-[var(--padding-3XS,2px)] gap-[var(--spacing-2XS,4px)] rounded-[var(--cornerRadius-none,0)]">
                        <IcRequiredDot className="text-[var(--color-icon-optional-brand-primary)]" />
                        <span className="text-quaternary text-body-s font-medium">
                          {t("form.requiredLabel")}
                        </span>
                      </div>
                    </div>
                    {/* 입력 필드 목록 */}
                    <div className="flex flex-col items-start gap-[var(--spacing-M,16px)] self-stretch w-full">
                      {contact.fields.map((field) => (
                        <LineInput
                          key={field.key}
                          name={field.key}
                          label={t(`fields.${field.key}.label`)}
                          placeholder={t(`fields.${field.key}.placeholder`)}
                          type={field.type}
                          required={field.required}
                          maxLength={field.key === "phone" ? 16 : undefined}
                          value={state.values[field.key] ?? ""}
                          onChange={(v) => {
                            const nextValue = field.key === "phone"
                              ? v.replace(/[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/g, "")
                              : v;
                            setValue(field.key, nextValue);
                          }}
                          onBlur={() => {
                            const error = validateField(field.key, state.values[field.key] ?? "");
                            if (error) setState((s) => ({ ...s, errors: { ...s.errors, [field.key]: error } }));
                          }}
                          error={!!state.errors[field.key]}
                          helpText={state.errors[field.key]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* select: 관심 정보 */}
                  <div className="flex flex-col items-start gap-[var(--spacing-XL,24px)] self-stretch">
                    <p className="self-stretch text-secondary max-[421px]:text-body text-body-xl font-bold">
                      {t("form.selectTitle")}
                    </p>

                    <div className="flex flex-col items-start gap-[var(--spacing-3XL,40px)] self-stretch">
                      <div className="flex flex-col items-start gap-[var(--spacing-3XL,40px)] self-stretch">
                        {contact.interests.map((group, groupIdx) => {
                          // config 그룹 순서 → messages namespace 키. option value는 config 유지.
                          const gk = INTEREST_GROUP_KEYS[groupIdx];
                          return (
                          <div key={group.group} className="flex flex-col items-start gap-[var(--spacing-S,8px)] p-[var(--padding-none,0)] self-stretch">

                            {/* titleItem */}
                            <div className="flex items-center gap-[var(--spacing-S,8px)]">
                              <span className="text-secondary max-[421px]:text-body-s text-body-l font-medium">
                                {t(`interests.${gk}.group`)}
                              </span>
                              <span className="text-quaternary max-[421px]:text-caption-m text-body-s font-medium">
                                {t(`interests.${gk}.multipleLabel`)}
                              </span>
                            </div>

                            {/* list */}
                            <div className="flex flex-col items-start self-stretch">
                              {group.options.map((opt) => (
                                <CheckboxField
                                  key={opt.value}
                                  value={opt.value}
                                  label={t(`interests.${gk}.options.${opt.value}`)}
                                  checked={state.interests[opt.value] ?? false}
                                  onChange={(c) => toggleInterest(opt.value, c)}
                                />
                              ))}
                            </div>
                          </div>
                          );
                        })}
                      </div>

                      {/* 개인정보 동의 체크박스 + 상세 안내 */}
                      <div className="flex flex-col items-start self-stretch gap-[var(--spacing-MS,12px)]">
                        {/* textBox: 개인정보 처리방침 안내 */}
                        <div className="flex flex-col items-start gap-[var(--spacing-2XS,4px)] self-stretch">
                          <label className="flex flex-1 justify-start items-center self-stretch gap-[var(--spacing-XS,6px)] text-quaternary text-body-s font-normal cursor-pointer">
                            <Checkbox
                              checked={privacyChecked}
                              error={privacyError}
                              onChange={(c) => { setPrivacyChecked(c); if (c) setPrivacyError(false); }}
                            />
                            <p>
                              {t("form.privacyNotice.before")}
                              <a href={privacyHref} target="_blank" rel="noopener noreferrer" className="underline decoration-solid" onClick={(e) => e.stopPropagation()}>
                                {t("form.privacyNotice.link")}
                              </a>
                              {t("form.privacyNotice.after")}
                            </p>
                          </label>
                          {privacyError && (
                            <p className="text-body-s font-normal text-[var(--color-text-negative,#EA3B2A)] pl-[var(--padding-3XL,40px)]">
                              {t("form.privacyNotice.errorMessage")}
                            </p>
                          )}
                        </div>
                        {/* textArea: 개인정보 수집 상세 안내 */}
                        <div className="flex py-[var(--padding-M,16px)] px-[var(--padding-L,20px)] items-start gap-[var(--padding-S,8px)] self-stretch rounded-fai-s border border-[var(--border-tertiary,#E4E6E7)]">
                          <div className="flex-1 flex flex-col text-quaternary text-body-s font-normal leading-[var(--m-text-m-line-height,21px)]">
                            <div className="flex gap-[var(--spacing-XS,6px)]">
                              <span className="shrink-0">{t("form.privacyInfo.purposeLabel")}</span>
                              <span>{t("form.privacyInfo.purpose")}</span>
                            </div>
                            <div className="flex gap-[var(--spacing-XS,6px)]">
                              <span className="shrink-0">{t("form.privacyInfo.itemsLabel")}</span>
                              <div className="flex flex-col">
                                <span>{t("form.privacyInfo.itemsRequired")}</span>
                                <span>{t("form.privacyInfo.itemsOptional")}</span>
                              </div>
                            </div>
                            <div className="flex gap-[var(--spacing-XS,6px)]">
                              <span className="shrink-0">{t("form.privacyInfo.retentionLabel")}</span>
                              <span>{t("form.privacyInfo.retention")}</span>
                            </div>
                            {/* 거부권·불이익 고지 — 법 제15조 제2항 제4호. 목적·항목·보유기간만으로는
                                요건이 충족되지 않는다(2026-08-06 검토 지적). 문구는 번역 시트 확정본. */}
                            <p className="mt-[var(--spacing-XS,6px)]">{t("form.privacyInfo.refusal")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* btn/icoTxt/square/primary/XL */}
                <IcoTxtButton
                  type="submit"
                  variant="primary"
                  size="XL"
                  shape="square"
                  className="w-full self-stretch"

                >
                  {t("form.submitLabel")}
                </IcoTxtButton>
              </form>
            </div>

            {/* 상담 토스트 — 채널이 없는 en에서는 영역 자체를 렌더하지 않는다(HOM-72) */}
            {contactChat.show && contactChat.url && (
              <>
            {/* toast — ≥421px */}
            <div className="hidden min-[421px]:block dark self-stretch">
              <div className="flex w-full max-w-[1140px] desktop:mx-auto items-center justify-between gap-m rounded-fai-circle bg-[var(--color-filled-basic-fourth)] py-[var(--padding-MS,12px)] pl-[var(--padding-2XL,32px)] pr-[var(--padding-L,20px)] tablet:py-[var(--padding-M,16px)] tablet:pl-[var(--padding-3-xl,40px)] tablet:pr-[var(--padding-XL,24px)]">
                <div className="flex items-center gap-[var(--spacing-M,16px)]">
                  {/* 아이콘: ≥768px에서만 표시 */}
                  <CustomerSupportGraphic className="hidden tablet:block w-[40px] h-[40px] shrink-0" />
                  {/* ≥768px 텍스트 */}
                  <p className="hidden tablet:block text-center text-text-basic-primary text-body-l desktop-s:text-body-xl font-semibold leading-[var(--w-text-XL-lineHeight,1.875rem)]">
                    {t("toast.text")}
                  </p>
                  {/* 421px~767px 텍스트 */}
                  <p className="tablet:hidden text-center text-text-basic-primary text-body font-semibold leading-[var(--w-text-XL-lineHeight,1.875rem)]">
                    {t("toast.textShort")}
                  </p>
                </div>
                <a
                  href={contactChat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("inquiry_complete", { location: chatLocation, label: "빠른 상담하기" })}
                  className="flex shrink-0 flex-col items-center justify-center rounded-[var(--cornerRadius-circle,999px)] bg-[var(--color-filled-optional-brand-primaryBtn)] py-[var(--padding-MS,12px)] px-[var(--padding-L,20px)] tablet:py-[var(--padding-M,16px)] tablet:px-[var(--padding-XL,24px)]"
                >
                  <span className="text-center text-[var(--color-text-optional-brand-primaryBtn)] text-body-s desktop-s:text-body font-semibold leading-[var(--w-text-M-lineHeight,1.5rem)]">
                    {t("toast.buttonLabel")}
                  </span>
                </a>
              </div>
            </div>

            {/* ≤420px — 풀너비 버튼만 */}
            <div className="dark min-[421px]:hidden w-full">
              <a
                href={contactChat.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("inquiry_complete", { location: chatLocation, label: "빠른 상담하기" })}
                className="w-full flex items-center justify-center rounded-[var(--cornerRadius-circle,999px)] bg-[var(--color-filled-optional-brand-primaryBtn)] py-[var(--padding-MS,12px)]"
              >
                <span className="text-center text-[var(--color-text-optional-brand-primaryBtn)] text-body font-semibold leading-[var(--w-text-XL-lineHeight,1.875rem)]">
                  {t("toast.buttonLabel")}
                </span>
              </a>
            </div>
              </>
            )}
          </>
        )}

      </div>
    </section>
  );
}
