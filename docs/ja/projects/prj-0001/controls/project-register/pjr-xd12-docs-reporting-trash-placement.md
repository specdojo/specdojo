---
specdojo:
  id: prj-0001:pjr-xd12-docs-reporting-trash-placement
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-06T15:04:41Z"
  due_on: null
  derived_from:
    - PJR-VH8D
---

# PJR-XD12 reporting の出力先と trash の文書の置き場所を直す

## 1. 概要

reporting/ がない件を実装で調べて直し、docs/ja/product/trash/ の 22 件を project の外の archive へ移してサイトと索引から外す（VH8D の #10・#12）

## 2. 入力

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える

## 3. 完了条件

- `job-weekly-report.yaml` と docs-structure-guide が出力先とする `reporting/progress-reports` が prj-0001 にない理由を、実装（job と routine）で調べ、個票の対応結果に書いている（出力の時に作られる、ジョブの出力先の誤り、まだ一度も動いていない、など）。調べた結果に合わせて、ジョブの定義かガイドのどちらかを直している。
- `docs/ja/product/trash/` の 22 件を、プロダクトの文書のツリーの外の archive（例: `docs/ja/projects/prj-0001/archive/`。置き場所は executor が決めて理由を書く）へ `git mv` で移し、文書サイトと doc index の対象から外している。移した文書を参照する wikilink があれば、壊れていないことを確かめている。
- archive の置き場所を docs-structure-guide に書いている。
- `npm run lint:md`・`npm run lint:fm`・`npm run docs:build`（または文書サイトの生成の検査）と `npx specdojo index build` が通っている。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えていない。
- 保護された設定を変える必要があるときは、変えずに案を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。

## 4. 作業内容

| No  | 作業                              | 担当 | 状態 | メモ |
| --- | --------------------------------- | ---- | ---- | ---- |
| 1   | reporting/ がない理由を調べて直す | DEV  | open | -    |
| 2   | trash の 22 件を archive へ移す   | DEV  | open | -    |
| 3   | ガイドに置き場所を書く            | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-vh8d-execution-records-layout]]: 配置の決定
- [[specdojo:docs-structure-guide]]: 構成図の正本
