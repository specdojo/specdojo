---
specdojo:
  id: prj-0001:pjr-q5yp-comprehension-debt-measurement
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T13:11:12Z"
  derived_from:
    - PJR-Y5RD
  commit_type: docs
  commit_scope: project
---

# PJR-Q5YP 理解の負債の測り方を定め、OpenFisca-Japan で試す計画を作る

## 1. 概要

新しい参加者や agent が文書だけで主要な問いに答え、変更を始められるかを測る引き継ぎのテストを決め、既存のコードからの復元を含めて OpenFisca-Japan で試す計画を書く

## 2. 入力

- PJR-Y5RD の決定（2026-11-23）: kata による理解の負債の解消で、シビックテックを持続可能にすることを中核の位置づけにする

## 3. 完了条件

- 理解の負債の測り方（引き継ぎのテスト）を決める。少なくとも、新しい参加者（人または agent）が文書だけで、(1) 主要な問い（何のためのシステムか、なぜこの設計か、何が未決か）に答えられるか、(2) 意味のある変更を始めるまでの時間、(3) 答えの誤り・推測の数を測る。prj-overview の BV-03 の判定とどうつながるかを書く（PJR-Y5RD）。
- OpenFisca-Japan で 1 回試す計画を書く。既存のコードから仕様と要件を kata で復元する（retrofit）流れを含め、復元した内容の確認状態と、当事者や経験者による確定の手順を決める。OpenFisca-Japan の側で行う作業は、利用側の登録簿に起票する案として書く（この項目では OpenFisca-Japan のリポジトリを変えない）。
- 試した結果を記録する置き場所と書式を決める。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
