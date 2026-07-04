export default function Pill({ label, bg, color, border }) {
  return (
    <span style={{
      backgroundColor: bg,
      color: color,
      border: `1px solid ${border}`,
      borderRadius: '6px',
      padding: '3px 10px',
      fontSize: '0.75rem',
      fontWeight: 700,
      lineHeight: 1.5,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}
