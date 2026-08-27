import { useRef, useState, useCallback } from 'react'

export default function VideoPlayer({ src, title, poster }) {
  const videoRef = useRef(null)
  const [autoPoster, setAutoPoster] = useState(null)

  // Generate a poster thumbnail from the video by seeking to 25% of duration
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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        controls
        className="viz-detail__video"
        src={src}
        poster={poster || autoPoster || undefined}
        onLoadedData={handleLoadedData}
        onSeeked={handleSeeked}
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}