---
specdojo:
  id: prj-0001:xer-pjr-hqbk-20261001t043106z-e6e4
  type: exec-result
  task_id: PJR-HQBK
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-hqbk-20261001T043106Z-e6e4-plan.md
  started_at: "2026-10-01T04:31:06.290Z"
  completed_at: "2026-10-01T04:42:05.384Z"
  agent: claude-expert-executor
---

# Edit Result

## 1. 実施内容

- specdojo.config.json における `repos` 宣言機能を追加し、リポジトリごとのパス解決を可能にした。
- `&lt;repo&gt;:&lt;path&gt;` 形式の参照を解決するための `resolveRepoQualifiedRef` および `resolveRepoQualifiedPath` リゾルバーを実装した。
- 設定ファイルのバリデーションおよびスキーマ定義 (`specdojo-config.schema.yaml`) を更新した。
- リポジトリ設定に関するドキュメント (`specdojo-config-reference.md`) を更新し、個票 (`pjr-hqbk-multi-repo-config-resolution.md`) に実施内容を記録した。

## 2. 変更ファイル

- `src/specdojo-config.ts`: `repos` 宣言の型定義、設定ロード時のバリデーション、およびリポジトリ修飾パス・参照のリゾルバーを実装。
- `docs/specdojo/schemas/v1/specdojo-config.schema.yaml`: `repos` フィールドを追加し、設定スキーマを更新。
- `docs/ja/specdojo/references/specdojo-config-reference.md`: `repos` セクションに関する解説を追加。
- `docs/ja/projects/prj-0001/controls/project-register/pjr-hqbk-multi-repo-config-resolution.md`: 作業内容および対応結果を更新。
- `tests/src/specdojo-config-repos.test.ts`: リポジトリ設定に関する新規ユニットテストを追加。
- `tests/src/specdojo-config-command.test.ts`: 設定コマンドのテストを更新。
- `tests/docs/specdojo/schemas/specdojo-config-schema.test.ts`: 構成スキーマの検証テストを更新。

## 3. 申し送り

- ワークツリー相対のリポジトリパス解決の実装、およびコミットスコープやジョブプランニングへのリゾルバーの組み込みが必要（`PJR-98G4`/`PJR-0WAA`）。
- config 初期化時の JSON に `repos` を含めない仕様としている点についての確認。

## 4. 進め方と実践の型の適用

まず `specdojo.config.json` で複数リポジトリを定義できるように型とスキーマを拡張し、次に `app1:src/...` のような形式を解析して適切なパスに変換するリゾルバーを `src/specdojo-config.ts` に実装した。その後、関連ドキュメントの更新と、ユニットテストおよびスキーマ検証による動作確認を行った。
