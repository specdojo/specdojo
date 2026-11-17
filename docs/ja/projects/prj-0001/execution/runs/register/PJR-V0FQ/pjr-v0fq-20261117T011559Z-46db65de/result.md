---
specdojo:
  id: prj-0001:xer-pjr-v0fq-20261117t011559z-46db65de
  type: exec-result
  task_id: PJR-V0FQ
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-V0FQ/pjr-v0fq-20261117T011559Z-46db65de/plan.md
  started_at: "2026-11-17T01:17:18.739Z"
  completed_at: "2026-11-17T01:55:26.407Z"
  agent: sol-executor
  block_reason: "parent validation failed: lint-fm, test-unit"
---

# Edit Result

## 1. 実施内容

- command Job に `task.steps` を追加し、exec・grade・ビルドを順次実行できるようにした。段ごとの `on_failure` で停止／継続を選べる。
- 終了コードと状態による完了判定（`completion`）、有限の lock 待機（`task.lock_wait_seconds`、既定3600秒）、段ごとの実行時間上限、段別の結果・理由・evidence を実装した。失敗または延期を含む Run は failed とし、CLI は失敗を含めば 1、延期だけなら 75 を返す。
- 既存 command Job を拡張し、入力・冪等キー・attempt・routine を再利用した。定義検証と凍結は `src/job`、順序制御と排他は `src/exec` に置き、job から exec への import は追加していない。
- schema・設計書・ガイド・CLI リファレンス・定義例・回帰テストも更新した。
- executor 実行の `npm run build`、smoke、`job validate`、schema 検査、Prettier、`git diff --check` は通過した。親 runner の `lint:ts`、`lint:md`、`typecheck`、`test:integration` なども通過した。
- 親 runner の検証で `lint:fm` と `test:unit` が失敗した。`lint:fm` は `job-sequence-guide.md` に導入ブロックと英語名行がないという警告で、`--frail` により失敗した。`test:unit` は `tests/src/docs/yaml-pages.test.ts` が失敗し、新規の `job-sequence.yaml` がサンプル種別一覧に含まれていない。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: ジョブ実行の設計に、段の順次実行、停止／継続、延期、lock 待機、実行時間上限を反映した。
- `docs/ja/specdojo/guides/routine-operation-guide.md`: routine や cron から順次実行 Job を起動する運用を追記した。
- `docs/ja/specdojo/references/command-reference.md`: 順次実行 Job の CLI 動作、終了コード（失敗は 1、延期のみは 75）、retry の挙動を追記した。
- `docs/ja/specdojo/standards/job-definition-standard.md`: `task.steps`、`on_failure`、`completion`、`lock_wait_seconds`、`timeout_seconds` の定義規約を追加した。
- `docs/specdojo/schemas/v1/job-run.schema.yaml`: Run JSON に段別の結果、理由、evidence、延期状態を記録できるようにした。
- `docs/specdojo/schemas/v1/job.schema.yaml`: Job 定義 schema に `task.steps` と関連項目を追加した。
- `src/exec/evidence.ts`: 段別 evidence を記録できるように拡張した。
- `src/exec/run/job.ts`: command Job の実行で順次実行の経路を呼び出し、失敗時の Run 状態確定に対応した。
- `src/exec/run/lock.ts`: 有限の lock 待機と上限超過時の扱いに対応した。
- `src/exec/run/register-command.ts`: 順次実行に関わる CLI 側の連携と終了コードを調整した。
- `src/exec/run/shared.ts`: 順次実行で使う共通処理・型を追加または調整した。
- `src/job/definition.ts`: `task.steps` の定義検証と凍結処理を追加した。
- `src/job/job.ts`: 順次実行定義を扱うように Job の処理を拡張した。
- `tests/src/exec/run/lock.test.ts`: lock 待機の変更に合わせて既存テストを更新した。
- `docs/ja/specdojo/guides/job-sequence-guide.md`: 順次実行 Job の利用ガイドを新規作成した。
- `docs/ja/specdojo/samples/job-sequence.yaml`: resume → auto → register → grade の順次実行を示す定義例を新規作成した。schema 適合は確認済み。
- `src/exec/run/job-lock.ts`: Job 実行の lock 取得と、子 exec への lock 継承を新規に実装した。
- `src/exec/run/job-sequence.ts`: 段の順次実行、停止／継続、状態による延期、実行時間上限、段別 evidence を新規に実装した。
- `tests/src/exec/job-sequence.integration.test.ts`: 順次実行の統合テストを新規追加した。
- `tests/src/job/sequence.test.ts`: `task.steps` の定義検証に関する単体テストを新規追加した。

## 3. 申し送り

- 親 runner の `lint:fm` と `test:unit` が失敗している。`lint:fm` は `job-sequence-guide.md` に H1 直後の導入ブロック（対象読者、この文書で分かること、次に読む文書）と英語名行がない警告で、`--frail` により失敗した。`test:unit` は `tests/src/docs/yaml-pages.test.ts` の期待値（`sampleTypes`）に新規の `job-sequence.yaml` がない。ガイドの構成修正と `sampleTypes` への追加が次の作業である。
- executor が実行した検証では `lint:fm` と `test:unit` の失敗を検出していない。親 runner の結果を正とする。
- 実 agent による確認（PJR-JSEY）は `requires_human` として残っている。
- 既存 command Job の拡張を選択した。入力・冪等キー・attempt・routine を再利用し、定義検証と凍結は src/job、順序制御と排他は src/exec に置いた。job → exec の import は追加していない。
- 各段の `on_failure` は自身の失敗・延期後の停止／継続を指定する。失敗・延期を含む Run は failed、CLI は失敗を含めば 1、延期だけなら 75。状態判定には必要に応じて `completion` を指定する。
- `task.lock_wait_seconds` の既定は3600秒。上限超過では全段を延期として記録し、precondition・agent は起動しない。段の `timeout_seconds` は lock 待機を含む command 全体の上限。retry は保存済み定義で先頭から実行し、旧 attempt の結果と段別 evidence を保持する。
- CHANGELOG 文案（追加）: command Job の `task.steps` で exec・grade・ビルドを順次実行できる。段ごとの停止／継続、終了コードと状態による完了判定、有限の lock 待機、実行時間上限、段別結果・理由・evidence に対応し、routine／cron から起動できる。個票にも記録済み。
- 親 runner の lint・型検査・単体／統合テスト・schema 全体検査を最終根拠とする。result は編集していないため、reporter／runner が個票の判断・検証・CHANGELOG 文案を反映する。保護された設定の変更案はない。
- 統合後は運用メモに従い PJR-JSEY に本項目を追加して実 agent で確認する。承認済みの対象・provider 設定で resume → auto → register → grade の定義例と同じ Run の retry を確認する。sandbox では利用枠を消費する実 agent を起動していない。
- 人の確認が必要: `npx specdojo exec run --project prj-0001 --register PJR-JSEY --worktree --executor-by claude-executor`（統合後、運用メモに従って対象を追加・再開して実 agent で確認する。利用枠を消費するため sandbox では実行していない。）

## 4. 進め方

既存の command Job を拡張して `task.steps` を追加した。定義の検証と凍結は `src/job`、順序制御と lock 排他は `src/exec/run` に置き、schema・設計書・ガイド・定義例・テストを更新した。
