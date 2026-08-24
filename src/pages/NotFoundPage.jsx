import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="container not-found">
      <p className="eyebrow">পাতাটি পাওয়া যায়নি</p>
      <h1 className="not-found__title">এই পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1>
      <p className="not-found__description text-soft">ঠিকানা পরিবর্তন হয়ে থাকতে পারে। অধ্যায় ড্যাশবোর্ডে ফিরে যাও।</p>
      <Link to="/" className="not-found__link">← ড্যাশবোর্ডে ফিরে যাও</Link>
    </div>
  )
}
