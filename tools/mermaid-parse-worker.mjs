import { register } from "node:module";
import { parentPort, workerData } from "node:worker_threads";

register("./mermaid-parse-loader.mjs", import.meta.url, {
  data: { directory: new URL(".", workerData.entry).href },
});

const { default: mermaid } = await import(workerData.entry);
const results = [];
for (const block of workerData.blocks) {
  try {
    // Reset configuration between diagrams, including after an invalid directive.
    mermaid.initialize({ ...workerData.config, startOnLoad: false });
    const parsed = await mermaid.parse(block.code);
    results.push({ ...block, status: "passed", parserType: parsed.diagramType });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Unknown grammars and runtime/environment failures must never count as checked.
    const syntaxError =
      error != null &&
      (Object.hasOwn(error, "hash") || // Jison grammars
        Object.hasOwn(error, "result") || // Langium grammars (architecture, etc.)
        error.name === "YAMLException" || // Diagram frontmatter
        error instanceof SyntaxError);
    results.push({ ...block, status: syntaxError ? "error" : "unchecked", message });
  }
}
parentPort.postMessage(results);
