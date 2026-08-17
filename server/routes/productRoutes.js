console.log(" Product Routes Loaded");
const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductImages,
  removeProductImage,
  getInventoryStatus,
} = require("../controllers/productController");

router.post("/", upload.array("images", 5), createProduct);
router.get("/", getProducts);

// Admin-only — must come before "/:id" so "admin" isn't read as a product id
router.get("/admin/inventory", protect, restrictTo("admin", "superadmin"), getInventoryStatus);

router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/images", upload.array("images", 5), addProductImages);
router.delete("/:id/images/:public_id", removeProductImage);
module.exports = router;