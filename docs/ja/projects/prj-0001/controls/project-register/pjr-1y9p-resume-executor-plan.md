---
specdojo:
  id: prj-0001:pjr-1y9p-resume-executor-plan
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-26T07:46:13Z"
---

# PJR-1Y9P resume 後の executor が plan の未完了作業を引き継がず成功扱いになる

## 1. 概要

rate limit で中断した executor 段を `--resume` で再開したとき、再開後の executor が plan の未完了作業を引き継がず、着手済みの一部だけで `succeeded` を返した。pipeline は成功扱いとなり、register は `review` へ遷移して統合まで進んだ。**完了していない作業が完了として記録される。**

## 2. 事実

### 2.1. 実際に発生した経緯

[[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]] は CDFD 3 本の修正を対象としていた。

| 実行 | executor                          | 段の結果        | 変更された文書          |
| ---- | --------------------------------- | --------------- | ----------------------- |
| 1    | `codex-expert-executor`           | `rate_limited`  | `cdfd-overview.md` のみ |
| 2    | `agy-opus-executor`（`--resume`） | **`succeeded`** | **追加なし**            |

2 回目は 11 分（06:41:40〜06:52:58）実行して `succeeded` を返したが、`cdfd-check.md` と `cdfd-action.md` は未変更のままだった。reporter も `succeeded` となり、register は `review` へ遷移して統合された。

### 2.2. pipeline-state は段の状態しか持たない

```json
{
  "stages": {
    "executor": { "status": "rate_limited", "actor": "codex-expert-executor", "attempts": 1 },
    "reporter": { "status": "pending", "actor": "gemma-reporter", "attempts": 0 }
  }
}
```

段の `status` は `pending` / `succeeded` / `rate_limited` などを持つが、**段の中でどの作業が残っているかを持たない。** `--resume` は「未完了の段」を再開するため、段を再実行すれば完了とみなす。

### 2.3. 再開後の executor は前任者の文脈を持たない

`--resume` は worktree のファイル変更を再利用するが、前任者の思考文脈は引き継がない。再開後の executor は plan と worktree の現状を読み、**既に一部が変更されている状態を「作業済み」と解釈しうる。** 2 回目が 11 分かけて何も変更しなかったのは、この解釈が働いた可能性がある。

### 2.4. 検出手段がない

`exec validate` は plan と result の対応を検査するが、**plan が列挙した対象文書がすべて変更されたかは検査しない。** plan frontmatter には `targets`（対象文書の doc id リスト）があるため、照合する余地はある。

## 3. 影響

| 影響                                  | 内容                                             |
| ------------------------------------- | ------------------------------------------------ |
| 未完了の作業が完了として記録される    | register が `review` へ遷移し、統合まで進む      |
| 人が気づかないと放置される            | 本件は評価で気づいたが、評価しなければ見落とす   |
| rate limit が頻発する環境で起きやすい | 長時間の編集タスクで中断が起きるほど確率が上がる |

## 4. 対応の候補

| 案  | 内容                                                                                 | 利点               | 懸念                                  |
| --- | ------------------------------------------------------------------------------------ | ------------------ | ------------------------------------- |
| 1   | plan frontmatter の `targets` と実際の変更ファイルを照合し、未変更があれば失敗させる | 機械的に検出できる | 変更が不要な対象もありうる            |
| 2   | 段の中の進捗を pipeline-state へ記録し、`--resume` が残作業を渡す                    | 根本的             | executor が進捗を報告する仕組みが要る |
| 3   | 再開時に「前任者が着手済みの範囲」を plan へ注記して渡す                             | 実装が小さい       | 着手済みの判定が必要                  |
| 4   | 再開後の executor へ「未完了の可能性がある」旨を明示し、全対象を確認させる           | 実装が小さい       | 重複作業が発生しうる                  |

**案 1 と案 4 の組み合わせを推す。** 案 1 で検出し、案 4 で再発を減らす。案 2 は正しいが executor 側の協力が必要で、provider ごとに実装が異なるため難しい。

案 1 の「変更が不要な対象」は、result へ理由を記録させることで区別できる。

## 5. 完了条件

- `--resume` 後の executor が plan の対象をすべて扱ったかを検証できる。
- 未変更の対象がある場合、成功として記録されない。失敗するか、警告として残る。
- 変更が不要だった対象は、理由を result に記録すれば成功として扱える。
- 再開時に executor へ渡す情報が、前任者の着手範囲を含んでいる。または全対象の確認を促している。
- rate limit 以外の中断（crash、手動停止）でも同じ検証が働く。
- 既存の正常な run が失敗扱いにならない。誤検出の割合を確認している。
- `npm run test:integration` で再開経路の検証がある。

## 6. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                           |
| --- | -------------------------------------------- | ---- | ---- | ------------------------------ |
| 1   | 対応の候補から方針を決める                   | ARC  | open | 案 1 と案 4 を起点             |
| 2   | plan の `targets` と変更ファイルの照合を実装 | DEV  | open | `exec validate` への追加を検討 |
| 3   | 再開時に渡す情報を見直す                     | DEV  | open | 着手範囲または全対象の確認     |
| 4   | 誤検出の割合を確認する                       | QE   | open | 既存 run への影響              |
| 5   | 統合テストを追加する                         | DEV  | open | 中断と再開の経路               |

## 7. 対応結果

-

## 8. 関連ドキュメント

- [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]]
- [[prj-0001:pjr-4hbg-exec-run]]
- `src/exec-pipeline-state.ts`
- `src/exec-run.ts`
- `docs/ja/specdojo/guides/exec-operation-guide.md`
