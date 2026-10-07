---
specdojo:
  id: prj-0001:pjr-pg6w-resume-stage-and-sync
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-06T10:18:08Z"
  due_on: null
  completed_at: "2026-10-07T10:38:47Z"
  conclusion: "--resume-from executor で reporter 段の run を executor 段から再開でき、失敗の理由を申し送る。すべての段の再開で統合先を取り込む。保護された設定を人が統合先へ適用して再開する流れ（同じ変更なら通り、異なれば衝突として拒否）を integration test で確認した"
---

# PJR-PG6W register の resume は executor 段へ戻れず、executor 段の再開でも統合先を取り込まない

## 1. 課題内容

親検証の失敗後の resume は reporter 段から始まり、executor に直させる経路がない（--force-restart は worktree ごと捨てる）。executor 段から再開するときは統合先を merge しないため、保護された設定を人が develop へ適用する手順と噛み合わず、手で merge する必要がある。PJR-27Y0 で両方が起きた。

## 2. 影響範囲

| 観点         | 影響                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------- |
| スコープ     | `exec run --register --resume`（worktree）。親検証の失敗後の再開と、保護された設定の block 後の再開 |
| スケジュール | 再開のたびに、worktree での手作業の merge や executor の範囲外の手直しが必要になる                  |
| コスト       | PJR-27Y0 では、手作業の merge を 3 回、orchestrator によるテストの手直しを 1 回行った               |
| 品質         | runner を経ない手作業の merge と修正が worktree の履歴に入り、executor の作業と区別しにくくなる     |
| 関係者       | DEV、register を resume する利用者・orchestrator                                                    |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 再開の段は pipeline の状態だけで決まる。executor が成功していれば reporter 段（親検証の再実行を含む）から再開し、利用者が executor 段を選ぶ手段がない。また、再開前に統合先を取り込む処理（PJR-GENJ）は reporter 段と統合段だけが対象で、executor 段の再開（rate limit や保護機構の block の後）では統合先を取り込まない                                                                                        |
| 対応策   | (1) worktree の resume に、executor 段から再開させる指定（例: `--resume-from executor`）を加える。既存の worktree と未 commit の変更を残したまま executor を起動し、直前の block の理由や失敗した親検証の名前と要約を申し送りとして prompt に渡す。(2) executor 段の再開でも、起動の前に統合先を取り込む。取り込みの処理と、取り込めない場合に状態を変えずに再開を拒否する扱いは、reporter 段の再開と同じにする |
| 依存事項 | PJR-GENJ の統合先の取り込みの処理、PJR-GHKD の Git 実行ヘルパー                                                                                                                                                                                                                                                                                                                                                 |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                                                                                                                                                                                                                                                                                                |

### 3.1. 完了条件の詳細

- reporter 段から再開できる run に `--resume-from executor`（名前は既存の CLI の命名に合わせて決めてよい）を付けると、既存の worktree の変更を残したまま executor 段から再開する。executor の prompt には、直前の失敗の理由（失敗した親検証の名前と要約、または block の理由）が申し送りとして含まれる。
- 指定がない `--resume` の動きは今と変えない。worktree がない run や再開できない run に指定した場合は、理由を示して拒否する。
- executor 段の再開（指定による場合と、rate limit・保護機構の block の後の場合の両方）では、executor の起動の前に統合先を exec branch と worktree へ取り込む。取り込めない場合は、register の状態を変えずに再開を拒否する。
- 保護された設定の変更を人が統合先へ適用したあと `--resume` すれば、worktree での手作業の merge なしに再開でき、同じ変更が agent 由来として再び block されない。
- 上記を unit test と integration test で確かめる。
- コマンドリファレンスと exec 運用ガイドに、新しい指定と、保護された設定の変更を人が適用して再開する手順を記載する。
- `npm run check` が通る。

### 3.2. review での追加の作業（2026-10-07）

初回の実装（d2256380b）の review で、完了条件の「保護された設定の変更を人が統合先へ適用したあと `--resume` すれば、同じ変更が agent 由来として再び block されない」ことを確かめるテストがないと分かった。既存の integration test は、保護対象ではないファイルを統合先へ commit して取り込みを確かめている。次のテストを追加する。実装に不足が見つかった場合は直す。

- integration test で、PJR-27Y0 で起きた次の流れを再現する。
  1. executor（fake agent）が保護対象のファイル（例: `pm-members.yaml` や `.opencode/agents/` 配下）を書き換え、`agent-config-write` で block されて waiting になる。
  2. 人が同じ変更を統合先のブランチへ commit する。
  3. `--resume` で executor 段から再開する（executor は保護対象を変更しない）。
  4. 再開が block されずに review へ進み、統合後の統合先で保護対象のファイルが人の commit した内容のままであることを確かめる。
- 人が統合先へ適用した内容と、worktree に残る agent の変更が異なる場合の扱い（取り込みの衝突として拒否されるか、再び block されるか）も 1 件のテストで確かめ、挙動をコマンドリファレンスか exec 運用ガイドに記録する。

## 4. 対応結果

- `exec run --register --resume --resume-from executor` を追加し、reporter 段から再開可能な run を、既存 worktree と未コミット成果を保持したまま executor 段へ戻せるようにした。通常の `--resume` の段選択は変更していない。
- executor 再開時の prompt に、失敗した親検証の ID と要約、または保存済みの block 理由を申し送りするようにした。
- executor／reporter／統合の全再開段で、状態遷移や agent 起動より先に統合先を exec branch と worktree へ取り込むようにした。競合時は従来どおり同期を巻き戻し、register の状態を変えずに拒否する。
- unit test に段指定・拒否条件・申し送りの検証を追加し、integration test に reporter 段から executor へ戻して統合先の修正を取り込む経路を追加した。
- integration test に、`agent-config-write` で block されたあと、人が同じ保護対象変更を統合先へ commit して通常の `--resume` で review まで進む経路を追加した。人と agent の変更内容が異なる場合は、同期を巻き戻して waiting と双方の内容を保持したまま拒否することも確認した。
- コマンドリファレンス、exec 運用ガイド、worktree ガイドへ指定方法と、保護対象設定を統合先へ適用して再開する手順を追記した。
- exec 運用ガイドへ、人が適用した保護対象変更が agent の提案と同じ場合は差分が解消され、異なる場合は再開前同期を拒否する扱いを追記した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-27y0-grade-english-canonical-translation]]（両方の問題が起きた実行）
- [[prj-0001:pjr-ghkd-resume-sync-git-diff-outside-repo]]（再開前の同期の修正）
