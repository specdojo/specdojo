---
specdojo:
  id: prj-0001:pjr-2x6k-resume-blocked-stages
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-23T22:25:52Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: exec
---

# PJR-2X6K exec resume を --task なしで流すと、doing だけを再開し、止まった段を再開しない

## 1. 課題内容

- 2026-11-24 01:11 に `exec resume --project prj-0001 --parallel 4` を流すと「[resume] 5 doing task(s)」だけを再開し、止まっていた reporter・統合の段の 16 件は再開しなかった。
- ヘルプは「Resume in-flight tasks, blocked reporter/integration stages, or due deferred-limit tasks」と書いている。
- 16 件は `exec resume --task` で 1 件ずつ流した（約 55 分）。

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- 2026-11-23〜24 の kata の一括実行（第 4〜6 波）で詰まった所から起票した

## 3. 影響範囲

- 止まったタスクが多いとき、並べて再開できず時間がかかる。

## 4. 対応方針

- `--task` なしでも止まった reporter・統合の段を再開し、`--parallel` で並べるようにするか、ヘルプを実際の動きに合わせるかを決め、理由を個票の対応結果に書く。前者の場合、利用者の判断が要る止まり方（executor の incomplete など）は対象から外す。
- 単体テストで、選ばれるタスクの組を確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

`--task` なしで `doing` と状態参照のある reporter・統合段の `blocked` を選び、`--parallel` の上限で再開する。大量の停止を個別に再開する負担を解消するため、この動作を採用した。判断が必要な executor 段や状態参照のない停止は自動選択しない。選択の単体テストを追加し、親 runner が型検査・lint・単体／統合テストを実行する。

### 5.1. CHANGELOG に書く事項

- 不具合修正: `exec resume` がタスク未指定でも reporter・統合段で停止したタスクを並列に再開するよう修正。

## 6. 関連ドキュメント

- 関連: PJR-DF5Z、PJR-A54F（再開できなかった止まり方）。
