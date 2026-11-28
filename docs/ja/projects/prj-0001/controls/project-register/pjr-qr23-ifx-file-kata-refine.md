---
specdojo:
  id: prj-0001:pjr-qr23-ifx-file-kata-refine
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-23T04:56:09Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-27T12:21:03Z"
  conclusion: ifx-file の sample を YAML に作り直して承認の記述を外し、rulebook の参照キー・照合先・minor の指摘を直した。型の grade は rulebook pass 95、sample pass 92
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
- 型の grade は未実行（統合の後に orchestrator が流す）。

### 5.2.1. 2 回目の実行（2026-11-27）の minor の扱い

| 出典              | 指摘                                                                       | 扱い   | 内容・理由                                                                                                               |
| ----------------- | -------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| rulebook F001     | 6.1・6.2 が 1.2・5.6 と重複                                                | 直した | 6.1 の 2 項目めを 3.1 参照に、6.2 の正本参照を 5.6 の 3 項目め参照に短縮した                                             |
| rulebook F002     | 追従対象と担当が未定義                                                     | 直した | 8.2 に追従対象の表（`ifx-index`・参照元 `ifx-cmd`・正本・実装とテスト）と Role code を追加した                           |
| rulebook F003     | 検証コマンドが具体でない                                                   | 直した | 8.1 に `npx prettier --check <path>`・`npm run validate:schema:file`、終了コード、再実行手順を追加した                   |
| rulebook F004     | `schema.schema_ref` が未定義                                               | 解消済 | 1 回目に `schema.schema_ref` を削除し、`schema.references` の型を明示した                                                |
| rulebook F005     | sample の形式が `target_format` と不一致                                   | 解消済 | 1 回目に sample を YAML 化した                                                                                           |
| rulebook F006     | `ifx-index` 未登録契約の照合先                                             | 解消済 | 1 回目に `based_on` の参照元仕様を照合先と明記した                                                                       |
| sample F001〜F008 | Markdown 時点の指摘（全文掲載・承認記述・`PO` 表記・状態表記・形式不一致） | 解消済 | 1 回目の YAML 化で該当記述を除いた。F002（取引状態欠落の行の混在）は sample のコメント 51・52 行で事象ごとに分かれている |

### 5.3. CHANGELOG に書く事項

- 区分: Changed
- 行の文案: ifx-file の sample を Markdown から YAML に改め、rulebook の参照キー・照合先・検証コマンド・追従対象の記述を整えた。

## 6. 関連ドキュメント

- `specdojo:ifx-file-rulebook`
- `specdojo:ifx-file-sample`
