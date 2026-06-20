---
id: dct-rulebook
type: rulebook
status: draft
target_format: yaml
---

# 成果物カタログ（ドメイン別）作成ルール

Deliverables Catalog (Domain) Documentation Rulebook

本ドキュメントは、ドメイン別成果物カタログ（`dct-<domain>.yaml`）を統一構造で作成・更新するためのルールを定義する。
各ドメインが管理する成果物の `local_id`・`kind`・`depends_on`・配置先・`done_criteria` を machine-readable な YAML として一覧化し、スケジュール展開・レビュー計画生成・トレーサビリティの基礎とする。
構造の詳細仕様は `docs/specdojo/schemas/v1/dct.schema.yaml` を SSOT とし、本ルールはその運用方針を補う。

## 1. 全体方針

- `dct-<domain>.yaml` は、特定ドメインに属する成果物の machine-readable な台帳として機能する。
- 個別成果物の本文内容は各成果物ファイルを正とし、カタログはメタ情報（ID・種別・依存・配置先・概要・完了条件）の管理に専念する。
- 成果物の漏れ・重複・所在不明を防ぐため、プロジェクト内で発生するすべての成果物をいずれかのドメインカタログに記載する。
- `kind`（`work` / `control` / `generated`）を明示し、スケジュール展開対象（`work`）を他と区別する。
- 構造・必須キー・型制約は `dct.schema.yaml` に従う。本ルールでスキーマ定義を再掲・上書きしない。
- `dct-index` の「共通ルール」を SSOT として参照し、重複定義を避ける。

## 2. 位置づけと用語定義

`dct-<domain>.yaml` と関連ドキュメントの関係を示す。

```mermaid
flowchart LR
  DCT_IDX["dct-index<br>成果物カタログ索引"]
  DCT_DOM["dct-&lt;domain&gt;.yaml<br>ドメイン別成果物カタログ"]
  ART["成果物本体<br>&lt;local_id&gt;.md 等"]

  DCT_IDX --> DCT_DOM --> ART

  classDef target stroke-width:4px
  class DCT_DOM target
```

| 用語       | 定義                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------ |
| `group`    | カタログ内の章に対応する区分。`deliverables` を持つ葉グループと、子 `groups` を持つ親グループがある |
| `local_id` | 成果物の論理名。プロジェクト内で一意とし、`depends_on` の参照キーとして使う                 |
| `kind`     | 成果物の種別。`work` / `control` / `generated` の3値                                        |
| `base_path` | グループまたはドメインの配置先ディレクトリ。先頭スラッシュの有無で解決方法が変わる         |

- `dct-index` の索引エントリから各 `dct-<domain>.yaml` へ参照される。
- 成果物本体（`<local_id>.md` 等）への参照は、`base_path` と各成果物の `path` から解決する。

## 3. ファイル命名・ID規則

### 3.1. ファイル命名規約

- ファイル名は `dct-<domain>.yaml` とする（例: `dct-project-definition.yaml`、`dct-project-management.yaml`）。
- `<domain>` は `domain` キーの値と一致させる。
- テンプレートは `dct-<domain>-template.yaml` とし、`type: template` で記述する。

### 3.2. ID・識別子規約

- ドキュメントの `id` は、`type: project` では `<project-id>:dct-<domain>` 形式とする（例: `prj-0001:dct-project-definition`）。テンプレートでは `dct-<domain>-template` 形式とする。
- `domain` は英小文字・数字・ハイフン（kebab-case）で、先頭は英小文字または数字、最大 63 文字とする。
- `project_id` は `prj-` + 4 桁以上の数字とし、`type: project` では必須とする。配置先プロジェクト ID と一致させる。
- 各成果物の `local_id` は、`type: project` では英小文字・数字・ハイフンのみとし、プロジェクト内で一意にする。
- 反復作成する成果物は、成果物ファミリーを表す固定 `local_id` と、実体IDの命名規則を表す `instance_id_pattern` を分離する。

## 4. 推奨メタ項目

YAML 成果物のため、Markdown Frontmatter ではなくファイル先頭のトップレベルキーとして記載する。

| キー         | 説明                                                                  | 必須             |
| ------------ | --------------------------------------------------------------------- | ---------------- |
| `id`         | 成果物 ID（例: `prj-0001:dct-project-definition`）                    | ○                |
| `type`       | `project` / `template` のいずれか                                     | ○                |
| `status`     | `draft` / `ready` / `deprecated`                                      | ○                |
| `part_of`    | 親となる `dct-index` の `id`（配列形式）                              | 任意             |
| `project_id` | プロジェクト ID（例: `prj-0001`）                                     | ○（`project`）   |
| `domain`     | ドメイン識別子。ファイル名 `dct-<domain>.yaml` と一致させる           | ○                |
| `base_path`  | ドメインの既定ディレクトリ。リポジトリルートからの絶対パスで記載する  | 任意             |

## 5. 本文構成（標準テンプレ）

### 5.1. ルート構造

`dct-<domain>.yaml` は次のルート構造を標準とする。

| キー         | 必須             | 内容                                       |
| ------------ | ---------------- | ------------------------------------------ |
| `id`         | ○                | 成果物 ID                                  |
| `type`       | ○                | `project` / `template`                     |
| `status`     | ○                | 状態                                       |
| `part_of`    | 任意             | 親 `dct-index` の `id` 配列                |
| `project_id` | ○（`project`）   | プロジェクト ID                            |
| `domain`     | ○                | ドメイン識別子                             |
| `base_path`  | 任意             | ドメインの既定ディレクトリ                 |
| `groups`     | ○                | グループ（章）の配列                       |

### 5.2. `groups[]`（グループ）

各グループは Markdown カタログの章に対応する。葉グループは `deliverables` を、親グループは子 `groups` を持つ（どちらか一方が必須）。

| フィールド     | 必須 | 内容                                                             |
| -------------- | ---- | --------------------------------------------------------------- |
| `name`         | 任意 | 章タイトル（例: `管理計画`、`組織体制`）                        |
| `base_path`    | 任意 | グループの配置先ディレクトリ                                    |
| `note`         | 任意 | グループへの補足（例: `WBSへの落とし込み対象外`）              |
| `groups`       | 任意 | 子グループの配列（入れ子。親グループで使用）                    |
| `deliverables` | 任意 | 成果物エントリの配列（葉グループで使用）                        |

### 5.3. `deliverables[]`（成果物エントリ）

| フィールド            | 必須             | 内容                                                       |
| --------------------- | ---------------- | ---------------------------------------------------------- |
| `local_id`            | ○                | 成果物の論理名（例: `prj-overview`）                       |
| `instance_id_pattern` | 任意             | 反復成果物の実体ID規則（例: `pjr-{sequence}-{term}`）      |
| `name`                | ○                | 業務ユーザーが理解可能な日本語名                           |
| `kind`                | ○                | `work` / `control` / `generated`                          |
| `depends_on`          | 任意             | 依存する成果物の `local_id` 配列。なければ空配列 `[]`     |
| `overview`            | ○                | 成果物の目的を1文で記述                                    |
| `path`                | ○（`work`）      | 成果物のファイルパス                                       |
| `rulebook`            | 任意             | 成果物の rulebook ID（例: `prj-overview-rulebook`）       |
| `done_criteria`       | ○（`work`）      | 完了条件の配列                                             |
| `note`                | 任意             | 構造化フィールドで表せない補足                             |

### 5.4. `done_criteria[]`（完了条件）

| フィールド  | 必須 | 内容                                                                 |
| ----------- | ---- | -------------------------------------------------------------------- |
| `text`      | ○    | 成果物が満たすべき検証可能な条件                                     |
| `roles`     | ○    | 条件を確認するロールコード配列（`PO` / `PM` / `BA` / `ARC` / `DEV` / `QE` / `UX` / `OPS`） |
| `viewpoint` | ○    | 主たるレビュー観点 ID（`vp-*`。`pm-review-viewpoints.yaml` で定義）  |

## 6. 記述ガイド

### 6.1. グループ構成

- サブドメインに分かれない場合は、単一の葉グループに `deliverables` を並べる（平坦型）。
- サブドメインが2つ以上に分かれる場合は、親グループの `groups` 配下に子グループを並べ、各子グループに `name`・`base_path`・`deliverables` を記載する（章分割型）。
- 親グループは `deliverables` を直接持たず、子 `groups` で表現する。

### 6.2. `kind`（種別）

- `work`: スケジュール展開対象。成果物を実際に作成する作業に対応する。`path` と `done_criteria` が必須。
- `control`: プロジェクト管理・統制文書。スケジュール展開対象外。
- `generated`: 自動生成・派生成果物。スケジュール展開対象外。
- 3値以外に拡張しない。

### 6.3. `depends_on`

- 直接依存する成果物の `local_id` を配列で記載する。依存がない場合は空配列 `[]` とする。
- 参照先は同一カタログまたは他ドメインカタログに存在する `local_id` とし、ファイルパスや URL を混在させない。
- 反復成果物を参照する場合は、`instance_id_pattern` ではなく固定の `local_id` を参照する。

### 6.4. `base_path` と `path` の解決

- 先頭が `/` のパスはリポジトリルートからの絶対パスとして解決する。
- 先頭が `/` でないパスは相対パスとし、最も近い祖先（グループまたはドメイン）の解決済み `base_path` に連結する。
- ドメインの `base_path` は絶対パス（先頭 `/`）で記載することを推奨する。
- 解決結果はリポジトリルートからの相対パスを正準形とし、先頭スラッシュなし・POSIX 区切り（`/`）で正規化する。`base_path` 先頭の `/` はルートを起点とする記法上の目印であり、生成される dct ビュー・exec plan・doc-index など下流の参照表記には残さない。

### 6.5. `done_criteria`

- `work` 成果物には最低 1 件の完了条件を記載する。
- `text` は「確認できること」「識別できること」など、検証可能な形で記述する。
- `roles` には条件を確認する責務を持つロールコードのみを記載する。
- `viewpoint` には `pm-review-viewpoints.yaml` で定義された `vp-*` の ID を 1 つ記載する。

### 6.6. 反復成果物

- 反復成果物の `local_id` には成果物ファミリーを表す固定の kebab-case を使用する。
- 実体IDの命名規則は `instance_id_pattern` に分離する（例: `pjr-{sequence}-{term}`、`pr-{yyyy}-{mm}-{dd}`）。
- プレースホルダは小文字を波括弧で囲んで記述し、固定語はハイフンで連結する。

### 6.7. テンプレート固有項目

- `type: template` のファイルでのみ `min_size`（`small` / `medium` / `large`）を使用できる。
- `min_size` は規模に応じた取捨選択のための項目であり、scaffold 時に除去される。
- テンプレートでは `local_id` や `part_of` にアンダースコアで囲んだプレースホルダ（例: `_PRJ-0000_:dct-index`）を使用できる。

## 7. 禁止事項

| 禁止事項                                                          | 理由                                                       |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| `local_id` に日本語・空白・大文字を使用する（`project` の場合）   | スキーマの kebab-case 制約に反するため                     |
| 成果物の詳細本文（仕様・手順・構成図など）をカタログに記載する     | 詳細は成果物本体に集約するため                             |
| `kind` を `work` / `control` / `generated` 以外に拡張する         | スケジュール展開・レビュー生成の前提が崩れるため           |
| 同一 `local_id` を複数ドメインのカタログに重複して記載する        | トレーサビリティとスケジュール展開が破綻するため           |
| `depends_on` に `local_id` 以外（ファイルパス・URL）を混在させる  | 依存解決が機械的に行えなくなるため                         |
| `work` 成果物で `path` または `done_criteria` を省略する          | スケジュール展開とレビュー計画生成に必須のため             |
| 本ルールや成果物ファイルでスキーマ定義を再掲・上書きする          | `dct.schema.yaml` を SSOT とするため                       |

## 8. サンプル

- 参照先: [dct-sample](../samples/dct-sample.yaml)
- 構造例は成果物カタログのテンプレート（`../templates/dct-<domain>-template.yaml`）も参照する。
