---
specdojo:
  id: prj-0002:pjr-b3w9-exec-defaults
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: OPS
  registered_at: "2026-10-11T09:20:10Z"
  block_reason: run.parent_validations は共有の親の検証へ追記するだけで減らせないため、project ごとに置き換える仕組みを本体で用意する方針（案 B）を利用者が選んだ。prj-0001 の PJR-P14M の実装を待つ
---

# PJR-B3W9 prj-0002 専用の exec 既定設定を用意する

## 1. 概要

文書だけを変える prj-0002 の作業で specdojo 本体の全テストが親の検証として走らないよう、親の検証を lint 程度に絞った prj-0002 専用の exec 既定設定を用意する

あわせて、CLI の起動方法も扱う。2026-10-11 の PJR-CM5W の実行で、次の事実を観測した。

- specdojo 本体の checkout（`specdojo-prj-0002`）には `node_modules/.bin/specdojo` がない。パッケージは自分自身を `bin` へリンクしないためである。
- このため、そこで `npx specdojo` を実行すると、npx は checkout 自体を `~/.npm/_npx/<hash>/node_modules/specdojo` へ導入し、その複製を実行する。
- この複製は導入した時点のコードのまま残る。`project/prj-0002/develop` に修正を取り込んでも反映されず、修正前の CLI が worktree 準備を実行して失敗した。
- 回避策として、本体 checkout の `dist/specdojo.js` を `node` で直接起動して実行した。exec 既定設定とあわせて、prj-0002 で使う CLI の起動方法を決める。

## 2. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 3. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
