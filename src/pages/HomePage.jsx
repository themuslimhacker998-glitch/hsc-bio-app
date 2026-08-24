import { useMemo, useState } from 'react'
import { chaptersByPaper, CHAPTERS } from '../data/chapters.js'
import ChapterCard from '../components/chapter/ChapterCard.jsx'
import './HomePage.css'

const STORAGE_KEY = 'hsc-biology-progress-v1'

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

export default function HomePage() {
  const [progress] = useState(readProgress)
  const [filter, setFilter] = useState('সব')

  const visibleChapters = useMemo(() => {
    if (filter === 'সব') return CHAPTERS
    return chaptersByPaper(filter)
  }, [filter])

  const completed = CHAPTERS.filter((chapter) => progress[chapter.slug] === 100).length
  const average = CHAPTERS.length
    ? Math.round(CHAPTERS.reduce((sum, chapter) => sum + (progress[chapter.slug] || 0), 0) / CHAPTERS.length)
    : 0

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="eyebrow">এইচএসসি জীববিজ্ঞান • বাংলাদেশ</p>
            <h1 className="hero__title">জীববিজ্ঞান শেখো <em>চিত্র, নোট ও অনুশীলনে</em>।</h1>
            <p className="hero__description text-soft">
              বাংলাদেশের HSC শিক্ষার্থীদের জন্য অধ্যায়ভিত্তিক একটি সহজ স্টাডি স্পেস।
              গুরুত্বপূর্ণ চিত্র, সংক্ষিপ্ত নোট এবং ইন্টার‌্যাকটিভ ভিজ্যুয়াল দিয়ে কঠিন বিষয়গুলো বুঝে শেখো।
            </p>
          </div>
          <div className="hero__mark" aria-hidden="true">
            <svg viewBox="0 0 220 220" width="220" height="220">
              <circle cx="110" cy="110" r="92" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" strokeDasharray="4 8" />
              <circle cx="110" cy="110" r="64" fill="var(--accent-eosin-soft)" stroke="var(--accent-eosin)" strokeWidth="1.5" />
              <circle cx="110" cy="110" r="22" fill="var(--accent-eosin)" opacity=".8" />
              <circle cx="110" cy="110" r="8" fill="var(--surface)" />
              <circle cx="61" cy="79" r="5" fill="var(--accent-chlorophyll)" />
              <circle cx="160" cy="82" r="4" fill="var(--accent-hematoxylin)" />
              <circle cx="158" cy="151" r="5" fill="var(--accent-chlorophyll)" />
            </svg>
          </div>
        </div>
      </section>

      <section className="container dashboard">
        <div className="dashboard__top">
          <div>
            <p className="eyebrow">তোমার অগ্রগতি</p>
            <h2>তোমার পড়ার অগ্রগতি</h2>
          </div>
          <p className="dashboard__hint">এই ব্রাউজারেই তোমার অগ্রগতি সংরক্ষিত হবে।</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><span>মোট অধ্যায়</span><strong>{CHAPTERS.length}</strong><small>১ম + ২য় পত্র</small></div>
          <div className="stat-card"><span>শেষ করা</span><strong>{completed}</strong><small>অধ্যায়</small></div>
          <div className="stat-card"><span>গড় অগ্রগতি</span><strong>{average}%</strong><small>সব অধ্যায় মিলিয়ে</small></div>
        </div>

        <div className="dashboard__progress">
          <div className="dashboard__progress-label"><span>সামগ্রিক প্রস্তুতি</span><b>{average}%</b></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${average}%` }} /></div>
        </div>
      </section>

      <section className="container chapter-dashboard">
        <div className="filter-row">
          <div>
            <p className="eyebrow">সিলেবাস</p>
            <h2>অধ্যায়গুলো</h2>
          </div>
          <div className="filter-tabs" role="tablist" aria-label="পত্র বাছাই">
            {['সব', '১ম পত্র', '২য় পত্র'].map((item) => (
              <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="chapter-grid">
          {visibleChapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.slug}
              chapter={chapter}
              progress={progress[chapter.slug] || 0}
              style={{ animationDelay: `${index * 35}ms` }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
