// Since 0.9.2 SpecDojo never launches Antigravity (agy). On consumer plans, the Antigravity FAQ
// excludes launching agy from third-party agents or applications and the Additional Terms
// (Section 6) treat it as a breach. The block is unconditional: there is intentionally no
// setting or environment variable that lifts it (PJR-5V0T, PJR-NJE4).

export const BLOCKED_ANTIGRAVITY_PROVIDER = "antigravity";

export const ANTIGRAVITY_BLOCKED_MESSAGE =
  "SpecDojo 0.9.2 and later do not launch Antigravity (agy). " +
  "On consumer plans, the Antigravity FAQ does not cover launching agy from third-party agents or applications, " +
  "and the Antigravity Additional Terms (Section 6) treat it as a breach of contract. " +
  "See https://antigravity.google/docs/faq and https://antigravity.google/terms. " +
  "Set disabled: true on (or remove) the agy members in .specdojo/agent-members.yaml and use another provider.";

export class AntigravityBlockedError extends Error {
  constructor(context: string) {
    super(`${context}: ${ANTIGRAVITY_BLOCKED_MESSAGE}`);
    this.name = "AntigravityBlockedError";
  }
}

export function isBlockedProvider(provider: string | undefined): boolean {
  return provider?.trim() === BLOCKED_ANTIGRAVITY_PROVIDER;
}

/** Throws before any agent process is spawned when the provider is Antigravity. */
export function assertProviderLaunchAllowed(provider: string | undefined, context: string): void {
  if (isBlockedProvider(provider)) throw new AntigravityBlockedError(context);
}
