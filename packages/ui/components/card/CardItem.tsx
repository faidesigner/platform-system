import * as React from 'react';

const cardStyle: React.CSSProperties = {
  display: 'flex',
  height: '320px',
  padding: 'var(--padding-2-xl, 32px)',
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
  borderRadius: 'var(--cornerRadius-M, 16px)',
  backgroundColor: 'var(--color-bg-100, #FFFFFF)',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
};

export function CardItem({ children }: { children: React.ReactNode }) {
  return (
    <article style={cardStyle}>
      {children}
    </article>
  );
}
