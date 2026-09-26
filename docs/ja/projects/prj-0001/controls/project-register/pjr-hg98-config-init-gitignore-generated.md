---
specdojo:
  id: prj-0001:pjr-hg98-config-init-gitignore-generated
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-26T23:06:44Z"
---

# PJR-HG98 config init で生成物を除外する .gitignore を作り register の並行実行の衝突を防ぐ

## 1. 概要

`config init` は利用者のリポジトリに、生成物を git の管理から外す `.gitignore` を作らない。README の手順どおりに始めると登録簿の生成物（`generated/pjr-index.md` など）が git で管理され、**register を並行実行すると、統合の段で生成物が add/add で衝突する。** `config init` で `.gitignore` を用意する。

## 2. 事実

### 2.1. 衝突を確認した経緯

[[prj-0001:pjr-k332-per-item-executor-assignment]] で加えた並行実行の E2E テストが、テスト用リポジトリの `generated/pjr-index.md` の add/add の衝突で失敗した。並行に走った 2 項目が、どちらも登録簿の生成物を作り直したためである。

### 2.2. このリポジトリは除外している

```gitignore
# specdojo doc-index は root/worktree で都度再生成される生成物。
.specdojo/doc-index.json

# specdojo build の生成物（generated/ 配下）。
docs/**/generated/*
!docs/**/generated/.gitkeep
```

`config init`（`src/specdojo-config.ts`）も `config scaffold` も、これに当たる設定を利用者のリポジトリへ作らない。

## 3. 完了条件

- `config init` が、生成物（`docs/**/generated/*`、`.specdojo/doc-index.json`）を除外する `.gitignore` の記述を用意する。
- 既存の `.gitignore` がある場合は、足りない行だけを追記する。既存の行を消したり並べ替えたりしない。
- 同じ行がすでにあれば追記しない。何度実行しても同じ結果になる。
- `--dry-run` があれば、追記する予定の行を表示するだけにする。
- 追記した行、飛ばした行が表示される。
- 生成物の配置（`base_path` など）を変えた場合も除外が効く。パターンが配置に依存するなら、設定から導く。
- すでに生成物を git で管理しているリポジトリへの案内がある（`git rm -r --cached` が必要なこと）。
- register を 2 項目並行で実行しても統合で衝突しないことを、統合テストで確かめる。
- README の「npm で導入する」に、`.gitignore` が作られることが書かれている。
- `npm run check` が通過している。

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ                           |
| --- | ---------------------------------------------- | ---- | ---- | ------------------------------ |
| 1   | 除外するパターンを決める                       | DEV  | open | 配置に依存するかを確かめる     |
| 2   | `config init` へ `.gitignore` の追記を実装する | DEV  | open | 既存の行を壊さない             |
| 3   | 統合テストで並行実行の衝突がないことを確かめる | DEV  | open |                                |
| 4   | README と案内を更新する                        | DEV  | open | 既存リポジトリへの手順を含める |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-k332-per-item-executor-assignment]]
- [[prj-0001:pjr-4hbg-exec-run]]
- `src/specdojo-config.ts`
- `README.md`
