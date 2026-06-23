"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconButton } from "@fai/ui";
import ArrowUpIcon from "@/assets/icon/ArrowUpIcon";

const rollingIcon = (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
    {/* 원본 아이콘: 중앙 → 위로 사라짐 */}
    <motion.div
      variants={{ rest: { y: "0%" }, hover: { y: "-150%" } }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <ArrowUpIcon />
    </motion.div>

    {/* 복제본 아이콘: 150% 아래 대기 → 중앙으로 올라옴 */}
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      variants={{ rest: { y: "150%" }, hover: { y: "0%" } }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <ArrowUpIcon />
    </motion.div>
  </div>
);

export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className={[
        "w-fit h-fit absolute right-4xl top-4xl -rotate-90 rounded-fai-circle",
        "transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
      initial="rest"
      whileHover="hover"
    >
      <IconButton
        variant="primary"
        size="XL"
        icon={rollingIcon}
        aria-label="맨 위로 이동"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </motion.div>
  );
}
