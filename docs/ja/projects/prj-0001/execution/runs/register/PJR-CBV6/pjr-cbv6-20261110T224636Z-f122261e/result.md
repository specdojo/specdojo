---
specdojo:
  id: prj-0001:xer-pjr-cbv6-20261110t224636z-f122261e
  type: exec-result
  task_id: PJR-CBV6
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-CBV6/pjr-cbv6-20261110T224636Z-f122261e/plan.md
  started_at: "2026-11-10T22:46:38.990Z"
  completed_at: "2026-11-10T23:12:03.220Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-integration, test-unit"
---

# Edit Result

## 1. 実施内容

- grade コマンドで YAML 形式の成果物（`deliverable`）および Kata（`sample`）を評価できるように機能を拡張しました。
- YAML のメタ情報（最上位または `x-spec-meta`）の読み取り方を `validate:schema` と共通化し、ハッシュ値と行番号を用いたサイドカーの生成を実現しました。
- Markdown 形式に加えて YAML 形式のサポートを追加し、単体テストおよび統合テストを更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/standards/document-metadata-standard.md`: YAML 形式を含むドキュメントのメタ情報に関する標準仕様を更新しました。
- `docs/specdojo/schemas/v1/grade-pipeline-state.schema.yaml`: `grade` のパイプライン状態を管理するための JSON Schema を更新しました。
- `packages/docs-lint/src/deliverable-type.cjs`: 成果物タイプの判別ロジックを更新しました。
- `src/grade/apply.ts`: 評価結果を適用するロジックを更新しました。
- `src/grade/command-inspect.ts`: `inspect` コマンドの処理を更新しました。
- `src/grade/command-shared.ts`: コマンド間で共有される処理を更新しました。
- `src/grade/core.ts`: `grade` コマンドのコアロジックを更新しました。
- `src/grade/markdown.ts`: Markdown 形式の評価処理を維持しつつ、拡張しました。
- `src/grade/pipeline-state.ts`: パイプラインの状態管理クラスを更新しました。
- `src/grade/plan.ts`: `grade` の計画生成ロジックを更新しました。
- `src/grade/result.ts`: 評価結果の生成処理を更新しました。
- `src/grade/target-discovery.ts`: 評価対象の探索ロジックを更新しました。
- `src/grade/targets.ts`: ターゲットの定義と判別ロジックを更新しました。
- `src/shared/grade-result.ts`: `grade` 結果の型定義を更新しました。
- `tests/src/grade/run.test.ts`: `grade run` のテストケースを更新しました。
- `docs/specdojo/lib/yaml-metadata.cjs`: 追加、+8 / -0 行
- `src/shared/document-metadata.ts`: 追加、+29 / -0 行
- `tests/src/grade/yaml.integration.test.ts`: 追加、+92 / -0 行
- `tests/src/grade/yaml.test.ts`: 追加、+80 / -0 行

## 3. 申し送り

- 統合後、orchestrator は実 agent で次の4件に `grade run` を実行し、`grade result` サイドカー生成を確認して個票 5.3 に追記してください。対象は成果物（`--target deliverable`）の `docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml` および `docs/ja-product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml` と、sample（`--target kata --kind sample`）の `docs/ja/specdojo/samples/bdd-sample.yaml` および `docs/ja/specdojo/samples/ifx-cmd-sample.yaml` です。一意な `--run-id` を指定して実行してください。
- 実装判断として、`mapping` の `x-spec-meta` を優先し、最上位のメタ情報と混ぜないようにしました。YAML は `id`、`type`、`status`、`rulebook` の非空文字列を必須とし、`rulebook: none` は許容しています。不足時は理由を付記して探索から除外します。また、YAML の H1 検査を省き、コメントやメタ情報を含む全文を評価対象としています。
- CHANGELOG への追加文案: `grade list|plan|run|apply|result` が YAML の成果物および sample に対応。最上位または `x-spec-meta` の情報を読み取り、元の内容のハッシュと行番号で結果を保存して `review` でも利用可能にしました。
- 統合後、orchestrator は実 agent で次の4件に grade run を実行し、grade result でサイドカー生成を確認して個票 5.3 に追記する。成果物（--target deliverable）: docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml、docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml。sample（--target kata --kind sample）: docs/ja/specdojo/samples/bdd-sample.yaml、docs/ja/specdojo/samples/ifx-cmd-sample.yaml。--project prj-0001 と一意な --run-id を指定する。使用量を消費する実行のため executor では実施していない。
- 実装判断は個票 5.2 に記録した。mapping の x-spec-meta を優先し、最上位と混ぜない。YAML は id・type・status・rulebook の非空文字列を必須とし、rulebook: none は許容する。不足時は理由付きで探索から除外する。YAML の H1 検査を省き、コメント・メタ情報を含む全文を評価する。共有処理は既存の配布対象に置き、docs-lint 単独導入・旧版併用の互換動作を維持した。
- CHANGELOG 文案（追加）: grade list|plan|run|apply|result が YAML の成果物と sample に対応。最上位または x-spec-meta のメタ情報を読み、元の YAML の内容ハッシュと行番号で評価結果をサイドカーに保存し、review でも利用できるようにした。
- 人の確認が必要: `node --import tsx src/specdojo.ts grade run --target deliverable --project prj-0001 --path docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml --path docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml --run-id pjr-cbv6-post-merge-deliverables node --import tsx src/specdojo.ts grade run --target kata --kind sample --project prj-0001 --path docs/ja/specdojo/samples/bdd-sample.yaml --path docs/ja/specdojo/samples/ifx-cmd-sample.yaml --run-id pjr-cbv6-po…`（統合後に実 agent で4件を評価し、サイドカー生成を確認して個票へ追記する。実 agent の使用量を消費するため sandbox では実行していない。）

## 4. 進め方

まず、`grade` コマンドが YAML 形式のドキュメントを適切に認識し、そのメタ情報を `validate:schema` と同じルールで読み取れるように実装を修正しました。具体的には、`src/grade/targets.ts` 等でのターゲット判別ロジック、および `src/grade/core.ts` 等でのメタ情報取得処理を拡張しています。また、評価結果のハッシュ計算において、ファイル全体のハッシュを用いることで、Markdown と同様の整合性を確保しました。最後に、これらの変更が正しく動作することを確認するため、既存のテストおよび新しい統合テストの実行を行いました。
