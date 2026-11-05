const warned = new Set<string>();

/** Emit each compatibility warning once per CLI process, even across repeated loads. */
export function warnDeprecated(feature: string, migration: string): void {
  if (warned.has(feature)) return;
  warned.add(feature);
  process.stderr.write(`WARN: ${feature} is deprecated. ${migration}\n`);
}
