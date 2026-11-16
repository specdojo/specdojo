---
specdojo:
  id: prj-0001:pjr-0t83-grade-rework-bloats-documents
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-16T22:28:27Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-CPZH
  commit_type: docs
  commit_scope: pm
---

# PJR-0T83 grade の指摘への手直しで、完了条件の外の指摘まで直し、文書が膨らんで読みにくくなる

## 1. 課題内容

完了条件を満たした後も完了条件の外の観点の major を直し続け、表の列や規則が増えて文書が読みにくくなる。手直しの止め方と大きさ・読みやすさの確かめ方を決める

## 2. 入力

- PJR-CPZH（代替案比較）は 3 回の手直しで本文が 27KB から 75KB に増えた（sample は 20KB）。2 回目の時点でカタログの完了条件 4 件をすべて満たしていたが、完了条件の外の観点（vp-qe-verifiability）の major が同じ趣旨で残り、それに応えるため各セルの根拠の表や集約の規則を足し続けた
- 利用者は 2026-11-17 に、grade の結果以前に内容が分かりにくいと指摘し、運用の問題として起票することを依頼した。担当は BA、期限は 2026-11-30
- 同じ手直しの流れで直した他の文書（PJR-Y5AC など）でも同じことが起きているかは、まだ確かめていない

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
