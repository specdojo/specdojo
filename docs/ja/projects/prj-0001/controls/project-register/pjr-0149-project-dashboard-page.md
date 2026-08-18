---
specdojo:
  id: prj-0001:pjr-0149-project-dashboard-page
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  due_on: "2026-08-31"
  conclusion: rate limit reached
---

# PJR-0149 各プロジェクトにダッシュボードページを追加（schedule進捗・register状況・routine実行状況の一覧化）

## 1. 概要

現状、プロジェクトの状況確認は、Scheduleの進捗・日程を示す `execution/generated/gantt-chart.md` / `gantt-chart.svg`、トラックの着手順序を示す Timeline（`timeline/tml-index.yaml` と `timeline/generated/`）、registerの登録・消化状況、routineの実行状況に分散しており、一目で全体像を把握できるページがない。

Schedule進捗、Timelineのトラック順序計画、register登録・消化状況、routine実行状況を一覧できるダッシュボードページをプロジェクトごとに生成する。生成機能は全プロジェクト共通とし、VitePressサイドバーの各プロジェクトメニューへダッシュボードの導線を自動追加する。完了時の表示確認は `prj-0001` を対象とする。

## 2. 完了条件

- ダッシュボードに表示する情報として、Scheduleの進捗率・状態別タスク数・Gantt chart、Timelineのwave・トラック・依存関係・カタログ状態・Schedule展開準備状況、registerの状態別・優先度別件数、routineごとの最終実行・実行結果・due状況が定義されている。
- Scheduleの集計は `execution/generated/state.json` / `ready.json`、Timelineの集計は `timeline/tml-index.yaml` / `timeline/generated/timeline.json`、registerの集計は個票Frontmatter、routineの集計は `rtn-*.yaml` / `generated/routine-state.json` を使用し、Markdown表示文言の解析に依存していない。
- Scheduleは既存の `execution/generated/gantt-chart.md` / `gantt-chart.svg` を表示し、Timelineについてもトラックのwave、依存関係、着手順序をGantt chart形式で表示できる。Timeline用Gantt chartの横軸はwave番号ではなく日付とし、Timelineの計画開始日、`catalog_duration_estimate_days`（稼働日の推定日数）、`order`、`depends_on`、`parallel_group` から各トラックの予定開始日・予定終了日を算出して表示する。
- Timeline用Gantt chartの日付算出に使用する計画開始日と、推定稼働日数を暦日に変換する稼働日カレンダーの機械可読な正本・配置先が定義されている。
- routineのdue状況は、routine定義、現在時刻、最終実行時刻から算出され、CLI出力の転記に依存せずダッシュボードへ表示される。
- ダッシュボードの生成機能が全プロジェクト共通で実装され、各プロジェクトに固有のダッシュボードページが生成される。
- VitePressサイドバーの各プロジェクトメニューに、ダッシュボードへの導線が自動追加される。
- ダッシュボードページが実際に作成され、VitePressサイドバーからの導線を含めて対象プロジェクト（`prj-0001`）で表示確認できている。

## 3. 作業内容

| No  | 作業                                                                                           | 担当 | 状態 | メモ                                     |
| --- | ---------------------------------------------------------------------------------------------- | ---- | ---- | ---------------------------------------- |
| 1   | Schedule、Timeline、register、routineの表示項目を定義する                                      | ARC  | done | ダッシュボードの4セクションとして実装    |
| 2   | 機械可読な正本・JSONを入力とする集計方法を設計する                                             | ARC  | done | Markdown文言を解析せず正本を直接集計     |
| 3   | Scheduleの既存Gantt chartと、推定稼働日数から予定日付を算出するTimeline用Gantt chartを設計する | ARC  | done | 日付軸SVGと稼働日計算を実装              |
| 4   | routine定義と状態ファイルから最終実行・実行結果・due状況を算出する                             | ARC  | done | interval・cronのdue判定を共通関数で算出  |
| 5   | 全プロジェクト共通のダッシュボード生成機能と、プロジェクトごとのページ生成を実装する           | ARC  | done | `dashboard build` と統合build stepを追加 |
| 6   | VitePressサイドバーへ各プロジェクトのダッシュボード導線を自動追加する                          | ARC  | done | 固定表示名と表示順を追加                 |
| 7   | `prj-0001` でダッシュボードの内容、Gantt chart、サイドバー導線を表示確認する                   | ARC  | done | 生成とVitePress buildで確認              |

## 4. 対応結果

- `specdojo dashboard build --project <project-id>` を追加し、各プロジェクトの `execution/generated/dashboard.md` と `dashboard-timeline-gantt.svg` を生成できるようにした。共通の `specdojo build` にも `dashboard` scopeを追加した。
- Scheduleは `state.json` / `ready.json`、Timelineは `tml-index.yaml`、registerは個票Frontmatter、routineは `rtn-*.yaml` / `routine-state.json` を直接読み、MarkdownやCLI表示文言に依存せず集計する構成にした。
- `tml-index.yaml` の `planned_start_date` とScheduleの稼働日カレンダーを正本として、トラックの推定稼働日数、wave、依存関係から予定開始日・予定終了日を算出し、日付軸のGantt SVGを生成するようにした。
- 稼働日加算で非稼働日にカーソルが進まない無限ループを修正した。空の稼働曜日、不正日付を即時エラーにし、Vitestのworker数を2に制限して再発時の資源枯渇を抑止した。
- routineのcron due判定では `last_run` ではなく機械可読な `last_scheduled_for` を使用するようにした。
- VitePressサイドバーに「ダッシュボード」（order 60）を追加した。`prj-0001` のダッシュボードを再生成し、VitePress buildでページと導線を確認した。
- 型検査、対象テスト43件、全unitテスト1,049件、Timeline schema検証、catalog validate、VitePress buildが成功した。catalog validateの既存未生成文書に関するwarningと、VitePressの既存chunk size・cron highlighting warningのみが残る。

## 5. 関連ドキュメント

- [[prj-0001:pjr-index|プロジェクト登録簿]]
- [[specdojo:routine-operation-guide|routine運用ガイド]]
- [[specdojo:schedule-operation-guide|Schedule実行運用ガイド]]
- [[specdojo:timeline-design-guide|Timeline設計ガイド]]
- docs/ja/projects/prj-0001/execution/generated/gantt-chart.md
- docs/ja/projects/prj-0001/timeline/tml-index.yaml
- .vitepress/sidebar-config.ts
