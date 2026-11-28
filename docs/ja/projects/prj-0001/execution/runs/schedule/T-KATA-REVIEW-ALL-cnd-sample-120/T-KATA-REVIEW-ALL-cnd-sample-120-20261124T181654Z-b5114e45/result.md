---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cnd-sample-120-20261124t181654z-b5114e45
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cnd-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cnd-sample-120/T-KATA-REVIEW-ALL-cnd-sample-120-20261124T181654Z-b5114e45/plan.md
  started_at: "2026-11-24T18:17:02.963Z"
  completed_at: "2026-11-24T18:28:37.928Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cnd-sample
    - specdojo:cnd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `docs/ja/specdojo/samples/cnd-sample.md` を見直し、3件の指摘を反映した。章順・図・関係 ID・技術前提・検証対象・課題の解消条件・`status: draft` は維持した。
- 実施内容（指摘3件）: | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 3.2. Person（人・ロール） | template は2列だが、sample は「判断・確認の責務」を独立させた3列になっている | 判断・確認の記述を保持して「利用目的・接点」に統合し、template と同じ2列にした | `vp-qe-omissions-consistency`、CND rulebook 5章が表の列の正本とする cnd-template 3.2節 | - | | R2-2 | R2 | 2. C4コンテナ図（Mermaid）、3.2. Person（人・ロール） | Person に含めない主体の説明が図の注記と Person 表の後に分散している | 来店客を含めない理由を3.2節へ移し、店番担当の定義と開発・レビュー担当の扱いを表の前に集約した | `vp-arc-document-structure`、kata-guide 6.1節の前提から結論への順序、CND rulebook 6.3節の要素別の説明 | - | | R2-3 | R2 | 5. メモ / 将来課題 | 引き継ぎ先が未同梱の架空文書・課題であるという前提が表の後にある | 前提の注記を表の前へ移し、構成案として draft を維持する結論は表の後に残した | `vp-arc-document-structure`、kata-guide 6.1節の前提から結論への順序 | - |
- 検証は、executor が prettier 整形・markdownlint・`git diff --check` に成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cnd-sample.md`: R2（構成）の3件を反映した。3.2節の Person 表を template と同じ2列にし、判断・確認の責務を「利用目的・接点」へ統合した。Person に含めない主体の説明を3.2節の表の前へ集約した。5節では、引き継ぎ先が未同梱の架空文書・課題であるという前提を表の前へ移した。

## 3. 申し送り

- R1 のレビュー判定記録の削除と保存結果不明時の追記は維持された。result と grade サイドカーは未編集。
- 実成果物 cnd-specdojo の grade F002 が提案する追加列は、現行 cnd-template 3.2節の2列構成と一致しない。executor は現行の正本を優先し、判断責務の内容を保持して統合した。rulebook 側の列定義の見直しが必要かは、別途判断が要る。
- executor は親 runner の指定検証を実行していない。runner 側の結果は上記のとおり。
- R2-1: R2 / 箇所: 3.2. Person（人・ロール） / 指摘: template は2列だが、sample は「判断・確認の責務」を独立させた3列になっている / 直した案: 判断・確認の記述を保持して「利用目的・接点」に統合し、template と同じ2列にした / 根拠: `vp-qe-omissions-consistency`、CND rulebook5章が表の列の正本とする cnd-template3.2節 / 印: -
- R2-2: R2 / 箇所: 2. C4コンテナ図（Mermaid）、3.2. Person（人・ロール） / 指摘: Person に含めない主体の説明が図の注記と Person 表の後に分散している / 直した案: 来店客を含めない理由を3.2節へ移し、店番担当の定義と開発・レビュー担当の扱いを表の前に集約した / 根拠: `vp-arc-document-structure`、kata-guide6.1節の前提から結論への順序、CND rulebook6.3節の要素別の説明 / 印: -
- R2-3: R2 / 箇所: 5. メモ / 将来課題 / 指摘: 引き継ぎ先が未同梱の架空文書・課題であるという前提が表の後にある / 直した案: 前提の注記を表の前へ移し、構成案として draft を維持する結論は表の後に残した / 根拠: `vp-arc-document-structure`、kata-guide6.1節の前提から結論への順序 / 印: -
- reporter 向け判断根拠: kata-guide6.1・6.5節、Sample 記述標準5・6章、cnd-rulebook、cnd-template、cnd-recipe、cnd-mermaid-rulebook、共通レビュー観点を確認した。R1 result、対象 sample の grade、実成果物 cnd-specdojo とその grade、cxd-sample も参照した。実成果物 grade F002 の追加列案は現行 template3.2節の2列構成と一致しないため、現行の正本を優先し、判断責務の内容を保持して統合した。展開済み finding はなく、根拠不足による見送りはない。
- reporter 向け変更・維持記録: 変更ファイルは docs/ja/specdojo/samples/cnd-sample.md のみ。章順、図、関係 ID、技術前提、検証対象、課題の解消条件、`status: draft` を維持した。R1 のレビュー判定記録の削除と保存結果不明時の追記を維持した。result・grade サイドカーは未編集。指摘3件は実施内容に表として1回だけ記載する。親 runner の指定検証は実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample のみで、YAML・YML ファイルを変更していない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイルおよび plan・result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は sample のみで、docs/ja/projects/ 配下の成果物を変更していない。）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従った。executor は、kata-guide 6.1・6.5節、Sample 記述標準 5・6章、cnd-rulebook、cnd-template、cnd-recipe、cnd-mermaid-rulebook、共通レビュー観点を根拠にした。R1 result、対象 sample の grade、実成果物 cnd-specdojo とその grade、cxd-sample も参照した。plan に展開済みの grade finding と成果物由来の finding はなく、根拠不足による見送りもない。template と実成果物 grade の提案が食い違った箇所は、構造の正本である rulebook と template を優先し、内容を保持して統合した。rulebook など sample 以外は変更していない。
