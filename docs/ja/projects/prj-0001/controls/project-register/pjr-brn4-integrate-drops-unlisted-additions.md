---
specdojo:
  id: prj-0001:pjr-brn4-integrate-drops-unlisted-additions
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-06T16:07:41Z"
  due_on: null
  derived_from:
    - PJR-XD12
---

# PJR-BRN4 worktree の統合が許可外の追加を黙って落とし、移動が削除だけになる

## 1. 課題内容

PJR-XD12 の統合で、docs/ja/product/trash/ の 22 件の削除だけが commit され、移動先の archive/ja/product/trash/（22 件と links.json）は commit されずに worktree ごと消えた。run は success で終わった

## 2. 入力

- 2026-11-07 01:04 の PJR-XD12 の run（commit 2f7279ec9）。executor は sandbox で git mv が使えず、作業ツリーの中でファイルを移した。統合の commit には trash の 22 件の削除と、dct-data-flow.yaml の path の書き換え、archive-links.ts とテストが入ったが、archive/ 配下の 23 件は入らなかった。run の要約は success・commit=committed で、落ちたファイルの警告は出ていない（2026-11-07 orchestrator の確認）
- 影響: develop の HEAD に 22 件がどちらの場所にもなく、catalog validate が archive のパスに 18 件の警告を出す。Git の履歴には残る（2026-11-07）
- 関連: PJR-9BY9 は約 3,000 件を新しい配置へ移す。同じ動きなら、削除だけが commit される（2026-11-07）
- orchestrator は、削除の直前の commit から 22 件を取り出し links.json を作り直した復元を、feature/prj-0001/restore-archived-trash の worktree に未 commit で用意した。反映は利用者の承認のもと行う（2026-11-07）

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
