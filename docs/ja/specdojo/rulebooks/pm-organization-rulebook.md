---
id: pm-organization-rulebook
type: rulebook
status: draft
target_format: markdown
based_on:
  - people-and-organization-definition-standard
---

# 組織定義 作成ルール

Organization Definition Documentation Rulebook

本ドキュメントは、プロジェクト固有の組織定義である `pm-organization.md` を作成・更新するためのルールを定義する。Role、Member、Task owner、Executor、RACI の共通定義は `people-and-organization-definition-standard` を正とし、本ルールでは `pm-organization.md` に何を残すかを定める。

## 1. 全体方針

- `pm-organization.md` には、ロール・メンバー構成の設計根拠と方針を記載する。ロールの列挙は `pm-roles.yaml` に、兼務の割り当ては `pm-members.yaml` に委ね、重複して記載しない。
- 標準ロールの一般的な責務、`owner` / `roles` / `--by` の共通定義、Agent 委任の共通方針は `people-and-organization-definition-standard` を参照し、本文に再掲しない。
- プロジェクト固有の判断は、なぜその構成にしたか・いつ見直すかが判定できる粒度で記載する。
- プロジェクト規模に応じて、`people-and-organization-definition-standard` の規模別採用パターンと整合するように記述内容を調整する。
- 公開文書では個人名、私用メールアドレス、非公開組織情報を記載しない。

## 2. 位置づけと用語定義

`pm-organization.md` は、プロジェクトにおける組織設計の方針・根拠文書である。

| ドキュメント | 役割 |
| ------------ | ---- |
| `people-and-organization-definition-standard.md` | Role、Member、Task owner、Executor、RACI の全体ルールを定義する |
| `pm-organization.md` | ロール・メンバー構成の方針と設計根拠を記述する |
| `pm-roles.yaml` | プロジェクトで使用する全 Role code を machine-readable な YAML として一覧化する |
| `pm-members.yaml` | 実際に作業する人間または agent と担当 Role code の対応を定義する |
| `pm-raci.md` | 必要時に成果物・プロセスごとの責任分担を定義する |

用語定義は `people-and-organization-definition-standard` を参照する。`pm-organization.md` 側では、プロジェクト固有の意味を追加する場合だけ補足する。

## 3. ファイル命名・ID規則

- 推奨パス: `docs/ja/projects/<project-id>/030-project-management/020-organization/pm-organization.md`
- 推奨ファイル名: `pm-organization.md`
- 推奨 ID: `<project-id>:pm-organization`
- `rulebook` は `pm-organization-rulebook` を指定する。
- `based_on` には `people-and-organization-definition-standard` を含める。

## 4. 推奨 Frontmatter 項目

| 項目 | 説明 | 必須 |
| ---- | ---- | ---- |
| `id` | `<project-id>:pm-organization` | ○ |
| `type` | `project` | ○ |
| `status` | `draft` / `ready` / `deprecated` | ○ |
| `rulebook` | `pm-organization-rulebook` | ○ |
| `based_on` | 参照した標準・方針の ID 配列 | 任意 |

## 5. 本文構成（標準テンプレ）

| 番号 | 見出し | 必須 | 内容 |
| ---- | ------ | ---- | ---- |
| 1 | 基本方針 | ○ | プロジェクト規模・兼務構成の設計根拠・最終判断の集約先 |
| 2 | 関連ドキュメント | ○ | `pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md`、標準への参照 |
| 3 | 見直し条件 | ○ | ロール・メンバー構成を見直すトリガーと見直し内容 |
| 4 | 禁止事項 | ○ | プロジェクト固有の禁止事項 |

## 6. 記述ガイド

### 6.1. 基本方針

- プロジェクト規模を明示する。例: 個人・小規模運用、複数人運用、外部関係者あり。
- 規模の判断は `people-and-organization-definition-standard` の規模別採用パターンを参照し、採用ロールと兼務構成の選択根拠を記載する。
- `pm-roles.yaml` と `pm-members.yaml` が何を管理するかを 1 行ずつ示し、`pm-organization.md` がその設計根拠であることを明示する。
- 兼務構成の概要（誰が何を兼務するか）を記載する。詳細は `pm-members.yaml` に委ねる。
- 最終判断の集約先を記載する。小規模運用では `po`（human）に集約してよい。

### 6.2. 関連ドキュメント

- `pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md`、`people-and-organization-definition-standard.md` への導線を置く。
- 関連ドキュメントの本文を要約しすぎず、役割を 1 行で示す。

推奨表:

| ドキュメント | 役割 |
| ------------ | ---- |

### 6.3. 見直し条件

- ロール・メンバー構成を見直すトリガーだけを書く。
- 共通の見直しトリガーは標準に任せ、プロジェクトで特に起きそうなものに絞る。

推奨表:

| 更新トリガー | 見直し内容 |
| ------------ | ---------- |

### 6.4. 禁止事項

- プロジェクト固有の禁止事項を箇条書きで記載する。
- 共通禁止事項は標準へ参照し、同じ一覧を再掲しない。
- agent に最終判断を委ねない、個人名を `owner` に使わない、`pm-roles.yaml` 未掲載の Role code を `owner` に使わない、の 3 点は最低限含める。

## 7. 禁止事項

| 禁止事項 | 理由 |
| -------- | ---- |
| 全ロール一覧を `pm-organization.md` に記載する | `pm-roles.yaml` が SSOT であり重複管理になるため |
| 兼務の具体的な割り当てを `pm-organization.md` に記載する | `pm-members.yaml` の `roles` フィールドが SSOT であり重複管理になるため |
| `owner` / `roles` / `--by` の共通定義表を `pm-organization.md` に再掲する | 定義変更時に不整合が起きるため |
| `pm-members.yaml` の具体的な member 一覧を `pm-organization.md` に複製する | 実行主体の正本が分散するため |
| プロジェクト固有でない Agent 委任方針や RACI 定義を再掲する | 全体ルールと重複するため |

## 8. サンプル

- 参照: `../samples/pm-organization-sample.md`

## 9. 生成 AI への指示テンプレート

- 参照: `../instructions/pm-organization-instruction.md`
