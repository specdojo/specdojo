---
specdojo:
  id: prj-0001:pjr-ez4z-slow-integration-tests
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
  registered_at: "2026-11-22T13:34:28Z"
  due_on: "2026-11-30"
---

# PJR-EZ4Z 遅い統合テストを見つけて速くする

## 1. 概要

統合テストの全件の時間を縮めるため、親の検証の記録にテストのファイルごとの時間を残し、上位のファイルの準備（Git の fixture など）を速くする。確かめる内容は変えない。

## 2. 入力

- 2026-11-22 の集計で、parent-validation-metrics.jsonl には検証ごとの時間だけがあり、テストのファイルごとの時間がない。記録には tests/helpers/parent-validation-reporter.ts を使っている。
- 利用者の承認（2026-11-22、indie）で起票した。担当 DEV、期限 2026-11-30。

## 3. 完了条件

- 親の検証の記録（`parent-validation-metrics.jsonl`）に、統合テストと単体テストのファイルごとの時間を残す。`tests/helpers/parent-validation-reporter.ts` を使う。記録の形は既存の検証ごとの記録と見分けられるようにし、schema があれば直す。
- 統合テストを手元で 1 回流してファイルごとの時間を測り、上位 5 ファイルとその時間を個票の対応結果に書く。
- 上位のファイルのうち、準備（一時リポジトリの作成、Git の fixture、子プロセスの起動など）を共有や作り置きで速くできるものを直す。確かめる内容（期待値・テストの数）は変えない。テスト間で状態を共有するときは、テストの独立を保つ理由を書く。
- 直した前後の時間を、ファイルごとに個票の対応結果に書く。
- 統合テストの時間切れ（`testTimeout`）は延ばさない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
