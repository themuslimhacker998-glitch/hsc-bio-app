import './EmptyState.css'

export default function EmptyState({ icon, title, description, meta }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description text-soft">{description}</p>}
      {meta && <p className="empty-state__meta">{meta}</p>}
    </div>
  )
}
