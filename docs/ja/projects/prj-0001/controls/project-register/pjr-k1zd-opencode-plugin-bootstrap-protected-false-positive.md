---
specdojo:
  id: prj-0001:pjr-k1zd-opencode-plugin-bootstrap-protected-false-positive
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-01T15:29:49Z"
---

# PJR-K1ZD opencode が生成するプラグインの導入ファイルを保護設定の検査が検出する

## 1. 課題内容

opencode の reporter が worktree の .opencode/ にプラグインを自動導入し、package.json・package-lock.json・node_modules とそれらを ignore する .gitignore を生成する。保護設定の検査がこれらを agent による変更として検出し、exec run が止まる。git が ignore する opencode の導入ファイルだけを安全なものとして除外する

## 2. 影響範囲

| 観点         | 影響                                                             |
| ------------ | ---------------------------------------------------------------- |
| スコープ     | opencode の agent（gemma-reporter など）を使う exec run          |
| スケジュール | opencode の reporter を使う実行が保護設定の検査で止まる          |
| コスト       | 保護設定の検査の除外条件の追加とテスト                           |
| 品質         | 誤検出で実行が止まり、利用者が worktree を手で片付ける必要がある |
| 関係者       | opencode を使う利用者                                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | opencode が起動時に worktree の `.opencode/` へプラグインを自動導入し、`package.json`・`package-lock.json`・`node_modules`・`bun.lock` と、それらを ignore する `.gitignore` を生成する。`.opencode/` は保護パスのため、検査が agent による変更として検出する                                                                                                                                          |
| 対応策   | `src/exec-agent-protected-config.ts` の検査で、opencode の導入ファイル（`.opencode/package.json`・`.opencode/package-lock.json`・`.opencode/bun.lock`・`.opencode/node_modules/**`・`.opencode/.gitignore`）が git に ignore されている場合だけ安全なものとして除外する。agent 定義（`.opencode/agents/**`）と `AGENTS.md` は引き続き保護する。git の判定が失敗した場合は除外しない（PJR-GRB5 の方針） |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                                   |
| 完了条件 | opencode の導入ファイルが ignore されているときは検査で止まらず、ignore されていないとき、agent 定義を変えたとき、git の判定が失敗したときは止まることを確かめる単体テストがある。親検証がすべて通る                                                                                                                                                                                                   |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-genj-resume-validation-before-develop-sync]]
