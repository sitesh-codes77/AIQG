import { useState } from 'react'
import { Settings2, HelpCircle, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import StepperInput from '../../ui/StepperInput'
import { ErrorToast, useErrorFlash } from '../../ui/ErrorToast'
import PaperBasics from './PaperBasics'
import ChapterModal from './ChapterModal'

export const Q_TYPES = [
  { key: 'mcq', label: 'MCQ', description: 'Multiple Choice – Single Answer', defaultMarks: 1, maxMarks: 10 },
  { key: 'msq', label: 'MSQ', description: 'Multiple Select – Multi Answer', defaultMarks: 2, maxMarks: 10 },
  { key: 'numerical', label: 'Numerical', description: 'Number input answers', defaultMarks: 4, maxMarks: 20 },
  { key: 'short', label: 'Short Answer', description: '2–3 sentence answers', defaultMarks: 3, maxMarks: 10 },
  { key: 'long', label: 'Long Answer', description: 'Essay-type detailed answers', defaultMarks: 5, maxMarks: 20 },
]

/* ─── Main Step 2 Component ────────────────────────────── */
export default function Step2QuestionComposition({
  data, chapters = [], chapterMap = {},
  onTotalQChange, onTotalMarksChange, onDurationChange, onTypeConfig,
}) {
  const [configOpen, setConfigOpen] = useState(null)
  const { msg: errMsg, visible: errVisible, flash } = useErrorFlash()

  const tq = data.totalQuestions === '' ? 0 : Number(data.totalQuestions)
  const tm = data.totalMarks === '' ? 0 : Number(data.totalMarks)

  const allocatedCount = Q_TYPES.reduce((s, t) => s + (data[t.key]?.count ?? 0), 0)
  const allocatedMarks = Q_TYPES.reduce((s, t) => s + (data[t.key]?.count ?? 0) * (data[t.key]?.marks ?? 0), 0)

  const countOk = tq === 0 || allocatedCount === tq
  const marksOk = tm === 0 || allocatedMarks === tm

  const usedByOthers = (excludeKey) =>
    Q_TYPES.filter((t) => t.key !== excludeKey).reduce((s, t) => s + (data[t.key]?.count ?? 0), 0)

  const marksPct = tm > 0 ? Math.min(100, Math.round((allocatedMarks / tm) * 100)) : 0

  const handleCountChange = (typeKey, val) => {
    const maxCount = tq === '' || tq === 0 ? 999 : tq - usedByOthers(typeKey)
    if (val > maxCount) {
      flash(`Count exceeds remaining questions (max ${maxCount} available)`)
      val = maxCount
    }
    onTypeConfig(typeKey, { count: Math.max(0, val) })
  }

  const handleMarksChange = (typeKey, val, maxMarks) => {
    if (val > maxMarks) {
      flash(`Max ${maxMarks} marks allowed for ${Q_TYPES.find(t => t.key === typeKey)?.label}`)
      val = maxMarks
    }
    onTypeConfig(typeKey, { marks: Math.max(1, val) })
  }

  const handleChapterSave = (typeKey, alloc) => {
    // Store chapter allocation on the type config; also seed Step 3 easy values
    onTypeConfig(typeKey, { chapterAlloc: alloc })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <ErrorToast msg={errMsg} visible={errVisible} />

      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Question Composition</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Define paper targets and configure question counts per type.</p>
      </div>

      {/* ── Paper Basics Fieldset ── */}
      <PaperBasics
        data={data}
        onTotalQChange={onTotalQChange}
        onTotalMarksChange={onTotalMarksChange}
        onDurationChange={onDurationChange}
        countOk={countOk}
        marksOk={marksOk}
        allocatedCount={allocatedCount}
        allocatedMarks={allocatedMarks}
      />

      {/* ── Distribution table ── */}
      <div className="w-full overflow-x-auto custom-scrollbar" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', boxShadow: 'var(--shadow)', paddingBottom: '6px' }}>
        <div style={{ minWidth: '560px' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 120px 140px 130px', padding: '14px 20px', backgroundColor: 'var(--card-2)', borderBottom: '1px solid var(--border)', gap: '12px' }}>
            <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Question Type</div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Count</div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
              Marks/Q <span style={{ color: 'rgba(14,165,233,0.6)', fontWeight: 600 }}>(max)</span>
            </div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Chapters</div>
          </div>

          {Q_TYPES.map((type, idx) => {
            const cfg = data[type.key] || { count: 0, marks: type.defaultMarks }
            const maxCount = tq === 0 ? 999 : tq - usedByOthers(type.key) + cfg.count

            return (
              <div key={type.key}
                style={{ display: 'grid', gridTemplateColumns: '2fr 120px 140px 130px', padding: '14px 20px', alignItems: 'center', gap: '12px', borderBottom: idx < Q_TYPES.length - 1 ? '1px solid var(--border)' : 'none', backgroundColor: 'var(--card)', transition: 'background 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--card)')}>

                {/* Type label */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <HelpCircle size={15} color="var(--text-3)" />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '0.88rem' }}>{type.label}</div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>{type.description}</div>
                  </div>
                </div>

                {/* Count — inline stepper */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <StepperInput
                    value={cfg.count}
                    min={0}
                    max={maxCount}
                    active={false}
                    onChange={(v) => handleCountChange(type.key, v)}
                  />
                </div>

                {/* Marks — inline stepper with hard cap */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                  <StepperInput
                    value={cfg.marks}
                    min={1}
                    max={type.maxMarks}
                    active={false}
                    onChange={(v) => handleMarksChange(type.key, v, type.maxMarks)}
                  />
                  <span style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 600 }}>/ {type.maxMarks}</span>
                </div>

                {/* Configure → Chapter assignment */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <motion.button
                    onClick={() => setConfigOpen(type)}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'transparent', border: '1.5px solid var(--border)', borderRadius: '999px', padding: '7px 13px', color: 'var(--text-2)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--card)'; e.currentTarget.style.borderColor = '#0EA5E9'; e.currentTarget.style.color = '#0EA5E9' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}>
                    <Settings2 size={12} /> Configure
                  </motion.button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Marks allocation bar ── */}
      {tm > 0 && (
        <div style={{ backgroundColor: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Marks Breakdown</p>
              <p style={{ color: 'var(--text-2)', fontSize: '0.82rem', fontWeight: 500 }}>
                {Q_TYPES.filter((t) => (data[t.key]?.count ?? 0) > 0).map((t) => `${t.label} (${data[t.key].count}×${data[t.key].marks})`).join(' + ') || 'No question counts set'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', color: marksOk ? '#10B981' : allocatedMarks > tm ? '#EF4444' : '#0EA5E9', transition: 'color 0.2s' }}>
                {allocatedMarks}
              </span>
              <span style={{ color: 'var(--text-3)', fontSize: '1rem', fontWeight: 700 }}> / {tm}</span>
            </div>
          </div>

          <div>
            <div style={{ height: '6px', backgroundColor: 'var(--card)', borderRadius: '999px', overflow: 'hidden', width: '100%' }}>
              <div style={{ height: '100%', width: `${marksPct}%`, backgroundColor: marksOk ? '#10B981' : allocatedMarks > tm ? '#EF4444' : '#0EA5E9', borderRadius: '999px', transition: 'width 0.35s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 500 }}>{marksPct}% allocated</span>
              {!marksOk && (
                <span style={{ color: allocatedMarks > tm ? '#EF4444' : '#F59E0B', fontSize: '0.72rem', fontWeight: 700 }}>
                  {allocatedMarks > tm ? `Over by ${allocatedMarks - tm} marks` : `Remaining: ${tm - allocatedMarks} marks`}
                </span>
              )}
              {marksOk && (
                <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <CheckCircle2 size={11} /> Target achieved!
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chapter allocation modal */}
      {configOpen && (
        <ChapterModal
          type={configOpen}
          config={data[configOpen.key] || { count: 0, marks: configOpen.defaultMarks }}
          chapters={chapters}
          chapterMap={chapterMap}
          onSave={(alloc) => handleChapterSave(configOpen.key, alloc)}
          onClose={() => setConfigOpen(null)}
        />
      )}
    </div>
  )
}
