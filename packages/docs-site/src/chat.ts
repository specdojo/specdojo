export interface ChatMessage {
  speaker: string;
  side: "user" | "bot";
  lines: string[];
}

const USER_SPEAKERS = new Set([
  "あなた",
  "利用者",
  "ユーザー",
  "ユーザ",
  "user",
  "you",
  "me",
  "human",
  "client",
]);

export function resolveSpeakerSide(speaker: string): "user" | "bot" {
  const normalized = speaker.trim().toLowerCase();
  return USER_SPEAKERS.has(normalized) ? "user" : "bot";
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInline(text: string): string {
  const escaped = escapeHtml(text);
  return escaped.replace(/`([^`\n]+)`/g, "<code>$1</code>");
}

export function parseChatMessages(code: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  let currentMsg: ChatMessage | null = null;

  for (const line of code.split(/\r?\n/)) {
    // Blank separators never become message content, even between continuation lines.
    if (line.trim() === "") continue;

    const isIndented = /^\s/.test(line);
    const speakerMatch = !isIndented ? line.match(/^([^:：\n]+?)[:：]\s*(.*)$/) : null;

    if (speakerMatch) {
      const speaker = speakerMatch[1].trim();
      const rest = speakerMatch[2];
      const side = resolveSpeakerSide(speaker);
      currentMsg = {
        speaker,
        side,
        lines: rest.length > 0 ? [rest] : [],
      };
      messages.push(currentMsg);
    } else {
      if (currentMsg) {
        currentMsg.lines.push(line);
      } else {
        currentMsg = {
          speaker: "オーケストレーター",
          side: "bot",
          lines: [line],
        };
        messages.push(currentMsg);
      }
    }
  }

  return messages;
}

const USER_ICON_SVG =
  '<svg class="chat-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';

const BOT_ICON_SVG =
  '<svg class="chat-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-1h-6v-2h6v2zm-8.3-2.7L6.4 17l-1.4-1.4 2.3-2.3-2.3-2.3L6.4 9.6l3.3 3.3z"/></svg>';

// <pre> keeps continuation whitespace intact through Vue's template compiler.
function renderBubble(messages: ChatMessage[]): string {
  const items = messages
    .map((msg) => {
      const isUser = msg.side === "user";
      const icon = isUser ? USER_ICON_SVG : BOT_ICON_SVG;
      const roleClass = isUser ? "chat-item-user" : "chat-item-bot";
      const speakerName = escapeHtml(msg.speaker);
      const bodyContent = msg.lines.map(formatInline).join("\n");

      return `  <div class="chat-item ${roleClass}">
    <div class="chat-header">
      <span class="chat-avatar">${icon}</span>
      <span class="chat-name">${speakerName}</span>
    </div>
    <pre class="chat-bubble-body">${bodyContent}</pre>
  </div>`;
    })
    .join("\n");

  return `<div class="specdojo-chat specdojo-chat-bubble" v-pre>\n${items}\n</div>\n`;
}

function renderTui(messages: ChatMessage[]): string {
  const items = messages
    .map((msg) => {
      const isUser = msg.side === "user";
      const marker = isUser ? "&gt;" : "●";
      const markerClass = isUser ? "chat-tui-marker-user" : "chat-tui-marker-bot";
      const roleClass = isUser ? "chat-tui-user" : "chat-tui-bot";
      const speakerName = escapeHtml(msg.speaker);
      const bodyContent = msg.lines.map(formatInline).join("\n");

      // Keep template whitespace out of the pre-wrapped terminal line.
      return `  <pre class="chat-tui-item ${roleClass}"><span class="chat-tui-marker ${markerClass}" aria-hidden="true">${marker}</span> <span class="chat-tui-speaker">${speakerName}:</span> <span class="chat-tui-content">${bodyContent}</span></pre>`;
    })
    .join("\n");

  return `<div class="specdojo-chat specdojo-chat-tui" v-pre>\n${items}\n</div>\n`;
}

export function isChatFence(info: string): boolean {
  const trimmed = info.trim();
  if (!trimmed) return false;
  const first = trimmed.split(/\s+/)[0];
  return first === "chat";
}

export function renderChat(code: string, info: string = "chat"): string {
  const tokens = info.trim().split(/\s+/);
  const isTui = tokens.slice(1).some((t) => t.toLowerCase() === "tui");
  const messages = parseChatMessages(code);

  return isTui ? renderTui(messages) : renderBubble(messages);
}
