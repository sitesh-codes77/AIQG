import { BarChart3, CheckCircle2, FileText } from 'lucide-react'
import { Q_TYPES } from '../Step2/Step2QuestionComposition'
import Block from '../../ui/Block'
import ReviewSummaryCard from './ReviewSummaryCard'

const DIFF = [
  { key: 'easy',   label: 'Easy',   color: '#10B981', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.35)' },
  { key: 'medium', label: 'Medium', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.35)'  },
  { key: 'hard',   label: 'Hard',   color: '#EF4444', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.35)'  },
]

// Rotating palette for chapter pills
const CHAPTER_COLORS = [
  { bg: 'rgba(251,146,60,0.18)',  color: '#FB923C', border: 'rgba(251,146,60,0.4)'  },
  { bg: 'rgba(244,114,182,0.18)', color: '#F472B6', border: 'rgba(244,114,182,0.4)' },
  { bg: 'rgba(129,140,248,0.18)', color: '#818CF8', border: 'rgba(129,140,248,0.4)' },
  { bg: 'rgba(34,211,238,0.18)',  color: '#22D3EE', border: 'rgba(34,211,238,0.4)'  },
  { bg: 'rgba(163,230,53,0.18)',  color: '#A3E635', border: 'rgba(163,230,53,0.4)'  },
]

// Palette for question type pills
const QTYPE_COLORS = [
  { bg: 'rgba(16,185,129,0.15)',  color: '#10B981', border: 'rgba(16,185,129,0.35)' },
  { bg: 'rgba(139,92,246,0.15)',  color: '#A78BFA', border: 'rgba(139,92,246,0.35)' },
  { bg: 'rgba(14,165,233,0.15)',  color: '#38BDF8', border: 'rgba(14,165,233,0.35)' },
  { bg: 'rgba(251,146,60,0.15)',  color: '#FB923C', border: 'rgba(251,146,60,0.35)' },
]

export default function Step4Review({ step1, step2, step3, chapterMap = {} }) {
  const chapters = step1.chapters?.length > 0 ? step1.chapters : ['All Chapters']

  const activeTypes = Q_TYPES.filter((t) => (step2[t.key]?.count ?? 0) > 0)

  const qBreakdown = activeTypes.map((t) => {
    const cfg = step2[t.key]
    return { ...t, count: cfg.count, marks: cfg.marks, subtotal: cfg.count * cfg.marks }
  })
  const totalMarks     = qBreakdown.reduce((s, t) => s + t.subtotal, 0)
  const totalQuestions = qBreakdown.reduce((s, t) => s + t.count, 0)

  // Aggregate difficulty
  let totEasy = 0, totMedium = 0, totHard = 0
  chapters.forEach((ch) => {
    activeTypes.forEach((type) => {
      const row = (step3[ch] || {})[type.key] || { easy: 0, medium: 0, hard: 0 }
      totEasy   += row.easy
      totMedium += row.medium
      totHard   += row.hard
    })
  })
  const totDiff = totEasy + totMedium + totHard
  const pct = (n) => (totDiff > 0 ? Math.round((n / totDiff) * 100) : 0)

  const paperSummary = [
    totalQuestions > 0 && `${totalQuestions} questions`,
    totalMarks > 0     && `${totalMarks} marks`,
    step2.duration     && `${step2.duration} min`,
  ].filter(Boolean).join(' · ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{
          backgroundColor: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '999px',
          padding: '4px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <CheckCircle2 size={12} color="#10B981" />
          <span style={{ color: '#10B981', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Ready to Generate
          </span>
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
            Review &amp; Generate
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: '0.82rem', marginTop: '1px' }}>
            Final check before dispatching to the generation pipeline.
          </p>
        </div>
      </div>

      {/* ── Summary card — row format ── */}
      <ReviewSummaryCard
        step1={step1}
        step2={step2}
        qBreakdown={qBreakdown}
        chapters={chapters}
        chapterMap={chapterMap}
        CHAPTER_COLORS={CHAPTER_COLORS}
        QTYPE_COLORS={QTYPE_COLORS}
        paperSummary={paperSummary}
      />

      {/* ── Question Composition Block (old style) ── */}
      <Block icon={FileText} label="Question Composition">
        {qBreakdown.length === 0 ? (
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>No question types configured.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {qBreakdown.map((t) => (
                <div key={t.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0EA5E9', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 700 }}>{t.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span style={{ color: 'var(--text-3)', fontSize: '0.8rem', fontWeight: 500 }}>{t.count} × {t.marks} marks</span>
                    <span style={{ color: 'var(--text-1)', fontWeight: 800, minWidth: '50px', textAlign: 'right', fontSize: '0.9rem' }}>{t.subtotal}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1.5px solid var(--border)', marginTop: '4px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-3)', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Score</span>
              <span style={{ color: '#10B981', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                {totalMarks} <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-3)' }}>marks</span>
              </span>
            </div>
          </div>
        )}
      </Block>

      {/* ── Difficulty Distribution Block (old style with progress bars) ── */}
      <Block icon={BarChart3} label="Difficulty Distribution">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {DIFF.map(({ key, label, color }) => {
            const val = key === 'easy' ? totEasy : key === 'medium' ? totMedium : totHard
            const p = pct(val)
            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
                    <span style={{ color, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                  </div>
                  <span style={{ color: 'var(--text-1)', fontSize: '0.85rem', fontWeight: 800 }}>
                    {val} {val === 1 ? 'question' : 'questions'}{' '}
                    <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>({p}%)</span>
                  </span>
                </div>
                <div style={{ height: '7px', backgroundColor: 'var(--card-2)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{
                    height: '100%',
                    width: `${p}%`,
                    backgroundColor: color,
                    borderRadius: '999px',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0 0 8px ${color}66`,
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </Block>

    </div>
  )
}
