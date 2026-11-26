---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-test-sample-120-20261125t212207z-5f29ffc8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-test-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-test-sample-120/T-KATA-REVIEW-ALL-imp-test-sample-120-20261125T212207Z-5f29ffc8/plan.md
  started_at: "2026-11-25T21:22:16.622Z"
  completed_at: "2026-11-25T21:29:58.283Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-test-sample
    - specdojo:imp-test-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として imp-test-sample を確認した。章の順と必須の列は rulebook の本文要件に合っていた。変更要求の概要の箇条書きの並べ替えと、対応方針の決定記録の箇条書きの分割を sample に入れた。
- template は `undecided` のため、章の配置の照合はできなかった。rulebook など sample 以外は変更していない。
- executor が実行した prettier と markdownlint、runner が実行した `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` はいずれも passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 2. 変更要求の概要 / 箇条書きの順 | 箇条書きの順（背景→要求の要点→狙い）が rulebook の本文要件の順「背景・狙い・要求の要点」と違い、目的の前に要求が来る。 | 「狙い」を「要求の要点」の前へ移した。 | `vp-arc-document-structure`（imp-test-rulebook の本文要件と、記述ガイドの「変更要求の概要」） | - |
| R2-2 | R2 | 5. 対応方針 / 決定記録の箇条書き | 決定記録の箇条書き 1 項目に、回帰テストの代替と単体テストの見送りの決定と再評価条件の 3 文が入っており、項目ごとの再評価条件が読み取りにくい。 | 回帰テストの代替と単体テストの見送りの 2 項目に分け、それぞれに決定記録 `PJR-T5D1` と再評価条件を書いた。 | `vp-arc-document-structure`、`vp-qe-omissions-consistency`（rulebook の記述ガイド「対応方針」: 見送り・代替は再評価条件と期限を必ず記載する） | - |
| R2-3 | R2 | 6. 未解決事項 / 表 | rulebook の記述ガイド「未解決事項」は、見送り・代替を決めた事項を `decision` として登録簿へ転記し、転記先 ID を書くよう求める。sample は `PJR-T5D1` を対応方針にだけ書いており、未解決事項の表に行がない。決定済みの事項を未解決事項に載せると章の目的（判断待ち・調査不足）と食い違うため、直していない。 | - | `vp-qe-omissions-consistency`。選ばなかった案: 未解決事項の表に `PJR-T5D1`（`decision`）の行を足す。rulebook 側を直すなら、`decision` の転記先 ID は対応方針に書くと明記する案がある。 | 要判断 |
| R2-4 | R2 | 全体 / imp-test-rulebook の frontmatter | rulebook の frontmatter の `template` が `undecided` で、template との章の配置の照合ができない。 | - | `vp-qe-omissions-consistency`。相手側は imp-test-rulebook。template を作るなら、本文要件の 6 章と必須の列をそのまま見出しと表の枠にする案がある。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-test-sample.md`: 「変更要求の概要」の箇条書きを、rulebook の本文要件の順（背景・狙い・要求の要点）に並べ替えた。「対応方針」の決定記録の項目は、回帰テストの代替と単体テストの見送りの 2 項目に分け、それぞれに決定記録 `PJR-T5D1` と再評価条件を書いた。

## 3. 申し送り

- F001（`vp-pm-plan-feasibility`）は、kata のレビューの段に使わない観点のため、R2 では扱っていない。F002 と F003 は R1 の版で解消済みだった。F004（受入判定日の営業日数）と F005（論点名の呼称）は文章の直しのため R3 に回す。
- R2-1: R2 / 2. 変更要求の概要 / 箇条書きの順（背景→要求の要点→狙い）が rulebook の本文要件の順「背景・狙い・要求の要点」と違い、目的の前に要求が来る / 「狙い」を「要求の要点」の前へ移した / `vp-arc-document-structure`（imp-test-rulebook の本文要件と、記述ガイドの「変更要求の概要」） / -
- R2-2: R2 / 5. 対応方針 / 決定記録の箇条書き 1 項目に、回帰テストの代替と単体テストの見送りの決定と再評価条件の 3 文が入っており、項目ごとの再評価条件が読み取りにくい / 回帰テストの代替と単体テストの見送りの 2 項目に分け、それぞれに決定記録 `PJR-T5D1` と再評価条件を書いた / `vp-arc-document-structure`、`vp-qe-omissions-consistency`（rulebook の記述ガイド「対応方針」: 見送り・代替は再評価条件と期限を必ず記載する） / -
- R2-3: R2 / 6. 未解決事項 / rulebook の記述ガイド「未解決事項」は「見送り・代替を決めた」事項を `decision` として登録簿へ転記し、転記先 ID を書くよう求める。sample は `PJR-T5D1` を対応方針にだけ書いており、未解決事項の表に行がない。決定済みのため未解決事項に載せないのは妥当とも読めるため、直していない / - / `vp-qe-omissions-consistency`。迷った理由: rulebook の転記の条件の表は未解決事項の章にあるが、決定済みの事項を未解決事項の表へ載せると章の目的（判断待ち・調査不足）と食い違う。選ばなかった案: 未解決事項の表に `PJR-T5D1`（`decision`）の行を足す。rulebook 側を直すなら、`decision` の転記先 ID は対応方針に書くと明記する案がある / 要判断
- R2-4: R2 / 全体 / imp-test-rulebook の frontmatter の `template` が `undecided` で、template との章の配置の照合ができない / - / `vp-qe-omissions-consistency`。相手側: imp-test-rulebook。template を作るなら、本文要件の 6 章と必須の列をそのまま見出しと表の枠にする案がある / -
- 申し送り: F001（`vp-pm-plan-feasibility`）は kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点のため、R2 では扱っていない。F002（反映先の記載）と F003（成功条件のつけ残高）は R1 の版で解消済みだった。F004（受入判定日の営業日数）と F005（論点名の呼称）は文章の直しのため R3 に回す。

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R2 に従った。R1 が直した版を読み、章の順・粒度・表と本文の配置を rulebook の本文要件と照合した。照合で差が見つかった 2 件は sample で直した。決定記録の扱いが迷う 1 件は直さず「要判断」とした。template は `undecided` のため照合できず、案を findings に書いた。
