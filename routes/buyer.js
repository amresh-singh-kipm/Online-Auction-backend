const express = require("express");
const {
  placeBid,
  updateMyBid,
  getMyBidProductById,
  getMyAllBidList,
  getMyBid,
  deleteMyBid,
} = require("../controllers/buyer");
const { getProductById } = require("../controllers/product");
const { getUserById } = require("../controllers/admin");
const { getSellerDetails } = require("../controllers/seller");
const router = express.Router();

//PARAM
router.param("userId",getUserById)
router.param("productId", getProductById);
// router.param("productsId",getSellerDetails)
router.param("mybidId", getMyBidProductById);

//API
router.post("/buyer/:userId/:productId", placeBid);
router.put("/buyer/updatebid/:mybidId", updateMyBid);
router.get("/buyer/mybid/:mybidId", getMyBid);
router.get("/buyer/bidlist/:userId", getMyAllBidList);
router.delete("/buyer/deletebid/:mybidId", deleteMyBid);

module.exports = router;
