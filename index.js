//    creating server
const express = require("express");
// loading cors
const cors = require("cors");

require("./db/config");
// importing user and products  model below
const User = require("./db/User");
const Product = require("./db/Product");
const res = require("express/lib/response");
// initilizing app below
// reemember we cannot use app before initilization
const app = express();

// creating middleware that is used to get data from api
//  that we send using post method
app.use(express.json());
// now using cors as middleware.
app.use(cors());

//creating api route below for register :
app.post("/register", async (req, resp) => {
  // saving data from postman in mongodb database
  let user = new User(req.body);
  // saving above user in the result below
  let result = await user.save();
  // above code will save the data in database
  // //   //removing password from the api response
  result = result.toObject();
  // above will convert result into the object.
  delete result.password;
  // // we cannot apply the same  delete  password method
  // on.save as we applied on the.select below
  resp.send(req.body);
});

// through req.body we are getting data from postmon
// making route for login  api:
app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    // -password will remove the password.
    if (user) {
      resp.send(user);
      // checking if the  user details matches with the signup details
    } else {
      resp.send({ result: " Email or password does not matches  " });
    }
  } else {
    resp.send({ result: " Email or password is missing " });
  }
  // && shows if both password and email are present,
  // then allow user to login only,
});

//  making product route below
// for saving and sending data , we use post method,
// like we sending api data from postman to mongodb database
// add product api
app.post("/add-product", async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
});

// for getting data from database, we use get method
// get product api,   getting products from database
app.get("/products", async (req, res) => {
  let products = await Product.find();
  // to check if product is present or Not , we use following code
  if (products.length > 0) {
    res.send(products);
  } else {
    // if no product found, show following " no product found "
    res.send({ result: "No product found" });
  }
});
// to delete the product, delete product api
app.delete("/product/:id", async (req, res) => {
  //  :id,  specific product id will be deleted
  const result = await Product.deleteOne({ _id: req.params.id });
  // deleteOne will delete only one product
  res.send(result);
});
// this and above routes have same route , but methods are different
// update and find  product api
app.get("/product/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  // if product found , send the result, otherwise send the "no product found" message

  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No product found" });
  }
});
// update  api  we using put method
// async , await used to handle promise
app.put("/product/:id", async (req, res) => {
  let result = await Product.updateOne(
    // it will need two parameters
    { _id: req.params.id },
    {
      $set: req.body, //it will update the body after update
    }
  );
  res.send(result);
  // to update only one product, we use updateOne
});

// search api , key can be any parameter
app.get("/search/:key", async (req, res) => {
  let result = await Product.find({
    // we will pass all parameters through which search can be done
    $or: [{ name: { $regex: req.params.key } }],
  });
  res.send(result);
});

app.listen(5000);
