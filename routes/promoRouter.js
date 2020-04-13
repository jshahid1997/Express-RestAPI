const express = require("express");

const bodyParser = require("body-parser");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send data");
  })
  .post((req, res, next) => {
    res.end(
      "Will add data " + req.body.name + " with details " + req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported. Error code- " + 403);
  })
  .delete((req, res, next) => {
    res.end("Deleting all details");
  });

promoRouter
  .route("/:promoId")
  .get((req, res, next) => {
    res.end("Will send data of promotion " + req.params.promoId);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported. Error code- " + 403);
  })
  .put((req, res, next) => {
    res.write("Updating promotion " + req.params.promoId + "\n");
    res.end(
      "Will update the promotion " +
        req.params.promoId +
        " with details : " +
        req.body.name +
        " and " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.end("Deleting the promotion " + req.params.promoId);
  });

module.exports = promoRouter;
