import './SectionHeading.css'

export default function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div className="section-heading__text">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-heading__title">{title}</h2>
        {description && <p className="section-heading__description text-soft">{description}</p>}
      </div>
      {action && <div className="section-heading__action">{action}</div>}
    </div>
  )
}
