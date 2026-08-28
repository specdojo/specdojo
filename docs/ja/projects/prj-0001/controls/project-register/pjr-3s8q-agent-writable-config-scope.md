---
specdojo:
  id: prj-0001:pjr-3s8q-agent-writable-config-scope
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: high
  owner: ARC
  registered_at: "2026-08-21T10:00:22Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-21T13:58:16Z"
  conclusion: 実行コマンドを定義する設定ファイル（package.json、lefthook.yml、.specdojo/**、commitlint 設定、CI 設定）は agent の書き込み範囲に含めず、必要な変更は result の申し送りとして人間または orchestrator が適用する運用に確定した。決定だけでは provider の sandbox 方式に依存して守られないことが PJR-0DA8 で判明したため、PJR-Y3KP で provider 非依存の強制手段を実装し、対象一覧と例外手順を exec 設定ガイドへ明記した。
  register_events:
    - v: 1
      id: reg_6188bc59fe2d65990d4e39d74e1e2b2a
      ts: "2026-08-21T10:01:02Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): add PJR-3S8Q and revert agent config write permissions"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: 実行コマンドを定義する設定ファイルは agent の書き込み範囲に含めない
        - field: description
          from: ""
          to: 親 runner の parent_validations は固定 argv（npm run test:integration）で起動するが、実行される内容は package.json の script 本体である。lefthook.yml のコマンドも commit 時に親コンテキストで実行される。したがって edit agent にこれらの書き込みを許すと、設定できるのは ID だけで任意の command や引数を注入できないという exec-defaults の設計前提が無効になり、サンドボックス外での任意コード実行につながる。PJR-CMYX の対応中に一度 allow へ追加したが取り消し、agent は変更が必要な場合に result へ申し送りとして記録し、人間または orchestrator が適用する運用とする。
        - field: type
          from: ""
          to: decision
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-21"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 8abef5e7a23b57b37cb452fdcfd1728b04ce9359
    - v: 1
      id: reg_11e6fa6353fd36da082b0c471d2ee40a
      ts: "2026-08-21T13:58:17Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: decided
      reason: "docs(register): close PJR-3S8Q agent writable config scope decision"
      changes:
        - field: status
          from: open
          to: decided
        - field: completed
          from: "-"
          to: "2026-08-21"
        - field: conclusion
          from: "-"
          to: 実行コマンドを定義する設定ファイル（package.json、lefthook.yml、.specdojo/**、commitlint 設定、CI 設定）は agent の書き込み範囲に含めず、必要な変更は result の申し送りとして人間または orchestrator が適用する運用に確定した。決定だけでは provider の sandbox 方式に依存して守られないことが PJR-0DA8 で判明したため、PJR-Y3KP で provider 非依存の強制手段を実装し、対象一覧と例外手順を exec 設定ガイドへ明記した。
      legacy_commit: ce4132f45be88f9c6f28405bd377a64f2e2816bb
      previous_event_id: reg_6188bc59fe2d65990d4e39d74e1e2b2a
---

# PJR-3S8Q 実行コマンドを定義する設定ファイルは agent の書き込み範囲に含めない

## 1. 背景

親 runner の parent_validations は固定 argv（npm run test:integration）で起動するが、実行される内容は package.json の script 本体である。lefthook.yml のコマンドも commit 時に親コンテキストで実行される。したがって edit agent にこれらの書き込みを許すと、設定できるのは ID だけで任意の command や引数を注入できないという exec-defaults の設計前提が無効になり、サンドボックス外での任意コード実行につながる。PJR-CMYX の対応中に一度 allow へ追加したが取り消し、agent は変更が必要な場合に result へ申し送りとして記録し、人間または orchestrator が適用する運用とする。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                                                                                        | 利点                                                                                                   | 懸念                                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| A      | 実行コマンドを定義する設定ファイルを agent の書き込み範囲から除外し、必要な変更は result の申し送りとして人間または orchestrator が適用する | 親コンテキストで実行されるコマンドの改変経路を塞げる。既存の parent_validations の設計前提を維持できる | 設定変更を伴うタスクは agent 単独で完結せず、追加の手作業が発生する                                          |
| B      | 対象ファイルを allow に追加し、agent が直接編集できるようにする                                                                             | 設定変更を含むタスクが 1 回の run で完結する                                                           | agent が script や hook の本体を書き換えることで、サンドボックス外の親 runner に任意コマンドを実行させられる |
| C      | 追加は許すが、commit 対象の許可リストで当該ファイルの変更を弾く                                                                             | 編集の利便性を残しつつ commit は防げる                                                                 | 実行は commit 前の検証段階でも起こるため、書き換え自体が有効化される経路を塞げない                           |

## 3. 決定内容

選択肢 A を採択する。`package.json`、`lefthook.yml`、`.specdojo/exec-defaults.yaml`、`.specdojo/claude/settings.*.json`、commitlint 設定、CI 設定など、親コンテキストで実行されるコマンドを定義するファイルは、agent の書き込み許可範囲に含めない。agent はこれらの変更が必要になった場合、変更内容と理由を result の申し送りへ記録して終了し、人間または orchestrator が適用する。

## 4. 採択理由

- 親検証は `src/exec-parent-validation.ts` の固定レジストリから `npm run test:integration` を固定 argv で起動するが、実行される内容は `package.json` の script 本体である。agent が script を書き換えられる場合、固定 argv であることは防御にならない。
- `.specdojo/exec-defaults.yaml` には「設定できるのは ID だけで、agent の evidence や設定ファイルから任意の command / 引数を注入することはできない」と設計意図が明記されており、書き込み許可の追加はこの前提を無効化する。
- `lefthook.yml` のコマンドは commit 時に親コンテキストで実行されるため、同じ種類のリスクを持つ。
- PJR-CMYX では executor が両ファイルへの書き込みを拒否されたが、orchestrator が申し送りに従って適用することで機能面の欠落は生じなかった。運用として成立することが実例で確認できている。

## 5. 承認

| 項目     | 内容                                                      |
| -------- | --------------------------------------------------------- |
| 決定者   | PO                                                        |
| 決定日   | 2026-08-21                                                |
| 承認方式 | commit                                                    |
| 証跡     | 本個票を追加した commit（`docs(register): add PJR-3S8Q`） |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | edit / review 両モードの agent 権限設定と、設定ファイルの変更を含むタスクの進め方。provider ごとに sandbox の方式が異なり、claude は allow リスト、codex は workspace-write のため、決定は文章だけでは全 provider に効かない |
| 必要な対応 | 対象ファイルの一覧を agent 権限設定の運用ドキュメントへ明記する。設定変更が必要なタスクでは、申し送りと人手適用を前提に計画する。provider に依存しない実効的な強制手段を用意する                                             |
| 追跡先     | PJR-CMYX の対応結果に記録済み。権限設定の実体は `.specdojo/claude/settings.edit.json`。強制手段は PJR-Y3KP で追跡する                                                                                                        |

本決定の後、PJR-0DA8 の実行で違反事例が発生した。codex-expert-executor が `.specdojo/claude/settings.report.json` を直接作成し、register 実行の commit 対象が除外方式であるためコミットと merge まで通過した。生成された内容は意図した最小権限と一致していたため成果物としては受け入れたが、決定が provider の sandbox 方式に依存して守られないことが実例で確認された。実効的な強制手段は PJR-Y3KP で対応する。

## 7. 関連ドキュメント

- 契機となった課題: [[prj-0001:pjr-cmyx-exec-dist-parent-validations|PJR-CMYX exec 実行が古い dist ビルドを使い設定済み parent_validations が実行されない]]
- 設計意図の記載箇所: `.specdojo/exec-defaults.yaml` の `pipeline.parent_validations`
- 実装箇所: `src/exec-parent-validation.ts` の固定レジストリ、`lefthook.yml`
- 権限設定の実体: `.specdojo/claude/settings.edit.json`
