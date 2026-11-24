---
specdojo:
  id: prj-0001:xer-pjr-4vd6-20261124t003347z-e359e99c
  type: exec-result
  task_id: PJR-4VD6
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-4VD6/pjr-4vd6-20261124T003347Z-e359e99c/plan.md
  started_at: "2026-11-24T00:33:51.302Z"
  completed_at: "2026-11-24T00:51:11.852Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- exec run --register の状態遷移(start・review・waiting)と検証済みの個票編集を、register 専用ブランチへ commit・push する実装を追加した。exec の commit には個票とイベントを含めない。
- executor は従来どおり個票を編集する。検証後・exec commit 前に runner が専用ブランチへ転送する。最新の状態欄を保持して本文を三方向マージし、push 成功後だけ実行元を HEAD へ戻す。競合や転送失敗時は編集を保持する。
- 並行更新は共通ロックと rebase 再試行で同期する。
- 関連する文書6件(ガイド・リファレンス・標準)を更新し、統合テスト2件を拡張した。
- runner 検証では lint、typecheck、`test:unit`、`test:docs`、`validate:schema` などが通過した。一方 `npm run test:integration` は失敗した。`tests/src/exec/register-pipeline-e2e.integration.test.ts` の774行付近で、リモートのブランチ上の個票の内容を確認するアサーションが落ちている。原因は evidence からは特定できない。
- `exec smoke` と実際の `exec run --register` の確認は、実 agent CLI と利用枠が必要なため未実施で、`requires_human` になっている。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: exec run --register の状態遷移・対応結果が register ブランチへ書かれる運用を追記した。
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: exec の worktree/ブランチに個票の変更を含めない扱いと、register ブランチとの関係を追記した。
- `docs/ja/specdojo/guides/register-operation-guide.md`: runner による register ブランチへの転送、競合・失敗時の編集保持、再開手順を追記した。
- `docs/ja/specdojo/references/command-reference.md`: exec run --register の挙動(register ブランチへの commit・push、exec commit からの分離)をコマンドリファレンスに反映した。
- `docs/ja/specdojo/references/specdojo-config-reference.md`: `register_sync` に関わる設定の説明を、新しい転送挙動に合わせて更新した。
- `docs/ja/specdojo/standards/git-branching-standard.md`: register 専用ブランチと exec ブランチの役割分担、個票の変更を exec ブランチに含めない規則を追記した。
- `src/exec/run/register-core.ts`: register run の流れを register-sync と連携させ、exec commit から個票・イベントを分離するよう変更した。
- `src/exec/run/register-state.ts`: start・review・waiting などの状態遷移と対応結果を、register ブランチへ書く経路に合わせて変更した。
- `src/exec/run/register-worktree.ts`: worktree 運用で個票の変更が exec ブランチへ含まれないよう調整し、push 成功後に実行元を HEAD へ戻す処理を加えた。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: register パイプラインの E2E 統合テストを、register ブランチへの転送と exec ブランチへの非混入を検証するよう更新した。現状、この中の1件が `test:integration` で失敗している。
- `tests/src/register/register-branch.integration.test.ts`: register ブランチの同期動作(転送、並行更新、競合時の保持)に関する統合テストを更新した。
- `src/exec/run/register-sync.ts`: 新規。runner が個票の状態遷移と検証済みの編集を register 専用ブランチへ転送する同期処理。共通ロック、rebase 再試行、状態欄を保持した本文の三方向マージ、競合・失敗時の編集保持を担う。

## 3. 申し送り

- 親 runner の `npm run test:integration` が失敗している(`tests/src/exec/register-pipeline-e2e.integration.test.ts` 774行付近、リモートのブランチ上の個票内容に対する `toContain` / `not.toContain` のアサーション)。詳細は `parent-validation-attempt-1-test-integration.log` を参照し、修正してから先へ進める必要がある。
- 設計判断: executor は従来どおり個票を編集し、検証後・exec commit 前に runner が専用ブランチへ転送する。最新の状態欄を保持して本文を三方向マージし、push 成功後だけ実行元を HEAD へ戻す。競合・転送失敗時は編集を保持する。決定内容は個票の対応結果にも記載済み。
- 統合後、新しいプロセスで exec smoke と実際の exec run --register を各 1 回実行してから close する。実 agent CLI と利用枠を使うため sandbox では実施していない。個票の該当作業は理由付きで open。
- CHANGELOG に書く事項（変更、v0.10.0）: `register_sync` が有効な project の `exec run --register` は、状態遷移と検証済みの個票編集を register 専用ブランチへ commit・push し、exec の commit には個票・イベントを含めないようになりました。並行更新は共通ロックと rebase 再試行で同期し、転送に失敗した編集は再開用に保持します。
- result は pipeline の指示に従い編集していない。保護された設定の変更も不要。
- 適用外の検証: `npm run validate:schema:file`（executor の変更は TypeScript と Markdown のみ。既存の runner 管理イベントは変更対象に含めていない。）
- 人の確認が必要: `specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-4VD6 --executor-by sol-executor --reporter-by gemma26-reporter`（統合後に orchestrator が新しいプロセスで実行する。実 agent CLI と利用枠が必要。）
- 人の確認が必要: `specdojo exec run --project prj-0001 --register PJR-JSEY --worktree --executor-by sol-executor --reporter-by gemma26-reporter`（統合後に実際の register run を確認してから close する。確認用個票の状態と実行 agent は orchestrator が確認する。）

## 4. 進め方

個票を編集する流れは変えず、検証後・exec commit 前に runner が register 専用ブランチへ転送する方式にした。個票とイベントは exec の commit から外した。転送は共通ロックと rebase 再試行で並行更新に対応し、競合や失敗時は編集を保持する。文書6件と統合テスト2件も合わせて更新した。
