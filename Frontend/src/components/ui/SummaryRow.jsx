export default function SummaryRow({ label, children, isLast }) {
  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1.5rem',
        padding: '0.9rem 1.4rem',
        minHeight: '50px',
      }}>
        <div style={{
          minWidth: '130px',
          paddingTop: '3px',
          color: 'var(--text-3)',
          fontSize: '0.66rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          flexShrink: 0,
        }}>
          {label}
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          {children}
        </div>
      </div>
      {!isLast && (
        <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0 1.4rem' }} />
      )}
    </>
  )
}
