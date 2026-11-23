---
specdojo:
  id: prj-0001:pjr-g6nt-orchestrator-playbook-where
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
  registered_at: "2026-11-23T02:38:54Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2P7C
  depends_on:
    - PJR-9170
  commit_type: feat
  commit_scope: config
---

# PJR-G6NT 運用メモの雛形と specdojo where playbook を足し、指示の本文の案を書く

## 1. 概要

運用メモの雛形を作れるようにし、where で場所を引けるようにする。オーケストレーターの指示の本文を、where で引いた運用メモを読む形に直す案を書く

## 2. 入力

- 利用者の問い（2026-11-23）: オーケストレーターのプロジェクトごとの知見を playbook にまとめているが、正式な機能か。オーケストレーターの答えは、正式ではない（型・置き場所・見つけ方が決まっていない）

## 3. 完了条件

- PJR-2P7C の決定に従い、運用メモの雛形を作れるようにし（`register scaffold` と同じ形、または `config scaffold` の一部）、`specdojo where playbook --project <id>` で場所を引けるようにする。置き場所の既定と、設定で変えられるかを決め、設定リファレンスに書く。
- オーケストレーターの指示の本文（SSOT と各環境の薄いラッパー）を、「`specdojo where playbook` で引いた運用メモがあれば、作業を始める前に読む」に直す案を書く。指示の本文と `CLAUDE.md`・`AGENTS.md` は保護された設定のため、案を個票の対応結果と報告の `handoff` に書き、反映は利用者の承認のもとでオーケストレーターが行う。
- prj-0001 の今の運用メモが、雛形の置き場所の既定と食い違う場合の移し方を書く。
- 単体テストを足す（`where playbook` の解決、雛形の作成）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`CLAUDE.md`・`AGENTS.md`・`templates/` の agent の定義など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
