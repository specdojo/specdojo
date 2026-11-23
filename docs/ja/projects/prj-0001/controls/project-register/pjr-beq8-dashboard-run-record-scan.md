---
specdojo:
  id: prj-0001:pjr-beq8-dashboard-run-record-scan
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T23:45:18Z"
  due_on: "2026-11-30"
  block_reason: "executor reported incomplete: RunRecordIndex を追加し dashboard の生成で 1 回だけ読むようにした。typecheck、lint:ts、単体テストは通過。修正前後の出力比較と時間の測定は sandbox で tsx 実行が承認待ちになり未実施のため、個票の作業内容 No.4 は open のまま残した。"
  derived_from:
    - PJR-BBTW
  commit_type: perf
  commit_scope: dashboard
---

# PJR-BEQ8 dashboard の生成で run の記録を項目ごとに全走査しない

## 1. 概要

findRunRecord が記録の置き場のない項目で execution/runs/ を全部たどり、dashboard build 42 秒のうち約 33 秒を使う。1 回の生成で一覧を 1 回だけ読む

## 2. 入力

- docs:dev の起動を速くする（利用者の依頼、2026-11-23）。devcontainer を作り直した後の 2 回目の起動で 58.4 秒だった

## 3. 完了条件

- `src/shared/run-records.ts` の `findRunRecord` が、項目の run の記録の置き場がないときに `execution/runs/` の下を全部たどり、すべての plan と result の frontmatter を読む動きを直す。dashboard の 1 回の生成の中では、run の記録の一覧と frontmatter を 1 回だけ読み、使い回す。
- 直す前と直した後の出力（`dashboard.md`・`exec-records.md` など dashboard の生成物）が同じであることを確かめ、確かめ方を個票の対応結果に書く。
- 2026-11-23 の測りでは、prj-0001 の `specdojo dashboard build` が 42.6 秒で、そのうち `formatTaskLink` から呼ぶ `findRunRecord` が約 33 秒だった（CPU プロファイル）。直した後に同じコマンドの時間を測り、前後を個票の対応結果に書く。
- `findRunRecord` のほかの呼び出し元の動きを変えない。キャッシュを持たせる場合は、1 回の生成の外へ持ち越さない。
- 単体テストを足す（記録の置き場がない項目、複数の run がある項目の最新の選び方）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
