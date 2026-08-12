/**
 * A0 — Data integrity pass
 *
 * Fixes the mismatch flagged in the project brief §1.4: robots.json uses
 * Title Case keys and human-readable strings ("220K", "-"), while
 * Product.js expects camelCase keys and typed values (Number price,
 * Number stock, null for "no data").
 *
 * Run with: npm run seed   (see package.json "scripts.seed" below)
 */

require('dotenv').config();
const dns = require('dns');
// Windows + Node's c-ares resolver sometimes fails mongodb+srv:// DNS SRV
// lookups even when the OS resolver (nslookup) succeeds — forcing public
// DNS servers here works around it. See HANDOFF notes for details.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Category = require('../models/Category');

const CATEGORY_DESCRIPTIONS = {
  Robot: 'Fully assembled robots for education, research, and hands-on development.',
  Kit: 'Build-it-yourself robotics kits and chassis platforms.',
  Arm: 'Robotic arms for industrial and research applications.',
};

async function ensureCategories(mappedProducts) {
  const names = [...new Set(mappedProducts.map((p) => p.category).filter(Boolean))];
  for (const name of names) {
    await Category.findOneAndUpdate(
      { name },
      {
        name,
        description:
          CATEGORY_DESCRIPTIONS[name] || `${name} products from Brainswarm Robotics.`,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Ensured ${names.length} categor${names.length === 1 ? 'y' : 'ies'}: ${names.join(', ')}`);
}

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

/** Stock arrives as either a Number or a numeric string. */
function parseStock(raw) {
  if (raw === undefined || raw === null || raw === '-') return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/** Documentation must land as exactly "Yes" or "No" to satisfy the schema enum. */
function parseDocumentation(raw) {
  const v = String(raw || '').trim().toLowerCase();
  return v === 'yes' ? 'Yes' : 'No';
}

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

/** Builds the same { url, public_id } shape the Multer/Cloudinary upload flow produces. */
function buildImage(publicId) {
  if (!publicId) return null;
  return {
    url: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}.png`,
    public_id: publicId,
  };
}

function mapRawToSchema(raw) {
  const image = buildImage(raw['Image Public ID']);

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
    images: image ? [image] : [], // Cloudinary image linked via "Image Public ID" in robots.json; empty until linked
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
  await ensureCategories(mapped);

  console.log(`Seeded ${mapped.length} products. Sample:`);
  console.log(await Product.findOne().lean());

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
