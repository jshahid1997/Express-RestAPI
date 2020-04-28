const express = require("express");
const mongoose = require("mongoose");
const Favorites = require("../models/favorite");
const Dishes = require("../models/dishes");

const authenticate = require("../authenticate");
const cors = require("./cors");
const favouriteRouter = express.Router();
const bodyParser = require("body-parser");

favouriteRouter.use(bodyParser.json());

favouriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user }, (err, favorite) => {
      if (err) {
        return next(err);
      }
      if (!favorite) {
        Favorites.create({
          user: req.user._id,
        })
          .then(
            (favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      }
    })
      .populate("user")
      .populate("dishes")
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,

    (req, res, next) => {
      Favorites.findOne({ user: req.user }, (err, favorites) => {
        if (err) {
          return next(err);
        }
        if (!favorites) {
          Favorites.create({
            user: req.user._id,
            dishes: [],
          })
            .then(
              (favorites) => {
                for (var i = req.body.length - 1; i >= 0; i--) {
                  favorites.dishes.push(req.body[i]._id);
                }
                favorites
                  .save()
                  .then(
                    (favorite) => {
                      favorite.populate("user").populate("dishes");
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(favorite);
                    },
                    (err) => next(err)
                  )
                  .catch((err) => next(err));
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        } else {
          for (var i = req.body.length - 1; i >= 0; i--) {
            favorites.dishes.push(req.body[i]._id);
          }
          favorites
            .save()

            .then(
              (favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        }
      })
        .populate("user")
        .populate("dishes")
        .catch((err) => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,

    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported. Error code- " + 403);
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,

    (req, res, next) => {
      Favorites.findOne({ user: req.user }, (err, favorites) => {
        if (err) {
          return next(err);
        }

        for (var i = favorites.dishes.length - 1; i >= 0; i--) {
          favorites.dishes.pull(favorites.dishes[i]._id);
        }
        favorites
          .save()
          .then(
            (favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
        .populate("user")
        .populate("dishes")
        .catch((err) => next(err));
    }
  );

favouriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        (favorites) => {
          if (!favorites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ exists: false, favorites: favorites });
          } else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: false, favorites: favorites });
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: true, favorites: favorites });
            }
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,

    (req, res, next) => {
      Favorites.findOne({ user: req.user }, (err, favorites) => {
        if (err) {
          return next(err);
        }
        var flag = true;
        for (var i = favorites.dishes.length - 1; i >= 0; i--) {
          if (favorites.dishes[i]._id === req.params.dishId) {
            flag = false;
          }
        }
        if (flag) {
          favorites.dishes.push(req.params.dishId);
          favorites
            .save()
            .then(
              (favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        } else {
          res.statusCode = 304;
          res.end("Dish already in favorites");
        }
      })
        .populate("user")
        .populate("dishes")
        .catch((err) => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,

    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported. Error code- " + 403);
    }
  )
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user }, (err, favorites) => {
      if (err) {
        return next(err);
      }

      favorites.dishes.pull(req.params.dishId);

      favorites
        .save()
        .then(
          (favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    })
      .populate("user")
      .populate("dishes")
      .catch((err) => next(err));
  });

module.exports = favouriteRouter;
