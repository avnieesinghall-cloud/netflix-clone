export const getWatchlist = () => {
  try {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  } catch {
    return [];
  }
};

export const saveWatchlist = (watchlist) => {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
};

export const addToWatchlist = (movie) => {
  if (!movie || !movie.id) {
    return {
      success: false,
      message: "Movie data missing",
    };
  }

  const watchlist = getWatchlist();

  const alreadyExists = watchlist.some(
    (item) => Number(item.id) === Number(movie.id)
  );

  if (alreadyExists) {
    return {
      success: false,
      message: "Already in My List",
    };
  }

  const movieData = {
    id: movie.id,
    title: movie.title || movie.name || "Untitled",
    name: movie.name || movie.title || "Untitled",
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    overview: movie.overview,
    release_date: movie.release_date || movie.first_air_date,
    vote_average: movie.vote_average,
    media_type: movie.media_type || "movie",
  };

  saveWatchlist([...watchlist, movieData]);

  return {
    success: true,
    message: "Added to My List",
  };
};

export const removeFromWatchlist = (id) => {
  const watchlist = getWatchlist();

  const updatedWatchlist = watchlist.filter(
    (movie) => Number(movie.id) !== Number(id)
  );

  saveWatchlist(updatedWatchlist);
};