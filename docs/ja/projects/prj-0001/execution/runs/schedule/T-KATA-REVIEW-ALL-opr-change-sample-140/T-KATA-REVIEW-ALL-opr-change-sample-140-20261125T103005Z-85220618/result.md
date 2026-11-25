---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-change-sample-140-20261125t103005z-85220618
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-change-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-change-sample-140/T-KATA-REVIEW-ALL-opr-change-sample-140-20261125T103005Z-85220618/plan.md
  started_at: "2026-11-25T10:30:18.168Z"
  completed_at: "2026-11-25T10:46:36.890Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-change-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として `opr-change-sample` の事実を schema・rulebook・template・参照先 sample と突き合わせ、誤り 2 件を直した。1 件目は権限分冊へのリンク表示名（3 箇所）、2 件目は表示の修正の証跡に承認が抜けていた点である。
- コマンド・オプション・既定値の主張は本書になく、コマンドリファレンスと `--help` の確かめは対象なしだった。
- grade の F001・F004 は kata の段のレビューで使わない観点のため扱わなかった。F002・F003 は前段までに解消済みと確認した。
- ランナー検証は `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed、executor の prettier 検査も passed。ほかは変更種別により `not_applicable`。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-change-sample.md`: `opr-access-control-sample` へのリンクの表示名（3 箇所）を、参照先の H1 に合わせて「アカウント付与・剥奪」から「運用手順（権限・アカウント）」へ変更した。運用変更作業の表では、表示の修正の証跡を「変更記録（差分、実施）」から「変更記録（差分、承認、実施）」に直し、承認者が `OPS` である点と適用手順の承認の段に揃えた。

## 3. 申し送り

- 確かめの表（実施内容に Markdown の表として 1 回だけ書く）と指摘 2 件は、evidence.handoff の項目 1〜5 にある。F001・F004 を扱わなかった理由は項目 4 に、F002・F003 が解消済みである根拠は項目 5 にある。
- 確かめられなかった主張はなかった。実行コマンドやオプションの主張は本書にないため、`--help` の突き合わせは行っていない。
- 1: R4 / 手順適用範囲・前提、アカウント付与・剥奪手順、関連ドキュメント導線 / `opr-access-control-sample` へのリンクの表示名「アカウント付与・剥奪」が参照先の H1「運用手順（権限・アカウント）」と一致しない / 3 箇所の表示名を「運用手順（権限・アカウント）」に変更 / `vp-arc-technical-constraints`（wikilink は `[[id|title]]`、参照先の H1 と `opr-sample` の表記） / -
- 2: R4 / 運用変更作業（変更種別と承認・実施条件） / 表示の修正は承認者が `OPS` で、適用の手順の承認の段も全種別に掛かるのに、証跡が「変更記録（差分、実施）」で承認が抜けている / 証跡を「変更記録（差分、承認、実施）」に変更 / `vp-qe-verifiability`（本書の適用の手順の承認の段、証跡の章の承認の記録、`opr-sample` の運用変更作業の表） / -
- 3: R4 / 全体 / 主張の確認表（No / 主張 / 正本 / 確かめ方 / 結果 / 根拠）: (1) frontmatter `type: operations` / `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`、`opr-rulebook` の推奨 Frontmatter 項目 / 読み取り / 一致 / schema 17 行目に `operations`、rulebook に `type` `operations`。(2) `rulebook: specdojo:opr-rulebook`・rulebook 側の sample 宣言 / `docs/ja/specdojo/rulebooks/opr-rulebook.md` / 読み取り / 一致 / frontmatter の sample に `specdojo:opr-change-sample`。(3) `based_on`・`supersedes` のキー / `docs/specdojo/schemas/v1/common-frontmatter.schema.yaml` / 読み取り / 一致 / 72〜77 行目 `idRefArray`。(4) 12 章の見出しと順 / `docs/ja/specdojo/templates/opr-template.md` / 見出しの比較 / 一致。(5) 作業のない章の書き方（`opr-index` 参照・本書の範囲外） / rulebook の本文要件 / 読み取り / 一致。(6) 変更種別の表と証跡の表の列 / template の運用変更作業・証跡 / 読み取り / 一致。(7) 参照先 `opr-sample`・`opd-index-sample`・`opr-access-control-sample` の存在 / 各 sample の frontmatter の `id` / grep / 一致（表示名は指摘 1 で修正）。(8) ロールの略称 `OPS`・`DEV`・`PO` / `docs/ja/specdojo/samples/pm-roles-sample.yaml` / grep / 一致。(9) 閉店 18:00・開店前の確認 9:45 / `opr-sample` の手順適用範囲・前提 / 読み取り / 一致。(10) `OPS` が 15 分以内に応答しなければ `PO` / `opr-sample` の障害対応手順 / 読み取り / 一致。(11) 承認者（版の更新・価格の一括変更・P1 の緊急の変更は `PO`、表示の修正は `OPS`）とロールバック条件 / `opd-index-sample` の変更管理 / 読み取り / 一致（営業時間中は P1 の復旧に必要な場合だけ `PO` の承認）。(12) P1 の復旧条件・月次点検は `opr-index` にある / `opr-sample` の障害対応手順・点検手順 / 読み取り / 一致。(13) 手動バックアップと手順の確認の記録の保管期間は `opr-index` 参照 / `opr-sample` の証跡 / 読み取り / 一致（実行ログの保管期間・模擬結果の月次点検の記録）。(14) 識別子 `ticket_id`・`run_id` / rulebook の記述ガイド（証跡） / 読み取り / 一致。(15) 表示の修正の証跡 / 本書の適用の手順・`opr-sample` / 読み取り / 不一致（指摘 2 で修正）。コマンド・オプション・既定値の主張は本書になく、コマンドリファレンスと `--help` の確かめは対象なし
- 4: R4 / 概要（未決事項の表） / grade の F001・F004（`vp-po-decision-readiness`、`vp-ops-release-readiness`）は `kata-guide` の「kata の観点の組」で kata の段のレビューに使わない観点のため扱わない / - / `kata-guide` の「kata の観点の組」（承認と ready 化は登録簿で追う） / -
- 5: R4 / `opr-sample` の証跡・関連ドキュメント導線 / grade の F002（保管期間の未決）と F003（分冊の記述）は前段までに解消済み。`opr-sample` の概要に「監査ログ以外の証跡の保管期間」の行があり、関連ドキュメント導線には `opr-index-sample` とすべての分冊が載っている / - / `opr-sample` の概要の未決事項の表と関連ドキュメント導線の表を読み取り / -
- 申し送り: plan の編集対象には `opr-sample.md` と書かれているが、この段で見直す対象 kata は `opr-change-sample` のため、plan の `targets` にある `docs/ja/specdojo/samples/opr-change-sample.md` だけを編集した。`opr-sample.md` は変更していない。

## 4. 進め方と実践の型の適用

approach は sample-maintenance。参照の向きを成果物から sample に切り替え、`opr-change-sample` を見直す対象とした。主張ごとに `deliverable-frontmatter.schema.yaml`、`common-frontmatter.schema.yaml`、`opr-rulebook`、`opr-template`、`opr-sample`、`opd-index-sample`、`pm-roles-sample.yaml` と突き合わせた。誤りは 2 件で、どちらも sample 側を直した。rulebook と記述の矛盾はなく、rulebook を正として優先した箇所もない。F001 と F004 は `kata-guide` の「kata の観点の組」により kata の段のレビューに使わない観点であるため、扱わなかった。F002 と F003 は前段までに解消済みで、`opr-sample` の概要に保管期間の行があり、関連ドキュメント導線に `opr-index-sample` と全分冊が載っている。plan の編集対象には `opr-sample.md` と書かれていたが、この段の見直し対象は `opr-change-sample` なので、`opr-sample.md` は変更していない。frontmatter の `status` は `draft` のまま変えていない。
