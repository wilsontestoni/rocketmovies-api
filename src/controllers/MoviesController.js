const AppError = require("../utils/AppError.js");
const moment = require("moment");
const knex = require("../database/knex/index.js");

class MoviesController {
  async index(req, res) {
    const { title } = req.query;
    const user_id = req.user.id;

    const movies = await knex("movies")
      .where({ user_id })
      .whereLike("title", `%${title}%`)
      .orderBy("title");

    const userTags = await knex("tags").where({ user_id });

    const moviesWithTags = movies.map((movie) => {
      const movieTags = userTags.filter((tag) => tag.movie_id === movie.id);

      return {
        ...movie,
        tags: movieTags,
      };
    });

    res.json(moviesWithTags);
  }

  async show(req, res) {
    const { id } = req.params;

    const movie = await knex("movies").where({ id }).first();
    const tags = await knex
      .select("name")
      .from("tags")
      .where("movie_id", movie.id)
      .orderBy("name");

    res.status(200).json({
      ...movie,
      tags,
    });
  }

  async create(req, res) {
    const user_id = req.user.id;
    const { title, description, rating, tags } = req.body;

    const hasNoData = !title || !rating;

    if (hasNoData) {
      throw new AppError("É preciso passar os campos de titulo e nota!");
    }

    const notValidRating = rating > 5 || rating < 0;

    if (notValidRating) {
      throw new AppError("Nota inválida! A nota deve ser entre 1 e 5.");
    }

    const momentOfCreation = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log()

    const [movie_id] = await knex("movies").insert({
      title,
      description,
      rating,
      user_id,
      created_at: momentOfCreation,
      updated_at: momentOfCreation
    });

    if (tags.length > 0) {
      const tagsInsert = tags.map((tag) => {
        return {
          name: tag,
          user_id,
          movie_id,
        };
      });

      await knex("tags").insert(tagsInsert);
    }

    return res.status(201).json();
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("movies").where({ id }).delete();

    return res.status(204).json();
  }

  async update(req, res) {
    const { title, rating, description, tags } = req.body;
    const { movie_id } = req.params;
    const user_id = req.user.id;

    const hasNoData = !title || !rating;

    if (hasNoData) {
      throw new AppError("É preciso passar os campos de titulo e nota!");
    }

    const notValidRating = rating > 5 || rating < 0;

    if (notValidRating) {
      throw new AppError("Nota inválida! A nota deve ser entre 1 e 5.");
    }

    const movie = await knex("movies").where({ id: movie_id }).first();

    if (!movie) throw new AppError("Este filme não existe no sistema");

    movie.title = title ?? movie.title;
    movie.rating = rating ?? movie.rating;
    movie.description = description ?? movie.description;

    const updated_at = moment().format("YYYY-MM-DD HH:mm:ss");

    await knex("movies").where({ id: movie_id }).update({
      title,
      rating,
      description,
      updated_at: updated_at,
    });

    await knex("tags").where({ movie_id }).delete();

    if (tags.length > 0) {
      const tagsInsert = tags.map((tag) => {
        return {
          name: tag,
          user_id,
          movie_id,
        };
      });

      await knex("tags").insert(tagsInsert);
    }

    res.json();
  }
}

module.exports = MoviesController;
