import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RotateCcw, FileCheck2, ChevronRight
} from 'lucide-react'
import useWizardStore from '../store/useWizardStore'
import Navbar from '../components/layout/Navbar'
import { useToast } from '../components/ui/Toast'
import Step1ContentSelection from '../components/wizard/Step1/Step1ContentSelection'
import Step2QuestionComposition from '../components/wizard/Step2/Step2QuestionComposition'
import Step3DifficultyDistribution from '../components/wizard/Step3/Step3DifficultyDistribution'
import Step4Review from '../components/wizard/Step4/Step4Review'
import Stepper, { STEPS } from '../components/wizard/Stepper'
import AsyncGenerateModal from '../components/wizard/AsyncGenerateModal'
import { motion, AnimatePresence } from 'framer-motion'

import { step1Schema, step2Schema, validateStep3 } from '../store/validation'


/* ── Wizard Page ────────────────────────────────────────── */
export default function WizardPage() {
  const navigate = useNavigate()
  const { showToast, ToastContainer } = useToast()
  const [showGenerating, setShowGenerating] = useState(false)
  const [bannerMsg,   setBannerMsg]   = useState('')

  // Store selectors
  const currentStep        = useWizardStore((s) => s.currentStep)
  const setStep            = useWizardStore((s) => s.setStep)
  const step1              = useWizardStore((s) => s.step1)
  const step2              = useWizardStore((s) => s.step2)
  const step3              = useWizardStore((s) => s.step3)
  const updateStep1        = useWizardStore((s) => s.updateStep1)
  const setTotalQuestions  = useWizardStore((s) => s.setTotalQuestions)
  const setTotalMarks      = useWizardStore((s) => s.setTotalMarks)
  const setDuration        = useWizardStore((s) => s.setDuration)
  const updateTypeConfig   = useWizardStore((s) => s.updateTypeConfig)
  const updateStep3        = useWizardStore((s) => s.updateStep3)
  const resetCurrentStep   = useWizardStore((s) => s.resetCurrentStep)
  const addGenerationEntry = useWizardStore((s) => s.addGenerationEntry)

  const isFinalStep = currentStep === 4

 /* ── Validation ─────────────────────────────────────── */
  const validateStep = (step) => {
    if (step === 1) {
      const res = step1Schema.safeParse(step1)
      if (!res.success) {
        // Bulletproof Zod error extraction
        const zodErrors = res.error?.issues || res.error?.errors || [];
        const msg = zodErrors.length > 0 ? zodErrors[0].message : "Please select valid content.";
        showToast(msg, 'error')
        return false
      }
    } else if (step === 2) {
      const targetMarks = Number(step2.totalMarks) || 0
      const targetQuestions = Number(step2.totalQuestions) || 0
      
      const mcqMarks = (step2.mcq?.count ?? 0) * (step2.mcq?.marks ?? 1)
      const msqMarks = (step2.msq?.count ?? 0) * (step2.msq?.marks ?? 2)
      const numericalMarks = (step2.numerical?.count ?? 0) * (step2.numerical?.marks ?? 4)
      const shortMarks = (step2.short?.count ?? 0) * (step2.short?.marks ?? 3)
      const longMarks = (step2.long?.count ?? 0) * (step2.long?.marks ?? 5)
      
      const mcqCount = (step2.mcq?.count ?? 0)
      const msqCount = (step2.msq?.count ?? 0)
      const numericalCount = (step2.numerical?.count ?? 0)
      const shortCount = (step2.short?.count ?? 0)
      const longCount = (step2.long?.count ?? 0)

      const allocatedMarks = mcqMarks + msqMarks + numericalMarks + shortMarks + longMarks
      const allocatedQuestions = mcqCount + msqCount + numericalCount + shortCount + longCount

      const errors = []

      // Bulletproof Zod parsing
      const res = step2Schema.safeParse(step2)
      if (!res.success) {
        const zodErrors = res.error?.issues || res.error?.errors || [];
        errors.push(...zodErrors.map(e => e.message))
      }

      // STRICT VALIDATION GATE
      if (allocatedMarks !== targetMarks || allocatedQuestions !== targetQuestions) {
        errors.push(`Configuration Mismatch: Your allocated rows (${allocatedQuestions} Qs / ${allocatedMarks} Marks) do not perfectly match the target paper totals (${targetQuestions} Qs / ${targetMarks} Marks).`)
      }

      if (errors.length > 0) {
        errors.forEach(err => showToast(err, 'error'))
        return false // Stops the user from proceeding
      }
    } else if (step === 3) {
      const targetQuestions = Number(step2.totalQuestions) || 0
      let sumDistributed = 0
      const chaptersToIterate = activeChapters.length > 0 ? activeChapters : ['All Chapters']
      
      for (const chapter of chaptersToIterate) {
        const chapterData = step3[chapter] || {}
        for (const typeKey of ['mcq', 'msq', 'numerical', 'short', 'long']) {
          if (chapterData[typeKey]) {
            sumDistributed += (Number(chapterData[typeKey].easy) || 0)
                            + (Number(chapterData[typeKey].medium) || 0)
                            + (Number(chapterData[typeKey].hard) || 0)
          }
        }
      }

      const errors = []

      // Bulletproof Zod parsing
      const res = validateStep3(step3, step2, activeChapters)
      if (!res.success) {
        const zodErrors = res.error?.issues || res.error?.errors || [];
        errors.push(...zodErrors.map(e => e.message))
      }

      if (sumDistributed !== targetQuestions) {
        errors.push(`Difficulty Mismatch: You have distributed ${sumDistributed} questions, but you need to distribute exactly ${targetQuestions} questions.`)
      }

      if (errors.length > 0) {
        errors.forEach(err => showToast(err, 'error'))
        return false // Stops the user from proceeding
      }
    }
    return true
  }
  const handleNext = () => {
    if (!validateStep(currentStep)) return
    if (currentStep < 4) {
      if (currentStep === 2 || currentStep === 3) {
        showToast('Configuration perfectly balanced & saved!', 'success')
      }
      setStep(currentStep + 1)
    }
    else {
      // Start async generation flow
      setShowGenerating(true)
    }
  }

  const handleGenerationComplete = () => {
    // Add to generation history
    const bookNames = (step1.books || []).map(b => b.label).join(', ') || 'Unknown'
    addGenerationEntry({
      id: Date.now().toString(),
      title: `Paper — ${bookNames}`,
      timestamp: new Date().toISOString(),
      bookNames,
      chapterCount: (step1.chapters || []).length,
      totalQuestions: step2.totalQuestions,
      totalMarks: step2.totalMarks,
    })
    setShowGenerating(false)
    navigate('/preview')
  }

  const handleBack = () => {
    setBannerMsg('')
    setStep(currentStep - 1)
  }

  const handleGoto = (step) => {
    setBannerMsg('')
    setStep(step)
  }

  const handleReset = () => {
    setBannerMsg('')
    resetCurrentStep()
  }

  /* ── Chapters for Step 3 ────────────────────────────── */
  const chapterMap = step1.chapterMap || {}
  const activeChapters = step1.chapters?.length > 0 ? step1.chapters : []

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Nav ── */}
      <Navbar
        variant="wizard"
        currentStep={currentStep}
        totalSteps={STEPS.length}
        stepLabel={STEPS[currentStep - 1].label}
      />

      {/* ── Content ── */}
      <div style={{ flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Stepper card */}
        <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem 2rem', boxShadow: 'var(--shadow)' }}>
          <div className="w-full overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <Stepper current={currentStep} onGoto={handleGoto} />
          </div>
        </div>

       

        {/* Step content card */}
        <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '2rem', boxShadow: 'var(--shadow)', flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <Step1ContentSelection data={step1} onChange={updateStep1} />
              )}
              {currentStep === 2 && (
                <Step2QuestionComposition
                  data={step2}
                  chapters={step1.chapters || []}
                  chapterMap={chapterMap}
                  onTotalQChange={setTotalQuestions}
                  onTotalMarksChange={setTotalMarks}
                  onDurationChange={setDuration}
                  onTypeConfig={updateTypeConfig}
                />
              )}
              {currentStep === 3 && (
                <Step3DifficultyDistribution
                  step2Data={step2}
                  data={step3}
                  onUpdate={updateStep3}
                  chapters={activeChapters}
                  chapterMap={chapterMap}
                />
              )}
              {currentStep === 4 && (
                <Step4Review step1={step1} step2={step2} step3={step3} chapterMap={chapterMap} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Action Bar ── */}
        <div className="action-bar" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: isFinalStep ? 'flex-end' : 'space-between', boxShadow: 'var(--shadow)', gap: '1rem' }}>
          {/* Reset current step — hidden on Review page */}
          {!isFinalStep && (
            <button onClick={handleReset} className="action-bar-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: '1.5px solid var(--border)', borderRadius: '9px', padding: '9px 18px', color: 'var(--text-3)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)' }}
              title="Clears only this step's data">
              <RotateCcw size={14} /> Reset
            </button>
          )}

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            {/* Back */}
            {currentStep > 1 && (
              <button onClick={handleBack} className="action-bar-btn"
                style={{ backgroundColor: 'transparent', border: '1.5px solid var(--border)', borderRadius: '9px', padding: '9px 18px', color: 'var(--text-2)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-2)'; e.currentTarget.style.color = 'var(--text-1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}>
                Back
              </button>
            )}

            {/* Next / Generate */}
            <motion.button
              id={isFinalStep ? 'generateExamBtn' : 'nextStepBtn'}
              className="action-bar-btn"
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                background: isFinalStep
                  ? 'linear-gradient(135deg,var(--success),#059669)'
                  : 'linear-gradient(135deg,var(--primary),color-mix(in srgb,var(--primary) 80%,#000))',
                border: 'none', borderRadius: '9px',
                padding: isFinalStep ? '11px 26px' : '9px 22px',
                color: '#fff',
                fontSize: isFinalStep ? '0.95rem' : '0.875rem',
                fontWeight: 700, cursor: 'pointer',
                boxShadow: isFinalStep ? '0 4px 18px var(--success-dim)' : '0 4px 14px var(--primary-dim)',
                transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              {isFinalStep
                ? <><FileCheck2 size={17} /> Generate Exam Paper</>
                : <>Next <ChevronRight size={16} /></>
              }
            </motion.button>
          </div>
        </div>
      </div>

      {showGenerating && <AsyncGenerateModal onComplete={handleGenerationComplete} />}
      <ToastContainer />
    </div>
  )
}