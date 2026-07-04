import { Check } from 'lucide-react'

export default function Checkbox({ checked }) {
  return (
    <div style={{
      width: '15px', height: '15px', borderRadius: '4px',
      border: `2px solid ${checked ? '#0EA5E9' : 'var(--border-2)'}`,
      backgroundColor: checked ? '#0EA5E9' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, transition: 'all 0.15s',
    }}>
      {checked && <Check size={9} color="#fff" strokeWidth={3} />}
    </div>
  )
}
