---
specdojo:
  id: prj-0001:xer-pjr-x3t8-20261108t072426z-7758fcd2
  type: exec-result
  task_id: PJR-X3T8
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-X3T8/pjr-x3t8-20261108T072426Z-7758fcd2/plan.md
  started_at: "2026-11-08T07:24:36.593Z"
  completed_at: "2026-11-08T07:42:54.747Z"
  agent: flash-high-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:uis-rulebook
---

# Edit Result

## 1. 実施内容

- 画面仕様（`uis`）の型を GUI の画面仕様専用に純化しました。
- `uis-rulebook` において、CLI 向けの記述（コマンドの流れ等）を削除し、GUI 画面仕様に特化した 8 章構成（概要、対象ユーザー/利用目的、表示項目、操作、遷移、バリデーション、エラー表示と利用者の次の手、メモ / 将来課題）へと再編しました。
- `uis-rulebook` 内の「8. サンプル」の章を削除し、完成例を `uis-sample`（販売管理システムのレジ画面）として外出ししました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/uis-rulebook.md`: GUI 画面仕様に特化させるため、CLI 向けの記述を削除し、章構成を再編して「8. サンプル」の章を削除しました。
- `docs/ja/specdojo/samples/uis-sample.md`: `uis-rulebook` から削除された「サンプル」の章の代わりとして、GUI 画面仕様の完成例（販売管理システムのレジ画面）を記述しました。

## 3. 申し送り

- schema 変更の要否: 画面仕様（`uis`）は Markdown 文書形式（`target_format: markdown`）であり、`docs/specdojo/schemas/v1/` 配下に専用 YAML/JSON スキーマや本文スキーマは存在せず、Frontmatter も共通の `deliverable-frontmatter.schema.yaml`（`type: ui`）および `rulebook-frontmatter.schema.yaml` に適合するため、スキーマ変更および後方互換性への影響はありません。
- 規則と sample の書き方で executor が決めた内容と理由: 1. 本文構成における「操作の流れ」の見直し: 1ファイル=1画面の GUI 画面仕様において「操作の流れ」は「操作」「遷移」と重複し「クリック手順の逐語列挙」を招く恐れがあるため見出し要件から除外し、基本の8章構成（概要、対象ユーザー/利用目的、表示項目、操作、遷移、バリデーション、エラー表示と利用者の次の手、メモ / 将来課題）に整理しました。2. 「エラー表示と利用者の次の手」の維持: 障害時の回復行動を具体化するため GUI でも必須として維持しました。3. サンプル題材: 販売管理システムの「販売登録画面（レジ端末画面）」とし、GUI 画面仕様に必要な全要素を網羅しました。
- CHANGELOG に書く事項: 区分: 変更。行の文案: 画面仕様（`uis`）の型から CLI 向けの記述を除外して GUI 画面仕様のみの規則に純化し、サンプルの章を削除して完成例を `uis-sample` に外出し（`specdojo:uis-rulebook`, `specdojo:uis-sample`）
- 次のアクション: 後続タスク（[[prj-0001:pjr-pjyj-clis-uis-kata-confirm]]）にて、`uis` / `clis` の型の確定と、カタログにおける代表成果物の位置づけ確認を行います。
- schema 変更の要否: 画面仕様（uis）は Markdown 文書形式（`target_format: markdown`）であり、`docs/specdojo/schemas/v1/` 配下に専用 YAML/JSON スキーマや本文スキーマは存在せず、Frontmatter も共通の `deliverable-frontmatter.schema.yaml`（`type: ui`）および `rulebook-frontmatter.schema.yaml` に適合するため、スキーマ変更および後方互換性への影響はありません。
- CHANGELOG に書く事項: 区分: 変更。行の文案: 画面仕様（uis）の型から CLI 向けの記述を除外して GUI 画面仕様のみの規則に純化し、サンプルの章を削除して完成例を uis-sample に外出し（`specdojo:uis-rulebook`, `specdojo:uis-sample`）
- 次のアクション: 後続タスク（[[prj-0001:pjr-pjyj-clis-uis-kata-confirm]]）にて、uis / clis の型の確定と、カタログにおける代表成果物の位置づけ確認を行います。
- 適用外の検証: `npm run validate:catalog`（成果物の変更が docs/ja/projects/ 配下の deliverable に及ばないため）

## 4. 進め方と実践の型の適用

`uis-rulebook` を読み込み、現在の章構成と「CLI 向け」の記述を特定しました。これに基づき、GUI 画面仕様に特化した構成への変更（「操作の流れ」の削除と、8 つの必須章への整理）および、サンプル章の削除と `uis-sample` への移行を実施しました。
