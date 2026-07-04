import { useState } from 'react'
import { X } from 'lucide-react'

export default function ChapterModal({ type, config, chapters, chapterMap = {}, onSave, onClose }) {
  // Distribute count across chapters: 51% to first, rest split evenly
  const initAlloc = () => {
    const total = config.count
    if (chapters.length === 0 || total === 0) return {}
    const alloc = {}
    const perChapter = Math.floor(total / chapters.length)
    const extra = total % chapters.length
    chapters.forEach((ch, i) => {
      alloc[ch] = perChapter + (i === 0 ? extra : 0)
    })
    return alloc
  }

  const [alloc, setAlloc] = useState(initAlloc)
  const total = Object.values(alloc).reduce((s, v) => s + (v || 0), 0)
  const remaining = config.count - total

  const setChapterCount = (ch, val) => {
    const newAlloc = { ...alloc, [ch]: Math.max(0, val) }
    setAlloc(newAlloc)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.7)', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
              Assign {type.label} to Chapters
            </h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '4px' }}>
              Total: <span style={{ color: '#0EA5E9', fontWeight: 700 }}>{config.count}</span> questions to distribute
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)' }}>
            <X size={15} />
          </button>
        </div>

        {/* Chapter rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {chapters.length === 0 ? (
            <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
              No chapters selected. Go back to Step 1 to select chapters.
            </p>
          ) : chapters.map((ch, i) => (
            <div key={ch} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 14px', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#0EA5E9', fontSize: '0.65rem', fontWeight: 900 }}>{i + 1}</span>
                </div>
                <span style={{ color: 'var(--text-1)', fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chapterMap[ch] || ch}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => setChapterCount(ch, (alloc[ch] || 0) - 1)}
                  style={{ width: '28px', height: '28px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '7px', color: 'var(--text-1)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <input type="number" min={0} max={config.count} value={alloc[ch] || 0}
                  onChange={(e) => setChapterCount(ch, Number(e.target.value))}
                  style={{ width: '52px', backgroundColor: 'var(--input-bg)', border: '1.5px solid var(--input-border)', borderRadius: '8px', padding: '5px 6px', color: 'var(--text-1)', fontSize: '0.9rem', fontWeight: 800, textAlign: 'center', outline: 'none' }} />
                <button onClick={() => setChapterCount(ch, (alloc[ch] || 0) + 1)}
                  style={{ width: '28px', height: '28px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '7px', color: 'var(--text-1)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Remaining badge */}
        <div style={{ backgroundColor: remaining === 0 ? 'rgba(16,185,129,0.08)' : remaining < 0 ? 'rgba(239,68,68,0.08)' : 'var(--primary-dim)', border: `1px solid ${remaining === 0 ? 'rgba(16,185,129,0.25)' : remaining < 0 ? 'rgba(239,68,68,0.25)' : 'rgba(14,165,233,0.2)'}`, borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--text-2)', fontSize: '0.82rem', fontWeight: 600 }}>
            {remaining === 0 ? 'All questions assigned ✓' : remaining > 0 ? `${remaining} left to assign` : `${Math.abs(remaining)} over budget`}
          </span>
          <span style={{ color: remaining === 0 ? '#10B981' : remaining < 0 ? '#EF4444' : '#0EA5E9', fontWeight: 900, fontSize: '1.1rem' }}>
            {total} / {config.count}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', border: '1.5px solid var(--border)', borderRadius: '10px', color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-2)'; e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}>Cancel</button>
          <button onClick={() => { onSave(alloc); onClose() }} disabled={remaining !== 0}
            style={{ flex: 1, padding: '10px', background: remaining === 0 ? 'linear-gradient(135deg,#0EA5E9,#0284C7)' : 'var(--card-2)', border: 'none', borderRadius: '10px', color: remaining === 0 ? '#fff' : 'var(--text-3)', fontSize: '0.875rem', fontWeight: 700, cursor: remaining === 0 ? 'pointer' : 'not-allowed', boxShadow: remaining === 0 ? '0 4px 14px rgba(14,165,233,0.3)' : 'none', transition: 'all 0.2s' }}>
            Apply to Chapters
          </button>
        </div>
      </div>
    </div>
  )
}
