const path = require("path");
const orderBodyHas = require("../bodyChecker/orderBodyHas");


// Use the existing dishes data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass



function listOrders(req, res) {
  res.json({ data: orders });
}

function createOrders(req, res) {
  const { data: {  deliverTo, mobileNumber, status, dishes = [] } = {} } = req.body;
  
  let newIdOrder = nextId();

  
    const orderDishes = dishes.map((dish) => {
      const { id, name, description, price, image_url, quantity } = dish;
      let newIdDish = nextId()
      
      return {
      id, // Generate a new ID for the order's dish
      name,
      description,
      price,
      image_url,
      quantity,
    };
      
    })
  
  const newOrder = {
    id: newIdOrder,
    deliverTo,
    mobileNumber,
    status,
    dishes: orderDishes,
  };
  console.log("*******#$#$#$", dishes)
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    res.locals.orderId = foundOrder.id;
    return next();
  }
  next({ status: 404, message: "23"})
}

function readOrders(req, res) {

  res.status(200).json({ data: res.locals.order });
}

function updateOrders(req, res, next) {
  const order = res.locals.order;
  const bodyId = req.body.data.id
  const orderId = res.locals.orderId

  if (order) {
    if (bodyId && bodyId !== orderId) {
    return next({ status: 400 , message: `router id ${orderId} does not much ${bodyId}`})
  }
      const { data: {  deliverTo, mobileNumber, status, dishes = [] } = {} } = req.body;
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;
    res.status(200).json({ data: order });
  }  
}

  function destroy(req, res, next) {
    const { orderId } = req.params;
    
    const order = orders.find((order) =>  order.id === orderId);
    if (order) {

      if (order.status !== "pending") {
         return next({ status: 400, message: "An order cannot be deleted unless it is pending"})
      }
      orders.splice(orders.indexOf(order), 1)
      res.sendStatus(204);
    }
  }


module.exports = {
  listOrders,
  create: [
    orderBodyHas("deliverTo"),
    orderBodyHas("mobileNumber"),
    orderBodyHas("dishes"),
    createOrders,
  ],
  readOrders: [orderExists, readOrders],
  updateOrders: [
    orderExists,
    orderBodyHas("deliverTo"),
    orderBodyHas("mobileNumber"),
    orderBodyHas("status"),
    orderBodyHas("dishes"),
    updateOrders,
  ],
  delete: [orderExists,  destroy]
};
