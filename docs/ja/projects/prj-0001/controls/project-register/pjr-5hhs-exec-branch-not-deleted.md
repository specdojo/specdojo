---
specdojo:
  id: prj-0001:pjr-5hhs-exec-branch-not-deleted
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-07T22:56:33Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-10T11:45:03Z"
---

# PJR-5HHS 統合後に exec ブランチが削除されず蓄積する

## 1. 概要

`exec run --worktree` の統合後に `exec/prj-0001-PJR-XXXX` ブランチが残る。worktree は削除されて
いるが、ブランチだけが残存する。確認時点で 8 本が蓄積していた。

## 2. 観測した事実

削除した 8 本はいずれも `project/prj-0001/develop` に統合済みで、未統合コミットは 0 件であった。

```text
exec/prj-0001-PJR-0148  exec/prj-0001-PJR-5ERG
exec/prj-0001-PJR-FMZ2  exec/prj-0001-PJR-G1QZ
exec/prj-0001-PJR-HF4N  exec/prj-0001-PJR-K513
exec/prj-0001-PJR-QM88  exec/prj-0001-PJR-TA5C
```

実装には削除の指定が存在する。

| 箇所                       | 内容                                              |
| -------------------------- | ------------------------------------------------- |
| `src/exec-worktree-ops.ts` | `if (params.deleteBranch) git branch -d <branch>` |
| `src/exec-run.ts`          | 2 箇所で `deleteBranch: true` を設定              |

`deleteBranch: true` は 2026-08-01 の commit `79c063a2` で導入済みである。一方、残存ブランチの
最終コミットは 2026-09-01 から 2026-09-07 で、すべて導入より後にあたる。フラグは有効だが削除が
行われていない。

## 3. 推定原因

### 3.1. 当初の推定と、その反証

当初は「`git branch -d` が統合より前に実行され、未統合として失敗している」と推定した。この推定
は誤りである。

起票後に PJR-9QZ2 を `exec run --register --worktree` で実行したところ、統合に成功した時点で
`exec/prj-0001-PJR-9QZ2` は削除されていた。同じ実行で失敗した PJR-M35P のブランチだけが残った。

```text
$ git branch --list "exec/*"
+ exec/prj-0001-PJR-M35P     ← 失敗して worktree を保持しているもののみ
```

正常経路ではブランチ削除は機能している。原因は当初考えたより限定的である。

### 3.2. 現時点の推定

失敗または中断した実行が残したものと考えられる。失敗時は worktree を保持する仕様であり、その際
ブランチも残る。worktree だけが後から削除されると、ブランチが孤立して残る。

PJR-MBVM では実際にこの状態になった。プロセスが中断し、worktree とブランチが残ったため、統合と
ブランチ削除を手作業で行った。

蓄積していた 8 本が、それぞれどの経路で残ったかは特定していない。失敗・中断の履歴と突き合わせる
必要がある。

### 3.3. 履歴との突き合わせ結果

8 本はすべて後から merge commit が作られていたが、通常の成功経路だけを通ったものではなかった。
保存済みの `pipeline-state.json` と Git 履歴から、次の停止・復旧経路を確認した。

| ブランチの項目                                   | 保存済み pipeline の停止位置                       | 後続履歴                          |
| ------------------------------------------------ | -------------------------------------------------- | --------------------------------- |
| PJR-5ERG、PJR-FMZ2、PJR-G1QZ、PJR-K513、PJR-QM88 | executor が `failed`                               | 後から成果 commit と merge を実施 |
| PJR-HF4N                                         | executor 成功後、reporter が `failed`              | 後から成果 commit と merge を実施 |
| PJR-0148                                         | reporter 成功後、integrate が `running` のまま中断 | 後から merge を実施               |
| PJR-TA5C                                         | integrate 記録導入前に executor / reporter が成功  | wait の後に merge を実施          |

したがって、蓄積の共通点は「失敗・中断後に通常の成功時撤去処理とは別経路で復旧・統合されたこと」である。
Git は削除済み worktree や branch ref の削除操作自体を履歴に残さないため、8 本それぞれについて
worktree 撤去と branch 削除の間のどの操作で止まったかまでは確定できない。

## 4. 影響

残骸が増え続け、どのブランチが未統合か判別しにくくなる。PJR-23DT の worktree が不要かを判断
する際、登録簿の状態・未コミット変更・未統合コミットを個別に確認する必要があった。

## 5. 完了条件

- 統合に成功した `exec run --worktree` の実行後、対応する exec ブランチが残らない。この条件は
  現状でも満たしている（`当初の推定と、その反証` を参照）。
- 失敗または中断した実行が残した worktree とブランチが、孤立した状態で放置されない。
- ブランチ削除に失敗した場合、失敗した事実と理由が実行ログに出力される。
- 未統合のブランチは削除されない（`-d` の安全性を保つ）。
- 残骸の有無を確認する手段がある。

## 6. 作業内容

| No  | 作業                                             | 対応内容                                                        |
| --- | ------------------------------------------------ | --------------------------------------------------------------- |
| 1   | 残存した 8 本がどの経路で残ったかを特定          | pipeline state と merge 履歴を突き合わせ、停止位置を分類した    |
| 2   | 失敗・中断時のブランチと worktree の扱いを決める | 未統合成果は対で保持し、worktree のないものだけを孤立と定義した |
| 3   | `git branch -d` 失敗時の扱いを確認               | worktree 削除済み・branch 残存・Git の理由を明示するようにした  |
| 4   | 残骸を検出または整理する手段を検討               | project 単位の `exec worktree prune` を追加した                 |
| 5   | 検証テストを追加                                 | project 境界、統合状態、worktree 使用中、dry-run を検証した     |

## 7. 対応結果

失敗・中断時は、未統合成果を失わないよう worktree と exec ブランチを従来どおり保持する。両者の
対応が失われた場合に備え、`exec worktree prune --project <project-id> --dry-run` で孤立ブランチと
統合状態を確認し、`--dry-run` を外すと現在の HEAD に統合済みの孤立ブランチだけを安全な
`git branch -d` 相当で削除できるようにした。未統合ブランチと、登録済み worktree が使用中の
ブランチは削除しない。

worktree 撤去後の branch 削除失敗は、worktree が削除済みで branch が残った事実、branch 名、Git の
失敗理由、`worktree prune` による復旧方法をログへ出力する。自動実行では成果物がすでに統合済みの
ため task の完了処理は継続し、branch の整理失敗によって実行状態を未統合へ戻さない。

実装・運用手順・検証内容は [[specdojo:exec-worktree-guide|exec worktree運用ガイド]] とコマンド
リファレンスへ反映した。残課題はない。

## 8. 関連ドキュメント

- [[prj-0001:pjr-9qz2-exec-stale-running-stage]]: 同じ worktree 運用で判明した状態残留の問題。
