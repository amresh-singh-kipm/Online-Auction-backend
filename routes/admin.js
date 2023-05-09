const express = require("express");
const {
  getUser,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controllers/admin");
const {
  getProductById,
  getAllProduct,
  deleteProduct,
  updateProduct,
  createProduct,
} = require("../controllers/product");
const router = express.Router();

//PARAM
router.param("userId", getUserById);
router.param("/productId", getProductById);

//API ROUTE
router.get("/alluser", getUser);
router.delete("/delete/:userId", deleteUser);
router.put("/updateuser/:userId", updateUser);

//ROUTE FOR PRODUCT

router.get("/products", getAllProduct);
router.delete("/product/:productId", deleteProduct);
router.put("/updateproduct/:productId", updateProduct);
router.post("/createproduct", createProduct);

module.exports = router;
