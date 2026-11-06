---
specdojo:
  id: prj-0001:pjr-xd12-docs-reporting-trash-placement
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                              | 担当 | 状態 | メモ                                                                                     |
| --- | --------------------------------- | ---- | ---- | ---------------------------------------------------------------------------------------- |
| 1   | reporting/ がない理由を調べて直す | DEV  | done | job・routine の実装を確認し、ガイドと Job 実行設計を修正                                 |
| 2   | trash の 22 件を archive へ移す   | DEV  | done | `archive/ja/product/trash/` へ内容を保って移動し、カタログのパスとサイトの旧ID参照を更新 |
| 3   | ガイドに置き場所を書く            | DEV  | done | 公開ツリー外の archive の配置理由と旧IDの扱いを追記                                      |

## 5. 対応結果

### 5.1. reporting の調査と修正

- `src/routine/routine.ts` の `routine run --due` は `enabled: false` の定義を選ばない。週報の `rtn-weekly-report.yaml` は無効な運用前サンプルである。定義を有効化して実行を開始する変更は行っていない。
- `src/job/job.ts` の `prepareJobRun` は入力を展開して作業指示を記録し、`generateJobPlan` は exec plan の保存先だけを作る。報告の保存先を自動作成する処理はなく、agent が初回の週報保存時に作成する。`reporting/` がないことだけでは job の不具合や過去の手動実行の有無は判断できない。
- 週報 job と `dct-project-management.yaml` はともに project 相対の `reporting/progress-reports/` を指定しており、この出力先は正しい。[[specdojo:docs-structure-guide|ドキュメント構成ガイド]] に作成タイミングと prj-0001 の無効なサンプルを説明し、[[sysd-job-execution|Job実行設計]] に残っていた `reporting/weekly/` の例を同じ出力先へ修正した。

### 5.2. archive への移動

- 22件をリポジトリ直下の `archive/ja/product/trash/` へ移動した。`docs/` と project の外に置き、既存のサイト・索引の走査範囲から外せるためこの場所を選んだ。`trash` 区分を残し、現行文書の探索・grade の除外判定も維持した。全22件の本文・frontmatter は元の Git blob と一致する。
- `dct-data-flow.yaml` の18件の `path` だけを移動先へ更新した。公開 doc index に旧IDを残す代わりに、`archive/ja/product/trash/links.json` と docs-site の `archive-links.ts` で過去の wikilink をソースURLへ解決する。過去の plan・result や他の個票を変更せず参照を保った。
- ガイドに配置と旧IDの扱いを追記し、CHANGELOG は `Unreleased` のみ更新した。保護された設定を変更する必要はなかった。

### 5.3. 検証と後続への申し送り

- `node --import tsx tmp/xd12-validate.mts` で文書サイトの生成処理を検査した。22件の内容一致、最新索引3,828件からの旧ID除外、VitePress のステージングからの archive 除外、76文書内225件の wikilink のソースURLへの描画を確認した。索引は `collectDocIndex` でメモリ上に収集し、`.specdojo/doc-index.json` は書き換えていない。検査用ファイルは作業後に削除する。
- カタログ検証、変更したカタログの schema 検査、docs-site の型検査、register / catalog の生成、履歴リンク検査、Prettier に合格した。旧ID・表示名の保持、対応表がないリポジトリ、不正な対応表・欠落した移動先を扱うテストを追加した。lint・unit / integration test は設定された親 runner の検証に委ねる。
- `git mv docs/ja/product/trash/*.md archive/ja/product/trash/` は Git 管理領域の `index.lock` を作れず、読み取り専用のため失敗した。作業ツリー内のファイル移動は実施済みであり、親 runner が22件を rename として記録すること。文字どおり `git mv` による記録が必要な場合は、親側で作業ツリーの移動を戻してから同コマンドを実行する。agent は Git の index・設定・commit を変更していない。
- pipeline 指示に従い `specdojo index build` は実行していない。親 runner が索引を再生成し、result に本節の調査結果・検証結果・移動方法の制約を引き継ぐこと。登録簿の一覧と個票の状態項目は変更していない。

## 6. 関連ドキュメント

- [[prj-0001:pjr-vh8d-execution-records-layout]]: 配置の決定
- [[specdojo:docs-structure-guide]]: 構成図の正本
