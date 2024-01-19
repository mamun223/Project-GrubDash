const router = require("express").Router();
const ordersController = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass

router.route("/").get(ordersController.listOrders).post(ordersController.create).all(methodNotAllowed)

router.route("/:orderId").get(ordersController.readOrders).put(ordersController.updateOrders).delete(ordersController.delete).all(methodNotAllowed)

module.exports = router;
