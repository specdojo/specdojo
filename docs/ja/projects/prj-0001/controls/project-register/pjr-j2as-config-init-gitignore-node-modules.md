---
specdojo:
  id: prj-0001:pjr-j2as-config-init-gitignore-node-modules
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  registered_at: "2026-10-12T03:21:36Z"
---

# PJR-J2AS config init が .gitignore に node_modules/ を加えない

## 1. 課題内容

README の導入手順（npm init -y → npm install --save-dev specdojo → config init）で、config init は SpecDojo の生成物だけを .gitignore に追記し node_modules/ を加えない。git add . で node_modules が commit される

## 2. 影響範囲

| 観点         | 影響                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| スコープ     | `specdojo config init` が `.gitignore` に追記する行（`src/specdojo-gitignore.ts`） |
| スケジュール | v0.3.0 の公開前に直す（利用者の判断、2026-10-12）                                  |
| コスト       | 利用者が `node_modules/` を誤って commit し、履歴から取り除く手間が生じる          |
| 品質         | README の導入手順どおりに進めると、リポジトリが依存で汚れる                        |
| 関係者       | SpecDojo を新しく導入する利用者                                                    |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `config init` は SpecDojo の生成物（`.specdojo/doc-index.json`、`docs/**/generated/*`、`docs/**/execution/exec/.locks/`）だけを `.gitignore` に追記し、`node_modules/` を扱わない。README の手順は `npm init -y` と `npm install --save-dev specdojo` の直後に `config init` を実行するため、`node_modules/` が無視されないまま残る |
| 対応策   | `config init` が追記する行に `node_modules/` を加える。既存の `.gitignore` に同じ意味の行（`node_modules`、`/node_modules` など）がある場合は追記しない。追記は既存の仕組み（足りない行だけを末尾へ追記し、`--dry-run` で事前に表示する）に従う                                                                                     |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                |
| 完了条件 | `.gitignore` が無い場合と、`node_modules` を含まない `.gitignore` がある場合に `node_modules/` が追記され、すでに同じ意味の行がある場合は追記されないことを単体テストで確認する。`config init --dry-run` の表示に含まれる。README と command-reference の `config init` の説明に反映する                                            |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]: v0.3.0 の公開前に直すと利用者が判断した（2026-10-12）
- [[prj-0001:pjr-pv5b-devcontainer-scaffold-observations]]: 同じ実機確認で気づいた点
