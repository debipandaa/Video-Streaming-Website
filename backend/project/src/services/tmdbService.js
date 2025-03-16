const axios = require("axios");

const url = "https://api.themoviedb.org/3/search/movie";
const headers = {
  accept: "application/json",
  Authorization: process.env.TMDB_API_KEY,
};

exports.searchTMDB = async (query) => {
  try {
    const response = await axios.get(url, {
      headers,
      params: { query },
    });
    return response.data.results.map((movie) => ({
      title: movie.title,
      release_date: movie.release_date,
    }));
  } catch (error) {
    console.error("Error fetching data from TMDB:", error.message);
    throw new Error("Failed to fetch movies from TMDB");
  }
};
