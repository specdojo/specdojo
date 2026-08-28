---
specdojo:
  id: prj-0001:pjr-37wn-remove-id-reservation-mechanisms
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-09T08:48:42Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-09T11:18:08Z"
  conclusion: 統合ブランチ自動ルーティング・予約経路・同期scriptを撤去し、renumberを乱数ID衝突の救済のみへ縮小した。
  register_events:
    - v: 1
      id: reg_6c63bc333f067f3518db7839f3451a22
      ts: "2026-08-09T08:48:42Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(prj-0001): split PJR-ES57 into 8 register items"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: ID 予約などの競合回避機構を撤去し renumber を縮小する
        - field: description
          from: ""
          to: "[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割5。表の共有編集を前提として導入した競合回避の補償機構を撤去する。個票が正本になると項目の追加と状態遷移が構造的に衝突しなくなるため、これらの機構は不要になる。"
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: ed4a5ebd78cf5d5c024951e1eb834e5a78317135
    - v: 1
      id: reg_04f0915af667dbf6b4d51f40a3787e87
      ts: "2026-08-09T10:55:22Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: description
          from: "[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割5。表の共有編集を前提として導入した競合回避の補償機構を撤去する。個票が正本になると項目の追加と状態遷移が構造的に衝突しなくなるため、これらの機構は不要になる。"
          to: PJR-ES57 の分割5。統合ブランチ自動ルーティング・予約経路・同期 script を撤去し、renumber を乱数 ID 衝突の救済のみへ縮小する。
        - field: priority
          from: medium
          to: high
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_6c63bc333f067f3518db7839f3451a22
    - v: 1
      id: reg_0a8f478963cac7e326d0a356ee96f1b8
      ts: "2026-08-09T11:04:49Z"
      action: wait
      actor: SpecDojo Test
      from_status: open
      to_status: waiting
      reason: "exec(register PJR-37WN): wait"
      changes:
        - field: status
          from: open
          to: waiting
        - field: conclusion
          from: "-"
          to: "checkpoint failed: git add -- docs/ja/projects/prj-0001/controls/project-register/pjr-index.md docs/ja/projects/prj-0001/execution/exec/plans/pjr-37wn-20260809T110448Z-4c53-plan.md docs/ja/projects/pr…"
      legacy_commit: 16bde662a47ce728c47f967bdb75a9a3ae569c8d
      previous_event_id: reg_04f0915af667dbf6b4d51f40a3787e87
    - v: 1
      id: reg_ee3b491c9674bfa2fb8aa5c42486359d
      ts: "2026-08-09T11:10:10Z"
      action: start
      actor: SpecDojo Test
      from_status: waiting
      to_status: in-progress
      reason: "exec(register PJR-37WN): start"
      changes:
        - field: status
          from: waiting
          to: in-progress
      legacy_commit: 5cc55a8c61fd24ad5c1bdd68cf1ee5a4f2acd1c8
      previous_event_id: reg_0a8f478963cac7e326d0a356ee96f1b8
    - v: 1
      id: reg_1967aafddc9b706c765a54dd9bfcf58d
      ts: "2026-08-09T11:17:08Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-37WN): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 7c881bca4c4cab686403497f467100f1365104e8
      previous_event_id: reg_ee3b491c9674bfa2fb8aa5c42486359d
    - v: 1
      id: reg_f8880ac2316a7841ad2fd7379be3326b
      ts: "2026-08-09T11:18:08Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "docs(prj-0001): close PJR-37WN"
      changes:
        - field: status
          from: review
          to: done
        - field: conclusion
          from: "checkpoint failed: git add -- docs/ja/projects/prj-0001/controls/project-register/pjr-index.md docs/ja/projects/prj-0001/execution/exec/plans/pjr-37wn-20260809T110448Z-4c53-plan.md docs/ja/projects/pr…"
          to: 統合ブランチ自動ルーティング・予約経路・同期scriptを撤去し、renumberを乱数ID衝突の救済のみへ縮小した。
      legacy_commit: 0062d4340b4400a03d1825845b217a95218a90b4
      previous_event_id: reg_1967aafddc9b706c765a54dd9bfcf58d
    - v: 1
      id: reg_48b1ea8cfaaaa9a8bd9174a305a38932
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: registered
          from: _TODO_
          to: "2026-08-09"
        - field: completed
          from: "-"
          to: "2026-08-09"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_f8880ac2316a7841ad2fd7379be3326b
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
