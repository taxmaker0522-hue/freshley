const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[transform,box-shadow,background-color,color,border-color] duration-200 aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary:
    'bg-tomato-deep text-white shadow-soft hover:-translate-y-0.5 hover:bg-tomato-dark hover:shadow-lift active:translate-y-0 active:scale-[0.98]',
  secondary:
    'border-2 border-leaf text-leaf hover:-translate-y-0.5 hover:bg-leaf/10 active:translate-y-0 active:scale-[0.98]',
  ghost: 'border border-leaf/25 bg-surface text-leaf hover:border-leaf hover:bg-leaf hover:text-cream',
}

const toggle = {
  on: 'bg-leaf text-cream',
  off: 'border border-leaf/25 text-secondary hover:border-leaf hover:text-leaf',
}

const sizes = {
  sm: 'min-h-11 px-4 text-sm',
  md: 'min-h-12 px-6 text-base',
}

function Button({ variant = 'primary', size = 'md', selected, href, className = '', children, ...props }) {
  const look = variant === 'toggle' ? (selected ? toggle.on : toggle.off) : variants[variant]
  const classes = `${base} ${look} ${sizes[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
