import { unified } from "unified";
import remarkParse from "remark-parse";
import type { Heading, RootContent } from "mdast";
import { escapeMarkdownInline } from "../shared/text.js";

type HeadingNode = Heading & {
  position: {
    start: { offset: number };
    end: { offset: number };
  };
};

function isHeadingNode(node: RootContent): node is HeadingNode {
  return (
    node.type === "heading" &&
    node.position?.start.offset !== undefined &&
    node.position?.end.offset !== undefined
  );
}

function headingTitle(body: string, node: HeadingNode): string {
  return body
    .slice(node.position.start.offset, node.position.end.offset)
    .replace(/^#+\s+/, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

// 本文の見出しだけを探す。コード例・引用内の「入力」は節として扱わない。
function findInputSection(content: string) {
  const prefix = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)?.[0] ?? "";
  const body = content.slice(prefix.length);
  if (!/^##\s+(?:\d+\.\s*)?入力(?:\s|$)/m.test(body)) return undefined;
  const nodes = unified().use(remarkParse).parse(body).children;
  const index = nodes.findIndex(
    (node) =>
      isHeadingNode(node) &&
      node.depth === 2 &&
      /^(?:\d+\.\s*)?入力$/.test(headingTitle(body, node)),
  );
  if (index < 0) return undefined;
  const heading = nodes[index];
  if (!isHeadingNode(heading)) return undefined;
  const title = headingTitle(body, heading);
  const isNumbered = /^\d+\.\s*入力$/.test(title);
  const next = nodes.slice(index + 1).findIndex((node) => isHeadingNode(node) && node.depth <= 2);
  const endIndex = next < 0 ? nodes.length : index + 1 + next;
  return {
    body,
    nodes: nodes.slice(index + 1, endIndex),
    isNumbered,
    sectionStart: prefix.length + heading.position.start.offset,
    start: prefix.length + heading.position.end.offset,
    end: prefix.length + (nodes[endIndex]?.position?.start.offset ?? body.length),
  };
}

export function readRegisterInput(content: string): string[] | undefined {
  const section = findInputSection(content);
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
  const existingSection = findInputSection(content);
  const text = inputs.length > 0 ? registerInputMarkdown(inputs) : "-";

  // すでに番号付きの入力章がある場合は、既存の位置・番号のまま中身を置換する
  if (existingSection && existingSection.isNumbered) {
    const tail = content.slice(existingSection.end);
    return `${content.slice(0, existingSection.start)}\n\n${text}\n${tail ? `\n${tail}` : ""}`;
  }

  // 番号なしの「## 入力」がある場合は一旦除去する
  let cleanContent = content;
  if (existingSection && !existingSection.isNumbered) {
    if (existingSection.end >= content.length) {
      cleanContent = `${content.slice(0, existingSection.sectionStart).trimEnd()}\n`;
    } else {
      const before = content.slice(0, existingSection.sectionStart).trimEnd();
      const after = content.slice(existingSection.end).trimStart();
      cleanContent = `${before}\n\n${after}`;
    }
  }

  const prefix = cleanContent.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)?.[0] ?? "";
  const body = cleanContent.slice(prefix.length);
  const nodes = unified().use(remarkParse).parse(body).children;
  const h2Nodes = nodes.filter(
    (node): node is HeadingNode => isHeadingNode(node) && node.depth === 2,
  );

  // H2 見出しが 1 つもない場合
  if (h2Nodes.length === 0) {
    return `${cleanContent.trimEnd()}\n\n## 1. 入力\n\n${text}\n`;
  }

  const firstH2 = h2Nodes[0];
  const firstTitle = headingTitle(body, firstH2);
  const firstMatch = firstTitle.match(/^(\d+)\./);
  const inputNum = firstMatch ? parseInt(firstMatch[1], 10) + 1 : 2;
  const inputSectionText = `## ${inputNum}. 入力\n\n${text}\n\n`;

  // 第1章のみで、第2章以降がない場合
  if (h2Nodes.length === 1) {
    return `${prefix}${body.trimEnd()}\n\n## ${inputNum}. 入力\n\n${text}\n`;
  }

  // 第2章以降がある場合: 第2章の直前に挿入し、以降の見出し番号を繰り下げる
  const splitOffset = h2Nodes[1].position.start.offset;
  const head = `${body.slice(0, splitOffset).trimEnd()}\n\n`;
  const tail = body.slice(splitOffset);

  // tail 内の見出し番号を置換するためのエディットを収集
  type TextEdit = { start: number; end: number; replacement: string };
  const edits: TextEdit[] = [];
  let currentOldH2Num: number | undefined;

  for (const node of nodes) {
    if (!isHeadingNode(node) || node.position.start.offset < splitOffset) continue;

    const startInTail = node.position.start.offset - splitOffset;
    const endInTail = node.position.end.offset - splitOffset;
    const raw = tail.slice(startInTail, endInTail);

    if (node.depth === 2) {
      const match = raw.match(/^(##\s+)(\d+)(\..*)$/);
      if (match) {
        const oldNum = parseInt(match[2], 10);
        const newNum = oldNum + 1;
        currentOldH2Num = oldNum;
        edits.push({
          start: startInTail,
          end: endInTail,
          replacement: `${match[1]}${newNum}${match[3]}`,
        });
      } else {
        currentOldH2Num = undefined;
      }
    } else if (node.depth > 2 && currentOldH2Num !== undefined) {
      const subMatch = raw.match(/^(#{3,6}\s+)(\d+)(\..*)$/);
      if (subMatch && parseInt(subMatch[2], 10) === currentOldH2Num) {
        const newNum = currentOldH2Num + 1;
        edits.push({
          start: startInTail,
          end: endInTail,
          replacement: `${subMatch[1]}${newNum}${subMatch[3]}`,
        });
      }
    }
  }

  // 後ろから適用してオフセットのズレを防ぐ
  edits.sort((a, b) => b.start - a.start);
  let updatedTail = tail;
  for (const edit of edits) {
    updatedTail = updatedTail.slice(0, edit.start) + edit.replacement + updatedTail.slice(edit.end);
  }

  return `${prefix}${head}${inputSectionText}${updatedTail}`;
}

export function registerInputSection(inputs: readonly string[] | undefined): string {
  return inputs?.length
    ? `## 個票の入力（前提）\n\n次の入力を作業の前提として参照する。完了条件は別節に従う。\n\n${registerInputMarkdown(inputs)}\n`
    : "";
}
