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
    description: {
      type: String,
    },
    processor: {
      type: String,
    },
    sensors: {
      type: String,
    },
    battery: {
      type: String,
    },
    maxSpeed: {
      type: String,
    },
    warranty: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
    },
    communicationProtocols: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    utility: {
      type: String,
    },
    educationalApplications: {
      type: String,
    },
    researchApplications: {
      type: String,
    },
    documentation: {
      type: String, // keeping as String ("Yes"/"No") to avoid conversion complexity
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);