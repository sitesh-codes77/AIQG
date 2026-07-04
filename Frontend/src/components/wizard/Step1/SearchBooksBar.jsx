import { Search } from 'lucide-react'

export default function SearchBooksBar({ searchQuery, setSearchQuery, handleSearch, setSearchActive }) {
  return (
    <div>
      <label style={{ display: 'block', color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Search Books
      </label>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} color="var(--text-3)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (e.target.value.trim() === '') setSearchActive(false)
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(e) }}
            placeholder="Search by book name..."
            style={{
              width: '100%', backgroundColor: 'var(--input-bg)',
              border: '1.5px solid var(--input-border)',
              borderRadius: '10px', padding: '10px 13px 10px 34px',
              color: 'var(--text-1)', fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#0EA5E9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.15)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none' }}
          />
        </div>
        <button type="submit" style={{
          backgroundColor: 'var(--primary)', color: '#fff', border: 'none',
          borderRadius: '10px', padding: '10px 18px', fontSize: '0.85rem',
          fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
          gap: '6px', transition: 'all 0.2s', flexShrink: 0,
        }}>
          <Search size={14} /> Search
        </button>
      </form>
    </div>
  )
}
