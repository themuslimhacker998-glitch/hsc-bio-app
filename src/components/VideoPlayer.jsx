import { useRef, useState, useCallback } from 'react'

function normalize(src, title) {
  if (Array.isArray(src)) return src.map((v, i) => (typeof v === 'string' ? { src: v, title: title || `ভিডিও ${i + 1}` } : v))
  return [{ src, title: title || 'ভিডিও' }]
}

export default function VideoPlayer({ src, title, poster }) {
  const playlist = normalize(src, title)
  const [index, setIndex] = useState(0)
  const videoRef = useRef(null)
  const [autoPoster, setAutoPoster] = useState(null)

  const current = playlist[index] || {}

  const handleLoadedData = useCallback(() => {
    if (poster || autoPoster) return
    const video = videoRef.current
    if (!video) return
    try {
      const seekTime = video.duration ? video.duration * 0.25 : 1
      video.currentTime = Math.min(seekTime, video.duration || 1)
    } catch { /* ignore */ }
  }, [poster, autoPoster])

  const handleSeeked = useCallback(() => {
    if (poster || autoPoster) return
    const video = videoRef.current
    if (!video || video.readyState < 2) return
    try {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 360
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      setAutoPoster(dataUrl)
    } catch { /* ignore — CORS or other issues */ }
  }, [poster, autoPoster])

  const playNext = useCallback(() => {
    setIndex((i) => (i + 1) % playlist.length)
    setAutoPoster(null)
  }, [playlist.length])

  const selectIndex = useCallback((i) => {
    setIndex(i)
    setAutoPoster(null)
  }, [])

  return (
    <div className="video-player">
      <div style={{ position: 'relative', width: '100%' }}>
        <video
          ref={videoRef}
          key={current.src}
          controls
          className="viz-detail__video"
          src={current.src}
          poster={poster || autoPoster || undefined}
          onLoadedData={handleLoadedData}
          onSeeked={handleSeeked}
          onEnded={playNext}
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
        {playlist.length > 1 && (
          <div className="video-player__badge">{index + 1} / {playlist.length}</div>
        )}
      </div>

      {playlist.length > 1 && (
        <div className="video-player__playlist">
          <div className="video-player__playlist-head" onClick={playNext} role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playNext() } }}>
            <span>{current.title}</span>
            <span className="video-player__next">পরের ভিডিও →</span>
          </div>
          <ul className="video-player__playlist-list">
            {playlist.map((video, i) => (
              <li key={video.src}>
                <button
                  type="button"
                  className={`video-player__playlist-item${i === index ? ' video-player__playlist-item--active' : ''}`}
                  onClick={() => selectIndex(i)}
                >
                  <span className="video-player__playlist-num">{i + 1}</span>
                  <span>{video.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
