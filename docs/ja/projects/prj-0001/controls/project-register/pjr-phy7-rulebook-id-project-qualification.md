---
specdojo:
  id: prj-0001:pjr-phy7-rulebook-id-project-qualification
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  registered_at: "2026-11-05T10:45:48Z"
  block_reason: "executor reported incomplete: rulebook 6 件の ID 記述を修飾形へ修正した。個票への書き込みが権限エラーで拒否されたため、作業内容・対応結果の更新が未完了。"
  derived_from:
    - PJR-Q9AW
    - PJR-00NY
---

# PJR-PHY7 rulebook の frontmatter の id の書き方（プロジェクト修飾の有無）を実物とそろえる

## 1. 概要

stsd・cdfd・cdfd-uc・bps の rulebook は成果物の id を「プロジェクト修飾なし」と書くが、カタログから作る成果物は prj-0001: で修飾される。既存の成果物には修飾なしのものもある。どちらを正とするかを決め、rulebook と成果物をそろえる

## 2. 入力

- PJR-Q9AW の磨き込みで、stsd-rulebook の frontmatter の規則（id はプロジェクト修飾なしの `stsd-<term>`）と、scaffold が作った prj-0001:stsd-task-execution が食い違った。既存の stsd-register-entry は修飾なしの id を持つ（2026-11-05）
- 同じ「プロジェクト修飾なし」の書き方は cdfd・cdfd-uc・bps の rulebook にもある

## 3. 完了条件

- 成果物の frontmatter の id はプロジェクトで修飾した形（例: `prj-0001:stsd-task-execution`）を正とする（利用者の決定、2026-11-22、indie）。カタログから作る成果物が修飾され、wikilink も修飾した id で解決するため。
- `stsd-rulebook`・`cdfd-rulebook`・`cdfd-uc-rulebook`・`bps-rulebook` の「プロジェクト修飾なし」の記述を、修飾した形に直す。ほかの rulebook に同じ記述があれば、同じく直す。
- 対応する sample の frontmatter の書き方が rulebook と食い違えば、合わせて直す。
- 既存の成果物で修飾していない id（`stsd-register-entry` など）は、この項目では変えない。一覧を個票の対応結果に書き、直す場合の参照の付け替えの範囲を書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
