import { BookOpen, ListChecks, BarChart3, ClipboardCheck, Check } from 'lucide-react'

export const STEPS = [
  { id: 1, label: 'Content',     sublabel: 'Book & Chapters',      icon: BookOpen    },
  { id: 2, label: 'Composition', sublabel: 'Questions & Marks',     icon: ListChecks  },
  { id: 3, label: 'Difficulty',  sublabel: 'Easy / Medium / Hard',  icon: BarChart3   },
  { id: 4, label: 'Review',      sublabel: 'Confirm & Generate',    icon: ClipboardCheck },
]

export default function Stepper({ current, onGoto }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {STEPS.map((step, idx) => {
        const done   = current > step.id
        const active = current === step.id
        const Icon   = step.icon
        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
            {/* Node */}
            <button type="button" onClick={() => done && onGoto(step.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', background: 'none', border: 'none', cursor: done ? 'pointer' : 'default', padding: 0, flexShrink: 0 }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: done ? 'var(--primary)' : active ? 'var(--primary-dim)' : 'var(--card-2)',
                border: `2px solid ${done ? 'var(--primary)' : active ? 'var(--primary)' : 'var(--border)'}`,
                boxShadow: active ? '0 0 0 4px var(--primary-glow)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {done
                  ? <Check size={17} color="#fff" strokeWidth={2.5} />
                  : <Icon size={16} color={active ? 'var(--primary)' : 'var(--text-3)'} />
                }
              </div>
              <div style={{ textAlign: 'center', minWidth: '72px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: active ? 'var(--text-1)' : done ? 'var(--primary)' : 'var(--text-3)', transition: 'color 0.3s' }}>
                  {step.label}
                </div>
              </div>
            </button>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div style={{ flex: 1, height: '2px', margin: '0 6px', marginBottom: '22px', backgroundColor: current > step.id ? 'var(--primary)' : 'var(--border)', borderRadius: '2px', transition: 'background-color 0.35s ease', position: 'relative', overflow: 'hidden' }}>
                {current > step.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--primary)' }} />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
