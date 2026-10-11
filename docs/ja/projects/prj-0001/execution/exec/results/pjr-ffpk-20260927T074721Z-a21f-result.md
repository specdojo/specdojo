---
specdojo:
  id: prj-0001:xer-pjr-ffpk-20260927t074721z-a21f
  type: exec-result
  task_id: PJR-FFPK
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-ffpk-20260927T074721Z-a21f-plan.md
  started_at: "2026-09-27T07:47:44.082Z"
  completed_at: "2026-09-27T08:26:51.674Z"
  agent: claude-expert-executor
---

# Edit Result

## 1. 実施内容

- register 由来タスクの commit 範囲が絞られていなかった問題に対応した。`src/exec-worktree-ops.ts` に `origin: register` タスク向けの commit-scope 判定ロジックを追加し、HEAD に無い新規ファイルは既知の成果物ディレクトリ・HEAD 追跡済み最上位ディレクトリ・対象タスクの result / evidence・plan の `targets` から解決したパスに限って commit するよう変更した。
- `assertNoAgentReadyPromotion`（ready 昇格検査）が、絞り込み後の commit 対象のパスのみを検査するよう修正され、一時ファイルの `status: ready` 記述で統合が誤って止まらないようにした。
- commit しなかった変更は、従来の `commit-scope:` 警告に加えて `src/exec-run.ts` 経由で run の evidence ディレクトリの `integrate.log` にも記録するようにした。
- `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` と `docs/ja/specdojo/guides/exec-worktree-guide.md` に、作業用一時ファイルの扱いおよび register 由来タスクの commit 範囲を追記した。
- 個票 `pjr-ffpk-agent-scratch-files-in-commit.md` の作業内容・対応結果セクションを今回の実装内容で更新した。
- `tests/src/exec-worktree-ops.integration.test.ts` に、一時ファイル除外・追跡済みルート/`targets` 成果物の commit・ready 昇格検査の 3 件の統合テストを追加した。
- 既存の統合テスト 2 件（`exec-register-resume` / `exec-register-pipeline-e2e`）が新ルールでリポジトリ直下のフィクスチャ書き込みを一時ファイル扱いして失敗していたため、フィクスチャの書き込み先を `docs/` 配下へ移して修正した。
- executor 自身は `test-unit` / `test-integration` を sandbox 内で実行せず親 runner の実行に委ね、親 runner の `test-integration`・`validate-schema`・`typecheck`・`test-unit` はいずれも `passed` で記録されている。
- 登録簿（`pjr-index.md`）本体と個票の状態項目（`item_status` 等）は変更していない。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/controls/project-register/pjr-ffpk-agent-scratch-files-in-commit.md`: 個票の作業内容・対応結果セクションを、commit 範囲絞り込みと ready 昇格検査修正の実装内容で更新した。ステータス項目は変更していない。
- `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md`: 作業用ファイルはリポジトリ外（一時ディレクトリ）に置き終了前に削除する旨を共通規約に追記した。
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: register 由来タスクの commit 範囲（既知成果物ディレクトリ・HEAD 追跡済みルート・result/evidence・`targets`）の説明を追記した。
- `src/exec-run.ts`: commit しなかった変更の `commit-scope:` 警告を、run の evidence ディレクトリの `integrate.log` にも記録するよう呼び出しを追加した。
- `src/exec-worktree-ops.ts`: `origin: register` タスクの commit 対象を既知ディレクトリ・HEAD 追跡済みルート・result/evidence・`targets` 解決パスへ限定するロジックを追加し、`assertNoAgentReadyPromotion` を絞り込み後の commit 対象のみ検査するよう修正した。
- `tests/src/exec-register-pipeline-e2e.integration.test.ts`: fake executor が成果物を書き込むパスを、リポジトリ直下の `pipeline-artifact.md` から `docs/pipeline-artifact.md` へ変更した。
- `tests/src/exec-register-resume.integration.test.ts`: テストで使用するマーカーファイルのパスを、リポジトリ直下から `docs/protection-applied` へ変更した。
- `tests/src/exec-worktree-ops.integration.test.ts`: 一時ファイル除外、追跡済みルート/`targets` 成果物の commit、commit 対象成果物の ready 昇格検査を検証する統合テストを 3 件追加した。

## 3. 申し送り

- 親 runner の検証（`test-integration` / `validate-schema` / `typecheck` / `test-unit`）はいずれも `passed` で記録されており、今回の evidence では追加の未解決事項は確認できなかった。
- `validate:schema` の出力には `docs/ja/specdojo/samples/*.yaml` の `schema-not-defined` や `external-openapi` 等の既存 WARN 相当の記載が含まれるが、これは本タスクの変更に起因するものではなく既存事象である。
- 登録簿（`pjr-index.md`）と個票のステータス項目は plan の指示どおり変更していないため、状態遷移（review 等）は runner・人間側で行う必要がある。

## 4. 進め方と実践の型の適用

個票 `pjr-ffpk-agent-scratch-files-in-commit.md` の完了条件（register 由来タスクの commit 範囲を成果物ディレクトリ・`targets` 等へ限定し、ready 昇格検査も絞り込み後の対象のみ見ること、関連テストが通ること）を基準に、`src/exec-worktree-ops.ts` の commit-scope 判定と `assertNoAgentReadyPromotion` を修正し、`src/exec-run.ts` で `integrate.log` への記録を追加した。共通規約テンプレートとガイドに一時ファイルの扱いを明文化し、個票を更新した。既存の統合テスト失敗はフィクスチャ側のリポジトリ直下書き込みが原因と特定し、`docs/` 配下へ移して解消したうえで新規の検証テスト 3 件を追加した。整形・静的検査（`prettier` / `markdownlint` / `eslint`）と `catalog validate` / `index build` を executor が実行し、`test-unit` / `test-integration` / `validate-schema` / `typecheck` は親 runner が実行し、いずれも `passed` であることを確認した。
