---
specdojo:
  id: prj-0001:pjr-0139-register-ticket-status-transition
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0139 個票frontmatterのstatus遷移を自動化

## 1. 概要

個票の frontmatter `status` は文書の成熟度を表すが、遷移させる時期が rulebook に定義されておらず、`register` のどのコマンドも個票の frontmatter を更新しない。`register add` がテンプレート由来で `draft` を書き込んだあとは誰も更新しないため、既存 16 件のうち 15 件が `draft` のまま残り、成熟度の指標として機能していない。

個票は「対応結果」まで書けて初めて文書として完結するため、記述が固まる時期は実務上 `close` / `reject` と一致する。遷移基準を rulebook に明記し、`close` / `reject` が個票の `status` を更新するようにする。

`pjr-index` の処理状態と frontmatter の成熟度は別の状態軸であり、同一視してはならない（[[pjr-rulebook]]）。両者を機械的に連動させるのではなく、記述が固まっているかを判定した上で遷移させる。

## 2. 完了条件

- 個票 frontmatter の `status` を `draft` / `ready` / `deprecated` のどの時点で遷移させるかが rulebook に明記されている。
- 遷移基準が `pjr-index` の処理状態そのものではなく、個票の記述が固まっているかに基づくものとして定義されている。
- `register close` が対象個票の `status` を `ready` へ更新する。
- `register reject` が対象個票の `status` を `deprecated` へ更新する。
- 個票の必須節に `_TODO_` が残っている場合は、`ready` へ更新せず警告する。
- 個票を持たない登録項目（個票列が `-`）でも、コマンドがエラーにならず従来どおり完了する。
- 既に目的の `status` になっている個票を再更新しても、内容が変化しない。
- `--dry-run` で個票の変更内容も確認できる。
- 既存 15 件の `draft` 個票の扱い（一括更新するか現状維持か）が決まり、記録されている。
- 更新対象・警告・個票なしの各ケースが自動テストで確認できる。

## 3. 作業内容

| No  | 作業                                                | 担当   | 状態 | メモ                                     |
| --- | --------------------------------------------------- | ------ | ---- | ---------------------------------------- |
| 1   | 個票 status の遷移基準を rulebook へ定義する        | _TODO_ | open | 処理状態との違いを明示する               |
| 2   | 個票 frontmatter の status を更新する処理を実装する | _TODO_ | open | 個票なしの項目は対象外                   |
| 3   | close / reject から個票更新を呼び出す               | _TODO_ | open | ready / deprecated へ振り分ける          |
| 4   | 必須節に `_TODO_` が残る場合の警告を実装する        | _TODO_ | open | ready へは更新しない                     |
| 5   | dry-run の出力へ個票の変更を含める                  | _TODO_ | open | 表の変更と並べて表示する                 |
| 6   | 既存 draft 個票の扱いを決めて反映する               | _TODO_ | open | 一括更新か現状維持かを判断する           |
| 7   | テストを追加し、運用ガイドとコマンド一覧へ反映する  | _TODO_ | open | 遷移時期を運用ガイドの状態遷移へ記載する |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[document-metadata-standard|ドキュメントメタ情報標準]]
- [[specdojo-register-operation-guide|SpecDojo登録簿運用ガイド]]
- [[specdojo-command-reference-guide|SpecDojoコマンドリファレンス]]
