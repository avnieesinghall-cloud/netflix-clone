import axios from "axios";

const API_KEY = "93b1722c320eba72fe07bc77a33886c1";
const BASE_URL = "https://api.themoviedb.org/3";

export const imageUrl = "https://image.tmdb.org/t/p/original";

export const requests = {
  trending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}`,
  netflixOriginals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`,
  topRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`,
  action: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
  comedy: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
  horror: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,
  romance: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
};

export const fetchMovies = async (url) => {
  const res = await axios.get(url);
  return res.data.results;
};

export const searchMovies = async (query) => {
  const res = await axios.get(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
  );
  return res.data.results;
};
export const fetchTrailer = async (
  movieId,
  mediaType = "movie"
) => {
  const res = await axios.get(
    `${BASE_URL}/${mediaType}/${movieId}/videos?api_key=${API_KEY}`
  );

  const trailer = res.data.results.find(
    (video) =>
      video.type === "Trailer" &&
      video.site === "YouTube"
  );

  return trailer;
};