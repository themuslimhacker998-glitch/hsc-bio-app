import SectionHeading from '../common/SectionHeading.jsx'
import EmptyState from '../common/EmptyState.jsx'
import VisualizationCard from './VisualizationCard.jsx'
import './VisualizationsSection.css'

export default function VisualizationsSection({ chapter }) {
  return (
    <section className="viz-section" aria-labelledby="viz-heading">
      <SectionHeading eyebrow="দেখে শেখো" title="ইন্টার‌্যাকটিভ ভিজ্যুয়াল" description="গুরুত্বপূর্ণ চিত্র, ৩ডি মডেল ও অ্যানিমেশন দেখে বিষয়গুলো আরও সহজে বুঝে নাও।" />
      {chapter.visualizations.length ? (
        <div className="viz-section__grid">
          {chapter.visualizations.map((visualization, index) => (
            <VisualizationCard key={visualization.id} chapterSlug={chapter.slug} visualization={visualization} accent={chapter.accent} style={{ animationDelay: `${index * 70}ms` }} />
          ))}
        </div>
      ) : (
        <EmptyState title="ভিজ্যুয়াল শিগগিরই আসছে" description="এই অধ্যায়ের ইন্টার‌্যাকটিভ কনটেন্ট তৈরি করা হচ্ছে।" meta="শিগগিরই" />
      )}
    </section>
  )
}
