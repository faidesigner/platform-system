"use client";
import * as React from "react";
import { CustomerSupportIcon } from "./CustomerSupportIcon";

export type ToastProps = {
  text: string;
  buttonLabel: string;
  onButtonClick?: () => void;
};

export function Toast({ text, buttonLabel, onButtonClick }: ToastProps) {
  return (
    <div className="flex flex-col justify-center items-start self-stretch rounded-[999px] bg-[var(--color-filled-basic-fourth,#2C2D30)] pt-[var(--padding-m,16px)] pr-[var(--padding-xl,24px)] pb-[var(--padding-m,16px)] pl-[var(--padding-3-xl,40px)] w-full max-w-[1140px]">
      {/* contents */}
      <div className="flex justify-between items-center self-stretch w-full">

        {/* titleSection */}
        <div className="flex items-center gap-[var(--spacing-M,16px)]">
          <CustomerSupportIcon className="w-[40px] h-[40px] shrink-0" />
          <p className="text-center text-[var(--color-text-basic-primary,#FFF)] text-[length:var(--font-size-20,20px)] font-semibold leading-[var(--font-lineHeight-20,30px)] tracking-[var(--font-letterSpacing-0,0)]">
            {text}
          </p>
        </div>

        {/* btn/icoTxt/round/primary/XL */}
        <button
          type="button"
          onClick={onButtonClick}
          className="flex flex-col justify-center items-center py-[var(--padding-M,16px)] px-[var(--padding-XL,24px)] gap-[var(--padding-None,0)] shrink-0 rounded-[var(--cornerRadius-circle,999px)] bg-[var(--color-filled-optional-brand-primaryBtn,#39DB1F)] cursor-pointer"
        >
          <span className="text-center text-[var(--color-text-optional-brand-primaryBtn,#1F2023)] text-[length:var(--m-text-XL-size,16px)] font-semibold leading-[var(--m-text-XL-lineHeight,24px)] tracking-[var(--m-text-XL-letterSpacing,0)]">
            {buttonLabel}
          </span>
        </button>

      </div>
    </div>
  );
}
