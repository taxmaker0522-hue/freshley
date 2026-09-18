import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useComboBuilder } from '../hooks/useComboBuilder'
import { setMiniCartVisible } from '../hooks/useMiniCart'
import Button from './Button'

function useOnScreen(selector) {
  const [onScreen, setOnScreen] = useState(false)

  useEffect(() => {
    const targets = document.querySelectorAll(selector)
    if (targets.length === 0) return undefined

    const seen = new Map()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => seen.set(entry.target, entry.isIntersecting))
      setOnScreen([...seen.values()].some(Boolean))
    })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [selector])

  return onScreen
}

function MiniCartBar() {
  const { selectedItems, pricePerDay } = useComboBuilder()
  const summaryOnScreen = useOnScreen('[data-combo-summary]')
  const footerOnScreen = useOnScreen('footer')
  const reduceMotion = useReducedMotion()

  const visible = selectedItems.length > 0 && !summaryOnScreen && !footerOnScreen

  useEffect(() => {
    setMiniCartVisible(visible)
    return () => setMiniCartVisible(false)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduceMotion ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: 80, opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 lg:hidden"
        >
          <div className="flex items-center justify-between gap-3 rounded-full border border-leaf/15 bg-surface py-2 pl-5 pr-2 shadow-lift">
            <p className="flex items-center gap-2 text-sm">
              <span className="font-emoji" aria-hidden="true">
                🧺
              </span>
              <span className="font-semibold text-soil">
                {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
              </span>
              <span className="text-secondary">· ₹{pricePerDay}/day</span>
            </p>
            <Button href="#combo-summary" size="sm">
              Review box
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MiniCartBar
