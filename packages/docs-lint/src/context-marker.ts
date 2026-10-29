import type { Nodes, Root } from "mdast";
import type { VFile } from "vfile";
import { load } from "./yaml.js";

function isReady(tree: Root): boolean {
  const frontmatter = tree.children.find((node) => node.type === "yaml");
  if (!frontmatter) return false;
  try {
    const metadata = load(frontmatter.value);
    if (typeof metadata !== "object" || metadata === null || !("specdojo" in metadata)) {
      return false;
    }
    const specdojo = metadata.specdojo;
    return (
      typeof specdojo === "object" &&
      specdojo !== null &&
      "status" in specdojo &&
      specdojo.status === "ready"
    );
  } catch {
    // YAML 構文エラーは frontmatter 検証が報告する。
    return false;
  }
}

// 記法の説明（inlineCode）やコード例を指示と誤認せず、リスト・引用内の段落も検査する。
export function validateContextMarkers(tree: Root, file: VFile): void {
  const ready = isReady(tree);
  const source = String(file.value);
  function walk(node: Nodes): void {
    if (node.type === "paragraph") {
      const [marker, suffix] = node.children;
      if (
        marker?.type === "emphasis" &&
        source.slice(marker.position?.start.offset, marker.position?.end.offset) === "_CONTEXT_" &&
        suffix?.type === "text" &&
        suffix.value.startsWith(":")
      ) {
        const message = file.message(
          "未反映の `_CONTEXT_:` が残っています。draft で指示を本文へ反映し、元の指示を result に記録してください。",
          marker,
          "context-marker:unresolved-context",
        );
        message.fatal = ready;
      }
    }
    if ("children" in node) {
      for (const child of node.children) walk(child);
    }
  }
  walk(tree);
}
