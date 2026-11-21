import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";

export const D2_VERSION = "0.9.0";
export const D2_LAYOUT = "elk";
// VitePress bundles markdown-it internally, so depend on it directly to parse fences the same way.
const require = createRequire(import.meta.url);
const MarkdownIt = require("markdown-it");
const parser = new MarkdownIt({ html: true });

export function extractD2Blocks(markdown, file = "") {
  // Keep original source line numbers while hiding YAML frontmatter from Markdown.
  const source = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, (value) =>
    value.replace(/[^\n]/gu, ""),
  );
  return parser
    .parse(source, {})
    .filter((token) => token.type === "fence" && token.info.trim().split(/\s/u)[0] === "d2")
    .map((token) => ({ file, line: token.map[0] + 1, code: token.content.trim() }));
}

export function d2SvgId(code) {
  return createHash("sha256")
    .update(`${D2_VERSION}\n${D2_LAYOUT}\n${code.trim()}`)
    .digest("hex")
    .slice(0, 8);
}

function runD2(args, input) {
  try {
    return execFileSync("d2", args, {
      input,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 120_000,
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`D2 CLI not found: install d2 v${D2_VERSION} and add it to PATH.`, {
        cause: error,
      });
    }
    throw new Error(error.stderr?.toString().trim() || error.message, { cause: error });
  }
}

export function assertD2Version() {
  const actual = runD2(["version"]).trim().replace(/^v/u, "");
  if (actual !== D2_VERSION) {
    throw new Error(
      `D2 CLI version mismatch: expected ${D2_VERSION}, got ${actual}. Install d2 v${D2_VERSION}.`,
    );
  }
}

export function renderD2(code) {
  // SVG via stdout avoids temporary source/output files, including partial caches.
  const svg = runD2(
    ["--layout", D2_LAYOUT, "--theme", "0", "--scale", "1", "--target", "", "-", "-"],
    code,
  );
  if (!/<svg\b/u.test(svg)) throw new Error("D2 CLI did not produce SVG output.");
  return svg;
}

export function validateD2(code) {
  runD2(["validate", "-"], code);
}
