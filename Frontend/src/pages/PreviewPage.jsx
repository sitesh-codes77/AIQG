import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Download, FileText, Clock, AlertTriangle, Eye, EyeOff, RefreshCw, Send, X } from 'lucide-react'
import useWizardStore from '../store/useWizardStore'
import samplePdf from '../assets/assess-cli-1782760391.pdf'
import answerPdf from '../assets/question_paper (1).pdf'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AsyncGenerateModal from '../components/wizard/AsyncGenerateModal'

// ── Decoupled Regenerate Feedback Card to prevent parent component re-renders while typing ──
function RegenerateFeedbackCard({ onSend, onClose }) {
  const [prompt, setPrompt] = useState('')

  return (
    <div style={{
      backgroundColor: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '14px', padding: '1.25rem',
      boxShadow: 'var(--shadow)',
      display: 'flex', flexDirection: 'column', gap: '0.85rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ color: 'var(--text-1)', fontSize: '0.88rem', fontWeight: 700 }}>
          What changes do you want to make?
        </p>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-3)', display: 'flex', alignItems: 'center',
            padding: '4px', borderRadius: '6px', transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-3)'}
        >
          <X size={18} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Make the questions harder, add more MCQs from chapter 3..."
          rows={3}
          style={{
            flex: 1, backgroundColor: 'var(--input-bg)',
            border: '1.5px solid var(--input-border)',
            borderRadius: '10px', padding: '10px 14px',
            color: 'var(--text-1)', fontSize: '0.875rem',
            fontFamily: 'inherit', resize: 'vertical',
            outline: 'none', transition: 'border-color 0.2s',
            minHeight: '60px',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)'
            e.target.style.boxShadow = '0 0 0 3px var(--primary-dim)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--input-border)'
            e.target.style.boxShadow = 'none'
          }}
        />
        <button
          onClick={() => onSend(prompt)}
          disabled={!prompt.trim()}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: prompt.trim()
              ? 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))'
              : 'var(--border)',
            border: 'none', borderRadius: '10px',
            padding: '10px 20px', color: '#fff',
            fontSize: '0.875rem', fontWeight: 700,
            cursor: prompt.trim() ? 'pointer' : 'not-allowed',
            boxShadow: prompt.trim() ? '0 2px 10px var(--primary-dim)' : 'none',
            transition: 'all 0.2s',
            flexShrink: 0,
            opacity: prompt.trim() ? 1 : 0.6,
          }}
        >
          <Send size={15} /> Send
        </button>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  const navigate = useNavigate()
  const generationHistory = useWizardStore((s) => s.generationHistory)
  const [pdfError, setPdfError] = useState(false)

  // Task 9: Split-screen state
  const [showAnswers, setShowAnswers] = useState(false)

  // Task 9: Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Task 10: Regenerate state
  const [showRegenInput, setShowRegenInput] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const latestEntry = generationHistory.length > 0 ? generationHistory[0] : null

  const handleViewTabForSrc = (src) => {
    window.open(src, '_blank')
  }

  const handleDownloadForSrc = (src, filename) => {
    const link = document.createElement('a')
    link.href = src
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatTimestamp = (ts) => {
    try {
      const d = new Date(ts)
      return d.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return ts
    }
  }

  // Task 10: Regenerate handlers
  const handleRegenSend = (promptText) => {
    setIsRegenerating(true)
  }

  const handleRegenComplete = () => {
    setIsRegenerating(false)
    setShowRegenInput(false)
    setShowAnswers(false)
  }

  // ── PDF Card Component (reusable for question & answer) ──
  const PdfCard = ({ title, subtitle, pdfSrc, isAnswer = false }) => (
    <div style={{
      backgroundColor: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '16px', overflow: 'hidden',
      boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column',
      minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--card-2)', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            backgroundColor: isAnswer ? 'var(--primary-dim)' : 'var(--success-dim)', borderRadius: '8px',
            padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={16} color={isAnswer ? 'var(--primary)' : 'var(--success)'} />
          </div>
          <div>
            <span style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '0.9rem' }}>
              {title}
            </span>
            {subtitle && (
              <p style={{ color: 'var(--text-3)', fontSize: '0.72rem', marginTop: '1px' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => handleViewTabForSrc(pdfSrc)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              backgroundColor: 'transparent', border: '1.5px solid var(--border)',
              borderRadius: '8px', padding: '7px 14px', color: 'var(--text-2)',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
          >
            <ExternalLink size={13} /> View in New Tab
          </button>
          <button onClick={() => handleDownloadForSrc(pdfSrc, isAnswer ? 'AIQG_Answer_Key.pdf' : 'AIQG_Question_Paper.pdf')}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))',
              border: 'none', borderRadius: '8px', padding: '7px 14px',
              color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 2px 10px var(--primary-dim)',
              transition: 'all 0.2s',
            }}
          >
            <Download size={13} /> Download PDF
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div style={{ flex: 1, minHeight: '600px', position: 'relative' }}>
        {pdfError && !isAnswer ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', padding: '3rem',
            textAlign: 'center', gap: '1rem',
          }}>
            <AlertTriangle size={40} color="var(--warning)" />
            <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '1.1rem' }}>
              PDF Preview Unavailable
            </h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', maxWidth: '380px', lineHeight: 1.6 }}>
              Your browser doesn't support inline PDF previews. Use the buttons above to view or download the paper.
            </p>
            <button onClick={() => handleDownloadForSrc(pdfSrc, isAnswer ? 'AIQG_Answer_Key.pdf' : 'AIQG_Question_Paper.pdf')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem',
                background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))',
                border: 'none', borderRadius: '99px', padding: '10px 22px',
                color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 14px var(--primary-dim)',
              }}
            >
              <Download size={15} /> Download PDF Instead
            </button>
          </div>
        ) : (
          <iframe
            src={pdfSrc}
            title={title}
            style={{ width: '100%', height: '100%', border: 'none', minHeight: '600px' }}
            onError={() => !isAnswer && setPdfError(true)}
          />
        )}
      </div>
    </div>
  )

  // ── History List (reused in drawer) ──
  const HistoryContent = () => (
    <div style={{ overflowY: 'auto', flex: 1 }}>
      {generationHistory.length === 0 ? (
        <div style={{
          padding: '2rem 1.25rem', textAlign: 'center',
          color: 'var(--text-3)', fontSize: '0.82rem',
        }}>
          <FileText size={28} color="var(--border-2)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
          No papers generated yet.
          <br />Your history will appear here.
        </div>
      ) : (
        generationHistory.map((entry, idx) => (
          <div key={entry.id}
            style={{
              padding: '0.9rem 1.25rem',
              borderBottom: idx < generationHistory.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: 'default',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--card-2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: idx === 0 ? 'var(--success-dim)' : 'var(--primary-dim)',
                border: `1px solid ${idx === 0 ? 'var(--success)' : 'var(--primary)'}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <FileText size={14} color={idx === 0 ? 'var(--success)' : 'var(--primary)'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  color: 'var(--text-1)', fontSize: '0.82rem', fontWeight: 700,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  lineHeight: 1.3,
                }}>
                  {entry.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 500 }}>
                    {formatTimestamp(entry.timestamp)}
                  </span>
                  {entry.chapterCount > 0 && (
                    <span style={{
                      backgroundColor: 'var(--primary-dim)', color: 'var(--primary)',
                      fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px',
                      borderRadius: '999px',
                    }}>
                      {entry.chapterCount} ch
                    </span>
                  )}
                  <span style={{
                    backgroundColor: 'var(--success-dim)', color: 'var(--success)',
                    fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px',
                    borderRadius: '999px',
                  }}>
                    {entry.totalQuestions} Qs
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ── */}
      <Navbar variant="preview" onMenuClick={() => setDrawerOpen(true)} />

      {/* ── Main Content ── */}
      <div style={{
        flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto',
        padding: '2rem 1.5rem',
        display: 'flex', flexDirection: 'column', gap: '1.25rem',
      }}>

        {/* ── PDF Grid (full-width or split-screen) ── */}
        <div
          className="preview-pdf-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: showAnswers ? '1fr 1fr' : '1fr',
            gap: '1.5rem',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Question PDF */}
          <PdfCard
            title="Generated Question Paper"
            subtitle={latestEntry ? `${latestEntry.totalQuestions} Questions · ${latestEntry.totalMarks} Marks` : null}
            pdfSrc={samplePdf}
          />

          {/* Answer PDF — only when split-screen */}
          {showAnswers && (
            <PdfCard
              title="Answer Key"
              subtitle="Model answers for the generated paper"
              pdfSrc={answerPdf}
              isAnswer
            />
          )}
        </div>

        {/* ── Action Buttons Row ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          flexWrap: 'wrap',
        }}>
          {/* View Answers toggle */}
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              backgroundColor: showAnswers ? 'var(--primary-dim)' : 'transparent',
              border: `1.5px solid ${showAnswers ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: '10px', padding: '10px 20px',
              color: showAnswers ? 'var(--primary)' : 'var(--text-2)',
              fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!showAnswers) {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.color = 'var(--primary)'
              }
            }}
            onMouseLeave={(e) => {
              if (!showAnswers) {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-2)'
              }
            }}
          >
            {showAnswers ? <><EyeOff size={16} /> Hide Answers</> : <><Eye size={16} /> View Answers</>}
          </button>

          {/* Regenerate */}
          <button
            onClick={() => setShowRegenInput(!showRegenInput)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              backgroundColor: showRegenInput ? 'var(--warning-dim)' : 'transparent',
              border: `1.5px solid ${showRegenInput ? 'var(--warning)' : 'var(--border)'}`,
              borderRadius: '10px', padding: '10px 20px',
              color: showRegenInput ? 'var(--warning)' : 'var(--text-2)',
              fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!showRegenInput) {
                e.currentTarget.style.borderColor = 'var(--warning)'
                e.currentTarget.style.color = 'var(--warning)'
              }
            }}
            onMouseLeave={(e) => {
              if (!showRegenInput) {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-2)'
              }
            }}
          >
            <RefreshCw size={16} /> Regenerate
          </button>
        </div>

        {/* ── Regenerate Feedback Input ── */}
        {showRegenInput && (
          <RegenerateFeedbackCard
            onSend={handleRegenSend}
            onClose={() => setShowRegenInput(false)}
          />
        )}
      </div>

      {/* ── History Drawer (right-side overlay) ── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 200, backdropFilter: 'blur(4px)',
            }}
          />
          {/* Drawer panel */}
          <div style={{
            position: 'fixed', right: 0, top: 0, bottom: 0,
            width: '360px', maxWidth: '85vw',
            backgroundColor: 'var(--card)',
            borderLeft: '1px solid var(--border)',
            zIndex: 201, display: 'flex', flexDirection: 'column',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.2)',
            animation: 'drawerSlideIn 0.25s ease-out',
          }}>
            {/* Drawer header */}
            <div style={{
              padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--card-2)',
              display: 'flex', alignItems: 'center', justify: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  backgroundColor: 'var(--primary-dim)', borderRadius: '8px',
                  padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Clock size={14} color="var(--primary)" />
                </div>
                <span style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '0.85rem' }}>
                  Generation History
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-3)', display: 'flex', alignItems: 'center',
                  padding: '4px', borderRadius: '6px', transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-1)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-3)'}
              >
                <X size={18} />
              </button>
            </div>
            <HistoryContent />
          </div>
        </>
      )}

      {/* ── Regeneration Modal ── */}
      {isRegenerating && <AsyncGenerateModal onComplete={handleRegenComplete} />}

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}
