---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-prj-comparison-of-alternatives-060-20261118t155410z-222e455c
  type: exec-result
  task_id: T-KATA-SLIM-2-prj-comparison-of-alternatives-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-prj-comparison-of-alternatives-060/T-KATA-SLIM-2-prj-comparison-of-alternatives-060-20261118T155410Z-222e455c/plan.md
  started_at: "2026-11-18T15:54:19.994Z"
  completed_at: "2026-11-18T16:23:21.552Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - prj-0001:prj-comparison-of-alternatives
    - specdojo:prj-comparison-of-alternatives-recipe
---

# Edit Result

## 1. 実施内容

- 代替案比較 recipe を、Recipe 記述標準および prj-charter のスリム化試行に基づき改訂しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/prj-comparison-of-alternatives-recipe.md`: rulebook と重複する判断基準の言い直しや、共通の運用記述、構造的な検査項目を削除し、執筆順序や具体的なコツ、精選した問いに整理しました。また、公開適性の確認項目を仕上げチェックに追加し、用語を「業務適合」「完了条件」に統一しました。

## 3. 申し送り

- 大きさ（空白を除いた文字数、表の区切り行を除く）: 前 5,918 字、後 3,243 字、比 54.8%。
- 外した記述: rulebook と同じ判断の言い直し（6 つの必須評価軸の列挙、決定 ID と案 ID の形式の指定、記録先の指定、`PO` の判断責任と各ロールへのつなぎ方、禁止事項の言い換え）、仕上げチェックの構造の検査（「章立てと必須表がそろっている」）、レビュー観点・良い例と悪い例・仕上げチェックで同じ点を見ていた行、全体の作成手順をなぞっていた深掘り手順、冒頭で章立てをなぞる文。元の recipe には、共通の運用の記述（役割・`status`・公開の承認・改訂と廃止）と未決事項の台帳の列はなかった。
- 残した・足した記述: 書く順番とその理由（決定 ID と判断順序を先に決める、候補カテゴリを具体名より先に決める、評価軸を候補の評価より先に固定する、冒頭文を最後に書く）、「作成前に集める情報」の取り出し元の列、問いを各節 2 つに絞ったこと、「書き方」から「コツ」への置き換え（聞き方とつまずきやすい点）、対応のない主張を探す深掘りの順序、判断の差が分かる良い例と悪い例 5 行。
- F001: 構造の検査をやめ、各案の判定が評価軸から導かれ、評価軸が課題 ID・制約にたどれることを確かめる項目に置き換えた。F002・F007・F010: 仕上げチェックに公開適性の項目（個人名・個人の連絡先・公開できない組織情報がない）を足した。F004: 「備考に書く」指示をやめ、template にある判定基準の列に有利な方向を書くようにした。F005: 評価軸を例外のない最低ラインとして並べるのをやめ、省くとき・統合するときに理由・統合先・判定条件を書くコツにした。F008: 「業務適合」にそろえた。F009: 「完了条件」にそろえた。
- F003・F006: sample を検索して見たかぎりでは、評価基準表と比較結果表にすでに「リスク」と「技術実現性」の列があり、解消済みに見える。この段では sample を変えられないため、再評価で確かめる。
- 参照の形: Recipe 記述標準に従い, recipe 本文に rulebook・sample への参照を書かなかった。判断の基準は言い直さずに外し、成果物の章名で示した。上位成果物を正とする内容（課題・範囲）は「写さず参照に置き換える」とコツに書いた。rulebook・sample・template に合わせて直すべき点は見つからなかった。
- 参照の形: Recipe 記述標準に従い、recipe 本文に rulebook・sample への参照を書かなかった。判断の基準は言い直さずに外し、成果物の章名で示した。上位成果物を正とする内容（課題・範囲）は「写さず参照に置き換える」とコツに書いた。rulebook・sample・template に合わせて直すべき点は見つからなかった。

## 4. 進め方と実践の型の適用

Recipe 記述標準および `prj-charter` のスリム化例を参考に、recipe から rulebook と重複する判断基準や定型的な運用記述を排除し、書き手が実際に必要とする「問い」と「コツ」を中心とした構成に再編しました。併せて、grade result の finding に基づき、公開適性のチェック項目追加や用語の統一を行い、実効性を高めました。
