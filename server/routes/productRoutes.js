console.log(" Product Routes Loaded");
const express = require("express");
const router = express.Router();
const upload = require("../config/multer"); // 👈 add this import

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductImages,
  removeProductImage,
} = require("../controllers/productController");

router.post("/", upload.array("images", 5), createProduct); // 👈 add middleware here
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/images", upload.array("images", 5), addProductImages);
router.delete("/:id/images/:public_id", removeProductImage);
module.exports = router; 