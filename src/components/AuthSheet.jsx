import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Button from './Button'
import ProfileFields, { Field, MobileInput } from './ProfileFields'
import { EMPTY_PROFILE, cleanProfile, validateProfile } from '../utils/profile'
import { MOBILE_REGEX, closeAuthSheet, logIn, saveSubscription, signUp, useAuthSheet } from '../hooks/useAuth'
import { useComboBuilder } from '../hooks/useComboBuilder'
import { DASHBOARD_HASH, goTo } from '../hooks/useRoute'

const MODES = [
  { id: 'login', label: 'Log in' },
  { id: 'signup', label: 'Sign up' },
]

function AuthForm({ initialMode, intent }) {
  const [mode, setMode] = useState(initialMode)
  const [mobile, setMobile] = useState('')
  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const combo = useComboBuilder()
  const reduceMotion = useReducedMotion()

  function finish() {
    if (intent === 'subscribe' && combo.isComplete) {
      saveSubscription({
        vegetables: combo.state.vegetables,
        leafyGreens: combo.state.leafyGreens,
        deliveryDay: combo.state.deliveryDay,
      })
    }
    closeAuthSheet()
    goTo(DASHBOARD_HASH)
    window.scrollTo({ top: 0 })
  }

  function switchMode(next) {
    setMode(next)
    setErrors({})
    setFormError(null)
    if (next === 'signup' && mobile) setProfile((p) => ({ ...p, mobile }))
  }

  function handleLogin(event) {
    event.preventDefault()
    if (!MOBILE_REGEX.test(mobile)) {
      setErrors({ mobile: 'Enter a 10-digit mobile number.' })
      return
    }
    const error = logIn(mobile)
    if (error) {
      setMode('signup')
      setProfile((p) => ({ ...p, mobile }))
      setFormError(error)
      return
    }
    finish()
  }

  function handleSignup(event) {
    event.preventDefault()
    const found = validateProfile(profile)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      event.currentTarget.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    const clean = cleanProfile(profile)
    const error = signUp(clean)
    if (error) {
      setFormError(error)
      setMobile(clean.mobile)
      setMode('login')
      return
    }
    combo.setPincode(clean.address.pincode)
    finish()
  }

  return (
    <div>
      <div className="relative flex gap-1 rounded-full bg-lime/10 p-1">
        {MODES.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => switchMode(tab.id)}
            aria-pressed={mode === tab.id}
            className="relative min-h-11 flex-1 rounded-full px-2 text-sm font-semibold"
          >
            {mode === tab.id && (
              <motion.span
                layoutId="auth-tab-bg"
                className="absolute inset-0 rounded-full bg-leaf"
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${mode === tab.id ? 'text-cream' : 'text-secondary'}`}>{tab.label}</span>
          </button>
        ))}
      </div>

      {formError && (
        <p role="alert" className="mt-4 rounded-2xl bg-tomato/10 px-4 py-3 text-sm text-soil">
          {formError}
        </p>
      )}

      {mode === 'login' ? (
        <form onSubmit={handleLogin} noValidate className="mt-6 flex flex-col gap-6">
          <Field id="login-mobile" label="Mobile number" error={errors.mobile}>
            <MobileInput
              id="login-mobile"
              value={mobile}
              onChange={(value) => {
                setMobile(value)
                setErrors({})
              }}
              error={errors.mobile}
              autoFocus
            />
          </Field>
          <Button type="submit" className="w-full">
            {intent === 'subscribe' ? 'Log in & subscribe' : 'Log in'}
          </Button>
          <p className="text-center text-sm text-secondary">
            New to Freshley?{' '}
            <button type="button" onClick={() => switchMode('signup')} className="font-semibold text-leaf hover:underline">
              Create an account
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignup} noValidate className="mt-6 flex flex-col gap-6">
          <ProfileFields idPrefix="signup" profile={profile} onChange={setProfile} errors={errors} />
          <Button type="submit" className="w-full">
            {intent === 'subscribe' ? 'Sign up & subscribe' : 'Create account'}
          </Button>
          <p className="text-center text-sm text-secondary">
            Already with us?{' '}
            <button type="button" onClick={() => switchMode('login')} className="font-semibold text-leaf hover:underline">
              Log in
            </button>
          </p>
        </form>
      )}
    </div>
  )
}

function AuthSheet() {
  const { open, mode, intent } = useAuthSheet()
  const combo = useComboBuilder()
  const reduceMotion = useReducedMotion()
  const returnFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    returnFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape') closeAuthSheet()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      returnFocusRef.current?.focus?.()
    }
  }, [open])

  const subscribing = intent === 'subscribe' && combo.isComplete

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-soil/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={closeAuthSheet}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 48 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-2xl bg-cream px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 shadow-lift sm:max-w-md sm:rounded-2xl sm:px-8 sm:pb-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="auth-title" className="font-heading text-2xl font-semibold text-soil">
                  {subscribing ? 'One step to subscribe' : 'Welcome to Freshley'}
                </h2>
                <p className="mt-1 text-sm text-secondary">
                  {subscribing
                    ? `Your basket of ${combo.selectedItems.length} ${combo.selectedItems.length === 1 ? 'item' : 'items'} for every ${combo.state.deliveryDay} is saved. Log in or sign up to subscribe.`
                    : 'Log in or sign up to manage your weekly basket.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAuthSheet}
                aria-label="Close"
                className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl text-secondary transition-colors hover:bg-lime/20 hover:text-soil"
              >
                ×
              </button>
            </div>
            <AuthForm key={`${mode}-${intent}`} initialMode={mode} intent={intent} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AuthSheet
