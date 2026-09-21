---
specdojo:
  id: prj-0001:pjr-w66b-parent-validation-typecheck
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-21T11:31:18Z"
  due_on: "2026-10-05"
---

# PJR-W66B 親検証に typecheck を加え、型エラーを commit hook まで持ち越さない

## 1. 概要

`pipeline.parent_validations`（`.specdojo/exec-defaults.yaml`）は `test-integration` / `validate-schema` / `test-unit` の 3 つで、`typecheck` を含まない。Vitest は型検査を行わないため、executor が残した TypeScript の型エラーは親検証を通過し、統合時の pre-commit hook（`typecheck`）で初めて失敗する。PJR-YWPH では新規テストの `mockImplementation` の型不一致がこの経路で hook まで持ち越され、PJR-2M84 の merge 途中残留と重なった。

executor は plan の共通規約で `npm run typecheck` を実行することになっているが、sandbox 内で実行できない・実行しない場合があり、runner 側の親検証で機械的に担保するほうが確実である。

### 1.1. 決定事項

- `ParentValidationId` に `typecheck`（`npm run typecheck`、固定 argv）を追加し、`exec-defaults.yaml` の `pipeline.parent_validations` に `test-unit` の前へ加える（型エラーがあれば早く止める）。
- `typecheck` は `tsc -b --noEmit` で `src` / `tests` / `tools` / `packages` の参照を辿るため、実行時間は 10〜20 秒程度で親検証全体への影響は小さい。
- 親検証の結果は現行どおり evidence に記録し、失敗時は executor の block reason に最初のエラー行を残す。

## 2. 完了条件

- `typecheck` が親検証として定義され、`exec-defaults.yaml` の既定に含まれている。
- 型エラーを含む fixture で親検証が `failed` となる統合テストがある。
- `exec-config-guide` の親検証の説明に `typecheck` が載っている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                                           | 担当 | 状態 | メモ                                              |
| --- | ---------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------- |
| 1   | `exec-parent-validation.ts` に `typecheck` を追加し、`exec-defaults.yaml` と schema を更新する | DEV  | open | codex-expert-executor / gemma-reporter / worktree |
| 2   | 統合テストと `exec-config-guide` を更新する                                                    | DEV  | open | 作業 1 と同一タスク                               |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]
- [[prj-0001:pjr-2m84-integrate-merge-abort]]
- [[prj-0001:pjr-ywph-register-plan-grade-findings]]
- `src/exec-parent-validation.ts`
- `.specdojo/exec-defaults.yaml`
