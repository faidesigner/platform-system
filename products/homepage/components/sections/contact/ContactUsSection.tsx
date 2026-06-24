"use client";
import * as React from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { lenisRef } from "@/components/layout/SmoothScroll";
import { siteConfig } from "@/config/site";
import { LineInput } from "@fai/ui/components/LineInput";
import { CheckboxField } from "@fai/ui/components/CheckboxField";
import { IcoTxtButton } from "@fai/ui/components/button/IcoTxtButton";
import { CustomerSupportIcon } from "@fai/ui/components/CustomerSupportIcon";
import { IcRequiredDot } from "@/assets/icon/IcRequiredDot";

const { contact } = siteConfig;

type FormState = {
  values: Record<string, string>;
  interests: Record<string, boolean>;
  errors: Record<string, string>;
};

const EMPTY_STATE: FormState = { values: {}, interests: {}, errors: {} };

export function ContactUsSection() {
  const router = useRouter();
  const [state, setState] = React.useState<FormState>(EMPTY_STATE);
  const [submitted, setSubmitted] = React.useState(false);

  const sectionRef = React.useRef<HTMLElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const validateField = (key: string, value: string): string => {
    if (key === "company" && (!value || value.trim() === "")) return "회사명을 입력해주세요.";
    if (key === "name" && (!value || value.trim() === "")) return "성함을 입력해 주세요.";
    if (key === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!value || !emailRegex.test(value)) return "이메일 형식을 확인해주세요.";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    const { company, name, email } = state.values;

    if (!company || company.trim() === "") {
      newErrors.company = "회사명을 입력해주세요.";
    }
    if (!name || name.trim() === "") {
      newErrors.name = "성함을 입력해 주세요.";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "이메일 형식을 확인해주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
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

    const selectedInterests = Object.entries(state.interests)
      .filter(([, v]) => v)
      .map(([k]) => k);
    console.log("[contact submit]", { ...state.values, interests: selectedInterests });
    flushSync(() => { setSubmitted(true); });
    if (sectionRef.current) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(sectionRef.current, { immediate: true, offset: 0 });
      } else {
        window.scrollTo({ top: sectionRef.current.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
      }
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
          <div className="flex w-full flex-col items-center justify-center gap-[var(--spacing-3XL,40px)] text-center">
            <div className="flex flex-col items-center gap-[var(--spacing-M,16px)]">
              <h2 className="text-[length:var(--font-size-36,36px)] font-bold leading-[var(--font-lineHeight-36,54px)] text-[var(--color-text-inverse,#FFF)]">
                {contact.complete.title}
              </h2>
              <p className="text-[length:var(--font-size-20,20px)] font-medium leading-[var(--font-lineHeight-20,30px)]">
                <span className="text-[var(--color-text-inverse,#FFF)]">{contact.complete.subCopy.before}</span>
                <span className="text-[var(--fai-color-brand,#39DB1F)]">{contact.complete.subCopy.highlight}</span>
                <span className="text-[var(--color-text-inverse,#FFF)]">{contact.complete.subCopy.after}</span>
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
                {contact.complete.buttonLabel}
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
                  className="self-stretch max-[420px]:text-[length:var(--font-size-20,20px)] text-[length:var(--font-size-28,28px)] desktop-s:text-[length:var(--font-size-36,36px)] font-bold leading-[var(--font-lineHeight-36,54px)] text-inverse"
                 
                >
                  {contact.title.map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx < contact.title.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
                <p
                  className="self-stretch max-[420px]:text-[length:var(--font-size-16,16px)] text-[length:var(--font-size-18,18px)] desktop-s:text-[length:var(--font-size-20,20px)] font-medium leading-[var(--font-lineHeight-20,30px)]"
                 
                >
                  <span className="text-brand-text">{contact.subCopy.highlight}</span>
                  <span className="text-inverse">
                    {contact.subCopy.rest}
                    <br />
                    {contact.subCopy.line2}
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
                      <p className="text-secondary max-[420px]:text-[length:var(--font-size-16,16px)] text-[length:var(--font-size-20,20px)] font-bold leading-[var(--font-lineHeight-20,30px)]">
                        {contact.form.connectTitle}
                      </p>
                      {/* titleItems — 필수 입력 범례 */}
                      <div className="flex items-center p-[var(--padding-3XS,2px)] gap-[var(--spacing-2XS,4px)] rounded-[var(--cornerRadius-none,0)]">
                        <IcRequiredDot />
                        <span className="text-quaternary text-[length:var(--font-size-14,14px)] font-medium leading-[var(--font-lineHeight-14,21px)]">
                          {contact.form.requiredLabel}
                        </span>
                      </div>
                    </div>
                    {/* 입력 필드 목록 */}
                    <div className="flex flex-col items-start gap-[var(--spacing-M,16px)] self-stretch w-full">
                      {contact.fields.map((field) => (
                        <LineInput
                          key={field.key}
                          name={field.key}
                          label={field.label}
                          placeholder={field.placeholder}
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
                    <p className="self-stretch text-secondary max-[420px]:text-[length:var(--font-size-16,16px)] text-[length:var(--font-size-20,20px)] font-bold leading-[var(--font-lineHeight-20,30px)]">
                      {contact.form.selectTitle}
                    </p>

                    <div className="flex flex-col items-start gap-[var(--spacing-3XL,40px)] self-stretch">
                      <div className="flex flex-col items-start gap-[var(--spacing-3XL,40px)] self-stretch">
                        {contact.interests.map((group) => (
                          <div key={group.group} className="flex flex-col items-start gap-[var(--spacing-S,8px)] p-[var(--padding-none,0)] self-stretch">

                            {/* titleItem */}
                            <div className="flex items-center gap-[var(--spacing-S,8px)]">
                              <span className="text-secondary max-[420px]:text-[length:var(--font-size-14,14px)] text-[length:var(--font-size-18,18px)] font-medium leading-[var(--font-lineHeight-18,27px)]">
                                {group.group}
                              </span>
                              <span className="text-quaternary max-[420px]:text-[length:var(--font-size-12,12px)] text-[length:var(--font-size-14,14px)] font-medium leading-[var(--font-lineHeight-14,21px)]">
                                {group.multipleLabel}
                              </span>
                            </div>

                            {/* list */}
                            <div className="flex flex-col items-start self-stretch">
                              {group.options.map((opt) => (
                                <CheckboxField
                                  key={opt.value}
                                  value={opt.value}
                                  label={opt.label}
                                  checked={state.interests[opt.value] ?? false}
                                  onChange={(c) => toggleInterest(opt.value, c)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* textBox: 개인정보 처리방침 안내 */}
                      <div className="flex flex-1 justify-start items-start self-stretch text-quaternary text-[length:var(--w-caption-M-size,12px)] font-normal leading-[var(--w-caption-M-lineHeight,18px)] tracking-[var(--w-caption-M-letterSpacing,-0.1px)]">
                        <p>
                          {contact.form.privacyNotice.before}
                          <a href={contact.form.privacyNotice.href} target="_blank" rel="noopener noreferrer" className="underline decoration-solid">
                            {contact.form.privacyNotice.link}
                          </a>
                          {contact.form.privacyNotice.after}
                        </p>
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
                  {contact.form.submitLabel}
                </IcoTxtButton>
              </form>
            </div>

            {/* toast */}
            <div className="dark self-stretch">
              <div className="flex w-full max-w-[1140px] items-center justify-between gap-m rounded-fai-circle bg-[var(--color-filled-basic-fourth,#2C2D30)] py-[var(--padding-M,16px)] pl-[var(--padding-3-xl,40px)] pr-[var(--padding-XL,24px)]">
                <div className="flex items-center gap-[var(--spacing-M,16px)]">
                  <CustomerSupportIcon className="w-[40px] h-[40px] shrink-0" />
                  {/* ≥768px: 원본 텍스트 */}
                  <p className="hidden tablet:block text-center text-[var(--color-text-basic-primary,#FFF)] text-[length:var(--font-size-16,16px)] tablet:text-[length:var(--font-size-18,18px)] desktop-s:text-[length:var(--font-size-20,20px)] font-semibold leading-[var(--font-lineHeight-20,30px)] tracking-[var(--font-letterSpacing-0,0)]">
                    {contact.toast.text}
                  </p>
                  {/* 421px~767px: 단축 텍스트 */}
                  <p className="max-[420px]:hidden tablet:hidden text-center text-[var(--color-text-basic-primary,#FFF)] text-[length:var(--font-size-16,16px)] font-semibold leading-[var(--font-lineHeight-20,30px)] tracking-[var(--font-letterSpacing-0,0)]">
                    카카오톡 채널로 간편 문의하세요
                  </p>
                </div>
                <a
                  href={contact.toast.kakaoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 flex-col items-center justify-center rounded-[var(--cornerRadius-circle,999px)] bg-[var(--color-filled-optional-brand-primaryBtn,#39DB1F)] py-[var(--padding-M,16px)] px-[var(--padding-XL,24px)]"
                 
                >
                  <span className="text-center text-[var(--color-text-optional-brand-primaryBtn,#1F2023)] text-[length:var(--font-size-14,14px)] desktop-s:text-[length:var(--m-text-XL-size,16px)] font-semibold leading-[var(--m-text-XL-lineHeight,24px)] tracking-[var(--m-text-XL-letterSpacing,0)]">
                    {contact.toast.buttonLabel}
                  </span>
                </a>
              </div>
            </div>
          </>
        )}

      </div>
    </section>
  );
}
