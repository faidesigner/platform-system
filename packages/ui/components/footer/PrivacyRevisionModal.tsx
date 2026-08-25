'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { IcoTxtButton } from '../button/IcoTxtButton';

export interface PrivacyRevisionModalProps {
  title: string;
  /** string 또는 링크가 포함된 ReactNode 모두 수용. string 전달 시 whitespace-pre-wrap으로 렌더. */
  body: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
}

export function PrivacyRevisionModal({ title, body, confirmLabel, onConfirm }: PrivacyRevisionModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // React onWheel은 root에 위임된 합성 이벤트라 passive:false가 보장되지 않음.
  // native addEventListener로 직접 wheel을 가로채 scrollTop을 강제 적용 →
  // 브라우저의 "wheel → 스크롤 대상 결정" 알고리즘을 완전히 우회해 InfoItem이 확실히 스크롤됨.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta =
        e.deltaMode === 2 ? e.deltaY * el.clientHeight  // page
        : e.deltaMode === 1 ? e.deltaY * 20             // line
        : e.deltaY;                                      // pixel
      el.scrollTop += delta;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    // 카드 — layout 핵심값(display·flexDirection·width·height·padding)을 inline style로 고정.
    // Tailwind arbitrary 클래스가 packages/ui 스캔 경로 밖에서 생성되지 않아도 레이아웃이 깨지지 않는다.
    <div
      className="rounded-fai-m bg-bg-100"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 800,
        height: 816,
        paddingTop: 'var(--padding-2-xl, 32px)',
        paddingLeft: 'var(--padding-3-xl, 40px)',
        paddingRight: 'var(--padding-3-xl, 40px)',
        paddingBottom: 0,
        boxShadow: '0 10px 20px -1px rgba(0,0,0,0.10), 0 6px 12px 0 rgba(0,0,0,0.12)',
      }}
    >
      {/* contentArea — 카드에서 버튼 영역을 뺀 나머지를 차지 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 0%',
          minHeight: 0,
          gap: 'var(--spacing-L, 20px)',
        }}
      >
        {/* title */}
        <div style={{ flexShrink: 0, alignSelf: 'stretch' }}>
          <p className="text-body-xl font-bold text-text-basic-primary leading-[150%]">{title}</p>
        </div>

        {/* InfoItem — flex-1 min-h-0 + overflowY auto: 나머지 높이를 채우며 스크롤 */}
        <div
          ref={scrollRef}
          className="fai-privacy-scroll rounded-fai-s bg-[var(--color-filled-basic-fourth,#F5F5F5)]"
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            padding: 'var(--padding-L, 20px)',
            alignSelf: 'stretch',
          }}
        >
          {typeof body === 'string' ? (
            <p className="text-text-basic-secondary text-body font-normal leading-[var(--font-lineHeight-16,24px)] whitespace-pre-wrap">
              {body}
            </p>
          ) : (
            <div className="text-text-basic-secondary text-body font-normal leading-[var(--font-lineHeight-16,24px)]">
              {body}
            </div>
          )}
        </div>
      </div>

      {/* btnItem */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--spacing-S, 8px)',
          paddingTop: 'var(--padding-l, 20px)',
          paddingBottom: 'var(--padding-3-xl, 40px)',
          alignSelf: 'stretch',
        }}
      >
        <IcoTxtButton
          type="button"
          variant="primary"
          size="XL"
          shape="square"
          className="flex-1"
          onClick={onConfirm}
        >
          {confirmLabel}
        </IcoTxtButton>
      </div>
    </div>
  );
}
