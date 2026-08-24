import { Link } from 'react-router-dom'
import './Breadcrumbs.css'

export default function Breadcrumbs({ trail }) {
  return (
    <nav className="breadcrumbs" aria-label="পাতার অবস্থান">
      <ol>
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1
          return (
            <li key={item.label}>
              {item.to && !isLast ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
              {!isLast && <span className="breadcrumbs__sep">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
