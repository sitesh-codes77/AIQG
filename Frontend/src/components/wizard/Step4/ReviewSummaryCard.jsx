import Pill from '../../ui/Pill'
import SummaryRow from '../../ui/SummaryRow'

export default function ReviewSummaryCard({ step1, step2, qBreakdown, chapters, chapterMap, CHAPTER_COLORS, QTYPE_COLORS, paperSummary }) {
  return (
    <div style={{
      backgroundColor: 'var(--card)',
      border: '1.5px solid var(--border)',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Card heading */}
      <div style={{
        padding: '0.65rem 1.4rem',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--card-2)',
      }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-2)' }}>Summary</span>
      </div>

      {/* BOOK(S) */}
      <SummaryRow label="Book(s)">
        {(step1.books || []).length > 0 ? (
          (step1.books || []).map((b, i) => {
            const c = CHAPTER_COLORS[i % CHAPTER_COLORS.length]
            return <Pill key={b.id} label={b.label} bg={c.bg} color={c.color} border={c.border} />
          })
        ) : (
          <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>—</span>
        )}
      </SummaryRow>

      {/* CHAPTERS */}
      <SummaryRow label="Chapters">
        {chapters.map((ch, i) => {
          const c = CHAPTER_COLORS[i % CHAPTER_COLORS.length]
          return <Pill key={ch} label={chapterMap[ch] || ch} bg={c.bg} color={c.color} border={c.border} />
        })}
      </SummaryRow>

      {/* PAPER */}
      <SummaryRow label="Paper">
        <span style={{ color: 'var(--text-1)', fontSize: '0.9rem', fontWeight: 700 }}>
          {paperSummary || '—'}
        </span>
      </SummaryRow>

      {/* QUESTION TYPES */}
      <SummaryRow label="Question Types" isLast>
        {qBreakdown.length === 0 ? (
          <span style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>None configured</span>
        ) : (
          qBreakdown.map((t, i) => {
            const c = QTYPE_COLORS[i % QTYPE_COLORS.length]
            return (
              <Pill
                key={t.key}
                label={`${t.label} × ${t.count} (${t.marks}m)`}
                bg={c.bg}
                color={c.color}
                border={c.border}
              />
            )
          })
        )}
      </SummaryRow>
    </div>
  )
}
