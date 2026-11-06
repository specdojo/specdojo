---
specdojo:
  id: prj-0001:pjr-brn4-integrate-drops-unlisted-additions
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

- 原因: register の許可外追加を commit 範囲から除外した後も統合と worktree 撤去を続けていた。既存ファイルの削除は許可されるため、未追跡の移動先だけが失われた。
- 対応: register の commit 前と hook 後に許可外変更を検査し、残っていれば統合を停止する。プロダクトの commit より前にも検査し、撤去時にも保持を強制する。失敗は既存の waiting 遷移と統合段の再開へ接続し、`block_reason` に件数・先頭3件・`integrate.log` の場所を残す。停止理由だけ上限を拡張し、ログの場所と代表パスが通常の200文字制限で切れないようにした。最後の要約には `uncommitted=<件数>` を表示する。
- 再開方法: 利用者の承認後、保持した worktree で移動元と移動先を明示して手動 commit し、統合先から `exec run --register <PJR-ID> --worktree --resume` する。既存の統合再開が使え、追加の自動許可オプションなしに承認したパスを Git 履歴で確認できるため、この方法を採った。手順は [[specdojo:exec-operation-guide|exec運用ガイド]] に記載した。
- 回帰検証: 実 worktree で22件を新しい `archive/` へ移し、`links.json` と合わせた23件が未 commit のまま残り、統合先の原本を保持して waiting になるテストを追加した。同じテストで、承認を模した手動 commit 後の再開が両側を統合し、agent を再実行せず worktree を撤去することを確認する。許可外追加だけの停止、別 run の記録の保持、件数表示も既存テストへ反映した。型・lint・unit・integration の実行結果は親 runner の検証を正とする。
- executor の検査: Prettier 整形、履歴リンク検査、登録簿の派生ビュー生成、カタログ検査は成功した。カタログには既存の参照先未作成・re-export だけの根拠パスなどの警告が残るが、エラーはない。
- 申し送り: PJR-XD12 の消失済みファイルの復元は、本修正とは別に準備された `feature/prj-0001/restore-archived-trash` を利用者の承認後に反映する。runner 変更のため、統合後は運用メモに従い PJR-JSEY を新しいプロセスで実行してから close する。

## 6. 関連ドキュメント

- [[specdojo:exec-operation-guide|exec運用ガイド]]
- [[prj-0001:pm-orchestrator-playbook|prj-0001 のオーケストレーター運用メモ]]
