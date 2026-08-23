---
specdojo:
  id: prj-0001:pjr-b1sj-angle-placeholder-escape-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-23T13:03:06Z"
  due_on: "2026-08-31"
---

# PJR-B1SJ 山括弧プレースホルダのインラインコード化を個票本文とfrontmatterへ広げる

## 1. 概要

PJR-ZWMH は登録簿索引の山括弧プレースホルダをインラインコード化したが、register add の description は個票本文へそのまま書き込まれるため未エスケープのまま残る。PJR-QVGX で実際に混入し、remark-no-unescaped-angle-placeholder のテストが統合ブランチで失敗した。さらに exec の block_reason は frontmatter へ書かれるため lint も remark も検知できず、VitePress のビルドで問題になる。個票本文と frontmatter の双方を対象へ広げる。

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
