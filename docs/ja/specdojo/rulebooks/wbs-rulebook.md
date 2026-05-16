---
id: wbs-rulebook
type: rulebook
status: draft
---

# WBS 作成ルール

Work Breakdown Structure Documentation Rules

本ドキュメントは、`wbs-<domain>.yaml` を一貫した粒度と命名で作成・更新するためのルールを定義します。
WBS は「どの成果物をどこに作成・更新し、何を満たせば完了か」を定義する層であり、実行順序・依存・日程（WHEN/ORDER）は Schedule 側で管理します。
本ルールで示す YAML 構造は、`docs/specdojo/schemas/v1/wbs.schema.yaml` を正とします。

## 1. 全体方針

- `1 成果物 = 1 WBS Item` を基本単位とする。WBS 展開の主対象は成果物カタログの `kind: work` の成果物。プロジェクト遂行上、作成・更新を明示的に管理する必要がある `kind: control` は例外的に WBS 展開対象にできる。`kind: generated` は対象外。
- WBS には成果物スコープ、`deliverables`、`done_criteria` を記述し、実行計画（依存・順序・所要期間）は記述しない。
- `DOMAIN` と `ARTIFACT` は成果物カタログで定義する。WBS Item の `id` はそれらをベースに採番する。
- 成果物カタログ・WBS・Schedule の責務分担と展開フローの全体像は `specdojo-deliverables-to-schedule-guide.md` を参照する。

### 1.1. スキーマ版管理

- スキーマ版は `docs/specdojo/schemas/v1/` のような版付きディレクトリで管理する。
- 現行版は `docs/specdojo/schemas/v1/wbs.schema.yaml` とする。
- 互換性を壊す変更（required 追加、型変更、制約強化など）を行う場合は、`v2` 以降の新しいディレクトリで並行管理する。

## 2. 位置づけと用語定義（必要に応じて）

本ルールでは、用語を次の意味で使います。

| 用語          | 意味                                              |
| ------------- | ------------------------------------------------- |
| WBS Item      | 1 成果物に対応するスコープ完了単位                |
| domain        | WBS ファイル分割単位。ファイル名 `wbs-<domain>.yaml` とルートキー `domain` で一致させる |
| deliverables  | 完了判定対象となる実ファイルパス一覧              |
| done_criteria | レビューで完了可否を判定できる条件                |

## 3. ファイル命名・ID規則

### 3.1. WBS ファイル名

- ファイル名は `wbs-<domain>.yaml` とする。
- `<domain>` は成果物カタログのドメインまたは分解戦略で定義した分割単位に一致させる。
- 例: `wbs-project.yaml`, `wbs-agent-customization.yaml`, `wbs-project-docs.yaml`, `wbs-product-docs.yaml`

### 3.2. WBS Item の `id`

- スキーマ上の形式は `^WBS-[A-Z0-9]+-[A-Z0-9-]+$` とする。
- 形式は `WBS-<DOMAIN>-<ARTIFACT>` とする。
- `<DOMAIN>` は成果物カタログの `DOMAIN` 列の値を使用する。
- `<ARTIFACT>` は成果物カタログの `ARTIFACT` 列の値を使用する。
- 既存 `id` は並び替えのみを理由に変更しない。

例:

```text
WBS-PJD-OVERVIEW
WBS-PJD-SCOPE
WBS-PJM-PLAN
WBS-PJM-COMM
```

## 4. 推奨 Frontmatter 項目

`wbs-<domain>.yaml` では、Frontmatter を分離して持たず、Frontmatter 相当の文書メタデータを YAML のルートキーとして埋め込む。
項目の意味と値の考え方は [deliverable-metadata-standard.md](../standards/deliverable-metadata-standard.md) に準拠し、WBS 定義では次を使用する。

| 項目       | 説明                                 | 必須 |
| ---------- | ------------------------------------ | ---- |
| id         | ドキュメントID（英小文字・ハイフン） | ○    |
| type       | `wbs`                                | ○    |
| status     | `draft` / `ready` / `deprecated`     | ○    |
| part_of    | 親ドキュメントID                     | 任意 |
| based_on   | 根拠ドキュメントID                   | 任意 |
| supersedes | 置換対象ドキュメントID               | 任意 |

補足:

- これらの項目は Markdown Frontmatter ではなく、YAML 本体の先頭レベルに記述する。
- `type` はスキーマ上 `wbs` 固定とする。

## 5. 本文構成（標準テンプレ）

`wbs-<domain>.yaml` は、スキーマで定義されたルート構造に従って構成する。

| 要素                        | 必須 | 内容                                              |
| --------------------------- | ---- | ------------------------------------------------- |
| id                          | ○    | WBS 文書ID                                        |
| type                        | ○    | `wbs` 固定                                        |
| status                      | ○    | 文書状態                                          |
| part_of                     | 任意 | 親ドキュメントID                                  |
| based_on                    | 任意 | 根拠ドキュメントID                                |
| supersedes                  | 任意 | 置換対象ドキュメントID                            |
| project_id                  | ○    | プロジェクト識別子                                |
| domain                      | ○    | ファイル名 `wbs-<domain>.yaml` と対応する安定境界 |
| assigned_team               | 任意 | 現在の担当チーム名（可変情報）                    |
| wbs                         | ○    | WBS Item 配列                                     |
| wbs[].id                    | ○    | WBS ID（スキーマ pattern 準拠）                   |
| wbs[].name                  | ○    | 一覧で識別できる短いラベル                        |
| wbs[].description           | 任意 | スコープ説明                                      |
| wbs[].component             | 任意 | サブ領域（例: api, ui, db）                       |
| wbs[].deliverable           | ○    | 成果物オブジェクト（1:1 固定）                    |
| wbs[].deliverable.id        | ○    | 成果物ドキュメントID                              |
| wbs[].deliverable.path      | ○    | 成果物パス                                        |
| wbs[].deliverable.native_id | 任意 | 外部仕様・ネイティブ形式側の識別子                |
| wbs[].deliverable.note      | 任意 | 成果物補足                                        |
| wbs[].depends_on            | 任意 | 先行成果物 ID 配列（論理的な成果物依存のみ）      |
| wbs[].done_criteria         | ○    | 完了判定可能な条件（文字列配列、1件以上必須）     |
| wbs[].acceptance_refs       | 任意 | 受入基準や決定記録への参照ID配列                  |
| wbs[].tags                  | 任意 | 分類タグ配列                                      |
| wbs[].notes                 | 任意 | 補足メモ                                          |

補足:

- YAML のルートキーは `wbs` を使用する。
- 章構成は YAML には存在しないため、本節は「スキーマ準拠テンプレート」を示す。

## 6. 記述ガイド

### 6.1. 粒度

- `1 成果物 = 1 WBS Item` を厳守する。
- 成果物カタログの `kind: work` が WBS Item の主対象。プロジェクト遂行上、明示的に管理が必要な `kind: control` は例外的に対象にできる。`kind: generated` は対象外。
- 同一成果物が複数フェーズで扱われる場合でも、WBS Item は重複させない。

### 6.2. `deliverable`

- `1 成果物 = 1 WBS item` の原則に従い、**単一オブジェクト**として記述する（配列ではない）。
- `id` と `path` を必須とする。
- `id` は SpecDojo における成果物管理IDとする。
- 成果物ドキュメントが SpecDojo 互換のメタデータを持つ場合、`id` は成果物ドキュメントの Frontmatter または YAML ルートに記載された `id` 値と一致させる。
- 成果物ドキュメントが SpecDojo 互換のメタデータを持たない場合、WBS の `deliverable.id` と `deliverable.path` の対応関係を SpecDojo 管理IDの正本とする。
- 外部仕様を持つファイル（例: `SKILL.md`）では、SpecDojo ID をファイル内に埋め込まず、WBS の `deliverable.id` で管理する。
- 外部仕様側の ID・キー・URI などが別に存在する場合のみ、`native_id` に記録する。`native_id` は SpecDojo 成果物IDとして扱わない。
- `path` は、成果物カタログに記載された配置先ディレクトリの配下に置く。
- 曖昧な表記（例: 「関連資料一式」）は使わない。

例:

```yaml
deliverable:
  id: wbs-rulebook
  path: docs/ja/specdojo/rulebooks/wbs-rulebook.md
  note: WBS ルール本文
```

### 6.3. `done_criteria`

- 文字列配列（`array of strings`）で記述し、1件以上必須とする。
- 「何を満たせば完了か」をレビュー可能な文で記述する。
- 「作成する」「更新する」だけの記述は避ける。

良い例:

```yaml
done_criteria:
  - BPS ルール・指示・サンプルが、必須章構成と禁止事項を満たし、相互リンクが有効であること。
```

悪い例:

```yaml
done_criteria:
  - BPS を更新すること。
```

### 6.4. `depends_on`

- 1成果物 = 1 WBS item の原則に基づき、**先行成果物の deliverable ID** を記述する。
- 後続 WBS Item の成果物作成が**論理的に不可能**な場合のみ記述する。
- 「先に見たい」「担当者の都合で直列にしたい」程度の関係は記述しない。
- 並列着手が可能な WBS Item には依存を置かない。
- 実行順序・スケジュール上の都合は Schedule 側の `depends_on` で扱う。

良い例:

```yaml
depends_on:
  - gov-rulebook # ルールブック確定前は instruction が作成不可
```

悪い例:

```yaml
depends_on:
  - biz-br # 並列着手は可能だが、担当者の都合で直列化したい
```

### 6.5. 対象外の扱い

- WBS 対象外成果物を誤って WBS 化しない。
- 対象外成果物の実行管理が必要な場合は、WBS ではなく個別の運用計画または別管理台帳で扱う。

## 7. 禁止事項

- 実行順序・日程・所要期間を WBS に直接書くこと。
- 論理的な成果物依存ではなく、スケジュール都合の依存を `depends_on` に書くこと。
- `id` に意味のない略号や重複番号を使うこと。
- `deliverable` を配列で記述すること（単一オブジェクトで記述する）。
- `deliverable.path` に存在しない/曖昧なパスを記載すること。
- `done_criteria` を文字列ではなく配列以外の形式で記述すること。
- `done_criteria` を判定不能な抽象語だけで記述すること。
- 成果物カタログで WBS 対象外とされた成果物を WBS 管理対象へ混在させること。

## 8. サンプル（最小でも可）

- サンプルは次を参照する。
  - `../samples/wbs-sample.yaml`

## 9. 生成 AI への指示テンプレート

- 生成 AI への具体的な指示は次を参照する。
  - `../instructions/wbs-instruction.md`
