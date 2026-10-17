export const GIT_LOCAL_ENV_VARS = [
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_COMMON_DIR",
  "GIT_DIR",
  "GIT_GRAFT_FILE",
  "GIT_IMPLICIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_NO_REPLACE_OBJECTS",
  "GIT_OBJECT_DIRECTORY",
  "GIT_PREFIX",
  "GIT_REPLACE_REF_BASE",
  "GIT_SHALLOW_FILE",
  "GIT_WORK_TREE",
] as const;

export function removeGitLocalEnvironment(environment: NodeJS.ProcessEnv): void {
  for (const name of GIT_LOCAL_ENV_VARS) delete environment[name];
}

export function gitEnvironment(): NodeJS.ProcessEnv {
  const environment = { ...process.env };
  removeGitLocalEnvironment(environment);
  return environment;
}
