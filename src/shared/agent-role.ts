// Set at the process boundary for every executor/reporter, including trials.
// This is an accidental-invocation guard, not an authentication credential.
export const AGENT_ROLE_ENV = "SPECDOJO_AGENT_ROLE";
