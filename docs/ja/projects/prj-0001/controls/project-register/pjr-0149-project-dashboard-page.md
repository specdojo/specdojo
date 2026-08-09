---
specdojo:
  id: prj-0001:pjr-0149-project-dashboard-page
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  due_on: "2026-08-31"
---

# PJR-0149 各プロジェクトにダッシュボードページを追加（schedule進捗・register状況・routine実行状況の一覧化）

## 1. 概要

現状はschedule進捗(timeline.md)、register登録/消化状況(pjr-index.md/pjr-views.md)、routine実行状況(specdojo routine list等CLI出力のみ)を個別に確認する必要があり、一目で把握できるページがない。schedule進捗・register登録/消化状況・routine実行状況を一覧できるダッシュボードページを各プロジェクトに追加し、VitePressサイドバーの各プロジェクトメニューから導線を張る

現状、プロジェクトの状況確認は `execution/generated/timeline.md`（schedule進捗）、`pjr-index.md` / `pjr-views.md`（register登録・消化状況）、`specdojo routine list`（routine実行状況、CLI出力のみで生成ページなし）に分散しており、一目で全体像を把握できるページがない。schedule進捗・register登録/消化状況・routine実行状況を一覧できる「ダッシュボード」ページを各プロジェクトに追加し、VitePressサイドバーの各プロジェクトメニューから導線を張る。

## 2. 完了条件

- ダッシュボードに表示する情報（schedule進捗率・状態別タスク数、register状態別/優先度別件数、routineごとのlast_run/due状況）が定義されている。
- 各情報の取得元（`timeline.md` の進捗サマリー、`pjr-index.md`/`pjr-views.md` の集計、routine状態ファイル）が明確化されている。
- routine実行状況について、現状 `specdojo routine list` のCLI出力しか無く生成ページが存在しないため、ページ化の要否・方法（新規生成コマンド追加、または既存コマンド出力のmd化）が決まっている。
- ダッシュボードページの生成方法（新規specdojoサブコマンド追加、または既存生成物の組み合わせ表示）が決まっている。
- `.vitepress/sidebar-config.ts` の各プロジェクトメニューにダッシュボードへの導線が追加されている。
- ダッシュボードページが実際に作成され、`.vitepress/sidebar-config.ts` からの導線を含めて対象プロジェクト（prj-0001）で表示確認できている。

## 3. 作業内容

| No  | 作業                                                                         | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 表示項目の要件整理（schedule/register/routineそれぞれの必要情報の洗い出し）  | ARC  | open | -    |
| 2   | 各情報の取得元・生成方法の設計（既存生成物の再利用 or 新規集計ロジック）     | ARC  | open | -    |
| 3   | routine実行状況の可視化方法の検討（生成ページ新設要否）                      | ARC  | open | -    |
| 4   | ダッシュボードページ生成の実装（specdojoコマンド拡張 or 生成スクリプト追加） | ARC  | open | -    |
| 5   | `.vitepress/sidebar-config.ts` へのメニュー追加                              | ARC  | open | -    |
| 6   | prj-0001での表示確認                                                         | ARC  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-index|プロジェクト登録簿]]
- [[specdojo:routine-operation-guide|routine運用ガイド]]
- [[specdojo:schedule-operation-guide|Schedule実行運用ガイド]]
- docs/ja/projects/prj-0001/execution/generated/timeline.md
- .vitepress/sidebar-config.ts
