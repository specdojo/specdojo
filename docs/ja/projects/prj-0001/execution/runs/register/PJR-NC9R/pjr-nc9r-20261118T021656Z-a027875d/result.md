---
specdojo:
  id: prj-0001:xer-pjr-nc9r-20261118t021656z-a027875d
  type: exec-result
  task_id: PJR-NC9R
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-NC9R/pjr-nc9r-20261118T021656Z-a027875d/plan.md
  started_at: "2026-11-18T02:16:57.402Z"
  completed_at: "2026-11-18T02:38:32.715Z"
  agent: opus-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- ローカル設定 `.specdojo/specdojo.local.config.json` を導入し、許可リスト方式で `repos[].path` の差し替えとローカルのリポジトリの追加を上書きできるようにした。
- worktree の子のプロセスには `SPECDOJO_LOCAL_CONFIG` でパスを渡し、本体の作業ツリーのローカル設定が効くようにした。worktree 内の同名ファイルは読まない。
- `config show` の新設、`where exec` と executor evidence の `local_config_overrides` でローカル由来の値を示す。`config init` と `.gitignore` に除外を追加した。
- 単体・統合テストと設定・コマンドのリファレンスを更新した。
- 検証: runner の `npm run test:unit` は failed。`tests/src/cli-verb-taxonomy.test.ts` が `config` のサブコマンドを `["init","migrate-members","scaffold"]` と期待しているが、新設した `show` が加わり不一致になっている。このテストは変更ファイルに含まれず未更新。他の runner 検証（lint・typecheck・統合テスト・schema）は passed。

## 2. 変更ファイル

- `.gitignore`: ローカル設定 `.specdojo/specdojo.local.config.json` を git の管理対象外にする除外を追加した。
- `docs/ja/specdojo/references/command-reference.md`: 新設した `config show` と、`where exec`・`config init` のローカル設定に関する挙動を追記した。
- `docs/ja/specdojo/references/specdojo-config-reference.md`: ローカル設定ファイルの位置、上書きできるキーの許可リスト、worktree での `SPECDOJO_LOCAL_CONFIG` の扱いを追記した。
- `docs/specdojo/schemas/v1/exec-evidence.schema.yaml`: executor evidence にローカルで上書きした項目を示す `local_config_overrides` を追加した。
- `src/exec/agent-protected-config.ts`: ローカル設定が既存の `.specdojo/` の保護範囲に含まれ、生成物扱いにならないことをコメントで明示した。
- `src/exec/commands.ts`: `where exec` などでローカル由来の値を示す処理を追加した。
- `src/exec/evidence.ts`: evidence に `local_config_overrides` を記録する処理を追加した。
- `src/exec/run/agent.ts`: agent 起動時の子のプロセスへ `SPECDOJO_LOCAL_CONFIG` を渡すようにした。
- `src/exec/trial-core.ts`: ローカル設定の読み込みと上書き後の設定を使うように変更した。
- `src/exec/worktree-command.ts`: worktree 関連コマンドで本体側のローカル設定を参照するようにした。
- `src/exec/worktree.ts`: worktree の build などの子のプロセスに、本体の作業ツリーのローカル設定のパスを環境変数で渡すようにした。
- `src/shared/specdojo-config.ts`: 設定の読み込みにローカル設定の統合を組み込んだ。
- `src/shared/specdojo-gitignore.ts`: `config init` が `.gitignore` にローカル設定を足すようにした。
- `tests/setup/git-environment.ts`: テスト共通 setup を、ローカル設定の環境変数がテストに漏れないように調整した。
- `tests/src/exec/agent-protected-config.test.ts`: ローカル設定が `.specdojo/` の範囲で保護され、`GENERATED_PATHS` に入らないことを検証するテストを追加した。
- `src/shared/local-config.ts`: 新規。ローカル設定の読み込み、許可キーの検証、`repos` の差し替え・追加、`SPECDOJO_LOCAL_CONFIG` の解決を実装した。
- `tests/src/shared/local-config.integration.test.ts`: 新規。実 Git の linked worktree でローカル設定の解決と環境変数の扱いを検証する統合テスト。
- `tests/src/shared/local-config.test.ts`: 新規。ローカル設定の許可リスト検証、パス差し替え、リポジトリ追加の単体テスト。

## 3. 申し送り

- `npm run test:unit` が失敗している。`tests/src/cli-verb-taxonomy.test.ts` の `config` サブコマンドの期待値に `show` を足す必要がある。次のアクション: 期待値を `["init","show","migrate-members","scaffold"]` に更新して再実行する。
- 保護の一覧 `PROTECTED_EXACT_PATHS` にはローカル設定を足していない。既存の `.specdojo/` の範囲で保護され、`GENERATED_PATHS` にも入らないことをテストとコメントで固定した。完全一致の一覧に足すと、保護された .specdojo/claude/settings.edit.json の deny 一覧と一致させるテストが失敗するため。
- 決定: `SPECDOJO_LOCAL_CONFIG` は linked worktree の中でだけ受け付ける。本体の作業ツリーでは自分のファイルだけを読む。runner の子のプロセスが別のリポジトリ（`external_projects` の委譲先など）を操作したときの漏れを防ぐため。linked worktree で環境変数が無い場合は本体の作業ツリーのファイルを読み、worktree 内の同名ファイルは読まない。
- 決定: ローカルで追加したリポジトリには共有の `repos` と同じキーを許可する。既存のリポジトリの上書きでは name・path だけを許可する。上書き後の設定は共有の設定と同じ検証を通る。
- 決定: ローカルで宣言したリポジトリは、orchestrator の定義の「repos で宣言されたプロダクトリポジトリ」に含める。exec が repos の一員として扱い（プロダクト worktree・commit の許可範囲・orchestrator launch の許可対象）、ローカル設定は保護されていて利用者だけが書けるため。
- 保護された設定の変更案（利用者の承認のもと feature ブランチで反映）: .agents/specdojo-orchestrator.agent.md と各環境のラッパーで、「`specdojo.config.json` の project に `repos` で宣言されたプロダクトリポジトリは参照してよい。」を「`specdojo.config.json` の project に `repos` で宣言されたプロダクトリポジトリ（`.specdojo/specdojo.local.config.json` で追加・パスを差し替えたものを含む。`specdojo config show` で確かめる）は参照してよい。」に変える。
- CHANGELOG に書く事項（CHANGELOG.md は未変更）: 区分 Added。文案「git で管理しないローカル設定 `.specdojo/specdojo.local.config.json` で、`repos[].path` の差し替えとローカルのリポジトリの追加をできるようにした。worktree の子のプロセスには `SPECDOJO_LOCAL_CONFIG` で本体の作業ツリーのファイルを渡す。`specdojo config show` を追加し、`where exec` と executor evidence の `local_config_overrides` でローカル由来の値を示す。`config init` は `.gitignore` にこのファイルを足す。（PJR-NC9R）」

## 4. 進め方

個票の決定に沿い、許可リスト方式のローカル設定を共有の設定の上に重ねる形で実装した。worktree には親が本体のファイルのパスを環境変数で渡す。ドキュメントとテストも更新した。ただし runner の単体テストに失敗が 1 件残っており、完了前に解消が必要である。
