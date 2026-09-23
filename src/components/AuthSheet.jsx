import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Button from './Button'
import ProfileFields from './ProfileFields'
import { EMPTY_PROFILE, cleanProfile, validateProfile } from '../utils/profile'
import {
  closeAuthSheet,
  saveProfile,
  saveSubscription,
  signInWithGoogle,
  takePendingIntent,
  useAuth,
  useAuthSheet,
} from '../hooks/useAuth'
import { useComboBuilder } from '../hooks/useComboBuilder'
import { ADMIN_HASH, DASHBOARD_HASH, goTo, useRoute } from '../hooks/useRoute'

function GoogleLogo(props) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

function SignInStep({ intent, unconfigured }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function handleGoogle() {
    setBusy(true)
    setError(null)
    const failed = await signInWithGoogle(intent)
    // On success the browser leaves for Google, so only failures land here.
    if (failed) {
      setError(failed)
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy || unconfigured}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-soil/20 bg-white px-6 text-base font-semibold text-soil shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lift disabled:pointer-events-none disabled:opacity-50"
      >
        <GoogleLogo className="h-5 w-5" />
        {busy ? 'Opening Google…' : 'Continue with Google'}
      </button>
      {error && (
        <p role="alert" className="text-center text-sm text-error">
          {error}
        </p>
      )}
      <p className="text-center text-sm text-secondary">
        {unconfigured
          ? 'Sign-in isn’t switched on yet. Please order on WhatsApp for now.'
          : 'New or returning, it’s the same button. Next, we’ll ask for your mobile number and delivery address.'}
      </p>
    </div>
  )
}

function ProfileStep({ intent, suggestedName }) {
  const [profile, setProfile] = useState({ ...EMPTY_PROFILE, name: suggestedName })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const found = validateProfile(profile)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      form.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    setBusy(true)
    setFormError(null)
    const failed = await saveProfile(cleanProfile(profile))
    setBusy(false)
    if (failed) setFormError(failed)
    // Success flips the account to 'ready'; AuthSheet then finishes the intent.
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {formError && (
        <p role="alert" className="rounded-2xl bg-tomato/10 px-4 py-3 text-sm text-soil">
          {formError}
        </p>
      )}
      <ProfileFields idPrefix="signup" profile={profile} onChange={setProfile} errors={errors} />
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? 'Saving…' : intent === 'subscribe' ? 'Save & subscribe' : 'Save & continue'}
      </Button>
    </form>
  )
}

function AuthSheet() {
  const sheet = useAuthSheet()
  const auth = useAuth()
  const route = useRoute()
  const combo = useComboBuilder()
  const reduceMotion = useReducedMotion()
  const returnFocusRef = useRef(null)
  const [profileDismissed, setProfileDismissed] = useState(false)

  // Signed in but no mobile/address yet: ask for them (admins are exempt).
  const needsProfile = auth.status === 'needsProfile' && !auth.isAdmin && route !== 'admin'
  const open = (sheet.open && auth.status !== 'ready') || (needsProfile && !profileDismissed)
  const intent = sheet.open ? sheet.intent : takePendingIntent({ keep: true }) || 'account'

  // Sign-in finished (returning from Google, or profile just saved): do what the
  // visitor was trying to do.
  const { status } = auth
  const { basket, isComplete } = combo
  useEffect(() => {
    if (status !== 'ready') return
    const pending = takePendingIntent() || (sheet.open ? sheet.intent : null)
    if (sheet.open) closeAuthSheet()
    if (!pending) return
    if (pending === 'admin') {
      goTo(ADMIN_HASH)
      return
    }
    ;(async () => {
      if (pending === 'subscribe' && isComplete) await saveSubscription(basket)
      goTo(DASHBOARD_HASH)
      window.scrollTo({ top: 0 })
    })()
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return undefined
    returnFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      returnFocusRef.current?.focus?.()
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function close() {
    if (needsProfile) setProfileDismissed(true)
    closeAuthSheet()
  }

  const subscribing = intent === 'subscribe' && combo.isComplete
  const itemCount = combo.selectedItems.length
  const title = needsProfile ? 'Almost there' : subscribing ? 'One step to subscribe' : 'Welcome to Freshley'
  const intro = needsProfile
    ? 'Where should we deliver your basket?'
    : subscribing
      ? `Your basket of ${itemCount} ${itemCount === 1 ? 'item' : 'items'} for every ${combo.state.deliveryDay} is saved. Sign in to subscribe.`
      : 'Sign in to manage your weekly basket.'

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
            onClick={close}
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
                  {title}
                </h2>
                <p className="mt-1 text-sm text-secondary">{intro}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl text-secondary transition-colors hover:bg-lime/20 hover:text-soil"
              >
                ×
              </button>
            </div>
            {needsProfile ? (
              <ProfileStep intent={intent} suggestedName={auth.user?.user_metadata?.full_name ?? ''} />
            ) : (
              <SignInStep intent={intent} unconfigured={auth.status === 'unconfigured'} />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AuthSheet
