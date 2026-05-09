import { useEffect, useState } from "react";
import { fetchMovies, imageUrl, requests } from "../api/tmdb";

function Banner() {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const getMovie = async () => {
      const movies = await fetchMovies(requests.netflixOriginals);
      setMovie(movies[Math.floor(Math.random() * movies.length)]);
    };

    getMovie();
  }, []);

  return (
    <header
      className="banner"
      style={{
        backgroundImage: `linear-gradient(to right, #000 25%, transparent), url(${imageUrl}${movie?.backdrop_path})`,
      }}
    >
      <div className="banner-content">
        <h2>{movie?.title || movie?.name}</h2>
        <p>{movie?.overview?.slice(0, 170)}...</p>
        <button>▶ Play</button>
      </div>
    </header>
  );
}

export default Banner;