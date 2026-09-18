import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Blob from '../components/Blob'
import Button from '../components/Button'
import { Reveal } from '../components/Reveal'
import Section from '../components/Section'
import { servicePincodes } from '../data/pincodes'

const PINCODE_REGEX = /^[1-9][0-9]{5}$/

const inputClass =
  'min-h-12 flex-1 rounded-2xl border border-leaf/25 bg-surface px-4 py-3 text-base text-soil placeholder:text-muted focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/30'

function DeliveryCheck() {
  const [pincode, setPincode] = useState('')
  const [status, setStatus] = useState('idle')
  const [notifyValue, setNotifyValue] = useState('')
  const [notifySent, setNotifySent] = useState(false)
  const reduceMotion = useReducedMotion()

  function handleCheck(event) {
    event.preventDefault()
    if (!PINCODE_REGEX.test(pincode)) {
      setStatus('invalid')
      return
    }
    setStatus(servicePincodes.includes(pincode) ? 'available' : 'unavailable')
    setNotifySent(false)
  }

  function handleNotify(event) {
    event.preventDefault()
    if (!notifyValue.trim()) return
    setNotifySent(true)
  }

  return (
    <Section
      id="delivery-check"
      width="narrow"
      eyebrow="Delivery areas"
      title="Do we deliver to you?"
      intro="Enter your pincode and find out in a second."
    >
      <Blob from="lg" className="-right-40 top-1/2 h-80 w-80 -translate-y-1/2" />
      <Reveal className="text-center">
      <form onSubmit={handleCheck} className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={pincode}
          onChange={(event) => {
            setPincode(event.target.value.replace(/\D/g, '').slice(0, 6))
            setStatus('idle')
          }}
          placeholder="Pincode, e.g. 500034"
          aria-label="Pincode"
          className={inputClass}
        />
        <Button type="submit">Check</Button>
      </form>

      <AnimatePresence mode="wait">
        {status === 'invalid' && (
          <motion.p
            key="invalid"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-sm font-medium text-error"
          >
            Enter a valid 6-digit pincode.
          </motion.p>
        )}

        {status === 'available' && (
          <motion.div
            key="available"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-2xl border border-success/25 bg-success/10 px-6 py-5 shadow-soft"
          >
            <p className="font-heading text-lg font-semibold text-success">
              Yes! We deliver to {pincode} by 8 am.
            </p>
          </motion.div>
        )}

        {status === 'unavailable' && (
          <motion.div
            key="unavailable"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-2xl border border-error/20 bg-error/5 px-6 py-6 shadow-soft"
          >
            <p className="text-center text-sm text-secondary">
              We&rsquo;re not in <span className="font-semibold text-soil">{pincode}</span> yet
              — but we&rsquo;re expanding fast.
            </p>

            {notifySent ? (
              <p className="mt-4 text-center text-sm font-semibold text-success">
                Thanks! We&rsquo;ll let you know the moment we reach you.
              </p>
            ) : (
              <form onSubmit={handleNotify} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={notifyValue}
                  onChange={(event) => setNotifyValue(event.target.value)}
                  placeholder="Email or WhatsApp number"
                  aria-label="Email or WhatsApp number"
                  className={inputClass}
                />
                <Button type="submit" variant="secondary">
                  Notify me
                </Button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </Reveal>
    </Section>
  )
}

export default DeliveryCheck
