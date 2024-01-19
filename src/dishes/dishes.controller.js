const path = require("path");
const bodyDataHas = require("../bodyChecker/bodyDataHas");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

let newId = nextId();

function listDishes(req, res) {
  res.json({ data: dishes });
}

function createDishes(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: newId,
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    res.locals.dishId = foundDish.id;
    return next();
  }
  next({ status: 404})
}

function readDishes(req, res) {
  res.status(200).json({ data: res.locals.dish });
}

function updateDishes(req, res, next) {
  const dish = res.locals.dish;
  const bodyId = req.body.data.id
  const dishId = res.locals.dishId

  if (dish) {
    if (bodyId && bodyId !== dishId) {
    return next({ status: 400 , message: `router id ${dishId} does not much ${bodyId}`})
  }
    const { data: { name, description, price, image_url } = {} } = req.body;
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
    res.status(200).json({ data: dish });
  }  

}

module.exports = {
  listDishes,
  createDishes: [
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    createDishes,
  ],
  create: createDishes,
  readDishes: [dishExists, readDishes],
  updateDishes: [
    dishExists,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"), 
    updateDishes,
  ],
};
