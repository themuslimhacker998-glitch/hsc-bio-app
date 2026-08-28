import { Link } from 'react-router-dom'
import { CHAPTERS } from '../data/chapters.js'
import './MediaGallery.css'

export default function AnimationsPage() {
  return (
    <div className="media-page container">
      <div className="media-hero"><p className="eyebrow">Visual Learning Lab</p><h1>অ্যানিমেশন দিয়ে শেখো</h1><p className="text-soft">সব অধ্যায়ের গুরুত্বপূর্ণ biological process-এর animation এক জায়গায়।</p></div>
      <div className="media-grid">
        {CHAPTERS.map((chapter) => {
          const animation = chapter.visualizations[1] || chapter.visualizations[0]
          const previewSrc = Array.isArray(animation.videos) ? animation.videos[0].src : animation.videoSrc
          return (
            <Link className="media-card" to={`/chapter/${chapter.slug}/visualization/${animation.id}`} key={chapter.slug}>
              <div className="media-card__visual media-card__visual--animation">
                {previewSrc ? (
                  <video
                    src={previewSrc}
                    muted
                    autoPlay
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                  />
                ) : (
                  <>▶<span>Animation</span></>
                )}
              </div>
              <div className="media-card__body">
                <span className="media-card__paper">{chapter.paper} • {chapter.code}</span>
                <h2>{chapter.title}</h2>
                <h3>{animation.title}</h3>
                <p>{animation.summary}</p>
                <b>অ্যানিমেশন খুলুন →</b>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
