import { join } from "node:path";

// register の個票更新・view 再生成・commit を、exec run を含む全プロセス間で直列化する。
export function registerLifecyclePoolPath(executionPath: string): string {
  return join(executionPath, "exec", ".locks", "exec-lifecycle");
}
