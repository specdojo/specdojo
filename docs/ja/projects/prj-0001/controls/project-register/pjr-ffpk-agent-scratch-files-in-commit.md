---
specdojo:
  id: prj-0001:pjr-ffpk-agent-scratch-files-in-commit
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-27T05:23:34Z"
  completed_at: "2026-09-27T08:28:53Z"
  block_reason: "agent exited with non-zero code: 親 runner の検証 `test-integration`（`id: test-integration`, `command: npm run test:integration`）が `status: failed`（exit 1）で記録されている。executor 自身の検証（`prettier` / `markdownlin…"
  conclusion: register 由来タスクの commit 範囲を、HEAD に無い新規ファイルは成果物ディレクトリと targets に限るよう絞り、除外した変更は commit-scope 警告と integrate.log に残す。ready 昇格検査は commit 対象だけを見る。共通規約に一時ファイルの置き場所と削除を追記した
---

# PJR-FFPK agent の一時ファイルが register 実行の commit に入り統合前の検査も誤って止める

## 1. 概要

`agy-expert-executor` は、成果物の編集にリポジトリ直下の作業用スクリプトを使い、終了後も残す。2026-09-27 の実行で観測した事例は次のとおり。

| 項目     | 残ったファイル                                                                                  | 結果                                 |
| -------- | ----------------------------------------------------------------------------------------------- | ------------------------------------ |
| PJR-06RE | `modify.py`、`modify_md.py`、`modify_sch.py`、`patch.py`、`result-patch.py`、`test-schema.yaml` | 統合前の検査で停止（下記）           |
| PJR-6V3D | `patch.js`                                                                                      | develop へ commit された（84f567e4） |
| PJR-QQXP | `count-sections.js`、`count-sections.cjs`、`test-regex.js`                                      | develop へ commit された（33384287） |
| PJR-N03W | `patch_test_2.ts`、`patch_test_3.ts`                                                            | develop へ commit された（eb423175） |

問題は 2 つある。

1. register 由来のタスクは、commit 対象を許可リストで絞らない。`src/exec-worktree-ops.ts` は `origin: register` の場合に scope を返さず、作業ツリーの差分から除外リストの分を除いてすべて commit する（個票が `targets` を宣言していても同じ）。そのため、成果物ではない一時ファイルが develop に入る。PJR-3S8Q の追記にある PJR-0DA8 の事例（`settings.report.json` の作成が通過した）も、同じ経路である。
2. ready への昇格を禁じる検査（`assertNoAgentReadyPromotion`）は、commit 対象に絞る前の変更パス全体を見る。`status: ready` を含む一時ファイル `test-schema.yaml` を成果物の昇格とみなし、06RE の統合を止めた。

schedule 由来の edit タスクは、plan の `targets` から許可リストを導くため、この問題は起きない。

## 2. 完了条件

- register 由来のタスクで、成果物ではない一時ファイル（リポジトリ直下などに新規作成された未追跡ファイル）が commit されない。方式は次のいずれか、または組み合わせとし、選んだ理由を対応結果に記録する。
  - 個票の `targets` と、実行計画が変更対象として示すパスから許可リストを導く。
  - 許可リストが導けない場合でも、新規の未追跡ファイルは既知の成果物ディレクトリ（`docs/`、`src/`、`tests/`、`tools/grade/`、`packages/docs-site/.vitepress/` など）に限る。
- commit されなかった変更は、`commit-scope:` の警告としてログと evidence に残る。
- ready 昇格の検査が commit 対象のパスだけを見る。許可リスト外の一時ファイルがあっても統合は止まらず、許可リスト内の成果物を ready へ上げた場合は従来どおり止まる。
- plan に共通で入る規約（exec plan 共通規約の断片）に、「作業用のファイルはリポジトリの外（一時ディレクトリ）に置き、終了前に削除する」と明記されている。
- 上記の commit 範囲と ready 昇格の検査を確かめる単体テスト、または統合テストがある。
- `npm run test:unit` と `npm run test:integration` が成功する。

### 2.1. 2 回目の実行で失敗した統合テスト（2026-09-27 追記）

agy-expert-executor による 2 回目の実行（`src/exec-worktree-ops.ts`、共通規約テンプレート、統合テスト 2 件を変更）は、runner の `test-integration` で失敗した。orchestrator が worktree で統合テストを実行すると、115 件中次の 2 件が失敗した（いずれも `expected false to be true`）。1 件ずつの実行なので、負荷によるものではない。

- `resumes only the reporter stage and completes the item without re-running the executor`
- `restarts a stale running executor in the existing worktree and completes the pipeline`

どちらも既存の再開経路のテストである。commit 範囲を絞る変更が、reporter の段からの再開や executor の再起動で commit すべき変更（result・evidence・成果物）を除外していないか確認し、上記 2 件を含む `npm run test:integration` が成功することを完了条件に加える。

## 3. 作業内容

| No  | 作業                                                           | 担当 | 状態 | メモ                                                          |
| --- | -------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------- |
| 1   | register 由来タスクの commit 範囲を絞る方式を決めて実装する    | DEV  | done | 既知のディレクトリ外の新規ファイルを除外（targets は許可）    |
| 2   | `assertNoAgentReadyPromotion` の対象を commit 対象のパスに限る | DEV  | done | commit 対象を絞った後のパスだけを検査する                     |
| 3   | exec plan 共通規約へ、一時ファイルの置き場所と削除を追記する   | DEV  | done | provider を問わず plan 本文経由で伝わる                       |
| 4   | テストを追加する                                               | DEV  | done | 統合テスト 3 件を追加し、再開経路の fixture を `docs/` へ移す |

## 4. 対応結果

- `src/exec-worktree-ops.ts` の `partitionCommitTargets` で、`origin: register` のタスク（人間の作業を除く）は、HEAD に存在しない新規ファイルを次のいずれかに置かれたものに限って commit する。それ以外は `outOfScope` として worktree に残す。
  - 既知の成果物ディレクトリ（`docs/`、`src/`、`tests/`、`tools/`、`scripts/`、`packages/`）。
  - HEAD で追跡済みの最上位ディレクトリ（利用プロジェクト固有の構成に追従するため）。
  - 対象 task の result と evidence 配下、plan の `targets` から doc-index で解決した成果物。
- 方式の選定理由: register 由来のタスクは `targets` を宣言しないことが多く、許可リストだけに頼ると正当な成果物の変更が commit されなくなる。既存ファイルの変更と削除は従来どおり commit し、新規ファイルだけを既知のディレクトリへ限れば、観測した一時ファイル（リポジトリ直下の `modify.py`、`patch.js`、`test-schema.yaml` など）を除外できる。`targets` が解決できる場合は、そのパスも許可する。
- commit しなかった変更は、従来の `commit-scope:` 警告を標準出力へ出すのに加え、`commitWorktreeChanges` の `scopeLogPath` で run の evidence ディレクトリの `integrate.log` へ追記し、同じ commit に含める（`src/exec-run.ts` の schedule と register の両経路で指定）。
- `assertNoAgentReadyPromotion` は、絞った後の commit 対象だけを受け取る。一時ファイルが `status: ready` を含んでも統合は止まらず、commit 対象の成果物を ready へ上げた場合は従来どおり止まる。
- `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` に、作業用のファイルはリポジトリの外（一時ディレクトリ）に置き、終了前に削除するという規約を追記した。`docs/ja/specdojo/guides/exec-worktree-guide.md` にも、register 由来のタスクの commit 範囲を追記した。
- 2 回目の実行で失敗した統合テスト 2 件の原因: `tests/src/exec-register-resume.integration.test.ts` の fake executor が、成果物をリポジトリ直下（`pipeline-artifact.md`）へ書いていた。新しい規則ではこれが一時ファイルと同じ扱いで除外される。result・evidence・成果物を除外する不具合ではないため、fixture の成果物を `docs/pipeline-artifact.md` へ移した。同じ理由で、`tests/src/exec-register-pipeline-e2e.integration.test.ts` の申し送り適用マーカーも `docs/protection-applied` へ移した。
- `tests/src/exec-worktree-ops.integration.test.ts` に次の 3 件を追加した。
  - 一時ファイルが commit されず、`integrate.log` に記録され、merge が止まらないこと。
  - 追跡済みのルートファイルの変更と、`targets` から解決した成果物は commit されること。
  - commit 対象の成果物の ready 昇格は、従来どおり止まること。

## 5. 関連ドキュメント

- [[specdojo:exec-worktree-guide]]
- `src/exec-worktree-ops.ts`（commit scope の解決、`assertNoAgentReadyPromotion`）
- PJR-3S8Q（agent の書き込み範囲の決定。PJR-0DA8 の事例）
