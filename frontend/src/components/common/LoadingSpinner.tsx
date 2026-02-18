import { CSSProperties } from 'react';

const spinnerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '48px',
};

const dotStyle: CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: 'var(--accent-blue)',
  margin: '0 4px',
  animation: 'pulse 1.4s infinite ease-in-out both',
};

export function LoadingSpinner() {
  return (
    <div style={spinnerStyle}>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div style={{ ...dotStyle, animationDelay: '-0.32s' }} />
      <div style={{ ...dotStyle, animationDelay: '-0.16s' }} />
      <div style={dotStyle} />
    </div>
  );
}
