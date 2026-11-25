---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bds-sample-110-20261125t083609z-6e7934cb
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bds-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bds-sample-110/T-KATA-REVIEW-ALL-bds-sample-110-20261125T083609Z-6e7934cb/plan.md
  started_at: "2026-11-25T08:36:18.839Z"
  completed_at: "2026-11-25T08:49:24.688Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bds-sample
    - specdojo:bds-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として `bds-sample` を確かめた。「メモ / 将来課題」の未決事項 3 行に、引き継ぐ担当 Role code と記録先（PJR 等）が欠けていたため足した。ほかの章に過不足はなく、変更していない。
- grade の F001 は `vp-pm-control-reporting` の観点だが、kata-guide の「kata の観点の組」ではこの観点を kata の段のレビューに使わない。そのため同じ欠けを、rulebook の共通の運用とドキュメントメタ情報標準の引き継ぎ規則（`vp-qe-kata-conformance` の根拠）に基づいて直した。
- executor の検証（prettier、markdownlint）と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed。そのほかの検査は変更種別により `not_applicable`。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bds-sample.md`: 「メモ / 将来課題」の 3 行を直した（7 行追加・7 行削除）。「根拠の業務イベント」には `bes-stock-out-recorded` の作成を BA が `pm-issue-log` の課題で追うことを足した。「補充候補の基準」には PO が初回の報告を見て決め、決定を `pm-decision-log` へ記録することを足した。「上位の索引」には `bds-index` の作成を BA が `pm-issue-log` の課題で追うことを足した。

## 3. 申し送り

- 指摘一覧は executor の handoff の No 1〜4 に記載のとおり。No 1 と No 3 は担当を BA とした点、No 4 は kata の grade で `vp-pm-control-reporting` を bds-sample に当てない設定にするかの判断が要判断。rulebook・設定は変更していない。
- No: 1 / 段: R1 / 箇所: bds-sample「メモ / 将来課題」の「根拠の業務イベント」の行 / 指摘: 未同梱の業務イベント（`bes-stock-out-recorded`）に、引き継ぐ担当と記録先がない / 直した案: 「BA が `pm-issue-log` の課題で作成を追う」を足した / 根拠: bds-rulebook「全体方針」の共通の運用、ドキュメントメタ情報標準「未決事項・課題の PJR への引き継ぎ」（担当 Role code と転送先を明記する）。grade の F001 と同じ箇所 / 印: 要判断（担当を BA とした点）
- No: 2 / 段: R1 / 箇所: bds-sample「メモ / 将来課題」の「補充候補の基準」の行 / 指摘: `_UNDECIDED_` の論点に、決める人と決定の記録先がない / 直した案: 「初回の報告を見て PO が決め」「決定は `pm-decision-log` へ記録する」を足した / 根拠: ドキュメントメタ情報標準「未決事項・課題の PJR への引き継ぎ」。同じ sample の「集計・算出ルール」でも、締めの確定を PO としている / 印: なし
- No: 3 / 段: R1 / 箇所: bds-sample「メモ / 将来課題」の「上位の索引」の行 / 指摘: 未作成の `bds-index` の課題に、担当と記録先がない / 直した案: 「BA が `pm-issue-log` の課題で作成を追う」を足した / 根拠: bds-rulebook「推奨 Frontmatter 項目」（未作成の索引はメモへ記録する）、ドキュメントメタ情報標準の引き継ぎ規則 / 印: 要判断（担当を BA とした点）
- No: 4 / 段: R1 / 箇所: grade の finding F001（`vp-pm-control-reporting`） / 指摘: kata-guide の「kata の観点の組」は、`vp-pm-control-reporting` を kata の段のレビューでは使わない観点としている。この観点では扱わず、内容が同じ欠けを `vp-qe-kata-conformance`（rulebook が求める共通の運用）の根拠で No 1〜3 として直した / 直した案: kata の grade で、この観点を bds-sample に当てない設定にするかを決める（rulebook・設定は変えていない） / 根拠: docs/ja/specdojo/guides/kata-guide.md「kata の観点の組」 / 印: 要判断

## 4. 進め方と実践の型の適用

根拠にした規範は、bds-rulebook の「全体方針」の共通の運用と「推奨 Frontmatter 項目」、ドキュメントメタ情報標準の「未決事項・課題の PJR への引き継ぎ」、kata-guide の「kata の観点の組」である。grade の F001 は未同梱の業務イベントと補充候補の未決事項に、担当 Role code と転送先がないという指摘だった。これを `vp-qe-kata-conformance` の根拠で、メモ 3 行に担当と記録先を足して解消した。ただし F001 の viewpoint 自体は kata の段のレビューでは使わない観点であり、kata の grade 設定の扱いは未解決のため、人の判断に回す。概要・読み手・出力項目など、ほかの章は種別の責務と rulebook の目的に過不足がなく、維持した。grade result サイドカーは直接編集していない。
