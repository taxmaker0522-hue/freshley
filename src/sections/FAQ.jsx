import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { faqs } from '../data/faqs'

function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function FAQItem({ faq, isOpen, onToggle }) {
  const reduceMotion = useReducedMotion()
  const panelId = `faq-panel-${faq.id}`
  const buttonId = `faq-button-${faq.id}`

  return (
    <div className="border-b border-leaf/15">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-11 w-full items-center justify-between gap-4 py-5 text-left"
        >
          <span className="font-heading text-base font-semibold text-soil sm:text-lg">
            {faq.question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime/20 text-leaf"
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-base leading-relaxed text-secondary">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQ() {
  const [openId, setOpenId] = useState(faqs[0].id)

  return (
    <section id="faq" className="scroll-mt-24 mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-semibold text-soil sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>

      <div className="mt-10">
        {faqs.map((faq) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() => setOpenId((current) => (current === faq.id ? null : faq.id))}
          />
        ))}
      </div>
    </section>
  )
}

export default FAQ
