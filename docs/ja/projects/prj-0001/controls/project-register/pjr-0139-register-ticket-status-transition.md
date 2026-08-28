---
specdojo:
  id: prj-0001:pjr-0139-register-ticket-status-transition
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-07-31"
  completed_at: "2026-07-26T12:00:00Z"
  conclusion: 個票frontmatterのstatus遷移をcloseで実行
  register_events:
    - v: 1
      id: reg_8705d3d169f1a78ef27d9e45fbd5fd5d
      ts: "2026-07-25T23:49:11Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "chore(pjr): PJR-0139を起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 個票frontmatterのstatus遷移を自動化
        - field: description
          from: ""
          to: 個票の frontmatter `status` は文書の成熟度を表すが、遷移させる時期が rulebook に定義されておらず、`register` のどのコマンドも個票の frontmatter を更新しない。`register add` がテンプレート由来で `draft` を書き込んだあとは誰も更新しないため、既存 16 件のうち 15 件が `draft` のまま残り、成熟度の指標として機能していない。
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
      legacy_commit: f1b4dbdba002167820e4c547938f1eeba01536b4
    - v: 1
      id: reg_93d650fa61b87150a4c22485f758962c
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
          from: 個票の frontmatter `status` は文書の成熟度を表すが、遷移させる時期が rulebook に定義されておらず、`register` のどのコマンドも個票の frontmatter を更新しない。`register add` がテンプレート由来で `draft` を書き込んだあとは誰も更新しないため、既存 16 件のうち 15 件が `draft` のまま残り、成熟度の指標として機能していない。
          to: 個票のstatus遷移時期が規約に無くコマンドも更新しないため全件がdraftのまま残る。close/rejectで個票をready/deprecatedへ更新し、遷移基準をrulebookへ明記する
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-07-31"
        - field: conclusion
          from: "-"
          to: 個票frontmatterのstatus遷移をcloseで実行
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_8705d3d169f1a78ef27d9e45fbd5fd5d
    - v: 1
      id: reg_770aa0f7b5552ea6e18646a3d4bf79d3
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-07-26"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_93d650fa61b87150a4c22485f758962c
---

# PJR-0139 個票frontmatterのstatus遷移を自動化

## 1. 概要

個票のstatus遷移時期が規約に無くコマンドも更新しないため全件がdraftのまま残る。close/rejectで個票をready/deprecatedへ更新し、遷移基準をrulebookへ明記する

個票の frontmatter `status` は文書の成熟度を表すが、遷移させる時期が rulebook に定義されておらず、`register` のどのコマンドも個票の frontmatter を更新しない。`register add` がテンプレート由来で `draft` を書き込んだあとは誰も更新しないため、既存 16 件のうち 15 件が `draft` のまま残り、成熟度の指標として機能していない。

個票は「対応結果」まで書けて初めて文書として完結するため、記述が固まる時期は実務上 `close` / `reject` と一致する。遷移基準を rulebook に明記し、`close` / `reject` が個票の `status` を更新するようにする。

`pjr-index` の処理状態と frontmatter の成熟度は別の状態軸であり、同一視してはならない（[[specdojo:pjr-rulebook]]）。両者を機械的に連動させるのではなく、記述が固まっているかを判定した上で遷移させる。

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

- 遷移基準を [[specdojo:pjr-rulebook|プロジェクト登録簿ルールブック]] の `個票 status の遷移基準` に明記した。`draft` は個票生成直後、`ready` は `close` かつ必須節に `_TODO_` なし、`deprecated` は `reject` で遷移する。処理状態を機械的に写像しない点も併記した。
- `src/register.ts` に個票 Frontmatter の `status` を書き換える処理を実装し、`register close` は `ready`、`register reject` は `deprecated` へ更新するようにした。個票列が `-` の項目や個票ファイル不在は従来どおり処理状態のみ更新する。
- `ready` への昇格は本文に `_TODO_` が残っていないことを条件とし、残る場合は昇格せず警告して `draft` を維持する。`_TODO_` 判定は見出し文言に依存せず本文全体を対象とし、i18n 非依存とした。
- `--dry-run` では個票を書き換えず、`Would update ticket status → <status>` の予定を表示する。既に目的の `status` の個票は冪等に扱い内容を変えない。
- 既存 draft 個票の扱いは現状維持（一括更新しない）と決定した。理由は、必須節が未確定な個票を一括で `ready` へ昇格させると成熟度指標が実態とずれるため。既存の終端項目で `ready` にしたいものは `register reopen` 後に `register close` する運用で個別対応する。
- テストは `tests/src/register.test.ts` に追加し、更新対象・警告（`_TODO_` 残存）・個票なし・deprecated 昇格・冪等・dry-run の各ケースを確認した。運用ガイドの `状態遷移とコマンド` とコマンドリファレンスの `register` 表へも反映した。

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]
- [[specdojo:register-operation-guide|SpecDojo登録簿運用ガイド]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
