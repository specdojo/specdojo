---
specdojo:
  id: prj-0001:xer-t-kata-wave-2-bds-progress-report-050-20261115t044747z-72bbd8b6
  type: exec-result
  task_id: T-KATA-WAVE-2-bds-progress-report-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-2-bds-progress-report-050/T-KATA-WAVE-2-bds-progress-report-050-20261115T044747Z-72bbd8b6/plan.md
  started_at: "2026-11-15T04:47:54.144Z"
  completed_at: "2026-11-15T05:29:04.771Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - bds-progress-report
    - specdojo:bds-sample
---

# Edit Result

## 1. 実施内容

- 改訂後の `bds-rulebook` および同梱サンプル（`bes-sample`・`cdsd-sample`）の構成に合わせて `docs/ja/specdojo/samples/bds-sample.md` を見直しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bds-sample.md`: `based_on` の接続、作成・確認・承認の `Role` code、本文構成を正本に合わせ、端数・割合の扱いおよび未接続の業務イベントの影響に関する記述を追記しました。

## 3. 申し送り

- finding F001〜F024 は -005 で書き直す前の bds-sample（最小サンプル版）が対象で、現行版では解消済み。今回は rulebook・関連 sample との差分だけを直した（result の `進め方と実践の型の適用` に記録してください）
- recipe と template は rulebook frontmatter の not-needed のまま。理由: 帳票仕様は Markdown 1 ファイルの記述規約で、rulebook の記述ガイドと sample で書けるため、作成手順書や雛形を別に用意する必要がない
- 根拠の判断: 販売記録は specdojo:cdsd-sample の販売記録と specdojo:bes-sample（現金会計の確定）を `based_on` に接続した。つけ販売の確定と bes-stock-out-recorded は未同梱のまま、接続するまで受入対象外として「メモ / 将来課題」に担当（BA・QE）と解消条件を書いた
- 補充候補を欠品 1 回以上にするか 2 回以上に絞るかは未決（`_UNDECIDED_`）のまま残した。店主代表（PO）が初回の報告を見て決める
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/bds-sample.md だけで、履歴ファイル（plan・result・pjr 個票）を変更していない）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/projects/ の外（docs/ja/specdojo/samples/）だけ）

## 4. 進め方と実践の型の適用

改訂版 `bds-rulebook` および関連サンプルとの整合性を確保するため、`docs/ja/specdojo/samples/bds-sample.md` の構成・記述を更新しました。展開されていた finding F001〜F024 は旧版（最小サンプル版）に対する指摘であり、現行版では概ね解消されていたため、主に rulebook 準拠の構成整備と `based_on` 接続などの具体化に重点を置いて修正を行いました。
