---
specdojo:
  id: prj-0001:pjr-ycmr-queue-step-prefix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: low
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-23T22:26:23Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: exec
---

# PJR-YCMR exec queue add が specdojo を先頭に付けた段を受け付けず、queue status はその書き方で表示する

## 1. 課題内容

- `exec queue status` は段を `specdojo exec run --auto ...` と表示する。
- 2026-11-24 に、表示と同じ書き方で `exec queue add ... --step-continue "specdojo exec run --auto ..."` を流すと「unsupported step ... (allowed: "grade run ...", "exec run ...", "post-integration build-dist")」で失敗し、列が作られず一括実行が始まらなかった。

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- 2026-11-23〜24 の kata の一括実行（第 4〜6 波）で詰まった所から起票した

## 3. 影響範囲

- 表示を写して列を作ると失敗し、気づかないと後続が流れない。

## 4. 対応方針

- 段の先頭の `specdojo` を受け付けるか、表示を受け付ける書き方にそろえる。どちらにしたかを個票の対応結果に書く。
- 単体テストで、両方の書き方の扱いを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

- 解決内容: `parseQueueStepSpec`（`src/exec/queue.ts`）が段の先頭の `specdojo` を読み捨てるようにした。`exec queue status` の表示をそのまま `--step` / `--step-continue` に渡せる。先頭に付けない書き方も従来どおり受け付ける（両方を受け付ける方にした）。
- 確認結果: `tests/src/exec/queue.test.ts` に、両方の書き方が同じ段になる単体テストを追加した。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の `test-integration` は runner が実行する。
- 再発防止策: 上記の単体テスト。

### 5.1. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `exec queue add` の段が、`exec queue status` の表示と同じ `specdojo` を先頭に付けた書き方でも受け付けられるようにした（PJR-YCMR）。

## 6. 関連ドキュメント

- 関連: PJR-2X6K（再開の扱い）。
