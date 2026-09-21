import { motion, useReducedMotion } from 'motion/react'
import ProduceGlyph from './ProduceGlyph'

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12l5 5 9-9" />
    </svg>
  )
}

function ProduceCard({ item, selected, disabled, shake, onToggle }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={() => onToggle(item.id)}
      aria-pressed={selected}
      aria-disabled={disabled}
      animate={shake && !reduceMotion ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      whileTap={disabled || reduceMotion ? undefined : { scale: 0.96 }}
      className={`relative flex min-h-11 flex-col items-center gap-1.5 rounded-2xl border p-4 text-center transition-[background-color,border-color,box-shadow,transform] duration-200 ${
        selected
          ? 'scale-[1.02] border-transparent bg-lime/15 shadow-soft ring-2 ring-leaf'
          : 'border-leaf/15 bg-surface hover:border-leaf/40 hover:shadow-soft'
      } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {item.seasonal && (
        <span className="absolute left-2 top-2 rounded-full bg-lime/30 px-2 py-0.5 text-xs font-semibold text-leaf">
          Seasonal
        </span>
      )}

      {selected && (
        <motion.span
          initial={reduceMotion ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-leaf text-cream"
        >
          <CheckIcon className="h-3 w-3" />
        </motion.span>
      )}

      <span className="mt-3">
        <ProduceGlyph item={item} />
      </span>
      <span className="text-sm font-semibold text-soil">{item.name}</span>
      <span className="text-xs text-secondary">
        {item.regionalName.te} · {item.regionalName.hi}
      </span>
    </motion.button>
  )
}

export default ProduceCard
