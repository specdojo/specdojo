---
specdojo:
  id: prj-0001:pjr-aqmw-fully-guided-refine-pass-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-12T01:12:06Z"
  due_on: "2026-08-31"
---

# PJR-AQMW fully-guided(refine-pass)の指示にrulebook不適合の修正を追加

## 1. 概要

xep-fully-guided-template.mdの「4.2 既存記述の扱い」およびryu-guide.mdの「1.3 参照の共通原則」で、修正対象をdepends_onとの矛盾だけでなく、手順1で確認するrulebookの必須要素・禁止事項（章構成を含む）への不適合も含めるよう修正する。retrofit側（xep-retrofit-template.mdの判断基準表）にrulebook適合を判断基準として追加するかも合わせて検討する。フレームワーク共通ファイルのため他プロジェクトへの影響を確認のうえ反映する。

## 2. 完了条件

- `xep-fully-guided-template.md` の「4.2 既存記述の扱い」で、修正対象が `depends_on` との矛盾に加え、手順1で確認する rulebook の必須要素・禁止事項（章構成を含む）への不適合も含むと明記されている。
- `ryu-guide.md` の「1.3 参照の共通原則」の該当行が、上記と矛盾しない記述に更新されている。
- `xep-retrofit-template.md` の判断基準表（維持・部分反映・作り直し・新設）に rulebook 章構成不適合を判断基準として追加するかどうかを検討し、結論（追加する場合は反映内容、見送る場合は理由）を対応結果に記録している。
- rulebook 適合のための修正が「内容の全面書き換え」ではなく「既存記述を尊重した章立ての移し替え」であることが、テンプレートの記述から読み取れる。
- `npm run lint:md` がエラーなく通る。
- フレームワーク共通ファイルであるため、`prj-0001` 以外で `fully-guided` / `retrofit` approach を使用している track・プロジェクトへの影響有無を確認し、対応結果に記録している。

## 3. 作業内容

| No  | 作業                                                                                         | 担当 | 状態 | メモ |
| --- | -------------------------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | `xep-fully-guided-template.md`「4.2 既存記述の扱い」を修正する                               | ARC  | open | -    |
| 2   | `ryu-guide.md`「1.3 参照の共通原則」の対応行を修正する                                       | ARC  | open | -    |
| 3   | `xep-retrofit-template.md` の判断基準表への rulebook 適合追加要否を検討し結論を出す          | ARC  | open | -    |
| 4   | 他 track・他プロジェクトでの `fully-guided` / `retrofit` approach 使用箇所への影響を確認する | ARC  | open | -    |
| 5   | `npm run lint:md` を実行し、エラーがないことを確認する                                       | ARC  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- 変更対象（`docs/` 内だが `id` 未登録のため相対パス表記）: `docs/ja/specdojo/templates/xep-fully-guided-template.md`、`docs/ja/specdojo/templates/xep-retrofit-template.md`
- 参照の共通原則の正本: [[specdojo:ryu-guide]]
- 提案の経緯を記録したメモ: [[prj-0001:pjr-ez9g-sch-strategy-bootstrap-human-review]]
- 対になる todo: [[prj-0001:pjr-sdxb-bootstrap]]
- `xep-fully-guided-template.md` への過去の変更: [[prj-0001:pjr-0102-xep-fully-guided-template]]
