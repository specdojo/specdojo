---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-test-sample-150-20261126t080558z-4152bd44
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-test-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-test-sample-150/T-KATA-REVIEW-ALL-imp-test-sample-150-20261126T080558Z-4152bd44/plan.md
  started_at: "2026-11-26T08:06:07.886Z"
  completed_at: "2026-11-26T08:12:59.802Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-test-sample
    - specdojo:imp-test-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`imp-test-sample` を並行する影響調査の sample と照合し、sample 側で直せる 3 点（`part_of` の補完、並行文書への wikilink 化と移行テストの対象外への追加、PJR の初出表記）を修正した。
- 相手側を直すべき点 2 件は変更せず、直す案を findings に残した。
- grade の F002〜F005 は前の段までに解消済みで、F001（`vp-pm-plan-feasibility`）は kata のレビューで使わない観点のため扱っていない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | frontmatter / `part_of` | `part_of` が `[]` で、並行する imp-business・imp-data・imp-interface・imp-operations の各 sample（`part_of: - prj-0001`）と食い違う。 | `part_of` を `- prj-0001` にした。 | `vp-qe-kata-conformance`（kata 相互） | - |
| R5-2 | R5 | 目的と適用範囲 | 対象外の理由で参照する並行文書を `imp-data`・`imp-business` のインラインコードで書いており、ファイルが存在するのにリンクしていない。並行 sample は本 sample を wikilink で参照している。 | `[[specdojo:imp-data-sample\|影響調査（データ）サンプル]]` と `[[specdojo:imp-business-sample\|影響調査（業務）サンプル]]` の wikilink にした。 | Sample 記述標準「リンクはファイルがある場合に記載」、imp-test-rulebook の「互いの結論を参照する」 | - |
| R5-3 | R5 | 目的と適用範囲 | 影響調査（データ）の受入確認と影響調査（運用）の対応方針は移行テストを前提にしているが、本 sample は移行テストを対象範囲にも対象外にも挙げていない。 | 対象外のテスト範囲に「移行テスト（照合方法と合格条件は影響調査（データ）で決めるため）」を足した。移行テストを対象範囲に入れ、影響詳細一覧に 1 行足す案もあるが、移行の合格条件をデータ側が持っているため対象外とする案を選んだ。 | `vp-dev-change-impact`、imp-test-rulebook の「対象外のテスト範囲とその理由」 | 要判断 |
| R5-4 | R5 | 対応方針 | 決定記録 `PJR-T5D1` の初出に PJR の正式名がなく、影響調査（業務）の「プロジェクト登録簿（PJR）の決定記録 `PJR-B4D1`」と書き方が食い違う。 | 初出を「プロジェクト登録簿（PJR）の決定記録 `PJR-T5D1`」にした。 | `vp-qe-kata-conformance`（kata 相互）、文章のチェック項目 W8 | - |
| R5-5 | R5 | 相手側: imp-data-sample の目的と適用範囲 | imp-data-sample は変更要求を `PJR-C4A1` と書き、imp-test・imp-business・imp-interface・imp-operations の `cr-2026-004`（`based_on` を含む）と食い違う。 | 変更していない。相手側の案は、imp-data-sample の本文の ID と `based_on` を `cr-2026-004` にそろえること。用語集では変更要求が登録簿の分類（change-request）であり、全件を PJR 形式にそろえる案もあるため迷った。 | `vp-qe-kata-conformance`（kata 相互） | 要判断 |
| R5-6 | R5 | 相手側: imp-data-sample の受入確認、本 sample の影響詳細一覧 | imp-data-sample は結合テストで値引き理由とキャンペーン適用履歴を確かめる前提だが、本 sample の結合テスト 8 ケースの集計項目は売上合計と値引き合計だけで、値引き理由と適用履歴を確かめない。 | 変更していない。案は、本 sample の結合テストの確認項目に値引き理由と適用履歴を加えるか、imp-data-sample の当該行の確かめ方をデータ検証へ移すこと。どちらが正かを決める根拠がないため直していない。 | `vp-dev-change-impact` | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-test-sample.md`: frontmatter の `part_of` を `prj-0001` にして並行 sample とそろえた。目的と適用範囲の並行文書参照を wikilink にした。対象外のテスト範囲に移行テストを追加した。決定記録 `PJR-T5D1` の初出にプロジェクト登録簿（PJR）の正式名を足した。

## 3. 申し送り

- `validate:history-links` と `validate:schema:file` は、履歴ファイルも YAML も変更していないため `not_applicable` である。
- R5-3 は、移行テストを対象範囲に入れる案もあったが、移行の合格条件をデータ側が持っているため対象外とした。人の判断を求める。
- R5-1: R5 / frontmatter / `part_of` が `[]` で、並行する imp-business・imp-data・imp-interface・imp-operations の各 sample（`part_of: - prj-0001`）と食い違う / `part_of` を `- prj-0001` にした / `vp-qe-kata-conformance`（kata 相互） / -
- R5-2: R5 / 目的と適用範囲 / 対象外の理由で参照する並行文書を `imp-data`・`imp-business` のインラインコードで書いており、ファイルが存在するのにリンクしていない（並行 sample は本 sample を wikilink で参照している） / `[[specdojo:imp-data-sample|影響調査（データ）サンプル]]`・`[[specdojo:imp-business-sample|影響調査（業務）サンプル]]` の wikilink にした / Sample 記述標準「リンクはファイルがある場合に記載」、imp-test-rulebook の「互いの結論を参照する」 / -
- R5-3: R5 / 目的と適用範囲 / 影響調査（データ）の受入確認と影響調査（運用）の対応方針は移行テストを前提にしているが、本 sample は移行テストを対象範囲にも対象外にも挙げていない / 対象外のテスト範囲に「移行テスト（照合方法と合格条件は影響調査（データ）で決めるため）」を足した / `vp-dev-change-impact`、imp-test-rulebook の「対象外のテスト範囲とその理由」。迷った理由: 移行テストを本書の対象範囲に入れ、影響詳細一覧に 1 行足す案もあるが、移行の合格条件をデータ側が持っているため対象外とする案を選んだ / 要判断
- R5-4: R5 / 対応方針 / 決定記録 `PJR-T5D1` の初出で PJR の正式名がなく、影響調査（業務）の「プロジェクト登録簿（PJR）の決定記録 `PJR-B4D1`」と書き方が食い違う / 初出を「プロジェクト登録簿（PJR）の決定記録 `PJR-T5D1`」にした / `vp-qe-kata-conformance`（kata 相互）、文章のチェック項目 W8 / -
- R5-5: R5 / 相手側: imp-data-sample の目的と適用範囲 / imp-data-sample は変更要求を `PJR-C4A1` と書き、imp-test・imp-business・imp-interface・imp-operations の `cr-2026-004`（`based_on` を含む）と食い違う / - / `vp-qe-kata-conformance`（kata 相互）。相手側の案: imp-data-sample の本文の ID と `based_on` を `cr-2026-004` にそろえる。迷った理由: 用語集では変更要求が登録簿の分類（change-request）で、全件を PJR 形式にそろえる案もあるため / 要判断
- R5-6: R5 / 相手側: imp-data-sample の受入確認、本 sample の影響詳細一覧 / imp-data-sample は結合テストで値引き理由とキャンペーン適用履歴を確かめる前提だが、本 sample の結合テスト 8 ケースの集計項目は売上合計と値引き合計だけで、値引き理由と適用履歴を確かめない / - / `vp-dev-change-impact`。案: 本 sample の結合テストの確認項目に値引き理由と適用履歴を加えるか、imp-data-sample の当該行の確かめ方をデータ検証へ移す。どちらが正かを決める根拠がないため直していない / 要判断
- 申し送り: grade の F001（`vp-pm-plan-feasibility`）は kata のレビューで使わない観点のため扱っていない。F002〜F005 は前の段までに解消していた。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/imp-test-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

並行する imp-business・imp-data・imp-interface・imp-operations の各 sample、imp-test-rulebook、Sample 記述標準の共通サンプル文脈と照合した。sample 側の食い違いだけを最小差分で直し、相手側の食い違いは変更せず案として残した。確認として `prettier --check` が通り、runner の lint・schema・docs テストも通っている。
