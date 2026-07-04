import { useState } from 'react'

export default function StepperInput({ value, onChange, min = 0, max = 999, active = false, placeholder = '0' }) {
  const [focused, setFocused] = useState(false)

  const borderColor = focused ? '#0EA5E9' : active ? '#0EA5E9' : 'var(--input-border)'
  const bg = active ? 'var(--primary-dim)' : 'var(--input-bg)'
  const textColor = active ? '#0EA5E9' : 'var(--text-1)'

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      border: `1.5px solid ${borderColor}`,
      borderRadius: '9px', overflow: 'hidden',
      backgroundColor: bg,
      transition: 'all 0.2s',
      boxShadow: focused ? '0 0 0 3px rgba(14,165,233,0.15)' : 'none',
    }}>
      <input
        type="number" min={min} max={max}
        value={value === 0 && !focused ? '' : value}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value === '' ? min : Number(e.target.value)
          onChange(Math.max(min, Math.min(max, v)))
        }}
        onFocus={() => setFocused(true)}
        onWheel={(e) => e.target.blur()}
        onBlur={() => setFocused(false)}
        style={{
          width: '52px', border: 'none', outline: 'none', background: 'transparent',
          color: textColor, fontWeight: 800, fontSize: '0.9rem',
          textAlign: 'center', padding: '7px 4px 7px 10px',
        }}
      />
      {/* ▲▼ stepper column */}
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          style={{
            width: '22px', height: '18px', border: 'none', background: 'transparent',
            color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.55rem', lineHeight: 1,
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.15)'; e.currentTarget.style.color = '#0EA5E9' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)' }}
        >▲</button>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          style={{
            width: '22px', height: '18px', border: 'none', background: 'transparent',
            color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.55rem', lineHeight: 1,
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.15)'; e.currentTarget.style.color = '#0EA5E9' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)' }}
        >▼</button>
      </div>
    </div>
  )
}
