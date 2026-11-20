// gta6-meme-x-01 entry: the entry is the X post itself.
// This program only copies POST.json (which names the post) into /output,
// where the gate reads it. The house then reads the post from X directly:
// its first picture and its text go to the judge.
// Run locally: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Read the post address and refuse a placeholder or non-X URL instead of
// silently copying a bad POST.json into /output.
const post = JSON.parse(readFileSync(join(botDir, "POST.json"), "utf8")) as {
  url?: unknown;
};
if (typeof post.url !== "string" || !/^https:\/\/(x\.com|twitter\.com)\/\w+\/status\/\d+$/.test(post.url)) {
  console.error("POST.json does not name a valid X post URL:", post.url);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "POST.json"), JSON.stringify({ url: post.url }) + "\n");
console.log("POST.json written to", join(outDir, "POST.json"), "for", post.url);
