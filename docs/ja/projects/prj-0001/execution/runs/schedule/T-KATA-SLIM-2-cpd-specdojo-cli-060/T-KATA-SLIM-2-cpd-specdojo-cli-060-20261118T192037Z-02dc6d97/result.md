---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-cpd-specdojo-cli-060-20261118t192037z-02dc6d97
  type: exec-result
  task_id: T-KATA-SLIM-2-cpd-specdojo-cli-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-cpd-specdojo-cli-060/T-KATA-SLIM-2-cpd-specdojo-cli-060-20261118T192037Z-02dc6d97/plan.md
  started_at: "2026-11-18T19:20:43.866Z"
  completed_at: "2026-11-18T19:54:32.136Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - cpd-specdojo-cli
    - specdojo:cpd-recipe
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/recipes/cpd-recipe.md` から、文書の運用記述、管理台帳の列定義、`rulebook` と重複する判断基準、構造検査および反復的な確認事項を削除した。
- 執筆順序と理由、入力収集方法、核心的な問いとコツ、深掘り手順、具体例（良い例・悪い例）を整理し、記述をスリム化した。
- 空白を除いた文字数を 4465 字から 3124 字（70.0%）へ削減した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/cpd-recipe.md`: 文書の運用記述、台帳列定義、`rulebook` の言い直し、構造検査および重複記述を削除し、執筆順序・問い・コツ・深掘り手順・具体例を中心に再構成した。

## 3. 申し送り

- 文字数（空白を除く）: 改訂前 4465 字、改訂後 3124 字（70.0%）。
- 根拠とした文書: `specdojo:cpd-rulebook`（記述ガイド・禁止事項）、Recipe 記述標準（`docs/ja/specdojo/standards/recipe-authoring-standard.md`）、手本の `specdojo:prj-charter-recipe`、PJR-7M9J の『他の recipe へ広げるときの一覧』。構造・必須項目は `rulebook` を正とし、`recipe` では言い直さず外した。
- 対応した finding: F004（深掘り手順の 1 に、出力と上位の成功基準の対応を確かめる手順を入れた）、F005（概要の問いに『今回扱わない範囲』を加えた）、F006・F012（『技術前提・制約と検証観点』の問いを技術前提と検証観点に分け、共通機構の保証を確かめる問いを入れた）、F007・F011（改訂の影響の確認を深掘り手順の 4 にまとめ、重複をなくした）、F008（概要のコツに、確かめていない構成を `_ASSUMPTION_` にすることを入れた）。
- 対応を見送った finding: F001（上位の標準文書への参照）、F003（PJR・Role への転記）、F009（メタ情報・Mermaid 構文・描画の検査項目）は、文書の運用と文書品質の検査を外す方針、および `recipe` 本文に `rulebook` や共通の運用への参照を書かない規則（Recipe 記述標準）とぶつかるため対応しない。F010（合否の判定）は `rulebook` の『検証と合意の判定』の言い直しになるため外した。F002（作業の規模の見積もり基準）は `recipe` の責務外（Schedule 側の扱い）と判断した。次のアクション: 型の再 grade で、同じ観点の指摘が出ないか確かめる。
- `rulebook` の変更案（この段では直していない）: `cpd-rulebook` の『記述ガイド』の冒頭の『共通のメタ情報・命名は上位標準を参照し』は、『全体方針』の『共通の運用』と重なるため整理の余地がある。sample と template に変える点はなかった。
- 文字数（空白を除く）: 改訂前 4465 字、改訂後 3124 字（70.0%）。result の『進め方と実践の型の適用』に記録する。
- 根拠とした文書: `specdojo:cpd-rulebook`（記述ガイド・禁止事項）、Recipe 記述標準（`docs/ja/specdojo/standards/recipe-authoring-standard.md`）、手本の `specdojo:prj-charter-recipe`、PJR-7M9J の『他の recipe へ広げるときの一覧』。構造・必須項目は rulebook を正とし、recipe では言い直さず外した。
- 対応した finding: F004（深掘り手順の 1 に、出力と上位の成功基準の対応を確かめる手順を入れた）、F005（概要の問いに『今回扱わない範囲』を加えた）、F006・F012（『技術前提・制約と検証観点』の問いを技術前提と検証観点に分け、共通機構の保証を確かめる問いを入れた）、F007・F011（改訂の影響の確認を深掘り手順の 4 にまとめ、重複をなくした）、F008（概要のコツに、確かめていない構成を `_ASSUMPTION_` にすることを入れた）。
- 対応を見送った finding: F001（上位の標準文書への参照）、F003（PJR・Role への転記）、F009（メタ情報・Mermaid 構文・描画の検査項目）は、文書の運用と文書品質の検査を外す方針、および recipe 本文に rulebook や共通の運用への参照を書かない規則（Recipe 記述標準）とぶつかるため対応しない。F010（合否の判定）は rulebook の『検証と合意の判定』の言い直しになるため外した。F002（作業の規模の見積もり基準）は recipe の責務外（Schedule 側の扱い）と判断した。次のアクション: 型の再 grade で、同じ観点の指摘が出ないか確かめる。
- rulebook の変更案（この段では直していない）: `cpd-rulebook` の『記述ガイド』の冒頭の『共通のメタ情報・命名は上位標準を参照し』は、『全体方針』の『共通の運用』と重なるため整理の余地がある。sample と template に変える点はなかった。
- 適用外の検証: `npm run validate:history-links`（変更したのは recipe だけで、pjr 個票・plan・result は変更していないため）

## 4. 進め方と実践の型の適用

Recipe 記述標準および `rulebook` を正として、重複する判断基準や共通運用記述を削除し、書き手が判断に迷う「問い」と「コツ」に特化した構成へスリム化した。Finding-based な改善を取り入れつつも、運用の記述を排除するという基本方針に基づき、一部の finding（運用・検査系）は意図的に見送っている。
