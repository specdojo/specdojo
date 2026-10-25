/** Agent execution is supplied by CLI wiring so grading does not depend on exec internals. */
export type GradeAgentRuntime = {
  resolveActor: (opts: { by?: string; project?: string; execDefaultsPath?: string }) => string;
  executePlan: (opts: {
    planPath: string;
    nickname: string;
    project?: string;
    execDefaultsPath?: string;
    quiet?: boolean;
  }) => Promise<{
    command: string;
    actor: string;
    execution?: {
      result: "success" | "rate_limit" | "failure";
      exitCode: number | null;
      stdout: string;
      stderr: string;
    };
  }>;
};
