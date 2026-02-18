interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptyState({ icon = '&#128270;', title, description, children }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: icon }} />
      <h3 style={{ color: 'var(--text-bright)', fontSize: 'var(--font-size-lg)', marginBottom: 8 }}>
        {title}
      </h3>
      {description && (
        <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>{description}</p>
      )}
      {children && <div style={{ marginTop: 16 }}>{children}</div>}
    </div>
  );
}
