---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opd-index-sample-120-20261124t140931z-bee68526
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opd-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opd-index-sample-120/T-KATA-REVIEW-ALL-opd-index-sample-120-20261124T140931Z-bee68526/plan.md
  started_at: "2026-11-24T14:09:40.150Z"
  completed_at: "2026-11-24T14:21:15.641Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-index-sample
    - specdojo:opd-index-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `opd-index-sample` を見直した。12章の順序・粒度・表と本文の配置は rulebook の本文構成に合致しており維持した。
- F002（章 4 と章 6 で、紙の販売控えへの切替の判断者とタイミングが食い違う）を解消した。切替判断は章 6 に集約し、章 4 は `PO` への直接連絡と章 6 への参照に整理した。
- F001（`vp-qe-verifiability`）は R4、F003（`vp-ux-language-consistency`）は R3 の観点のため、本段では扱わず維持した。
- R1 の修正は維持し、R1 の指摘は繰り返していない。
- Prettier 整形と `git diff --check` は通過した。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も通過した。
- | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 4. 体制・責任分界、6. 障害対応方針 | F002。章 4 の「15 分無応答なら店番担当が紙の控えへ切替」と、章 6 の「30 分で `PO` が切替判断」が矛盾していた。 | 章 4 は `PO` への直接連絡と章 6 への参照に整理し、切替判断を章 6 に集約した。章 6 は、P1 に気付いてから 30 分で再開できなければ `PO` が判断すると明記した。 | `vp-qe-omissions-consistency`、`vp-arc-document-structure`。rulebook 5・6 章の責務分担と、条件・判断者の明示に従った。sample 章 4 の RACI で `PO` が停止・再開判断の責任を持つことにも合わせた。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-index-sample.md`: 2 行を修正した。章 4 では、`OPS` が 15 分応答しない場合に店番担当が `PO` へ直接連絡する条件と、章 6 への参照だけを残した。章 6 では、P1 に気付いてから 30 分で再開できない場合に `PO` が紙の販売控えへの切替を判断すると明記した。これにより切替の判断者とタイミングを章 6 に一本化した。

## 3. 申し送り

- R3 への申し送り: F003（`vp-ux-language-consistency`）が未対応である。章 5・10 の「夜間バックアップ」と章 8 の「閉店後の日次締めの後」で、呼称と時間帯が揃っていない。R3 で統一する必要がある。
- R4 への申し送り: F001（`vp-qe-verifiability`）が未対応である。欠品 KPI の導入前基準値の取得方法・期間と、稼働目標が `_UNDECIDED_` の間の暫定の判定条件を、R4 で確認する必要がある。
- R2-1: R2 / 箇所: 4. 体制・責任分界、6. 障害対応方針 / 指摘: F002。4章の15分無応答時の店番担当による紙への切替と、6章の30分経過時のPOによる切替判断が矛盾していた。 / 直した案: 4章はPOへの直接連絡と6章への参照に整理し、切替判断を6章に集約した。6章はP1に気付いてから30分で再開できなければPOが判断すると明記した。 / 根拠: `vp-qe-omissions-consistency`、`vp-arc-document-structure`。rulebook 5・6章の責務分担と条件・判断者の明示、sample 4章のRACIでPOが停止・再開判断の責任を持つことに従った。 / 印: -
- reporter向け判断根拠（進め方と実践の型の適用へ記載）: `kata-guide.md` 6.1・6.3・6.5、`opd-index-rulebook.md` 全文、`sample-authoring-standard.md`、`pm-review-viewpoints.yaml` の対象観点、grade結果 `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opd-index-sample.yaml`、R1の `T-KATA-REVIEW-ALL-opd-index-sample-110` resultを確認した。12章の順序・粒度・表と本文の配置はrulebookに合致しており維持した。recipe・templateはrulebookが `not-needed` と宣言している。障害対応分冊2.2と障害対応手順4.2も、POによる切替判断と30分の条件の根拠として照合した。R1の修正は維持し、指摘を繰り返していない。
- 変更ファイル: `docs/ja/specdojo/samples/opd-index-sample.md` の2行のみ。連絡と切替判断の記述を整理した。resultはreporterが記入するため編集していない。rulebook・gradeサイドカー・設定・Git状態管理への変更はない。
- 後続段への申し送り: `source=grade` F001（`vp-qe-verifiability`）はR4へ引き継ぐ。欠品KPIの導入前基準値の取得方法・期間と稼働目標未決時の判定条件を確認する。F003（`vp-ux-language-consistency`）はR3へ引き継ぎ、5・10章の夜間バックアップと8章の閉店後の日次締めの後の呼称・時間帯を統一する。本段では対象外のため維持した。
- 検証: Prettier整形と `git diff --check` は通過。修正後の4・6章とRACIを再照合し、15分は応答なしの連絡条件、気付いてから30分はPOの切替判断条件として分離されたことを確認した。指定済み親検証はrunnerに委ね、重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更はMarkdown sampleのみで、YAMLファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（変更は `docs/ja/specdojo/samples/` 内のみで、`docs/ja/projects/` に及ばない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票・既存plan・resultを変更していない。）
- 適用外の検証: `node tools/check-evidence-secrets.mjs --staged`（executorは検査対象となる実行記録を変更していない。）

## 4. 進め方と実践の型の適用

根拠とした資料は次のとおり。`kata-guide.md` の 6.1・6.3・6.5、`opd-index-rulebook.md` 全文、`sample-authoring-standard.md`、`pm-review-viewpoints.yaml` の対象観点、grade 結果 `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opd-index-sample.yaml`、R1 の `T-KATA-REVIEW-ALL-opd-index-sample-110` の result である。障害対応分冊 2.2 と障害対応手順 4.2 も、`PO` による切替判断と 30 分の条件の根拠として照合した。 改訂した記述は章 4 と章 6 の切替判断の部分である。rulebook の責務分担と、条件・判断者の明示を正とした。維持した記述は、12 章の順序・粒度・表と本文の配置、R1 の修正である。recipe と template は、rulebook が `not-needed` と宣言している。 修正後に章 4・章 6・RACI を再照合した。15 分は応答がないときの連絡条件、気付いてから 30 分は `PO` の切替判断条件として分離できたことを確認した。F001 と F003 は R2 の観点に当たらないため、後続段へ回した。grade result のサイドカーは直接編集していない。
