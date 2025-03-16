import { useState } from "react";
import "./Home.css";
import TitleCards from "../../components/TitleCards/TitleCards.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import InfoCard from "../../components/InfoCard/InfoCard.jsx";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer.jsx";
import Carousel from "../../components/Carousel/Carousel.jsx";

const Home = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  return (
    <div className="main">
      <div className="navbar-container">
        <Navbar />
      </div>

      {!showVideoPlayer ? ( // Conditionally render home or VideoPlayer
        <div className="media-container">
          <div className="hero">
            <Carousel />
          </div>
          <div className="more-cards">
            <TitleCards
              title={"Blockbuster Movies"}
              category={"top_rated"}
              onCardClick={(movie) => setSelectedMovie(movie)}
            />
            <TitleCards
              title={"Only on Netflix"}
              category={"popular"}
              onCardClick={(movie) => setSelectedMovie(movie)}
            />
            <TitleCards
              title={"Upcoming"}
              category={"upcoming"}
              onCardClick={(movie) => setSelectedMovie(movie)}
            />
            <TitleCards
              title={"Now Playing"}
              onCardClick={(movie) => setSelectedMovie(movie)}
            />
          </div>
          <Footer />
        </div>
      ) : (
        <div className="home">
          <VideoPlayer
            onBack={() => setShowVideoPlayer(false)}
            movieName={selectedMovie}
          />
        </div>
      )}

      <div className="info-card-container">
        {selectedMovie && (
          <InfoCard
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onWatchMovie={() => setShowVideoPlayer(true)} // Set VideoPlayer state
          />
        )}
      </div>
    </div>
  );
};

export default Home;
