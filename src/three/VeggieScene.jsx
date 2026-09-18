import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Float } from '@react-three/drei'

const isTouchDevice =
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

function Basket() {
  return (
    <group position={[0, -0.9, 0]}>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[1.3, 0.9, 1.1, 16, 1, true]} />
        <meshStandardMaterial color="#8a5a34" roughness={0.9} side={2} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[1.32, 0.08, 8, 24]} />
        <meshStandardMaterial color="#6f4525" roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.9, 0.85, 0.12, 16]} />
        <meshStandardMaterial color="#6f4525" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Tomato({ position }) {
  return (
    <Float speed={1.6} floatIntensity={0.6} rotationIntensity={0.4}>
      <group position={position}>
        <mesh castShadow>
          <sphereGeometry args={[0.34, 20, 20]} />
          <meshStandardMaterial color="#e03e2d" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <coneGeometry args={[0.08, 0.14, 8]} />
          <meshStandardMaterial color="#3f7d32" roughness={0.7} />
        </mesh>
      </group>
    </Float>
  )
}

function Carrot({ position, rotation }) {
  return (
    <Float speed={1.3} floatIntensity={0.7} rotationIntensity={0.5}>
      <group position={position} rotation={rotation}>
        <mesh castShadow>
          <coneGeometry args={[0.22, 0.85, 10]} />
          <meshStandardMaterial color="#e8792b" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.06, 0.3, 6]} />
          <meshStandardMaterial color="#4fa832" roughness={0.7} />
        </mesh>
      </group>
    </Float>
  )
}

function Brinjal({ position }) {
  return (
    <Float speed={1.1} floatIntensity={0.5} rotationIntensity={0.3}>
      <group position={position} rotation={[0, 0, Math.PI / 10]}>
        <mesh castShadow scale={[0.62, 1, 0.62]}>
          <sphereGeometry args={[0.32, 18, 18]} />
          <meshStandardMaterial color="#5b3a7a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <coneGeometry args={[0.1, 0.12, 6]} />
          <meshStandardMaterial color="#3f7d32" roughness={0.7} />
        </mesh>
      </group>
    </Float>
  )
}

function Capsicum({ position }) {
  return (
    <Float speed={1.4} floatIntensity={0.6} rotationIntensity={0.4}>
      <group position={position}>
        <mesh castShadow scale={[0.5, 0.62, 0.5]}>
          <icosahedronGeometry args={[0.34, 1]} />
          <meshStandardMaterial color="#4a9b2f" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.03, 0.05, 0.12, 6]} />
          <meshStandardMaterial color="#3f7d32" roughness={0.7} />
        </mesh>
      </group>
    </Float>
  )
}

function LeafyBunch({ position }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        angle: (i / 6) * Math.PI * 2,
        tilt: 0.3 + (i % 2) * 0.15,
      })),
    [],
  )

  return (
    <Float speed={1.8} floatIntensity={0.8} rotationIntensity={0.6}>
      <group position={position}>
        {leaves.map((leaf, i) => (
          <mesh
            key={i}
            position={[Math.cos(leaf.angle) * 0.1, 0.2, Math.sin(leaf.angle) * 0.1]}
            rotation={[leaf.tilt, leaf.angle, 0]}
            castShadow
          >
            <coneGeometry args={[0.07, 0.5, 5]} />
            <meshStandardMaterial color="#3f8f3a" roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, -0.05, 0]}>
          <torusGeometry args={[0.09, 0.025, 6, 12]} />
          <meshStandardMaterial color="#a3743f" roughness={0.8} />
        </mesh>
      </group>
    </Float>
  )
}

function Rig() {
  const { gl } = useThree()
  const group = useRef(null)
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (isTouchDevice) return
    const el = gl.domElement
    const onMove = (event) => {
      const rect = el.getBoundingClientRect()
      target.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      target.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [gl])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    if (isTouchDevice) {
      g.rotation.y += delta * 0.15
      return
    }
    const ease = Math.min(delta * 3, 1)
    g.rotation.y += (target.current.x * 0.35 - g.rotation.y) * ease
    g.rotation.x += (target.current.y * -0.15 - g.rotation.x) * ease
  })

  return (
    <group ref={group}>
      <Basket />
      <Tomato position={[-0.55, 0.55, 0.3]} />
      <Carrot position={[0.5, 0.75, -0.1]} rotation={[0, 0, -0.35]} />
      <Brinjal position={[0, 0.65, 0.5]} />
      <Capsicum position={[0.6, 0.5, 0.45]} />
      <LeafyBunch position={[-0.35, 0.85, -0.25]} />
    </group>
  )
}

function VeggieScene() {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0.6, 4.2], fov: 40 }}>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Suspense fallback={null}>
        <Environment preset="apartment" />
        <Rig />
      </Suspense>
      <ContactShadows position={[0, -1.45, 0]} opacity={0.45} scale={6} blur={2.4} far={2} />
    </Canvas>
  )
}

export default VeggieScene
