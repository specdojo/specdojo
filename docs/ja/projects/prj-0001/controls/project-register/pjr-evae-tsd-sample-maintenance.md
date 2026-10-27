---
specdojo:
  id: prj-0001:pjr-evae-tsd-sample-maintenance
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-10-27T12:39:06Z"
  completed_at: "2026-10-27T14:11:44Z"
  conclusion: tsd-sample を PostgreSQL / Prisma の詳細定義の完成例に作り直した
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
---

# PJR-EVAE tsd-sample を新しい tsd-rulebook に合わせて見直す

## 1. 概要

tsd-sample は技術の一覧を並べる初期の作りのままで、見直した tsd-rulebook の技術領域ごとの詳細定義（構成、採用設定、導入、動作確認、継続利用）と合っていない。rulebook に沿った完成例に作り直す。

## 2. 完了条件

1. `docs/ja/specdojo/samples/tsd-sample.md` を、[[specdojo:tsd-rulebook]] の必須の本文要件（概要・位置づけ、対象環境・前提条件、採用技術・設定、動作確認、制約・トラブルシュート）を満たす完成例に作り直す。条件付きの本文要件は、題材に必要なものだけを含める。
2. 題材は、PJR-9SXH で `specdojo:tsd-index-sample` が `tsd-sample` の題材に決めた技術領域とする。
3. frontmatter の `type` を、[[prj-0001:pjr-xsm8-sample-maintenance-target-kind]] の原則に従い rulebook の推奨値 `architecture` に直す。`part_of` に `specdojo:tsd-index-sample` を入れる。`id` は変えない。
4. rulebook の記述ガイドに沿い、採用値・推奨値・未決事項を区別する。採用設定の表に反映・確認方法を含め、動作確認の表（確認対象・実行場所・期待結果・失敗時の確認先）を設ける。秘密値は記載せず、プレースホルダーで示す。
5. [[specdojo:sample-authoring-standard]] に従う。`tsd-index-sample.md` は変更しない。食い違いを見つけた場合は、本個票の対応結果と pipeline の報告の `handoff` に書く。
6. `npm run lint:md`・`npm run lint:fm` と、親の検証が通る。
7. `CHANGELOG.md` の未公開の版の節に変更を書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                                                                                     |
| --- | --------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------------------------- |
| 1   | tsd-index-sample で決めた題材と rulebook の要件を確かめる | ARC  | done | 題材（PostgreSQL / Prisma による DB 基盤）と tsd-rulebook の本文・表要件を確認           |
| 2   | tsd-sample を完成例として書き直す                         | ARC  | done | 駄菓子屋きぬや販売管理システムの文脈に沿い、必須章および条件付き章を備えた完成例に再構成 |
| 3   | 検査を流し、対応結果を記録する                            | ARC  | done | lint:md、lint:fm、format チェック等の通過を確認                                          |

## 4. 対応結果

`docs/ja/specdojo/samples/tsd-sample.md` を、見直した `tsd-rulebook.md` および `sample-authoring-standard.md` に適合するよう全面改訂した。

- **題材の適合と構成の刷新（完了条件 1, 2）**:
  - PJR-9SXH（`tsd-index-sample`）で決定された題材「データベース詳細定義（PostgreSQL 16.x / Prisma 5.x）」に基づき、駄菓子屋きぬや販売管理システムの文脈（販売履歴・在庫データ・つけ残高の永続化）に適合した完成例に再構成した。
  - `tsd-rulebook.md` の本文要件（概要・位置づけ、対象環境・前提条件、全体構成・接続経路、採用技術・設定、導入・初期設定、動作確認・切り分け、継続利用と運用・バックアップ、制約・トラブルシュート、未解決事項と解決経路）を網羅した。
- **Frontmatter の整合（完了条件 3）**:
  - `type` を PJR-XSM8 の原則に従い rulebook 推奨値の `architecture` に設定し、`part_of` に `specdojo:tsd-index-sample` を指定した（`id` は `specdojo:tsd-sample` を維持）。
- **採用値・推奨値・未決事項と表要件（完了条件 4）**:
  - 採用値（PostgreSQL 16.x, Prisma 5.x, UTF8, Asia/Tokyo 等）、推奨値（connection_limit, shared_buffers 等）、未決事項（`_UNDECIDED_`: 一時的なメモリ拡張ポリシー）を明確に区分した。
  - 採用設定一覧表に「反映・確認方法」を含め、動作確認一覧表に「確認対象」「実行場所・方法」「期待結果」「失敗時の確認先」を整備した。
  - 接続文字列は秘密値を記載せず、プレースホルダー形式（`<DEV_USER>`, `<DEV_PASSWORD>` 等）で記述した。
- **標準準拠と関連文書整合（完了条件 5）**:
  - `sample-authoring-standard.md` に準拠し、登場人物名を排除して役割名（店主代表、開発担当、運用アドバイザー等）および Role code（ARC, PO, DEV, OPS）で表記した。
  - `tsd-index-sample.md` との食い違いはなく、変更は行っていない。
- **CHANGELOG への記録（完了条件 7）**:
  - `CHANGELOG.md` の `## [Unreleased]` の「変更」節に改訂内容を記録した。

## 5. 関連ドキュメント

- [[specdojo:tsd-rulebook]]
- [[specdojo:sample-authoring-standard]]
- [[prj-0001:pjr-9sxh-tsd-index-sample-maintenance]]
- [[prj-0001:pjr-xsm8-sample-maintenance-target-kind]]
