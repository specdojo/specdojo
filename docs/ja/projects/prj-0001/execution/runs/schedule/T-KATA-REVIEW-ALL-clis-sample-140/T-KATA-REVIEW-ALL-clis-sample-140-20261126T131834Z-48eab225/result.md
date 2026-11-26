---
specdojo:
  id: prj-0001:xer-t-kata-review-all-clis-sample-140-20261126t131834z-48eab225
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-clis-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-clis-sample-140/T-KATA-REVIEW-ALL-clis-sample-140-20261126T131834Z-48eab225/plan.md
  started_at: "2026-11-26T13:18:44.171Z"
  completed_at: "2026-11-26T13:27:52.666Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:clis-sample
    - specdojo:clis-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`docs/ja/specdojo/samples/clis-sample.md` に書かれた事実を schema、`ifx-cmd-sample`、doc index、記述標準と突き合わせた。誤りは見つからず、sample は変更していない。
- 確かめた主張は frontmatter の `type` と `rulebook`、`part_of` と `based_on` の空配列、wikilink、入力パス、印字失敗時の終了コード扱い、未印字と結果不明の区別、共通登場人物の役割名である。いずれも正本と一致した。
- `kinuya-cli-reference`、各 `kinuya-*-schema`、`ifx-api-kinuya-*.yaml` は、本文で未同梱の架空参照と明記されている。正本がなく、共通サンプル文脈とも食い違わないため、確かめの対象外とした。
- grade の F001 と F002 は、kata のレビューで使わない観点のため扱っていない。F003 は R2 の観点のため扱っていない。F004 は kata のレビューで使わない観点のため扱っていない。F003 と F004 が指す箇所は、読んだ版で 6.2 の表の開始の行に直った内容が入っていた。
- 変更ファイルがないため、runner の検証のうち変更種別で対象となるものは `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`validate:schema` で、いずれも成功した。

## 2. 変更ファイル

- なし

## 3. 申し送り

- R4 確かめの表（No｜主張｜正本｜確かめ方｜結果｜根拠）: 1｜frontmatter `type: ui`・`rulebook: specdojo:clis-rulebook`｜`docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`、`docs/ja/specdojo/rulebooks/clis-rulebook.md`｜enum と「推奨 Frontmatter 項目」を読み取り｜一致｜enum に `ui`、rulebook は `type` を `ui`、`rulebook` を `specdojo:clis-rulebook` と定める。 2｜`part_of`・`based_on` が空配列｜`docs/specdojo/schemas/v1/common-frontmatter.schema.yaml`、rulebook の「推奨 Frontmatter 項目」｜定義を読み取り｜一致｜項目が定義済みで、未接続の理由は本文の「メモ / 将来課題」に記録されている。 3｜wikilink `specdojo:ifx-cmd-sample`｜`.specdojo/doc-index.json`｜grep｜一致｜id が登録されている。 4｜入力パス `receipts/receipt-YYYYMMDD-NNNN.txt`｜`docs/ja/specdojo/samples/ifx-cmd-sample.yaml` の `files.inputs`｜読み取り｜一致｜同じパス。 5｜印字コマンドの終了コードは販売 CLI に伝わらず、印字未完了は終了コード 0 で会計を維持する｜`ifx-cmd-sample.yaml` の `purpose`・`exit_codes`｜読み取り｜一致｜「印字失敗時も会計を取り消さず」「会計全体の完了判定は販売 CLI が行う」。 6｜未印字と結果不明を分け、再印刷は保存済みレシートだけにする｜`ifx-cmd-sample.yaml` の `idempotency`・`malformed_output_action`｜読み取り｜一致｜「再印刷は保存済みレシートだけを使い」「印字結果不明として扱う」。 7｜役割名（店主代表・家族利用者代表・開発担当・同行レビュー担当）｜`docs/ja/specdojo/standards/sample-authoring-standard.md` の共通登場人物｜grep｜一致｜共通登場人物の表に 4 役割がある。 8｜`kinuya-cli-reference`・各 `kinuya-*-schema`・`ifx-api-kinuya-*.yaml` の構文・値・終了コード｜なし（本文で未同梱の架空参照名と明記）｜-｜確かめられない｜正本のない駄菓子屋の仮定で、共通サンプル文脈とは食い違わないため確かめの対象外。確かめるには架空参照の正本の作成が要る。
- F001（`vp-pm-plan-feasibility`）と F002（`vp-pm-control-reporting`）: `docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」で kata の段のレビューでは使わない観点のため、sample を直していない。登録簿で追う論点として扱う。
- F003（`vp-qe-omissions-consistency`）: R2 の観点のため R4 では扱っていない。読んだ版では 6.2 の表で取引セッション保存失敗が「開始」と「追加・取消」の行に分かれ、開始の行に「取引未開始」の確認と `sales start` の再実行が書かれており、指摘は直っている。
- F004（`vp-ops-operability`）: kata の段のレビューで使わない観点のため sample を直していない。内容は F003 と同じ版の直しで満たされている（開始の行に、取引番号の表示をもって回復とする条件がある）。

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実主張を schema、`ifx-cmd-sample`、`.specdojo/doc-index.json`、`sample-authoring-standard.md` と照合した。照合結果が一致した記述は維持し、sample の改訂は行っていない。確かめられなかった主張は、正本のない駄菓子屋の架空参照で、共通サンプル文脈と食い違わない。そのため確かめの対象外とした。確かめるには架空参照の正本を作る必要がある。F001 と F002 は `vp-pm-plan-feasibility` と `vp-pm-control-reporting` で、kata のレビューに使わない観点のため、登録簿で追う論点として扱う。F003 は `vp-qe-omissions-consistency` で、R2 の観点であり、読んだ版では直っていた。F004 は `vp-ops-operability` で、kata のレビューに使わない観点のため扱っていないが、F003 と同じ直しで満たされている。
