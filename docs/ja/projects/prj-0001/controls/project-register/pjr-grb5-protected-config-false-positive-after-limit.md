---
specdojo:
  id: prj-0001:pjr-grb5-protected-config-false-positive-after-limit
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T12:29:09Z"
---

# PJR-GRB5 利用上限で止まった直後に保護の検査が再生成可能な生成物を誤検知する

## 1. 課題内容

2026-09-28 の PJR-36CN の実行で、claude-expert-executor が `You've hit your session limit · resets 11:10pm (Asia/Tokyo)` で止まった直後に、`agent-config-write: protected configuration changes detected; paths=.specdojo/doc-index.json` で blocked になった。

- `.specdojo/doc-index.json` は、`src/exec-agent-protected-config.ts` の `GENERATED_PATHS` に含まれる再生成可能な生成物で、git の ignore 対象であれば保護の検査から外れる作りである。
- orchestrator が 36CN の worktree で `git check-ignore -v --no-index .specdojo/doc-index.json` を実行すると、ignore 対象と判定された。
- 36CN はその後、`--resume` で正常に完了した。

再現条件は未確定である。利用上限による中断との関係、ignore 判定の `git check-ignore` が失敗した場合に全候補を保護対象に残す分岐（git が使えない・想定外の終了コード）が働いた可能性がある。

## 2. 影響範囲

| 観点         | 影響                                                          |
| ------------ | ------------------------------------------------------------- |
| スコープ     | 保護の検査を通るすべての exec の実行                          |
| スケジュール | 誤検知で blocked になると、原因の切り分けと再開の手間がかかる |
| コスト       | 小                                                            |
| 品質         | 利用上限で止まった本当の理由が、保護の検査の理由に隠れる      |
| 関係者       | exec を流す利用者、orchestrator                               |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 未確定。36CN の evidence と executor.log、`ignoredGeneratedPaths` の失敗時の分岐を調べて特定する                                                                                                                                                                              |
| 対応策   | 原因を特定して直す。あわせて、agent が利用上限で止まった場合は、保護の検査の結果より利用上限を block の理由として優先して記録する                                                                                                                                             |
| 依存事項 | なし                                                                                                                                                                                                                                                                          |
| 完了条件 | 原因を対応結果に記録している。ignore 済みの `GENERATED_PATHS` の生成物だけが変わった場合に、保護の検査が block しないことを、`git check-ignore` が失敗する場合を含めて単体テストで確かめる。利用上限で止まった実行の block の理由が利用上限になる。`npm run check` が成功する |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-36CN（発生した項目）
- `src/exec-agent-protected-config.ts`（`GENERATED_PATHS`、`ignoredGeneratedPaths`）
