---
specdojo:
  id: prj-0001:pjr-aeke-ifx-api-msg-spec-content
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-22T12:55:19Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0VPB
---

# PJR-AEKE ifx-api と ifx-msg の rulebook と sample の仕様の中身を直す

## 1. 概要

型の grade で、ifx-api と ifx-msg は rulebook と sample とも needs-work だった。必須の info.version と responses の欠け、ifx-api の sample の題材が駄菓子屋の文脈でないことを直す。

## 2. 入力

- 2026-11-22 の型の grade（opus-review-executor）: ifx-api-rulebook 72・ifx-api-sample 73・ifx-msg-rulebook 77・ifx-msg-sample 74、いずれも needs-work。
- major の中心: OpenAPI 3.0.3 と AsyncAPI 2.6.0 で必須の info.version が sample にない。ifx-api-rulebook の必須の構造に info.version と各操作の responses が入っていない。ifx-api-sample は汎用の決済 API が題材で、ifx-index-sample でキャッシュレス決済は対象外とされている。
- PJR-0VPB の executor は「標準の構造を変えない」完了条件に従い、info.version を変更案として個票に残していた。0VPB は運用の記述を外す目的で完了したため、中身の直しはこの項目で扱う（indie の承認、2026-11-22）。

## 3. 完了条件

- `ifx-api-sample` と `ifx-msg-sample` の `info` に `version` を足す。
- `ifx-api-rulebook` の必須の構造に、`info.version` と各操作の `responses` を足す。`ifx-msg-rulebook` の必須の構造と sample が合っていることを確かめる。
- `ifx-api-sample` の題材を、共通サンプル文脈（駄菓子屋きぬや）と `ifx-index-sample` の外部連携の一覧に合う本部の API（商品マスタや売上の登録など）に差し替える。`ifx-index-sample` の対象外（キャッシュレス決済）を題材にしない。`ifx-index-sample` のどの項目の詳しい仕様かを sample に示す。
- OpenAPI と AsyncAPI の標準の構造は守る。
- ほかの型の rulebook と sample は変えない。`ifx-index-sample` を直す必要があれば、変更案を個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run validate:schema`・`npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
