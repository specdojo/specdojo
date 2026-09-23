---
specdojo:
  id: prj-0001:pjr-9qz2-exec-stale-running-stage
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-07T22:40:48Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-08T03:40:51Z"
---

# PJR-9QZ2 中断した exec の executor 段が running のまま残り resume できない

## 1. 概要

`exec run` のプロセスが異常終了すると、`pipeline-state.json` の executor 段が `running` のまま
残る。`--resume` は再開を拒否し、`--force-restart` で worktree ごと破棄して全体を再実行する
しか手段がない。

## 2. 観測した事実

PJR-MBVM の実行で発生した。executor は実装を完了し、reporter も動作していたが、プロセスが
途中で終了した。

残った状態は次のとおりである。

```json
"executor": { "status": "running", "attempts": 0, "completed_at": null, "artifact_ref": null }
```

evidence ディレクトリの内容が、正常終了した PJR-20DV と異なる。

| 項目                  | PJR-20DV | PJR-MBVM |
| --------------------- | -------- | -------- |
| `pipeline-state.json` | あり     | あり     |
| `evidence.json`       | あり     | **なし** |
| `executor.log`        | あり     | **なし** |

executor の結果が永続化されていないため、`--resume` が再利用できる成果が存在しない。拒否
そのものは正しい挙動である。

```text
resume refused: PJR-MBVM: executor stage is "running" for run 20260907T135232836Z-915afd37;
re-run the item instead
```

一方で、実際の成果物は worktree に未コミットで存在していた。`src/grade.ts`、
`tests/src/grade.test.ts`、`docs/ja/specdojo/references/command-reference.md` の変更である。
状態の記録だけが失われ、成果は残っていた。

## 3. 問題点

- executor の成果が worktree に存在しても、状態が `running` であるだけで再利用できない。
- 状態をリセットする手段が CLI に存在しない。`exec` のサブコマンドに該当する操作がない。
- 復旧経路が `--force-restart` のみで、完了済みの executor 出力と codex 呼び出し1回分を捨てる。
- 長時間実行や複数項目の実行では損失が大きくなる。

## 4. 完了条件

- executor の完了時点で `evidence.json` と `executor.log` が永続化され、プロセスが異常終了しても
  残る。
- `running` のまま残った状態から復旧する手段がある。状態をリセットするか、worktree の内容を
  根拠に再開できる。
- 復旧手段が `--force-restart` 以外に存在し、コマンドリファレンスに記載されている。
- 中断を模した状態から復旧できることを検証するテストを追加する。

## 5. 作業内容

| No  | 作業                                          | メモ                          |
| --- | --------------------------------------------- | ----------------------------- |
| 1   | executor 完了時の evidence 永続化を確認・修正 | 親検証より前に checkpoint     |
| 2   | 状態リセットまたは再開の手段を設計            | `--resume` で executor 再実行 |
| 3   | コマンドリファレンスへ復旧手順を記載          | 完了                          |
| 4   | 中断状態からの復旧テストを追加                | unit / integration を追加     |

## 6. 対応結果

- executor の終了直後に `executor.log` / `evidence.json` と succeeded state を保存し、その後に
  親検証結果を evidence へ追記する順序へ変更した。親検証中に中断した場合は、再開時に不足または
  失敗した親検証を更新して reporter へ進む。
- executor が `running` のまま残り evidence が無い場合も、`--resume` で既存 worktree、plan、
  result を保持したまま executor を再実行できるようにした。
- stale state の選択、executor agent の復元、中断状態から統合完了までの復旧をテストへ追加した。
- 残課題はない。

## 7. 関連ドキュメント

- [[prj-0001:pjr-mbvm-grade-exclude-generated]]: この事象が発生した項目。
- [[prj-0001:pjr-m35p-protection-false-positive-generated]]: 同じ実行で判明した保護機構の問題。
