import { Link } from 'react-router-dom'
import SectionHeading from '../common/SectionHeading.jsx'
import EmptyState from '../common/EmptyState.jsx'
import './NotesSection.css'

const HAS_NOTES = {
  'kosh-bivajon': true,
}

export default function NotesSection({ chapter }) {
  const hasNotes = Boolean(chapter.notes)
  const notesAvailable = HAS_NOTES[chapter.slug]
  return (
    <section className="notes-section" aria-labelledby="notes-heading">
      <SectionHeading eyebrow="পড়াশোনার নোট" title="সংক্ষিপ্ত নোট" description="বোর্ড পরীক্ষার প্রস্তুতির জন্য বিষয়গুলো ছোট ছোট অংশে সাজানো থাকবে।" />
      {hasNotes ? (
        <div className="notes-preview">
          <div className="notes-preview__icon">✦</div>
          <div>
            <h3>এই অধ্যায়ের নোট</h3>
            <p>{chapter.notes.summary}</p>
          </div>
          {notesAvailable ? (
            <Link to={'/chapter/' + chapter.slug + '/notes'} className="notes-preview__open">
              নোট খুলুন →
            </Link>
          ) : (
            <span className="notes-preview__badge">{chapter.notes.status}</span>
          )}
        </div>
      ) : (
        <EmptyState title="নোট শিগগিরই আসছে" description="এই অধ্যায়ের গুছানো নোট এখনো যোগ করা হয়নি।" meta="শিগগিরই" />
      )}
    </section>
  )
}
