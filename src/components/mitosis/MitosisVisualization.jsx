import { useState, useCallback, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import './MitosisVisualization.css'

// ─── Stage data ───────────────────────────────────────────────────────────
const STAGES = [
  {
    id: 'interphase',
    name: 'ইন্টারফেজ',
    nameEn: 'Interphase',
    description: 'কোষ প্রস্তুত হচ্ছে। DNA প্রতিলিপি তৈরি হয়েছে এবং কোষ বৃদ্ধি পাচ্ছে।',
    detail: 'কোষের নিউক্লিয়াসে ক্রোমোসোম দৃশ্যমান নয়। DNA সিন্থেসিস (S ফেজ) সম্পন্ন হয়েছে। কোষ তার স্বাভাবিক কাজকর্ম চালিয়ে যাচ্ছে।',
    color: '#2e7d50',
  },
  {
    id: 'prophase',
    name: 'প্রোফেজ',
    nameEn: 'Prophase',
    description: 'ক্রোমোসোম সংকোচিত ও দৃশ্যমান হচ্ছে। স্পিন্ড ফাইবার গঠিত হচ্ছে।',
    detail: 'ক্রোমাটিন সংকোচিত হয়ে ক্রোমোসোম গঠন করে। সেন্ট্রিওল বিপরীত মেরুতে সরে যায়। নিউক্লিয়াস আবরণ ভেঙে যায়।',
    color: '#1565c0',
  },
  {
    id: 'metaphase',
    name: 'মেটাফেজ',
    nameEn: 'Metaphase',
    description: 'ক্রোমোসোম কোষের মাঝখানে সাজানো হয়েছে।',
    detail: 'ক্রোমোসোম মেটাফেজ প্লেটে (কোষের মাঝখানে) সারিবদ্ধভাবে অবস্থান করে। স্পিন্ড ফাইবার কাইনেটোকোরে সংযুক্ত।',
    color: '#6a1b9a',
  },
  {
    id: 'anaphase',
    name: 'অ্যানাফেজ',
    nameEn: 'Anaphase',
    description: 'বোধক ক্রোমোটিড পৃথক হয়ে বিপরীত দিকে যাচ্ছে।',
    detail: 'সিস্টার ক্রোমাটিড পৃথক হয়ে স্পিন্ড ফাইবারের সাহায্যে কোষের বিপরীত মেরুতে সরে যায়। কোষ দীর্ঘ হয়।',
    color: '#e65100',
  },
  {
    id: 'telophase',
    name: 'টেলোফেজ',
    nameEn: 'Telophase',
    description: 'দুটি নতুন নিউক্লিয়াস গঠিত হচ্ছে। কোষ বিভাজন প্রায় সম্পন্ন।',
    detail: 'ক্রোমোসোম আবার ছড়িয়ে পড়ে। নিউক্লিয়াস আবরণ পুনর্গঠিত হয়। সাইটোকাইনেসিস শুরু হয়।',
    color: '#c62828',
  },
]

// ─── GLTF loader ──────────────────────────────────────────────────────────
const MODEL_PATH = '/models/mitosis/Mitosis_stages._cell_division.gltf'

function SceneModel() {
  const { scene } = useGLTF(MODEL_PATH)
  const { camera } = useThree()
  const groupRef = useRef()
  const framedRef = useRef(false)

  // Scale, center, and frame the model on first render
  useFrame(() => {
    if (!scene || framedRef.current) return
    framedRef.current = true

    // Compensate the model's existing 0.01 scale
    scene.scale.setScalar(100)
    scene.updateMatrixWorld(true)

    // Compute bounding box of the scaled model
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    // Center model at world origin
    scene.position.sub(center)
    scene.updateMatrixWorld(true)

    // Position camera to fill viewport with padding
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.fov * (Math.PI / 180)
    const pad = window.innerWidth < 600 ? 8.0 : window.innerWidth < 900 ? 5.0 : 3.5
    const dist = (maxDim / 2) / Math.tan(fov / 2) * pad

    camera.position.set(dist * 0.5, dist * 0.4, dist)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  })

  // Subtle idle rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

// Loading fallback
function Loader() {
  return (
    <div className="mitosis-viz__loading">
      <div className="mitosis-viz__loading-spinner" />
      <span>মডেল লোড হচ্ছে...</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function MitosisVisualization() {
  const [activeStage, setActiveStage] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const intervalRef = useRef(null)

  const stage = STAGES[activeStage]

  const goTo = useCallback((index) => {
    if (index < 0 || index >= STAGES.length) return
    setActiveStage(index)
  }, [])

  const goNext = useCallback(() => {
    setActiveStage((prev) => (prev === STAGES.length - 1 ? 0 : prev + 1))
  }, [])

  const goPrev = useCallback(() => {
    setActiveStage((prev) => (prev === 0 ? STAGES.length - 1 : prev - 1))
  }, [])

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveStage((prev) => (prev === STAGES.length - 1 ? 0 : prev + 1))
      }, 4000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAutoPlaying])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === ' ') {
        e.preventDefault()
        setIsAutoPlaying((p) => !p)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  return (
    <div className="mitosis-viz">
      {/* 3D Canvas */}
      <div className="mitosis-viz__scene">
        <Suspense fallback={<Loader />}>
          <Canvas
            camera={{ position: [0, 0, 50], fov: 35, near: 0.01, far: 50000 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[50, 80, 60]} intensity={1.2} />
            <directionalLight position={[-30, 40, -20]} intensity={0.4} />
            <SceneModel />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={0.1}
              maxDistance={2000}
              dampingFactor={0.08}
              enableDamping
              autoRotate={false}
              maxPolarAngle={Math.PI * 0.85}
            />
          </Canvas>
        </Suspense>

        {/* Stage label overlay */}
        <div className="mitosis-viz__scene-label" style={{ color: stage.color }}>
          {stage.name}
        </div>
      </div>

      {/* Info panel */}
      <div className="mitosis-viz__info">
        <div className="mitosis-viz__info-header">
          <span
            className="mitosis-viz__step-badge"
            style={{ background: stage.color + '18', color: stage.color }}
          >
            ধাপ {activeStage + 1} / {STAGES.length}
          </span>
          <h3 className="mitosis-viz__stage-name" style={{ color: stage.color }}>
            {stage.name}
          </h3>
          <span className="mitosis-viz__stage-en">{stage.nameEn}</span>
        </div>
        <p className="mitosis-viz__description">{stage.description}</p>
        <p className="mitosis-viz__detail">{stage.detail}</p>
      </div>

      {/* Controls */}
      <div className="mitosis-viz__controls">
        <button
          className="mitosis-viz__btn"
          onClick={goPrev}
          aria-label="পূর্ববর্তী ধাপ"
        >
          ‹
        </button>

        <div className="mitosis-viz__timeline">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              className={`mitosis-viz__dot ${i === activeStage ? 'mitosis-viz__dot--active' : ''}`}
              style={{
                '--dot-color': s.color,
                background: i === activeStage ? s.color : undefined,
              }}
              onClick={() => goTo(i)}
              aria-label={s.name}
              aria-current={i === activeStage ? 'step' : undefined}
            />
          ))}
        </div>

        <button
          className="mitosis-viz__btn"
          onClick={goNext}
          aria-label="পরবর্তী ধাপ"
        >
          ›
        </button>

        <button
          className={`mitosis-viz__play-btn ${isAutoPlaying ? 'mitosis-viz__play-btn--active' : ''}`}
          onClick={() => setIsAutoPlaying((p) => !p)}
          aria-label={isAutoPlaying ? 'অটো-প্লে বন্ধ করুন' : 'অটো-প্লে চালু করুন'}
          title="স্পেসবার দিয়ে টগল করুন"
        >
          {isAutoPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      </div>

      {/* Stage tabs */}
      <div className="mitosis-viz__stage-nav">
        {STAGES.map((s, i) => (
          <button
            key={s.id}
            className={`mitosis-viz__stage-tab ${i === activeStage ? 'mitosis-viz__stage-tab--active' : ''}`}
            style={{
              '--tab-color': s.color,
              borderColor: i === activeStage ? s.color : 'transparent',
              color: i === activeStage ? s.color : undefined,
            }}
            onClick={() => goTo(i)}
          >
            <span className="mitosis-viz__stage-tab-num">{i + 1}</span>
            <span className="mitosis-viz__stage-tab-name">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
