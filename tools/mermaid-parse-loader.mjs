// Loaded only in the syntax-checking Worker. No HTML/SVG is rendered or returned.
// Mermaid's parsers sanitize labels even during parse(); DOMPurify needs a DOM.
// Leave label text intact here so parsing needs neither a DOM nor a browser.
let mermaidDirectory;

export function initialize({ directory }) {
  mermaidDirectory = directory;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "dompurify" && context.parentURL?.startsWith(mermaidDirectory)) {
    return {
      url: `data:text/javascript,${encodeURIComponent(
        "export default { sanitize: (text) => String(text), addHook: () => {} };",
      )}`,
      shortCircuit: true,
    };
  }
  return nextResolve(specifier, context);
}
