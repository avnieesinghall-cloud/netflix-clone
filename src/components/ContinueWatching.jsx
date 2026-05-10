import { imageUrl } from "../api/tmdb";

function ContinueWatching() {
  const watched = JSON.parse(localStorage.getItem("continueWatching")) || [];

  if (watched.length === 0) return null;

  return (
    <section className="continue-section">
      <h2>Continue Watching ⏯</h2>

      <div className="movie-list">
        {watched.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img
              src={`${imageUrl}${movie.backdrop_path || movie.poster_path}`}
              alt={movie.title || movie.name}
              className="movie-poster"
              onClick={() => (window.location.href = `/movie/${movie.id}`)}
            />

            <div className="movie-overlay">
              <h4>{movie.title || movie.name}</h4>
              <button onClick={() => (window.location.href = `/movie/${movie.id}`)}>
                Continue
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ContinueWatching;