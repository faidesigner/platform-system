"use client";

import { useEffect, useRef } from "react";

interface InViewVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function InViewVideo({ src, poster, className }: InViewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || src === "MISSING_FROM_DESIGN") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [src]);

  if (src === "MISSING_FROM_DESIGN") return null;

  const posterSrc = poster && poster !== "MISSING_FROM_DESIGN" ? poster : undefined;

  return (
    <video
      ref={videoRef}
      src={src}
      poster={posterSrc}
      loop
      muted
      playsInline
      preload="metadata"
      className={className}
    />
  );
}
