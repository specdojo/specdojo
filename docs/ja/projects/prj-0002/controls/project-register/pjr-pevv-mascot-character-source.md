---
specdojo:
  id: prj-0002:pjr-pevv-mascot-character-source
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: UX
  registered_at: "2026-10-12T09:49:26Z"
  due_on: "2026-10-31"
---

# PJR-PEVV 道着を着たカワウソのキャラクターの設定と原本を作る

## 1. 概要

マスコット（道着を着たカワウソ）の性格・配色・ポーズの種類などの設定を決め、AI での生成と人の手描きを使って原本を specdojo-assets に作る。作り方とライセンスを BRAND.md に記録する

## 2. 完了条件

- マスコット（道着を着たカワウソ）の設定が `specdojo-assets` に書かれている。少なくとも次を含む。
  - 性格と、使う場面での振る舞い
  - 配色（LP のテーマとの関係）
  - ポーズや表情の種類（当面 LP で使うものを含む）
- 原本が `specdojo-assets/mascot/source/` にある。AI での生成と人の手描きの両方を使う。
  - AI で生成したものは、生成のプロンプトと設定を `mascot/prompts/` に残している。
  - 人が描いたものは、作者と利用の許諾の範囲を `BRAND.md` に書いている。
  - 原本ごとに、作り方とライセンスが `BRAND.md` から分かる。
- LP で使う原本が `exports.yaml` に載っている。
- _UNDECIDED_: キャラクターの設定の中身、AI での生成と人の手描きの分担、描く人は、利用者と相談して決める。
- 前提: PJR-F34R で `specdojo-assets` の骨組みができている。

## 3. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ             |
| --- | ------------------------------------------- | ---- | ---- | ---------------- |
| 1   | キャラクターの設定を決める                  | UX   | open | 利用者と相談する |
| 2   | AI での生成と手描きの分担を決め、原本を作る | UX   | open | -                |
| 3   | `BRAND.md` と `exports.yaml` に記録する     | UX   | open | -                |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hktj-assets-repository]]: 派生元の決定。構成の案（`mascot/source/`・`mascot/prompts/`・`exports.yaml`・`BRAND.md`）を含む。
- [[prj-0002:pjr-f34r-assets-repository-setup]]: 骨組み。本項目の前提。
- [[prj-0002:pjr-fsmc-lp-mascot]]: 原本を書き出して LP に配置する項目。
