function orderBodyHas (propertyName) {
 return function (req, res, next) {
    const { data = {} } = req.body;
    const value = data[propertyName];
    const statuses = ["pending", "preparing", "out-for-delivery", "delivered"]

    if (value) {
      
      if (propertyName === "dishes") {
        
        if (Array.isArray(value) && value.length !== 0) {
          
          value.forEach((val) => {
            
            if (!val.quantity) {
                return next({ status: 400, message: `Dish ${value.indexOf(val)} must have a quantity that is an integer greater than 0`})
             }
            const quantity = val.quantity;
            if (quantity <= 0 || !Number.isInteger(quantity)) {
              return next({ status: 400, message: `Dish ${value.indexOf(val)} must have a quantity that is an integer greater than 0`})
            }
      
          })
          return next()
        } else {
          next({
            status: 400,
            message: `Order must include at least one dish`,
          });
        }
      }  else if (propertyName === "status" && !statuses.includes(value)){
        return next({ status: 400, message: "Order must have a status of pending, preparing, out-for-delivery, delivered"})
      }
      else {
        if (value !== "") {
          return next();
        } else {
          next({ status: 400, message: `Order must include a ${propertyName}` });
        }
      }
    }
    next({ status: 400, message: `Order must include a ${propertyName}` });
  };
}


module.exports = orderBodyHas;