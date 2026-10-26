import { existsSync, readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import type { Plugin } from "vite";

// publicDir は利用者の public/ のままにし、生成 SVG だけを別の場所から配信する。
// manifest や一時ファイルは公開せず、build と dev で同じ URL を使う。
export function mermaidAssets(outDir: string, base: string): Plugin {
  let isSsrBuild = false;
  return {
    name: "specdojo-mermaid-assets",
    configResolved(config) {
      isSsrBuild = Boolean(config.build.ssr);
    },
    generateBundle() {
      if (isSsrBuild || !existsSync(outDir)) return;
      for (const name of readdirSync(outDir)) {
        if (!/^[0-9a-f]{8}\.svg$/.test(name)) continue;
        this.emitFile({
          type: "asset",
          fileName: `mermaid/${name}`,
          source: readFileSync(path.join(outDir, name)),
        });
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split(/[?#]/)[0];
        const sitePath = url?.startsWith(base) ? `/${url.slice(base.length)}` : url;
        const name = sitePath?.match(/^\/mermaid\/([0-9a-f]{8}\.svg)$/)?.[1];
        if (!name || !existsSync(path.join(outDir, name))) return next();
        res.setHeader("Content-Type", "image/svg+xml");
        res.end(readFileSync(path.join(outDir, name)));
      });
    },
  };
}
