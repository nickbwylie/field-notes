#!/usr/bin/env node
/**
 * add-trip: publish a trip report to Supabase from a local folder.
 *
 * Usage:
 *   npm run add-trip -- ./trip-reports/my-trip           # publish
 *   npm run add-trip -- ./trip-reports/my-trip --dry-run # validate only, no uploads/inserts
 *   npm run add-trip -- ./trip-reports/my-trip --update  # update an existing trip (matched by title)
 *
 * Expects the folder to contain:
 *   trip.md          (frontmatter + markdown body — see trip-reports/_template)
 *   the hero image, gallery photos, and .gpx file referenced in the frontmatter
 *
 * Requires in .env:
 *   VITE_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...   (Supabase dashboard -> Settings -> API keys)
 */

import { readFileSync, existsSync, mkdtempSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";
import { marked } from "marked";
import sharp from "sharp";
import exifReader from "exif-reader";

// ---------- config ----------
const PHOTO_BUCKET = "photos";
const GPX_BUCKET = "gpx";

const MAX_IMAGE_WIDTH = 1600;
const JPEG_QUALITY = 85;

// ---------- tiny helpers ----------
function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fail(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

function warn(msg) {
  console.log(`  ! ${msg}`);
}

/**
 * sharp's bundled HEIC decoder chokes on iPhone HEICs (they embed HDR gain
 * maps / depth data that exceed its security limits). Pre-convert HEIC/HEIF
 * to JPEG with macOS's built-in `sips`, which handles them natively and
 * preserves EXIF (including GPS). Conversions are cached per run.
 */
const heicCache = new Map();
let heicTmpDir = null;

function toSharpReadable(localPath) {
  if (!/\.(heic|heif)$/i.test(localPath)) return localPath;
  if (heicCache.has(localPath)) return heicCache.get(localPath);
  heicTmpDir ??= mkdtempSync(join(tmpdir(), "add-trip-"));
  const out = join(
    heicTmpDir,
    `${heicCache.size}-${basename(localPath).replace(/\.[^.]+$/, ".jpg")}`,
  );
  try {
    execFileSync(
      "sips",
      ["-s", "format", "jpeg", "-s", "formatOptions", "95", localPath, "--out", out],
      { stdio: "pipe" },
    );
  } catch (e) {
    fail(
      `Could not convert ${basename(localPath)} from HEIC (sips failed: ${e.message}). ` +
        "Export it as JPEG from Photos instead.",
    );
  }
  heicCache.set(localPath, out);
  return out;
}

/**
 * Get photo coordinates: explicit lat/lng in the frontmatter wins,
 * otherwise read the GPS position from the photo's EXIF data.
 * Returns null if neither is available.
 */
async function photoCoords(localPath, manual = {}) {
  if (manual.lat != null && manual.lng != null) {
    return { lat: Number(manual.lat), lng: Number(manual.lng) };
  }
  try {
    const meta = await sharp(toSharpReadable(localPath)).metadata();
    if (!meta.exif) return null;
    const exif = exifReader(meta.exif);
    const gps = exif.GPSInfo ?? exif.gps; // exif-reader v2 / v1
    if (!gps?.GPSLatitude || !gps?.GPSLongitude) return null;
    const toDecimal = (dms, ref) => {
      const dec = dms[0] + dms[1] / 60 + dms[2] / 3600;
      return ref === "S" || ref === "W" ? -dec : dec;
    };
    return {
      lat: +toDecimal(gps.GPSLatitude, gps.GPSLatitudeRef).toFixed(6),
      lng: +toDecimal(gps.GPSLongitude, gps.GPSLongitudeRef).toFixed(6),
    };
  } catch {
    return null;
  }
}

// ---------- parse args ----------
loadEnv();
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const update = args.includes("--update");
const folderArg = args.find((a) => !a.startsWith("--"));
if (!folderArg) {
  fail("Usage: npm run add-trip -- <trip-folder> [--dry-run] [--update]");
}
const folder = resolve(process.cwd(), folderArg);
if (!existsSync(folder)) fail(`Folder not found: ${folder}`);
const mdPath = join(folder, "trip.md");
if (!existsSync(mdPath)) fail(`No trip.md found in ${folder}`);

// ---------- parse + validate trip.md ----------
const { data: fm, content: body } = matter(readFileSync(mdPath, "utf8"));

const required = [
  "title",
  "type",
  "difficulty",
  "route_shape",
  "distance_mi",
  "elevation_gain_ft",
  "nights",
  "region",
  "location_area",
  "location_state",
  "location_lat",
  "location_lng",
  "excerpt",
  "tags",
  "hero_image",
];
const missing = required.filter(
  (k) => fm[k] === undefined || fm[k] === null || fm[k] === "",
);
if (missing.length) fail(`trip.md is missing frontmatter: ${missing.join(", ")}`);

const validate = (field, allowed) => {
  if (!allowed.includes(fm[field]))
    fail(`${field} must be one of: ${allowed.join(", ")} (got "${fm[field]}")`);
};
validate("type", ["Hiking", "Backpacking"]);
validate("difficulty", ["Easy", "Moderate", "Strenuous"]);
validate("route_shape", ["Loop", "Out & Back", "Point-to-Point"]);

const slug = fm.slug ? slugify(fm.slug) : slugify(fm.title);

// Collect files that must exist locally
const heroPath = join(folder, fm.hero_image);
if (!existsSync(heroPath)) fail(`Hero image not found: ${fm.hero_image}`);

const gallery = Array.isArray(fm.gallery) ? fm.gallery : [];
for (const g of gallery) {
  if (!g.file) fail("Every gallery entry needs a 'file'");
  if (!existsSync(join(folder, g.file)))
    fail(`Gallery image not found: ${g.file}`);
}

let gpxPath = null;
if (fm.gpx) {
  gpxPath = join(folder, fm.gpx);
  if (!existsSync(gpxPath)) fail(`GPX file not found: ${fm.gpx}`);
}

// ---------- derived fields ----------
const bodyHtml = marked.parse(body, { async: false });
const wordCount = body.split(/\s+/).filter(Boolean).length;
const readingTime = fm.reading_time_min ?? Math.max(1, Math.round(wordCount / 200));

const publicUrl = (bucket, path) =>
  `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;

// All photos are re-encoded to sRGB JPEG at upload time, so they're stored as .jpg
const imageStorageName = (file) => basename(file).replace(/\.[^.]+$/, ".jpg");

const heroStoragePath = `${slug}/${imageStorageName(fm.hero_image)}`;
const gpxStoragePath = gpxPath ? `${slug}.gpx` : null;

const tripRow = {
  title: fm.title,
  type: fm.type,
  difficulty: fm.difficulty,
  route_shape: fm.route_shape,
  distance_mi: fm.distance_mi,
  elevation_gain_ft: fm.elevation_gain_ft,
  high_point_ft: fm.high_point_ft ?? null,
  nights: fm.nights,
  region: fm.region,
  location_area: fm.location_area,
  location_state: fm.location_state,
  location_lat: String(fm.location_lat),
  location_lng: String(fm.location_lng),
  tags: fm.tags,
  featured: fm.featured ?? false,
  excerpt: fm.excerpt,
  reading_time_min: readingTime,
  hero_image: publicUrl(PHOTO_BUCKET, heroStoragePath),
  gpx_url: gpxStoragePath ? publicUrl(GPX_BUCKET, gpxStoragePath) : null,
  ...(fm.created_at ? { created_at: new Date(fm.created_at).toISOString() } : {}),
};

const galleryEntries = [];
for (const g of gallery) {
  const coords = await photoCoords(join(folder, g.file), g);
  galleryEntries.push({
    src: publicUrl(PHOTO_BUCKET, `${slug}/${imageStorageName(g.file)}`),
    caption: g.caption ?? "",
    alt: g.alt ?? g.caption ?? "",
    ...(coords ?? {}),
  });
}

const detailsRow = {
  body_html: bodyHtml,
  route_notes: fm.route_notes ?? null,
  lessons_learned: fm.lessons_learned ?? null,
  would_do_differently: fm.would_do_differently ?? null,
  gallery: galleryEntries,
};

// ---------- report ----------
console.log(`\nTrip: ${fm.title}`);
console.log(`Slug: ${slug}`);
ok(`Parsed trip.md (${wordCount} words, ~${readingTime} min read)`);
ok(`Hero image: ${fm.hero_image}`);
ok(`Gallery photos: ${gallery.length}`);
ok(gpxPath ? `GPX: ${fm.gpx}` : "GPX: none");
for (let i = 0; i < gallery.length; i++) {
  const e = galleryEntries[i];
  if (e.lat != null) {
    ok(`Photo stop ${i + 1}: ${gallery[i].file} @ ${e.lat}, ${e.lng}`);
  } else {
    warn(
      `${gallery[i].file} has no GPS data — it won't appear on the map (add lat/lng to its gallery entry to place it manually)`,
    );
  }
}

if (dryRun) {
  console.log("\n--- DRY RUN: trips row ---");
  console.log(JSON.stringify(tripRow, null, 2));
  console.log("\n--- DRY RUN: trip_details row (body_html truncated) ---");
  console.log(
    JSON.stringify(
      { ...detailsRow, body_html: bodyHtml.slice(0, 200) + "..." },
      null,
      2,
    ),
  );
  console.log("\nDry run complete. Nothing was uploaded.\n");
  process.exit(0);
}

// ---------- connect ----------
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url) fail("VITE_SUPABASE_URL missing from .env");
if (!key)
  fail(
    "SUPABASE_SERVICE_ROLE_KEY missing from .env (dashboard -> Settings -> API keys -> service_role)",
  );
const supabase = createClient(url, key, {
  auth: { persistSession: false },
  // This script never uses realtime; a stub transport avoids the
  // "Node.js 20 detected without native WebSocket" error on Node < 22.
  realtime: { transport: class DummyTransport {} },
});

// ---------- ensure buckets exist ----------
for (const bucket of [PHOTO_BUCKET, GPX_BUCKET]) {
  const { error } = await supabase.storage.createBucket(bucket, { public: true });
  if (error && !/already exists/i.test(error.message)) {
    fail(`Could not create bucket "${bucket}": ${error.message}`);
  }
}

// ---------- upload files ----------
/**
 * Resize + convert every photo to an sRGB JPEG before upload.
 * .rotate() bakes in EXIF orientation; .toColorspace("srgb") converts
 * wide-gamut (Display P3) phone photos properly so they don't look
 * washed out in the browser.
 */
async function processImage(localPath) {
  return sharp(toSharpReadable(localPath))
    .rotate()
    .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
    .toColorspace("srgb")
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
}

async function upload(bucket, storagePath, body, contentType) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, body, { contentType, upsert: true });
  if (error) fail(`Upload failed for ${storagePath}: ${error.message}`);
  ok(`Uploaded ${bucket}/${storagePath}`);
}

console.log("\nProcessing + uploading files...");
await upload(PHOTO_BUCKET, heroStoragePath, await processImage(heroPath), "image/jpeg");
for (const g of gallery) {
  await upload(
    PHOTO_BUCKET,
    `${slug}/${imageStorageName(g.file)}`,
    await processImage(join(folder, g.file)),
    "image/jpeg",
  );
}
if (gpxPath) {
  await upload(GPX_BUCKET, gpxStoragePath, readFileSync(gpxPath), "application/gpx+xml");
}

// ---------- insert / update rows ----------
console.log("\nWriting database rows...");
const { data: existing } = await supabase
  .from("trips")
  .select("id")
  .eq("title", fm.title)
  .maybeSingle();

let tripId;
if (existing) {
  if (!update) {
    fail(
      `A trip titled "${fm.title}" already exists (id ${existing.id}). Re-run with --update to overwrite it.`,
    );
  }
  const { error } = await supabase.from("trips").update(tripRow).eq("id", existing.id);
  if (error) fail(`trips update failed: ${error.message}`);
  tripId = existing.id;
  ok(`Updated trips row (id ${tripId})`);

  const { error: dErr } = await supabase
    .from("trip_details")
    .update(detailsRow)
    .eq("trip_id", tripId);
  if (dErr) fail(`trip_details update failed: ${dErr.message}`);
  ok("Updated trip_details row");
} else {
  const { data, error } = await supabase
    .from("trips")
    .insert(tripRow)
    .select("id")
    .single();
  if (error) fail(`trips insert failed: ${error.message}`);
  tripId = data.id;
  ok(`Inserted trips row (id ${tripId})`);

  const { error: dErr } = await supabase
    .from("trip_details")
    .insert({ ...detailsRow, trip_id: tripId });
  if (dErr) fail(`trip_details insert failed: ${dErr.message}`);
  ok("Inserted trip_details row");
}

console.log(`\nDone! "${fm.title}" is live (trip id ${tripId}).\n`);
