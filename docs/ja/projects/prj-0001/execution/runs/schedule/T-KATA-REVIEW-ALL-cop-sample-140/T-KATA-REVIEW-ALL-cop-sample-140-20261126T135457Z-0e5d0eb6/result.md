---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cop-sample-140-20261126t135457z-0e5d0eb6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cop-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cop-sample-140/T-KATA-REVIEW-ALL-cop-sample-140-20261126T135457Z-0e5d0eb6/plan.md
  started_at: "2026-11-26T13:55:07.403Z"
  completed_at: "2026-11-26T14:04:47.694Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cop-sample
    - specdojo:cop-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、cop-sample の事実を schema、`cop-rulebook`、関連 sample と突き合わせた。突き合わせた主張は、frontmatter の `type` と rulebook 宣言、10 章の名前と順序、Role code の `PO`・`DEV`・`QE`、register の decision・issue、`run_id` と `migration/&lt;run_id&gt;/`、`mip-index` の GO4、つけ残高 25 件、臨時休業の前提。結果はすべて一致した。
- 誤りがなかったため sample は編集していない。変更ファイルはなく、`evidence.changes` は空である。
- F001 は前の段の版で解消済みで、観点が R3 の担当（`vp-ux-language-consistency`）のため R4 では扱っていない。
- `npm run lint:md` は executor が `not_run` と記録した。ただし Markdown の変更がなく、runner が非適用と判定している。runner 実行の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`validate:schema` は通過した。

## 2. 変更ファイル

- なし

## 3. 申し送り

- F001 の解消は次の grade で確かめる。
- R5 では、重大度「高」の基準が `cop-index-sample.md` とずれている点（cop-sample は 10 分以上、`cop-index-sample.md` は 15 分超）の整合を決める。あわせて判断者の呼び方（「店主代表」と「切替責任者」）も確かめる。
- R4 確かめの表（主張 / 正本 / 結果）: 1) frontmatter の `type: operations` / `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` の enum（17 行目） / 一致。2) `rulebook: specdojo:cop-rulebook` と `id: specdojo:cop-sample` / `docs/ja/specdojo/rulebooks/cop-rulebook.md` の frontmatter（`sample: specdojo:cop-sample`）と Sample 記述標準の命名 / 一致。3) 10 章の名前と順序、各表の列 / `cop-rulebook.md` の本文要件 / 一致。4) Role code の `PO`・`DEV`・`QE` / `pm-roles.schema.yaml` の enum（96 行目）と `pm-roles-sample.yaml` / 一致。5) decision 個票と issue 個票 / `register-item-frontmatter.schema.yaml` の `ItemType` enum / 一致。6) `run_id` と `migration/&lt;run_id&gt;/` / `docs/ja/specdojo/samples/dmd-sample.md` の 39・71・99〜103 行目 / 一致。7) 正本切替を `mip-index` の GO4 とする記述 / `mip-index-sample.md` の 120 行目 / 一致。8) つけ残高 25 件 / `dmd-sample.md` の 24・77・83 行目 / 一致。9) 臨時休業の前提と、T-30m までのリハーサル合否 / `mip-index-sample.md` の 24・68 行目と `mtp-sample.md` の 17 行目 / 一致。10) 役割名を使い、人物名と個人の連絡先を書かない / Sample 記述標準の共通登場人物 / 一致。開店時刻や作業の分数など正本のない業務の値は、共通サンプル文脈と食い違わないため対象外とした。
- F001（`vp-ux-language-consistency`、line=62）: 指摘された文は今の sample にない。73 行目が「判断者の店主代表の Role code `PO`」と役割名と Role code を併記しており、前の段で直っている。この観点は R3 の担当のため、R4 では編集していない。次の grade で解消を確かめること。
- R5 への申し送り: 重大度「高」の基準が `cop-index-sample.md` とずれている。cop-sample は「販売の記録が 10 分以上できなければ、復旧の見込みにかかわらずロールバック」、`cop-index-sample.md` の 118 行目は「15 分を超え、閉店までに直る見込みがない」。rulebook は `cop-index` と矛盾させないことを求めるため、R5 でどちらに合わせるかを決めること。判断者の呼び方（`cop-index-sample.md` は「切替責任者」、cop-sample は「店主代表」）も R5 で確かめること。
- 適用外の検証（runner の判定）: `npm run lint:md`（変更に Markdown ファイル（`*.md`） がない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample 内の事実の主張を正本（schema、rulebook、関連 sample）と照合した。10 件の主張はすべて一致したため、記述はそのまま維持した。開店時刻や作業の分数のように正本のない業務の値は、共通サンプル文脈と食い違わないため確かめの対象外とした。F001 は前の段で解消済みで、R3 の観点でもあるため扱わなかった。確かめられなかった主張はない。
