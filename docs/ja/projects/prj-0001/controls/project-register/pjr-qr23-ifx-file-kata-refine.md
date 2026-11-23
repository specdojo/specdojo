---
specdojo:
  id: prj-0001:pjr-qr23-ifx-file-kata-refine
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
