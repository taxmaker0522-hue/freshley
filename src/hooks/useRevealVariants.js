import { useReducedMotion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1]

export function useRevealVariants(stagger = 0.08) {
  const reduceMotion = useReducedMotion()
  return {
    group: { hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : stagger } } },
    item: {
      hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease } },
    },
  }
}
