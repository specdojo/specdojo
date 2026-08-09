---
specdojo:
  id: prj-0001:pjr-eqaq-register-timestamps
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-09T14:04:24Z"
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
| 1   | `registered_at` / `completed_at` のスキーマと記述規則を定義する  | ARC  | done | UTC・RFC 3339・秒精度。`due_on` は維持              |
| 2   | registerコマンドの自動設定・明示入力・reopen処理を更新する       | ARC  | done | 日時入力はUTCへ正規化                               |
| 3   | 一覧・派生ビュー・履歴処理を新しい日時フィールドへ対応させる     | ARC  | done | 表示日は `register_date_timezone` で導出            |
| 4   | Git履歴と既存日付を用いる一度限りの移行処理を実装する            | ARC  | done | 時刻不明時はプロジェクトタイムゾーンの21:00を使用   |
| 5   | 既存個票を移行し、旧 `registered_on` / `completed_on` を削除する | ARC  | done | 復元・フォールバック件数を対応結果へ記録            |
| 6   | 自動テストと関連文書を更新し、生成ビュー・履歴の整合性を検証する | ARC  | done | add / close / reject / reopen / migrateを対象とする |

## 4. 対応結果

- 保存形式を「暦日」から「瞬間」へ変更した。個票 Frontmatter の `registered_at` / `completed_at` は UTC の RFC 3339・秒精度（`YYYY-MM-DDTHH:MM:SSZ`）で保存し、`due_on` はプロジェクトタイムゾーン上の暦日のまま維持した。`register-item-frontmatter.schema.yaml` に `Timestamp` 定義を追加し、終端状態（`done` / `decided` / `rejected`）では `completed_at` を必須にした。`deliverable-frontmatter.schema.yaml` も同じ定義を参照するよう改めた。
- 表示と記録を分離した。`PjrItem` は日時を保持し、一覧・派生ビューの「登録日」「完了日」は `toDisplayItem` が `run.register_date_timezone` へ変換して導出する表示値になった。`register history` の比較値も同じ変換を通す。
- register コマンドを更新した。`add` は `registered_at`、`close` / `reject` は `completed_at` へ実行時刻（UTC）を自動設定し、`reopen` は `completed_at` を削除する。`--registered` / `--completed` はタイムゾーン付き RFC 3339 のみ受け付け、UTC へ正規化して保存する。タイムゾーンを含まない値は解釈が実行環境に依存するため拒否する。
- 移行規則は「Git履歴からの復元」を第一とし、復元した時刻の暦日が旧日付と一致しない場合と履歴から復元できない場合に「旧日付＋プロジェクトタイムゾーン21:00」へ退避する二段構えにした。一致判定を挟むのは、個票ファイルの作成が起票より後になっている項目で追加コミットの時刻が起票時刻ではないためで、これにより移行前後で一覧に出る暦日が変わらないことを保証している（計画時に全件検証する）。
- 移行結果は次のとおり。対象 181 件、起票日時は Git 履歴から 22 件復元・1 件フォールバック、完了日時は Git 履歴から 15 件復元・164 件フォールバック。完了日時の復元率が低いのは、個票が正本になる前のリビジョンには `item_status` が無く終端状態を判定できないためで、その場合は 21:00 へ退避している。移行後の 181 個票から `registered_on` / `completed_on` は削除済みで、生成ビューの登録日・完了日は移行前と一致する。
- 移行処理は `register migrate` に統合した。旧 `pjr-index.md` の表を個票へ移す既存の移行に続けて日時移行を実行する。`--dry-run` で対象件数と復元・フォールバックの内訳を確認できる。
- 自動テストを追加・更新した。日時ヘルパー（正規化・表示日導出・21:00 変換・夏時間の往復）、日時移行の計画（Git復元・フォールバック・暦日不一致時の退避・非対象の除外）、CLI（`add` の正規化、`close` の既定値と不正入力の拒否、`reopen` のキー削除、`migrate` の表示日保持）を対象とする。
- 関連文書を更新した。`pjr-rulebook` に日時と日付の使い分けと禁止事項、`register-operation-guide` に記録形式・表示導出・後追い入力、`command-reference` に `--registered` / `--completed` の書式と `register migrate` の説明を反映した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0xxz-pjr-index]]
- [[specdojo:pjr-rulebook]]
- [[specdojo:register-operation-guide]]
- [[specdojo:command-reference]]
