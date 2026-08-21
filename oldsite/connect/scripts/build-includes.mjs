#!/usr/bin/env node
// Build-time HTML include step (plan.md §10.4 item 1 / architecture review §4.2).
// Physically inlines a canonical component's contents between a managed
// "include:start" / "include:end" marker pair, so navbar.html / footer.html /
// how-it-works.html get re-synced at commit/CI time instead of hand-copied
// into every page. Markers persist after a run, so re-running is idempotent
// and future edits to the canonical component just need a re-run to propagate.
//
// Marker syntax (root-relative src, matching this repo's link convention):
//   <!-- include:start src="/commercial/components/navbar.html" -->
//   ...physically-inlined content, kept in sync by this script...
//   <!-- include:end -->
//
// Usage:
//   node connect/scripts/build-includes.mjs              # sync every .html file in the repo
//   node connect/scripts/build-includes.mjs file1.html …  # sync only the given files
//   node connect/scripts/build-includes.mjs --check       # fail (exit 1) if anything is out of sync, don't write

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SKIP_DIRS = new Set(["node_modules", "_internal", ".git"]);
const MARKER_RE =
  /<!--\s*include:start\s+src="([^"]+)"\s*-->[\s\S]*?<!--\s*include:end\s*-->/g;

async function walkHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walkHtmlFiles(full)));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

async function renderBlock(src) {
  const partial = await readFile(join(ROOT, src), "utf8");
  return `<!-- include:start src="${src}" -->\n${partial.trim()}\n<!-- include:end -->`;
}

async function processFile(filePath, { check }) {
  const original = await readFile(filePath, "utf8");
  if (!MARKER_RE.test(original)) return null;
  MARKER_RE.lastIndex = 0;

  const matches = [...original.matchAll(MARKER_RE)];
  let updated = original;
  for (const match of matches) {
    const [block, src] = match;
    const rendered = await renderBlock(src);
    if (block !== rendered) updated = updated.replace(block, rendered);
  }

  if (updated === original) return false;
  if (!check) await writeFile(filePath, updated, "utf8");
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const explicitFiles = args.filter((a) => !a.startsWith("--"));

  const targets = explicitFiles.length
    ? explicitFiles.map((f) => resolve(process.cwd(), f))
    : await walkHtmlFiles(ROOT);

  let outOfSync = 0;
  for (const file of targets) {
    const result = await processFile(file, { check });
    if (result) {
      outOfSync++;
      const label = check ? "out of sync" : "updated";
      console.log(`${label}: ${relative(ROOT, file)}`);
    }
  }

  if (check && outOfSync > 0) {
    console.error(
      `\n${outOfSync} file(s) out of sync with their canonical include source. Run without --check to fix.`,
    );
    process.exit(1);
  }

  console.log(
    check
      ? `All managed includes are in sync (${targets.length} file(s) checked).`
      : `${outOfSync} file(s) updated (${targets.length} file(s) checked).`,
  );
}

main();
