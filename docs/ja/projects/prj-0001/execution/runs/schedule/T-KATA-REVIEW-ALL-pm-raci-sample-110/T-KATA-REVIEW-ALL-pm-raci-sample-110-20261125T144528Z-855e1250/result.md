---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-raci-sample-110-20261125t144528z-855e1250
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-raci-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-raci-sample-110/T-KATA-REVIEW-ALL-pm-raci-sample-110-20261125T144528Z-855e1250/plan.md
  started_at: "2026-11-25T14:45:36.910Z"
  completed_at: "2026-11-25T14:52:17.398Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-raci-sample
    - specdojo:pm-raci-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施した。grade の F001 に対応し、`pm-raci-sample` の「成果物別 RACI」表に「対象 ID」列を追加した。これで統合行も、成果物 ID から一意に辿れるようになった。
- 全体を確認した結果、rulebook「本文要件」の必須内容はそろっていた。削る記述も見当たらなかったため、F001 以外の差分は入れていない。
- 検査は、executor が実行した prettier の確認と、runner が実行した `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` で通過した。変更種別により対象外となった検査は `not_applicable` として記録されている。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | 成果物別 RACI | 統合行が成果物名だけで書かれている。rulebook「ファイル命名・ID規則」の「行は成果物 ID で特定し、統合行も各成果物から一意に照合できる」を満たさない（grade F001）。 | 「対象 ID」列を追加し、カタログの local ID か、ほかの sample が使う架空名を各行に書いた。表の前に ID の書き方を 1 文足した。ID の当て方は推定である。 | `vp-qe-kata-conformance` | 要判断 |
| R1-2 | R1 | 全体 | rulebook「本文要件」の必須内容（範囲と省略の理由、採用 Role、兼務・Agent の扱い、二つの表、担当照合と不一致時の更新先、見直し条件）はそろっている。要らない記述も見当たらない。 | - | `vp-po-purpose-alignment`、`vp-arc-single-responsibility` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-raci-sample.md`: 「成果物別 RACI」表に「対象 ID」列を追加し、各行にカタログの local ID（`bps-*` などの接頭辞）か、ほかの sample が使う架空名（`kinuya-app`・`kinuya-st-report`・`kinuya-acceptance-record`）を併記した。表の前に ID の書き方を説明する 1 文を足した。統合行の各成果物から責任行を一意に辿れる。

## 3. 申し送り

- R1-1: 段=R1 / 箇所=成果物別 RACI / 指摘=統合行が成果物名だけで、rulebook「ファイル命名・ID規則」の「行は成果物 ID で特定し、統合行も各成果物から一意に照合できる」を満たさない（grade F001） / 直した案=「対象 ID」列を追加し、カタログの local ID（同じ種類が複数あるものは `bps-*` などの接頭辞）か、ほかの sample が使う架空名（`kinuya-app`・`kinuya-st-report`・`kinuya-acceptance-record`）を各行に書いた。表の前に ID の書き方を 1 文足した / 根拠=`vp-qe-kata-conformance`。利用者要求・操作設計を `bps-*`・`uis-*`、実装・データ設計を `sysd-index`・`bdd-*`・`kinuya-app` のコード、リリース候補を `kinuya-app` の対象版タグに当てた対応は推定。選ばなかった案は、sample への wikilink にする案（未同梱の成果物は表せない）と、ID ごとに行を分ける案（rulebook の「同じ責任の成果物はまとめる」に反する） / 印=要判断
- R1-2: 段=R1 / 箇所=全体 / 指摘=rulebook「本文要件」の必須内容（範囲と省略の理由、採用 Role、兼務・Agent の扱い、二つの表、担当照合と不一致時の更新先、見直し条件）はそろっており、要らない記述も見当たらない / 直した案=- / 根拠=`vp-po-purpose-alignment`、`vp-arc-single-responsibility` / 印=-
- 適用外の検証: `npm run validate:history-links`（変更したのは sample の 1 ファイルだけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

根拠は、grade の F001、`vp-qe-kata-conformance`、rulebook「ファイル命名・ID規則」の「行は成果物 ID で特定し、統合行も各成果物から一意に照合できる」。sample に「対象 ID」列を足す形で解消した。rulebook など sample 以外は変更していない。選ばなかった案は 2 つある。1 つは sample への wikilink にする案で、未同梱の成果物を表せない。もう 1 つは ID ごとに行を分ける案で、rulebook の「同じ責任の成果物はまとめる」に反する。利用者要求・操作設計を `bps-*`・`uis-*`、実装・データ設計を `sysd-index`・`bdd-*`・`kinuya-app` のコード、リリース候補を `kinuya-app` の対象版タグに当てた対応は executor の推定で、人の判断が要る。
