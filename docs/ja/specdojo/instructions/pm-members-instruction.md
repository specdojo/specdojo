---
id: pm-members-instruction
type: instruction
status: draft
rulebook: pm-members-rulebook
---

# プロジェクトメンバー定義 作成指示

## 1. 目的と前提

- 目的: `specdojo exec --by <nickname>` で指定できる実行主体（人間または agent）を machine-readable な YAML として管理し、Schedule の `owner`（Role code）と実行主体（nickname）を分離する。
- 参照ルール: `../rulebooks/pm-members-rulebook.md`
- 主な内容: member 一覧（`nickname`・`display_name`・`role`・`type`・`persona`・`focus`・`scheduler_strategy`・`note`）。
- 採用ロール・未採用ロールの定義は `pm-organization.md` を参照し、本ファイルには含めない。
- `members[].role` には `pm-roles.yaml` または `pm-organization.md` で採用済みの Role code のみを使う。

## 2. 入力情報

- プロジェクトに参加する人間メンバーおよび agent の一覧
- 各 member の実行主体としての情報（`nickname`・`display_name`・`role`・`type`・`note`）
- agent の実行姿勢（`persona`・`focus`・`scheduler_strategy`）
- `pm-organization.md` の採用ロール一覧（`members[].role` の検証に使用）
- プロジェクト ID

## 3. 出力フォーマット

- 出力形式は YAML（`pm-members.yaml`）。
- ファイル先頭に `version`、`project_id`、`document` ブロックを置く。

```yaml
version: 1
project_id: <project-id>
document:
  id: <project-id>-pm-members
  type: project
  status: draft
  based_on:
    - people-and-organization-definition-standard
    - <project-id>:pm-organization
```

- `members` には各実行主体を次の構造で記載する。

```yaml
members:
  - nickname: <stable-id>
    display_name: <表示名>
    email: null
    role: <Role code または null>
    type: human | agent
    persona: <kebab-case ラベル（任意）>
    focus:
      - <観点（任意）>
    scheduler_strategy: critical-first | dependency-first | fifo | manual
    note: <補足（任意）>
```

## 4. 記述ルール

- `members[].nickname` は CLI・実行ログ・イベント履歴で参照されるため、英小文字・数字・ハイフン・アンダースコアのみで構成し、短く安定した値にする（例: `po`, `ba-agent`）。一度実行ログに記録した `nickname` は変更しない。
- `members[].role` には `pm-organization.md` で採用済みの Role code を記載する。特定 Role に固定しない汎用 agent は `role: null` とする。
- `members[].type` は人間の実行主体には `human`、自動化または生成 AI 支援主体には `agent` を使う。
- `members[].persona` はプロジェクトでの実行姿勢を表す短い kebab-case ラベルにする（例: `risk-averse-reviewer`, `spec-navigator`）。
- `members[].scheduler_strategy` はプロジェクトで使う戦略語彙（`critical-first`, `dependency-first`, `fifo`, `manual`）に限定する。
- 公開文書では個人名・私用メールアドレス・非公開組織情報を記載しない。不要または非公開の場合は `null` にする。
- `roles` ブロックや `rules` ブロックは含めない。採用ロールの定義は `pm-organization.md` を参照する。

## 5. 禁止事項

- `members[].role` に `pm-organization.md` で未採用の Role code を使う。
- `owner` フィールドを member 側で使う（Schedule の `owner` は Role code であり member 定義とは別）。
- Schedule の `owner` に `nickname`・人名・agent 名を書く。
- agent に最終承認・公開可否判断・説明責任を割り当てる。
- 実行ログ記録後に `nickname` を変更する。
- 公開文書に不要な個人名・私用メールアドレス・非公開組織情報を含める。
- ファイル内に `roles.adopted` / `roles.not_adopted` ブロックを設ける（`pm-organization.md` と二重管理を招く）。

## 6. 最終チェック

- 全 member に `nickname`・`display_name`・`type` が設定されている。
- `members[].role` がある場合、すべて採用済み Role code である。
- `members[].nickname` が英小文字・数字・ハイフン・アンダースコアのみで構成されている。
- `roles` ブロックや `rules` ブロックが含まれていない。
- 公開文書として問題のある個人情報が含まれていない。
- YAML 構文エラーがない。
