import "./TitleCards.css";
import { useEffect, useState } from "react";

const TitleCards = ({ title, category, onCardClick }) => {
  const [apiData, setApiData] = useState([]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOGUxOTFkZmVhNmFkZTU4MDEzNmIzYWY3MTE1MDEwOSIsIm5iZiI6MTczNTU5ODY2Ny40NDQsInN1YiI6IjY3NzMyMjRiNWYxYzRmYTQ3MzYxODliMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5_MxTkBXLQNreKJj-I5DgiDB0uLlT4bKaxk8UUgyyQo",
    },
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${
        category ? category : "now_playing"
      }?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((json) => {
        setApiData(json.results);
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list">
        {apiData.map((card, index) => {
          return (
            <div
              className="card"
              key={index}
              onClick={() => onCardClick(card)} // Correct
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${card.poster_path}`}
                alt=""
              />
              <p>{card.original_title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TitleCards;
