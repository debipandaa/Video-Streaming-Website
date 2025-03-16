import close from "../../assets/close.svg";
import "./InfoCard.css";

const InfoCard = ({ movie, onClose, onWatchMovie }) => {
  const {
    original_title,
    id,
    overview,
    backdrop_path,
    poster_path,
    title,
    video,
    vote_average,
    vote_count,
    genre_ids,
    popularity,
    release_date,
  } = movie;

  const characters = [
    { name: "Ethan Kopek", actor: "Taron Egerton" },
    { name: "Traveler", actor: "Jason Bateman" },
    { name: "Nora Parisi", actor: "Sofia Carson" },
    { name: "Elena Cole", actor: "Danielle Deadwyler" },
  ];

  return (
    <div className="movie-card">
      <div onClick={onClose} className="close-button">
        <img src={close} alt="" />
      </div>
      <div className="movie-header">
        <img
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt={title}
          className="movie-poster"
        />
        <div className="movie-header-content">
          <h1 className="movie-title">{title}</h1>
          <p className="movie-rating">⭐ {vote_average}</p>
          <p className="movie-status">Status: {status}</p>
          <p className="movie-production">Production: {"Pramount Inc."}</p>
          <p className="movie-aired">Aired: {release_date}</p>
        </div>
      </div>
      <div className="button-watch" onClick={onWatchMovie}>
        Watch Movie
      </div>
      <p className="movie-plot">{overview}</p>
      <div className="movie-genres">
        {genre_ids.map((genre) => (
          <span key={genre} className="movie-genre-tag">
            {genre}
          </span>
        ))}
      </div>
      <h2 className="movie-characters-title">Characters</h2>
      <div className="movie-characters">
        {characters.map(({ name, actor }) => (
          <div key={name} className="movie-character">
            <p className="character-name">{name}</p>
            <p className="actor-name">{actor}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
