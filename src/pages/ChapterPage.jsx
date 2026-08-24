import { useState, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getChapterBySlug } from '../data/chapters.js'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import Badge from '../components/common/Badge.jsx'
import NotesSection from '../components/chapter/NotesSection.jsx'
import VisualizationsSection from '../components/chapter/VisualizationsSection.jsx'
import { useProgress } from '../hooks/useProgress.js'
import './ChapterPage.css'

export default function ChapterPage() {
  const { chapterSlug } = useParams()
  const chapter = getChapterBySlug(chapterSlug)
  const { getProgress, updateProgress, loading } = useProgress()
  const [progress, setProgress] = useState(0)

  // Sync local state with context progress
  useEffect(() => {
    if (!loading && chapter) {
      setProgress(getProgress(chapter.slug))
    }
  }, [loading, chapter, getProgress])

  if (!chapter) return <Navigate to="/not-found" replace />

  const handleUpdate = (value) => {
    setProgress(value)
    updateProgress(chapter.slug, value)
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
            <button onClick={() => handleUpdate(100)} disabled={progress === 100}>
              {progress === 100 ? '✓ অধ্যায় শেষ' : 'অধ্যায় শেষ করেছি'}
            </button>
          </div>
          <input aria-label="অধ্যায়ের অগ্রগতি" type="range" min="0" max="100" step="10" value={progress} onChange={(e) => handleUpdate(Number(e.target.value))} />
        </div>
      </header>

      <div className="chapter-page__divider" aria-hidden="true" />
      <NotesSection chapter={chapter} />
      <VisualizationsSection chapter={chapter} />
    </div>
  )
}
