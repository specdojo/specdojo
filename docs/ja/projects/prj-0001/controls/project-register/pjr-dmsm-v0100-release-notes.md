---
specdojo:
  id: prj-0001:pjr-dmsm-v0100-release-notes
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T22:38:15Z"
  due_on: "2026-11-30"
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

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
