---
specdojo:
  id: prj-0001:xer-pjr-4vd6-20261123t233858z-9f3943eb
  type: exec-result
  task_id: PJR-4VD6
  mode: edit
  status: superseded
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-4VD6/pjr-4vd6-20261123T233858Z-9f3943eb/plan.md
  started_at: "2026-11-23T23:40:03.866Z"
  completed_at: "2026-11-24T00:33:51.302Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- `register_sync` が有効な project で、`exec run --register` の状態遷移（start・review・waiting）と対応結果を register 専用ブランチへ書く処理を実装した。exec のコミットから個票の変更を分離した。
- 成功時の統合前に、HEAD・編集後・同期先の個票本文を三方向で取り込む。状態項目は同期先を採り、本文競合時は停止する。push 成功後だけ個票の作業コピーを戻す。
- 再開・post-review・smoke の参照先を register ブランチ側へ切り替え、統合テストと関連文書（運用ガイド・コマンドリファレンス・ブランチ標準）を更新した。
- 親 runner の `npm run test:integration` は failed で、`tests/src/exec/register-resume.integration.test.ts` の期待値不一致が evidence に出ている。lint・typecheck・unit・docs などその他の親検証は passed。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: `exec run --register` の状態遷移と対応結果を register ブランチへ書くこと、exec ブランチに個票を含めないことを運用手順へ反映した。
- `docs/ja/specdojo/guides/register-operation-guide.md`: register 運用ガイドに、runner の状態遷移・対応結果の書き込み先が register ブランチであることを反映した。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスの `exec run --register` 等の記述を、register ブランチへの同期動作に合わせて更新した。
- `docs/ja/specdojo/standards/git-branching-standard.md`: ブランチ標準に、runner の個票変更を register ブランチへ書き exec ブランチへ含めない方針を追記した。
- `src/exec/register.ts`: register 実行の入口を、register ブランチへの同期処理を使うよう調整した。
- `src/exec/run/register-core.ts`: 状態遷移と対応結果の書き込みを register ブランチ同期経由にする中核処理を変更した。
- `src/exec/run/register-post-review.ts`: post-review が register ブランチ側の個票を参照・更新するよう変更した。
- `src/exec/run/register-state.ts`: 状態管理を register ブランチ同期に対応させ、再開時の参照先を変更した。
- `src/exec/run/register-worktree.ts`: worktree 実行で exec のコミットから個票を分離し、統合前に個票を同期する処理を組み込んだ。
- `src/exec/smoke.ts`: smoke の参照先を register ブランチ側に合わせて変更した。
- `src/shared/register-branch.ts`: register ブランチ操作の共有処理を、同期・三方向取り込み・失敗時の保持に対応させて拡張した。
- `tests/src/exec/register-resume.integration.test.ts`: 再開時に状態遷移・対応結果が register ブランチへ書かれることを検証するよう更新した。親 runner の integration で期待値不一致が出ている。
- `tests/src/register/register-branch.integration.test.ts`: register ブランチ操作の統合テストを新しい同期動作に合わせて更新した。
- `src/exec/run/register-sync.ts`: 新規ファイル。個票を register ブランチへ同期する処理（三方向取り込み、本文競合時の停止、push 成功後の作業コピー復元）を実装した。

## 3. 申し送り

- 親 runner の `npm run test:integration` が failed。`tests/src/exec/register-resume.integration.test.ts` で、register ブランチ上の個票内容への `toContain` 期待が満たされていない。原因調査と修正が必要で、完了扱いにはできない。
- executor の `exec smoke` と実 agent による `exec run --register` は `requires_human` として残っている。統合後に orchestrator が実行し、結果を個票・result へ追記してから close する。
- 設計判断: executor は従来どおり個票を編集し、成功時の統合前に HEAD・編集後・同期先の本文を三方向で取り込む。状態項目は同期先を採り、本文競合時は停止する。push 成功後だけ個票の作業コピーを戻す。未検証の本文は失敗した worktree に未 commit で保持する。個票の対応結果にも記録済み。
- 親検証と統合の後、orchestrator が実 agent による exec smoke と実際の exec run --register を各 1 回実行し、個票・result に結果を追記してから close する。個票の作業行は理由付きで open としている。
- CHANGELOG に書く事項（v0.10.0、追加）: `register_sync` が有効な project で、`exec run --register` の状態遷移と対応結果を register 専用ブランチへ同期し、exec のコミットから個票を分離する。並行更新・失敗後の再開・post-review に対応する。
- 保護された設定の変更案はない。result は編集していないため、reporter・runner が実施内容・検証結果・申し送りを記入する。
- 人の確認が必要: `specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-4VD6 --executor-by claude-executor --reporter-by gemma26-reporter`（統合後に orchestrator が実行する。実 agent の起動・使用量消費を伴うため executor sandbox では実施しない。）
- 人の確認が必要: `specdojo exec run --project prj-0001 --register PJR-JSEY --worktree --executor-by claude-executor --reporter-by gemma26-reporter`（統合後に orchestrator が確認用個票と利用可能な agent を確認して実行し、結果を記録してから close する。）

## 4. 進め方

個票の完了条件を基準に、runner の個票書き込み先を register ブランチへ切り替えた。新規の `src/exec/run/register-sync.ts` に同期を集約し、既存の再開・post-review・smoke の参照先を揃えた。あわせて統合テストと関連文書を更新した。
