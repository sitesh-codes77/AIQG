import { X } from 'lucide-react'
import Checkbox from '../../ui/Checkbox'

export default function SearchResults({ filteredBooks, searchQuery, selectedBookIds, toggleBook, onClose }) {
  return (
    <div style={{
      backgroundColor: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        padding: '8px 14px', backgroundColor: 'var(--card-2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ color: 'var(--text-3)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Search Results — {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
        </span>
        <button onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', padding: '2px' }}
        >
          <X size={14} />
        </button>
      </div>

      {filteredBooks.length === 0 ? (
        <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.875rem' }}>
          No books found for "{searchQuery}"
        </div>
      ) : (
        <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
          {filteredBooks.map((book) => {
            const checked = selectedBookIds.includes(book.id)
            return (
              <button key={book.id} type="button"
                onClick={() => toggleBook({ id: book.id, label: book.label })}
                style={{
                  width: '100%', padding: '11px 14px',
                  background: checked ? 'var(--primary-dim)' : 'none',
                  border: 'none', borderBottom: '1px solid var(--border)',
                  color: checked ? '#0EA5E9' : 'var(--text-1)',
                  fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { if (!checked) e.currentTarget.style.backgroundColor = 'var(--card-2)' }}
                onMouseLeave={(e) => { if (!checked) e.currentTarget.style.backgroundColor = checked ? 'var(--primary-dim)' : 'transparent' }}
              >
                <Checkbox checked={checked} />
                <div>
                  <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{book.label}</div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
