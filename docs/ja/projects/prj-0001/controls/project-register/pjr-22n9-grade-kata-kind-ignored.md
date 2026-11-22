---
specdojo:
  id: prj-0001:pjr-22n9-grade-kata-kind-ignored
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-22T13:16:07Z"
  derived_from:
    - PJR-7M9J
---

# PJR-22N9 grade run の --kata と --kind を一緒に指定すると、--kind が無視される

## 1. 課題内容

grade run --target kata --kata prj-charter --kind recipe は、recipe ではなく rulebook と sample を評価した。--kind で型の種類を選べず、recipe と template を --kata で評価できない。

## 2. 入力

- 2026-11-22 の grade（run id prj-charter-recipe-20261122、opus-review-executor）で、ログに rulebook（pass 90）と sample（needs-work 83）だけが出て、recipe の結果のファイルは更新されなかった。
- --kata のヘルプは「Grade rulebook and sample for this kata name」で、--kind は rulebook・recipe・sample・template・all を受け付ける。
- 利用者の承認（2026-11-22、indie）で起票した。担当と期限は未定。

## 3. 影響範囲

| 観点         | 影響                                                          |
| ------------ | ------------------------------------------------------------- |
| スコープ     | `grade run --target kata` の対象の選び方                      |
| スケジュール | recipe と template を `--kata` で評価できず、型の確定が遅れる |
| コスト       | 小さい〜中（選び方の修正とテスト）                            |
| 品質         | 評価したつもりで古い結果を読み、合否を取り違える              |
| 関係者       | オーケストレーター、型の整備の schedule                       |

## 4. 対応方針

| 項目     | 内容                                                               |
| -------- | ------------------------------------------------------------------ |
| 原因     | `--kata` を指定すると、`--kind` によらず rulebook と sample を選ぶ |
| 対応策   | `--kata` と `--kind` を一緒に指定したら、指定した種類だけを選ぶ    |
| 依存事項 | なし                                                               |
| 完了条件 | 下の箇条書きのすべてを満たす                                       |

- `--kata` と `--kind` を一緒に指定したら、その型の指定した種類（recipe・template・all など）だけを評価する（単体テストで確かめる）。
- `--kind` を省いたときは、今までどおり rulebook と sample を評価する（単体テストで確かめる）。
- 指定した種類がその型に無い（`not-needed` など）ときは、評価せずにその旨を出す（単体テストで確かめる）。
- `command-reference` の `grade run` の `--kata` と `--kind` の説明を直す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
