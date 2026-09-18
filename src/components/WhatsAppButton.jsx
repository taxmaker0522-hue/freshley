import { motion, useReducedMotion } from 'motion/react'
import { useComboBuilder } from '../hooks/useComboBuilder'
import { useMiniCartVisible } from '../hooks/useMiniCart'
import { buildBoxMessage, buildGenericMessage, waLink } from '../utils/whatsapp'

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.8L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.13h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2Zm0 1.8c2.15 0 4.17.83 5.68 2.35a7.98 7.98 0 0 1 2.36 5.76c0 4.47-3.64 8.11-8.05 8.11a8 8 0 0 1-4.09-1.12l-.29-.17-3.03.76.8-2.95-.19-.3a7.99 7.99 0 0 1-1.24-4.31c0-4.47 3.65-8.13 8.05-8.13Z" />
    </svg>
  )
}

function WhatsAppButton() {
  const reduceMotion = useReducedMotion()
  const combo = useComboBuilder()
  const miniCartVisible = useMiniCartVisible()

  const message = combo.selectedItems.length > 0 ? buildBoxMessage(combo) : buildGenericMessage()

  return (
    <motion.a
      href={waLink(message)}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat with us on WhatsApp"
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: reduceMotion ? 0 : 0.6 }}
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      style={{ '--wa-bottom': miniCartVisible ? '5.75rem' : '1rem' }}
      className="fixed right-4 bottom-[calc(var(--wa-bottom)+env(safe-area-inset-bottom))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition-[bottom] duration-300 lg:right-6 lg:bottom-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </motion.a>
  )
}

export default WhatsAppButton
