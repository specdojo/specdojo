---
specdojo:
  id: prj-0001:pjr-sgfc-tf6f-broken-yaml-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-22T08:49:30Z"
  derived_from:
    - PJR-TF6F
---

# PJR-SGFC 確かめ用: YAML のコメントを壊した run が統合の前に止まることを見る

## 1. 概要

PJR-TF6F の統合後の確かめのための項目。ifx-index-sample.yaml の最初のコメントを # # にし、親の検証で止まることを見る。統合させず、確かめた後に reject する

## 2. 入力

- PJR-TF6F の完了条件「YAML を壊した run が統合の前の親の検証で止まることを、実際の exec run --register で 1 回確かめる」のための確かめ用の項目（indie が承認した TF6F の完了条件、2026-11-22）。
- 壊し方は tests/src/exec/worktree-yaml-pages.integration.test.ts と同じ（RS2P と同じ）。表示のページに H1 が増え、markdownlint で止まるはず。

## 3. 完了条件

- `docs/ja/specdojo/samples/ifx-index-sample.yaml` の最初のコメント行の先頭の `#` を、`#` を 2 つ空白で区切った形（例: `# # yaml-language-server`）に替える。そのほかのファイルは変えない。
- 変えた後に検査で止まっても、自分で直さない。この項目は、親の検証が止めることを確かめるためのものである。
- `CHANGELOG.md` は変えない。個票の対応結果には、変えた行だけを書く。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
