---
specdojo:
  id: prj-0001:pjr-k332-per-item-executor-assignment
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T11:21:58Z"
  block_reason: "agent exited with non-zero code: runner による検証 `test-integration` が失敗（exit 1）しているため。"
---

# PJR-K332 register の並行実行で項目ごとに executor を指定できるようにする

## 1. 概要

`exec run --register A B C --worktree --parallel 3` は項目を並行で走らせるが、`--executor-by` は全項目で 1 つしか指定できない。複数の provider に作業を分散できず、**rate limit が 1 つの provider に集中する。** 項目ごとに executor を指定できるようにする。

## 2. 事実

### 2.1. 現在の挙動

register の実行では `--executor-by` を全項目で共有する。項目ごとに executor を変える手段はない。

| 方法                        | 結果                                                                   |
| --------------------------- | ---------------------------------------------------------------------- |
| 1 回の起動で `--parallel`   | 並行で走る。executor は全項目で同じ                                    |
| executor ごとに起動を分ける | プロジェクト単位のロックで直列になる（[[prj-0001:pjr-4hbg-exec-run]]） |

### 2.2. 分散が必要になった経緯

2026-09-26 に codex が rate limit にかかり、作業の途中で agy へ切り替えた（[[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]]、[[prj-0001:pjr-h5z7-cdfd-3-bps-2-grade-finding]]）。`codex-expert-executor`、`agy-expert-executor`、`agy-claude-expert-executor` の 3 つを並行で使えれば、1 つの provider の枠に依存しない。

### 2.3. reporter は直列になる

`gemma-reporter` は opencode 系で、`exec-defaults.yaml` の `max_concurrency: 1` により 1 件ずつ動く。ローカルの Ollama を共有するためである。executor を分散しても reporter 段は順番に待つ。**本項目では reporter の直列は変えない。**

## 3. 対応の候補

| 案  | 指定方法                                                              | 利点                           | 懸念                                 |
| --- | --------------------------------------------------------------------- | ------------------------------ | ------------------------------------ |
| 1   | `--executor-by PJR-A=codex-expert-executor,PJR-B=agy-expert-executor` | 起動時にまとめて指定できる     | 引数が長くなる                       |
| 2   | 個票の frontmatter に executor を固定する                             | 項目の性質に合わせて決められる | 個票の編集が必要。起動時に変えにくい |
| 3   | 候補の一覧を渡し、runner が項目へ順に割り当てる                       | 指定が短い                     | どの項目にどれが当たるか読みにくい   |

**案 1 を起点とする。** 既存の `--executor-by <nickname>` を拡張する形で、項目の指定がない場合は従来どおり全項目へ適用する。schedule のタスクには `pinnedExecutor` があり、案 2 に当たる仕組みが既に存在する。register でも併用できるかを確認する。

## 4. 完了条件

- 1 回の起動で、項目ごとに異なる executor を指定して並行実行できる。
- 項目を指定しない従来の `--executor-by <nickname>` の挙動が変わらない。
- 指定した項目 ID が起動対象に含まれない場合、エラーで失敗する。黙って無視しない。
- provider ごとの `max_concurrency` が守られる。
- `--dry-run` で項目ごとの executor が確認できる。
- 単体テストと統合テストがある。
- `exec-operation-guide.md` に使い方が記載されている。

## 5. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ                                                          |
| --- | ----------------------------------- | ---- | ---- | ------------------------------------------------------------- |
| 1   | 指定方法を決める                    | ARC  | done | 案 1 (`--executor-by PJR-X=...`) を採用                       |
| 2   | `pinnedExecutor` との関係を確認する | DEV  | done | 本件の完了要件には含まれないため、 CLI 指定（案 1）のみ実装。 |
| 3   | 実装する                            | DEV  | done | `parseRegisterExecutorSelection` 等を追加                     |
| 4   | テストを追加する                    | DEV  | done | 単体・統合テストを追加                                        |
| 5   | ガイドへ記載する                    | OPS  | done | `exec-operation-guide.md` 更新                                |

## 6. 対応結果

案 1 の `--executor-by PJR-A=codex,PJR-B=agy` 形式での個別指定を実装しました。項目別指定は起動対象の全項目を指定する必要があり、起動対象外の ID、指定漏れ、重複指定がある場合は状態遷移前にエラーで失敗します。全項目で共通指定する従来の `--executor-by <nickname>` とも互換性を保ち、`--dry-run` では項目ごとの解決結果を表示します。

また、`ProviderConcurrencyGate` を導入し、並列 register pipeline の executor／reporter が agent プロセスの実行中だけ provider 枠を取得することで、provider ごとの `max_concurrency` が守られるように実装しました。

## 7. 関連ドキュメント

- [[prj-0001:pjr-4hbg-exec-run]]
- `src/exec-run.ts`
- `.specdojo/exec-defaults.yaml`
- `docs/ja/specdojo/guides/exec-operation-guide.md`
