import { relative, resolve } from "node:path";

/**
 * Runtime permission injection that lets an OpenCode agent edit declared extra roots (product
 * worktrees, external projects). OpenCode merges `OPENCODE_CONFIG_CONTENT` after the
 * `.opencode/agents/<name>.md` definitions, so the override survives the agent frontmatter, while
 * `opencode.json` `agent.<name>.permission` would be overwritten by it.
 *
 * OpenCode matches the two permissions in different forms: `external_directory` by the absolute
 * directory path and `edit` by the path relative to its working directory. The injected patterns
 * follow those forms, and only the given roots are allowed; other external directories stay denied.
 */

export const OPENCODE_CONFIG_CONTENT_ENV = "OPENCODE_CONFIG_CONTENT";

type PermissionAction = "allow" | "deny";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toPosix(path: string): string {
  return path.replaceAll("\\", "/");
}

/** `external_directory` pattern: the absolute root path. */
export function opencodeExternalDirectoryPattern(root: string): string {
  return `${toPosix(resolve(root))}/**`;
}

/** `edit` pattern: the root relative to OpenCode's working directory (e.g. `../app1/**`). */
export function opencodeEditPattern(root: string, cwd: string): string {
  const relativePath = toPosix(relative(resolve(cwd), resolve(root)));
  return relativePath ? `${relativePath}/**` : "**";
}

type AgentPermissionContext = {
  config: Record<string, unknown>;
  agents: Record<string, unknown>;
  selectedAgent: Record<string, unknown>;
  permission: Record<string, unknown>;
};

function parseAgentPermission(
  current: string | undefined,
  agentName: string,
): AgentPermissionContext {
  let config: Record<string, unknown> = {};
  if (current?.trim()) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(current);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid ${OPENCODE_CONFIG_CONTENT_ENV}: ${message}`, { cause: error });
    }
    if (!isRecord(parsed)) {
      throw new Error(`Invalid ${OPENCODE_CONFIG_CONTENT_ENV}: top-level value must be an object`);
    }
    config = parsed;
  }

  const agents = config.agent === undefined ? {} : config.agent;
  if (!isRecord(agents)) {
    throw new Error(`Invalid ${OPENCODE_CONFIG_CONTENT_ENV}: agent must be an object`);
  }
  const selectedAgent = agents[agentName] === undefined ? {} : agents[agentName];
  if (!isRecord(selectedAgent)) {
    throw new Error(`Invalid ${OPENCODE_CONFIG_CONTENT_ENV}: agent.${agentName} must be an object`);
  }
  const permission = selectedAgent.permission === undefined ? {} : selectedAgent.permission;
  if (!isRecord(permission)) {
    throw new Error(
      `Invalid ${OPENCODE_CONFIG_CONTENT_ENV}: agent.${agentName}.permission must be an object`,
    );
  }
  return { config, agents, selectedAgent, permission };
}

/**
 * Add `allow` rules to `agent.<agentName>.permission.bash` in the current `OPENCODE_CONFIG_CONTENT`.
 * The agent-level value is merged after the agent definition, so the added rules sort after the
 * definition's `"*": deny` and win for the matching commands only. A global `OPENCODE_PERMISSION`
 * sorts before it and cannot override the deny. Existing bash rules and other keys are preserved.
 */
export function opencodeAllowCommandsConfig(
  current: string | undefined,
  agentName: string,
  patterns: readonly string[],
): string {
  const { config, agents, selectedAgent, permission } = parseAgentPermission(current, agentName);
  const currentBash = permission.bash;
  let bash: Record<string, unknown> = {};
  if (isRecord(currentBash)) {
    bash = { ...currentBash };
  } else if (typeof currentBash === "string") {
    bash = { "*": currentBash };
  } else if (currentBash !== undefined) {
    throw new Error(
      `Invalid ${OPENCODE_CONFIG_CONTENT_ENV}: agent.${agentName}.permission.bash must be a string or object`,
    );
  }
  for (const pattern of patterns) {
    // Re-insert so a repeated pattern moves after earlier rules.
    delete bash[pattern];
    bash[pattern] = "allow";
  }
  return JSON.stringify({
    ...config,
    agent: {
      ...agents,
      [agentName]: { ...selectedAgent, permission: { ...permission, bash } },
    },
  });
}

const LEADING_CONFIG_ASSIGNMENT = new RegExp(`^${OPENCODE_CONFIG_CONTENT_ENV}='([^']*)' `);

/**
 * Split a leading `OPENCODE_CONFIG_CONTENT='<json>' ` assignment (made by `allow_commands`) off a
 * resolved command so later layers can merge into it instead of being shadowed by it.
 */
export function splitLeadingOpencodeConfig(command: string): {
  config?: string;
  command: string;
} {
  const match = LEADING_CONFIG_ASSIGNMENT.exec(command);
  if (!match) return { command };
  return { config: match[1], command: command.slice(match[0].length) };
}

/**
 * Merge the extra-root permissions for `agentName` into the current `OPENCODE_CONFIG_CONTENT`.
 * Other keys and agents are preserved. Throws when the current value is not a valid config object.
 */
export function opencodeExtraRootConfig(
  current: string | undefined,
  agentName: string,
  roots: readonly string[],
  cwd: string,
  access: "write" | "read" = "write",
  readOnlyRoots: readonly string[] = [],
): string {
  const { config, agents, selectedAgent, permission } = parseAgentPermission(current, agentName);

  const externalDirectory: Record<string, PermissionAction> = { "*": "deny" };
  const currentEdit = permission.edit;
  let edit: Record<string, unknown> = {};
  if (isRecord(currentEdit)) {
    edit = { ...currentEdit };
  } else if (typeof currentEdit === "string") {
    edit = { "*": currentEdit };
  } else if (currentEdit !== undefined) {
    throw new Error(
      `Invalid ${OPENCODE_CONFIG_CONTENT_ENV}: agent.${agentName}.permission.edit must be a string or object`,
    );
  }
  for (const root of roots) {
    externalDirectory[opencodeExternalDirectoryPattern(root)] = "allow";
    if (access === "write") edit[opencodeEditPattern(root, cwd)] = "allow";
  }
  for (const root of readOnlyRoots) {
    externalDirectory[opencodeExternalDirectoryPattern(root)] = "allow";
    const pattern = opencodeEditPattern(root, cwd);
    // The final matching rule wins, including over a pre-existing broad edit allow.
    delete edit[pattern];
    edit[pattern] = "deny";
  }

  return JSON.stringify({
    ...config,
    agent: {
      ...agents,
      [agentName]: {
        ...selectedAgent,
        permission: {
          ...permission,
          external_directory: externalDirectory,
          ...(access === "write" || readOnlyRoots.length > 0 ? { edit } : {}),
        },
      },
    },
  });
}

/** Agent name from `--agent <name>` / `--agent=<name>` arguments (the last one wins). */
export function opencodeAgentNameFromArguments(args: readonly string[]): string | undefined {
  let selected: string | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--agent") {
      selected = args[index + 1];
      index += 1;
    } else if (arg.startsWith("--agent=")) {
      selected = arg.slice("--agent=".length);
    }
  }
  const trimmed = selected?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Agent name in a resolved shell command such as `opencode run --agent opencode-executor ...`.
 * Single or double quotes around the name are accepted; anything else is split on whitespace.
 */
export function opencodeAgentNameFromCommand(command: string): string | undefined {
  const words = command
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/^(['"])(.*)\1$/, "$2"));
  return opencodeAgentNameFromArguments(words);
}
