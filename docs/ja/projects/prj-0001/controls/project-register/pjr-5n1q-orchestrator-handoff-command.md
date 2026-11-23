---
specdojo:
  id: prj-0001:pjr-5n1q-orchestrator-handoff-command
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T01:52:55Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-5RY7
  depends_on:
    - PJR-2Q86
  commit_type: feat
  commit_scope: orchestrator
---

# PJR-5N1Q specdojo orchestrator handoff を作り、引き継ぎの手順を指示と playbook に足す

## 1. 概要

進行中と判断待ちを登録簿と exec の状態から組み立てて handoff を起票するコマンドを作り、始めと終わりの手順を足す

## 2. 入力

<!-- 対話で得た前提・制約・委任範囲を記録する。完了・回答の判定条件とは分ける。 -->

-

## 3. 完了条件

- `specdojo orchestrator handoff` を作る。開いている `handoff` の個票を起票し、「進行中」の章を、流している列（`exec queue`）・実行中の run・review と waiting の register 項目から組み立てて埋める。「判断待ち」の章には、開いている `question` と waiting の項目への参照を入れる。手で書く章（引き継ぎ元と先・有効な承認の範囲・注意点）は `_TODO_` で残す。
- `--dry-run` で書き込まずに中身を表示できる。開いている handoff がほかにあるときは、その旨を出す。
- 単体テストを足す（進行中と判断待ちの組み立て、開いている handoff があるときの扱い）。
- オーケストレーターの指示（SSOT の本文と、各環境の薄いラッパー）と playbook に、始めるときは開いている handoff を読んで受け取った主体を `--by` にして close し、終えるときはこのコマンドで起票する手順を足す案を書く。指示の本文と playbook は保護された設定のため、案を個票の対応結果と報告の `handoff` に書き、反映は利用者の承認のもとでオーケストレーターが行う。
- runner と CLI の動きを変えるため、統合の後に orchestrator が prj-0001 で `orchestrator handoff --dry-run` を流して確かめてから close する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`CLAUDE.md`・`AGENTS.md` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`・`npm run validate:schema` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
