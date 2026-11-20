import { existsSync, readFileSync } from "node:fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import type { Heading, Root, RootContent } from "mdast";

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

function hasHeadingNode(node: Root | RootContent): boolean {
  if (node.type === "heading") {
    return true;
  }
  if ("children" in node && Array.isArray(node.children)) {
    return (node.children as RootContent[]).some(hasHeadingNode);
  }
  return false;
}

function headingTitle(body: string, node: HeadingNode): string {
  return body
    .slice(node.position.start.offset, node.position.end.offset)
    .replace(/^#+\s+/, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

/**
 * 見出し文字列から先頭の章番号（例: "1. ", "3.1. ", "4 "）を除いた章名を返す。
 */
export function stripSectionNumber(headingText: string): string {
  return headingText.replace(/^\d+(?:\.\d+)*\.?\s*/, "").trim();
}

/**
 * 差し替え用ファイルを検証し、その本文を返す。
 * ファイルが存在しない・読めない場合や、中身に Markdown 見出しが含まれる場合はエラーを投げる。
 */
export function validateSectionFile(filePath: string): string {
  if (!existsSync(filePath)) {
    throw new Error(`Cannot read section file: ${filePath}`);
  }
  let fileContent: string;
  try {
    fileContent = readFileSync(filePath, "utf8");
  } catch (error) {
    throw new Error(`Cannot read section file: ${filePath}`, { cause: error });
  }

  const tree = unified().use(remarkParse).parse(fileContent);
  if (hasHeadingNode(tree)) {
    throw new Error(`Section file must not contain markdown headings: ${filePath}`);
  }

  return fileContent;
}

/**
 * 個票 Markdown から指定された章の本文を差し替える。
 * 見出し行は残し、次の同じ深さ（または浅い）見出しまでの本文だけを置き換える。
 */
export function replaceTicketSection(
  content: string,
  sectionName: string,
  newBody: string,
): { content: string; changed: boolean; beforeBody: string } {
  const prefix = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)?.[0] ?? "";
  const body = content.slice(prefix.length);

  const targetName = sectionName.trim();
  if (targetName === "") {
    throw new Error("Section name must not be empty");
  }

  const tree = unified().use(remarkParse).parse(body);
  const nodes = tree.children;

  // まず H2 見出し（個票の章の標準）から探す
  let headingIndex = nodes.findIndex(
    (node) =>
      isHeadingNode(node) &&
      node.depth === 2 &&
      stripSectionNumber(headingTitle(body, node)) === targetName,
  );

  // H2 にない場合は任意の見出しから探す
  if (headingIndex < 0) {
    headingIndex = nodes.findIndex(
      (node) => isHeadingNode(node) && stripSectionNumber(headingTitle(body, node)) === targetName,
    );
  }

  if (headingIndex < 0) {
    throw new Error(`Section "${targetName}" not found in ticket`);
  }

  const targetHeading = nodes[headingIndex] as HeadingNode;
  const targetDepth = targetHeading.depth;

  // 次の同じ深さ（またはそれより浅い）見出しを探す
  const nextHeadingRelativeIndex = nodes
    .slice(headingIndex + 1)
    .findIndex((node) => isHeadingNode(node) && node.depth <= targetDepth);

  const nextHeading =
    nextHeadingRelativeIndex >= 0
      ? (nodes[headingIndex + 1 + nextHeadingRelativeIndex] as HeadingNode)
      : undefined;

  const bodyStartOffset = targetHeading.position.end.offset;
  const bodyEndOffset = nextHeading ? nextHeading.position.start.offset : body.length;

  const beforeBody = body.slice(bodyStartOffset, bodyEndOffset).trim();
  const trimmedNewBody = newBody.trim();
  const changed = beforeBody !== trimmedNewBody;

  const head = body.slice(0, bodyStartOffset);
  const tail = nextHeading ? body.slice(bodyEndOffset) : "";

  let updatedBody: string;
  if (trimmedNewBody.length > 0) {
    if (tail.length > 0) {
      updatedBody = `${head.trimEnd()}\n\n${trimmedNewBody}\n\n${tail.trimStart()}`;
    } else {
      updatedBody = `${head.trimEnd()}\n\n${trimmedNewBody}\n`;
    }
  } else {
    if (tail.length > 0) {
      updatedBody = `${head.trimEnd()}\n\n${tail.trimStart()}`;
    } else {
      updatedBody = `${head.trimEnd()}\n`;
    }
  }

  return {
    content: `${prefix}${updatedBody}`,
    changed,
    beforeBody,
  };
}
