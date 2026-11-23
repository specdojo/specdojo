---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-notation-cnd-sample-040-20261123t064136z-74f9abc7
  type: exec-result
  task_id: T-KATA-WAVE-6-NOTATION-cnd-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-NOTATION-cnd-sample-040/T-KATA-WAVE-6-NOTATION-cnd-sample-040-20261123T064136Z-74f9abc7/plan.md
  started_at: "2026-11-23T06:41:44.091Z"
  completed_at: "2026-11-23T06:58:47.206Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:cnd-sample
    - specdojo:cnd-rulebook
---

# Edit Result

## 1. 実施内容

- 記法の `rulebook` である `docs/ja/specdojo/rulebooks/cnd-mermaid-rulebook.md` を 5 章に簡潔化しました。完成例の章や、凡例の例と色の定義の重複を削除し、要素を対応表へ統合しました。また、点線の定義や境界名、👤 表記、および色を変更する際に見直すべき文書に関する記述を追加しました。
- `docs/ja/specdojo/rulebooks/cnd-rulebook.md` について、PJR-76N9 に基づき、成果物の位置づけに関する記述と、共通の運用における役割の記述を整理・修正しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cnd-mermaid-rulebook.md`: 完成例の章を削除し、内容を簡潔化しました。要素の対応表の整備、点線の条件、境界名の扱い、👤 表記の定義、および色変更時の見直しに関する情報を整理・追加しました。
- `docs/ja/specdojo/rulebooks/cnd-rulebook.md`: 文書の位置づけと、共通の運用における役割に関する記述を、PJR-76N9 の規定に従って修正しました。

## 3. 申し送り

- cnd-sample の概要の段落（「ARC が構成案を担当し…PO を担う店主代表が…判断する」）と末尾の変更時の窓口の段落は、文書の役割の割り当てと承認の進み具合を本文に書いており PJR-76N9 に反する。sample を直す段で削除または書き直す必要がある。
- cnd-rulebook の章名「検証・承認前の確認」は、cnd-sample が章名で参照しているため変えなかった。sample を直すときに章名を「検証前の確認」へ変え、sample の参照も合わせて直すかを判断する。
- cnd-mermaid-rulebook のサンプル章を plan の指示に従って削除した。rulebook-authoring-standard は「個別の改訂で先行して削除しない」としているため、この扱いでよいかを確認する。
- cnd-mermaid-rulebook の `recipe: undecided` / `template: undecided`（grade F001・F013）は、記法部品として不要（`not-needed`）とするか、主 rulebook のものを共用するかの判断が要るため変えなかった。
- grade F002（作成手順と完了チェック）は、作成手順は recipe、完了チェックは主 rulebook の「検証・承認前の確認」が扱うため、記法の rulebook には足さなかった。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks 配下の 2 ファイルだけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

対象の `rulebook` を、`grade` の指摘に基づいて簡潔に整えました。具体的には、`cnd-mermaid-rulebook.md` から完成例の章を除去し、記法の定義を整理しました。また、`cnd-rulebook.md` において、文書の役割に関する記述を PJR-76N9 に沿って修正しました。
