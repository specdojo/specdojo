---
specdojo:
  id: prj-0001:pjr-sdwf-composite-check-not-run-block
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-07T21:32:21Z"
  due_on: null
  completed_at: "2026-10-07T22:13:11Z"
  conclusion: 合成コマンドの not_run を、構成するコマンドが runner か executor の検証で通っていれば満たすようにした。PJR-EZAF と PJR-WPR3 が再開で review へ進んだ
---

# PJR-SDWF executor が npm run check を not_run とすると、中身が通っていても block される

## 1. 課題内容

executor が npm run check を「親 runner の検証と重複する」として not_run と記録すると、runner は check という合成コマンドを実行しないため、中身（typecheck・lint・schema・test など）が runner と executor の検証ですべて通っていても block する。PJR-EZAF と PJR-WPR3 で発生。check の中身を展開して判定する。

## 2. 影響範囲

| 観点         | 影響                                                                      |
| ------------ | ------------------------------------------------------------------------- |
| スコープ     | executor / reporter pipeline の機械判定（`deriveReporterFacts`）          |
| スケジュール | 親検証と executor の検証がすべて通っても waiting になり、再開が必要になる |
| コスト       | 再開の手間（PJR-EZAF・PJR-WPR3 で各 2 回）                                |
| 品質         | 判定が実態（検証済み）と食い違う                                          |
| 関係者       | 完了条件に `npm run check` を書いた項目を exec で流す利用者               |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | runner は executor の `not_run` を、runner が同じコマンドを実行して通した場合だけ満たす。合成コマンドの `npm run check` は runner が実行しない                                                                                               |
| 対応策   | `package.json` の script が npm script を `&&` でつないだだけの合成なら構成コマンドを確かめる。構成コマンドは、それ自体の成功、`npm test` と test:unit・test:integration の同等、script の中身の直接実行、さらに合成ならその構成の順に満たす |
| 依存事項 | PJR-979N（委譲した検証の扱い）                                                                                                                                                                                                               |
| 完了条件 | PJR-EZAF と PJR-WPR3 の evidence が complete と判定され、unit test で合成・入れ子・同等・中身の直接実行・任意のシェルの拒否・failed の維持を確かめる                                                                                         |

## 4. 対応結果

- 対応経路: orchestrator（claude）が利用者の指示で直接修正した（63b4108e5、6d13f30b7、eeb87d891）。
- 1 回目の修正では、executor が `validate:catalog` を script の中身で実行して記録した場合と、`validate:schema` 自体が合成である場合を満たせず、WPR3 が再び止まった。script の中身の直接実行の比較と、構成コマンドそれ自体の成功を先に確かめる再帰の判定を加えた。
- unit test を 7 件追加した。修正後の `dist` で PJR-EZAF と PJR-WPR3 の evidence が complete と判定されることを確かめ、両件とも再開で review へ進んだ（739118118、6c0f7c599）。
- exec 設定ガイドと exec 運用ガイドの機械判定の説明に追記した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-979n-delegated-validation-block]]（委譲した検証の扱い）
