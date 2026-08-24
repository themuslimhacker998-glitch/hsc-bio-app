import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ChapterPage from './pages/ChapterPage.jsx'
import VisualizationDetailPage from './pages/VisualizationDetailPage.jsx'
import PaperPage from './pages/PaperPage.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
import AnimationsPage from './pages/AnimationsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { chaptersByPaper } from './data/chapters.js'

function PlaceholderPage({ title, subtitle }) {
  return (
    <div className="container" style={{ paddingTop: '48px' }}>
      <p className="eyebrow">বাংলাদেশ HSC জীববিজ্ঞান</p>
      <h1 style={{ marginTop: '8px' }}>{title}</h1>
      <p className="text-soft" style={{ marginTop: '12px', maxWidth: '720px' }}>{subtitle}</p>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapter/:chapterSlug" element={<ChapterPage />} />
        <Route path="/paper/:paper" element={<PaperPage />} />
        <Route path="/explore-3d" element={<ExplorePage />} />
        <Route path="/animations" element={<AnimationsPage />} />
        <Route
          path="/chapter/:chapterSlug/visualization/:visualizationId"
          element={<VisualizationDetailPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
