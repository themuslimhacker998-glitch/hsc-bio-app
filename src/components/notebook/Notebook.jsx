import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getChapterBySlug } from '../../data/chapters.js'
import parseMarkdown from '../../lib/markdownParser.js'
import notesRaw from '../../biology1/cell-division/notescell.md?raw'
import cellCycleDiagram from '../../biology1/cell-division/images/cell_cycle_diagram.png'
import mitosisStagesDiagram from '../../biology1/cell-division/images/mitosis_stages_diagram.png'
import pageSoundUrl from '../../assets/pagesound.mp3'
import './Notebook.css'

const IMAGE_MAP = {
  'cell_cycle_diagram.png': cellCycleDiagram,
  'mitosis_stages_diagram.png': mitosisStagesDiagram,
}

function resolveImagePaths(html) {
  return html.replace(
    /<img\s+src="([^"]+)"/g,
    function (_, src) {
      if (src.startsWith('http') || src.startsWith('/')) return '<img src="' + src + '"'
      var resolved = IMAGE_MAP[src] || src
      return '<img src="' + resolved + '"'
    }
  )
}

function splitIntoPages(markdown) {
  var sections = markdown.split(/\n(?=## )/)
  var pages = []
  sections.forEach(function (section) {
    var trimmed = section.trim()
    if (!trimmed) return
    pages.push(resolveImagePaths(parseMarkdown(trimmed)))
  })
  return pages
}

const NOTES_MAP = {
  'kosh-bivajon': notesRaw,
}

export default function Notebook() {
  var params = useParams()
  var chapterSlug = params.chapterSlug
  var chapter = getChapterBySlug(chapterSlug)

  var mdContent = NOTES_MAP[chapterSlug] || null
  var [pages, setPages] = useState([])
  var [currentPage, setCurrentPage] = useState(0)
  var [isAnimating, setIsAnimating] = useState(false)
  var [animDir, setAnimDir] = useState('')
  var animRef = useRef(null)
  var contentRef = useRef(null)
  var soundRef = useRef(null)

  useEffect(function () {
    if (!soundRef.current) soundRef.current = new Audio(pageSoundUrl)
    soundRef.current.load()
    return function () {
      if (soundRef.current) soundRef.current.pause()
    }
  }, [])

  useEffect(function () {
    if (mdContent) {
      setPages(splitIntoPages(mdContent))
      setCurrentPage(0)
    }
  }, [mdContent])

  var goToPage = useCallback(function (idx, dir) {
    if (isAnimating || idx === currentPage) return
    if (idx < 0 || idx >= pages.length) return
    if (!soundRef.current) soundRef.current = new Audio(pageSoundUrl)
    soundRef.current.currentTime = 0
    soundRef.current.play().catch(function () {})
    setAnimDir(dir)
    setIsAnimating(true)
    if (animRef.current) clearTimeout(animRef.current)
    animRef.current = setTimeout(function () {
      setCurrentPage(idx)
      setIsAnimating(false)
      setAnimDir('')
      if (contentRef.current) contentRef.current.scrollTop = 0
    }, 350)
  }, [isAnimating, currentPage, pages.length])

  useEffect(function () {
    return function () {
      if (animRef.current) clearTimeout(animRef.current)
      if (soundRef.current) soundRef.current.pause()
    }
  }, [])

  if (!chapter) {
    return (
      <div className="notebook-wrap">
        <div className="notebook-empty">
          <p>অধ্যায় খুঁজে পাওয়া যায়নি।</p>
          <Link to="/" className="notebook-nav-btn">হোমে ফিরে যান</Link>
        </div>
      </div>
    )
  }

  if (!mdContent || pages.length === 0) {
    return (
      <div className="notebook-wrap">
        <div className="notebook-empty">
          <p>এই অধ্যায়ের নোট এখনো যোগ করা হয়নি।</p>
          <Link to={'/chapter/' + chapterSlug} className="notebook-nav-btn">অধ্যায়ে ফিরে যান</Link>
        </div>
      </div>
    )
  }

  var animClass = isAnimating
    ? (animDir === 'next' ? 'notebook-page--exit-left' : 'notebook-page--exit-right')
    : ''

  return (
    <div className="notebook-wrap">
      <div className="notebook-header">
        <Link to={'/chapter/' + chapterSlug} className="notebook-back">
          ← {chapter.title}
        </Link>
        <h1 className="notebook-title">{chapter.title} — নোটস</h1>
      </div>

      <div className="notebook-body">
        <div className="notebook-spine" aria-hidden="true" />
        <div className="notebook-page-stack">
          <div className={'notebook-page ' + animClass} ref={contentRef}>
            <div className="notebook-page__margin" aria-hidden="true" />
            <div
              className="notebook-page__content notebook-prose"
              dangerouslySetInnerHTML={{ __html: pages[currentPage] }}
            />
            <div className="notebook-page__footer">
              <span className="notebook-page__number">{currentPage + 1} / {pages.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="notebook-controls">
        <button
          className="notebook-nav-btn"
          disabled={currentPage === 0 || isAnimating}
          onClick={function () { goToPage(currentPage - 1, 'prev') }}
        >
          ← আগের পৃষ্ঠা
        </button>
        <span className="notebook-page-indicator">{currentPage + 1} / {pages.length}</span>
        <button
          className="notebook-nav-btn"
          disabled={currentPage === pages.length - 1 || isAnimating}
          onClick={function () { goToPage(currentPage + 1, 'next') }}
        >
          পরের পৃষ্ঠা →
        </button>
      </div>
    </div>
  )
}
