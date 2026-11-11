---
specdojo:
  id: prj-0001:xer-t-glossary-gl-common-070-20261111t175822z-47704551
  type: exec-result
  task_id: T-GLOSSARY-gl-common-070
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-GLOSSARY-gl-common-070/T-GLOSSARY-gl-common-070-20261111T175822Z-47704551/plan.md
  started_at: "2026-11-11T17:58:23.687Z"
  completed_at: "2026-11-11T18:09:32.200Z"
  agent: sol-executor
  execution: agent
  approach: fully-guided
  targets:
    - gl-common
---

# Edit Result

## 1. 実施内容

- 共通用語集の磨き込みを行い、定義の明確化と分類の不整合を解消しました。
- `tm-deliverable` の定義を、成果物カタログの定義および完了条件に沿って、文書・構造化データとして具体化しました。
- `tm-filing`（起票）および `tm-record-keeping`（記帳）において、操作であるため不適切だった `category` フィールドを削除し、分類の整合性を整えました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml`: 「成果物」の定義を明確化し、「起票」「記帳」から不適切な `category` 指定を削除して整合性を確保しました。

## 3. 申し送り

- reporter向け判断記録: gl-rulebook の定義・分類の規則を適用し、gl-sample は形式の参照に限定した。指定されたプロジェクト概要、共通規約、実装エビデンス4ファイルを確認した。recipe は指定がなく、template と未宣言の関連文書は参照していない。
- 変更根拠: `tm-deliverable` の循環した定義を、既存の成果物カタログの定義とplanの完了条件に沿って文書・構造化データとして明確化した。`tm-filing` と `tm-record-keeping` は操作であり、`tm-exec-log` が分類する記録の構成要素ではないため、両項目の `category` だけを削除した。定義・別名・関連用語・出典は保持した。
- 既存の共通概念と領域固有用語の責務分担、および条件の詳細をschemaの正本に委ねる説明を維持した。新規用語や根拠のない実装情報は追加していない。変更ファイルは `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml` のみ。`status` はdraftを維持し、resultはpipeline指示に従って編集していない。
- 適用外の検証: `npx markdownlint`（executorの変更はYAMLファイルのみ。）
- 適用外の検証: `npm run validate:catalog`（変更は製品の用語集のみで、`docs/ja/projects/` 配下への成果物変更がない。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイル、plan、resultを変更していない。）

## 4. 進め方と実践の型の適用

指定された `gl-rulebook` および `gl-sample` を参照し、既存記述を尊重しつつ最小限の修正を行いました。`tm-deliverable` の定義を具体化し、操作に該当する項目の `category` 属性を削除することで、分類上の不整合を解消しました。変更後は `prettier` による整形および `gl.schema.yaml` によるスキーマ検証を実施し、適合性を確認しました。
