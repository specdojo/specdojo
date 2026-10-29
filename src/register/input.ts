import { unified } from "unified";
import remarkParse from "remark-parse";
import { escapeMarkdownInline } from "../shared/text.js";

// 本文の見出しだけを探す。コード例・引用内の「入力」は節として扱わない。
function inputSection(content: string) {
  const prefix = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)?.[0] ?? "";
  const body = content.slice(prefix.length);
  if (!/^##\s+(?:\d+\.\s*)?入力(?:\s|$)/m.test(body)) return undefined;
  const nodes = unified().use(remarkParse).parse(body).children;
  const index = nodes.findIndex(
    (node) =>
      node.type === "heading" &&
      node.depth === 2 &&
      /^(?:\d+\.\s*)?入力$/.test(
        body
          .slice(node.position!.start.offset, node.position!.end.offset)
          .replace(/^##\s+/, "")
          .replace(/\s+#+\s*$/, "")
          .trim(),
      ),
  );
  if (index < 0) return undefined;
  const heading = nodes[index];
  const next = nodes
    .slice(index + 1)
    .findIndex((node) => node.type === "heading" && node.depth <= 2);
  const endIndex = next < 0 ? nodes.length : index + 1 + next;
  return {
    body,
    nodes: nodes.slice(index + 1, endIndex),
    start: prefix.length + heading.position!.end.offset!,
    end: prefix.length + (nodes[endIndex]?.position?.start.offset ?? body.length),
  };
}

export function readRegisterInput(content: string): string[] | undefined {
  const section = inputSection(content);
  if (!section) return undefined;
  const inputs = section.nodes
    .flatMap((node) =>
      node.type === "list"
        ? node.children.map((item) =>
            section.body
              .slice(item.position!.start.offset, item.position!.end.offset)
              .replace(/^(?:[-*+]|\d+[.)])\s+/, "")
              .replace(/\r?\n {2}/g, "\n")
              .trim(),
          )
        : [],
    )
    .filter((value) => value !== "" && value !== "-");
  return inputs.length > 0 ? inputs : undefined;
}

export function normalizeRegisterInput(
  values: string[] | undefined,
  allowRemove = false,
): string[] | undefined {
  if (values === undefined) return undefined;
  const inputs = values.map((value) => value.replace(/\r\n/g, "\n").trim());
  if (inputs.includes("-")) {
    if (!allowRemove) throw new Error("--input - is only valid with register update");
    if (inputs.length !== 1) throw new Error("--input - cannot be combined with other inputs");
    return [];
  }
  if (inputs.some((value) => value === "")) throw new Error("--input must contain non-empty text");
  return inputs;
}

export function registerInputMarkdown(inputs: readonly string[]): string {
  return inputs
    .map((input) => `- ${escapeMarkdownInline(input).replace(/\n/g, "\n  ")}`)
    .join("\n");
}

export function setRegisterInput(content: string, inputs: readonly string[]): string {
  const section = inputSection(content);
  const text = inputs.length > 0 ? registerInputMarkdown(inputs) : "-";
  if (!section) return `${content.trimEnd()}\n\n## 入力\n\n${text}\n`;
  const tail = content.slice(section.end);
  return `${content.slice(0, section.start)}\n\n${text}\n${tail ? `\n${tail}` : ""}`;
}

export function registerInputSection(inputs: readonly string[] | undefined): string {
  return inputs?.length
    ? `## 個票の入力（前提）\n\n次の入力を作業の前提として参照する。完了条件は別節に従う。\n\n${registerInputMarkdown(inputs)}\n`
    : "";
}
