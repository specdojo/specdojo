import path from "node:path";
import type { Plugin } from "vite";
import { generateD2Svgs } from "../src/gen-d2-svg.js";

export function d2SvgAutoGenerate(options: {
  rootDir: string;
  outDir: string;
  contentRoot: string;
  syncFile: (file: string) => void;
}): Plugin {
  let ssr = false;
  const generate = () => generateD2Svgs(options);
  return {
    name: "d2-svg-auto-generate",
    configResolved(config) {
      ssr = Boolean(config.build.ssr);
    },
    buildStart() {
      if (!ssr) generate();
    },
    configureServer(server) {
      server.watcher.add(options.contentRoot);
      for (const event of ["add", "change", "unlink"] as const) {
        server.watcher.on(event, (file) => {
          const relative = path.relative(options.contentRoot, file);
          if (
            !relative ||
            relative.startsWith("..") ||
            path.isAbsolute(relative) ||
            !file.endsWith(".md")
          )
            return;
          options.syncFile(file);
          try {
            generate();
          } catch (error) {
            server.config.logger.error(
              `[d2] ${error instanceof Error ? error.message : String(error)}`,
            );
          }
          server.ws.send({ type: "full-reload" });
        });
      }
    },
  };
}
