---
specdojo:
  id: prj-0001:pjr-brn4-integrate-drops-unlisted-additions
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-06T16:07:41Z"
  due_on: null
  derived_from:
    - PJR-XD12
  depends_on:
    - PJR-TA6W
---

# PJR-BRN4 worktree の統合が許可外の追加を黙って落とし、移動が削除だけになる

## 1. 課題内容

PJR-XD12 の統合で、docs/ja/product/trash/ の 22 件の削除だけが commit され、移動先の archive/ja/product/trash/（22 件と links.json）は commit されずに worktree ごと消えた。run は success で終わった

## 2. 入力

- 2026-11-07 01:04 の PJR-XD12 の run（commit 2f7279ec9）。executor は sandbox で git mv が使えず、作業ツリーの中でファイルを移した。統合の commit には trash の 22 件の削除と、dct-data-flow.yaml の path の書き換え、archive-links.ts とテストが入ったが、archive/ 配下の 23 件は入らなかった。run の要約は success・commit=committed で、落ちたファイルの警告は出ていない（2026-11-07 orchestrator の確認）
- 影響: develop の HEAD に 22 件がどちらの場所にもなく、catalog validate が archive のパスに 18 件の警告を出す。Git の履歴には残る（2026-11-07）
- 関連: PJR-9BY9 は約 3,000 件を新しい配置へ移す。同じ動きなら、削除だけが commit される（2026-11-07）
- orchestrator は、削除の直前の commit から 22 件を取り出し links.json を作り直した復元を、feature/prj-0001/restore-archived-trash の worktree に未 commit で用意した。反映は利用者の承認のもと行う（2026-11-07）

## 3. 影響範囲

| 観点         | 影響                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| スコープ     | `exec run --register --worktree` の統合で、commit しない変更が残ったときの扱いと、run の要約 |
| スケジュール | PJR-9BY9（約 3,000 件の記録を新しい配置へ移す）は、この項目の後になる                        |
| コスト       | runner の統合処理と停止の記帳、統合テスト、運用のガイドの修正                                |
| 品質         | 移動の片側（削除）だけが commit され、成果物が警告なしにどちらの場所からも消える             |
| 関係者       | DEV、run の結果を確かめる orchestrator と利用者                                              |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | register 由来のタスクで新しく足したファイルは、`registerNewFileIsAllowed` が既知のディレクトリ（`docs/`・`src/` など）と HEAD に既にある最上位のディレクトリの中だけを許す。`archive/` は新しい最上位のディレクトリのため、23 件が許可外に分けられた。統合は警告を `integrate.log` に書いて commit したが、run は success で終わり worktree を消した。既にあるファイルの削除は許可されるため、移動の片側だけが commit された（2026-11-07 orchestrator が XD12 の `integrate.log` とコードで確認） |
| 対応策   | 統合が commit しない変更が残ったら、worktree を残して run を止める（A 案、2026-11-07 indie が決定）。新しい最上位のディレクトリを許可する B 案は採らない                                                                                                                                                                                                                                                                                                                                          |
| 依存事項 | PJR-TA6W（同じ `src/exec/worktree-ops-commit.ts` を変える）の統合の後に流す                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

完了条件の内訳。

- register 由来のタスクで、統合が commit しない変更（許可外の追加など）が残ったら、worktree を消さずに run を止め、項目を `waiting` にする。`block_reason` に、残したファイルの一覧（多い場合は件数と先頭の数件）と、`integrate.log` の場所を書く。
- 既にあるファイルの削除と、許可外の追加の中身が一致する（移動の片側だけが commit される）場合も、同じく止める。
- run の最後の要約に、commit しなかったファイルの件数を出す。0 件のときの表示は今と同じでよい。
- 止まった run を、利用者の承認のもと許可外のファイルを含めて統合する方法を用意し、運用のガイド（`exec-operation-guide`）に書く。新しいオプションを足すか、worktree で commit してから `--resume` する手順にするかは executor が決め、理由を個票の対応結果に書く。
- 許可外の変更が残らない run の動きは変えない。
- 実際の worktree を使う統合テストで、次を確かめる。
  - 新しい最上位のディレクトリへファイルを移した run は止まり、worktree と未 commit の追加が残る。
  - 上の方法で統合すると、削除と追加の両方が commit される。
- 原因と再発防止策を、個票の対応結果に記録する。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration`）が通る。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
