---
specdojo:
  id: prj-0001:pjr-gbvm-product-root-new-files-out-of-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-10-11T13:43:02Z"
  block_reason: "agent exited with non-zero code: parent validation failed: test-integration"
---

# PJR-GBVM 空のプロダクトリポジトリで最上位の新規ファイルが commit 範囲外になる

## 1. 課題内容

register 由来タスクのプロダクト worktree では、最上位に作った新規ファイル（.gitignore・設定・README）が targets なしでは commit されず統合前検査で止まる。追跡済みディレクトリの無い初期構成の作業で必ず起きる

## 2. 影響範囲

| 観点         | 影響                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------- |
| スコープ     | register 由来のタスクで新規ファイルを commit する範囲（project とプロダクトの両リポジトリ） |
| スケジュール | v0.3.0 の公開前に直す                                                                       |
| コスト       | 初期構成の作業で、最上位の設定ファイルが commit されずに統合が止まる                        |
| 品質         | 必要な成果物が統合されず、人が手で適用する                                                  |
| 関係者       | exec を使う利用者と orchestrator                                                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | agent が最上位に残す使い捨てのファイルを commit しないため、新規ファイルは決まったディレクトリ・追跡済みのディレクトリ・`targets` の下に限っている。追跡済みのディレクトリが無い初期構成では、`.gitignore` や設定ファイルが対象外になり、統合前の検査で止まる                                                                                                                                                                                                                                                                                  |
| 対応策   | 利用者の判断（2026-10-12）により次の方式にする。(1) 予防: executor への指示に、使い捨てのファイルは最上位に作らず worktree の `tmp/` に作ることを加える。(2) 除外: runner は `tmp/` を両リポジトリで commit の対象から常に外す（`.gitignore` の有無によらない）。(3) 緩和: 最上位の新規ファイルも commit の対象にする。(4) 安全網: commit した最上位の新規ファイルを、統合ログと result の申し送りに「最上位に追加したファイル」として列挙し、review で気づけるようにする                                                                      |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 完了条件 | 追跡済みのディレクトリが無いリポジトリで、最上位の新規ファイルが commit され、統合ログと申し送りに列挙されることを統合テストで確認する。`tmp/` 配下のファイルは commit されないことも確認する。executor への指示に `tmp/` の規則が入っていることを確認する。exec-worktree-guide の commit 対象の記述を更新する。統合テストで子プロセスとして CLI を起動する場合は、実リポジトリの `node_modules/.bin/tsx` を絶対パスで起動する。fixture の `agent-members.yaml` は schema の必須項目（`capabilities`・`proficiency`・`priority` など）を満たす |

## 4. 対応結果

- 解決内容:
  1. 予防: `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` および `src/exec-run.ts` の executor 規約に、作業用・使い捨ての一時ファイルはリポジトリ最上位に作らず worktree 内の `tmp/` またはリポジトリ外の一時ディレクトリに配置する規則を明記。
  2. 除外: project リポジトリ（`src/exec-worktree-ops.ts`）およびプロダクトリポジトリ（`src/exec-repo-integration.ts`）の commit 対象判定および残留変更検査において、`.gitignore` の有無によらず `tmp/` 配下を commit 対象外および事前検査ブロック除外として扱うよう実装。
  3. 緩和: register 由来タスクの project worktree およびプロダクト worktree において、最上位の新規ファイル（パスに `/` を含まないファイル）を commit 対象として許可。
  4. 安全網: commit された最上位の新規ファイルを `integrate.log`（scopeLogPath）および result の `## 3. 申し送り` に「最上位に追加したファイル:」として記録。あわせて `docs/ja/specdojo/guides/exec-worktree-guide.md` の commit 対象・除外対象の仕様記述を更新。
- 確認結果:
  - `tests/src/exec-worktree-ops.integration.test.ts` で最上位新規ファイル（`modify.py` 等）の commit、`tmp/` の除外、統合ログおよび申し送りへの記録を確認。
  - `tests/src/exec-task-repos.integration.test.ts` で追跡済みディレクトリの無いプロダクトリポジトリにおける最上位新規ファイル（`.gitignore`, `settings.json`）の commit、`tmp/` の除外、統合ログ・申し送りへの記録、および `productMergeBlockers` の通過を確認。
- 再発防止策:
  - 共通規約テンプレートと executor evidence contract の双方で一時ファイルの `tmp/` 配置を標準化。
  - runner 側で `tmp/` の自動除外と最上位新規ファイルの申し送り記録を恒久化し、レビュー時の気付きを確保。

## 5. 関連ドキュメント

- prj-0002 の PJR-CM5W（`project/prj-0002/develop` 上）: 事象が起きた実行
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]: v0.3.0 の公開前に直すと利用者が判断した（2026-10-12）
