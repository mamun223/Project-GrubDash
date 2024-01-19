const router = require("express").Router();
const dishesController = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed")

// TODO: Implement the /dishes routes needed to make the tests pass

router
  .route("/")
  .get(dishesController.listDishes)
  .post(dishesController.createDishes);


router
  .route("/:dishId")
  .get(dishesController.readDishes)
  .put(dishesController.updateDishes)
  .all(methodNotAllowed);


module.exports = router;
