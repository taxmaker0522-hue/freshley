function BasketIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Basket of fresh vegetables">
      <defs>
        <linearGradient id="basket-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a7743f" />
          <stop offset="1" stopColor="#6f4525" />
        </linearGradient>
      </defs>

      <path d="M120 170 C130 70 270 70 280 170" fill="none" stroke="#6f4525" strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="200" cy="264" rx="124" ry="14" fill="#2b2118" opacity="0.12" />

      <path d="M118 178 c-30 -40 -10 -80 30 -84 c-4 34 4 60 -30 84z" fill="#3f8f3a" />
      <path d="M124 176 c20 -34 26 -54 24 -78" stroke="#2f7d32" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="156" cy="152" rx="28" ry="40" fill="#5b3a7a" transform="rotate(-18 156 152)" />
      <path d="M166 112 l-14 10 4 -14z" fill="#2f7d32" />
      <circle cx="214" cy="154" r="36" fill="#e4572e" />
      <path d="M214 116 l-10 10 10 -3 10 3z" fill="#2f7d32" />
      <path d="M262 192 L288 100 L304 192z" fill="#e8792b" />
      <path d="M288 100 l-14 -20 8 2 6 -14 6 14 8 -2z" fill="#4fa832" />
      <ellipse cx="240" cy="176" rx="26" ry="24" fill="#4a9b2f" />
      <rect x="237" y="146" width="6" height="12" rx="3" fill="#2f7d32" />

      <path d="M92 170 L308 170 L284 264 L116 264z" fill="url(#basket-body)" />
      <g fill="none" stroke="#6f4525" strokeWidth="3" opacity="0.45">
        <path d="M100 196 Q200 208 300 196" />
        <path d="M106 220 Q200 232 294 220" />
        <path d="M112 244 Q200 254 288 244" />
      </g>
      <g fill="none" stroke="#6f4525" strokeWidth="3" opacity="0.3">
        <path d="M140 170 L150 264" />
        <path d="M170 170 L175 264" />
        <path d="M200 170 L200 264" />
        <path d="M230 170 L225 264" />
        <path d="M260 170 L250 264" />
      </g>
      <ellipse cx="200" cy="170" rx="112" ry="16" fill="#8a5a34" stroke="#6f4525" strokeWidth="6" />
    </svg>
  )
}

export default BasketIllustration
