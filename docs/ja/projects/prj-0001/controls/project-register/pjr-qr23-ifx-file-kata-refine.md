---
specdojo:
  id: prj-0001:pjr-qr23-ifx-file-kata-refine
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-23T04:56:09Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BM07
  commit_type: docs
  commit_scope: kata
---

# PJR-QR23 ifx-file の rulebook と sample を整える（承認の記述と sample の形式）

## 1. 概要

ifx-file-sample に承認と昇格の記述が残り、rulebook の target_format（yaml）と sample の形式（Markdown）が食い違う。ifx-file はどの波にも入っていない

## 2. 入力

- 利用者の決定（2026-11-23）: オーケストレーターの推奨どおり起票する

## 3. 完了条件

- `ifx-file-sample` から、文書の承認と `ready` への昇格の担当や進み具合の記述を外す（PJR-76N9 の決まり。2026-11-23 の grade の major）。採否の論点など、業務上の未決事項だけを残す。
- `ifx-file-rulebook` の `target_format` は yaml だが、sample は Markdown で、rulebook にない章を持ち、ほかの ifx の sample（YAML）ともそろっていない（2026-11-23 の grade の major）。YAML の sample に作り直すか、Markdown とする例外を rulebook に宣言するかを executor が決め、理由を個票の対応結果に書く。
- ifx-file は第 4〜6 波のどの一覧にも入っていないため、この項目で rulebook と sample の組を整え、2026-11-23 の grade の minor も直す。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。

- 2 回目の実行（2026-11-27）で、1 回目の result が未対応とした `ifx-file-rulebook` の minor（運用ルールの追従対象の列挙、検証コマンドの具体化）を直している。根拠は `docs/ja/projects/prj-0001/execution/grade/results/specdojo.ifx-file-rulebook.yaml` の minor の指摘である。
- 同じファイルと `specdojo.ifx-file-sample.yaml` のほかの minor のうち、1 回目の YAML 化で解消したもの・直したもの・直さないもの（理由つき）を、個票の対応結果に表で書いている。

## 4. 作業内容

| No  | 作業                                                                  | 担当 | 状態 | メモ                                                  |
| --- | --------------------------------------------------------------------- | ---- | ---- | ----------------------------------------------------- |
| 1   | sample を YAML に作り直し、承認・昇格の記述を外す                     | BA   | done | `ifx-file-sample.md` を `.yaml` へ改名して再構成      |
| 2   | rulebook の minor（参照キー・`ifx-index` 未登録の契約の照合先）を直す | BA   | done | `schema.schema_ref` を削除し、照合先を明記            |
| 3   | 型の grade の起動                                                     | BA   | open | 統合の後に orchestrator が流す。executor は実行しない |

## 5. 対応結果

### 5.1. 実施内容

- sample の形式は YAML に作り直す方を選んだ。理由は、`sample-authoring-standard` が sample の拡張子を `target_format` に合わせるよう求め、Markdown とする例外を認める記述が standards にないため。ほかの ifx の sample も YAML である。
- `docs/ja/specdojo/samples/ifx-file-sample.md` を `ifx-file-sample.yaml` へ改名し、Markdown の章を持たない YAML にした。補足の表（状態値、再開判定、受入ケース、異常時の次の手）は冒頭の YAML コメントへ移した。
- 承認と `ready` への昇格の担当・進み具合の記述、「PO 業務助言」の表記、`status: draft` の自己言及を外した。採否と受付照会の未決事項（`_UNDECIDED_`）だけを残した。
- 正本スキーマの全文掲載はもともと無く、`required_fields` で表せない制約だけをコメントに残した。
- `dct-kata.yaml` の `ifx-file-sample` の `path` を `.yaml` に更新した。
- rulebook は `schema.schema_ref` を削除して `schema.references` と `files[].schema_ref` の型を明示し、`ifx-index` に登録しない契約の照合先を `based_on` の参照元仕様とした。

### 5.2. 残課題と申し送り

- 週次発注 CSV 連携（`schema.fields` による直接定義の例）は、1 ファイル 1 契約の YAML に収まらないため sample から外した。直接定義の説明は rulebook に残る。復活させる場合は別の sample 契約を足す。
- sample の `x-spec-meta.status` は `draft` にした。`ready` への昇格は人間が行う。
- 型の grade は未実行。rulebook の minor（運用ルールの追従対象、検証コマンドの具体化）は未対応。

### 5.3. CHANGELOG に書く事項

- 区分: Changed
- 行の文案: ifx-file の sample を Markdown から YAML に改め、rulebook の参照キーと照合先の記述を整えた。

## 6. 関連ドキュメント

- `specdojo:ifx-file-rulebook`
- `specdojo:ifx-file-sample`
