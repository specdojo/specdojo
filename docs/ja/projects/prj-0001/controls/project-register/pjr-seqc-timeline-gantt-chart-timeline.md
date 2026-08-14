---
specdojo:
  id: prj-0001:pjr-seqc-timeline-gantt-chart-timeline
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-14T15:08:17Z"
  due_on: "2026-08-31"
---

# PJR-SEQC timelineをgantt-chartへ改名し、timelineをトラック順序計画として新設する

## 1. 概要

現状のtimeline（sch-track群から生成するGantt可視化）をgantt-chartへ改名し、空いたtimelineという名前を、成果物カタログ作成〜トラック実行までのマクロな順序を人間が決めて記録する新しい成果物種別として新設する。

## 2. 完了条件

- 既存`timeline`関連モジュール（`exec-schedule-timeline.ts`／`exec-schedule-timeline-scope.ts`／`exec-schedule-timeline-render.ts`）とそれらが参照する`timeline`という語が`gantt-chart`へ改名されていること（export名・内部変数名を含む）。
- 生成ファイル名（`timeline.svg`／`timeline.md`／`timeline-milestones.*`／`timeline-track-<track>.*`）が`gantt-chart*`系へ改名され、`command-reference.md`／`schedule-design-guide.md`／`docs/ja/projects/prj-0001/execution/README.md`の記述が追随していること。
- 新しい`timeline`（トラック順序計画）の記述形式（YAML/Markdown）・Frontmatter項目・rulebookが定義されていること。
- 新`timeline`が`dct-*.yaml`（成果物カタログ）・`sch-strategy-<track>.yaml`とどう接続するか（トラックの並び・依存関係の宣言が、後続の`schedule build`にどう反映されるか、または参考情報に留めるか）の方針が決まっていること。
- `id-and-file-naming-standard.md`に新しい成果物種別のprefix・命名規則が追記されていること。
- `npm run -s lint:md`にエラーがないこと。
- `npm run typecheck`／`npm run build`が成功すること（改名によるコード変更のため）。
- `npm run docs:build`が成功すること。

## 3. 作業内容

<!-- prettier-ignore -->
| No  | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1   | `exec-schedule-timeline*.ts`のモジュール名・export名・内部変数名の改名 | ARC | open | 対象: `src/exec-schedule-timeline.ts`等3ファイル、参照元`exec-schedule.ts`／`exec-schedule-calendar.ts` |
| 2   | 生成ファイル名の改名（`timeline*` → `gantt-chart*`） | ARC | open | `exec-schedule-timeline-scope.ts`の`fileBase`定義を中心に変更 |
| 3   | ドキュメント記述の追随 | ARC | open | `command-reference.md`／`schedule-design-guide.md`／`execution/README.md` |
| 4   | 新`timeline`の記述形式・Frontmatter・rulebook設計 | ARC | open | 対象: `docs/ja/specdojo/rulebooks/timeline-rulebook.md`（新設） |
| 5   | 新`timeline`とdct/sch-strategyとの接続方針の決定 | ARC | open | 参考情報に留めるか、schedule buildの入力にするかを判断 |
| 6   | `id-and-file-naming-standard.md`への新prefix追記 | ARC | open | 14.1または新設セクション |
| 7   | 検証コマンド実行 | ARC | open | lint:md／typecheck／build／docs:build |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:schedule-design-guide]]: 改名対象の生成物・現行Schedule設計との関係
- [[specdojo:command-reference]]: `exec refresh`の`timeline`言及箇所
- [[specdojo:track-design-guide]]: トラックの標準的な実行順序（新`timeline`が機械可読化する対象のプローズ）
- [[specdojo:id-and-file-naming-standard]]: 新prefixを追加する対象
- [[specdojo:kata-guide]]: rulebook / recipe / sample / template の役割分担
