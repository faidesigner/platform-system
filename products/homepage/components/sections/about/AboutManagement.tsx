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
      {/* [thumbnail]: 최신 규격 343×280
          w-full 은 **부모(카드) 폭의 100%**다. 카드가 grid item이면서 폭이 정해져 있지 않으면
          카드 폭 = 자식들의 max-content = **라벨 텍스트 길이**가 되고, 그러면 이 컨테이너 폭이
          사람마다 달라진다. 아래 name(left-0)·img(right-0)는 절대배치라 컨테이너 폭에 직접
          매달려 있어서 초록 네임박스와 인물 사진의 간격이 인물마다 벌어졌다(2026-09-02 QA).
          그래서 폭은 grid item(motion.div)에서 확정하고 여기서는 그 폭을 따른다. */}
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

      {/* [label]: 그린 점 + 학력/divider/경력
          모바일(flex-col)에선 w-full+min-w-0으로 뷰포트 폭에 맞춰 줄바꿈(영문 가로 오버플로우 방지),
          tablet+(flex-row)에선 썸네일 옆 고정폭 유지 위해 shrink-0. */}
      <div className="flex w-full tablet:w-auto min-w-0 items-start gap-s pb-l tablet:shrink-0">
        {/* [ico]: 그린 점 16×16 — bg-brand 사각형 임시 구현 */}
        <div className="flex flex-col items-end self-stretch py-2xs">
          <span className="size-m shrink-0 bg-brand" aria-hidden />
        </div>

        {/* [textSection] */}
        <div className="flex min-w-0 flex-col items-start gap-s tablet:shrink-0">
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
        <h2 className="text-title-l max-[421px]:text-title-m desktop:text-title-xl font-bold text-primary">{title}</h2>

        {/* cardGrid: 2×2, 행/열 gap 56 = 4xl
            justify-items: <tablet 은 center(카드가 312px 고정폭이라 중앙정렬이 안전),
            tablet+ 는 stretch — 가로형 카드의 폭은 라벨 길이만큼 달라지므로 중앙정렬하면
            카드마다 좌측 시작점이 어긋난다(측정: 900px에서 left 161~187px). */}
        <div className="mt-5xl grid grid-cols-1 laptop:grid-cols-2 gap-7xl justify-items-center tablet:justify-items-stretch">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              // 세로 1열 구간에서 카드 폭을 **텍스트와 무관하게** 확정한다 — 이게 이 버그의 수정점이다.
              // w-full + max-w 조합이라 312px보다 좁은 뷰포트에서는 자연히 줄어들어 오버플로우가 없다.
              className="w-full max-w-[312px] tablet:max-w-none"
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
