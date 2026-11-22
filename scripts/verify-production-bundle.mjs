import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const webBundle = path.join(root, "dist", "assets", "index-C4Ju3GCt.js");
const androidBundle = path.join(
  root,
  "android",
  "app",
  "src",
  "main",
  "assets",
  "public",
  "assets",
  "index-C4Ju3GCt.js",
);
const web = fs.readFileSync(webBundle);
const android = fs.readFileSync(androidBundle);
const source = web.toString("utf8");
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");

assert.equal(hash(web), hash(android), "Web and Android bundles differ");
assert.ok(!source.includes("bu=E.useCallback(()=>{},[])"), "Meaning hint is still empty");
assert.ok(!source.includes("pu=E.useCallback(()=>{},[])"), "Letter hint is still empty");
assert.ok(source.includes("Bonus Kelime:"), "Bonus word acceptance is missing");
assert.ok(source.includes("const Zh=.62,Xh=.78;"), "Wheel tolerance patch is missing");
assert.ok(source.includes("Harfler karıştırıldı"), "Shuffle feedback is missing");
assert.ok(source.includes("spendHint:x"), "Hint spending is not wired");

console.log(`Bundle verification passed (${hash(web).slice(0, 12)}).`);
