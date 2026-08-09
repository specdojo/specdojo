---
specdojo:
  id: prj-0001:pjr-37wn-remove-id-reservation-mechanisms
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-37WN ID 予約などの競合回避機構を撤去し renumber を縮小する

## 1. 概要

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割5。表の共有編集を前提として導入した競合回避の補償機構を撤去する。個票が正本になると項目の追加と状態遷移が構造的に衝突しなくなるため、これらの機構は不要になる。

## 2. 完了条件

- 統合ブランチへの自動ルーティングと予約経路が撤去されている。
- 予約に関する CLI オプションが廃止されている。廃止したオプションを指定した場合の挙動が定義されている。
- 統合ブランチ worktree の同期を前提とする npm script が整理されている。
- `renumber` が乱数 ID 衝突の救済のみに縮小されている。
- 撤去に伴って参照されなくなった処理と設定が残っていない。

## 3. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                                              |
| --- | ------------------------------------ | ---- | ---- | ------------------------------------------------- |
| 1   | 撤去対象の機構と参照箇所を洗い出す   | ARC  | open | 予約経路・自動ルーティング・同期 script・関連設定 |
| 2   | 予約経路と自動ルーティングを撤去する | ARC  | open | 廃止オプションの扱いを決めてから実施する          |
| 3   | 同期 script と関連設定を整理する     | ARC  | open | 統合ブランチ worktree 前提の処理が対象            |
| 4   | `renumber` を縮小する                | ARC  | open | 乱数 ID 衝突の救済としての役割は維持する          |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-tt4j-register-cli-write-to-tickets]]: 前提となる CLI の書き込み先変更
- [[prj-0001:pjr-0138-register-add-on-integration-branch]]: 撤去対象の機構を導入した項目
- [[prj-0001:pjr-t0vq-pjr-id-length-evaluation]]: ID 空間と衝突可能性の評価
