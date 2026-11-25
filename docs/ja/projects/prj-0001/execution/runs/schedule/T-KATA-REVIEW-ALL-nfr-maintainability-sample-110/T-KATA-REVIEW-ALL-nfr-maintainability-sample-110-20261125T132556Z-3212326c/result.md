---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-maintainability-sample-110-20261125t132556z-3212326c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-maintainability-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-maintainability-sample-110/T-KATA-REVIEW-ALL-nfr-maintainability-sample-110-20261125T132556Z-3212326c/plan.md
  started_at: "2026-11-25T13:26:06.396Z"
  completed_at: "2026-11-25T13:38:40.478Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-maintainability-sample
    - specdojo:nfr-maintainability-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）の段として、grade F001 を受けて `nfr-mnt-004`（軽微変更の反映）に閾値を置き、未決の表から外した。rulebook の全体方針「保守性の中核の要件は未決に回さない」と揃えた。
- grade F002（原因範囲の表記「通信」と「外部」の不一致）は R1 の観点に当たらないため、この段では直していない。用語の一貫性を扱う段へ申し送った。
- executor の `npx prettier --check` は通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。他の検査は変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 目的の過不足 | docs/ja/specdojo/samples/nfr-maintainability-sample.md の「概要（対象・目的）」の未決の表と「保守性要件一覧」の `nfr-mnt-004` | 軽微変更の反映（`nfr-mnt-004` 変更リードタイム）を `_UNDECIDED_` にしていた。rulebook の全体方針「保守性の中核の要件（障害の切り分け・切り戻し・軽微変更の反映）は未決に回さない」と食い違う（grade F001、`vp-qe-kata-conformance`）。 | `nfr-mnt-004` の基準を「全件で、要求日の翌営業日の 10:00 までに反映（全件の最大、月次集計）」にし、未決の表から行を外した。概要に、中核の要件は閾値を決め、それ以外の業務判断が要る閾値だけを未決にするという一文を足した。`nfr-mnt-003`（MTTR）は中核の要件に入らないため未決のまま残した。 | specdojo:nfr-maintainability-rulebook の「全体方針」と「保守性要件一覧」の記述ガイド（集計方法・集計期間の併記） | - |
| 2 | R1 目的の過不足（見送り） | docs/ja/specdojo/samples/nfr-maintainability-sample.md の「保守性要件一覧」の `nfr-mnt-001` | 一次切り分けで絞る原因の範囲が「アプリ・データ・端末・通信」で、rulebook の用語定義「アプリ・データ・端末・外部」と表記が違う（grade F002、`vp-ux-language-consistency`）。 | R1 の観点（`vp-po-purpose-alignment`・`vp-arc-single-responsibility`・`vp-qe-kata-conformance`）に当たらないため、この段では直していない。用語の一貫性を扱う段で、sample を「外部」に揃えるか、rulebook の定義に通信を含めるかを判断する。 | kata-guide の「kata を agent でレビューする」の段と観点の割り当て、plan の「この段の観点に当たるものだけを扱う」 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-maintainability-sample.md`: `nfr-mnt-004` の基準を「全件で、要求日の翌営業日の 10:00 までに反映（全件の最大、月次集計）」と決めた。未決の表から該当行を外した。概要に、中核の要件は閾値を決め、業務判断が要る閾値だけを未決にするという一文を足した。`nfr-mnt-003`（MTTR）は中核の要件に入らないため未決のまま残した。

## 3. 申し送り

- F002 は未対応で、「要判断」の印を付けている。次のどちらかを、用語の一貫性を扱う段で決める必要がある。sample の `nfr-mnt-001` を「外部」に揃える。または rulebook の用語定義に「通信」を含める。
- No: 1／段: R1 目的の過不足／箇所: docs/ja/specdojo/samples/nfr-maintainability-sample.md の「概要（対象・目的）」の未決の表と「保守性要件一覧」の `nfr-mnt-004`／指摘: 軽微変更の反映（`nfr-mnt-004` 変更リードタイム）を `_UNDECIDED_` にしていて、rulebook の全体方針「保守性の中核の要件（障害の切り分け・切り戻し・軽微変更の反映）は未決に回さない」と食い違う（grade F001、`vp-qe-kata-conformance`）／直した案: `nfr-mnt-004` の基準を「全件で、要求日の翌営業日の 10:00 までに反映（全件の最大、月次集計）」にし、未決の表から行を外した。概要に、中核の要件は閾値を決め、それ以外の業務判断が要る閾値だけを未決にするという一文を足した。`nfr-mnt-003`（MTTR）は中核の要件に入らないため未決のまま残した／根拠: specdojo:nfr-maintainability-rulebook の「全体方針」と「保守性要件一覧」の記述ガイド（集計方法・集計期間の併記）／印: なし
- No: 2／段: R1 目的の過不足（見送り）／箇所: docs/ja/specdojo/samples/nfr-maintainability-sample.md の「保守性要件一覧」の `nfr-mnt-001`／指摘: 一次切り分けで絞る原因の範囲が「アプリ・データ・端末・通信」で、rulebook の用語定義「アプリ・データ・端末・外部」と表記が違う（grade F002、`vp-ux-language-consistency`）／直した案: R1 の観点（`vp-po-purpose-alignment`・`vp-arc-single-responsibility`・`vp-qe-kata-conformance`）に当たらないため、この段では直していない。用語の一貫性を扱う段で、sample を「外部」に揃えるか、rulebook の定義に通信を含めるかを判断する／根拠: kata-guide の「kata を agent でレビューする」の段と観点の割り当て、plan の「この段の観点に当たるものだけを扱う」／印: 要判断

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿って、plan に展開された finding のうち R1 の観点（`vp-qe-kata-conformance`）に当たる F001 だけを扱った。根拠は specdojo:nfr-maintainability-rulebook の全体方針と、保守性要件一覧の記述ガイド（集計方法・集計期間の併記）である。rulebook を正として sample を直し、rulebook など sample 以外は変更していない。F002 は `vp-ux-language-consistency` に当たり、この段の観点外のため見送った。
