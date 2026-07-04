import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import Checkbox from './Checkbox'

/* ── Multi-select Book Dropdown with checkboxes (always shows full list) ── */
export default function MultiSelectBookDropdown({ label, options, selected = [], onToggle, onToggleAll }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isOpen])

  const selectedIds = selected.map(b => b.id)
  const allSelected = options.length > 0 && selected.length === options.length

  const displayText =
    selected.length === 0 ? 'Select books...'
    : allSelected ? 'All books selected'
    : selected.length === 1 ? selected[0].label
    : `${selected.length} books selected`

  return (
    <div ref={containerRef}>
      <label style={{ display: 'block', color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', backgroundColor: 'var(--input-bg)',
          border: `1.5px solid ${isOpen ? '#0EA5E9' : 'var(--input-border)'}`,
          borderRadius: '10px', padding: '10px 13px',
          color: selected.length > 0 ? 'var(--text-1)' : 'var(--text-3)',
          fontSize: '0.875rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: isOpen ? '0 0 0 3px rgba(14,165,233,0.15)' : 'none',
          transition: 'all 0.2s', textAlign: 'left',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayText}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selected.length > 0 && !allSelected && (
            <span style={{ backgroundColor: '#0EA5E9', color: '#fff', borderRadius: '999px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>
              {selected.length}
            </span>
          )}
          <ChevronDown size={14} color="var(--text-3)" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </div>

      {/* Dropdown list — pushes content down */}
      {isOpen && (
        <div style={{
          marginTop: '5px', backgroundColor: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '10px', boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
          maxHeight: '240px', overflowY: 'auto',
        }}>
          {/* Select All */}
          <button type="button" onClick={onToggleAll}
            style={{
              width: '100%', padding: '9px 13px', background: 'none', border: 'none',
              borderBottom: '1px solid var(--border)', color: '#0EA5E9',
              fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
              textAlign: 'left', display: 'flex', alignItems: 'center', gap: '9px',
            }}
          >
            <Checkbox checked={allSelected} />
            Select All Books
          </button>

          {options.map((opt) => {
            const checked = selectedIds.includes(opt.value)
            return (
              <button key={opt.value} type="button" onClick={() => onToggle({ id: opt.value, label: opt.label })}
                style={{
                  width: '100%', padding: '9px 13px',
                  background: checked ? 'var(--primary-dim)' : 'none',
                  border: 'none', color: checked ? '#0EA5E9' : 'var(--text-2)',
                  fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '9px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { if (!checked) e.currentTarget.style.backgroundColor = 'var(--card-2)' }}
                onMouseLeave={(e) => { if (!checked) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <Checkbox checked={checked} />
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
