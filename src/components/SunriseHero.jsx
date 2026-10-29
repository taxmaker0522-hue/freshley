import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

// The animated hero scene, ported from the verified "Bobobay Sunrise Hero"
// motion concept (same engine, same choreography, same 21 s loop). Mounted
// imperatively rather than as JSX: the animation addresses elements by id and
// drives every frame by setting SVG attributes directly via requestAnimationFrame,
// the same technique a hand-built Lottie-style loop uses. React never
// manages this subtree's children — it only owns the container div.
//
// Brand-system note: the original concept used Bricolage Grotesque + Figtree.
// Swapped to Fraunces + Inter below so the hero doesn't introduce a third and
// fourth typeface outside the site's own type system.
const STAGE_SVG = `<svg viewBox="0 0 1920 1080" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="gDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7C292"/><stop offset=".6" stop-color="#FBE2C2"/><stop offset="1" stop-color="#FCEFDC"/></linearGradient>
  <linearGradient id="gDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6E5D7"/><stop offset=".6" stop-color="#E4F2E6"/><stop offset="1" stop-color="#F2F7EC"/></linearGradient>
  <radialGradient id="gTom" cx="38%" cy="34%" r="72%"><stop offset="0" stop-color="#FF7E5F"/><stop offset=".55" stop-color="#E23B22"/><stop offset="1" stop-color="#A31E12"/></radialGradient>
  <linearGradient id="gCar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFAA4A"/><stop offset="1" stop-color="#E5671B"/></linearGradient>
  <linearGradient id="gOkra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8ACB62"/><stop offset="1" stop-color="#3D8634"/></linearGradient>
  <linearGradient id="gCap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8ACB62"/><stop offset="1" stop-color="#2F7A3A"/></linearGradient>
  <filter id="wilt"><feColorMatrix id="wiltM" type="saturate" values="1"/></filter>
  <clipPath id="hillClip"><path d="M0 800 Q480 700 960 724 T1920 776 L1920 1080 L0 1080Z"/></clipPath>
  <symbol id="tomato" viewBox="-50 -50 100 100" overflow="visible">
    <ellipse cx="0" cy="4" rx="44" ry="40" fill="url(#gTom)"/>
    <ellipse cx="-16" cy="-10" rx="11" ry="6" fill="#fff" opacity=".35" transform="rotate(-32 -16 -10)"/>
    <path d="M0 -34 L6 -44 L8 -32 L20 -36 L10 -27 L18 -20 L4 -24 L0 -14 L-4 -24 L-18 -20 L-10 -27 L-20 -36 L-8 -32 L-6 -44Z" fill="#2F7A3A"/>
  </symbol>
  <symbol id="carrot" viewBox="-50 -50 100 100" overflow="visible">
    <g transform="rotate(-32)">
      <path d="M0 -28 Q-14 -48 -12 -50 Q-2 -42 0 -32 Q4 -50 13 -48 Q8 -38 2 -30" fill="#3C8C3F"/>
      <path d="M-12 -26 Q0 -32 13 -26 L3 44 Q0 50 -3 44Z" fill="url(#gCar)"/>
      <path d="M-8 -8 L2 -8 M-6 10 L3 10 M-4 26 L2 26" stroke="#C4561A" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>
    </g>
  </symbol>
  <symbol id="bhindi" viewBox="-50 -50 100 100" overflow="visible">
    <g transform="rotate(-35)">
      <path d="M0 -42 Q14 -20 11 18 Q7 40 0 47 Q-7 40 -11 18 Q-14 -20 0 -42Z" fill="url(#gOkra)"/>
      <path d="M0 -38 Q4 0 0 44" stroke="#2E6B2A" stroke-width="2" fill="none" opacity=".55"/>
      <path d="M-5 -42 L5 -42 L3 -50 L-3 -50Z" fill="#4A7A35"/>
    </g>
  </symbol>
  <symbol id="curry" viewBox="-50 -50 100 100" overflow="visible">
    <path d="M2 48 Q4 0 -2 -46" stroke="#4E6B30" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g fill="#2E7D3A">
      <ellipse cx="-11" cy="-34" rx="10" ry="4.5" transform="rotate(-28 -11 -34)"/>
      <ellipse cx="11" cy="-24" rx="10" ry="4.5" transform="rotate(28 11 -24)" fill="#3D9748"/>
      <ellipse cx="-11" cy="-12" rx="10" ry="4.5" transform="rotate(-28 -11 -12)"/>
      <ellipse cx="12" cy="0" rx="10" ry="4.5" transform="rotate(28 12 0)" fill="#3D9748"/>
      <ellipse cx="-10" cy="12" rx="10" ry="4.5" transform="rotate(-28 -10 12)"/>
      <ellipse cx="13" cy="24" rx="10" ry="4.5" transform="rotate(28 13 24)" fill="#3D9748"/>
      <ellipse cx="-3" cy="-48" rx="4" ry="8"/>
    </g>
  </symbol>
  <symbol id="coriander" viewBox="-50 -50 100 100" overflow="visible">
    <path d="M0 48 Q-4 10 -20 -18 M0 48 Q2 6 4 -30 M0 48 Q6 12 22 -14" stroke="#4E8A36" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g fill="#5AAE4A"><circle cx="-22" cy="-24" r="10"/><circle cx="-12" cy="-30" r="8"/><circle cx="4" cy="-36" r="11"/><circle cx="14" cy="-28" r="8"/><circle cx="24" cy="-20" r="10"/></g>
    <g fill="#46973A"><circle cx="-28" cy="-16" r="7"/><circle cx="-4" cy="-26" r="7"/><circle cx="28" cy="-10" r="7"/></g>
  </symbol>
  <symbol id="capsicum" viewBox="-50 -50 100 100" overflow="visible">
    <path d="M-2 -32 Q-28 -26 -32 2 Q-34 34 -6 42 Q0 44 6 42 Q34 34 32 2 Q28 -26 -2 -32Z" fill="url(#gCap)"/>
    <ellipse cx="-12" cy="-10" rx="8" ry="14" fill="#fff" opacity=".3" transform="rotate(-18 -12 -10)"/>
    <path d="M-2 -32 Q-4 -44 2 -48 Q8 -44 4 -34" fill="#2F7A3A"/>
    <path d="M-6 -36 L10 -36" stroke="#2F7A3A" stroke-width="4" stroke-linecap="round"/>
  </symbol>
  <symbol id="leaf" viewBox="-30 -15 60 30" overflow="visible">
    <ellipse cx="0" cy="0" rx="24" ry="9" fill="#3B8C45"/>
    <path d="M-22 0 L22 0" stroke="#2A6A33" stroke-width="1.6"/>
  </symbol>
  <symbol id="basketBack" viewBox="-100 -70 200 140" overflow="visible">
    <path d="M-72 -26 Q0 -112 72 -26" stroke="#8A5A2B" stroke-width="9" fill="none" stroke-linecap="round"/>
  </symbol>
  <symbol id="basketFront" viewBox="-100 -70 200 140" overflow="visible">
    <path d="M-90 -22 L90 -22 L70 60 L-70 60Z" fill="#C98B4E" stroke="#8A5A2B" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-86 0 L86 0 M-80 22 L80 22 M-75 42 L75 42" stroke="#A86F38" stroke-width="4"/>
    <path d="M-50 -22 L-42 60 M-15 -22 L-12 60 M15 -22 L12 60 M50 -22 L42 60" stroke="#A86F38" stroke-width="3" opacity=".7"/>
    <rect x="-97" y="-32" width="194" height="16" rx="8" fill="#A86F38"/>
  </symbol>
</defs>
<rect width="1920" height="1080" fill="url(#gDawn)"/>
<rect id="day" width="1920" height="1080" fill="url(#gDay)" opacity="0"/>
<g id="ambient"></g>
<g id="s1" opacity="0"><g id="cam1">
  <g id="rays" fill="none" stroke="#E9A21B" stroke-width="5"></g>
  <g id="sun"><use href="#tomato" x="-160" y="-160" width="320" height="320"/></g>
  <g id="field">
    <path d="M0 770 Q600 670 1200 726 T1920 706 L1920 1080 L0 1080Z" fill="#A7CE84"/>
    <path d="M0 800 Q480 700 960 724 T1920 776 L1920 1080 L0 1080Z" fill="#79B05B"/>
    <g clip-path="url(#hillClip)" stroke="#5C9646" stroke-width="12" opacity=".6" id="rows"></g>
  </g>
  <g id="h1"></g>
</g></g>
<g id="s2" opacity="0"><g id="cam2">
  <g id="h2"></g>
  <g id="clock">
    <circle r="170" fill="#FFFDF6" stroke="#183824" stroke-width="12"/>
    <g id="ticks" stroke="#183824" stroke-width="6" stroke-linecap="round"></g>
    <line id="hourHand" x1="0" y1="0" x2="0" y2="-82" stroke="#183824" stroke-width="14" stroke-linecap="round"/>
    <line id="minHand" x1="0" y1="0" x2="0" y2="-128" stroke="#D23F27" stroke-width="9" stroke-linecap="round"/>
    <circle r="12" fill="#183824"/>
    <text id="clockLabel" y="250" text-anchor="middle" font-family="'Fraunces',serif" font-weight="700" font-size="64" fill="#183824">6:15 AM</text>
  </g>
  <g id="crate">
    <g filter="url(#wilt)">
      <use href="#tomato" x="-205" y="-120" width="130" height="130"/>
      <use href="#bhindi" x="-75" y="-118" width="130" height="130"/>
      <g id="droop"><use href="#coriander" x="60" y="-150" width="160" height="160"/></g>
    </g>
    <rect x="-230" y="-10" width="460" height="200" rx="10" fill="#B47A43" stroke="#7E5128" stroke-width="5"/>
    <path d="M-230 55 L230 55 M-230 120 L230 120" stroke="#7E5128" stroke-width="5"/>
    <path d="M-160 -10 L-160 190 M0 -10 L0 190 M160 -10 L160 190" stroke="#9A6534" stroke-width="4" opacity=".6"/>
  </g>
</g></g>
<g id="s3" opacity="0">
  <g id="side3"></g>
  <g id="counter3">
    <text x="1540" y="380" text-anchor="middle" font-family="'Inter',sans-serif" font-weight="600" font-size="34" fill="#3F5C47">Your weekly basket</text>
    <text id="count" x="1540" y="600" text-anchor="middle" font-family="'Fraunces',serif" font-weight="800" font-size="230" fill="#D23F27">0</text>
    <text x="1540" y="670" text-anchor="middle" font-family="'Inter',sans-serif" font-weight="600" font-size="44" fill="#183824">items</text>
  </g>
  <g id="cam3"><g id="phone">
    <rect x="-250" y="-440" width="500" height="880" rx="60" fill="#183824"/>
    <rect x="-236" y="-426" width="472" height="852" rx="48" fill="#FBFDF8"/>
    <rect x="-60" y="-414" width="120" height="22" rx="11" fill="#183824"/>
    <text x="0" y="-338" text-anchor="middle" font-family="'Fraunces',serif" font-weight="700" font-size="40" fill="#183824">Your weekly basket</text>
    <g id="chips"></g>
    <g id="basket3">
      <use href="#basketBack" x="-110" y="83" width="220" height="154"/>
      <g id="items3"></g>
      <use href="#basketFront" x="-110" y="83" width="220" height="154"/>
    </g>
    <g id="btn3">
      <rect id="btnRect" x="-190" y="-44" width="380" height="88" rx="44" fill="#1F6B3A"/>
      <text id="btnText" y="12" text-anchor="middle" font-family="'Inter',sans-serif" font-weight="600" font-size="32" fill="#FFFFFF">Subscribe weekly</text>
    </g>
    <circle id="ripple" r="20" fill="none" stroke="#183824" stroke-width="4" opacity="0"/>
    <g id="cursor" opacity="0"><circle r="28" fill="#183824" fill-opacity=".22" stroke="#FFFFFF" stroke-width="5"/><circle r="8" fill="#183824"/></g>
  </g></g>
</g>
<g id="s4" opacity="0"><g id="cam4">
  <g id="h4"></g>
  <g id="week"></g>
  <path id="route" d="M330 820 C640 1000, 900 560, 1180 700 S1480 790, 1560 772" fill="none" stroke="#1F6B3A" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 22"/>
  <path id="routeMask" d="M330 820 C640 1000, 900 560, 1180 700 S1480 790, 1560 772" fill="none" stroke="none"/>
  <g id="farm">
    <path d="M-150 40 Q0 -60 150 40Z" fill="#79B05B"/>
    <use href="#curry" x="-80" y="-120" width="90" height="120"/>
    <use href="#coriander" x="-10" y="-110" width="90" height="110"/>
    <use href="#carrot" x="55" y="-60" width="70" height="80"/>
    <text y="100" text-anchor="middle" font-family="'Inter',sans-serif" font-weight="600" font-size="34" fill="#183824">Farm</text>
  </g>
  <g id="door">
    <rect x="-170" y="-300" width="340" height="380" rx="6" fill="#F4E7D2" stroke="#C9B08C" stroke-width="4"/>
    <rect x="-78" y="-232" width="156" height="312" rx="8" fill="#2F6E4A"/>
    <rect x="-60" y="-212" width="120" height="120" rx="6" fill="none" stroke="#24583A" stroke-width="5"/>
    <rect x="-60" y="-72" width="120" height="132" rx="6" fill="none" stroke="#24583A" stroke-width="5"/>
    <circle cx="52" cy="-30" r="8" fill="#E9A21B"/>
    <rect x="-110" y="80" width="220" height="22" rx="4" fill="#C9B08C"/>
    <text y="150" text-anchor="middle" font-family="'Inter',sans-serif" font-weight="600" font-size="34" fill="#183824">Your door</text>
  </g>
  <g id="travel">
    <use href="#basketBack" x="-90" y="-126" width="180" height="126"/>
    <use href="#tomato" x="-62" y="-118" width="54" height="54"/>
    <use href="#carrot" x="-22" y="-128" width="56" height="56"/>
    <use href="#curry" x="18" y="-140" width="46" height="66"/>
    <use href="#capsicum" x="-10" y="-112" width="60" height="50"/>
    <use href="#basketFront" x="-90" y="-126" width="180" height="126"/>
    <g id="check"><circle cx="80" cy="-110" r="34" fill="#1F6B3A"/><path d="M64 -110 L76 -98 L98 -122" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
  </g>
</g></g>
<g id="s5" opacity="0"><g id="cam5">
  <g id="mark"><use href="#tomato" x="-80" y="-80" width="160" height="160"/></g>
  <g id="word"></g>
  <g id="tag5"></g>
  <g id="cta">
    <rect x="-280" y="-54" width="560" height="108" rx="54" fill="#D23F27"/>
    <text y="14" text-anchor="middle" font-family="'Inter',sans-serif" font-weight="600" font-size="40" fill="#FFFFFF">Start your weekly basket</text>
  </g>
</g></g>
</svg>`

function runEngine(root, reduceMotion) {
  let cancelled = false
  let raf = null
  const NS = 'http://www.w3.org/2000/svg'
  const $ = (id) => root.querySelector('#' + id)
  const DISPLAY = "'Fraunces',serif"
  const CTOTAL = 900
  const FPS = 60
  const SCALE = 1.4 // matches the reviewed 21 s concept (CTOTAL * SCALE = 1260 real frames)
  const TOTAL = Math.round(CTOTAL * SCALE)
  const INK = '#183824'
  const LEAF = '#1F6B3A'

  const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
  const lin = (f, a, b) => clamp((f - a) / (b - a), 0, 1)
  const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
  const eout = (t) => 1 - (1 - t) ** 3
  const ein = (t) => t * t * t
  const back = (t) => {
    const c1 = 1.5
    const c3 = c1 + 1
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
  }
  const mix = (a, b, t) => a + (b - a) * t
  const bump = (f, s, d) => {
    const t = (f - s) / d
    return t > 0 && t < 1 ? Math.sin(Math.PI * t) : 0
  }
  const set = (el, k, v) => el.setAttribute(k, v)
  function cam(el, s, tx, ty) {
    set(el, 'transform', `translate(${960 + (tx || 0)} ${540 + (ty || 0)}) scale(${s}) translate(-960 -540)`)
  }
  function mk(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag)
    for (const k in attrs) e.setAttribute(k, attrs[k])
    if (parent) parent.appendChild(e)
    return e
  }

  function layout(group, text, cx, y, size, weight, fill, split) {
    const parts = split === '' ? text.split('') : text.split(' ')
    const els = parts.map((p) => {
      const t = mk('text', { y, 'font-size': size, 'font-weight': weight, fill, 'font-family': DISPLAY }, group)
      t.textContent = p
      return t
    })
    const space = split === '' ? 0 : size * 0.26
    const w = els.map((e) => e.getComputedTextLength())
    const total = w.reduce((a, b) => a + b, 0) + space * (els.length - 1)
    let x = cx - total / 2
    els.forEach((e, i) => {
      set(e, 'x', x)
      x += w[i] + space
    })
    els.total = total
    return els
  }
  function wordsIn(els, f, start, stagger, rise) {
    els.forEach((e, i) => {
      const s = start + i * stagger
      const p = back(lin(f, s, s + 30))
      set(e, 'transform', `translate(0 ${(rise || 40) * (1 - p)})`)
      set(e, 'opacity', lin(f, s, s + 12))
    })
  }

  const rows = $('rows')
  for (let i = -6; i <= 14; i += 1) mk('line', { x1: 960, y1: 700, x2: -1200 + i * 240, y2: 1080 }, rows)
  const rays = [0, 1, 2].map(() => mk('circle', { cx: 960, cy: 0, r: 180 }, $('rays')))
  const ticks = $('ticks')
  for (let i = 0; i < 12; i += 1) {
    const a = (i * Math.PI) / 6
    mk('line', { x1: Math.sin(a) * 140, y1: -Math.cos(a) * 140, x2: Math.sin(a) * (i % 3 ? 150 : 126), y2: -Math.cos(a) * (i % 3 ? 150 : 126) }, ticks)
  }
  const leaves = [
    { x: 170, y: 190, k: 1, p: 0, ax: 30, ay: 24, r: -20, s: 1.4 },
    { x: 1760, y: 210, k: 2, p: 1.3, ax: 24, ay: 30, r: 30, s: 1.1 },
    { x: 1500, y: 120, k: 1, p: 2.6, ax: 36, ay: 18, r: -50, s: 0.9 },
    { x: 1790, y: 930, k: 2, p: 4.1, ax: 26, ay: 22, r: 15, s: 1.2 },
    { x: 120, y: 600, k: 1, p: 5.0, ax: 20, ay: 34, r: 60, s: 1 },
  ]
  leaves.forEach((L) => {
    L.el = mk('use', { href: '#leaf', x: -30, y: -15, width: 60, height: 30, opacity: 0.55 }, $('ambient'))
  })

  const CHIPS = [
    ['tomato', 'Tomato'],
    ['carrot', 'Carrot'],
    ['bhindi', 'Bhindi'],
    ['curry', 'Curry leaves'],
    ['coriander', 'Coriander'],
    ['capsicum', 'Capsicum'],
  ]
  const chipPos = CHIPS.map((c, i) => [i % 2 ? 112 : -112, [-250, -130, -10][Math.floor(i / 2)]])
  const chips = CHIPS.map((c) => {
    const g = mk('g', {}, $('chips'))
    const r = mk('rect', { x: -105, y: -48, width: 210, height: 96, rx: 28, fill: '#EDF4E8', stroke: '#CFE0C9', 'stroke-width': 3 }, g)
    mk('use', { href: '#' + c[0], x: -98, y: -30, width: 60, height: 60 }, g)
    const t = mk('text', { x: -34, y: 9, 'font-size': c[1].length > 8 ? 22 : 27, 'font-weight': 600, fill: INK, 'font-family': "'Inter',sans-serif" }, g)
    t.textContent = c[1]
    let badge = null
    if (c[0] === 'curry') {
      badge = mk('g', {}, g)
      mk('circle', { cx: 96, cy: -40, r: 24, fill: '#D23F27' }, badge)
      const bt = mk('text', { x: 96, y: -31, 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 700, fill: '#fff', 'font-family': "'Inter',sans-serif" }, badge)
      bt.textContent = '×2'
    }
    return { g, r, t, badge }
  })
  const TAPS = [
    { f: 352, c: 0 },
    { f: 388, c: 1 },
    { f: 424, c: 2 },
    { f: 458, c: 3 },
    { f: 486, c: 3 },
    { f: 518, c: 5 },
    { f: 546, c: 'btn' },
  ]
  const BTN = [0, 345]
  const SLOTS = [
    [-64, 112],
    [-24, 104],
    [18, 110],
    [54, 100],
    [70, 112],
    [-4, 94],
  ]
  const flyers = TAPS.filter((t) => t.c !== 'btn').map((t, i) => ({
    t,
    slot: SLOTS[i],
    el: mk('use', { href: '#' + CHIPS[t.c][0], x: -34, y: -34, width: 68, height: 68, opacity: 0 }, $('items3')),
  }))
  const tapPos = (t) => (t.c === 'btn' ? BTN : chipPos[t.c])
  const CPTS = [[330, 520], ...TAPS.map(tapPos)]
  const CARR = [330, ...TAPS.map((t) => t.f)]
  function arc(a, b, t) {
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const d = Math.hypot(dx, dy)
    if (d < 1) return a
    const cx = (a[0] + b[0]) / 2 - (dy / d) * 0.15 * d
    const cy = (a[1] + b[1]) / 2 + (dx / d) * 0.15 * d
    const u = 1 - t
    return [u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]]
  }
  function cursorAt(f) {
    if (f <= CARR[0]) return CPTS[0]
    for (let k = 1; k < CARR.length; k += 1) {
      if (f < CARR[k]) {
        const t = eio(lin(f, CARR[k - 1] + 6, CARR[k] - 2))
        return arc(CPTS[k - 1], CPTS[k], t)
      }
    }
    return CPTS[CPTS.length - 1]
  }

  const PICK_DAY = 2 // Wednesday — illustrates the one day each customer chooses, not every day
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
    const g = mk('g', {}, $('week'))
    const c = mk('circle', { r: 30, fill: '#FFFFFF', stroke: '#9DBF95', 'stroke-width': 3 }, g)
    const t = mk('text', { y: 10, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 700, fill: INK, 'font-family': "'Inter',sans-serif" }, g)
    t.textContent = d
    return { g, c, t, x: 960 + (i - 3) * 92 }
  })
  const route = $('route')
  const RLEN = route.getTotalLength()
  set(route, 'stroke-dasharray', '2 22')

  let H = {}
  function buildText() {
    H.h1 = layout($('h1'), 'Picked at sunrise.', 960, 250, 124, 800, INK)
    H.h2 = layout($('h2'), 'No more 7 AM market runs.', 960, 210, 104, 800, INK)
    H.side = ['Your basket.', 'Your call.'].map((s, i) => layout($('side3'), s, 390, 500 + i * 104, 84, 800, INK, '\u0000'))
    H.h4 = layout($('h4'), 'Farm to your door, every week.', 960, 180, 90, 800, INK)
    const w = layout($('word'), 'BoboBay', 0, 560, 230, 800, INK, '')
    w.forEach((e, i) => set(e, 'fill', i < 4 ? '#2F7D32' : '#E4572E')) // Bobo = leaf, Bay = tomato
    const groupW = 160 + 36 + w.total
    const left = 960 - groupW / 2
    w.forEach((e) => set(e, 'x', +e.getAttribute('x') + left + 196 + w.total / 2))
    H.markX = left + 80
    H.word = w
    H.tag = layout($('tag5'), 'Freshness · Health · Happiness', 960, 670, 50, 600, '#2F5A3E')
  }

  function dashPattern(len) {
    const n = Math.floor(len / 24)
    const rest = len - n * 24
    const s = []
    for (let i = 0; i < n; i += 1) s.push(2, 22)
    s.push(Math.min(2, rest), Math.max(0, rest - 2))
    return s.join(' ')
  }
  function dashUpTo(len) {
    return `${dashPattern(len)} ${RLEN + 40}`
  }

  function render(f) {
    const day = eio(lin(f, 90, 200)) * (1 - eio(lin(f, 860, 898)))
    set($('day'), 'opacity', day)
    const a = (2 * Math.PI * f) / CTOTAL
    leaves.forEach((L) =>
      set(L.el, 'transform', `translate(${L.x + L.ax * Math.sin(a * L.k + L.p)} ${L.y + L.ay * Math.cos(a * L.k + L.p)}) rotate(${L.r + 14 * Math.sin(a * (L.k + 1) + L.p)}) scale(${L.s})`),
    )

    set($('s1'), 'opacity', 1 - ein(lin(f, 136, 150)))
    cam($('cam1'), 1 + 0.06 * eio(lin(f, 0, 150)))
    set($('field'), 'transform', `translate(0 ${40 * (1 - eout(lin(f, 0, 30)))})`)
    set($('field'), 'opacity', lin(f, 0, 20))
    const sy = mix(900, 470, eout(lin(f, 10, 95))) + 6 * Math.sin(f / 22)
    set($('sun'), 'transform', `translate(960 ${sy})`)
    rays.forEach((r, i) => {
      const t = f > 40 ? ((f - 40 + i * 25) % 75) / 75 : 0
      set(r, 'cy', sy)
      set(r, 'r', 180 + t * 230)
      set(r, 'opacity', (1 - t) * 0.5 * lin(f, 40, 60))
    })
    wordsIn(H.h1, f, 34, 4)

    set($('s2'), 'opacity', lin(f, 146, 160) * (1 - ein(lin(f, 288, 300))))
    cam($('cam2'), 1.01, mix(40, -40, eio(lin(f, 150, 300))))
    const ce = back(lin(f, 152, 182))
    set($('clock'), 'transform', `translate(640 600) scale(${mix(0.6, 1, ce)})`)
    set($('clock'), 'opacity', lin(f, 152, 164))
    const mt = eio(lin(f, 175, 265))
    set($('minHand'), 'transform', `rotate(${270 * mt})`)
    set($('hourHand'), 'transform', `rotate(${22.5 * mt})`)
    // Counts up to 7:00 AM (never past it) — racing to beat the market-run cutoff the headline names.
    const clockMinutes = 6 * 60 + 15 + Math.round(45 * mt) // 6:15 -> 7:00
    $('clockLabel').textContent = `${Math.floor(clockMinutes / 60)}:${String(clockMinutes % 60).padStart(2, '0')} AM`
    const cr = back(lin(f, 158, 188))
    set($('crate'), 'transform', `translate(1270 ${mix(680, 620, cr)})`)
    set($('crate'), 'opacity', lin(f, 158, 170))
    const w = eio(lin(f, 190, 270))
    set($('wiltM'), 'values', mix(1, 0.18, w))
    set($('droop'), 'transform', `rotate(${34 * w} 140 10)`)
    wordsIn(H.h2, f, 166, 3)

    set($('s3'), 'opacity', lin(f, 296, 308) * (1 - ein(lin(f, 558, 570))))
    cam($('cam3'), 1 + 0.1 * eio(lin(f, 336, 366)) - 0.1 * eio(lin(f, 528, 556)))
    set($('phone'), 'transform', `translate(960 ${mix(1400, 545, back(lin(f, 300, 336))) + 3 * Math.sin(f / 26)})`)
    H.side.forEach((els, i) => wordsIn(els, f, 312 + i * 4, 0, 50))
    const cn = back(lin(f, 318, 348))
    set($('counter3'), 'opacity', lin(f, 318, 330))
    set($('counter3'), 'transform', `translate(0 ${40 * (1 - cn)})`)
    chips.forEach((ch, i) => {
      const s = 330 + i * 3
      const p = back(lin(f, s, s + 30))
      let press = 0
      let count = 0
      TAPS.forEach((t) => {
        if (t.c === i) {
          press = Math.max(press, bump(f, t.f, 8))
          if (f >= t.f + 2) count += 1
        }
      })
      const sc = mix(0.7, 1, p) * (1 - 0.05 * press)
      set(ch.g, 'transform', `translate(${chipPos[i][0]} ${chipPos[i][1]}) scale(${sc})`)
      set(ch.g, 'opacity', lin(f, s, s + 10))
      set(ch.r, 'fill', count ? LEAF : '#EDF4E8')
      set(ch.r, 'stroke', count ? LEAF : '#CFE0C9')
      set(ch.t, 'fill', count ? '#FFFFFF' : INK)
      if (ch.badge) {
        const b = back(lin(f, 488, 508))
        set(ch.badge, 'transform', `translate(96 -40) scale(${b}) translate(-96 40)`)
        set(ch.badge, 'opacity', b > 0 ? 1 : 0)
      }
    })
    let cnt = 0
    flyers.forEach((fl, i) => {
      const tf = fl.t.f
      const a0 = chipPos[fl.t.c]
      const b0 = fl.slot
      const t = eio(lin(f, tf + 2, tf + 26))
      if (f < tf + 2) {
        set(fl.el, 'opacity', 0)
        return
      }
      const cx = (a0[0] + b0[0]) / 2
      const cy = Math.min(a0[1], b0[1]) - 140
      const u = 1 - t
      const x = u * u * a0[0] + 2 * u * t * cx + t * t * b0[0]
      const y = u * u * a0[1] + 2 * u * t * cy + t * t * b0[1] + (t >= 1 ? 2 * Math.sin(f / 18 + i) : 0)
      set(fl.el, 'opacity', 1)
      set(fl.el, 'transform', `translate(${x} ${y}) rotate(${(i % 2 ? 22 : -22) * t}) scale(${mix(1, 0.92, t)})`)
      cnt += eout(lin(f, tf + 14, tf + 26))
    })
    $('count').textContent = Math.round(cnt)
    const bp = back(lin(f, 344, 374))
    const bpress = bump(f, 546, 8)
    set($('btn3'), 'transform', `translate(0 345) scale(${mix(0.8, 1, bp) * (1 - 0.04 * bpress)})`)
    set($('btn3'), 'opacity', lin(f, 344, 356))
    const done = f >= 552
    $('btnText').textContent = done ? 'Subscribed ✓' : 'Subscribe weekly'
    const cp = cursorAt(f)
    let press = 0
    let last = null
    TAPS.forEach((t) => {
      press = Math.max(press, bump(f, t.f, 8))
      if (f >= t.f && f < t.f + 20) last = t
    })
    set($('cursor'), 'transform', `translate(${cp[0]} ${cp[1]}) scale(${1 - 0.22 * press})`)
    set($('cursor'), 'opacity', lin(f, 330, 342) * (1 - lin(f, 556, 566)))
    if (last) {
      const p = lin(f, last.f, last.f + 20)
      const pp = tapPos(last)
      set($('ripple'), 'cx', pp[0])
      set($('ripple'), 'cy', pp[1])
      set($('ripple'), 'r', 22 + 46 * eout(p))
      set($('ripple'), 'opacity', 0.45 * (1 - p))
    } else set($('ripple'), 'opacity', 0)

    set($('s4'), 'opacity', lin(f, 566, 580) * (1 - ein(lin(f, 738, 750))))
    cam($('cam4'), 1 + 0.04 * eio(lin(f, 570, 750)))
    wordsIn(H.h4, f, 584, 3)
    const fm = back(lin(f, 576, 606))
    set($('farm'), 'transform', `translate(300 830) scale(${mix(0.7, 1, fm)})`)
    set($('farm'), 'opacity', lin(f, 576, 588))
    const dr = back(lin(f, 582, 612))
    set($('door'), 'transform', `translate(1600 ${mix(760, 700, dr)})`)
    set($('door'), 'opacity', lin(f, 582, 594))
    const rd = eio(lin(f, 596, 640))
    set(route, 'opacity', rd > 0 ? 1 : 0)
    route.style.clipPath = 'none'
    set($('routeMask'), 'd', route.getAttribute('d'))
    set(route, 'stroke-dashoffset', 0)
    set(route, 'stroke-dasharray', rd >= 1 ? '2 22' : dashUpTo(RLEN * rd))
    const tt = eio(lin(f, 628, 692))
    const pt = route.getPointAtLength(RLEN * tt)
    const land = bump(f, 692, 18)
    set($('travel'), 'transform', `translate(${pt.x} ${pt.y - 14 * land + (f > 710 ? 2 * Math.sin(f / 20) : 0)}) scale(${1 + 0.06 * land} ${1 - 0.06 * land})`)
    set($('travel'), 'opacity', lin(f, 622, 632))
    const ck = back(lin(f, 700, 724))
    set($('check'), 'transform', `translate(80 -110) scale(${ck}) translate(-80 110)`)
    set($('check'), 'opacity', ck > 0 ? 1 : 0)
    days.forEach((d, i) => {
      const s = 592 + i * 3
      const e = back(lin(f, s, s + 24))
      const pick = i === PICK_DAY ? 1 + 0.16 * bump(f, 714, 20) : 1
      set(d.g, 'transform', `translate(${d.x} 290) scale(${mix(0.6, 1, e) * pick})`)
      set(d.g, 'opacity', lin(f, s, s + 10))
      const on = i === PICK_DAY && lin(f, 712, 716) > 0
      set(d.c, 'fill', on ? LEAF : '#FFFFFF')
      set(d.c, 'stroke', on ? LEAF : '#9DBF95')
      set(d.t, 'fill', on ? '#FFFFFF' : INK)
    })

    set($('s5'), 'opacity', lin(f, 746, 758) * (1 - ein(lin(f, 872, 890))))
    cam($('cam5'), 1 + 0.03 * eio(lin(f, 750, 900)))
    const mk5 = back(lin(f, 756, 786))
    set($('mark'), 'transform', `translate(${H.markX} 485) scale(${mk5}) rotate(${8 * Math.sin(f / 30)})`)
    wordsIn(H.word, f, 764, 3, 50)
    wordsIn(H.tag, f, 800, 3, 30)
    const ct = back(lin(f, 816, 846))
    set($('cta'), 'transform', `translate(960 800) scale(${mix(0.7, 1, ct) * (1 - 0.04 * bump(f, 856, 8))})`)
    set($('cta'), 'opacity', lin(f, 816, 828))
  }

  // Scene 1's key moment: sun fully risen, headline fully in, nothing mid-motion —
  // the frame shown at rest and under prefers-reduced-motion.
  const STILL_FRAME = 140
  let frame = STILL_FRAME
  let lastT = null
  function tick(t) {
    if (cancelled) return
    if (lastT !== null) frame = (frame + ((t - lastT) / 1000) * FPS) % TOTAL
    lastT = t
    render(frame / SCALE)
    raf = requestAnimationFrame(tick)
  }

  const fontsReady =
    document.fonts && document.fonts.ready
      ? Promise.race([document.fonts.load("800 100px 'Fraunces'").then(() => document.fonts.ready), new Promise((r) => setTimeout(r, 2500))])
      : Promise.resolve()

  fontsReady.then(() => {
    if (cancelled) return
    buildText()
    if (reduceMotion) render(STILL_FRAME / SCALE)
    else raf = requestAnimationFrame(tick)
  })

  return () => {
    cancelled = true
    if (raf) cancelAnimationFrame(raf)
  }
}

function SunriseHero() {
  const hostRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    host.innerHTML = STAGE_SVG
    const stop = runEngine(host, reduceMotion)
    return () => {
      stop()
      host.innerHTML = ''
    }
  }, [reduceMotion])

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="Picked at sunrise. Choose your vegetables, pick your day, and it reaches your door every week — the Bobobay story."
      className="w-full overflow-hidden rounded-[2rem] bg-[#F9DDBE] shadow-lift [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
      style={{ aspectRatio: '16 / 9' }}
    />
  )
}

export default SunriseHero
