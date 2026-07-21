const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    manufacturer: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    modelNumber: {
      type: String,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);