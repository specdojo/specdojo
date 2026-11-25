---
specdojo:
  id: prj-0001:pjr-xekv-playbook-cli-gaps
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-24T23:02:49Z"
  derived_from:
    - PJR-69ZX
---

# PJR-XEKV 運用メモで手作業で回避している CLI の不足を 3 つ直す

## 1. 概要

prj-0001 の運用メモ（`pm-orchestrator-playbook`）で、オーケストレーターが手作業で回避している CLI の不足のうち、まだ項目のない 3 つを直す。手作業の回避はコマンドへ移す方針（オーケストレーターの回避策はコマンドへ）に沿う。

## 2. 入力

- 運用メモの第 3 章（exec queue status の EPIPE、exec resume --task を列の段にできない）と第 6.3 節（--section-file が見出しを含むファイルを拒む）の回避（オーケストレーターの調べ、2026-11-25）
- 担当と期限は利用者の確認待ち

## 3. 完了条件

- `exec queue status` の出力を `head` などで途中で切っても、EPIPE で落ちずに終わる（終了コード 0、stderr に例外を出さない）。ほかの一覧を出すコマンドにも同じ落ち方があれば同じ形で直し、直したコマンドを個票の対応結果に書く。
- `exec queue add` の段に、schedule のタスクの再開（`exec resume --task <task-id>`）を置ける。置けない理由（設計上の制約）がある場合は、その理由と代わりの方法を決めて個票の対応結果と報告の `handoff` に書く。
- `register update --section <章> --section-file <path>` で、章の本文に小節の見出し（その章より 1 段深い `###` の見出し）を含められる。章の見出し（`##`）と、章をまたぐ見出しは今までどおり拒む。
- 単体テストを足す（EPIPE で落ちないこと、列の段としての再開、小節の見出しを含む本文の差し替えと、拒む見出し）。
- コマンドリファレンスと関係するガイドに、変わった動きを書く。
- 破壊的な変更をしない（PJR-T2X5）。今の引数・出力・終了コードの意味は保つ。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。統合の後に、オーケストレーターが 3 つの動きを手元で確かめてから close する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
