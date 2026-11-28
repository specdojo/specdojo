---
specdojo:
  id: prj-0001:pjr-ag0c-guarded-push-new-branch-count
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-11-28T08:48:25Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GDMB
---

# PJR-AG0C guarded-push の dry-run が、新しいブランチの commit の件数に全部の履歴を数える

## 1. 課題内容

remote にないブランチを guarded-push --dry-run で示すと、送る範囲を (new branch) とし、Commits に全履歴の件数（17597）を出す。remote にまだない commit だけを数えて示すように直す

## 2. 入力

- 2026-11-28 に feature/prj-0001/guarded-push-permissions で npx specdojo guarded-push --project prj-0001 --branch feature/prj-0001/guarded-push-permissions --dry-run を流すと Range: (new branch) 1b159b605f…、Commits: 17597 と出た
- push の動き自体には影響しないが、承認の前に示す範囲と件数が分かりにくく、利用者が送る中身を判断できない
- 担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 影響範囲

| 観点         | 影響                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| スコープ     | `guarded-push` の新しいブランチの `Range`・`Commits` の表示だけ。push の動きは変えない  |
| スケジュール | 影響なし                                                                                |
| コスト       | 新しいブランチで、手元にない remote のブランチの先端の object を fetch する分だけ増える |
| 品質         | 承認の前に送る commit の数を正しく示せる                                                |
| 関係者       | push を承認する利用者とオーケストレーター                                               |

## 4. 対応方針

| 項目     | 内容                                                                                  |
| -------- | ------------------------------------------------------------------------------------- |
| 原因     | remote にないブランチでは送る範囲の基準がなく、ブランチの先端までの全履歴を数えている |
| 対応策   | 新しいブランチでは、remote のどのブランチにもまだない commit だけを数えて示す         |
| 依存事項 | なし                                                                                  |
| 完了条件 | 下の一覧のとおり                                                                      |

- `guarded-push --dry-run`（と通常の実行の表示）で、remote にないブランチの `Commits` を、送り先の remote の既知のブランチのどれにも含まれない commit の件数にする。基準にした範囲（例: どの remote のブランチとの差か）が分かる形で `Range` に示す。
- remote にあるブランチの表示（`<remote の先端>..<送る先端>` と件数）は変えない。
- 単体テストか統合テストで、新しいブランチの件数が全履歴ではなく、remote にない commit の数になることを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- 統合の後に、オーケストレーターが remote にない feature ブランチで `--dry-run` を流し、件数と範囲が分かる形になることを確かめてから close する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 5. 対応結果

| 作業                                                          | 状態 | メモ                                                                                        |
| ------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------- |
| 新しいブランチの `Commits` を remote にない commit の数にする | done | `src/commands/guarded-push.ts` の `newBranchRange`                                          |
| 基準にした remote のブランチを `Range` に示す                 | done | ブランチ数と先頭 5 件の名前、残りの件数を出す                                               |
| remote にあるブランチの表示を変えない                         | done | `<remote の先端>..<送る先端>` と件数は従来どおり。既存の統合テストで確かめた                |
| 統合テストを足す                                              | done | `tests/src/commands/guarded-push.integration.test.ts`                                       |
| 検証（typecheck・lint:ts・test:unit・親の検証）               | open | 親 runner が実行する。executor は統合テストのファイル単体を流し、9 件とも通ることを確かめた |
| 統合後に remote にない feature ブランチで `--dry-run` を流す  | open | 統合の後にオーケストレーターが行う                                                          |

### 5.1. 解決内容

- remote にないブランチでは、送り先（push URL）の `ls-remote --heads` で得た全ブランチの先端を基準にし、`git rev-list --count <tip> --not <各先端>` で数える。
- 基準の先端の commit が手元にない場合は、既存の fast-forward 確認と同じく、ref と `FETCH_HEAD` を書かずに object だけを fetch してから数える。`--dry-run` でも fetch する。
- `Range` は例えば `(new branch) <tip>, excluding commits on 2 origin branches (project/p/develop, project/p/other)` と出す。remote にブランチが 1 つもない場合は `(new branch) <tip>; origin has no branches, so the full history is counted` と出し、全履歴を数える。

### 5.2. executor が決めた点

- 基準は手元の remote-tracking ref（`refs/remotes/origin/*`）ではなく、送り先から直接得た広告にした。古い tracking ref や fetch URL と push URL の違いで件数がずれないようにするため。既存の fast-forward 確認と同じ方針である。
- 基準の commit が手元にないときは fetch して正確に数える。fetch しないと、remote 側で進んだブランチの祖先も「remote にない」と数えて件数が膨らむため。fetch するのは手元にない先端だけに絞った。
- `Range` に全ブランチの名前を並べると長くなるため、名前順の先頭 5 件と残りの件数（`+N more`）に絞った。

### 5.3. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `guarded-push` で remote にまだないブランチを示すとき、`Commits` が全履歴ではなく remote のどのブランチにもない commit の数になり、`Range` に基準にした remote のブランチを示すようにした。

## 6. 関連ドキュメント

- [[prj-0001:pjr-index]]
