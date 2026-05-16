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

- `pm-organization.md` には、対象プロジェクトで必要な採用ロール、未採用ロール、使用可能な `owner`、見直し条件だけを記載する。
- 採用ロール一覧は `pm-roles.yaml` として machine-readable な形式でも管理する（`pm-organization.md` の採用判断を YAML で表現したもの）。
- 標準ロールの一般的な責務、`owner` / `role` / `--by` の共通定義、Agent 委任の共通方針は `people-and-organization-definition-standard` を参照し、本文に再掲しない。
- プロジェクト固有の判断は、採用/未採用の理由と代替方針が判定できる粒度で記載する。
- プロジェクト規模に応じて、`people-and-organization-definition-standard` の規模別採用パターンと整合するように記述内容を調整する。
- 小規模運用では最小構成を優先し、意思決定責任やエスカレーションの詳細表は必要になった時点で追加する。
- 公開文書では個人名、私用メールアドレス、非公開組織情報を記載しない。

## 2. 位置づけと用語定義

`pm-organization.md` は、プロジェクトにおける Role 採用方針の文書である。

| ドキュメント | 役割 |
| ------------ | ---- |
| `people-and-organization-definition-standard.md` | Role、Member、Task owner、Executor、RACI の全体ルールを定義する |
| `pm-organization.md` | プロジェクト固有の採用ロール、未採用ロール、使用可能な `owner` を定義する |
| `pm-roles.yaml` | 採用した Role code を machine-readable な YAML として一覧化する |
| `pm-members.yaml` | 実際に作業する人間または agent と Role code の対応を定義する |
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
| `supersedes` | 置き換え対象の旧文書 ID 配列 | 任意 |

## 5. 本文構成（標準テンプレ）

| 番号 | 見出し | 必須 | 内容 |
| ---- | ------ | ---- | ---- |
| 1 | 基本方針 | ○ | プロジェクト規模、`owner` の使用範囲、最終判断の集約先 |
| 2 | 採用ロール | ○ | 採用する Role code、正式名称、プロジェクトでの扱い |
| 3 | 未採用ロール | ○ | 未採用の Role code、未採用理由、代替方針 |
| 4 | 本プロジェクトで使用できる `owner` | ○ | Schedule の `owner` に使える Role code 一覧 |
| 5 | 関連ドキュメント | ○ | `pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md`、標準への参照 |
| 6 | 見直し条件 | ○ | ロール採用を見直すトリガーと見直し内容 |
| 7 | 禁止事項 | ○ | プロジェクト固有の禁止事項 |

## 6. 記述ガイド

### 6.1. 基本方針

- プロジェクト規模を明示する。例: 個人・小規模運用、複数人運用、外部関係者あり。
- 規模の判断は `people-and-organization-definition-standard` の規模別採用パターンを参照し、小規模・中規模・大規模に応じて採用ロール、RACI、意思決定責任、見直し条件の記述粒度を調整する。
- Schedule の `owner` に採用ロールだけを使う方針を記載する。
- 最終判断の集約先を記載する。小規模運用では `PO` に集約してよい。
- `owner` / `role` / `--by` の詳細な説明は標準へ参照し、本文に比較表を再掲しない。

### 6.2. 採用ロール

- 採用する Role code だけを表にする。
- 正式名称と、本プロジェクトでの扱いを 1 行で記載する。
- 標準的な主な責務を長く再掲しない。プロジェクト固有に強調する責務だけを書く。

推奨表:

| Role code | 正式名称 | 本プロジェクトでの扱い |
| --------- | -------- | ---------------------- |

### 6.3. 未採用ロール

- 標準ロールのうち採用しない Role code を表にする。
- 未採用理由と、誰が兼務するか、またはどの条件で追加するかを記載する。
- 未採用ロールは Schedule の `owner` に使用しないことが分かるようにする。

推奨表:

| Role code | 正式名称 | 未採用理由・代替方針 |
| --------- | -------- | -------------------- |

### 6.4. 本プロジェクトで使用できる `owner`

- Schedule の `owner` に使える Role code を箇条書きで列挙する。
- 未採用ロールを `owner` として使わないことを明記する。
- `owner` の概念説明や `--by` との違いは標準へ参照する。

### 6.5. 関連ドキュメント

- `pm-roles.yaml`、`pm-members.yaml`、`pm-raci.md`、`people-and-organization-definition-standard.md` への導線を置く。
- 関連ドキュメントの本文を要約しすぎず、役割を 1 行で示す。

### 6.6. 見直し条件

- 採用ロールを見直すトリガーだけを書く。
- 共通の見直しトリガーは標準に任せ、プロジェクトで特に起きそうなものに絞る。

推奨表:

| 更新トリガー | 見直し内容 |
| ------------ | ---------- |

### 6.7. 禁止事項

- プロジェクト固有の禁止事項を箇条書きで記載する。
- 共通禁止事項は標準へ参照し、同じ一覧を再掲しない。
- 未採用ロールを `owner` に使わない、agent に最終判断を委ねない、個人名を `owner` に使わない、の 3 点は最低限含める。

## 7. 禁止事項

| 禁止事項 | 理由 |
| -------- | ---- |
| 標準ロールの一般的な責務を `pm-organization.md` に長く再掲する | 標準との二重管理になるため |
| `owner` / `role` / `--by` の共通定義表を `pm-organization.md` に再掲する | 定義変更時に不整合が起きるため |
| `pm-members.yaml` の具体的な member 一覧を `pm-organization.md` に複製する | 実行主体の正本が分散するため |
| プロジェクト固有でない Agent 委任方針や RACI 定義を再掲する | 全体ルールと重複するため |
| 未採用ロールを Schedule の `owner` に使う余地を残す | 実行管理で参照不整合が起きるため |

## 8. サンプル

- 参照: `../samples/pm-organization-sample.md`

## 9. 生成 AI への指示テンプレート

- 参照: `../instructions/pm-organization-instruction.md`
