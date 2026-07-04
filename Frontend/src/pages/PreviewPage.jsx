import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Download, FileText, Clock, AlertTriangle } from 'lucide-react'
import useWizardStore from '../store/useWizardStore'
import samplePdf from '../assets/assess-cli-1782760391.pdf'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function PreviewPage() {
  const navigate = useNavigate()
  const generationHistory = useWizardStore((s) => s.generationHistory)
  const [pdfError, setPdfError] = useState(false)

  const latestEntry = generationHistory.length > 0 ? generationHistory[0] : null

  const handleViewNewTab = () => {
    window.open(samplePdf, '_blank')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = samplePdf
    link.download = 'EduGen_Question_Paper.pdf'
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ── */}
      <Navbar variant="preview" />

      {/* ── Main Content ── */}
      <div style={{
        flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto',
        padding: '2rem 1.5rem',
        display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem',
      }}
        className="preview-layout"
      >

        {/* ── Left: PDF Preview ── */}
        <div style={{
          backgroundColor: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--card-2)', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                backgroundColor: 'var(--success-dim)', borderRadius: '8px',
                padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={16} color="var(--success)" />
              </div>
              <div>
                <span style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '0.9rem' }}>
                  Generated Question Paper
                </span>
                {latestEntry && (
                  <p style={{ color: 'var(--text-3)', fontSize: '0.72rem', marginTop: '1px' }}>
                    {latestEntry.totalQuestions} Questions · {latestEntry.totalMarks} Marks
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleViewNewTab}
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
              <button onClick={handleDownload}
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
            {pdfError ? (
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
                <button onClick={handleDownload}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem',
                    background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))',
                    border: 'none', borderRadius: '9px', padding: '10px 22px',
                    color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 14px var(--primary-dim)',
                  }}
                >
                  <Download size={15} /> Download PDF Instead
                </button>
              </div>
            ) : (
              <iframe
                src={samplePdf}
                title="Generated Question Paper"
                style={{ width: '100%', height: '100%', border: 'none', minHeight: '600px' }}
                onError={() => setPdfError(true)}
              />
            )}
          </div>
        </div>

        {/* ── Right: Generation History Sidebar ── */}
        <div style={{
          backgroundColor: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column',
          height: 'fit-content', maxHeight: 'calc(100vh - 120px)',
          position: 'sticky', top: '74px',
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--card-2)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
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

          {/* History list */}
          <div style={{ overflowY: 'auto', flex: 1, maxHeight: '520px' }}>
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
        </div>
      </div>

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}
