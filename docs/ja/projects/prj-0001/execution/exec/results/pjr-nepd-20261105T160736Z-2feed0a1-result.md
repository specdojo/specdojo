---
specdojo:
  id: prj-0001:xer-pjr-nepd-20261105t160736z-2feed0a1
  type: exec-result
  task_id: PJR-NEPD
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-nepd-20261105T160736Z-2feed0a1-plan.md
  started_at: "2026-11-05T16:07:48.267Z"
  completed_at: "2026-11-05T16:16:49.006Z"
  agent: sol-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-mermaid-rulebook
---

# Edit Result

## 1. 実施内容

- stsd-mermaid-rulebook の表示名に関する定義・規則・例の更新、および stsd-rulebook への章参照の修正を行いました。
- 表示名の定義として、値がある場合は「状態名`&lt;br&gt;`値」、値が `-` の場合は「状態名」とする規則を明文化し、コードブロック内の例もこれに従って更新しました。
- また、stsd-rulebook の構成変更に伴い、従来の「概要」への参照を新しい章（目的・適用範囲）への参照へと修正しました。
- 整形および差分検査（`prettier`）は通過しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md`: 状態遷移図における表示名の定義（値がある場合の `&lt;br&gt;` を用いた 2 行表示ルール）、値が `-` の場合の扱い、および新しい章構成への参照を更新しました。

## 3. 申し送り

- 判断根拠: PJR-NEPD の入力・完了条件、PJR-VNT1 の決定、stsd-rulebook の「適用範囲」「状態遷移図」、rulebook-authoring-standard、共通規約、`vp-arc-conciseness` を確認。状態名と値の一致、値 `-` の例外、表示値と内部 ID の区別を規定し、分割図の表示名・内部 ID の一致規則を維持した。
- 関連する stsd-sample・stsd-template・stsd-recipe は旧表示または旧章立てを含むが、PJR-VNT1 で別タスクに分担されている。本タスクでは rulebook を正とし、対象 Kata だけを編集した。result の記入は reporter、指定 lint は親 runner が担当する。
- 適用外の検証: `npm run validate:schema:file`（executor が変更した YAML ファイルはない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/ 配下のみで、docs/ja/projects/ 配下には及ばない。）
- 適用外の検証: `npm run validate:history-links`（executor は履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

stsd-mermaid-rulebook の内容を、新しい状態表示の規則（値がある場合は 2 行にする）と、stsd-rulebook の新しい章構成への参照に合わせて更新する。作業は rulebook のみに対象を限定し、既存の lint 規約に従う。
