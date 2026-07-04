export default function Block({ icon: Icon, label, children }) {
  return (
    <div style={{
      backgroundColor: 'var(--card)',
      border: '1.5px solid var(--border)',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Icon size={15} color="var(--text-3)" />
        <span style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
          {label}
        </span>
      </div>
      <div>{children}</div>
    </div>
  )
}
