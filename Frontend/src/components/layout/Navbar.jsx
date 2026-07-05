import { useNavigate } from 'react-router-dom'
import { NotebookText, ChevronRight } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'
import AvatarDropdown from './AvatarDropdown'
import useWizardStore from '../../store/useWizardStore'
import useAuthStore from '../../store/useAuthStore'

export default function Navbar({ variant = 'landing', currentStep, totalSteps, stepLabel, onMenuClick }) {
  const navigate = useNavigate()
  const isDark = useWizardStore((s) => s.isDark)
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (variant === 'wizard') {
    return (
      <div style={{ backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '58px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '0.83rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <NotebookText size={16} color="var(--primary)" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>AIQG</span>
          </div>
        </button>

        <div style={{ color: 'var(--text-3)', fontSize: '0.78rem', fontWeight: 500 }}>
          Step {currentStep} of {totalSteps} — {stepLabel}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle />
          {isAuthenticated && user && (
            <AvatarDropdown user={user} onLogout={handleLogout} />
          )}
        </div>
      </div>
    )
  }

  if (variant === 'preview') {
    return (
      <div style={{
        backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '58px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <NotebookText size={16} color="var(--primary)" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>AIQG</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => { useWizardStore.getState().resetAll(); navigate('/generator') }}
            style={{
              backgroundColor: 'transparent', border: '1.5px solid var(--border)',
              borderRadius: '8px', padding: '7px 16px', color: 'var(--text-2)',
              fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
          >
            New Paper <ChevronRight size={13} />
          </button>
          {onMenuClick && (
            <button onClick={onMenuClick}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: 'transparent', border: '1.5px solid var(--border)',
                borderRadius: '8px', padding: '7px 14px', color: 'var(--text-2)',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
            >
              History
            </button>
          )}
          <ThemeToggle />
          {isAuthenticated && user && (
            <AvatarDropdown user={user} onLogout={handleLogout} />
          )}
        </div>
      </div>
    )
  }

  // Default: Landing Page / Global navbar
  return (
    <nav
      style={{
        backgroundColor: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--border)",
        borderRadius: "999px",
        position: "fixed",
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 2rem)",
        maxWidth: "1100px",
        zIndex: 100,
        height: "60px",
        display: "flex",
        alignItems: "center",
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.37)"
          : "0 8px 32px rgba(31,38,135,0.05)",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "0 2rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <NotebookText size={22} color="var(--primary)" />
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "var(--primary)",
              letterSpacing: "-0.02em",
            }}
          >
            AIQG
          </span>
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {isAuthenticated ? (
            <>
              <ThemeToggle />
              <AvatarDropdown user={user} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                style={{
                  backgroundColor: "var(--primary)",
                  border: "1.5px solid var(--primary)",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "8px 24px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 20px var(--primary-glow)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                Login <ChevronRight size={13} />
              </button>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
