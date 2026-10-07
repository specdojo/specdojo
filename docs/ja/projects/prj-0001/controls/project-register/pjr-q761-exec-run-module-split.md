---
specdojo:
  id: prj-0001:pjr-q761-exec-run-module-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-10-02T12:14:06Z"
---

# PJR-Q761 exec-run.ts の分割方針を決める

## 1. 背景

2026-10-08 時点で 7,948 行の `src/exec-run.ts` を、準備・agent の起動・親検証・統合・再開の段階ごとのモジュールへ分ける方針と、初回と再開の経路を 1 つの状態遷移にまとめる方法を決める（v0.3.0 の公開後）

## 2. 検討した選択肢

| 選択肢                          | 内容                                                                                                                                | 利点                                                                                                                                          | 懸念                                                                                                      | 既存テストへの影響                                                                       | 作業量 | 切り出し順序                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------- |
| A: モジュール分割のみ           | 現在の初回 / 再開分岐と `pipeline-state.json` を維持し、準備、agent、親検証、reporter、統合、Register、CLI をファイルへ移す         | 振る舞いと schema の変更がなく、レビューと切り戻しが容易。ファイルサイズを早く減らせる                                                        | orchestration の重複と暗黙の開始段判定は残る。分割後も複数 module に似た分岐が残る                        | import 先の変更と `exec-run.ts` の再 export を確認。既存 E2E の期待値は原則不変          | 中     | contract / 純粋 helper → agent → pipeline → domain runner → CLI           |
| B: 分割と状態機械を一括導入     | module 分割と同時に `prepare -> executor -> parent_validation -> reporter -> integrate -> cleanup -> done` の明示的遷移へ置き換える | 初回と再開を 1 つの loop で扱え、重複を最も早く解消できる                                                                                     | 大きな差分で、分割による移動と挙動変更の原因を切り分けにくい。checkpoint 互換と失敗復旧の回帰リスクが高い | 全 pipeline / Register / repository 統合 E2E の更新と、旧 state 互換 fixture が必要      | 大     | contract と schema → state machine → 全経路移行 → CLI                     |
| C: 段階的分割後に状態機械を導入 | 現行挙動のまま下位層から切り出し、characterization test を追加した後、開始段判定だけを純粋な遷移関数へ寄せる                        | 各段階で既存テストと差分を照合できる。既存の `runAgentPipeline` / `runReporterStage` / `finalizeRegisterWorktreeRun` という合流点を活用できる | 移行中は façade と旧分岐が併存し、一時的にファイル数と adapter が増える                                   | 前半は期待値不変。後半で初回・各再開の遷移列、失敗 checkpoint、旧 state 互換 test を追加 | 中〜大 | contract / 選択 → agent → pipeline → Register / Schedule → 状態遷移 → CLI |

調査時点の推奨は C。最初に共有 contract、純粋な option / agent 選択、`executeAgent` / `runWithRetry` を切り出し、次に `runReporterStage` と親検証を共通 pipeline module へ移す。`exec-run.ts` は既存 test と外部利用のため再 export façade として残す。これは決定ではなく、採否は v0.3.0 公開後に本個票の決定内容と承認を更新して確定する。

## 3. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 4. 採択理由

- _TODO_: 判断根拠を記載する。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 7. 関連ドキュメント

- [[prj-0001:pjr-wpr3-exec-run-split-investigation|PJR-WPR3 exec-run.ts の分割方針の調査と選択肢の比較]]
