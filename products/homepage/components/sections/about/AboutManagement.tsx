"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ManagementMember } from "@/config/types";

// name박스 그린 그라데이션 — 카드 고유 장식, 고정값 승인 영역
const NAME_GRADIENT =
  "linear-gradient(91deg, var(--color-green-400) 43%, var(--color-green-100) 99%)";

function ManagementCard({ member }: { member: ManagementMember }) {
  return (
    <div className="flex flex-col tablet:flex-row items-start tablet:items-end">
      {/* [thumbnail]: 최신 규격 343×280 */}
      <div className="relative flex h-[280px] w-full tablet:w-[312px] shrink-0 items-center">

        {/* [img]: 우측 절대 배치 207×282, z-30으로 name박스 위 유지 */}
        <div className="absolute right-0 z-30 h-[282px] w-[207px] overflow-hidden">
          {/* fill 사용을 위한 relative 래퍼 */}
          <div className="relative h-full w-full">
            <Image
              src={member.photo.src}
              alt={member.photo.alt}
              fill
              sizes="207px"
              className="object-cover"
            />
          </div>
          {/* 하단 페이드 마스크 — 고정값 승인 영역 */}
          <div
            className="absolute inset-0 z-10"
            style={{ background: "linear-gradient(0deg, var(--color-white) 7.71%, rgba(235, 235, 235, 0.00) 23.29%)" }}
          />
        </div>

        {/* [name]: 네임박스 좌측 절대 배치 220×160, z-20 */}
        <div
          className="absolute left-0 top-1/2 z-20 flex h-[160px] w-[220px] -translate-y-1/2 flex-col items-start justify-between p-l"
          style={{ background: NAME_GRADIENT }}
        >
          <p className="text-center text-body-l desktop:text-body-xl font-bold text-primary">{member.role}</p>
          <p className="text-body-ms font-medium text-primary">{member.name}</p>
        </div>
      </div>

      {/* [label]: 그린 점 + 학력/divider/경력 */}
      <div className="flex shrink-0 items-start gap-s pb-l">
        {/* [ico]: 그린 점 16×16 — bg-brand 사각형 임시 구현 */}
        <div className="flex flex-col items-end self-stretch py-2xs">
          <span className="size-m shrink-0 bg-brand" aria-hidden />
        </div>

        {/* [textSection] */}
        <div className="flex shrink-0 flex-col items-start gap-s">
          <div className="self-stretch text-body font-normal text-secondary">
            {member.education.map((line, i) => (
              <p key={i} className="whitespace-pre-line">{line}</p>
            ))}
          </div>
          {/* [stroke]: 0.5px 정밀 구분선 */}
          <hr className="h-0 self-stretch border-t-[0.5px] border-solid border-[var(--color-border-secondary,#D2D3D5)]" />
          <div className="self-stretch text-body font-normal text-secondary">
            {member.career.map((line, i) => (
              <p key={i} className="whitespace-pre-line">{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AboutManagementProps {
  title: string;
  members: ManagementMember[];
}

export function AboutManagement({ title, members }: AboutManagementProps) {
  return (
    <section className="w-full bg-surface">
      <div className="max-w-[1440px] mx-auto px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] py-5xl">
        {/* title */}
        <h2 className="text-title-l max-[420px]:text-title-m desktop:text-title-xl font-bold text-primary">{title}</h2>

        {/* cardGrid: 2×2, 행/열 gap 56 = 4xl */}
        <div className="mt-5xl grid grid-cols-1 laptop:grid-cols-2 gap-7xl justify-items-center laptop:justify-items-stretch">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.15 }}
            >
              <ManagementCard member={member} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
