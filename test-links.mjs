/**
 * Dead-link checker for the static website.
 *
 * Parses every HTML file, extracts href / src attributes, then verifies:
 *   - Local file references actually exist on disk
 *   - Fragment-only anchors (#section) point to an element with a matching id
 *   - External URLs return a 2xx or 3xx HTTP status
 *
 * Usage:
 *   node test-links.mjs              # full check (local + external)
 *   node test-links.mjs --local-only # skip external HTTP requests
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { load } from "cheerio";

const ROOT = dirname(new URL(import.meta.url).pathname);
const LOCAL_ONLY = process.argv.includes("--local-only");

const EXTERNAL_TIMEOUT_MS = 10_000;
const CONCURRENT_REQUESTS = 5;

// ── Collect HTML files ──────────────────────────────────────────────
const htmlFiles = readdirSync(ROOT).filter((f) => f.endsWith(".html"));

if (htmlFiles.length === 0) {
  console.error("No HTML files found in project root.");
  process.exit(1);
}

console.log(`Found ${htmlFiles.length} HTML file(s): ${htmlFiles.join(", ")}\n`);

// ── Extract links ───────────────────────────────────────────────────
/** @typedef {{ file: string, attr: string, url: string }} LinkEntry */
/** @type {LinkEntry[]} */
const links = [];

for (const file of htmlFiles) {
  const html = readFileSync(join(ROOT, file), "utf-8");
  const $ = load(html);

  $("[href]").each((_, el) => {
    const rel = $(el).attr("rel") || "";
    if (rel.includes("preconnect") || rel.includes("dns-prefetch")) return;
    const val = $(el).attr("href")?.trim();
    if (val) links.push({ file, attr: "href", url: val });
  });

  $("[src]").each((_, el) => {
    const val = $(el).attr("src")?.trim();
    if (val) links.push({ file, attr: "src", url: val });
  });
}

console.log(`Extracted ${links.length} link(s) across all files.\n`);

// ── Classify links ──────────────────────────────────────────────────
const localFileLinks = [];   // e.g. "styles.css", "privacy.html"
const fragmentLinks = [];    // e.g. "#features"
const externalLinks = [];    // e.g. "https://…"
const skipped = [];          // mailto:, tel:, javascript:, data:, bare "#"

for (const entry of links) {
  const { url } = entry;

  if (url === "#" || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("javascript:") || url.startsWith("data:")) {
    skipped.push(entry);
  } else if (url.startsWith("#")) {
    fragmentLinks.push(entry);
  } else if (/^https?:\/\//i.test(url)) {
    externalLinks.push(entry);
  } else {
    localFileLinks.push(entry);
  }
}

// ── Check local file links ──────────────────────────────────────────
const errors = [];

for (const entry of localFileLinks) {
  const target = resolve(ROOT, dirname(entry.file), entry.url.split("#")[0].split("?")[0]);
  if (!existsSync(target)) {
    errors.push({ ...entry, reason: `File not found: ${target}` });
  }
}

// ── Check fragment anchors ──────────────────────────────────────────
const idCache = new Map();

function getIds(file) {
  if (idCache.has(file)) return idCache.get(file);
  const html = readFileSync(join(ROOT, file), "utf-8");
  const $ = load(html);
  const ids = new Set();
  $("[id]").each((_, el) => ids.add($(el).attr("id")));
  idCache.set(file, ids);
  return ids;
}

for (const entry of fragmentLinks) {
  const fragment = entry.url.slice(1);
  const ids = getIds(entry.file);
  if (!ids.has(fragment)) {
    errors.push({ ...entry, reason: `No element with id="${fragment}" in ${entry.file}` });
  }
}

// ── Check external URLs ─────────────────────────────────────────────
async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EXTERNAL_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "DeadLinkChecker/1.0" },
    });
    clearTimeout(timer);
    if (!res.ok) {
      // Retry with GET — some servers reject HEAD
      const res2 = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
        redirect: "follow",
        headers: { "User-Agent": "DeadLinkChecker/1.0" },
      });
      return res2.ok ? null : `HTTP ${res2.status}`;
    }
    return null;
  } catch (err) {
    clearTimeout(timer);
    return err.name === "AbortError" ? "Timeout" : err.message;
  }
}

async function checkExternalLinks() {
  const uniqueUrls = [...new Set(externalLinks.map((e) => e.url))];
  console.log(`Checking ${uniqueUrls.length} unique external URL(s)…\n`);

  const results = new Map();

  for (let i = 0; i < uniqueUrls.length; i += CONCURRENT_REQUESTS) {
    const batch = uniqueUrls.slice(i, i + CONCURRENT_REQUESTS);
    const outcomes = await Promise.all(batch.map((url) => checkUrl(url)));
    batch.forEach((url, idx) => results.set(url, outcomes[idx]));

    const done = Math.min(i + CONCURRENT_REQUESTS, uniqueUrls.length);
    process.stdout.write(`  [${done}/${uniqueUrls.length}] checked\r`);
  }

  console.log();

  for (const entry of externalLinks) {
    const failure = results.get(entry.url);
    if (failure) {
      errors.push({ ...entry, reason: failure });
    }
  }
}

// ── Run ─────────────────────────────────────────────────────────────
if (!LOCAL_ONLY) {
  await checkExternalLinks();
} else {
  console.log("Skipping external URL checks (--local-only).\n");
}

// ── Report ──────────────────────────────────────────────────────────
console.log("─".repeat(60));
console.log(`  Local file links checked : ${localFileLinks.length}`);
console.log(`  Fragment anchors checked : ${fragmentLinks.length}`);
console.log(`  External URLs checked    : ${LOCAL_ONLY ? "skipped" : externalLinks.length}`);
console.log(`  Skipped (mailto/#/etc.)  : ${skipped.length}`);
console.log("─".repeat(60));

if (errors.length === 0) {
  console.log("\n✅  All links are valid!\n");
  process.exit(0);
} else {
  console.error(`\n❌  Found ${errors.length} broken link(s):\n`);
  for (const e of errors) {
    console.error(`  ${e.file}  ${e.attr}="${e.url}"`);
    console.error(`    → ${e.reason}\n`);
  }
  process.exit(1);
}
