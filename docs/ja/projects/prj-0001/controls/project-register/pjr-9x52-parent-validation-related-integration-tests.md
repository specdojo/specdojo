---
specdojo:
  id: prj-0001:pjr-9x52-parent-validation-related-integration-tests
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
  registered_at: "2026-11-22T13:34:24Z"
  due_on: "2026-11-30"
---

# PJR-9X52 親の検証の統合テストを、変更に関係するテストだけに絞れるようにする

## 1. 概要

src か tests を変えた run では、親の検証が毎回 42 ファイルの統合テストを全部流し、中央値 130 秒・最大 869 秒かかる。変更に関係するテストだけを流す方法を選べるようにし、全件は夜間とリリースの前に流す。

## 2. 入力

- 2026-11-22 の集計（run 73 件）: 親の検証の test-integration は中央値 130 秒・最大 869 秒、test-unit は中央値 41 秒。検証ごとの paths による選び方と、lint の一部の並列はもう入っている。
- 既定は今の全件のままにし、設定で選べる形にする。見逃しの危険があるため、使うかは測った結果を見て利用者が決める（indie の承認、2026-11-22）。担当 DEV、期限 2026-11-30。

## 3. 完了条件

- 親の検証の統合テストを、変更したファイルに関係するテストだけに絞る方法を、`exec-defaults.yaml` の parent_validations の設定で選べるようにする（例: `vitest related` に変更したファイルを渡す）。設定のキーと名前は executor が決め、schema を直す。
- 設定を書かないときは、今までどおり全件を流す（単体テストで確かめる）。
- 絞ったときに選ばれるテストを、変更したファイルの例ごとに確かめる（単体テスト）。関係するテストが見つからないとき、設定やテストの基盤（`vitest.*`・`tests/helpers/` など）を変えたときは全件に戻す。
- 絞ったときでも、選ばれたテストと絞った理由を evidence に残し、後から何を流さなかったかが分かるようにする。
- 夜間とリリースの前に全件を流す手順を、`exec-config-guide` と運用の記述に書く。
- 今日の run の変更の例（3〜5 件）で、全件と絞ったときの選ばれるテストの数と時間の見込みを個票の対応結果に書く。実際に使うかは利用者が決めるため、prj-0001 の設定は変えない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- runner の動きを変えるため、統合の後にオーケストレーターが JSEY を流して確かめてから close する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
