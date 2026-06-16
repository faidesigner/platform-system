"use client";
import * as React from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { LineInput } from "@fai/ui/components/LineInput";
import { CheckboxField } from "@fai/ui/components/CheckboxField";
import { IcoTxtButton } from "@fai/ui/components/button/IcoTxtButton";
import { Toast } from "@fai/ui/components/Toast";

const { contact } = siteConfig;

type FormState = {
  values: Record<string, string>;
  interests: Record<string, boolean>;
  errors: Record<string, string>;
};

export function ContactUsSection() {
  const [state, setState] = React.useState<FormState>({
    values: {},
    interests: {},
    errors: {},
  });

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "이메일 형식을 확인해주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setState((s) => ({ ...s, errors: newErrors }));
      return;
    }

    setState((s) => ({ ...s, errors: {} }));
    const selectedInterests = Object.entries(state.interests)
      .filter(([, v]) => v)
      .map(([k]) => k);
    console.log("[contact submit]", { ...state.values, interests: selectedInterests });
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      data-node-id="6542:11317"
    >
      {/* 배경 — full viewport width */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={contact.backgroundAsset}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.30)_0%,rgba(0,0,0,0.30)_100%)]" />
      </div>

      {/* content wrapper — max-width + responsive padding */}
      <div className="relative z-10 flex flex-col items-start w-full max-w-[1440px] mx-auto px-l tablet:px-3xl desktop:px-[var(--padding-8-xl,150px)] pt-5xl desktop:pt-[var(--padding-8-xl,150px)] pb-[var(--padding-5XL,80px)] gap-[var(--spacing-5XL,80px)]">

      {/* contentsArea */}
      <div
        className="flex items-start gap-[var(--spacing-3XL,40px)] self-stretch w-full lg:flex-row flex-col"
        data-node-id="6542:11318"
      >
        {/* titleSection */}
        <div className="flex flex-1 flex-col items-start gap-[var(--spacing-XL,24px)] min-w-0" data-node-id="6542:11319">
          <h2
            className="self-stretch text-[length:var(--font-size-36,36px)] font-bold leading-[1.5] text-inverse"
            data-node-id="6542:11320"
          >
            {contact.title.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < contact.title.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p
            className="self-stretch text-[length:var(--font-size-20,20px)] font-medium leading-[1.5]"
            data-node-id="6542:11323"
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
          onSubmit={handleSubmit}
          className="flex flex-col items-start p-[var(--padding-3-xl,40px)] gap-[var(--spacing-4XL,56px)] flex-1 rounded-fai-xl bg-fill-inverse min-w-0"
          data-node-id="6548:5844"
        >
          <div className="flex w-full flex-col gap-[var(--spacing-4XL,56px)]" data-node-id="6548:5845">
            {/* contents/contact — 연락처 입력 */}
            <div className="flex flex-col items-start gap-[var(--spacing-L,20px)] self-stretch w-full" data-node-id="6548:5846">
              {/* title */}
              <div className="flex justify-between items-end self-stretch w-full" data-node-id="6548:5847">
                <p className="text-secondary text-[length:var(--font-size-20,20px)] font-bold leading-[1.5]">
                  {contact.form.connectTitle}
                </p>
                {/* titleItems — 필수 입력 범례 */}
                <div className="flex items-center p-[var(--padding-3XS,2px)] gap-[var(--spacing-2XS,4px)] rounded-[var(--cornerRadius-none,0)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                    <circle cx="4" cy="4" r="4" fill="var(--fai-bg-brand)"/>
                  </svg>
                  <span className="text-quaternary text-[length:var(--font-size-14,14px)] font-medium leading-[1.5]">
                    {contact.form.requiredLabel}
                  </span>
                </div>
              </div>
              {/* 입력 필드 목록 */}
              <div className="flex flex-col items-start gap-[var(--spacing-MS,12px)] self-stretch w-full" data-node-id="6548:5850">
                {contact.fields.map((field) => (
                  <LineInput
                    key={field.key}
                    name={field.key}
                    label={field.label}
                    placeholder={field.placeholder}
                    type={field.type}
                    required={field.required}
                    value={state.values[field.key] ?? ""}
                    onChange={(v) => setValue(field.key, v)}
                    error={!!state.errors[field.key]}
                    helpText={state.errors[field.key]}
                  />
                ))}
              </div>
            </div>

            {/* select: 관심 정보 */}
            <div className="flex flex-col items-start gap-[var(--spacing-L,20px)] self-stretch" data-node-id="6548:5857">
              <p className="self-stretch text-secondary text-[length:var(--font-size-20,20px)] font-bold leading-[1.5]">
                {contact.form.selectTitle}
              </p>

              <div className="flex flex-col items-start gap-[var(--spacing-3XL,40px)] self-stretch">
                <div className="flex flex-col items-start gap-[var(--spacing-3XL,40px)] self-stretch">
                  {contact.interests.map((group) => (
                    <div key={group.group} className="flex flex-col items-start gap-[var(--spacing-S,8px)] p-[var(--padding-none,0)] self-stretch">

                      {/* titleItem */}
                      <div className="flex items-center gap-[var(--spacing-S,8px)]">
                        <span className="text-secondary text-[length:var(--font-size-18,18px)] font-medium leading-[1.5]">
                          {group.group}
                        </span>
                        <span className="text-quaternary text-[length:var(--font-size-14,14px)] font-medium leading-[1.5]">
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
            data-node-id="6548:5875"
          >
            {contact.form.submitLabel}
          </IcoTxtButton>
        </form>
      </div>

      {/* toast */}
      <div className="dark self-stretch" data-node-id="6542:11367">
        <Toast
          text={contact.toast.text}
          buttonLabel={contact.toast.buttonLabel}
          onButtonClick={() => window.open(contact.toast.kakaoUrl, "_blank", "noopener,noreferrer")}
        />
      </div>

      </div>
    </section>
  );
}
