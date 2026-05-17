---
id: pm-members-instruction
type: instruction
status: draft
rulebook: pm-members-rulebook
---

# プロジェクトメンバー定義 作成指示

## 1. 目的と前提

- 生成対象は `pm-members.yaml` とする。
- 目的は、`specdojo exec --by <nickname>` で指定できる実行主体を machine-readable な YAML として管理し、Schedule の `owner` で使う Role code と実行主体の `nickname` を分離することとする。
- 参照ルールは [pm-members-rulebook.md](../rulebooks/pm-members-rulebook.md) とし、Role、Member、Task owner、Executor の共通定義は `people-and-organization-definition-standard` を正として扱う。
- Member は人間または agent を表し、責務・判断権限を表す Role とは分けて記述する。
- `members[].roles` には `pm-roles.yaml` に存在する Role code だけを記載する。特定 Role に固定しない汎用 agent は `roles: []` としてよい。
- 対象外は、Schedule の `owner` 設定、Role code の語彙定義、ロール採用の設計根拠、RACI の責任分担とする。
- 公開文書として扱い、個人名、私用メールアドレス、非公開組織情報は記載しない。

## 2. 入力情報

- プロジェクト ID。
- `pm-roles.yaml` に記載された Role code 一覧。`members[].roles` の検証に使用する。
- 実行主体として登録する人間メンバーおよび agent の一覧。
- 各 member の `nickname`、`display_name`、`type`、対応できる Role code、公開可能な連絡先。
- agent または member ごとの実行姿勢を補足する `persona`、`focus`、`scheduler_strategy`。
- `owner`、`roles`、`--by` の使い分けに関するプロジェクト運用ルール。
- 未確定事項は `_TODO_:`, `_UNDECIDED_:`, `_ASSUMPTION_:` のいずれかで明示する。

## 3. 出力フォーマット

- 出力形式は YAML とし、ファイル名は `pm-members.yaml` を基本とする。
- ファイル先頭に `version`、`project_id`、`document`、`members` を置く。必要に応じて `rules` を追加してよい。
- YAML 成果物のため Markdown Frontmatter は使わず、先頭メタ項目として記述する。

```yaml
version: 1
project_id: <project-id>
document:
  id: <project-id>:pm-members
  type: project
  status: draft
  rulebook: pm-members-rulebook
  based_on:
    - people-and-organization-definition-standard
    - <project-id>:pm-roles
```

- `members` には各実行主体を次の構造で記載する。

```yaml
members:
  - nickname: <stable-id>
    display_name: <表示名>
    email: null
    roles:
      - <Role code>
    type: human | agent
    persona: <kebab-case ラベル（任意）>
    focus:
      - <観点（任意）>
    scheduler_strategy: critical-first | dependency-first | fifo | manual
    note: <補足（任意）>
```

- `rules` を置く場合は、この member 定義を使う際の運用ルールを検証可能な文で列挙する。

## 4. 記述ルール

- `members[].nickname` は CLI、実行ログ、イベント履歴で参照される安定識別子とし、英小文字、数字、ハイフン、アンダースコアのみで構成する。実行ログ記録後の `nickname` は変更しない。
- `members[].display_name` は表示名として使う。公開文書では個人名を避け、役割名や公開可能な呼称にしてよい。
- `members[].email` は公開可能な連絡先だけを書く。非公開または不要な場合は `null` とする。
- `members[].roles` には、`pm-roles.yaml` に存在する Role code のみを配列で記載する。兼務の場合は複数の Role code を列挙する。
- 特定 Role に固定しない汎用 agent は `roles: []` とする。その member を実行に使う場合は、実行時の文脈またはタスク owner で対象 Role を明示する。
- `members[].type` は人間の実行主体には `human`、自動化または生成 AI 支援主体には `agent` を使う。
- agent は草案作成、レビュー支援、整合性確認、機械的更新を支援できる。最終承認、公開可否判断、説明責任は人間に残す。
- `members[].persona` は実行姿勢を表す短い kebab-case のラベルにする。例: `risk-averse-reviewer`
- `members[].focus` は重視する観点を配列で列挙する。
- `members[].scheduler_strategy` は実行順序の既定方針に限定し、プロジェクトで使う語彙に絞る。例: `critical-first`, `dependency-first`, `fifo`, `manual`
- `rules` には `owner`、`roles`、`--by` の使い分けと、公開文書で扱わない個人情報や非公開組織情報の方針を含める。
- 章への参照は章番号ではなく章タイトルで記載する。

## 5. 禁止事項

- member 側で `owner` フィールドを使わない。
- Schedule の `owner` に `nickname`、人名、agent 名を書かない。
- `members[].roles` に `pm-roles.yaml` で未定義の Role code を書かない。
- `members[].role` のような単数フィールドで対応 Role code を管理しない。
- agent に最終承認、公開可否判断、説明責任を割り当てない。
- 公開文書に不要な個人名、私用メールアドレス、非公開組織情報を書かない。
- 実行ログ記録後に `nickname` を変更しない。

## 6. 最終チェック

- `version`、`project_id`、`document`、`members` がある。
- `document.id` が `<project-id>:pm-members` 形式である。
- `document.type` が `project`、`document.status` が `draft` / `ready` / `deprecated` のいずれかである。
- 全 member に `nickname`、`display_name`、`type` が設定されている。
- `members[].roles` が配列であり、値がすべて `pm-roles.yaml` に存在する Role code である。
- `owner` フィールドや `members[].role` が含まれていない。
- agent に最終承認、公開可否判断、説明責任が割り当てられていない。
- 公開文書として扱えない個人情報や非公開組織情報が含まれていない。
- YAML 構文エラーがない。
