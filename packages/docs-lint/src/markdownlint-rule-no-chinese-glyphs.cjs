"use strict";

const CHINESE_GLYPHS = new Map([
  ["业", "業"],
  ["务", "務"],
  ["为", "為"],
  ["时", "時"],
  ["这", "這"],
  ["们", "們"],
  ["个", "個"],
  ["说", "説"],
  ["对", "対"],
  ["关", "関"],
  ["发", "発"],
  ["问", "問"],
  ["题", "題"],
  ["实", "実"],
  ["现", "現"],
  ["进", "進"],
  ["还", "還"],
  ["过", "過"],
  ["样", "様"],
  ["揭", "掲"],
]);

const CHINESE_CHARS_REGEX = new RegExp(`[${Array.from(CHINESE_GLYPHS.keys()).join("")}]`, "g");

module.exports = {
  names: ["MD061", "no-chinese-glyphs"],
  description: "Detects simplified Chinese glyphs used by mistake in Japanese documents.",
  tags: ["language"],
  function: function rule(params, onError) {
    params.tokens.forEach((token) => {
      if (token.type === "inline") {
        let inLink = false;
        token.children.forEach((child) => {
          if (child.type === "link_open") {
            inLink = true;
          } else if (child.type === "link_close") {
            inLink = false;
          } else if (child.type === "text" && !inLink) {
            let match;
            // RegExpのlastIndexをリセットするために都度マッチを行うか、ローカルな正規表現を使う
            const regex = new RegExp(`[${Array.from(CHINESE_GLYPHS.keys()).join("")}]`, "g");
            while ((match = regex.exec(child.content)) !== null) {
              const char = match[0];
              const jpChar = CHINESE_GLYPHS.get(char);
              onError({
                lineNumber: child.lineNumber,
                detail: `中国語の簡体字 '${char}' を検知しました。日本語の '${jpChar}' などに修正してください。`,
                context: child.content.substring(Math.max(0, match.index - 10), match.index + 11),
                range: [child.line_char + match.index + 1, 1], // markdownlint uses 1-indexed range if possible, or 0? Usually 1-indexed. Wait, actually child.line_char is 1-indexed usually? let's check
              });
            }
          }
        });
      }
    });
  },
};
