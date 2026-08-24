import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ChapterPage from './pages/ChapterPage.jsx'
import VisualizationDetailPage from './pages/VisualizationDetailPage.jsx'
import PaperPage from './pages/PaperPage.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
import AnimationsPage from './pages/AnimationsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ConfirmEmailPage from './pages/ConfirmEmailPage.jsx'

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
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
