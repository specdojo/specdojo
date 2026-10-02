---
specdojo:
  id: prj-0001:pjr-k1zd-opencode-plugin-bootstrap-protected-false-positive
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-01T15:29:49Z"
  completed_at: "2026-10-02T00:42:42Z"
  conclusion: opencode の導入ファイルが git に ignore されている場合だけ保護設定の検査から除外し、agent 定義は引き続き保護する
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

- OpenCode が agent 実行中に `.opencode/.gitignore`、`package.json`、`package-lock.json`、`bun.lock`、`node_modules/**` をまとめて生成する条件を単体テストで再現し、既知の導入ファイルかつ Git の ignore 対象である場合だけ保護設定の検査から除外することを確認できるようにした。
- `.opencode/node_modules/` の走査省略を無条件ではなく Git の ignore 判定が成功した場合だけに限定した。ignore されていない場合と Git の判定に失敗した場合は配下を走査し、導入ファイルを保護対象として検出する。
- `.opencode/agents/**` と `.opencode/AGENTS.md` は既知の生成物へ追加せず、従来どおり保護対象に残した。単体テストでは導入ファイルと同時に agent 定義を変更した場合も agent 定義だけを検出する。
- 親 runner が `lint-ts`、`lint-fm`、`lint-md`、`test-integration`、`validate-schema`、`typecheck`、`test-unit` を実行する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-genj-resume-validation-before-develop-sync]]
