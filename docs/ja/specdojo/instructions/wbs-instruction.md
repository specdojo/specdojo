# WBS 定義 作成の指示テンプレート

以下のルールに従って、`wbs-<domain>.yaml` を 1 ファイル作成してください。出力は **YAML** とします。

- WBS は成果物スコープと完了定義を記述する文書です。実行順序・依存・日程は含めません。
- 構造と制約は `docs/specdojo/schemas/v1/wbs.schema.yaml` を正とし、出力内容はこれに厳密準拠してください。
- 記述例は `docs/ja/specdojo/samples/wbs-sample.yaml` を参照し、粒度と値の置き方を合わせてください。
- Frontmatter は分離せず、文書メタデータは YAML のルートキーとして埋め込みます。
- 成果物カタログで「WBSへの落とし込み対象外」とされた成果物は含めません。

## 1. 目的と前提

- 目的は、`1 WBS Item = 1 完了判定を共有する成果物ファミリー` の原則で、レビュー可能な WBS 定義を作成することです。
- WBS は WHAT を定義する層であり、WHEN / ORDER は Schedule 側で管理します。

## 2. 入力情報

次の情報が与えられている前提で、それに整合する `wbs-<domain>.yaml` を生成してください。不明な場合は推測で補完せず、入力不足として扱ってください。

- 対象プロジェクト ID
- 対象 `domain` と対応ドメイン名
- 成果物カタログ
- WBS 分解方針
- 各成果物の作成/更新/参照区分
- 各 WBS Item の主責任ロール
- 完了判定条件の根拠となる仕様・受入条件・決定記録

## 3. 出力フォーマット

### 3.1. ルート構造

YAML ルートには次を記述してください。

- 必須: `id` / `type` / `status` / `project_id` / `domain` / `wbs`
- 任意: `part_of` / `based_on` / `supersedes` / `assigned_team`

```yaml
id: wbs-<domain>
type: wbs
status: draft
part_of: []
based_on: []
supersedes: []
project_id: <project-id>
domain: <domain>
assigned_team: <team-name>
wbs:
  - id: WBS-<DOMAIN>-<ARTIFACT>
    name: <short-label>
    description: <optional-scope-description>
    owner: PO
    component: <optional-component>
    deliverable:
      id: <deliverable-id>
      path: <repo-path>
      note: <optional-note>
    depends_on:
      - <deliverable-id>
    done_criteria: <reviewable-completion-criteria>
    acceptance_refs:
      - <REF-ID>
    tags:
      - <tag>
    notes: <optional-note>
```

### 3.2. フィールド制約

- `type` は必ず `wbs` としてください。
- `id` は文書 ID として英小文字・数字・ハイフンを使用してください。
- `domain` はファイル名 `wbs-<domain>.yaml` の `<domain>` と一致させてください。
- `wbs[].id` は `WBS-<DOMAIN>-<ARTIFACT>` 形式とし、末尾に連番を付けないでください。
- `owner` は `PO` / `BA` / `ARC` / `QE` のいずれかに限定してください。

## 4. 記述ルール

### 4.1. 粒度

- `1 成果物 = 1 WBS Item` を厳守してください。
- `deliverables` は1件のみ記述してください（スキーマ上 `maxItems: 1` で制約）。

### 4.2. `deliverable`

- `deliverable` は配列ではなく**単一オブジェクト**で記述してください（1成果物 = 1 WBS item）。
- `id` と `path` を必須で記述してください。
- `path` には実在または作成予定の具体的なリポジトリパスを記述してください。
- 曖昧な表現は使わないでください。
- 成果物カタログで対象外とされた管理台帳、レポート、実行管理、決定記録は記述しないでください。

### 4.3. `done_criteria`

- 完了判定可能な文で記述してください。
- 「作成する」「更新する」だけで終わる抽象表現は避けてください。
- 必要に応じて `acceptance_refs` で根拠 ID を紐付けてください。

### 4.4. 対象外の扱い

- WBS 対象外成果物を WBS Item に含めないでください。
- 実行管理が必要でも、対象外成果物は別の運用計画や管理台帳で扱ってください。

## 5. 禁止事項

- 実行順序・日程・所要期間を WBS に記述しないでください。
- `depends_on` には先行成果物の `deliverable.id` を記述し、論理的な成果物依存（後続 WBS Item の作成が真に不可能な場合）のみを対象とし、スケジュール都合の依存を書かないでください。
- `deliverables` を文字列配列で書かないでください。
- `owner` に許可されていない値を使わないでください。
- 存在しない、または曖昧な `path` を書かないでください。
- 判定不能な抽象語だけで `done_criteria` を書かないでください。
- 成果物カタログで WBS 対象外とされた成果物を混在させないでください。

## 6. 最終チェック

- ルート必須項目 `id` / `type` / `status` / `project_id` / `domain` / `wbs` が揃っている
- `type` が `wbs` 固定になっている
- `domain` がファイル名と一致している
- すべての `wbs[].id` が `WBS-<DOMAIN>-<ARTIFACT>` 形式（末尾に連番なし）になっている
- `deliverable` が配列でなく単一オブジェクト `{id, path, note?}` になっている
- `done_criteria` がレビュー可能な文になっている
- WBS 対象外成果物が含まれていない
- `depends_on` が記述されている場合は論理的な成果物依存のみを記述している
- 実行順序・日程・所要期間を記述していない
- `npm run validate:schema:file -- --schema <schema-path> --data <wbs-path>` で schema 検証が通る
