import { isChatFence, renderChat } from "./chat";

type FenceRule = (
  tokens: { info: string; content: string }[],
  idx: number,
  options: unknown,
  env: unknown,
  self: { renderToken: (tokens: unknown[], idx: number, options: unknown) => string },
) => string;

interface MarkdownIt {
  renderer: { rules: { fence?: FenceRule } };
}

export function extendChatMarkdownIt<T extends MarkdownIt>(md: T): T {
  const defaultFence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info || "";
    if (isChatFence(info)) return renderChat(token.content, info);
    return defaultFence
      ? defaultFence(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options);
  };
  return md;
}
