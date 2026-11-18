---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-ifd-specdojo-060-20261118t193408z-8867c609
  type: exec-result
  task_id: T-KATA-SLIM-2-ifd-specdojo-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-ifd-specdojo-060/T-KATA-SLIM-2-ifd-specdojo-060-20261118T193408Z-8867c609/plan.md
  started_at: "2026-11-18T19:34:18.133Z"
  completed_at: "2026-11-18T20:05:15.708Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - ifd-specdojo
    - specdojo:ifd-recipe
---

# Edit Result

## 1. 実施内容

- `ifd-recipe` を見本に沿って書き直し、記述を大幅にスリム化した。
- 文書の運用記述、未決事項台帳の詳細列、`rulebook` と重複する判断基準、および recipe 内で繰り返されていた確認事項を削除した。
- 執筆の順番、入力情報の収集方法、各節での問いとコツ、深掘りの手順に焦点を当てた内容に整理した。
- 空白除いた文字数は 3,651 字から 2,529 字（約 69.3%）に削減し、8 章の構成を維持した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/ifd-recipe.md`: 運用の記述と言い直しを削除し、執筆上の問いとコツを中心とした構成にスリム化した。

## 3. 申し送り

- 大きさ（空白・改行と表の区切り行を除く）: 前 3,651 字（区切り行込み 3,959 字・11,509 B）、後 2,529 字（2,808 字・7,919 B）、比 69.3%。result の `進め方と実践の型の適用` に記録すること。
- 根拠とした規範: `docs/ja/specdojo/standards/recipe-authoring-standard.md`（記述ガイド・禁止事項）、`docs/ja/specdojo/rulebooks/ifd-mermaid-rulebook.md`（本文要件・記述ガイド・禁止事項）、手本 `docs/ja/specdojo/recipes/prj-charter-recipe.md` と PJR-7M9J の「他の recipe へ広げるときの一覧」。grade・condense の finding はなかった。
- rulebook を正とした箇所: 詳細の値・構文の委譲、配置表と経路表の推奨列、Mermaid の表現規約、各章の良い例・悪い例は rulebook にあるため recipe から外した。
- 変更案: rulebook・sample・template に直すべき点は見つからなかった（template は今回読んでいない）。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していない）

## 4. 進め方と実践の型の適用

`docs/ja/specdojo/standards/recipe-authoring-standard.md` および `docs/ja/specdojo/rulebooks/ifd-mermaid-rulebook.md` に基づき、`rulebook` と重複する判断基準や共通の運用記述を徹底的に排除した。具体的に、詳細な列指定や表現規約などの「判断の基準」は `rulebook` への委譲とし、recipe には「書き手が答えるべき問い」と「つまずきやすい点」のみを残すことで、文字数を約 7 割まで削減しつつ実用性を維持するアプローチを採った。
