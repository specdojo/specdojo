---
specdojo:
  id: prj-0002:pjr-fsmc-lp-mascot
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: UX
  registered_at: "2026-10-11T06:37:27Z"
  due_on: "2026-10-31"
---

# PJR-FSMC マスコットを specdojo-assets から書き出して LP に配置する

## 1. 概要

specdojo-assets で作ったマスコット（道着を着たカワウソ）の原本を exports.yaml に従って specdojo-lp へ書き出し、Hero の仮の枠を差し替える。キャラクターの設定と原本は PJR-PEVV で作る

## 2. 完了条件

- LP で使うマスコットの画像が、`specdojo-assets` の `exports.yaml` に従って `specdojo-lp` へ書き出され、`specdojo-lp` で commit されている。書き出したファイルを `specdojo-lp` で直接直していない。
- Hero の右側の仮の枠（`data-placeholder="mascot"`、「マスコット（準備中）」）が、書き出した画像に差し替わっている。
  - 画像に、内容を表す `alt` がある。
  - 書き出した形式とサイズ（@1x・@2x など）を使い、`width` と `height` を指定してレイアウトのずれを防ぐ。
- 色・角丸・影は PJR-CM5W で定義したテーマの class だけを使う。
- 変更は `specdojo-lp` の統合先（`feature/lp-v1`）へ入れる。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- 前提: PJR-PEVV で原本と `exports.yaml` の定義ができ、PJR-F34R で書き出しのスクリプトができている。

## 3. 作業内容

| No  | 作業                                          | 担当         | 状態 | メモ                      |
| --- | --------------------------------------------- | ------------ | ---- | ------------------------- |
| 1   | 原本を `specdojo-lp` へ書き出して commit する | UX           | open | PJR-PEVV と PJR-F34R の後 |
| 2   | Hero の仮の枠を画像に差し替える               | UX           | open | -                         |
| 3   | ビルドを確認する                              | orchestrator | open | sandbox の外で確認する    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hktj-assets-repository]]: アセットを specdojo-assets で管理する決定。
- [[prj-0002:pjr-pevv-mascot-character-source]]: キャラクターの設定と原本。本項目の前提。
- [[prj-0002:pjr-f34r-assets-repository-setup]]: 書き出しの仕組み。本項目の前提。
- [[prj-0002:pjr-hepk-lp-content]]: マスコットの仮の枠を置いた LP の原稿。
