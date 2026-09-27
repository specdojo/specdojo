---
specdojo:
  id: prj-0001:xer-pjr-ffpk-20260927t074721z-a21f
  type: exec-result
  task_id: PJR-FFPK
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-ffpk-20260927T074721Z-a21f-plan.md
  started_at: "2026-09-27T07:47:44.082Z"
  completed_at: "2026-09-27T07:55:37.876Z"
  agent: claude-expert-executor
  block_reason: "agent exited with non-zero code: 親 runner の検証 `test-integration`（`id: test-integration`, `command: npm run test:integration`）が `status: failed`（exit 1）で記録されている。executor 自身の検証（`prettier` / `markdownlin…"
---

# Edit Result

## 1. 実施内容

- executor は `origin: register` タスクの commit 範囲を絞り込み、`src/exec-worktree-ops.ts` で HEAD に無い新規ファイルを既知の成果物ディレクトリ・HEAD 追跡済み最上位ディレクトリ・対象タスクの result / evidence・plan の `targets` から解決したパスのみに限定し、それ以外は `commit-scope:` 警告に加えて `integrate.log` にも記録するよう変更した。
- `assertNoAgentReadyPromotion`（ready 昇格検査）が絞り込み後の commit 対象のみを見るように修正され、一時ファイルの `status: ready` 記述で統合が誤って止まらないようにした。
- `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` と `docs/ja/specdojo/guides/exec-worktree-guide.md` に、作業用の一時ファイルはリポジトリ外に置き終了前に削除する旨、および register 由来タスクの commit 範囲の説明を追記した。
- 個票 `pjr-ffpk-agent-scratch-files-in-commit.md` の作業内容・対応結果セクションを今回の実装内容で更新した。
- `tests/src/exec-worktree-ops.integration.test.ts` に統合テストを 3 件追加し、一時ファイルが commit されず `integrate.log` に記録される挙動、追跡済みルートファイル・`targets` 解決成果物が commit される挙動、commit 対象成果物の ready 昇格は従来どおり止まる挙動を検証している。
- executor は、テスト用 fake executor がリポジトリ直下の `pipeline-artifact.md` に成果物を書いていたため新ルールで一時ファイル扱いされ失敗した既存の統合テスト 2 件について、フィクスチャ側の書き込み先を `docs/pipeline-artifact.md` および `docs/protection-applied` へ移す修正を `tests/src/exec-register-pipeline-e2e.integration.test.ts` と `tests/src/exec-register-resume.integration.test.ts` に施した。
- executor 自身は `npm run test:unit` / `npm run test:integration` を実行しておらず、親 runner による実行結果として、親検証 `test-integration`（`npm run test:integration`）が `failed`（exit 1）で記録されている。同じ親検証セットのうち `validate-schema`・`typecheck`・`test-unit` は `passed` である。
- 本タスクの完了条件は「統合検査（親 runner の integration test を含む）が通ること」を含むと解され、`test-integration` が failed のままでは deliverable の修正が意図どおり機能していることを検証できない。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/controls/project-register/pjr-ffpk-agent-scratch-files-in-commit.md`: 個票の作業内容・対応結果セクションを、今回実装した commit 範囲絞り込みと ready 昇格検査の修正内容で更新した。
- `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md`: 共通規約に「作業用ファイルはリポジトリ外（一時ディレクトリ）に置き、終了前に削除する」旨を追記した。
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: register 由来タスクの commit 範囲（既知成果物ディレクトリ・HEAD 追跡済みルート・result/evidence・`targets`）の説明を追記した。
- `src/exec-run.ts`: commit しなかった変更の警告を `integrate.log` にも記録する処理を追加した。
- `src/exec-worktree-ops.ts`: `origin: register` タスクの commit 対象を、既知の成果物ディレクトリ・HEAD 追跡済み最上位ディレクトリ・result/evidence・`targets` 解決パスに限定するロジックを追加し、`assertNoAgentReadyPromotion` が絞り込み後の commit 対象のみを検査するように修正した。
- `tests/src/exec-register-pipeline-e2e.integration.test.ts`: fake executor が成果物を書き込むパスをリポジトリ直下の `pipeline-artifact.md` から `docs/pipeline-artifact.md` へ変更した。
- `tests/src/exec-register-resume.integration.test.ts`: テストで使用するマーカーファイルのパスをリポジトリ直下から `docs/protection-applied` へ変更した。
- `tests/src/exec-worktree-ops.integration.test.ts`: 一時ファイル除外、追跡済みルート/`targets` 成果物の commit、ready 昇格検査を検証する統合テストを 3 件追加した。

## 3. 申し送り

- 親 runner の親検証 `test-integration`（`npm run test:integration`）が `failed`（exit 1）で終了しているため、まずこの失敗の原因を特定する必要がある。evidence の summary は出力冒頭のみで、どのテストケースがどう失敗したかは判読できない。
- executor の final_message は「2 回目に失敗した統合テスト 2 件」を fake executor のフィクスチャ書き込み先問題として修正済みと述べているが、親 runner の `test-integration` 結果はその修正後の状態で `failed` になっている。今回追加した 3 件の新規テスト、または既存テストのいずれかで新たな失敗が生じている可能性があるため、`npm run test:integration` を再実行し、失敗テスト名とスタックトレースを確認する必要がある。
- 特に `src/exec-worktree-ops.ts` の commit 範囲絞り込みロジックが、他の統合テスト（e2e / resume 以外）が前提とする「リポジトリ直下に生成される成果物」を意図せず除外していないか確認する。
- 原因を特定して修正した後、`npm run test:integration` を再実行し `passed` になることを確認してから再度 result を更新する。

## 4. 進め方と実践の型の適用

plan の「進め方」に従い、個票と登録簿の該当行を踏まえ、`origin: register` タスクの commit 範囲を `src/exec-worktree-ops.ts` で絞り込み、`assertNoAgentReadyPromotion` を絞り込み後の commit 対象に限定する形で修正した。共通規約テンプレートとガイドに一時ファイルの扱いを明文化し、個票を更新した。既存の統合テスト 2 件が新ルールでフィクスチャの書き込み先（リポジトリ直下）を一時ファイルとして除外してしまい失敗した点は、フィクスチャ側のパスを `docs/` 配下へ移すことで対応し、新規テスト 3 件を追加した。executor 自身は plan の共通規約に従い `test-unit` / `test-integration` を sandbox 内で実行せず、親 runner の実行結果に委ねた。しかし親 runner が実行した `test-integration` が `failed` で記録されており、この検証結果は authoritative であるため、evidence からは deliverable の修正が統合検査を通過することを確認できず、完了と判断できない。
