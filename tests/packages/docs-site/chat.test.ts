import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import * as docsChat from "../../../packages/docs-site/src/chat.js";
import * as vscodeChat from "../../../packages/vscode-specdojo/src/chat.js";
import { extendChatMarkdownIt } from "../../../packages/vscode-specdojo/src/chat-preview.js";

type FenceRule = (
  tokens: { info: string; content: string }[],
  idx: number,
  options: unknown,
  env: unknown,
  self: unknown,
) => string;

// markdown-it belongs to docs-site; keep its untyped runtime import local to this test.
const require = createRequire(new URL("../../../packages/docs-site/package.json", import.meta.url));
const MarkdownIt = require("markdown-it") as new () => {
  renderer: { rules: { fence: FenceRule } };
  render: (markdown: string) => string;
};
const { compile } = require("@vue/compiler-dom") as {
  compile: (source: string, options: { mode: "module" }) => { code: string };
};

describe("chat renderer parity", () => {
  it.each(["chat", "chat tui", "chat TUI"])(
    "keeps docs-site and VS Code output identical in %s",
    (info) => {
      const transcripts = [
        "あなた: 一行目\nAI: 次の発言",
        "\r\nUSER：`command`\r\n\r\n  続き: <tag>\r\n \t\r\n    箇条書き\r\n\r\nレビュー: {{ value }} & done\r\n",
        "話者なし\n\n  続き\nme:\n\nclient: はい",
        "\n \t\n",
      ];
      for (const code of transcripts) {
        expect(vscodeChat.parseChatMessages(code)).toEqual(docsChat.parseChatMessages(code));
        expect(vscodeChat.renderChat(code, info)).toBe(docsChat.renderChat(code, info));
      }
    },
  );
});

describe.each([
  ["docs-site", docsChat],
  ["vscode", vscodeChat],
] as const)(
  "%s chat renderer",
  (target, { isChatFence, parseChatMessages, renderChat, resolveSpeakerSide }) => {
    describe("resolveSpeakerSide", () => {
      it("recognizes standard user keywords as user side", () => {
        expect(resolveSpeakerSide("あなた")).toBe("user");
        expect(resolveSpeakerSide("利用者")).toBe("user");
        expect(resolveSpeakerSide("ユーザー")).toBe("user");
        expect(resolveSpeakerSide("ユーザ")).toBe("user");
        expect(resolveSpeakerSide("user")).toBe("user");
        expect(resolveSpeakerSide("User")).toBe("user");
        expect(resolveSpeakerSide("YOU")).toBe("user");
        expect(resolveSpeakerSide("human")).toBe("user");
        expect(resolveSpeakerSide("client")).toBe("user");
      });

      it("treats orchestrator and other arbitrary speakers as bot side", () => {
        expect(resolveSpeakerSide("オーケストレーター")).toBe("bot");
        expect(resolveSpeakerSide("orchestrator")).toBe("bot");
        expect(resolveSpeakerSide("AI")).toBe("bot");
        expect(resolveSpeakerSide("sol-executor")).toBe("bot");
        expect(resolveSpeakerSide("BA")).toBe("bot");
        expect(resolveSpeakerSide("レビュー担当")).toBe("bot");
      });
    });

    describe("parseChatMessages", () => {
      it("ignores empty and whitespace-only lines without ending a continuation", () => {
        const code =
          "\r\n \t\r\nあなた: 最初\r\n\r\n  続き: 内容\r\n  \t\r\n    さらに続き\r\n\r\n\r\nAI: 次\r\n\r\n";
        expect(parseChatMessages(code)).toEqual([
          { speaker: "あなた", side: "user", lines: ["最初", "  続き: 内容", "    さらに続き"] },
          { speaker: "AI", side: "bot", lines: ["次"] },
        ]);
        expect(parseChatMessages("\n \t\n")).toEqual([]);
        expect(parseChatMessages("あなた:\n\nAI: 次")[0].lines).toEqual([]);
      });

      it("parses alternating dialogue and keeps indentation of continuation lines", () => {
        const code = [
          "あなた: 導入ができました。",
          "オーケストレーター: 初期化を確認しました。",
          "  ・項目 1: 詳細",
          "  ・項目 2: `specdojo.config.json`",
          "あなた: はい、お願いします。",
        ].join("\n");

        const messages = parseChatMessages(code);
        expect(messages).toHaveLength(3);

        expect(messages[0]).toEqual({
          speaker: "あなた",
          side: "user",
          lines: ["導入ができました。"],
        });

        expect(messages[1]).toEqual({
          speaker: "オーケストレーター",
          side: "bot",
          lines: [
            "初期化を確認しました。",
            "  ・項目 1: 詳細",
            "  ・項目 2: `specdojo.config.json`",
          ],
        });

        expect(messages[2]).toEqual({
          speaker: "あなた",
          side: "user",
          lines: ["はい、お願いします。"],
        });
      });

      it("handles full-width colon and fallback when starting without speaker", () => {
        const code = "最初の案内文\nあなた：了解しました。";
        const messages = parseChatMessages(code);
        expect(messages).toHaveLength(2);
        expect(messages[0].speaker).toBe("オーケストレーター");
        expect(messages[0].lines).toEqual(["最初の案内文"]);
        expect(messages[1].speaker).toBe("あなた");
        expect(messages[1].side).toBe("user");
        expect(messages[1].lines).toEqual(["了解しました。"]);
      });
    });

    it.each(["chat", "chat tui"])(
      "renders identical messages with or without blank separators in %s",
      (info) => {
        const compact = "あなた: `command`\n  続き\n    箇条書き: 内容\nAI: 完了";
        const spaced = "\nあなた: `command`\n\n  続き\n  \n    箇条書き: 内容\n\nAI: 完了\n";
        expect(renderChat(spaced, info)).toBe(renderChat(compact, info));
      },
    );

    describe("renderChat - bubble mode", () => {
      it("renders bubble layout with avatars and formatted inline code", () => {
        const code = [
          "あなた: 設定を確認したいです。",
          "オーケストレーター: `specdojo.config.json` の設定内容です:",
          "  ・<task-id> を指定してください",
        ].join("\n");

        const html = renderChat(code, "chat");

        expect(html).toContain('class="specdojo-chat specdojo-chat-bubble"');
        expect(html).toContain("chat-item chat-item-user");
        expect(html).toContain("chat-item chat-item-bot");
        expect(html).toContain("chat-avatar");
        expect(html).toContain('<span class="chat-name">あなた</span>');
        expect(html).toContain('<span class="chat-name">オーケストレーター</span>');
        // Inline code
        expect(html).toContain("<code>specdojo.config.json</code>");
        // Escaped HTML
        expect(html).toContain("&lt;task-id&gt;");
        // Preserved indentation and newline
        expect(html).toContain("  ・&lt;task-id&gt; を指定してください");
      });
    });

    describe("renderChat - TUI mode", () => {
      it("renders TUI layout with > prompt for user and ● prompt for bot", () => {
        const code = [
          "あなた: 実行してください。",
          "オーケストレーター: コマンドを実行しました:",
          "  完了: `done`",
        ].join("\n");

        const html = renderChat(code, "chat tui");

        expect(html).toContain('class="specdojo-chat specdojo-chat-tui"');
        expect(html).toContain("chat-tui-item chat-tui-user");
        expect(html).toContain("chat-tui-item chat-tui-bot");
        expect(html).toContain(
          'class="chat-tui-marker chat-tui-marker-user" aria-hidden="true">&gt;</span>',
        );
        expect(html).toContain(
          'class="chat-tui-marker chat-tui-marker-bot" aria-hidden="true">●</span>',
        );
        expect(html).toContain('<span class="chat-tui-speaker">あなた:</span>');
        expect(html).toContain('<span class="chat-tui-speaker">オーケストレーター:</span>');
        expect(html).toContain("<code>done</code>");
        expect(html).toContain("  完了: <code>done</code>");
        expect(html).toContain('<pre class="chat-tui-item chat-tui-user"><span');
        expect(html).not.toContain('chat-tui-user">\n');
      });

      it("recognizes case-insensitive 'tui' modifier with whitespace", () => {
        const code = "あなた: テスト";
        const html = renderChat(code, "chat   TUI  ");
        expect(html).toContain("specdojo-chat-tui");
      });
    });

    it.each(["chat", "chat tui"])("keeps HTML and Vue expressions literal in %s", (info) => {
      const html = renderChat(
        'あなた: <script>alert("x")</script> & {{ secret }}\nレビュー<img>: `<img onerror="x">`',
        info,
      );
      expect(html).toContain(" v-pre>");
      expect(html).toContain(
        "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; {{ secret }}",
      );
      expect(html).toContain("レビュー&lt;img&gt;");
      expect(html).toContain("<code>&lt;img onerror=&quot;x&quot;&gt;</code>");
      expect(html).not.toContain("<script>");
      expect(html).not.toContain("<img");
    });

    it.each(["chat", "chat tui"])(
      "preserves continuation whitespace through Vue compilation in %s",
      (info) => {
        const code = "あなた: 一行目\n  続き\n    ・項目\nオーケストレーター: {{ secret }}";
        const compiled = compile(renderChat(code, info), { mode: "module" }).code;
        expect(compiled).toContain(JSON.stringify("一行目\n  続き\n    ・項目"));
        expect(compiled).toContain("{{ secret }}");
        expect(compiled).not.toContain("_ctx.secret");
      },
    );

    describe("isChatFence", () => {
      it("correctly identifies chat language blocks and ignores other languages", () => {
        expect(isChatFence("chat")).toBe(true);
        expect(isChatFence("chat tui")).toBe(true);
        expect(isChatFence("chat bubble")).toBe(true);
        expect(isChatFence("  chat  tui ")).toBe(true);
        expect(isChatFence("text")).toBe(false);
        expect(isChatFence("typescript")).toBe(false);
        expect(isChatFence("bash")).toBe(false);
        expect(isChatFence("mermaid")).toBe(false);
        expect(isChatFence("chatbot")).toBe(false);
        expect(isChatFence("")).toBe(false);
      });
    });

    describe("markdown-it fence integration", () => {
      it("intercepts only chat code blocks and preserves default fence for other languages", () => {
        const md = new MarkdownIt();
        const defaultFence = md.renderer.rules.fence!;

        if (target === "vscode") {
          extendChatMarkdownIt(md);
        } else {
          md.renderer.rules.fence = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            const info = (token.info || "").trim();

            if (isChatFence(info)) {
              return renderChat(token.content, info);
            }

            return defaultFence(tokens, idx, options, env, self);
          };
        }

        const markdown = [
          "```text",
          "plain text block",
          "```",
          "",
          "```chat",
          "あなた: こんにちは",
          "",
          "オーケストレーター: はい、何か御用ですか？",
          "  続き: `command`",
          "```",
          "",
          "```chat tui",
          "USER: 実行",
          "",
          "AI: 完了",
          "```",
          "",
          "```typescript",
          "const answer: number = 42;",
          "```",
        ].join("\n");

        const output = md.render(markdown);

        // plain text block should be rendered with standard <pre><code class="language-text">
        expect(output).toContain("<pre><code");
        expect(output).toContain("plain text block");

        // chat block should be replaced with chat component
        expect(output).toContain('class="specdojo-chat specdojo-chat-bubble"');
        expect(output).toContain("こんにちは");
        expect(output).toContain("何か御用ですか？");
        expect(output).toContain("  続き: <code>command</code>");
        expect(output).toContain('class="specdojo-chat specdojo-chat-tui"');
        expect(output).toContain('aria-hidden="true">&gt;</span>');
        expect(output).toContain('aria-hidden="true">●</span>');

        // typescript block should be rendered normally
        expect(output).toContain('class="language-typescript"');
        expect(output).toContain("const answer: number = 42;");
      });
    });
  },
);
