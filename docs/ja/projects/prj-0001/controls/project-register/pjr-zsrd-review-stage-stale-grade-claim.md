---
specdojo:
  id: prj-0001:pjr-zsrd-review-stage-stale-grade-claim
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-11T03:08:42Z"
  derived_from:
    - PJR-2GD6
---

# PJR-ZSRD schedule の review の段が、古い grade で判定し、reopen の後の引き受けの重なりで統合の前に止まる

## 1. 課題内容

代表の review の段（mode review）で、review の agent が runner の grade の流し直しより前に評価して grade-stale と判定する。reopen の後に再び流すと、完了の前の検査が「別の actor が引き受けている」として統合の前に止める。blocked の review を resume すると、古い executor の結果を使い回す。原因を特定して直す

## 2. 入力

- 2026-11-11、T-BUSINESS-SPECS-REPS の sf・cdt・ccd の 090 を reopen して流したところ、review の agent は grade-stale と判定し、completion preflight failed: task is being worked on by another actor: sol-review-executor で Blocked before integration になった。
- bdd・ifx-cmd の 090 は、PJR-CBV6 で YAML の grade が流せるようになった後に exec resume したが、CBV6 の前の executor の結果（grade list が失敗した記録）を使い回して止まった。
- 代表の確定には、review の段をやめて grade を直接流す形を使う（indie が案 A を決定）。

## 3. 影響範囲

| 観点         | 影響                                                                                 |
| ------------ | ------------------------------------------------------------------------------------ |
| スコープ     | schedule の review の段（mode review）を流す項目                                     |
| スケジュール | review の段が止まると、型の整備の schedule が完了せず、orchestrator の手作業が増える |
| コスト       | 止まるたびに再開の手作業と grade の流し直しが要る                                    |
| 品質         | 古い grade で判定すると、review の結論が実態と食い違う                               |
| 関係者       | orchestrator・PO                                                                     |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | review の agent が、runner の grade の流し直しより前に評価して grade-stale と判定する（順番の問題）。reopen の後の引き受けの重なりは PJR-M495・T4G3 で直った可能性があり、残りを確かめる                                                                                  |
| 対応策   | review の段では、grade が古い場合に runner が先に grade を流し直し、その結果ができてから review の agent を起動する。reopen して流し直した場合の完了の前の検査が、claim の持ち主で判定されることを確かめる                                                                |
| 依存事項 | PJR-M18B（grade の再試行と grade-stale の block）、PJR-M495・T4G3（claim の持ち主）                                                                                                                                                                                       |
| 完了条件 | grade が古い代表の review の段で、runner の grade の流し直しが review の agent の前に終わり、review が grade-stale にならないことを回帰テストで確かめる。reopen して流し直した review の段が「別の actor が引き受けている」で止まらない。`npm run check` と親の検証が通る |

## 5. 対応結果

### 5.1. 原因

- 2026-11-11 の cdt の 090 では、runner の grade は review の agent より前に流れていた（plan の生成の 5 秒前）。ただし `sol-review-executor` の rate limit で失敗したため、review は grade-stale と判定した。このときは、grade が失敗した review を止める仕組み（PJR-M18B）がまだなかった。
- 古い grade を使う経路は再開の側に残っていた。再開では前回の exec branch を使い続けるため、root で grade を流し直しても、worktree の評価結果サイドカーは最初の checkpoint の内容のままだった。また、executor からの再開は grade を確かめずに agent を起動していた。reporter からの再開は、古い grade で判定した executor の結果をそのまま使っていた（bdd・ifx-cmd の 090）。さらに root の grade が新しくなっていると、merge の前の検査が「Grade sidecar changed after checkpoint」で統合を止めていた。
- 「別の actor が引き受けている」は、当時の completion preflight が最後の段の actor で判定していたことによる。2026-11-16 の PJR-T4G3（`claimActor`）と PJR-M495（`claimed_by`）で、claim の持ち主で判定するようになった。残っていたのは統合の段からの再開で、これだけが `last_by` を使っていた。

### 5.2. 実施内容

- `src/exec/run/schedule-prepare.ts`: grade を、executor からの再開の分岐より前に流すようにした。再開（executor からの再開と `skipClaim`）では、`refreshReviewGradeCheckpoint` が成果物と型の評価結果サイドカーのうち root と違うものを exec branch へ取り込み、commit する。取り込みがあった場合は、`resumedReviewGradeNote` で再開の時点の評価結果を plan と prompt に足す（保存された plan は変えない）。取り込んだパスは `PreparedTask.reviewGradeRefreshed` に残す。executor からの再開でも grade の結果（`reviewGradeOutcome`）を完了の判定へ渡す。
- `src/exec/run/schedule-task.ts`: reporter からの再開で `reviewGradeRefreshed` がある場合は、保存された executor の結果を使わず、executor から流し直す。
- `src/exec/worktree-ops-lifecycle.ts`: checkpoint の commit の処理を `commitCheckpointPaths` に切り出した。既存の worktree へ root の差分だけを取り込んで commit する `refreshWorktreeCheckpoint` を足した（`worktree-ops.ts` から export）。
- `src/exec/worktree-ops-merge.ts`: merge の前の grade の検査で、root の内容が branch の先端と同じであれば通すようにした。root にしかない新しい評価結果は、これまでどおり捨てずに止める。
- `src/exec/run/lifecycle-commands.ts`: 統合の段からの再開の `claimActor` を、`last_by` から `claimOwnerOf` に替えた。
- `docs/ja/specdojo/guides/review-guide.md`: 再開のときの grade の取り込みと、executor からの流し直しを書いた。
- 回帰テスト:
  - `tests/src/exec/worktree-ops.integration.test.ts`: root の新しい grade を再開の worktree に取り込み、merge できること。同じ内容のときは commit しないこと。
  - `tests/src/exec/unblock-claim-owner.test.ts`: reopen の後に claim し直した review が、claim の持ち主で completion preflight を通ること（fallback の actor では通らない）。block の後に人が unblock しても持ち主が変わらないこと。

### 5.3. 判断した点

- 案 A（review の段をやめて grade を直接流す）は運用の決定であり、runner の振る舞いは変えていない。案 A の運用を戻したときも、再開の経路で古い grade を使わないように直した。
- 新しく claim した run には何も足していない。prepare の checkpoint が root の grade を exec branch へ持ち込み、grade も agent より前に流れているため。
- grade が失敗したときも review の agent を起動し、完了の段で blocked にする判断（PJR-M18B）は変えていない。
- 再開の worktree では、取り込むのは評価結果サイドカーだけにした。root の評価対象が claim の後に変わった場合、worktree の評価対象とは一致しないため grade-stale になる。この場合は reopen して流し直す。

### 5.4. 残課題

- grade の取り込みから reporter の再開の流し直しまでを、`runPreparedTask` ごと通す統合テストはない。取り込みと merge は統合テストで確かめた。分岐の配線は、型の検査とコードの確認で確かめた。
- 代表の review の段で、agent を実際に動かして通るかは確かめていない（agent の起動と利用枠が要る）。

### 5.5. CHANGELOG に書く事項

- Fixed: schedule の review を再開するとき（reporter・executor からの再開）、runner が agent の前に grade を確かめ、最新の評価結果を exec branch に取り込むようにした。取り込んだ reporter からの再開では、古い grade で判定した executor の結果を使わず、executor から流し直す。root の grade が新しくなっていても、branch に取り込んだものと同じであれば統合が止まらない。
- Fixed: 統合の段から再開したとき、completion preflight を claim の持ち主で判定するようにした。

## 6. 関連ドキュメント

- [[prj-0001:pjr-m18b-review-grade-failure-blocks-completion]]
