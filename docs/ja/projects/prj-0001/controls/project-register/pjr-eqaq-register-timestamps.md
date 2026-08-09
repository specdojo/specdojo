---
specdojo:
  id: prj-0001:pjr-eqaq-register-timestamps
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_on: "2026-08-09"
  due_on: "2026-08-31"
---

# PJR-EQAQ 登録簿日時をregistered_at・completed_atへ移行する

## 1. 概要

登録簿の起票・完了時刻をUTCのRFC 3339秒精度で記録する。既存項目はGit履歴から可能な範囲で復元し、時刻不明時は既存日付の21:00（プロジェクトタイムゾーン）として移行する。

## 2. 完了条件

- 新規個票の `registered_at` と、終端化した個票の `completed_at` がUTCのRFC 3339秒精度で定義され、`due_on` はプロジェクトタイムゾーン上の暦日として維持されている。
- `register add` は実行時刻を `registered_at` へ自動設定し、`register close` / `register reject` は実行時刻を `completed_at` へ設定し、`register reopen` は `completed_at` を削除する。
- CLIで日時を明示する場合はタイムゾーン付きRFC 3339値を受け付け、UTCへ正規化して保存する。
- 登録項目一覧・派生ビューの日付表示は、`registered_at` / `completed_at` をプロジェクトの `register_date_timezone` へ変換して導出される。
- 既存個票は旧 `pjr-index.md` と個票のGit履歴から起票・終端遷移の時刻を可能な範囲で復元し、復元できない時刻は既存の `registered_on` / `completed_on` の日付にプロジェクトタイムゾーンの21:00を補ってUTCへ変換する。
- 移行後の個票から `registered_on` / `completed_on` が削除され、移行規則と結果がこの個票の対応結果へ記録されている。
- スキーマ、ルールブック、運用ガイド、コマンドリファレンス、実装および自動テストが新しい日時仕様と一致している。

## 3. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ                                                |
| --- | ---------------------------------------------------------------- | ---- | ---- | --------------------------------------------------- |
| 1   | `registered_at` / `completed_at` のスキーマと記述規則を定義する  | ARC  | open | UTC・RFC 3339・秒精度。`due_on` は維持              |
| 2   | registerコマンドの自動設定・明示入力・reopen処理を更新する       | ARC  | open | 日時入力はUTCへ正規化                               |
| 3   | 一覧・派生ビュー・履歴処理を新しい日時フィールドへ対応させる     | ARC  | open | 表示日は `register_date_timezone` で導出            |
| 4   | Git履歴と既存日付を用いる一度限りの移行処理を実装する            | ARC  | open | 時刻不明時はプロジェクトタイムゾーンの21:00を使用   |
| 5   | 既存個票を移行し、旧 `registered_on` / `completed_on` を削除する | ARC  | open | 復元・フォールバック件数を対応結果へ記録            |
| 6   | 自動テストと関連文書を更新し、生成ビュー・履歴の整合性を検証する | ARC  | open | add / close / reject / reopen / migrateを対象とする |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0xxz-pjr-index]]
- [[specdojo:pjr-rulebook]]
- [[specdojo:register-operation-guide]]
- [[specdojo:command-reference]]
