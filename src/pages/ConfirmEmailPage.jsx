import { Link } from 'react-router-dom'

export default function ConfirmEmailPage() {
  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h1 className="confirm-card__title">ইমেইল চেক করুন</h1>
        <p className="confirm-card__message">
          আমরা চেক করুনন্তরেশ্টর লিংক পাঠিয়েছি। আপনার ইনবক্সে ইমেইল চেক করুন এবং লিংকটিতে চেপে আপনার অ্যাকাউন্ট ভেরিফাই করুন। স্প্যাম ফোল্ডার চেক করতে ভুলবশত করুননি।
        </p>
        <Link to="/" className="confirm-card__link">
          ← লগইন পৃষ্ঠায় ফিরে যাও
        </Link>
      </div>
    </div>
  )
}
