import { motion } from 'motion/react'
import { useRevealVariants } from '../hooks/useRevealVariants'

const viewport = { once: true, amount: 0.15 }

export function Reveal({ className, children }) {
  const { item } = useRevealVariants()
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={viewport} variants={item}>
      {children}
    </motion.div>
  )
}

export function RevealGroup({ className, stagger, children }) {
  const { group } = useRevealVariants(stagger)
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={viewport} variants={group}>
      {children}
    </motion.div>
  )
}

export function RevealItem({ className, children }) {
  const { item } = useRevealVariants()
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}
