function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const value = data[propertyName];

    if (value) {
      if (propertyName === "price") {
        if (Number.isInteger(value) && value > 0) {
          return next();
        } else {
          next({
            status: 400,
            message: `Dish must have a price that is an integer greater than 0`,
          });
        }
      }                        
      else {
        if (value !== "") {
          return next();
        } else {
          next({ status: 400, message: `Dish must include a ${propertyName}` });
        }
      }
    }
    next({ status: 400, message: `Dish must include a ${propertyName}` });
  };
}

module.exports = bodyDataHas;
