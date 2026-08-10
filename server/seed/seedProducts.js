const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const RAW_PATH = path.join(__dirname, 'robots.json');

/** "-" / "" / null / undefined all mean "no data" -> null */
function emptyToNull(value) {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  if (trimmed === '' || trimmed === '-' || trimmed.toLowerCase() === 'n/a') return null;
  return trimmed;
}

/**
 * Parses price strings into a plain Number.
 * Handles: "220K" -> 220000, "1.2M" -> 1200000, "45,000" -> 45000,
 * plain numbers (165000), and ranges like "50K-60K" (takes the low end).
 */
function parsePrice(raw) {
  if (raw === undefined || raw === null) return null;
  if (typeof raw === 'number') return raw;

  let str = String(raw).trim();
  if (str === '' || str === '-') return null;

  // Range: take the first value ("50K-60K" -> "50K")
  if (str.includes('-') && !/^-/.test(str)) {
    str = str.split('-')[0].trim();
  }

  str = str.replace(/,/g, '');

  const match = str.match(/^([\d.]+)\s*([KkMm]?)$/);
  if (!match) {
    const fallback = Number(str.replace(/[^\d.]/g, ''));
    return Number.isFinite(fallback) ? fallback : null;
  }

  const [, numPart, suffix] = match;
  let value = parseFloat(numPart);
  if (suffix.toLowerCase() === 'k') value *= 1_000;
  if (suffix.toLowerCase() === 'm') value *= 1_000_000;

  return Math.round(value);
}

/* Stock arrives as either a Number or a numeric string. */
function parseStock(raw) {
  if (raw === undefined || raw === null || raw === '-') return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/* Documentation must land as exactly "Yes" or "No" to satisfy the schema enum. */
function parseDocumentation(raw) {
  const v = String(raw || '').trim().toLowerCase();
  return v === 'yes' ? 'Yes' : 'No';
}

function mapRawToSchema(raw) {
  return {
    name: raw['Product Name']?.trim(),
    manufacturer: emptyToNull(raw['Manufacturer']),
    category: emptyToNull(raw['Category']),
    description: emptyToNull(raw['Description']),
    processor: emptyToNull(raw['Processor']),
    sensors: emptyToNull(raw['Sensors']),
    battery: emptyToNull(raw['Battery']),
    maxSpeed: emptyToNull(raw['Maximum Speed']),
    warranty: emptyToNull(raw['Warranty']),
    stock: parseStock(raw['Stock Availability']),
    communicationProtocols: emptyToNull(raw['Communication Protocols']),
    price: parsePrice(raw['Price']),
    utility: emptyToNull(raw['Utility']),
    educationalApplications: emptyToNull(raw['Educational Applications']),
    researchApplications: emptyToNull(raw['Research Applications']),
    documentation: parseDocumentation(raw['Documentation']),
    images: [], // Cloudinary URLs attached separately per §1.5 — most products start empty
  };
}

async function seed() {
  const rawData = JSON.parse(fs.readFileSync(RAW_PATH, 'utf-8'));

  const mapped = rawData.map(mapRawToSchema);

  // Guard rails: fail loudly rather than silently writing bad data.
  const problems = [];
  mapped.forEach((p, i) => {
    if (!p.name) problems.push(`Row ${i + 1}: missing "Product Name"`);
    if (p.price === null || Number.isNaN(p.price)) {
      problems.push(`Row ${i + 1} (${p.name}): unparseable price "${rawData[i]['Price']}"`);
    }
  });
  if (problems.length) {
    console.error('Seed aborted — fix these rows in robots.json first:');
    problems.forEach((p) => console.error('  - ' + p));
    process.exit(1);
  }

  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(mapped);

  console.log(`Seeded ${mapped.length} products. Sample:`);
  console.log(await Product.findOne().lean());

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});


// const dns = require("dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Product = require("../models/Product");
// const robotsData = require("./robots.json");

// dotenv.config();

// // Helper: convert "220K" -> 220000, "1.5M" -> 1500000, plain numbers stay as-is
// const parsePrice = (priceStr) => {
//   if (typeof priceStr === "number") return priceStr;

//   const str = String(priceStr).trim().toUpperCase();
//   const num = parseFloat(str);

//   if (str.endsWith("K")) return num * 1000;
//   if (str.endsWith("M")) return num * 1000000;

//   return num; // fallback if it's already a plain number string
// };

// // Helper: map one raw robots.json entry to your Mongoose schema shape
// const mapToSchema = (item) => ({
//   name: item["Product Name"],
//   manufacturer: item["Manufacturer"],
//   category: item["Category"],
//   description: item["Description"],
//   processor: item["Processor"],
//   sensors: item["Sensors"],
//   battery: item["Battery"],
//   maxSpeed: item["Maximum Speed"],
//   warranty: item["Warranty"],
//   stock: Number(item["Stock Availability"]) || 0,
//   communicationProtocols: item["Communication Protocols"],
//   price: parsePrice(item["Price"]),
//   utility: item["Utility"],
//   educationalApplications: item["Educational Applications"],
//   researchApplications: item["Research Applications"],
//   documentation: item["Documentation"],
//   images: [], // no real images yet — added later via actual upload
// });

// const seedProducts = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("MongoDB connected for seeding...");

//     // Clear existing products (careful — this wipes the Product collection)
//     await Product.deleteMany({});
//     console.log("Existing products cleared.");

//     const mappedProducts = robotsData.map(mapToSchema);

//     await Product.insertMany(mappedProducts);
//     console.log(`${mappedProducts.length} products seeded successfully.`);

//     process.exit(0);
//   } catch (error) {
//     console.error("Seeding error:", error.message);
//     process.exit(1);
//   }
// };

// seedProducts();