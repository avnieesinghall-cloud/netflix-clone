import { addToWatchlist } from "../utils/watchlist";

const imageUrl = "https://image.tmdb.org/t/p/w500";

function ContinueWatching({ movies = [], playTrailer }) {
  return (
    <div className="continue-section">
      <h2>Continue Watching</h2>

      <div className="movie-list">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img
              className="movie-poster"
              src={
                movie.backdrop_path
                  ? `${imageUrl}${movie.backdrop_path}`
                  : movie.poster_path
                  ? `${imageUrl}${movie.poster_path}`
                  : "https://via.placeholder.com/500x300?text=No+Image"
              }
              alt={movie.title || movie.name}
            />

            <button
              className="trailer-btn"
              onClick={(e) => {
                e.stopPropagation();
                playTrailer(movie);
              }}
            >
              ▶
            </button>

            <button
              className="fav-btn"
              onClick={(e) => {
                e.stopPropagation();
                addToWatchlist(movie);
              }}
            >
              +
            </button>

            <div className="movie-overlay">
              <h4>{movie.title || movie.name}</h4>
              <button onClick={() => addToWatchlist(movie)}>
                Add to My List
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContinueWatching;