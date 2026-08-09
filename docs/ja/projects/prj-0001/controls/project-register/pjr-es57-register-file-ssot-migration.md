---
specdojo:
  id: prj-0001:pjr-es57-register-file-ssot-migration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_on: "2026-08-09"
  due_on: "2026-08-31"
---

# PJR-ES57 登録簿を1項目1ファイル正本へ移行し pjr-index を生成ビュー化する

## 1. 概要

PJR-9Y7G の決定（選択肢B）に基づき、個票 frontmatter を正本、pjr-index.md を generated の派生ビューへ移行する。CLI・スキーマ・rulebook・テンプレート・既存項目移行を対象とする。

[[prj-0001:pjr-9y7g-register-item-file-as-ssot]] で選択肢 B を採択したため、登録項目の正本を個票 frontmatter へ一本化し、`pjr-index.md` を `generated/` 配下の派生ビューへ移行する。正本の粒度を実体（登録項目）単位に合わせることで、index と個票の同期規則、表末尾の追記競合、それを回避するための補償機構を不要にする。未リリースのうちに実施する。

作業量が1回の実行に収まらないため、2026-08-09 に 8 件の登録項目へ分割した。本項目は分割元として全体の進捗を追跡し、個別の実作業は分割先で行う。

## 2. 完了条件

- 個票 frontmatter が登録項目の唯一の正本になっている。処理状態・優先度・担当・期限・完了日・結論・分類が frontmatter に定義され、共通の frontmatter スキーマで検証される。
- `pjr-index.md` が `generated/` 配下の生成物として出力され、追跡対象から外れている。手編集を前提とする運用が残っていない。
- register の全サブコマンド（`add` / 状態遷移 / `update` / `build` / `where`）が個票を読み書きし、`pjr-index.md` を直接編集しない。
- 一覧生成が決定的（ID 昇順などの固定ソート）で、同一入力から同一出力が得られる。
- 補償機構（`--reserve` / `--local` / `--strict-sync` / 統合ブランチ自動ルーティング）が撤去され、`renumber` は乱数 ID 衝突の救済のみに縮小されている。
- [[specdojo:pjr-rulebook]] から `index と個別登録項目の同期` が削除され、「個票を作る項目／作らない項目」の二分が廃止されている。
- 既存の全登録項目が個票へ移行され、検証（frontmatter スキーマ、履歴リンク、Markdown lint）が通る。
- 台帳の差分レビュー喪失に対する代替手段が決まり、運用ガイドに記載されている。
- 既存テストが green で、移行後の挙動を検証するテストが追加されている。

## 3. 作業内容

本項目は分割元として全体を追跡し、実作業は次の登録項目で行う。番号は推奨する実施順序を表す。

| No  | 分割先の登録項目                                       | 担当 | 状態 | メモ                                       |
| --- | ------------------------------------------------------ | ---- | ---- | ------------------------------------------ |
| 1   | [[prj-0001:pjr-rf3b-register-item-frontmatter-schema]] | ARC  | open | 後続すべての前提となる                     |
| 2   | [[prj-0001:pjr-tt4j-register-cli-write-to-tickets]]    | ARC  | open | 1 に依存する                               |
| 3   | [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]]      | ARC  | open | 1 に依存する                               |
| 4   | [[prj-0001:pjr-9p5q-migrate-existing-register-items]]  | ARC  | open | 1 と 3 に依存する                          |
| 5   | [[prj-0001:pjr-37wn-remove-id-reservation-mechanisms]] | ARC  | open | 2 に依存する                               |
| 6   | [[prj-0001:pjr-vc94-update-validation-and-tests]]      | ARC  | open | 1 から 5 の完了後に実施する                |
| 7   | [[prj-0001:pjr-rdnc-update-docs-for-ticket-ssot]]      | ARC  | open | 5 の撤去範囲が確定してから記述を確定する   |
| 8   | [[prj-0001:pjr-gh26-ledger-review-alternative]]        | ARC  | open | 3 に依存する。決定を伴うため早期の着手も可 |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-9y7g-register-item-file-as-ssot]]: 本作業の根拠となる決定（選択肢 B の採択）
- [[specdojo:pjr-rulebook]]: 更新対象の記載ルール
- [[specdojo:register-operation-guide]]: 更新対象の運用手順
- [[prj-0001:pjr-index]]: 移行対象の登録項目一覧
