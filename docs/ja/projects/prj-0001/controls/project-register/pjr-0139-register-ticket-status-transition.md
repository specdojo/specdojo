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

| No  | 作業                                                | 担当 | 状態 | メモ                                                    |
| --- | --------------------------------------------------- | ---- | ---- | ------------------------------------------------------- |
| 1   | 個票 status の遷移基準を rulebook へ定義する        | ARC  | done | `個票 status の遷移基準` を新設し処理状態との違いを明示 |
| 2   | 個票 frontmatter の status を更新する処理を実装する | ARC  | done | 個票なし（`-`）と個票ファイル不在は対象外               |
| 3   | close / reject から個票更新を呼び出す               | ARC  | done | close→`ready` / reject→`deprecated`                     |
| 4   | 必須節に `_TODO_` が残る場合の警告を実装する        | ARC  | done | ready へは昇格せず draft を維持                         |
| 5   | dry-run の出力へ個票の変更を含める                  | ARC  | done | 一覧行の変更に続けて個票の変更予定を表示                |
| 6   | 既存 draft 個票の扱いを決めて反映する               | ARC  | done | 現状維持（一括更新しない）と決定                        |
| 7   | テストを追加し、運用ガイドとコマンド一覧へ反映する  | ARC  | done | 遷移時期を運用ガイドの状態遷移へ記載                    |

## 4. 対応結果

- 遷移基準を [[pjr-rulebook|プロジェクト登録簿ルールブック]] の `個票 status の遷移基準` に明記した。`draft` は個票生成直後、`ready` は `close` かつ必須節に `_TODO_` なし、`deprecated` は `reject` で遷移する。処理状態を機械的に写像しない点も併記した。
- `src/register.ts` に個票 Frontmatter の `status` を書き換える処理を実装し、`register close` は `ready`、`register reject` は `deprecated` へ更新するようにした。個票列が `-` の項目や個票ファイル不在は従来どおり処理状態のみ更新する。
- `ready` への昇格は本文に `_TODO_` が残っていないことを条件とし、残る場合は昇格せず警告して `draft` を維持する。`_TODO_` 判定は見出し文言に依存せず本文全体を対象とし、i18n 非依存とした。
- `--dry-run` では個票を書き換えず、`Would update ticket status → <status>` の予定を表示する。既に目的の `status` の個票は冪等に扱い内容を変えない。
- 既存 draft 個票の扱いは現状維持（一括更新しない）と決定した。理由は、必須節が未確定な個票を一括で `ready` へ昇格させると成熟度指標が実態とずれるため。既存の終端項目で `ready` にしたいものは `register reopen` 後に `register close` する運用で個別対応する。
- テストは `tests/src/register.test.ts` に追加し、更新対象・警告（`_TODO_` 残存）・個票なし・deprecated 昇格・冪等・dry-run の各ケースを確認した。運用ガイドの `状態遷移とコマンド` とコマンドリファレンスの `register` 表へも反映した。

## 5. 関連ドキュメント

- [[pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[document-metadata-standard|ドキュメントメタ情報標準]]
- [[register-operation-guide|SpecDojo登録簿運用ガイド]]
- [[command-reference|SpecDojoコマンドリファレンス]]
