---
specdojo:
  id: prj-0001:pjr-9pz7-grade-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-26T10:28:16Z"
---

# PJR-9PZ7 grade の打ち切りが検出されず終了コード 0 で完了扱いになる

## 1. 概要

`tools/grade/run-per-document.sh` が対象の一部だけを処理して終了しても、終了コード 0 を返す。利用者は完了したと誤認する。実際に 5 文書を指定した実行が 2 文書で打ち切られ、終了コード 0 になった。

## 2. 事実

### 2.1. 観測した挙動

PJR-H5Z7 の grade を 5 文書へ指定して実行した。

```text
documents=5 exhausted=0
document complete: cdfd-action.md   （migrated_stage_total=3。前回状態の引き継ぎで完了扱い）
document complete: cdfd-check.md
document start:    cdfd-overview.md
[exited with code 0]
```

`document start` の 3 件目で出力が途切れ、終了コード 0 で終わった。BPS 2 件は `document start` すら出ていない。

### 2.2. 最終行が出ていない

script は全対象の処理後に集計行を出力する。

```sh
printf 'grade pipeline complete: selected=%s processed=%s completed_now=%s incomplete=%s exhausted=%s results=%s\n' \
  "${#selected_paths[@]}" "$processed" "$completed" "$incomplete_documents" \
  "${#exhausted_paths[@]}" "$results_file"
```

打ち切られた実行の出力に `grade pipeline complete` は**含まれていない**。完走した実行には含まれる。**この行の有無が唯一の判別手段**であり、終了コードでは区別できない。

### 2.3. set -euo pipefail が終了コードを奪っている

script 冒頭は `set -euo pipefail` である。ループ内でコマンドが非 0 を返すと、その時点で shell が終了する。`set -e` による終了は**終了したコマンドの終了コードを引き継ぐ**が、パイプや条件式の組み合わせによっては 0 になりうる。

今回は `| tail -20` を通しており、`PIPESTATUS` を見ずに `$?` を読むと `tail` の終了コード（0）になる。呼び出し側がパイプを使う限り、script の終了コードは伝わらない。

### 2.4. 前回状態の誤った引き継ぎ

`cdfd-action` は `migrated_stage_total=3` として「完了」と記録されたが、`graded_at` は 2026-09-17 のままで実際には評価されていない。3 段構成で失敗した pipeline 状態が、単段実行で完了扱いへ移行された。

`stages` は設定署名に含まれるため干渉しないと想定したが、**pipeline 状態ファイルは署名と独立に文書単位で保持されており、移行処理が働いた**。

## 3. 影響

| 影響                         | 内容                                                    |
| ---------------------------- | ------------------------------------------------------- |
| 未評価を評価済みと誤認する   | 古い `graded_at` の結果が残り、新しい判定と区別できない |
| 自動実行で検出できない       | routine から呼ぶ job も終了コードで判断する             |
| 打ち切りの原因が記録されない | どこで止まったかは出力の末尾からしか分からない          |

### 3.1. 同じ構造の問題が別に起きている

[[prj-0001:pjr-1y9p-resume-executor-plan]] は「未完了の作業が完了として記録される」問題を扱った。**本件は同じ性質が grade 側にある。** 段や文書の処理が途中で終わっても、成功として扱われる。

## 4. 完了条件

- 全対象を処理せずに終了した場合、終了コードが 0 にならない。
- 打ち切りの理由（rate limit、プロセス終了、失敗上限）が出力に残る。
- パイプ経由で呼んでも終了コードが失われない。呼び出し側の記述を運用ガイドへ示すか、script 側で対処する。
- `grade pipeline complete` の集計行が出ない状態を検出できる。
- 前回の pipeline 状態が段構成の異なる実行へ引き継がれない。または引き継ぐ場合は `graded_at` の鮮度を確認する。
- 部分的に完了した対象と未着手の対象を区別して報告する。
- job 定義（`job-grade-kata` / `job-grade-deliverable`）が打ち切りを失敗として扱う。
- 既存の正常な実行が失敗扱いにならない。

## 5. 対応の候補

| 案  | 内容                                                           | 利点                 | 懸念                          |
| --- | -------------------------------------------------------------- | -------------------- | ----------------------------- |
| 1   | `trap` で異常終了を捕捉し、未処理の対象を報告して非 0 で終える | 原因に近い           | `set -e` との相互作用の確認要 |
| 2   | 最後に `selected` と `processed` を比較し、不一致なら非 0      | 実装が単純           | 打ち切りの理由は分からない    |
| 3   | 文書ごとの結果を `results.tsv` へ逐次記録し、突合で検出する    | 既存の仕組みを使える | 呼び出し側の処理が要る        |

**案 2 を基本とし、案 1 を併せる。** 案 2 だけでも誤認は防げる。案 1 は原因の記録を加える。

### 5.1. 前回状態の引き継ぎ

`migrated_stage_total` の移行は、段構成を変えた再実行を容易にする意図と見られる。ただし**評価の実体がないまま完了扱いにする**のは誤りである。移行時に `graded_at` と現在の `content_hash` を照合し、古ければ未評価として扱う。

## 6. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                          |
| --- | -------------------------------------------- | ---- | ---- | ----------------------------- |
| 1   | 対応の候補から方針を決める                   | ARC  | open | 案 2 + 案 1                   |
| 2   | 打ち切りの検出と終了コードを実装する         | DEV  | open |                               |
| 3   | 前回状態の移行へ鮮度の確認を加える           | DEV  | open | `graded_at` と `content_hash` |
| 4   | job 定義が打ち切りを失敗として扱うか確認する | OPS  | open | `job-grade-*`                 |
| 5   | 運用ガイドへ手動実行時の注意を記載する       | OPS  | open | パイプと終了コード            |

## 7. 対応結果

-

## 8. 関連ドキュメント

- [[prj-0001:pjr-h5z7-cdfd-3-bps-2-grade-finding]]
- [[prj-0001:pjr-1y9p-resume-executor-plan]]
- [[prj-0001:pjr-w5jt-grade-single-stage-nightly]]
- `tools/grade/run-per-document.sh`
- `docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`
