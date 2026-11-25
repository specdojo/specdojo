---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dmd-sample-110-20261124t235156z-79e622a0
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dmd-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dmd-sample-110/T-KATA-REVIEW-ALL-dmd-sample-110-20261124T235156Z-79e622a0/plan.md
  started_at: "2026-11-24T23:52:08.349Z"
  completed_at: "2026-11-25T00:05:38.271Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dmd-sample
    - specdojo:dmd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの R1（目的の過不足）を `docs/ja/specdojo/samples/dmd-sample.md` に対して実施した。変更は、データマッピングに移す先がない変換ルールの 1 文を削る 1 件だけである。
- grade の指摘 F001（`vp-pm-plan-feasibility`、移行手順表の担当不在）は、kata のレビューに使わない観点で、rulebook と Sample 記述標準が役割の割り当てを本文に書くことを禁じているため、sample は直さなかった。当日の作業の担当は `cop-index` が持つ。
- dmd-rulebook の必須 10 章と推奨の表、`done_criteria` の「外す理由と業務への影響（販売・在庫・つけ）」はそろっており、ほかに欠けている内容や要らない内容は見つからなかった。
- 検査は、executor の `npx prettier --check` と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。ほかの検査は変更の種類により非適用である。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dmd-sample.md`: 「変換ルール」の氏名の項から、「読みが書かれていない顧客は読み欄を空にする」の 1 文を削除した。データマッピングの表に読みの項目がなく、移す先のない変換で、要らない内容だったため。差分は 1 行の置き換えのみ。

## 3. 申し送り

- R1 の指摘は次の 3 件である。1 件目は sample を直した。2 件目は要判断で、sample は直していない。3 件目は変更なしである。
- 判断が要る点は 2 件目（F001）で、kata の grade の観点の組から `vp-pm-plan-feasibility` を外すかどうかを、grade 側の設定の見直しとして決める必要がある。根拠は `docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」、dmd-rulebook の「全体方針」、sample-authoring-standard の「記述ガイド」と「禁止事項」である。grade result のサイドカーは本タスクでは編集していない。
- No: 1 / 段: R1 / 箇所: dmd-sample.md の「変換ルール」の氏名の項 / 指摘: 「読みが書かれていない顧客は読み欄を空にする」は、データマッピングの表に移す先（読みの項目）がない変換で、要らない内容になっている / 直した案: この 1 文を削った / 根拠: rulebook の記述ガイド「データマッピング」「変換ルール」（旧→新の対応と変換規則を対で示す）、Sample 記述標準の「構成の原則」（最小の記述量で完成例として成立させる） / 印: なし
- No: 2 / 段: R1 / 箇所: dmd-sample.md の「移行手順（手動/バッチ/ツール）」の表（grade の指摘 F001） / 指摘: 手順 1・3・4・5 の担当がないという指摘は、観点 `vp-pm-plan-feasibility` によるもので、kata-guide の「kata の観点の組」で kata のレビューに使わない観点とされている。rulebook の全体方針にも「役割の割り当ては適用先のメンバー定義に従う」とあり、Sample 記述標準でも役割の割り当てを本文に書くことを禁じている。当日の作業の担当は `cop-index` が持つ / 直した案: sample は直さない。kata の grade の観点の組から `vp-pm-plan-feasibility` を外すよう、grade 側の設定を見直す案を示す / 根拠: docs/ja/specdojo/guides/kata-guide.md の「kata の観点の組」、dmd-rulebook の「全体方針」の共通の運用、sample-authoring-standard の「記述ガイド」と「禁止事項」 / 印: 要判断
- No: 3 / 段: R1 / 箇所: dmd-sample.md 全体 / 指摘: rulebook の必須 10 章と推奨の表、`done_criteria` の「外す理由と業務への影響（販売・在庫・つけ）」はそろっており、ほかに欠けている内容や要らない内容はない。frontmatter に `based_on` がないのは、参照先がまだ作られていないため、rulebook の「推奨 Frontmatter 項目」に沿っている / 直した案: 変更しない / 根拠: dmd-rulebook の「本文要件」「推奨 Frontmatter 項目」、dct-kata.yaml の dmd-sample の `done_criteria` / 印: なし
- 適用外の検証: `npm run validate:history-links`（変更したのは sample の docs/ja/specdojo/samples/dmd-sample.md だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

根拠としたのは、dmd-rulebook の「本文要件」「推奨 Frontmatter 項目」「記述ガイド」、Sample 記述標準の「構成の原則」「記述ガイド」「禁止事項」、kata-guide の「kata を agent でレビューする」と「kata の観点の組」、dct-kata.yaml の dmd-sample の `done_criteria` である。 改訂した記述は、データマッピングに対応する項目がない読み欄の変換 1 文である。旧→新の対応と変換規則を対で示す rulebook の決まりと、最小の記述量で完成例を成立させる原則に照らして削った。 維持した記述は、必須 10 章、推奨の表、外す理由と業務への影響の記述、`based_on` を置かない frontmatter である。`based_on` は参照先がまだ作られていないため、rulebook の「推奨 Frontmatter 項目」に沿っている。 F001 は、観点 `vp-pm-plan-feasibility` が kata のレビューに使わない観点であり、役割の割り当てを本文に書くことを rulebook と Sample 記述標準が禁じているため、未解消のまま見送った。次のアクションは、grade 側の観点の組の見直しである。rulebook と矛盾する箇所はなく、すべて rulebook を正として照合した。
