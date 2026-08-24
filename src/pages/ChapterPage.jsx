import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getChapterBySlug } from '../data/chapters.js'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import Badge from '../components/common/Badge.jsx'
import NotesSection from '../components/chapter/NotesSection.jsx'
import VisualizationsSection from '../components/chapter/VisualizationsSection.jsx'
import './ChapterPage.css'

const STORAGE_KEY = 'hsc-biology-progress-v1'

function saveProgress(slug, value) {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, [slug]: value }))
  } catch {}
}

export default function ChapterPage() {
  const { chapterSlug } = useParams()
  const chapter = getChapterBySlug(chapterSlug)
  const [progress, setProgress] = useState(() => {
    try {
      return Number(JSON.parse(localStorage.getItem(STORAGE_KEY))?.[chapterSlug] || 0)
    } catch { return 0 }
  })

  if (!chapter) return <Navigate to="/not-found" replace />

  const updateProgress = (value) => {
    setProgress(value)
    saveProgress(chapter.slug, value)
  }

  return (
    <div className="container chapter-page" data-accent={chapter.accent}>
      <Breadcrumbs trail={[{ label: 'হোম', to: '/' }, { label: chapter.paper }, { label: chapter.title }]} />

      <header className="chapter-page__header">
        <div className="chapter-page__meta">
          <span className="chapter-page__code">{chapter.code}</span>
          <Badge tone="neutral">{chapter.paper}</Badge>
        </div>
        <h1 className="chapter-page__title">{chapter.title}</h1>
        <p className="chapter-page__description text-soft">{chapter.description}</p>

        <div className="chapter-progress-box">
          <div className="chapter-progress-box__top">
            <div><span>এই অধ্যায়ের অগ্রগতি</span><strong>{progress}%</strong></div>
            <button onClick={() => updateProgress(100)} disabled={progress === 100}>
              {progress === 100 ? '✓ অধ্যায় শেষ' : 'অধ্যায় শেষ করেছি'}
            </button>
          </div>
          <input aria-label="অধ্যায়ের অগ্রগতি" type="range" min="0" max="100" step="10" value={progress} onChange={(e) => updateProgress(Number(e.target.value))} />
        </div>
      </header>

      <div className="chapter-page__divider" aria-hidden="true" />
      <NotesSection chapter={chapter} />
      <VisualizationsSection chapter={chapter} />
    </div>
  )
}
