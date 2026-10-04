---
specdojo:
  id: prj-0001:pjr-smet-register-stale-block-reason
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-10-04T03:46:04Z"
  due_on: null
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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-27z9-codex-bwrap-proc-mount]]: 観測した個票。
