---
specdojo:
  id: prj-0001:pjr-y8p9-large-source-files-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-10-02T12:14:39Z"
---

# PJR-Y8P9 1,000 行を超える残りのソースの分割

## 1. 概要

dashboard.ts・exec-worktree-ops.ts・exec-plans.ts・exec.ts・job.ts・exec-trial.ts・catalog-build.ts など 1,000 行を超えるファイルを必要に応じて分ける。動作は変えない（v0.3.0 の公開後）

## 2. 完了条件

1 件では量が多すぎるため、2026-10-15 に利用者の承認を得て 5 件に分けた。本項目はそれらをまとめる親の項目とする。

- 次の 5 件がすべて完了している。
- 完了後、`src/` に 1,000 行を超えるファイルが残る場合は、その一覧と理由を対応結果に記録する。

## 3. 作業内容

| No  | 作業                                                                            | 担当 | 状態 | メモ                                                   |
| --- | ------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------ |
| 1   | `register.ts` の残りのドメインの処理を分ける                                    | DEV  | done | [[prj-0001:pjr-p038-register-domain-split]]            |
| 2   | `exec-worktree-ops.ts`・`exec-repo-integration.ts`・`exec-reporter.ts` を分ける | DEV  | done | [[prj-0001:pjr-13m6-exec-worktree-integration-split]]  |
| 3   | `exec-plans.ts`・`exec.ts`・`exec-trial.ts` を分ける                            | DEV  | done | [[prj-0001:pjr-na04-exec-plans-trial-split]]           |
| 4   | `job.ts`・`routine.ts` を分ける                                                 | DEV  | done | [[prj-0001:pjr-3p4w-job-routine-split]]                |
| 5   | `dashboard.ts`・`catalog-build.ts`・`schedule-strategy-generate.ts` を分ける    | DEV  | done | [[prj-0001:pjr-r0k4-dashboard-catalog-schedule-split]] |

## 4. 対応結果

5 件すべてを統合して閉じた（2026-10-15）。分割の後、`src/` に 1,000 行を超えるファイルはない（最大は `src/exec-run-job.ts` の 983 行）。

| 項目     | 対象                                | 分割の前               | 分割の後の最大 |
| -------- | ----------------------------------- | ---------------------- | -------------- |
| PJR-P038 | `register.ts` の残り                | 2,418 行               | 629 行         |
| PJR-13M6 | worktree の操作・統合・reporter     | 3,748 行（3 ファイル） | 899 行         |
| PJR-NA04 | plan の生成・exec のコマンド・trial | 4,045 行（3 ファイル） | 868 行         |
| PJR-3P4W | `job.ts`・`routine.ts`              | 2,644 行（2 ファイル） | 927 行         |
| PJR-R0K4 | dashboard・catalog-build・schedule  | 3,832 行（3 ファイル） | 923 行         |

- 各項目で、分割の前後の export と `--help` の一致、循環 import がないこと、既存のテストを変えていないことを確かめた。runner のコードを含む PJR-13M6・PJR-NA04 は、分割後の runner で [[prj-0001:pjr-jsey-exec-run-split-smoke]] を流して統合まで通った。
- executor（codex-expert-executor）は、PJR-13M6・PJR-3P4W で移した後の import の抜けを残して終え、`--resume-from executor` で直した。PJR-P038 は統合の commit の hook でテストが負荷により時間切れになり、`--resume` で統合した。PJR-R0K4 では終える前の型検査と lint を完了条件に加え、初回で通った。

## 5. 関連ドキュメント

- [[prj-0001:pjr-th4b-eslint-max-lines-guard]]: 本項目の後に行の上限を決める。
