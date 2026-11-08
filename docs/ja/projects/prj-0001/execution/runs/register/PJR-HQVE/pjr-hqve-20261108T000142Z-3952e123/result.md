---
specdojo:
  id: prj-0001:xer-pjr-hqve-20261108t000142z-3952e123
  type: exec-result
  task_id: PJR-HQVE
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-HQVE/pjr-hqve-20261108T000142Z-3952e123/plan.md
  started_at: "2026-11-08T00:01:43.169Z"
  completed_at: "2026-11-08T00:18:51.341Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- schedule の `--auto` 実行中に並行して生成された `block` の event ファイルが index に残ることによる、git merge の中断問題を解消しました。
- `register` コマンドのコミット対象を、宣言済みの特定のパスに限定するように修正し、未定義の staged 変更が統合を妨げないようにしました。
- 統合（merge）中に無関係な staged 変更が検出された場合、自動的に解除するのではなく、対象パスの表示と `git restore --staged -- &lt;path&gt;` による復旧手順を表示して停止する仕組みを導入しました。
- 不測の事態（中断やシグナル受信）に備え、実行中の stage を安全に解除する例外処理を追加しました。
- 修正内容の検証として、統合テストの追加および既存のテストの更新を行いました。

## 2. 変更ファイル

- `CHANGELOG.md`: 今回の変更に関する履歴を追加。
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: worktree 運用におけるトラブルシューティング情報を更新。
- `docs/ja/specdojo/guides/register-operation-guide.md`: `register` 操作における index 管理の変更点を追記。
- `docs/ja/specdojo/guides/schedule-operation-guide.md`: 運用ガイドを更新。
- `src/exec/repo-integration.ts`: リポジトリ統合処理における対象パスの限定とエラーハンドリングを実装。
- `src/exec/worktree-ops-merge.ts`: merge 前の staged 変更の検知と、ユーザーへの復旧手順提示ロジックを追加。
- `src/register/register.ts`: コミット対象を明示的なパスに限定するよう修正。
- `src/shared/git.ts`: Git 操作に関連するユーティリティの更新。
- `tests/src/exec/task-repos.integration.test.ts`: 統合テストの追加・更新。
- `tests/src/exec/worktree-ops.integration.test.ts`: 統合テストの追加・更新。
- `tests/src/register/commit.integration.test.ts`: 統合テストの追加・更新。

## 3. 申し送り

- 原因調査: `block` の記帳自体は stage しませんが、旧 `commitRegisterMutation` は開始後に増えたリポジトリ全体の差分を対象にするため、並行生成された `block` event を取り込めませんでした。再現テストを追加して確認済みです。なお、2026-11-05 の具体的な実行元（どのプロセスが index に残したか）は特定できませんでした。
- 統合方針: 他の操作が所有する index を保持するため、無関係な staged 変更は自動解除・commit せず、merge 前に対象パスを表示し、`git restore --staged -- &lt;path&gt;` による復旧を案内して停止する仕様としました。個票の対応結果にもこの理由を記載しています。
- 統合後は `[[prj-0001:pm-orchestrator-playbook|運用メモ]]` 5.1 に従い、`[[prj-0001:pjr-jsey-exec-run-split-smoke|PJR-JSEY]]` の対象へ本件を追加し、`claude-executor` による実際の `exec run --register` を1回確認してから close してください。なお、`schedule` event が `untracked` で作業ツリーに残る現象については、本タスクの範囲外としています。
- 原因調査: block の記帳自体は stage しないが、旧 commitRegisterMutation は開始後に増えたリポジトリ全体の差分を対象にするため、並行生成された block event を取り込めた。再現テストを追加した。実事象の stage 実行コマンドと中断との前後関係は保存されていないため、2026-11-05 の実行元までは断定できない。この制約を個票の対応結果にも記載した。
- 統合方針: 他操作が所有する index を保持するため、無関係な staged 変更は自動解除・commit せず、merge 前に対象パスと git restore --staged -- &lt;path&gt; による復旧を案内して停止する。個票の対応結果にも理由を記載した。
- 統合後は [[prj-0001:pm-orchestrator-playbook|運用メモ]] 5.1 に従い、[[prj-0001:pjr-jsey-exec-run-split-smoke|PJR-JSEY]] の対象へ本件を追加し、claude-executor による実際の exec run --register を1回確認してから close する。型検査・lint・unit/integration test・schema 検査は親 runner に委ねた。schedule event が untracked で残る件は範囲外。
- 適用外の検証: `npm run validate:schema:file`（変更対象は TypeScript と Markdown。開始時から存在する runner 管理の event YAML 差分は executor の変更に含めない。）
- 人の確認が必要: `npx specdojo exec run --project prj-0001 --register PJR-JSEY --worktree --executor-by claude-executor`（統合後、運用メモ5.1の準備を行い sandbox 外で実 agent CLI による動作確認が必要。）

## 4. 進め方

調査の結果、`register` のコミット処理が作業ディレクトリ全体の差分を対象としていることが、並行して生成された `block` event ファイルによる merge 中断の原因であることを特定しました。対応として、コミット対象を明示的に指定するよう変更し、予期せぬ staged 変更がある場合にはユーザーに復旧を促す安全な停止プロセスを導入しました。
