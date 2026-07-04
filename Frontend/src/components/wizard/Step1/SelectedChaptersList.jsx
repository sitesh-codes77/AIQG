import { X } from 'lucide-react'

export default function SelectedChaptersList({ chapters, chapterMap = {}, removeChapter }) {
  return (
    <div>
      <label style={{ display: 'block', color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Selected Chapters
      </label>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        padding: '14px', backgroundColor: 'var(--card-2)',
        border: '1px solid var(--border)', borderRadius: '10px',
      }}>
        {chapters.map((chId) => {
          const label = chapterMap[chId] || chId
          return (
            <span key={chId} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: 'var(--primary-dim)',
              border: '1px solid var(--primary-glow)',
              borderRadius: '8px', padding: '5px 10px',
              fontSize: '0.8rem', fontWeight: 600,
              color: 'var(--primary)',
              transition: 'all 0.2s',
            }}>
              {label}
              <button
                type="button"
                onClick={() => removeChapter(chId)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--primary)', display: 'flex', alignItems: 'center',
                  padding: '1px', borderRadius: '50%',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--danger-dim)'; e.currentTarget.style.color = '#EF4444' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--primary)' }}
                title={`Remove ${label}`}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </span>
          )
        })}
      </div>
    </div>
  )
}
