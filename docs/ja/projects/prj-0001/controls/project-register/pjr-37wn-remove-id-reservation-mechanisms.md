---
specdojo:
  id: prj-0001:pjr-37wn-remove-id-reservation-mechanisms
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_on: "2026-08-09"
  due_on: "2026-08-31"
  conclusion: "checkpoint failed: git add -- docs/ja/projects/prj-0001/controls/project-register/pjr-index.md docs/ja/projects/prj-0001/execution/exec/plans/pjr-37wn-20260809T110448Z-4c53-plan.md docs/ja/projects/pr…"
---

# PJR-37WN ID 予約などの競合回避機構を撤去し renumber を縮小する

## 1. 概要

PJR-ES57 の分割5。統合ブランチ自動ルーティング・予約経路・同期 script を撤去し、renumber を乱数 ID 衝突の救済のみへ縮小する。

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
| 1   | 撤去対象の機構と参照箇所を洗い出す   | ARC  | done | 予約経路・自動ルーティング・同期 script・関連設定 |
| 2   | 予約経路と自動ルーティングを撤去する | ARC  | done | 廃止オプションは未知オプションとして拒否する      |
| 3   | 同期 script と関連設定を整理する     | ARC  | done | 統合ブランチ worktree 前提の処理を削除した        |
| 4   | `renumber` を縮小する                | ARC  | done | 乱数 ID 衝突の救済としての役割を明示した          |

## 4. 対応結果

- `register add` を常に現在の作業ツリーの個票作成に統一し、統合ブランチへの自動ルーティング、予約 commit、fetch / ff-only 同期を撤去した。
- `--reserve`、`--local`、`--strict-sync`、`--integration-branch`、`--integration-worktree` と `register where` を削除した。廃止した `add` オプションは Commander の未知オプションとしてエラー終了する。
- `run.register_integration_branch`、`register:sync-pull`、`register:sync-push`、予約・同期専用の実装とテストを削除した。乱数 ID の既存 ID 照合・再抽選と、衝突時の `renumber` は維持した。
- 運用ガイド・コマンドリファレンスなどの利用者向け説明の更新は、分割7 [[prj-0001:pjr-rdnc-update-docs-for-ticket-ssot]] の範囲として申し送る。

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-tt4j-register-cli-write-to-tickets]]: 前提となる CLI の書き込み先変更
- [[prj-0001:pjr-0138-register-add-on-integration-branch]]: 撤去対象の機構を導入した項目
- [[prj-0001:pjr-t0vq-pjr-id-length-evaluation]]: ID 空間と衝突可能性の評価
