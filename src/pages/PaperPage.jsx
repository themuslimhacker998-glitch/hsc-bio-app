import { Link, useParams } from 'react-router-dom'
import { chaptersByPaper } from '../data/chapters.js'
import './PaperPage.css'

export default function PaperPage() {
  const { paper } = useParams()
  const isFirst = paper === '1'
  const paperName = isFirst ? '১ম পত্র' : '২য় পত্র'
  const chapters = chaptersByPaper(paperName)

  return (
    <div className="catalog-page container">
      <div className="catalog-hero">
        <p className="eyebrow">বাংলাদেশ HSC • জীববিজ্ঞান</p>
        <h1>জীববিজ্ঞান {paperName}</h1>
        <p className="text-soft">এই পত্রের সব অধ্যায় থেকে যেকোনো একটি বেছে নাও। প্রতিটি অধ্যায়ের ভেতরে নোট, 3D ভিজ্যুয়াল ও অ্যানিমেশন থাকবে।</p>
      </div>
      <div className="catalog-grid">
        {chapters.map((chapter) => (
          <Link className="catalog-card" to={`/chapter/${chapter.slug}`} key={chapter.slug}>
            <span className="catalog-card__code">{chapter.code}</span>
            <h2>{chapter.title}</h2>
            <p>{chapter.description}</p>
            <div className="catalog-card__features"><span>📝 নোট</span><span>🧬 3D</span><span>▶ অ্যানিমেশন</span></div>
            <span className="catalog-card__open">অধ্যায় খুলুন →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
