---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-pm-raci-060-20261118t011658z-de965654
  type: exec-result
  task_id: T-KATA-SLIM-2-pm-raci-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-pm-raci-060/T-KATA-SLIM-2-pm-raci-060-20261118T011658Z-de965654/plan.md
  started_at: "2026-11-18T01:17:03.789Z"
  completed_at: "2026-11-18T01:57:53.738Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - prj-0001:pm-raci
    - specdojo:pm-raci-recipe
---

# Edit Result

## 1. 実施内容

- `pm-raci-recipe` から、`rulebook` と同じ判断の言い直し、構造の検査、同じ確認の繰り返しを外した。
- 書く順番とその理由、入力の取り出し元、書き手が答える問いとコツ、対応のない主張を探す深掘りに絞った。
- 8 章の構成は保った。空白と表の区切り行を除いた文字数は 2,230 字から 1,559 字（69.9%）になり、目安の 7 割以下を満たした。
- `prettier` と `markdownlint` は通過した。runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` も通過した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/pm-raci-recipe.md`: 39 行追加・53 行削除。`rulebook` と同じ判断の言い直し、構造の検査、同じ確認の繰り返しを削った。章を書く順番とその理由、入力の取り出し方、書き手への問いとコツ、深掘りの順序を残した。

## 3. 申し送り

- `rulebook`・`sample`・`template` の変更は不要と executor は判断した。
- 元の `recipe` には、役割の表、`status` の昇格と承認、公開の承認条件、改訂と廃止の手順、未決事項の管理台帳の列はなかった。
- 大きさ（result の実施内容に記載）: pm-raci-recipe は 2,230 字から 1,559 字（69.9%）。空白（改行を含む）と表の区切り行（`| --- |`）を除いて数えた（PJR-7M9J と同じ測り方）。
- 変更案: rulebook・sample・template の変更は不要と判断した。template の「主担当と照合先」の `_TODO_` に人と組織の定義標準への wikilink が残る。ただし template の指示であり recipe の対象外のため、変えていない。
- 元の recipe には、役割の表、`status` の昇格と承認、公開の承認条件、改訂と廃止の手順、未決事項の管理台帳の列はなかった。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/recipes/pm-raci-recipe.md だけで、plan・result・個票の変更がない）

## 4. 進め方と実践の型の適用

`recipe-maintenance` として、`pm-raci-recipe` を対象に PJR-7M9J の試行の一覧に沿って記述を整理した。`recipe` の章立ては `recipe-authoring-standard` に合わせて保った。plan に展開された finding と `condense` の記録はなかったため、finding の解消確認は該当なしである。
