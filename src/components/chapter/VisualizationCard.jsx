import { Link } from 'react-router-dom'
import Badge from '../common/Badge.jsx'
import './VisualizationCard.css'

export default function VisualizationCard({ chapterSlug, visualization, accent, style }) {
  return (
    <Link
      to={`/chapter/${chapterSlug}/visualization/${visualization.id}`}
      className="viz-card fade-in-up"
      data-accent={accent}
      style={style}
    >
      <div className="viz-card__stage" aria-hidden="true">
        <span className="viz-card__stage-ring viz-card__stage-ring--outer" />
        <span className="viz-card__stage-ring viz-card__stage-ring--inner" />
        <span className="viz-card__stage-dot" />
      </div>

      <div className="viz-card__body">
        <div className="viz-card__tags">
          <Badge tone="accent">{visualization.type}</Badge>
          <Badge tone="neutral">{visualization.status}</Badge>
        </div>
        <h4 className="viz-card__title">{visualization.title}</h4>
        <p className="viz-card__summary text-soft">{visualization.summary}</p>
      </div>
    </Link>
  )
}
