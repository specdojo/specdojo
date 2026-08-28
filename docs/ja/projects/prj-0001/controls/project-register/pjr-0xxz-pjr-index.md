---
specdojo:
  id: prj-0001:pjr-0xxz-pjr-index
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-08-31"
  completed_at: "2026-08-08T12:00:00Z"
  register_events:
    - v: 1
      id: reg_9bc53f7e64d74fc20f8761daa0c136d6
      ts: "2026-08-08T03:44:06Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "chore(register): PJR-0XXZを起票（pjr-indexへ登録日列を追加しタイムゾーン設定を導入する）"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: pjr-indexへ登録日列を追加しタイムゾーン設定を導入する
        - field: description
          from: ""
          to: "[[prj-0001:pjr-0163-register-add-id-fetch]] でPJR-IDを数字4桁連番から英数字4桁ランダムへ変更した結果、ID自体から起票の前後関係を読み取れなくなった。`pjr-index.md`には登録日に相当する列がなく、追記方式による行の物理的な並び順だけが起票順の手がかりになっている。行順は現行の`register add`（追記）・`register renumber`・状態遷移コマンド（同一行を書き換えるのみで並べ替えない）では崩れないことを確認済みだが、手動編集や将来の並べ替えに対して脆弱なため、明示的な「登録日」列を追加する。日付計算はOS/コンテナのタイムゾーン設定に依存させず、プロジェクト設定で明示的に指定できるようにする。"
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
      legacy_commit: 3d637a53f100720025273a61f9d519da6f613d6d
    - v: 1
      id: reg_e8629cd1dc3fef61f8776416de77537f
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: done
        - field: description
          from: "[[prj-0001:pjr-0163-register-add-id-fetch]] でPJR-IDを数字4桁連番から英数字4桁ランダムへ変更した結果、ID自体から起票の前後関係を読み取れなくなった。`pjr-index.md`には登録日に相当する列がなく、追記方式による行の物理的な並び順だけが起票順の手がかりになっている。行順は現行の`register add`（追記）・`register renumber`・状態遷移コマンド（同一行を書き換えるのみで並べ替えない）では崩れないことを確認済みだが、手動編集や将来の並べ替えに対して脆弱なため、明示的な「登録日」列を追加する。日付計算はOS/コンテナのタイムゾーン設定に依存させず、プロジェクト設定で明示的に指定できるようにする。"
          to: pjr-index.mdにはID採番順序が失われた(英数字ランダムID化)ため起票順を追える列がない。登録日列(YYYY-MM-DD)を追加し、register add実行時に自動記入する。日付計算はOS/コンテナのTZに依存させず、SpecDojoRunConfigに register*date_timezone(既定UTC)を追加してIntl.DateTimeFormatで明示解決する。既存の完了日デフォルトも同じヘルパーへ統一する。手動でpjr-index.mdを直接編集する場合は不明なら\_TODO*のままでよい(既存の担当・期限と同じ運用)。
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_9bc53f7e64d74fc20f8761daa0c136d6
    - v: 1
      id: reg_4d3b97e1249251d6c130abde24f97e22
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-08-08"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_e8629cd1dc3fef61f8776416de77537f
---

# PJR-0XXZ pjr-indexへ登録日列を追加しタイムゾーン設定を導入する

## 1. 概要

pjr-index.mdにはID採番順序が失われた(英数字ランダムID化)ため起票順を追える列がない。登録日列(YYYY-MM-DD)を追加し、register add実行時に自動記入する。日付計算はOS/コンテナのTZに依存させず、SpecDojoRunConfigに register*date_timezone(既定UTC)を追加してIntl.DateTimeFormatで明示解決する。既存の完了日デフォルトも同じヘルパーへ統一する。手動でpjr-index.mdを直接編集する場合は不明なら\_TODO*のままでよい(既存の担当・期限と同じ運用)。

[[prj-0001:pjr-0163-register-add-id-fetch]] でPJR-IDを数字4桁連番から英数字4桁ランダムへ変更した結果、ID自体から起票の前後関係を読み取れなくなった。`pjr-index.md`には登録日に相当する列がなく、追記方式による行の物理的な並び順だけが起票順の手がかりになっている。行順は現行の`register add`（追記）・`register renumber`・状態遷移コマンド（同一行を書き換えるのみで並べ替えない）では崩れないことを確認済みだが、手動編集や将来の並べ替えに対して脆弱なため、明示的な「登録日」列を追加する。日付計算はOS/コンテナのタイムゾーン設定に依存させず、プロジェクト設定で明示的に指定できるようにする。

## 2. 完了条件

- `pjr-index.md`の登録項目一覧に「登録日」列（`YYYY-MM-DD`、時刻・タイムゾーン表記なし）が追加され、`pjr-rulebook`・スキーマに反映されている。
- `register add`実行時に登録日が自動記入される。
- `SpecDojoRunConfig`（`src/specdojo-config.ts`）に`register_date_timezone`（IANAタイムゾーン名、既定値`UTC`）を追加し、`.specdojo/specdojo.config.json`の`projects.<project-id>.run`配下で設定できる。
- 日付生成は`Intl.DateTimeFormat`のtimeZoneオプション等でタイムゾーンを明示指定し、実行環境のOS/コンテナの`TZ`環境変数には依存しない共通ヘルパーとして実装されている。
- 既存の「完了日」のデフォルト生成（現状UTC固定の`new Date().toISOString().slice(0, 10)`）も同じ共通ヘルパーに統一され、登録日・完了日で計算基準が一致している。
- `pjr-index.md`を直接手編集する場合、登録日が不明なら空欄にせず`_TODO_`と書けばよい（既存の担当・期限と同じ運用）ことが運用ガイドに明記されている。
- 既存項目（登録日列を持たない過去の行）に対する移行方針（例: 一律`_TODO_`、または取得可能な場合はgit履歴から補完するか等）が決まっている。
- 自動テストで、タイムゾーン設定あり/なし双方の日付生成、登録日列の自動記入、完了日との整合が確認できる。
- 運用ガイド・コマンドリファレンス・config関連ドキュメントに変更点が反映されている。

## 3. 作業内容

| No  | 作業                                                                         | 担当 | 状態 | メモ                                                    |
| --- | ---------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------- |
| 1   | `pjr-index.md`・schema・rulebookへ「登録日」列を追加する                     | ARC  | done | 担当と期限の間へ`YYYY-MM-DD`形式の列を追加              |
| 2   | `SpecDojoRunConfig`へ`register_date_timezone`（既定UTC）を追加する           | ARC  | done | `register_integration_branch`と同じ配置・記述スタイル   |
| 3   | タイムゾーン明示指定の共通日付ヘルパーを実装し、登録日・完了日双方へ適用する | ARC  | done | `src/register-date.ts`に集約、`Intl.DateTimeFormat`使用 |
| 4   | 既存項目の移行方針を決めて適用する                                           | ARC  | done | 過去分は一律`_TODO_`（正確な起票日は復元しない）        |
| 5   | 自動テストを追加し、運用ガイド・コマンドリファレンスへ反映する               | ARC  | done | 手動編集時の`_TODO_`運用も明記                          |

## 4. 対応結果

- `pjr-index.md`の登録項目一覧に「登録日」列（担当と期限の間、`YYYY-MM-DD` または未確定は`_TODO_`）を追加し、`pjr-index-content.schema.yaml`（optional_columns・column_rules）と`pjr-rulebook`（標準列・記述ガイド）、`pjr-index-template.md`に反映した。
- `SpecDojoRunConfig`へ`register_date_timezone`（IANAタイムゾーン名、既定`UTC`）を追加し、`.specdojo/specdojo.config.json`の`projects.<project-id>.run`配下で設定できるようにした。
- タイムゾーンを`Intl.DateTimeFormat`のtimeZoneオプションで明示解決する共通ヘルパー`src/register-date.ts`（`formatDateInTimeZone` / `todayInTimeZone` / `resolveRegisterDateTimeZone`）を新設し、OS/コンテナの`TZ`環境変数に依存させない。
- `register add`は登録日を自動記入（`--registered`で上書き可）し、`register close` / `register reject`の完了日デフォルトも同じヘルパーへ統一して計算基準を一致させた（従来の`new Date().toISOString().slice(0,10)`固定UTCを置換）。
- 既存全行（列導入前の過去分）は一律`_TODO_`で移行し、手動編集時も不明なら`_TODO_`とする運用を`register-operation-guide`・`command-reference`へ明記した。
- タイムゾーン設定あり/なし双方の日付生成、登録日列の自動記入・列位置、登録日と完了日の計算基準一致を自動テスト（`register-date.test.ts` ほか）で確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0163-register-add-id-fetch|register addのID採番方式見直しと統合ブランチ予約のfetch同期]]
- [[specdojo:pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[specdojo:register-operation-guide|SpecDojo登録簿運用ガイド]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
