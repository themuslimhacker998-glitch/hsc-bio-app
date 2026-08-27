import { Navigate, useParams } from 'react-router-dom'
import { getVisualization } from '../data/chapters.js'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import Badge from '../components/common/Badge.jsx'
import VideoPlayer from '../components/VideoPlayer.jsx'
import MitosisVisualization from '../components/mitosis/MitosisVisualization.jsx'
import './VisualizationDetailPage.css'

// Map of chapter+visualization IDs to interactive components
const INTERACTIVE_VISUALIZATIONS = {
  'kosh-bivajon:visual-1': MitosisVisualization,
}

export default function VisualizationDetailPage() {
  const { chapterSlug, visualizationId } = useParams()
  const { chapter, visualization } = getVisualization(chapterSlug, visualizationId)
  if (!chapter || !visualization) return <Navigate to="/not-found" replace />

  const InteractiveViz = INTERACTIVE_VISUALIZATIONS[`${chapterSlug}:${visualizationId}`]

  return (
    <div className="container viz-detail" data-accent={chapter.accent}>
      <Breadcrumbs trail={[{ label: 'হোম', to: '/' }, { label: chapter.title, to: `/chapter/${chapter.slug}` }, { label: visualization.title }]} />
      <header className="viz-detail__header">
        <div className="viz-detail__tags"><Badge tone="accent">{visualization.type}</Badge><Badge tone="neutral">{visualization.status}</Badge></div>
        <h1 className="viz-detail__title">{visualization.title}</h1>
        <p className="viz-detail__summary text-soft">{visualization.summary}</p>
      </header>
      <div className="viz-detail__layout">
        <div className="viz-detail__stage">
          <div className="viz-detail__stage-grid" aria-hidden="true" />
          {visualization.videoSrc ? (
            <VideoPlayer
              key={visualization.videoSrc}
              src={visualization.videoSrc}
              title={visualization.title}
            />
          ) : InteractiveViz ? (
            <div className="viz-detail__stage-content viz-detail__stage-content--interactive">
              <InteractiveViz />
            </div>
          ) : (
            <div className="viz-detail__stage-content">
              <div className="viz-detail__orb">✦</div>
              <p className="viz-detail__stage-title">ইন্টার্‌যাকটিভ ভিজ্যুয়াল শিগগিরই</p>
              <p className="viz-detail__stage-copy text-soft">এই জায়গায় ৩ডি মডেল বা অ্যানিমেটেড চিত্র যুক্ত হবে।</p>
            </div>
          )}
        </div>
        <aside className="viz-detail__panel">
          <h2 className="viz-detail__panel-heading">এই ভিজ্যুয়াল সম্পর্কে</h2>
          <dl className="viz-detail__panel-list">
            <div><dt>অধ্যায়</dt><dd>{chapter.code} · {chapter.title}</dd></div>
            <div><dt>ধরন</dt><dd>{visualization.type}</dd></div>
            <div><dt>অবস্থা</dt><dd>{visualization.status}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
