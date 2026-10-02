---
specdojo:
  id: prj-0001:pjr-h9r2-resume-sync-uncommitted-overlap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-01T20:01:26Z"
---

# PJR-H9R2 再開前の統合先の取り込みが worktree の未 commit の変更と重なると再開できない

## 1. 課題内容

PJR-GENJ の再開前の取り込みは、executor が worktree に残した未 commit の変更と統合先の変更が同じファイルに及ぶと、git merge が上書きを拒み再開できない。executor の成果を退避または commit してから取り込み、衝突は現行どおり理由を示して止める

## 2. 影響範囲

| 観点         | 影響                                                           |
| ------------ | -------------------------------------------------------------- |
| スコープ     | `exec run --resume` で reporter 段または統合段から再開する場合 |
| スケジュール | 該当する項目は再開できず、最初からのやり直しになる             |
| コスト       | 取り込みの手順の修正とテスト                                   |
| 品質         | executor の成果が残っていても再開できない                      |
| 関係者       | exec run を使う利用者                                          |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | PJR-GENJ の再開前の取り込みは、executor が worktree に残した未 commit の変更と統合先の変更が同じファイルに及ぶと、git merge が上書きを拒んで止まる                                                                                                                             |
| 対応策   | 取り込みの前に executor の成果を一時的に退避（stash など）し、取り込み後に戻す。戻すときに衝突した場合は、現行どおり理由と worktree の場所を示して再開を止め、成果を失わない                                                                                                   |
| 依存事項 | [[prj-0001:pjr-genj-resume-validation-before-develop-sync]]                                                                                                                                                                                                                    |
| 完了条件 | 未 commit の変更と統合先の変更が同じファイルに及んでも衝突しない場合は、再開が取り込みを終えて親検証へ進むことを確かめる統合テストがある。衝突する場合は成果を失わずに止まることも確かめる。宣言を持たない project と複数リポジトリの project の両方で動く。親検証がすべて通る |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-genj-resume-validation-before-develop-sync]]
- [[prj-0001:pjr-69vp-multi-repo-e2e-docs]]
