import { useEffect, useState } from "react";
import { fetchMovies, requests, imageUrl, fetchTrailer } from "../api/tmdb";

function Banner() {
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [noTrailer, setNoTrailer] = useState(false);

  useEffect(() => {
    const getBannerMovie = async () => {
      try {
        const data = await fetchMovies(requests.netflixOriginals);
        const randomMovie = data[Math.floor(Math.random() * data.length)];
        setMovie(randomMovie);
      } catch (error) {
        console.error("Banner error:", error);
      }
    };

    getBannerMovie();
  }, []);

  const playTrailer = async () => {
    if (!movie) return;

    try {
      const video = await fetchTrailer(movie.id, "tv");

      if (video) {
        setTrailer(video.key);
        setNoTrailer(false);
      } else {
        setNoTrailer(true);
      }
    } catch (error) {
      setNoTrailer(true);
    }
  };

  const openDetails = () => {
    if (!movie) return;

    const watched = JSON.parse(localStorage.getItem("continueWatching")) || [];
    const filtered = watched.filter((item) => item.id !== movie.id);

    localStorage.setItem(
      "continueWatching",
      JSON.stringify([movie, ...filtered].slice(0, 8))
    );

    window.location.href = `/movie/${movie.id}`;
  };

  return (
    <header
      className="banner"
      style={{
        backgroundImage: movie?.backdrop_path
          ? `url(${imageUrl}${movie.backdrop_path})`
          : "none",
      }}
    >
      <div className="banner-content">
        <h2>{movie?.title || movie?.name || "StreamFlix"}</h2>

        <p>
          {movie?.overview
            ? movie.overview.slice(0, 160) + "..."
            : "Explore trending movies and shows."}
        </p>

        <div className="banner-buttons">
          <button onClick={playTrailer}>▶ Play</button>
          <button onClick={openDetails}>More Info</button>
        </div>
      </div>

      {trailer && (
        <div className="trailer-modal">
          <button onClick={() => setTrailer(null)}>✕</button>
          <iframe
            src={`https://www.youtube.com/embed/${trailer}`}
            title="Trailer"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {noTrailer && (
        <div className="trailer-modal">
          <button onClick={() => setNoTrailer(false)}>✕</button>
          <div className="no-trailer-box">
            <h2>Trailer Coming Soon 🎬</h2>
            <p>This title does not have an available trailer right now.</p>
          </div>
        </div>
      )}
    </header>
  );
}

export default Banner;