---
specdojo:
  id: prj-0001:pjr-ffpk-agent-scratch-files-in-commit
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-09-27T05:23:34Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: error: interrupted"
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

## 3. 作業内容

| No  | 作業                                                           | 担当 | 状態 | メモ                                     |
| --- | -------------------------------------------------------------- | ---- | ---- | ---------------------------------------- |
| 1   | register 由来タスクの commit 範囲を絞る方式を決めて実装する    | DEV  | done | 既知のディレクトリ外の新規ファイルを除外 |
| 2   | `assertNoAgentReadyPromotion` の対象を commit 対象のパスに限る | DEV  | done | `partitionCommitTargets` 修正により解決  |
| 3   | exec plan 共通規約へ、一時ファイルの置き場所と削除を追記する   | DEV  | done | provider を問わず plan 本文経由で伝わる  |
| 4   | テストを追加する                                               | DEV  | done | 統合テストへ追加                         |

## 4. 対応結果

- `src/exec-worktree-ops.ts` の `partitionCommitTargets` を修正し、register 由来のタスク（`scope` が `null`）の場合、`git ls-tree` で `HEAD` に存在しない新規追加ファイルのうち、既知の成果物ディレクトリ（`docs/`、`src/`、`tests/`、`tools/grade/`、`packages/docs-site/.vitepress/` など）外のものを `outOfScope` として commit 対象から除外するよう実装しました。
- この方式を選んだ理由は、register 由来のタスクでは `targets` が宣言されないケースもあり、`targets` への依存を強いると従来動いていた正当な commit が弾かれる恐れがあったためです。「許可リストが導けない場合でも、新規の未追跡ファイルは既知の成果物ディレクトリに限る」というフォールバックとして実装することで、agent の一時スクリプト等だけを安全に除外できます。
- 課題であった `assertNoAgentReadyPromotion` については、呼び出し元である `commitWorktreeChanges` の時点で `partitionCommitTargets` から返された `targets` を引数に渡しているため、上記修正によって `test-schema.yaml` などの一時ファイルが `targets` に含まれなくなり、自動的に解消されました。
- `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` に「作業用のファイルはリポジトリの外（一時ディレクトリ）に置き、終了前に削除する」という規約を追記しました。
- `tests/src/exec-worktree-ops.integration.test.ts` に、register 由来タスクでの未追跡ファイル除外の振る舞いを検証するテストケースを追加しました。

## 5. 関連ドキュメント

- [[specdojo:exec-worktree-guide]]
- `src/exec-worktree-ops.ts`（commit scope の解決、`assertNoAgentReadyPromotion`）
- PJR-3S8Q（agent の書き込み範囲の決定。PJR-0DA8 の事例）
