import "./VideoPlayer.css";
const VideoPlayer = ({ onBack, movieName }) => {
  return (
    <div className="video wrapper">
      <h2>Now Streaming</h2>
      <video controls width="100%" className="video-player">
        <source
          src={`http://localhost:3000/api/stream/${movieName.title.replace(
            /\s+/g,
            "-"
          )}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <br />
      <button onClick={onBack} style={{ marginTop: "20px" }}>
        Back to Info
      </button>
    </div>
  );
};

export default VideoPlayer;
