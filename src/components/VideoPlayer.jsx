export default function VideoPlayer({ src, title }) {
  return (
    <div>
      <h2>{title}</h2>

      <video
        controls
        width="100%"
        src={src}
      />
    </div>
  );
}