// Git fixture の identity と署名設定はプロセス環境だけへ注入し、一時 repository を含む
// どの local config にも書き込まない。Vitest の worker と、その子プロセスだけに適用される。
export const TEST_GIT_ENVIRONMENT = {
  GIT_AUTHOR_NAME: "SpecDojo Test",
  GIT_AUTHOR_EMAIL: "specdojo@example.invalid",
  GIT_COMMITTER_NAME: "SpecDojo Test",
  GIT_COMMITTER_EMAIL: "specdojo@example.invalid",
  GIT_CONFIG_COUNT: "1",
  GIT_CONFIG_KEY_0: "commit.gpgsign",
  GIT_CONFIG_VALUE_0: "false",
} satisfies NodeJS.ProcessEnv;

export const TEST_GIT_SETUP_FILE = "./tests/setup/git-environment.ts";
