import { useState, useCallback, useRef } from 'react'
import { AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Red flash toast ─────────────────────────────────── */
export function ErrorToast({ msg, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed', top: '1.25rem', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: '#1e0a0a', border: '1.5px solid #EF4444',
            borderRadius: '12px', padding: '10px 18px', zIndex: 9999,
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 8px 32px rgba(239,68,68,0.3)',
          }}>
          <AlertCircle size={15} color="#EF4444" />
          <span style={{ color: '#FCA5A5', fontSize: '0.82rem', fontWeight: 700 }}>{msg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Hook: timed error flash ─────────────────────────── */
export function useErrorFlash() {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  const flash = useCallback((text) => {
    setMsg(text)
    setVisible(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), 2200)
  }, [])

  return { msg, visible, flash }
}
