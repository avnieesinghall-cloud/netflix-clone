import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

export const imageUrl =
  "https://image.tmdb.org/t/p/original";

export const requests = {
  netflixOriginals:
    `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`,

  trending:
    `${BASE_URL}/trending/all/week?api_key=${API_KEY}`,

  topRated:
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`,

  action:
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,

  comedy:
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,

  horror:
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,

  romance:
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
};

export const fetchMovies = async (url) => {
  try {
    const response = await axios.get(url);

    return response.data.results || [];
  } catch (error) {
    console.error("TMDB Fetch Error:", error);

    return [];
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
    );

    return response.data.results || [];
  } catch (error) {
    console.error("Search Error:", error);

    return [];
  }
};

export const fetchTrailer = async (
  movieId,
  mediaType = "movie"
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${mediaType}/${movieId}/videos?api_key=${API_KEY}`
    );

    return response.data.results.find(
      (video) =>
        video.type === "Trailer" &&
        video.site === "YouTube"
    );
  } catch (error) {
    console.error("Trailer Error:", error);

    return null;
  }
};