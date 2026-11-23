---
specdojo:
  id: prj-0001:pjr-df5z-worktree-hook-stale-base
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T22:25:09Z"
  due_on: "2026-11-30"
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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- 関連: PJR-JA3M（テストが実物の sample に頼る件。落ちた fixture の元）、PJR-EEWP（止まった理由の要約）。
