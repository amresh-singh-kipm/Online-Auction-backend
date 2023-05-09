const express = require("express");
const {
  createProduct,
  getProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  getAllProduct,
} = require("../controllers/product");
const { isSignedIn } = require("../controllers/auth");
const { getUserById } = require("../controllers/admin");
const router = express.Router();

//PARAM
router.param("userId",getUserById)
router.param("productId", getProductById);

//API ROUTE
router.post("/createproduct/:userId", createProduct);
router.get("/product/:productId", getProduct);
router.get("/products", getAllProduct);
router.delete("/product/:productId", deleteProduct);
router.put("/product/updateproduct/:productId", updateProduct);

module.exports = router;
