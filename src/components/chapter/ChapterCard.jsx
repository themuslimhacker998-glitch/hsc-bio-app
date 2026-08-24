import { Link } from 'react-router-dom'
import Badge from '../common/Badge.jsx'
import './ChapterCard.css'

export default function ChapterCard({ chapter, progress = 0, style }) {
  return (
    <Link to={`/chapter/${chapter.slug}`} className="chapter-card fade-in-up" data-accent={chapter.accent} style={style}>
      <span className="chapter-card__punch" aria-hidden="true" />
      <div className="chapter-card__accent-bar" aria-hidden="true" />

      <div className="chapter-card__header">
        <span className="chapter-card__code">{chapter.code}</span>
        <Badge tone="neutral">{chapter.paper}</Badge>
      </div>

      <h3 className="chapter-card__title">{chapter.title}</h3>
      <p className="chapter-card__description text-soft">{chapter.description}</p>

      <div className="chapter-card__progress">
        <div className="chapter-card__progress-label">
          <span>অগ্রগতি</span><strong>{progress}%</strong>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="chapter-card__footer">
        <Badge tone="outline">নোট</Badge>
        <Badge tone="outline">{chapter.visualizations.length}টি ভিজ্যুয়াল</Badge>
      </div>
    </Link>
  )
}
