const express = require("express");

const bodyParser = require("body-parser");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter
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

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    res.end("Will send data of leader " + req.params.leaderId);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported. Error code- " + 403);
  })
  .put((req, res, next) => {
    res.write("Updating leader " + req.params.leaderId + "\n");
    res.end(
      "Will update the leader " +
        req.params.leaderId +
        " with details : " +
        req.body.name +
        " and " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.end("Deleting the leader " + req.params.leaderId);
  });

module.exports = leaderRouter;
