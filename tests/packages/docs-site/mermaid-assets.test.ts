import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { describe, expect, it, vi } from "vitest";
import { mermaidAssets } from "../../../packages/docs-site/.vitepress/mermaid-assets.js";

describe("Mermaid static assets", () => {
  it("client build に SVG だけを出力し SSR build では重複出力しない", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-mermaid-assets-"));
    try {
      writeFileSync(join(root, "1234abcd.svg"), "<svg/>");
      writeFileSync(join(root, ".manifest.json"), "{}");
      writeFileSync(join(root, ".tmp-1234abcd.mmd"), "graph TD; A-->B");
      const plugin = mermaidAssets(root, "/specdojo/");
      const generate = plugin.generateBundle;
      const resolve = plugin.configResolved;
      if (typeof generate !== "function" || typeof resolve !== "function") {
        throw new Error("build hooks are missing");
      }
      const emitFile = vi.fn();
      const context = { emitFile } as unknown as ThisParameterType<typeof generate>;
      await resolve({ build: { ssr: false } } as Parameters<typeof resolve>[0]);
      await generate.call(context, {} as Parameters<typeof generate>[0], {}, false);
      expect(emitFile).toHaveBeenCalledOnce();
      const asset = emitFile.mock.calls[0][0];
      expect(asset.type).toBe("asset");
      expect(asset.fileName).toBe("mermaid/1234abcd.svg");
      expect(asset.source.toString()).toBe("<svg/>");

      emitFile.mockClear();
      await resolve({ build: { ssr: true } } as Parameters<typeof resolve>[0]);
      await generate.call(context, {} as Parameters<typeof generate>[0], {}, false);
      expect(emitFile).not.toHaveBeenCalled();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("dev で SVG の公開 URL と base に対応し manifest・一時ファイルを配信しない", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-mermaid-assets-"));
    try {
      const output = join(root, ".vitepress/mermaid");
      mkdirSync(output, { recursive: true });
      writeFileSync(join(output, "1234abcd.svg"), "<svg/>");
      writeFileSync(join(output, ".manifest.json"), "{}");
      const plugin = mermaidAssets(output, "/specdojo/");
      let middleware:
        ((req: IncomingMessage, res: ServerResponse, next: () => void) => void) | undefined;
      const configure = plugin.configureServer;
      if (typeof configure !== "function") throw new Error("configureServer hook is missing");
      await configure({
        middlewares: {
          use: (handler: typeof middleware) => {
            middleware = handler;
          },
        },
      } as unknown as Parameters<typeof configure>[0]);
      if (!middleware) throw new Error("SVG middleware is missing");

      for (const url of ["/mermaid/1234abcd.svg", "/specdojo/mermaid/1234abcd.svg?v=1"]) {
        const next = vi.fn();
        const setHeader = vi.fn();
        const end = vi.fn();
        middleware(
          { url } as IncomingMessage,
          { setHeader, end } as unknown as ServerResponse,
          next,
        );
        expect(setHeader).toHaveBeenCalledWith("Content-Type", "image/svg+xml");
        expect(end.mock.calls[0][0].toString()).toBe("<svg/>");
        expect(next).not.toHaveBeenCalled();
      }
      for (const url of [
        "/mermaid/.manifest.json",
        "/mermaid/.tmp-1234abcd.mmd",
        "/mermaid/../user.svg",
        "/mermaid/ffffffff.svg",
      ]) {
        const next = vi.fn();
        middleware({ url } as IncomingMessage, {} as ServerResponse, next);
        expect(next).toHaveBeenCalledOnce();
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
