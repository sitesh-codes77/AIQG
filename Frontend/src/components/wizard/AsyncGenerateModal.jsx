import { useState, useEffect, useRef } from 'react'
import { Loader2, BookOpen, PenTool, BrainCircuit, FileCheck } from 'lucide-react'

const GENERATION_STEPS = [
  { text: 'Initializing AI Agent...', Icon: Loader2 },
  { text: 'Fetching content from chapters...', Icon: BookOpen },
  { text: 'Composing questions...', Icon: PenTool },
  { text: 'Running quality review...', Icon: BrainCircuit },
  { text: 'Generating PDF...', Icon: FileCheck },
]

export default function AsyncGenerateModal({ onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIdx(prev => {
        if (prev >= GENERATION_STEPS.length - 1) {
          clearInterval(intervalRef.current)
          // Small delay after final step, then complete
          setTimeout(() => onComplete(), 800)
          return prev
        }
        return prev + 1
      })
    }, 2000)
    return () => clearInterval(intervalRef.current)
  }, [onComplete])

  const progress = ((currentIdx + 1) / GENERATION_STEPS.length) * 100
  const CurrentIcon = GENERATION_STEPS[currentIdx].Icon

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, backdropFilter: 'blur(10px)' }}>
      <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '440px', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
        {/* Spinner */}
        <div style={{ width: '72px', height: '72px', margin: '0 auto 1.5rem', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 1s linear infinite',
          }} />
          <CurrentIcon
            size={28}
            color="var(--primary)"
            className={currentIdx === 0 ? "animate-spin" : ""}
            style={{ transition: 'all 0.3s' }}
          />
        </div>

        <h2 style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          Generating Your Paper
        </h2>
        <p style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', minHeight: '1.4em' }}>
          {GENERATION_STEPS[currentIdx].text}
        </p>

        {/* Progress bar */}
        <div style={{ height: '6px', backgroundColor: 'var(--card-2)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--success))',
            borderRadius: '999px',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
          {GENERATION_STEPS.map((_, i) => (
            <div key={i} style={{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: i <= currentIdx ? 'var(--primary)' : 'var(--border)',
              transition: 'background-color 0.3s',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
