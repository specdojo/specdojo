---
specdojo:
  id: prj-0001:pjr-g8tb-docs-sync-4hbg-36cn-e2q3
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-09-28T15:26:56Z"
---

# PJR-G8TB 4HBG・36CN・E2Q3 の変更を利用者向けドキュメントへ反映する

## 1. 概要

PJR-F346 で 2026-09-26〜28 の変更を利用者向けドキュメントへ反映したが、着手時点で未完了だった次の 3 件は対象外とした。各項目の executor が関係するガイドとリファレンスの一部を更新しているが、概要・入門のガイドなど横断的な文書への反映は確認していない。

| 項目     | 変更                                                                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PJR-4HBG | `exec run --register --worktree --join` で実行中の run に合流して並行実行できる。上限は `run.max_concurrent_runs`。provider・root の遷移と統合・親検証をプロセスを跨いで枠で直列化する。`exec slots` で枠の使用状況を確認できる |
| PJR-36CN | 統合時にイベントファイルが競合した場合、両側のイベントの和集合で解決する                                                                                                                                                        |
| PJR-E2Q3 | `exec run --plan` / `--deliverable` で `--executor-by` / `--reporter-by` を指定すると executor/reporter の 2 段で実行する。`--by` に pipeline 用の agent を指定すると実行前に案内のエラーになる                                 |

## 2. 完了条件

- 上表の変更について、`docs/ja/specdojo/guides/`（とくに `specdojo-overview-guide.md`、`quick-start-guide.md`、`exec-operation-guide.md`、`exec-worktree-guide.md`、`exec-config-guide.md`、`register-operation-guide.md`、`review-guide.md`、`orchestrator-operation-guide.md`）、`docs/ja/specdojo/references/`、リポジトリの `README.md` を確認し、実装と食い違う記述を直している。
- 「実行中の run があると別の run は待つ・並行できない」という記述が残る場合は、`--join` による合流を併記している。
- 成果物の review を plan から実行する手順が、executor と reporter の指定を含めて書かれている。
- 各項目の個票に書かれた仕様を正とし、ドキュメントに合わせて実装を変えない。判断できない食い違いは変更せずに対応結果へ列挙する。
- 章の参照は章タイトルで書き、`.github/instructions/markdown.instructions.md` に従う。
- `npm run -s lint:md` が成功する。
- 変更したドキュメントと、確認したが変更不要だったドキュメントを対応結果に一覧で記録する。

## 3. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ                 |
| --- | -------------------------------------------------- | ---- | ---- | -------------------- |
| 1   | 3 項目に関係する記述を検索し、食い違いを一覧にする | DEV  | open | -                    |
| 2   | ガイド・リファレンス・README を直す                | DEV  | open | 個票の仕様を正とする |
| 3   | lint を通し、対応結果に一覧を記録する              | DEV  | open | -                    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-F346（先行の反映）、PJR-4HBG、PJR-36CN、PJR-E2Q3
- [[specdojo:exec-operation-guide]]、[[specdojo:exec-worktree-guide]]、[[specdojo:specdojo-overview-guide]]
