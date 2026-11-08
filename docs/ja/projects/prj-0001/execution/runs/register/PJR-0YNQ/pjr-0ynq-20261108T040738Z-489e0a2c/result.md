---
specdojo:
  id: prj-0001:xer-pjr-0ynq-20261108t040738z-489e0a2c
  type: exec-result
  task_id: PJR-0YNQ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-0YNQ/pjr-0ynq-20261108T040738Z-489e0a2c/plan.md
  started_at: "2026-11-08T04:07:46.547Z"
  completed_at: "2026-11-08T04:32:52.530Z"
  agent: flash-high-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:uis-rulebook
---

# Edit Result

## 1. 実施内容

- 画面仕様（`uis`）の型を、CLI コマンド群を扱う実態に合わせて手入れしました。
- `uis-rulebook` において、引数やオプションの表を直接持たず、コマンドリファレンスを参照する形式と、操作の流れ・表示項目の要点・エラー表示および「利用者の次の手」を記述する構成を規定しました。
- 新しい規則に従って、`uis-sample` を更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/uis-rulebook.md`: `uis` 型の執筆規則を更新しました。CLI コマンド群を扱う場合、引数・オプションの表は持たずコマンドリファレンスを参照し、代わりに「操作の流れ」「表示項目の要点」「エラー表示と利用者の次の手」を記述することを定めています。
- `docs/ja/specdojo/samples/uis-sample.md`: 新しい `uis` の規則に基づき、販売業務 CLI の完成サンプルとして内容を整備しました。

## 3. 申し送り

- schema 変更の要否: 画面仕様（`uis`）は Markdown 文書形式（`target_format: markdown`）であり、docs/specdojo/schemas/v1/ 配下に専用 YAML/JSON スキーマや本文スキーマは存在せず、Frontmatter も共通の `deliverable-frontmatter.schema.yaml`（`type: ui`）および `rulebook-frontmatter.schema.yaml` で検証されるため、schema 変更は不要（変更なし）と判断しました。既存文書の後方互換性にも影響はありません。
- 規則と sample の書き方で決めた内容と理由（PJR-RMMM 向けの判断材料）: 1) `recipe` と `template` の要否: rulebook と sample の2点で十分に統制可能なため `recipe: not-needed`、`template: not-needed` と決定。2) CLI コマンド群画面仕様における章構成: GUI 画面仕様と CLI コマンド群画面仕様で別文書種別・別 rulebook に分割せず、同一の `uis` 型の中で「操作の流れ」および「エラー表示と利用者の次の手」を必須見出しとして共通化し、操作の表内でコマンドリファレンスを参照する形式としました。3) エラー表示における「利用者の次の手」の必須化: 単なるエラーメッセージ例示にとどまらず、状況打開・業務継続のために「利用者が次に取るべき具体的な回復アクション」を表の必須列として規定しました。
- CHANGELOG に書く事項: 区分: 変更。行の文案: 画面仕様（`uis`）の型を見直し、CLI コマンド群を画面に見立てる場合に引数・オプションの表を持たずコマンドリファレンスを参照する規則と、操作の流れ・表示要点・利用者の次の手を書く構成に改定（`specdojo:uis-rulebook`, `specdojo:uis-sample`）
- 次のアクション: 型の確定（`[[prj-0001:pjr-rmmm-uis-kata-confirm]]`）で人間の確認・判断を実施後、プロダクト側の後続タスクで新規則に基づいた画面仕様成果物の整備を反映します。
- schema 変更の要否: 画面仕様（uis）は Markdown 文書形式（`target_format: markdown`）であり、docs/specdojo/schemas/v1/ 配下に専用 YAML/JSON スキーマや本文スキーマは存在せず、Frontmatter も共通の deliverable-frontmatter.schema.yaml（`type: ui`）および rulebook-frontmatter.schema.yaml で検証されるため、schema 変更は不要（変更なし）と判断しました。既存文書の後方互換性にも影響はありません。
- CHANGELOG に書く事項: 区分: 変更。行の文案: 画面仕様（uis）の型を見直し、CLI コマンド群を画面に見立てる場合に引数・オプションの表を持たずコマンドリファレンスを参照する規則と、操作の流れ・表示要点・利用者の次の手を書く構成に改定（`specdojo:uis-rulebook`, `specdojo:uis-sample`）
- 次のアクション: 型の確定（[[prj-0001:pjr-rmmm-uis-kata-confirm]]）で人間の確認・判断を実施後、プロダクト側の後続タスクで新規則に基づいた画面仕様成果物の整備を反映します。
- 適用外の検証: `npm run validate:catalog`（成果物の変更が docs/ja/projects/ 配下の deliverable に及ばないため）

## 4. 進め方と実践の型の適用

画面仕様の型（`uis`）を、CLI コマンド群を扱う実態に即した形へ再定義しました。具体的には、引数やオプションの詳細はコマンドリファレンスへ委ね、画面仕様書には「操作の流れ」「表示項目の要点」「エラー発生時の具体的な次のアクション」を記述することを必須とするよう `uis-rulebook` を改訂し、それに基づいた `uis-sample` を作成しました。
