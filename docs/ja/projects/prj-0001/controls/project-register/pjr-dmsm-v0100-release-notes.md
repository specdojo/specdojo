---
specdojo:
  id: prj-0001:pjr-dmsm-v0100-release-notes
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T22:38:15Z"
  due_on: "2026-11-30"
  block_reason: "executor reported incomplete: 移行の注意と一部の変更を記載したが、対象個票の文案収集と未発見項目の一覧化が未完了。"
  commit_type: docs
  commit_scope: release
---

# PJR-DMSM v0.10.0 の CHANGELOG と移行の注意をまとめる

## 1. 概要

v0.10.0 に入れた項目の CHANGELOG に書く事項を集めて CHANGELOG.md にまとめ、既存の利用者向けの移行の注意を書く

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- リリースは 12 月の第 1 週を目標にする（利用者の判断、2026-11-24）

## 3. 完了条件

- v0.10.0 に入れた項目（個票の `入力` に「v0.10.0 に入れる」とあるもの、と close 済みの項目）の対応結果から「CHANGELOG に書く事項」を集め、`CHANGELOG.md` の v0.10.0 の節に区分ごとにまとめる。公開済みの版の節は変えない。集めた項目の一覧と、文案が見つからなかった項目を個票の対応結果に書く。
- 既存の利用者（coderdojo-lessons・OpenFisca-Japan など）向けに、移行の注意を v0.10.0 の節に書く。少なくとも、Antigravity CLI（`agy`）の対応を外したこと、pm-* のログの型の非推奨（PJR-X141）、`specdojo update` での上げ方を含める。
- PJR-XC5P（coderdojo-lessons への申し送り）の内容を移行の注意に取り込み、取り込んだことを XC5P の個票に書く（close はオーケストレーターが確かめてから行う）。
- `package.json` の版の更新とタグの作成は行わない（リリースの手順でオーケストレーターが利用者の承認のもとで行う）。
- `npm run lint:md` を通す。

## 4. 作業内容

| No  | 作業             | 担当 | 状態 | メモ                                                             |
| --- | ---------------- | ---- | ---- | ---------------------------------------------------------------- |
| 1   | 文案の収集と照合 | DEV  | open | 対象が多数あるため、収集済み以外の照合と未発見の一覧が必要       |
| 2   | 移行の注意       | DEV  | done | agy、ログの型、更新手順、XC5P の注意を記載                       |
| 3   | 検証             | DEV  | open | 全文案の収集後に再検証する。`npm run lint:md` は親 runner が実行 |

## 5. 対応結果

- `CHANGELOG.md` に未公開の v0.10.0 節を設け、移行の注意と一部の変更を記載した。XC5P の注意を取り込み、同個票にも記録した。
- 収集済み: PJR-N6FQ、PJR-X141、PJR-SJR7、PJR-MS7X、PJR-XC5P、PJR-N5J8、PJR-4VD6、PJR-1JF6、PJR-FBP0、PJR-77FH、PJR-9170、PJR-G6NT、PJR-2Q86、PJR-XSRF、PJR-6690、PJR-1RJP、PJR-YQ32。
- 未完了: v0.9.2 以降に完了した個票と v0.10.0 指定項目を最後まで照合し、残りの文案と文案が見つからない項目を記録する。未完了の項目は公開前に状態を確認する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-xc5p-coderdojo-handoff-v0-4-6|PJR-XC5P]]
- [[prj-0001:pjr-x141-deprecate-pm-log-kata|PJR-X141]]
- [[prj-0001:pjr-ms7x-specdojo-update-command|PJR-MS7X]]
