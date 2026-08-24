import { Link } from 'react-router-dom'
import { CHAPTERS } from '../data/chapters.js'
import './MediaGallery.css'

export default function ExplorePage() {
  return (
    <div className="media-page container">
      <div className="media-hero"><p className="eyebrow">Visual Learning Lab</p><h1>এক্সপ্লোর 3D ভিজ্যুয়াল</h1><p className="text-soft">১ম ও ২য় পত্রের সব অধ্যায়ের গুরুত্বপূর্ণ 3D ভিজ্যুয়াল এক জায়গায়। আপাতত এখানে structure রাখা হয়েছে—পরে প্রতিটি card-এ আসল 3D model বসবে।</p></div>
      <div className="media-grid">
        {CHAPTERS.map((chapter) => {
          const visual = chapter.visualizations[0]
          return <Link className="media-card" to={`/chapter/${chapter.slug}/visualization/${visual.id}`} key={chapter.slug}>
            <div className="media-card__visual">🧬<span>3D</span></div>
            <div className="media-card__body"><span className="media-card__paper">{chapter.paper} • {chapter.code}</span><h2>{chapter.title}</h2><h3>{visual.title}</h3><p>{visual.summary}</p><b>ভিজ্যুয়াল খুলুন →</b></div>
          </Link>
        })}
      </div>
    </div>
  )
}
