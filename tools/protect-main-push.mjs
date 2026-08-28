import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const PROTECTED_REMOTE_REF = "refs/heads/main";

export function inspectPushInput(input) {
  const updates = input
    .split(/\r?\n/u)
    .map((line) => line.trim().split(/\s+/u))
    .filter((fields) => fields.length >= 4);

  return {
    allowed: updates.every(([, , remoteRef]) => remoteRef !== PROTECTED_REMOTE_REF),
    protectedRef: PROTECTED_REMOTE_REF,
  };
}

export async function runProtectMainPush({
  input = process.stdin,
  report = (message) => process.stderr.write(message),
} = {}) {
  input.setEncoding("utf8");
  let pushInput = "";
  for await (const chunk of input) pushInput += chunk;

  const result = inspectPushInput(pushInput);
  if (result.allowed) return 0;

  report(
    [
      `ERROR: ${result.protectedRef} への直接 push は禁止されています。`,
      "project develop から Pull Request 経由で main へ昇格してください。",
      "  base: main",
      "  head: project/<project-id>/develop",
      "  merge method: Create a merge commit（squash / rebase merge は使用しない）",
      "",
    ].join("\n"),
  );
  return 1;
}

const isEntryPoint =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isEntryPoint) {
  process.exitCode = await runProtectMainPush();
}
