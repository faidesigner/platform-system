'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IconButton } from './button/IconButton';

/**
 * ScrollTopButton
 *
 * 스크롤 300px 이상 내려가면 Fade-in, 그 이하면 Fade-out.
 * 호버 시 살짝 떠오르고, 클릭 시 눌리는 spring 타격감.
 *
 * 토큰 매핑:
 *   크기     → w-[var(--size-56)] h-[var(--size-56)]
 *   라운드   → rounded-full  (var(--cornerRadius-circle))
 *   배경     → IconButton variant="primary" (var(--color-filled-optional-brand-primaryBtn))
 */

export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={[
        'transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
      ].join(' ')}
    >
      <IconButton
        variant="primary"
        size="XL"
        icon="arrowshapeUp"
        onClick={toTop}
        aria-label="맨 위로 이동"
      />
    </motion.div>
  );
}
