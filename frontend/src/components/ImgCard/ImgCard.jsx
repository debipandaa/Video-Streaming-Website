import "./ImgCard.css";
const ImgCard = ({ poster_path, vote_average }) => {
  return (
    <div className="img-card">
      <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt="" />
      <div className="rating">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="gold"
          stroke="gold"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-star"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <p>{vote_average}</p>
      </div>
    </div>
  );
};
export default ImgCard;
