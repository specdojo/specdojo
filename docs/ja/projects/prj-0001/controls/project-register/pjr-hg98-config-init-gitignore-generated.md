---
specdojo:
  id: prj-0001:pjr-hg98-config-init-gitignore-generated
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-09-26T23:06:44Z"
  block_reason: "agent exited with non-zero code: runner による検証 `test-integration` が失敗（exit 1）しており、完了条件を満たしていない。"
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

| No  | 作業                                           | 担当 | 状態 | メモ                                                         |
| --- | ---------------------------------------------- | ---- | ---- | ------------------------------------------------------------ |
| 1   | 除外するパターンを決める                       | DEV  | done | `docs/` 外の配置は `base_path` か各パスの親から導く          |
| 2   | `config init` へ `.gitignore` の追記を実装する | DEV  | done | 既存の行は変えず、足りない行だけを末尾へ追記する             |
| 3   | 統合テストで並行実行の衝突がないことを確かめる | DEV  | done | 並行 E2E テストの手書き `.gitignore` を `config init` に置換 |
| 4   | README と案内を更新する                        | DEV  | open | reference は更新済み。README は executor の書き込み権限外    |

## 5. 対応結果

- `src/specdojo-gitignore.ts` を追加し、生成物を除外するパターンの導出（`gitignorePatternsForProjects`）と、既存の `.gitignore` への追記（`mergeGitignore` / `ensureGitignore`）を実装した。
- 既定のパターンは `.specdojo/doc-index.json`、`docs/**/generated/*`、`!docs/**/generated/.gitkeep`、`docs/**/execution/exec/.locks/` とした。`base_path` が `docs/` の外にある場合は `<base_path>/**/generated/*` などを、`base_path` が無い場合は各パス設定の親ディレクトリから導いた行を追加する。
- `config init` は、設定を作成したときも、設定がすでにあるときも `.gitignore` を確認し、足りない行だけを追記する。追記した行と飛ばした行を表示し、追記があった場合は管理済みの生成物を外す手順（`git ls-files -ci --exclude-standard -z | xargs -0 -r git rm --cached --quiet`）を案内する。`--dry-run` では何も書き込まない。
- `tests/src/specdojo-config-command.test.ts` に、新規作成・既存への追記と冪等性・`--dry-run`・配置からの導出・CRLF の維持を確かめるテストを追加した。
- `tests/src/exec-register-pipeline-e2e.integration.test.ts` の 2 項目並行実行テストで、手書きしていた `.gitignore` を `config init` の実行と案内どおりの管理解除に置き換えた。
- `command-reference.md` と `specdojo-config-reference.md` に `.gitignore` の追記を記載した。
- _TODO_ README の「npm で導入する」への追記は、executor に README の書き込み権限が無く未実施。追記する文案は executor の evidence（最終報告）に残した。

## 6. 関連ドキュメント

- [[prj-0001:pjr-k332-per-item-executor-assignment]]
- [[prj-0001:pjr-4hbg-exec-run]]
- `src/specdojo-config.ts`
- `README.md`
