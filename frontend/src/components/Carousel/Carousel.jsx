import { useState, useEffect } from "react";
import "./Carousel.css";

const Carousel = () => {
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
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
      options
    )
      .then((res) => res.json())
      .then((json) => setApiData(json.results))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="carousel-wrapper">
      {apiData.map((movie, index) => (
        <div
          key={index}
          className="background-image"
          style={{
            backgroundImage: `url("https://image.tmdb.org/t/p/w500/${movie.backdrop_path}")`,
          }}
        >
          <div className="background-image-blur"></div>
          <div className="carousel-card">
            <div className="carousel-card-content">
              <h1 className="carousel-card-title">{movie.title}</h1>
              <p className="carousel-card-overview">{movie.overview}</p>
              <div className="carousel-buttons">
                <button className="carousel-button watch-now">Watch Now</button>
                <button className="carousel-button add">+</button>
              </div>
            </div>
            <div className="carousel-image">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
              />
            </div>
          </div>
        </div>
        // <div
        //   className="background-image"
        //   key={index}
        //   style={{
        //     backgroundImage: `url("https://image.tmdb.org/t/p/w500/${movie.backdrop_path}")`,
        //     backgroundSize: "cover",
        //     backgroundPosition: "center",
        //     backgroundRepeat: "no-repeat",
        //   }}
        // >
        //   <div className="background-image-blur">
        //     <div className="carousel-card">
        //       <div className="carousel-card-content">
        //         <h1 className="carousel-card-title">{movie.title}</h1>
        //         <p className="carousel-card-overview">{movie.overview}</p>
        //         <div className="carousel-buttons">
        //           <button className="carousel-button watch-now">
        //             Watch Now
        //           </button>
        //           <button className="carousel-button add">+</button>
        //         </div>
        //       </div>
        //       <div className="carousel-image">
        //         <img
        //           src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        //           alt={movie.title}
        //         />
        //       </div>
        //     </div>
        //   </div>
        // </div>
      ))}
    </div>
  );
};

export default Carousel;
