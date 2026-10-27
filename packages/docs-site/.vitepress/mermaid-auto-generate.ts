import * as path from "node:path";
import type { Plugin } from "vite";
import {
  generateMermaidSvgs,
  generateMermaidSvgsForFile,
  shouldGenerateMermaidForFile,
} from "../src/gen-mermaid-svg.js";
import type { MermaidErrorMode } from "../src/gen-mermaid-svg.js";

export function mermaidSvgAutoGenerate(options: {
  rootDir: string;
  outDir: string;
  contentRoot: string;
  syncFile: (file: string) => void;
}): Plugin {
  let timer: NodeJS.Timeout | undefined;
  let running = false;
  let pending = false;
  const pendingFiles = new Set<string>();
  let isSsrBuild = false;
  let errorMode: MermaidErrorMode = "throw";

  const run = (reason: string) => {
    if (running) {
      pending = true;
      return;
    }

    running = true;
    try {
      if (pendingFiles.size > 0) {
        const files = [...pendingFiles];
        pendingFiles.clear();
        console.log(`[mermaid] generating svgs for ${files.length} file(s) (${reason})`);
        for (const file of files) {
          try {
            generateMermaidSvgsForFile(file, {
              rootDir: options.rootDir,
              outDir: options.outDir,
              errorMode,
            });
          } catch (error) {
            console.error(`[mermaid] failed to generate SVGs for ${file}`, error);
          }
        }
      } else {
        console.log(`[mermaid] generating svgs (${reason})`);
        generateMermaidSvgs({
          rootDir: options.rootDir,
          outDir: options.outDir,
          errorMode,
        });
      }
    } finally {
      running = false;
      if (pending) {
        pending = false;
        run("pending");
      }
    }
  };

  const schedule = (reason: string, delayMs = 250) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => run(reason), delayMs);
  };

  const scheduleFile = (file: string, reason: string, delayMs = 250) => {
    pendingFiles.add(file);
    schedule(reason, delayMs);
  };

  const shouldHandle = (file: string): boolean => {
    return shouldGenerateMermaidForFile(file, options.rootDir);
  };

  return {
    name: "mermaid-svg-auto-generate",

    configResolved(config) {
      errorMode = config.command === "serve" ? "warn" : "throw";
      // VitePress build は client build と SSR build を連続実行するため、
      // buildStart が2回呼ばれる。SVG生成は1回で十分なので SSR 側はスキップする。
      isSsrBuild = Boolean(config.build?.ssr);
    },

    buildStart() {
      if (isSsrBuild) return;
      run("buildStart");
    },

    configureServer(server) {
      schedule("startup", 0);

      // 元の docs の変更を閲覧用ツリーへ反映し、以後は VitePress の通常の HMR に任せる。
      server.watcher.add(options.contentRoot);
      for (const event of ["add", "change", "unlink"] as const) {
        server.watcher.on(event, (file) => {
          const relative = path.relative(options.contentRoot, file);
          if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
            options.syncFile(file);
          }
        });
      }

      server.watcher.on("add", (file) => {
        if (!shouldHandle(file)) return;
        scheduleFile(file, "md:add");
      });

      server.watcher.on("unlink", (file) => {
        if (!shouldHandle(file)) return;
        scheduleFile(file, "md:unlink");
      });
    },

    handleHotUpdate(ctx) {
      if (!shouldHandle(ctx.file)) return;

      // Markdown の再描画より先に SVG を用意したいので同期的に実行
      pendingFiles.add(ctx.file);
      run("hotUpdate");
      ctx.server.ws.send({ type: "full-reload" });
      return [];
    },
  };
}
