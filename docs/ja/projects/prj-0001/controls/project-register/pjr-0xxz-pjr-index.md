---
specdojo:
  id: prj-0001:pjr-0xxz-pjr-index
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0XXZ pjr-indexへ登録日列を追加しタイムゾーン設定を導入する

## 1. 概要

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

| No  | 作業                                                                         | 担当 | 状態 | メモ                                                     |
| --- | ---------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------- |
| 1   | `pjr-index.md`・schema・rulebookへ「登録日」列を追加する                     | ARC  | open | 既存列（期限・完了日）と同じ`YYYY-MM-DD`形式に揃える     |
| 2   | `SpecDojoRunConfig`へ`register_date_timezone`（既定UTC）を追加する           | ARC  | open | `register_integration_branch`と同じ配置・記述スタイル    |
| 3   | タイムゾーン明示指定の共通日付ヘルパーを実装し、登録日・完了日双方へ適用する | ARC  | open | `Intl.DateTimeFormat`使用、OS TZ非依存を自動テストで担保 |
| 4   | 既存項目の移行方針を決めて適用する                                           | ARC  | open | 過去分は`_TODO_`一括、または可能な範囲でgit履歴から補完  |
| 5   | 自動テストを追加し、運用ガイド・コマンドリファレンスへ反映する               | ARC  | open | 手動編集時の`_TODO_`運用も明記                           |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0163-register-add-id-fetch|register addのID採番方式見直しと統合ブランチ予約のfetch同期]]
- [[specdojo:pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[specdojo:register-operation-guide|SpecDojo登録簿運用ガイド]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
