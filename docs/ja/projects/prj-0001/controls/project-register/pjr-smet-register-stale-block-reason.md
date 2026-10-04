---
specdojo:
  id: prj-0001:pjr-smet-register-stale-block-reason
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: low
  owner: DEV
  registered_at: "2026-10-04T03:46:04Z"
  due_on: null
  completed_at: "2026-10-04T05:59:33Z"
  conclusion: waiting 以外への遷移で block_reason を消し、変更前の理由はイベントに残すようにした。register update --block-reason を追加した。実際の遷移と npm run check で確認した
---

# PJR-SMET review や start への遷移で block_reason が残る

## 1. 課題内容

register review で waiting から review へ戻しても、frontmatter の block_reason が残る（PJR-27Z9 で観測）。register update にも block_reason を消す手段がなく、解消済みの理由が表示され続ける

## 2. 影響範囲

| 観点         | 影響                                         |
| ------------ | -------------------------------------------- |
| スコープ     | waiting から別の状態へ遷移した register 個票 |
| スケジュール | なし                                         |
| コスト       | 誤った block_reason を読んだ人の確認の手間   |
| 品質         | 解消済みの理由が個票と一覧に表示され続ける   |
| 関係者       | register の利用者                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 遷移時に block_reason を消す処理と、消すための CLI がない                                                                                 |
| 対応策   | waiting / blocked 以外への遷移で block_reason を消す。必要なら `register update` に消す手段を加える                                       |
| 依存事項 | なし                                                                                                                                      |
| 完了条件 | review・start・close などへの遷移で block_reason が消え、イベントには遷移前の理由が残る。unit test で検証している。`npm run check` が通る |

## 4. 対応結果

- 登録項目の更新処理で、遷移先が `waiting` 以外なら個票 Frontmatter の `block_reason` を削除するようにした。`start` / `review` / `close` / `reject` / `defer` / `reopen` の各経路に適用され、削除前の理由は項目別イベントログの `changes` に残る。
- `register update --block-reason <text>` を追加した。`waiting` 中は理由を更新でき、`-` で状態を変えずに誤った現在値を削除できる。`waiting` 以外で理由を設定する操作は拒否する。
- unit test に、非 `waiting` への各遷移での削除、イベントへの変更前理由の保持、`register update` による更新・削除・不正設定の拒否を追加した。

確認（2026-10-04）: 本機能で PJR-SMET 自身を waiting から review へ遷移させ、frontmatter の `block_reason` が消え、イベントの `changes` に変更前の理由が残ることを確認した。`register update --block-reason -` で PJR-27Z9 の古い `block_reason` も消した。`npm run check`（1,991 件のテストを含む）も通過した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-27z9-codex-bwrap-proc-mount]]: 観測した個票。
