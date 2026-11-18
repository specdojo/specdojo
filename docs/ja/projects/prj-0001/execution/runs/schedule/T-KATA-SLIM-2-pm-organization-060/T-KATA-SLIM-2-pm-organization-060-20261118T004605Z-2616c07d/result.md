---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-pm-organization-060-20261118t004605z-2616c07d
  type: exec-result
  task_id: T-KATA-SLIM-2-pm-organization-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-pm-organization-060/T-KATA-SLIM-2-pm-organization-060-20261118T004605Z-2616c07d/plan.md
  started_at: "2026-11-18T00:46:10.542Z"
  completed_at: "2026-11-18T01:11:39.611Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - prj-0001:pm-organization
    - specdojo:pm-organization-recipe
---

# Edit Result

## 1. 実施内容

- `pm-organization-recipe` を改訂し、共通運用の記述、rulebook と同じ判断の言い直し、構造検査、重複した確認、全体手順をなぞる深掘りを外した。
- F001 に対応し、各章の書き方を「問い:」「コツ:」の形に改めた。取り出し元の列、章を書く順番の理由、対応のない主張を探す深掘りの順序を加えた。
- 大きさは、空白と表の区切り行を除いて 1,999 字から 1,399 字（70.0%）になった。区切り行込みでは 2,223 字・5,888 B から 1,619 字・4,087 B になった。
- 成果物本体、rulebook、sample、template は変更していない。
- executor の `markdownlint-cli2` と `prettier --check` は通過した。runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` も通過した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/pm-organization-recipe.md`: recipe から文書の運用と rulebook の言い直しを外して、7 割の大きさに縮めた。各章の書き方は「問い」と「コツ」の形に改めた。取り出し元、書く順番の理由、対応のない主張を探す深掘りの順序は残すか加えた。レビュー観点と良い例・悪い例の表は 2 行ずつにした。

## 3. 申し送り

- F001 が解消したかは、統合後の grade で確認が要る。
- レビュー観点と良い例・悪い例の表を 2 行ずつにしたため、Recipe 記述標準の「必須章ごとに 3 項目以上」を下回る。grade で指摘された場合は、7 割の目安の扱いと合わせて判断が要る。
- result の大きさの表に記録する: pm-organization-recipe 前 1,999 字（2,223 字・5,888 B）→ 後 1,399 字（1,619 字・4,087 B）、比 70.0%。測り方は PJR-7M9J と同じ（空白・改行と表の区切り行を除く）。
- F001（各章を問いとコツの形にする）は各章の書き方を『問い:』『コツ:』の形に改めて対応した。解消したかは統合後の grade で確かめる。
- 7 割の目安を守るため、レビュー観点と良い例・悪い例の表を 2 行ずつにした。Recipe 記述標準の『内容充実化』の『必須章ごとに 3 項目以上』を下回るので、grade で指摘されたら、目安の扱いと合わせて判断が要る。
- rulebook・sample・template は変えておらず、合わせて直すべき点も見つからなかった。
- 適用外の検証: `npm run validate:history-links`（変更は recipe（docs/ja/specdojo/recipes/）のみで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

recipe-maintenance として、`pm-organization-recipe` だけを prj-charter の試行（PJR-7M9J）の一覧に沿って改訂した。共通の運用、rulebook の言い直し、構造の検査、同じ確認の繰り返し、章立てをなぞる文を外した。章を書く順番とその理由、入力の集め方、書き手への問い、つまずきやすい点、対応のない主張を探す深掘りの順序は残すか加えた。F001 は各章を「問い」と「コツ」の形にして対応した。解消したかは統合後の grade で確かめる。rulebook、sample、template は変更しておらず、executor は合わせて直すべき点を見つけていない。
