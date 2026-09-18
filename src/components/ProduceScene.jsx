import { useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import scene from '../data/hero-scene.json'
import banana from '../assets/produce/banana.webp'
import basket from '../assets/produce/basket.webp'
import brinjal from '../assets/produce/brinjal.webp'
import capsicum from '../assets/produce/capsicum.webp'
import carrot from '../assets/produce/carrot.webp'
import coriander from '../assets/produce/coriander.webp'
import mango from '../assets/produce/mango.webp'
import spinach from '../assets/produce/spinach.webp'
import tomato from '../assets/produce/tomato.webp'

const images = { banana, basket, brinjal, capsicum, carrot, coriander, mango, spinach, tomato }

const spring = { type: 'spring', stiffness: 120, damping: 14, mass: 0.8 }

const entrance = {
  hidden: (item) => ({
    opacity: 0,
    scale: 0.35,
    x: (50 - (item.x + item.w / 2)) * 3,
    y: 140,
    rotate: item.rotate + 25,
  }),
  show: (item) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotate: item.rotate,
    transition: { ...spring, delay: 0.45 + item.delay },
  }),
}

const basketEntrance = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { ...spring, delay: 0.1 } },
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function useSceneMotion(reduceMotion) {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const tiltX = useSpring(pointerX, { stiffness: 60, damping: 18 })
  const tiltY = useSpring(pointerY, { stiffness: 60, damping: 18 })
  const { scrollY } = useScroll()

  useEffect(() => {
    if (reduceMotion) return undefined

    if (!window.matchMedia('(pointer: coarse)').matches) {
      const onMove = (event) => {
        pointerX.set((event.clientX / window.innerWidth - 0.5) * 2)
        pointerY.set((event.clientY / window.innerHeight - 0.5) * 2)
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      return () => window.removeEventListener('pointermove', onMove)
    }

    const onOrient = (event) => {
      if (event.gamma == null || event.beta == null) return
      pointerX.set(clamp(event.gamma / 30, -1, 1))
      pointerY.set(clamp((event.beta - 45) / 30, -1, 1))
    }
    window.addEventListener('deviceorientation', onOrient)
    return () => window.removeEventListener('deviceorientation', onOrient)
  }, [reduceMotion, pointerX, pointerY])

  return { tiltX, tiltY, scrollY }
}

function Item({ item, index, motionValues, reduceMotion }) {
  const { tiltX, tiltY, scrollY } = motionValues
  const x = useTransform(tiltX, (t) => t * item.depth * 16)
  const y = useTransform([tiltY, scrollY], ([t, s]) => t * item.depth * 10 - s * item.depth * 0.08)

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.w}%`,
        zIndex: item.behind ? 0 : index + 2,
        x: reduceMotion ? 0 : x,
        y: reduceMotion ? 0 : y,
      }}
    >
      <motion.div custom={item} variants={entrance} style={{ rotate: item.rotate }}>
        <motion.img
          src={images[item.id]}
          alt=""
          draggable={false}
          decoding="async"
          className="w-full drop-shadow-[0_18px_22px_rgb(43_33_24/0.28)]"
          animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
        />
      </motion.div>
    </motion.div>
  )
}

function ProduceScene() {
  const reduceMotion = useReducedMotion()
  const motionValues = useSceneMotion(reduceMotion)
  const rotateX = useTransform(motionValues.tiltY, [-1, 1], [5, -5])
  const rotateY = useTransform(motionValues.tiltX, [-1, 1], [-7, 7])

  return (
    <div className="relative mx-auto w-full max-w-[560px]" style={{ aspectRatio: `${scene.aspect[0]} / ${scene.aspect[1]}` }}>
      <motion.div
        className="relative h-full w-full"
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformPerspective: 1200,
          transformStyle: 'preserve-3d',
        }}
        initial={reduceMotion ? false : 'hidden'}
        animate="show"
      >
        <div
          aria-hidden="true"
          className="absolute rounded-[50%] bg-soil/25 blur-2xl"
          style={{
            left: `${scene.basket.x + 6}%`,
            width: `${scene.basket.w - 12}%`,
            top: `${scene.basket.y + 44}%`,
            height: '12%',
          }}
        />
        <motion.img
          src={images.basket}
          alt="Wicker basket"
          draggable={false}
          fetchPriority="high"
          variants={basketEntrance}
          className="absolute z-[1] drop-shadow-[0_24px_28px_rgb(43_33_24/0.3)]"
          style={{ left: `${scene.basket.x}%`, top: `${scene.basket.y}%`, width: `${scene.basket.w}%` }}
        />
        {scene.items.map((item, index) => (
          <Item key={item.id} item={item} index={index} motionValues={motionValues} reduceMotion={reduceMotion} />
        ))}
      </motion.div>
    </div>
  )
}

export default ProduceScene
