const { searchTMDB } = require("../services/tmdbService");

exports.searchMovies = async (req, res, next) => {
  try {
    const query = req.query.q;
    const results = await searchTMDB(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};
