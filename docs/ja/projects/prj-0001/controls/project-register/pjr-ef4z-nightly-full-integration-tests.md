---
specdojo:
  id: prj-0001:pjr-ef4z-nightly-full-integration-tests
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T00:16:11Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-9X52
  commit_type: feat
  commit_scope: routine
---

# PJR-EF4Z 統合テストの全件を毎晩 routine で流す

## 1. 概要

親の検証の test-integration を related: true にしたため、関係しないと判定されたテストが release の前まで流れない。routine から毎晩 1 回、統合テストの全件を流し、結果を朝の報告に残す

## 2. 入力

- PJR-9X52 の対応結果は「夜間に npm run test:integration を流す routine などを併せて用意してから related を入れる」としていた。related は 2026-11-23 に先に入れた（936202ff4）
- 今の routine の action は job と specdojo だけで、npm の script を直接流せない

## 3. 完了条件

- 親の検証の `test-integration` は `related: true`（PJR-9X52）で、変えたファイルに関係する統合テストだけを流す。関係しないと判定されたテストも、毎晩 1 回は全件を流せるようにする（利用者の決定、2026-11-23、indie）。
- routine から、統合テストの全件（`npm run test:integration`）を流せるようにする。今の routine の action は `job` と `specdojo` だけで、npm の script を直接流せない。job を足すか、`specdojo` のコマンドを足すかを executor が決め、理由を個票の対応結果に書く。任意のシェルのコマンドを流せる action は足さない。
- 流す時刻は、ほかの夜の routine（`rtn-night-approved-register` など）と負荷が重ならないように決める。実行中の run が統合テストの枠を使っているときは待つか次の回に回し、時間切れで偽の失敗を出さない。
- 結果（成功・失敗・失敗したテストの名前と出力の要約）を routine の実行記録と朝の報告に残す。失敗したときは、人やオーケストレーターが朝に読んで直す項目を起票できるだけの情報を残す。
- prj-0001 の routine の定義（`docs/ja/projects/prj-0001/routines/` の下）を足す。既定は `enabled: true` とし、統合の後に orchestrator が `routine run --id` で 1 回流して確かめる。
- 単体テストを足す（全件の実行の組み立て、結果の記録、枠が使われているときの扱い）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
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
