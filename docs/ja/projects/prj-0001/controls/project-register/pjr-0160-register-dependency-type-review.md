---
specdojo:
  id: prj-0001:pjr-0160-register-dependency-type-review
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  completed_at: "2026-08-07T12:00:00Z"
  conclusion: 案A（dependency type 廃止）を採択。enum・VALID_TYPES・テンプレート・schema・docs・テストを一貫更新。実績0件のため移行不要。必要時は後方互換の追加で再導入。
  register_events:
    - v: 1
      id: reg_7cd94ae89cafac07a085bdad2ceea88f
      ts: "2026-08-07T04:53:57Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "chore(register): PJR-0160をopenで起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 登録簿type dependencyの要否見直し(廃止 or Assumption Log化 or 明文化)
        - field: description
          from: ""
          to: 登録簿 type の `dependency` は PMBOK 標準の登録簿ではなく、SpecDojo 独自に「外部の対応・提供物への依存（外部待ち）」を記録するために用意された type である。しかし exec 実行区分（edit/investigate）を持たず、生成 PM ログも無く、実績は 0 件で、`waiting` ステータスや `prj-assumptions-constraints-dependencies` 成果物と役割が重複している。8 type 中で最も配線が薄い純ラベルであるため、要否を判断し対応する。
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
      legacy_commit: ca04fc25dcd36f1959a6df233c299af8ff68a15a
    - v: 1
      id: reg_78f02d11d909a530c143018979fed755
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
          from: 登録簿 type の `dependency` は PMBOK 標準の登録簿ではなく、SpecDojo 独自に「外部の対応・提供物への依存（外部待ち）」を記録するために用意された type である。しかし exec 実行区分（edit/investigate）を持たず、生成 PM ログも無く、実績は 0 件で、`waiting` ステータスや `prj-assumptions-constraints-dependencies` 成果物と役割が重複している。8 type 中で最も配線が薄い純ラベルであるため、要否を判断し対応する。
          to: dependencyはPMBOK非標準でexec実行区分/生成PMログなし・実績0件。waitingステータスおよびprj-assumptions-constraints-dependencies成果物と役割が重複。廃止/assumption type化/rulebook明文化のいずれかを決定し対応する。enum変更はschema・VALID_TYPES・exec-registerのSet・テンプレ・docsの同時修正を伴う破壊的変更。
        - field: conclusion
          from: "-"
          to: 案A（dependency type 廃止）を採択。enum・VALID_TYPES・テンプレート・schema・docs・テストを一貫更新。実績0件のため移行不要。必要時は後方互換の追加で再導入。
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_7cd94ae89cafac07a085bdad2ceea88f
    - v: 1
      id: reg_3f11891fe1b4a63a353ee75f59983bf1
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-08-07"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_78f02d11d909a530c143018979fed755
---

# PJR-0160 登録簿type dependencyの要否見直し(廃止 or Assumption Log化 or 明文化)

## 1. 概要

dependencyはPMBOK非標準でexec実行区分/生成PMログなし・実績0件。waitingステータスおよびprj-assumptions-constraints-dependencies成果物と役割が重複。廃止/assumption type化/rulebook明文化のいずれかを決定し対応する。enum変更はschema・VALID_TYPES・exec-registerのSet・テンプレ・docsの同時修正を伴う破壊的変更。

登録簿 type の `dependency` は PMBOK 標準の登録簿ではなく、SpecDojo 独自に「外部の対応・提供物への依存（外部待ち）」を記録するために用意された type である。しかし exec 実行区分（edit/investigate）を持たず、生成 PM ログも無く、実績は 0 件で、`waiting` ステータスや `prj-assumptions-constraints-dependencies` 成果物と役割が重複している。8 type 中で最も配線が薄い純ラベルであるため、要否を判断し対応する。

## 2. 完了条件

- `dependency` を「廃止」「`assumption` type へ置換（PMBOK Assumption Log 準拠）」「現状維持＋明文化」のいずれかに決定し、根拠を記録している。
- 決定した方針に沿って、必要な成果物（schema / コード / テンプレート / ドキュメント）が一貫して更新されている。
- enum を変更する場合、`pjr-index.schema.yaml`・`register.ts` の `VALID_TYPES`・`exec-register.ts` の `EDIT_TYPES`/`INVESTIGATE_TYPES`・type 別個票テンプレート・`pjr-rulebook` / `register-operation-guide` が齟齬なく更新されている。
- 既存データに `dependency` 行がある場合の移行方針（別 type への振替 or 据え置き）が定義されている。
- 変更後に `npm run lint:md` / `npm run lint:ts` / `npm run validate:schema` / 関連テストが通る。

## 3. 設計方針（検討する3案）

| 案                  | 内容                                                                                           | 補足                                               |
| ------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| A. 廃止             | `dependency` を enum から除去し、外部待ちは `todo`/`issue` ＋ `waiting` ステータスで表現する   | 最小構成。重複解消。移行は既存行の type 振替が必要 |
| B. `assumption` 化  | `dependency` を廃し、PMBOK 標準の Assumption Log に対応する `assumption` type と生成ログを追加 | PMBOK 準拠度が上がるが実装量は最大                 |
| C. 現状維持＋明文化 | enum は変えず、`dependency` の用途と `waiting`/成果物との使い分けを rulebook に明記            | 破壊的変更なし。重複の混乱のみ解消                 |

## 4. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ                                     |
| --- | ---------------------------------------------------------------- | ---- | ---- | ---------------------------------------- |
| 1   | 3案（廃止 / assumption化 / 明文化）の比較と方針決定              | ARC  | done | 案A（廃止）を採択                        |
| 2   | 決定に応じた schema / コード / テンプレート / ドキュメントの更新 | ARC  | done | enum・VALID_TYPES・テンプレ・docs を修正 |
| 3   | 既存 `dependency` 行の移行対応（振替 or 据え置き）               | ARC  | done | 該当 0 件のため振替不要                  |
| 4   | lint / schema / テストによる検証                                 | ARC  | done | ts/md/schema/テスト green                |

## 5. 対応結果

- 3案を比較し、**案A（`dependency` type の廃止）** を採択した。人間の権限者による承認をもって、[[prj-0001:pjr-0161-register-approval-workflow-policy]] が定める「enum 変更は承認ワークフロー対象」のゲートを満たしたうえで実施した。
- 採択理由: `dependency` は PMBOK 非標準・実績 0 件・exec 実行区分/生成PMログを持たない最も配線の薄い純ラベルで、`waiting` ステータスおよび `prj-assumptions-constraints-dependencies` 成果物と役割が重複していた。可逆性の観点でも、実績 0 件の今に enum から削除する方が安全で、将来必要になった場合の再導入は後方互換の追加変更で容易であるため。案B（assumption 化）は実装量が最大で PMBOK 準拠の必要性が現時点で薄く、案C（明文化）は重複の根本（type の存在）を残すため、いずれも見送った。
- 実装（配線を漏れなく修正）:
  - `src/register.ts` の `VALID_TYPES` から `dependency` を削除。
  - `src/exec-register.ts` の実行対象外 type コメントを `decision / note` に修正。
  - `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` の `item_type` enum、`docs/ja/specdojo/schemas/v1/pjr-index-content.schema.yaml` の `分類` enum から削除。
  - テンプレート `docs/ja/specdojo/templates/pjr-dependency-template.md` を削除。
  - [[specdojo:pjr-rulebook]]・[[specdojo:register-operation-guide]]・[[specdojo:command-reference]] の `dependency` 記述を除去し、外部待ちは `todo`/`issue`＋`waiting`、計画上の依存は ACD 成果物で表す旨を明記。
  - テスト（`exec-register.test.ts` の対象外 type、`routine.test.ts` の許可 type 列）を更新。
- 移行方針: enum から削除するが prj-0001 に `dependency` 行は 0 件のため、既存データの type 振替は不要（据え置き対象なし）。
- 再導入の指針: 将来「外部依存の追跡台帳」が実需となった場合は、enum への追加（後方互換の非破壊変更）として再導入し、exec 実行区分・生成PMログ・テンプレートを併せて整備する。
- 検証: `npm run build` / `lint:ts` / `lint:md` / `validate:schema` / 関連テストが green。

## 6. 関連ドキュメント

- [[specdojo:pjr-rulebook]]
- [[specdojo:register-operation-guide]]
- `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`
- `docs/ja/specdojo/schemas/v1/pjr-index-content.schema.yaml`
