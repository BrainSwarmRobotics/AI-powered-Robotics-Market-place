const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");
const robotsData = require("./robots.json");

dotenv.config();

// Helper: convert "220K" -> 220000, "1.5M" -> 1500000, plain numbers stay as-is
const parsePrice = (priceStr) => {
  if (typeof priceStr === "number") return priceStr;

  const str = String(priceStr).trim().toUpperCase();
  const num = parseFloat(str);

  if (str.endsWith("K")) return num * 1000;
  if (str.endsWith("M")) return num * 1000000;

  return num; // fallback if it's already a plain number string
};

// Helper: map one raw robots.json entry to your Mongoose schema shape
const mapToSchema = (item) => ({
  name: item["Product Name"],
  manufacturer: item["Manufacturer"],
  category: item["Category"],
  description: item["Description"],
  processor: item["Processor"],
  sensors: item["Sensors"],
  battery: item["Battery"],
  maxSpeed: item["Maximum Speed"],
  warranty: item["Warranty"],
  stock: Number(item["Stock Availability"]) || 0,
  communicationProtocols: item["Communication Protocols"],
  price: parsePrice(item["Price"]),
  utility: item["Utility"],
  educationalApplications: item["Educational Applications"],
  researchApplications: item["Research Applications"],
  documentation: item["Documentation"],
  images: [], // no real images yet — added later via actual upload
});

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing products (careful — this wipes the Product collection)
    await Product.deleteMany({});
    console.log("Existing products cleared.");

    const mappedProducts = robotsData.map(mapToSchema);

    await Product.insertMany(mappedProducts);
    console.log(`${mappedProducts.length} products seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedProducts();