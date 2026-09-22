---
specdojo:
  id: prj-0001:pjr-w66b-parent-validation-typecheck
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-21T11:31:18Z"
  due_on: "2026-10-05"
  completed_at: "2026-09-22T23:43:26Z"
  block_reason: "integrate failed: git merge failed: CONFLICT (content): Merge conflict in docs/ja/projects/prj-0001/controls/project-register/events/pjr-w66b.yaml"
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
| 1   | `exec-parent-validation.ts` に `typecheck` を追加し、`exec-defaults.yaml` と schema を更新する | DEV  | done | codex-expert-executor / gemma-reporter / worktree |
| 2   | 統合テストと `exec-config-guide` を更新する                                                    | DEV  | done | 作業 1 と同一タスク                               |

## 4. 対応結果

- `typecheck` を親検証として登録した。`src/exec-parent-validation.ts` の `ParentValidationId` 型と `PARENT_VALIDATION_REGISTRY` に `typecheck`（固定 argv で `npm run typecheck`、`shell: false`、timeout 10 分）を追加し、実体は他検証と同構造で command/args/displayCommand/timeout も揃えている。
- schema を更新した。`docs/specdojo/schemas/v1/exec-defaults.schema.yaml` の `parent_validations.items.enum` に `typecheck` を加えた（既存 ID と合算して `[validate-schema, typecheck, test-unit, test-integration]`）。`loadExecDefaultsConfig` は allowlist（= registry）で未知 ID を弾くため、設定側は registry への追加だけで有効化される。
- `exec-config-guide` の親検証説明に `typecheck` を載せた。§5 の YAML 例・許可 ID 列挙（「現時点で許可される ID は … の 4 つ」）と §6.3 の項目に `typecheck` を追加し、Vitest と異なり型検査を行うことから `test-unit` の前に置く根拠（PJR-YWPH の経緯）を記述した。
- 統合テストを追加した。`tests/src/exec-pipeline-e2e.integration.test.ts` に helper `withTypecheckParentValidation` で `typecheck` を親検証へ足した fixture と、「型エラーを含む fixture では `typecheck` 親検証が `failed` になりタスクを block」する回帰テストを追加。runner 検証の順序（`typecheck` が `test-integration` より前）と block reason（`parent validation failed: typecheck, test-integration`）まで確認している。
- 残課題: `.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` に `typecheck` を加える最終トグルは、agent の書き込み保護対象（[[prj-0001:pjr-3s8q-agent-writable-config-scope|PJR-3S8Q]]）のため executor からは編集できない。registry・schema・doc・テスト側は完結しているため、実行環境に反映するには運用者または親 runner が `.specdojo/exec-defaults.yaml` を更新し、実 pipeline 実行で `typecheck` の `source: runner` success と executor 側の実行有無を確認する。

### 4.1. レビュー結果（2026-09-22）

qwen-expert-executor（`--executor-by`、worktree）で実行した。実装は `PARENT_VALIDATION_REGISTRY` へ既存と同型で `typecheck`（`npm run typecheck`、Windows 対応、10 分タイムアウト）を追加し、`exec-defaults.schema.yaml` の enum、`exec-config-guide`、統合テスト 70 行まで網羅した。親検証 3 種と単体 1507 件・統合 110 件が通過した。`.specdojo/exec-defaults.yaml` の既定への追加は保護設定のためオーケストレーターが適用した。

所要時間は 20.3 時間で、codex-expert（同規模で 10〜15 分）と比べて実用外だった。最初の 1 時間以上をファイル読み取りに費やし、その間 Ollama を占有して他の opencode agent（gemma reporter、夜間 grade）が使えない。ローカル 27B は変換・判定・要約に用途を寄せ、実装タスクは codex / agy に任せる。

統合は 3 回試行した。1 回目の commit 失敗は再現せず（worktree で `lefthook run pre-commit` は全ステップ成功）部分ステージ状態での一時的なもの、2 回目は 1 回目の失敗で develop と exec ブランチの記帳が食い違ったことによる conflict、3 回目は `dist` が古い状態の中断で、`npm run build` 後に成功した。2 回目では PJR-2M84 の `git merge --abort` が正しく働き、develop は merge 途中で残らず、`integrate.log` に conflict の全文と abort の成功が記録されていた。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]
- [[prj-0001:pjr-2m84-integrate-merge-abort]]
- [[prj-0001:pjr-ywph-register-plan-grade-findings]]
- `src/exec-parent-validation.ts`
- `.specdojo/exec-defaults.yaml`
