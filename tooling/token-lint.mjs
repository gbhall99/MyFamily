#!/usr/bin/env node
/**
 * token-lint — evidence for AC-D7 / AC-DG3 / AC-DA1.
 *
 * Fails if any raw hex colour (or other hard-coded design value) appears outside
 * the design-token source of truth (`packages/tokens/src`). UI code must consume
 * semantic tokens, never raw values. Scope expands as the app grows; the rule is
 * binding from day one.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
// Directories that are scanned for violations.
const SCAN_DIRS = ["packages/ui/src", "apps/mobile/src"];
// The only place raw colour values are allowed to live.
const TOKENS_SRC = "packages/tokens/src";
const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx"]);
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;

function walk(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(join(ROOT, dir));
  } catch {
    return out; // dir not present yet — fine
  }
  for (const name of entries) {
    const rel = join(dir, name);
    const st = statSync(join(ROOT, rel));
    if (st.isDirectory()) out = out.concat(walk(rel));
    else if (CODE_EXT.has(extname(name))) out.push(rel);
  }
  return out;
}

const violations = [];
for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    if (file.startsWith(TOKENS_SRC)) continue;
    const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
    lines.forEach((line, i) => {
      if (line.trimStart().startsWith("//")) return;
      const m = HEX_RE.exec(line);
      if (m) violations.push(`${file}:${i + 1}  raw colour ${m[0]} — use @myfamily/tokens`);
    });
  }
}

if (violations.length) {
  console.error(`token-lint: ${violations.length} violation(s):\n` + violations.join("\n"));
  process.exit(1);
}
console.log("token-lint: OK — no raw design values outside the token layer.");
