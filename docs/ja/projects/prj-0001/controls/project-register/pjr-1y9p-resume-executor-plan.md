---
specdojo:
  id: prj-0001:pjr-1y9p-resume-executor-plan
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-26T07:46:13Z"
  completed_at: "2026-09-26T09:00:46Z"
  block_reason: "agent exited with non-zero code: 親検証の `test-integration` が失敗（status: failed）しているため。"
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

| No  | 作業                                         | 担当 | 状態 | メモ                                           |
| --- | -------------------------------------------- | ---- | ---- | ---------------------------------------------- |
| 1   | 対応の候補から方針を決める                   | ARC  | done | 案 1 と案 4 を採用                             |
| 2   | plan の `targets` と変更ファイルの照合を実装 | DEV  | done | resume 後の executor evidence を runner が検査 |
| 3   | 再開時に渡す情報を見直す                     | DEV  | done | 既存変更パスと全対象の確認指示を追加           |
| 4   | 誤検出の割合を確認する                       | QE   | done | 通常 run は追加ガード対象外                    |
| 5   | 統合テストを追加する                         | DEV  | done | rate limit 中断からの再開経路を追加            |

## 7. 対応結果

- 中断後に executor 段を再開する prompt へ、既存変更パスと plan 全体・全 `targets` の再確認指示を追加した。
- 再開後の executor evidence に `target_coverage` を導入し、変更対象の repo 相対パスが累積 worktree 差分に含まれることを runner が照合するようにした。
- 未変更対象は具体的な理由がなければ失敗とし、理由がある場合は reporter が生成する result の申し送りへ runner が転記するようにした。
- rate limit、crash、手動停止はいずれも executor 段の再開経路で同じ検査を通る。plan に `targets` がない register 由来タスクは、機械照合を行わず plan 全体の再確認指示を適用する。
- 通常の新規 run では `target_coverage` を必須にせず、既存の正常系を追加ガードによる失敗対象にしない。
- rate limit で中断した executor を worktree 上で再開し、全 target の coverage と累積差分を確認してから reporter・統合へ進む統合テストを追加した。

### 7.1. 評価（2026-09-26）

案 1（宣言と実変更の照合）と案 4（再開時の全対象確認の指示）を組み合わせた実装が完成した。統合テスト 1 件を `it.skip` とし、[[prj-0001:pjr-tdb0-task-resume-rate-limit-executor]] で追跡する。

| 完了条件                                                 | 判定                              |
| -------------------------------------------------------- | --------------------------------- |
| resume 後の executor が plan の対象を扱ったか検証できる  | 満たす（`targets` がある場合）    |
| 未変更の対象がある場合、成功として記録されない           | 満たす                            |
| 変更が不要だった対象は理由の記録で成功扱いにできる       | 満たす（`unchanged` + `reason`）  |
| 再開時に渡す情報が着手範囲を含む、または全対象確認を促す | 満たす                            |
| rate limit 以外の中断でも同じ検証が働く                  | 満たす（`blocked` も対象）        |
| 既存の正常な run が失敗扱いにならない                    | 満たす（`targets` が空なら skip） |
| 統合テストで再開経路の検証がある                         | **部分的**（1 件 `it.skip`）      |

### 7.2. 実装の要点

`target_coverage` を evidence へ追加した。resume 時の executor は plan frontmatter の `targets` ごとに申告する。

| 状態        | 必須項目                               |
| ----------- | -------------------------------------- |
| `changed`   | `path`（worktree diff に実在すること） |
| `unchanged` | `reason`（具体的な理由）               |

runner が不足と重複を検出して失敗させる。`unchanged` の `reason` は result へ保存される。

案 2（段内の進捗を pipeline-state へ記録）を採らなかった理由は、executor が進捗を報告する仕組みが provider ごとに異なり実装できないためである。

### 7.3. register 由来の plan には targets がない

調査で判明した。

| plan の種別                      | `targets` |
| -------------------------------- | --------- |
| `T-*-plan.md`（Schedule 由来）   | あり      |
| `pjr-*-plan.md`（register 由来） | **なし**  |

**本件の発端となった [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]] は register 由来であり、今回の検証では検出できない。** `targets` が空のときは検証を skip して成功扱いとする既定を維持し、プロンプトでは `final_message` に検証済みと未検証を述べるよう指示した。

register 由来への `targets` 付与は対象の導出方法自体が設計判断であるため、別項目として扱う。個票へ人が書く運用にするか、変更されたファイルから事後的に記録するかで方式が変わる。

### 7.4. 検証結果

| 検証               | 結果                  |
| ------------------ | --------------------- |
| `typecheck`        | 通過                  |
| `lint:ts`          | 通過                  |
| `test:unit`        | 1556 件すべて通過     |
| `test:integration` | 13 ファイルすべて通過 |
| `validate:schema`  | 通過                  |
| `lint:md`          | 通過                  |

### 7.5. 実行の経緯

3 回の試行を要した。

| 回  | 失敗理由                             | 成果                   |
| --- | ------------------------------------ | ---------------------- |
| 1   | `dubious ownership`（checkpoint 段） | なし                   |
| 2   | `test-integration` の失敗            | 9 ファイルの実装       |
| 3   | —（人が修正して統合）                | テスト修正と skip 判断 |

`dubious ownership` は 2 回目で再現しなかった。`safe.directory` に `worktrees` 配下が登録されていないが、断続的にしか発生しない。[[prj-0001:pjr-bx79-integrate-dubious-ownership-retry]] の内容を uid 一致でも発生する事実で更新する必要がある。

## 8. 関連ドキュメント

- [[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]]
- [[prj-0001:pjr-4hbg-exec-run]]
- `src/exec-pipeline-state.ts`
- `src/exec-run.ts`
- `docs/ja/specdojo/guides/exec-operation-guide.md`
