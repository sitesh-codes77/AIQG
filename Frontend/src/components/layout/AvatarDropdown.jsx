import { useState, useRef, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { getInitials } from '../../utils/getInitials'

export default function AvatarDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = getInitials(user?.username)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Avatar circle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={user?.username || 'User'}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #000))',
          border: '2px solid var(--border)',
          color: '#fff',
          fontWeight: 800,
          fontSize: '0.78rem',
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.2s',
          boxShadow: isOpen ? '0 0 0 3px var(--primary-glow)' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)'
          e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-glow)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
          if (!isOpen) e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {initials}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '0',
            minWidth: '220px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            zIndex: 200,
            overflow: 'hidden',
            animation: 'avatarDropdownIn 0.15s ease-out',
          }}
        >
          {/* User info */}
          <div style={{ padding: '1rem 1.15rem 0.85rem' }}>
            <p style={{
              color: 'var(--text-1)',
              fontWeight: 700,
              fontSize: '0.88rem',
              lineHeight: 1.3,
              wordBreak: 'break-word',
            }}>
              {user?.username || 'User'}
            </p>
            {user?.email && (
              <p style={{
                color: 'var(--text-3)',
                fontSize: '0.78rem',
                marginTop: '2px',
                fontWeight: 500,
                wordBreak: 'break-all',
              }}>
                {user.email}
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

          {/* Logout */}
          <button
            onClick={() => { setIsOpen(false); onLogout() }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1.15rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-3)',
              fontSize: '0.82rem',
              fontWeight: 600,
              transition: 'all 0.15s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--danger-dim)'
              e.currentTarget.style.color = 'var(--danger)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-3)'
            }}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      )}
    </div>
  )
}
