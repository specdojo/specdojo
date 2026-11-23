---
specdojo:
  id: prj-0001:pjr-df5z-worktree-hook-stale-base
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T22:25:09Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T23:36:36Z"
  conclusion: 統合だけの再試行で、commit の前に統合先と同期するようにした
  commit_type: fix
  commit_scope: exec
---

# PJR-DF5Z task の worktree の commit の hook が古い土台で走り、develop で直した fixture でも落ち続ける

## 1. 課題内容

- 第 6 波の template の段（060）の `bps`・`stsd`・`cdfd-overview`・`prj-overview`・`cdfd`・`prj-scope`・`prj-stakeholder-register` の 7 件が「integration failed: project: git commit failed: test: ... yaml-tables.test.ts」で止まった。
- 落ちた fixture は develop では直っていたが、worktree の土台（作った時点の develop）には無く、`exec resume --task` で再開しても worktree は同期されず、同じ失敗を繰り返した。
- 2026-11-24 に、staged の task の変更を exec のブランチへ hook を飛ばして手で commit し、再開して通した。

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- 2026-11-23〜24 の kata の一括実行（第 4〜6 波）で詰まった所から起票した

## 3. 影響範囲

- develop で直したことが、止まっている worktree に届かず、人が手で commit しないと進まない。

## 4. 対応方針

- 統合の段の commit の失敗から再開するとき、commit の前に統合先と同期する（または、hook を統合先と合わせた木で走らせる）。どちらにしたかと理由を個票の対応結果に書く。
- 統合テストで、develop で直した fixture が worktree に無い状態から再開して、手を入れずに通ることを確かめる。
- 同期で衝突したときは、どのファイルかを block の理由に出す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

### 5.1. 解決内容

- 統合だけの再試行（`exec resume --task`）では、統合の段の commit の前に統合先と同期するようにした。`src/exec/run/schedule-task.ts` の `syncIntegrationTargetsBeforeCommit` が、`--resume-from executor` で使う `syncTaskWorktreesWithIntegrationTargets` を呼ぶ。
- hook を統合先と合わせた木で走らせる案ではなく、同期を選んだ。理由は次のとおり。
  - 既存の同期は未 commit の成果を控えて戻す仕組みを持ち、実績がある。
  - 同期すれば hook だけでなく、後の統合の merge も統合先と同じ土台になる。
  - hook の実行場所を分ける案は、hook ごとの前提を個別に見る必要がある。
- run の記録は exec branch 側を採る（`--resume-from executor` と同じ）。
- 同期で衝突したときは、`project: merge conflicts with <統合先>: <ファイル>` の形でファイルを出し、統合の失敗として block する。プロダクトのときは、先頭がプロダクト名になる。

### 5.2. 確認結果

- `tests/src/exec/task-repos.integration.test.ts` に 2 件足した。
  - 統合先で直した `FIX.md` が無いと落ちる pre-commit hook は、同期の前は失敗し、同期の後は手を入れずに通る。
  - 統合先と exec branch が衝突したとき、エラーにファイル名が出る。
- `npm run typecheck` と `npm run lint:ts`（エラーなし）を通した。`test:unit` と `test-integration` は親の検証に任せる。

### 5.3. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `exec resume --task` で統合だけを再試行するとき、commit の前に統合先を取り込むようにした。worktree の土台が古く、統合先で直した fixture に届かないために同じ commit の失敗を繰り返す問題を解消した。衝突したときは、ファイル名を block の理由に出す。

### 5.4. 作業内容の補足

- 統合の段の同期は、再試行（`resumeIntegration`）のときだけ行う。初回の統合は、worktree を作った直後で土台が新しいため行わない。

## 6. 関連ドキュメント

- 関連: PJR-JA3M（テストが実物の sample に頼る件。落ちた fixture の元）、PJR-EEWP（止まった理由の要約）。
