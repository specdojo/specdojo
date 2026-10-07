---
specdojo:
  id: prj-0001:pjr-69vp-multi-repo-e2e-docs
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-01T03:54:10Z"
  completed_at: "2026-10-07T11:43:00Z"
  conclusion: 3 リポジトリ構成の e2e・失敗と再開・回帰を統合テストで確かめ、文書と CHANGELOG を更新した。実 agent CLI（claude・codex・antigravity）でプロダクトリポジトリへの書き込みを確認する script を追加し、3 つとも成功した
---

# PJR-69VP 複数リポジトリ構成の実構成検証と文書の更新

## 1. 概要

2 リポジトリの統合テストと e2e で動作を確かめ、docs-structure-guide・exec のガイド・CHANGELOG・移行ガイドを更新する（v0.3.0）

## 2. 完了条件

- 方針は [[prj-0001:pjr-5822-multi-repo-item-design]] の決定内容に従う。変更箇所は同個票の「現行実装の変更箇所」を起点にする。
- プロジェクトリポジトリ 1 つとプロダクトリポジトリ 2 つの構成を一時ディレクトリに作り、1 つの項目で 3 つのリポジトリを変更する exec run が、worktree の作成から統合・trace の記録まで通る e2e または統合テストがある。
- 同じ構成で、統合の各位置での失敗と再開が期待どおりになることを確かめる。
- 宣言を持たない構成（同一リポジトリ構成を含む）の回帰を確かめる。
- 実際の agent CLI（claude・codex・antigravity）でプロダクト worktree へ書き込めるかの確認手順を、一時ディレクトリに 3 リポジトリ構成を作るスクリプトまたはコマンドの列として `tools/` か result に用意する。agent の sandbox からは別の agent を起動できないため、確認の実行は orchestrator が行う。
- opencode の `permission.external_directory` を変える場合の差分案（保護された agent 定義のため変更はしない）を result の申し送りに書く。
- 統合 commit の `Refs:` が `<project-id>:<item-id>` になっていることを、統合テストで確かめる（PJR-30SW）。
- 2026-10-01〜02 の 1 回目の実行（claude）の差分の控えは `/workspaces/specdojo-workspace/specdojo/logs/pjr-69vp-attempt1.patch` にある（e2e と文書 5 件）。その後に develop へ入った PJR-9KST・PJR-GENJ・PJR-6RN3 の変更を踏まえて作り直す。`CHANGELOG.md` の更新を忘れない。
- `docs-structure-guide` の「別リポジトリ構成」（「現行実装の境界」「二重 worktree」の各章）、exec のガイド、`CHANGELOG.md`、v0.3.0 の移行ガイドを、実装後の動作に合わせて更新する。
- 宣言（`repos`）を持たない project の動作が変わらないことを、既存のテストと回帰テストで確かめる。
- `.specdojo/exec-defaults.yaml`・`package.json` など agent が変更できない設定は変更しない。必要な変更は result の申し送りに書く。
- 親検証（lint・test・typecheck・validate-schema）がすべて通る。

## 3. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ                                                       |
| --- | ----------------------------------- | ---- | ---- | ---------------------------------------------------------- |
| 1   | 3 リポジトリ構成の e2e              | DEV  | done | `tests/src/exec-register-pipeline-e2e.integration.test.ts` |
| 2   | 失敗と再開の検証                    | DEV  | done | app1・app2・project の各位置（PJR-9KST のケースを拡張）    |
| 3   | 宣言のない構成の回帰                | DEV  | done | 同じテストファイルの回帰ケース                             |
| 4   | ガイド・CHANGELOG・移行ガイドの更新 | DEV  | done | 文書 5 件と `CHANGELOG.md` を更新                          |
| 5   | 実 agent CLI の確認手順             | DEV  | done | `tools/exec/verify-multi-repo-agent-write.sh`              |

## 4. 対応結果

- 実施内容（2 回目）: 1 回目の差分の控えを、PJR-9KST・PJR-GENJ・PJR-6RN3 の後の develop に合わせて作り直した。PJR-9KST が失敗位置ごとの再開テストを `tests/src/exec-register-pipeline-e2e.integration.test.ts` に入れていたため、別ファイルを作らず、同じファイルの fixture（プロジェクトリポジトリ 1 つとプロダクトリポジトリ 2 つ、`app2` は `integration_branch` を宣言）にケースを加えた。
- 3 リポジトリの e2e: 新しい executor `exec-multi-repo` がプロジェクト worktree とプロダクト worktree 2 つへ書き込み、実際の CLI 経路の `exec run --register --worktree` が、worktree の作成から統合・trace の記録・撤去まで通ることを確かめる。agent の `cwd` が `<worktree_base>/<task>/project/` であることも確かめる。
- 統合の失敗と再開: PJR-9KST の `app1`・`app2`・project の各位置のケースに、失敗後に全リポジトリの worktree が残ること、プロジェクトが未統合であること、再開後の `Refs:` と result の trace 表の merge commit を確かめる検査を加えた。
- `Refs:`: プロダクト側の commit・merge commit とプロジェクト側の merge commit が `Refs: <project-id>:<item-id>` を持つことを、統合テストで確かめる（PJR-30SW）。
- 回帰: `repos` を宣言しない構成で、`<worktree_base>/<task-id>/` 直下の worktree、修飾した `Refs:`、trace の章を持たない result、`integrate.repos` が無い pipeline state を確かめる。
- 文書: `docs-structure-guide` の「別リポジトリ構成」（採用条件、現行実装の境界、複数リポジトリの worktree と統合順序、複数リポジトリの統合の失敗と再開）、`exec-worktree-guide`、`exec-operation-guide`（再開前の取り込みで統合済みのプロダクトを除くこと）、`specdojo-config-reference` の古い記述、v0.3.0 移行ガイドを実装後の動作に合わせて更新した。
- 補完（3 回目）: 2 回目の result で未完了とされた `CHANGELOG.md` は orchestrator による取り込み済みであることを確認した。project・app1・app2 の 3 リポジトリを一時ディレクトリに作り、claude・codex・antigravity が project を `cwd` としたまま app1 と app2 の両方へ書き込めるかを検査する `tools/exec/verify-multi-repo-agent-write.sh` を追加した。実 agent CLI の起動は引き続き orchestrator または利用者が行う。

### 4.1. orchestrator による取り込み（2026-10-02）

- 2 回目の実行（claude-expert-executor / claude-reporter）は、文書 5 件の更新と 3 リポジトリの e2e を終えて親検証 7 種を通したが、`CHANGELOG.md` と `tools/` が executor の書き込み許可の外にあり、完了と判断できず `waiting` で止まった。
- worktree の差分（文書 5 件と `tests/src/exec-register-pipeline-e2e.integration.test.ts`）を orchestrator が develop へ取り込み、`CHANGELOG.md` に複数リポジトリ対応・`Refs:` の修飾・PJR-GENJ の修正を追記した（`319dc427`）。`npm run check`（1967 件）が通過した。

### 4.2. 実際の agent CLI での書き込みの確認手順

agent の sandbox から別の agent CLI は起動しない。orchestrator または利用者が次のスクリプトを実行する。実 provider の quota を消費するため、provider ごとに確認するときは `all` の代わりに `claude`・`codex`・`antigravity` のいずれかを指定する。

```bash
tools/exec/verify-multi-repo-agent-write.sh all
```

スクリプトは project・app1・app2 を別々の Git リポジトリとして作り、runner が付ける引数（`src/exec-task-repos.ts` の `agentExtraRootArguments`）と同じ形で、各 provider に app1・app2 の追加ルートを渡す。各 provider が両方のプロダクトリポジトリへ `OK` を書けた場合だけ成功する。成功時は一時ディレクトリを削除し、失敗時または `KEEP_TMP=1` の指定時は調査用に残す。

### 4.3. 実際の agent CLI での確認の結果（2026-10-07）

3 回目の実行（codex）では、executor が script を「agent の sandbox から別の agent CLI を起動しない」として `not_run` と記録した。runner は runner が実行しないコマンドの `not_run` を満たせないため、親検証がすべて通っても waiting になった。この問題は別の issue で扱う。

orchestrator（claude）が利用者の指示で worktree から `tools/exec/verify-multi-repo-agent-write.sh all` を実行し、claude・codex・antigravity の 3 つとも、project を `cwd` としたまま app1 と app2 の両方へ `OK` を書けた（終了コード 0、56 秒）。script と個票の変更は、runner を経ずに orchestrator が develop へ取り込んだ。

### 4.4. opencode の `external_directory` の差分案

opencode の agent 定義（`.opencode/agents/*.md`、12 件）は `permission.external_directory: deny` で作業ディレクトリ外への書き込みを拒否するため、opencode の executor はプロダクト worktree へ書き込めない。保護された設定のため変更していない。opencode の executor でもプロダクトを変更する場合の案は次のとおり。

- 対象は executor の agent 定義だけとし、reporter と review の agent 定義は `deny` のまま残す。
- `external_directory` を一律の `deny` から、worktree の置き場だけを許す指定へ変える。_ASSUMPTION_: opencode の `permission.external_directory` がパスのパターンごとの指定を受け付けること。採用する前に opencode の文書で書式を確かめる。

```yaml
permission:
  external_directory:
    "/workspaces/specdojo-workspace/worktrees/**": allow
    "*": deny
```

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
- [[prj-0001:pjr-p7hy-multi-repo-single-item]]
- [[specdojo:docs-structure-guide]]
