---
specdojo:
  id: prj-0001:pjr-es57-register-file-ssot-migration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-ES57 登録簿を1項目1ファイル正本へ移行し pjr-index を生成ビュー化する

## 1. 概要

[[prj-0001:pjr-9y7g-register-item-file-as-ssot]] で選択肢 B を採択したため、登録項目の正本を個票 frontmatter へ一本化し、`pjr-index.md` を `generated/` 配下の派生ビューへ移行する。正本の粒度を実体（登録項目）単位に合わせることで、index と個票の同期規則、表末尾の追記競合、それを回避するための補償機構を不要にする。未リリースのうちに実施する。

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

| No  | 作業                                                            | 担当   | 状態 | メモ                                                    |
| --- | --------------------------------------------------------------- | ------ | ---- | ------------------------------------------------------- |
| 1   | 個票 frontmatter のスキーマ定義（登録項目の全構造化フィールド） | _TODO_ | open | 既存の frontmatter スキーマ体系へ統合する               |
| 2   | register CLI の読み書き先を個票へ変更                           | _TODO_ | open | `add` / 状態遷移 / `update` が対象                      |
| 3   | `pjr-index.md` の生成ビュー化と `generated/` への移動           | _TODO_ | open | 追跡対象から外す。生成順序の決定性を担保する            |
| 4   | 補償機構の撤去と `renumber` の縮小                              | _TODO_ | open | 予約経路・統合ブランチルーティング・同期 npm script     |
| 5   | rulebook・運用ガイド・テンプレートの更新                        | _TODO_ | open | 同期規則の削除、個票分離基準の廃止                      |
| 6   | 既存登録項目の一括移行                                          | _TODO_ | open | 表の行から個票 frontmatter を生成する移行処理を用意する |
| 7   | 台帳の差分レビュー代替手段の決定と実装                          | _TODO_ | open | 一覧表示コマンド、pull request での確認方法など         |
| 8   | 検証とテストの更新                                              | _TODO_ | open | 表専用スキーマの廃止に伴う検証経路の付け替えを含む      |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-9y7g-register-item-file-as-ssot]]: 本作業の根拠となる決定（選択肢 B の採択）
- [[specdojo:pjr-rulebook]]: 更新対象の記載ルール
- [[specdojo:register-operation-guide]]: 更新対象の運用手順
- [[prj-0001:pjr-index]]: 移行対象の登録項目一覧
