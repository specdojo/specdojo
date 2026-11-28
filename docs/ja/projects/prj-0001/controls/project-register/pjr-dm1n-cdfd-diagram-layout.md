---
specdojo:
  id: prj-0001:pjr-dm1n-cdfd-diagram-layout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-28T13:58:16Z"
  due_on: "2026-12-31"
---

# PJR-DM1N CDFD の図を、種類ごとに囲み・担当のレーン・時系列で描く

## 1. 背景

CDFD の sample の図が分かりにくいため、全体概要は業務のまとまりの囲み、プロセスグループ別は担当ごとのレーンと受け渡しの番号、ユースケース別は D2 の sequence_diagram で描く

## 2. 入力

- indie の指摘（2026-11-28）: CDFD の図が分かりにくい。担当ごとのレーン、時系列の並び、業務のまとまりの囲みなどがないと頭に入らない。分かりにくいのは全部で、まず型の sample から直す
- 今の cdfd-d2-rulebook は direction: down と PDCA の順の並びを決め、コンテナはプロセスグループ別で関連プロセスを見た目でまとめるときだけ許し、全体概要でグループを囲むことを禁じている。担当のレーンと手順の番号の決まりはない
- 比べた案: A 担当ごとのレーン / B 時系列（ユースケース別は `sequence_diagram`、ほかは受け渡しの番号） / C 業務のまとまりの囲み。図の種類ごとに使い分ける推奨を indie が採った（2026-11-28）
- 担当 BA・期限 2026-12-31 は indie の指示（2026-11-28）

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
