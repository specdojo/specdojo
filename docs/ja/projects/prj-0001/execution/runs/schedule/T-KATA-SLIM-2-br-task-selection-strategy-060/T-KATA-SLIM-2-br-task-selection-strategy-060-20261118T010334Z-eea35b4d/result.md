---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-br-task-selection-strategy-060-20261118t010334z-eea35b4d
  type: exec-result
  task_id: T-KATA-SLIM-2-br-task-selection-strategy-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-br-task-selection-strategy-060/T-KATA-SLIM-2-br-task-selection-strategy-060-20261118T010334Z-eea35b4d/plan.md
  started_at: "2026-11-18T01:03:41.365Z"
  completed_at: "2026-11-18T01:44:52.060Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - br-task-selection-strategy
    - specdojo:br-recipe
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/recipes/br-recipe.md` から、rulebook と同じ判断の言い直し、未決事項の台帳寄りの記述、同じ確認の繰り返し、章立てをなぞる文を外し、書く順番・入力の集め方・聞き方のコツ・深掘りの順序に絞った。
- 空白と改行、表の区切り行を除いた文字数は 2,143 字から 1,493 字（69.7%）になり、目安の 7 割以下を満たした。Recipe 記述標準の 8 章の構成は保った。
- 成果物本体、rulebook、template、sample は変更していない。lint 系（`lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`）、`validate:schema`、`test:unit`、`test:integration` は runner の検証で passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/br-recipe.md`: rulebook の良い例そのものだった境界の例、禁止事項の言い換え、責務境界の指示、未決事項の台帳寄りの記述（いつまでに、依頼先と判断時期）、レビュー観点・良い例・仕上げチェックで繰り返していた確認、深掘り手順と重なるレビュー観点、章立てをなぞる冒頭の文を削除した。残した・足した記述は、Why・What・How・Trace の対応を示す「このレシピの使い方」、集める情報の取り出し元、書く順番とその理由、各章の問いと聞き方のコツ（上位の目的は写さず参照に置き換える、を含む）、対応のない主張を探す深掘りの順序、U-05 を手がかりにした良い例 / 悪い例の「部分的な欠損」の行、recipe の中だけで確かめられる仕上げチェック 3 項目。recipe 本文に rulebook・sample への参照は書いていない。

## 3. 申し送り

- grade・condense の finding は plan に展開されていなかったため、finding ごとの解消確認はない。
- executor の変更案はなし。template と sample に未決事項の管理台帳の列は見当たらなかったと、executor が報告している。
- 大きさ（PJR-7M9J と同じ測り方。空白と改行を除き、表の区切り行を除く）: 前 2,143 字、後 1,493 字（69.7%）。区切り行を含む空白除去の文字数は前 2,601 字、後 1,829 字。バイト数は前 7,404 B、後 4,955 B。
- 外した記述: rulebook の良い例そのものだった境界の例「発注点と等しければ不足なし」、rulebook の禁止事項の言い換え（同じ条件を表・文章・擬似コードで繰り返さないこと、未決の期待値を確定値として示さないこと）、責務境界（手順・構文・保存構造を後続の成果物へ渡すこと）の指示、未決事項の台帳寄りの記述（いつまでに、依頼先と判断時期）、レビュー観点・良い例・仕上げチェックで繰り返していた未決事項の確認、深掘り手順の 1 と重なるレビュー観点「業務的な理由」、冒頭で章立てをなぞる文。元の recipe には共通の運用（役割の表、status の昇格と承認、改訂の手順など）の記述はもともとなかった。
- 残した・足した記述: Why・What・How・Trace の対応を 1 項目で示す「このレシピの使い方」、集める情報の取り出し元の列と代表例の行、書く順番とその理由（代表例から書き始め、概要は最後に書く）、各章の問いと聞き方のコツ（上位の目的は写さず参照に置き換える、を含む）、対応のない主張を探す深掘りの順序、対象の成果物の U-05 を手がかりにした良い例 / 悪い例の「部分的な欠損」の行、recipe の中だけで確かめられる仕上げチェックの 3 項目。recipe 本文には rulebook・sample への参照を書いていない（Recipe 記述標準）。
- 変更案: なし。br-rulebook・br-template・br-sample は変えていない。template と sample に未決事項の管理台帳の列（担当・期限・判断時期・対応方針）は見当たらなかった。
- grade・condense の finding は plan に展開されていなかった（なし）。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/recipes/br-recipe.md だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

recipe-maintenance。PJR-7M9J の prj-charter recipe 試行の一覧を手本に、rulebook を正として recipe から重複と運用の記述を外した。元の recipe には共通の運用（役割の表、status の昇格と承認、改訂の手順など）の記述はもともとなかった。判断の基準は言い直さず、成果物の章名で示す形にした。
