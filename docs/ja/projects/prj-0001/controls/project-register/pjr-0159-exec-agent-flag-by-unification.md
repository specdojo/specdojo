---
specdojo:
  id: prj-0001:pjr-0159-exec-agent-flag-by-unification
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: change-request
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-08-31"
  completed_at: "2026-08-07T12:00:00Z"
  conclusion: agent指定を --by 系（--by/--edit-by/--review-by）＋--auto へ統一。旧フラグは deprecated alias＋警告で維持し normalizeAgentFlags に集約。物理撤去は PJR-0162 で実施。
  register_events:
    - v: 1
      id: reg_135fc82b782f754a9f81529fe1244310
      ts: "2026-08-07T03:34:04Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "chore(register): PJR-0159 exec の agent 指定フラグ --by 系統一を起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: exec の agent 指定フラグを --by 系へ統一（--cmd/--agent-cmd 撤廃、--edit-agent/--review-agent を --edit-by/--review-by へ改名）
        - field: description
          from: ""
          to: \| 項目 \| 内容 \| \| -------- \| ------ \| \| 要求内容 \| _TODO_ \| \| 申請者 \| _TODO_ \| \| 申請日 \| _TODO_ \| \| 変更理由 \| _TODO_ \|
        - field: type
          from: ""
          to: change-request
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
      legacy_commit: c24df59859f7bd680cd6b8157e84b42b58f9bef6
    - v: 1
      id: reg_679f92b0db84a43e34d729dc75f90b32
      ts: "2026-08-07T04:02:58Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "chore(register): PJR-0159 を取り込み個票を記入"
      changes:
        - field: title
          from: ""
          to: exec の agent 指定フラグを --by 系へ統一（--cmd/--agent-cmd 撤廃、--edit-agent/--review-agent を --edit-by/--review-by へ改名）
        - field: description
          from: ""
          to: \| 項目 \| 内容 \| \| -------- \| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- \| \| 要求内容 \| `exec run` / `exec resume` / `exec worktree agent` の agent 指定フラグを roster nickname へ一本化し `--by` 系へ統一する。`--cmd` / `--agent-cmd`（生コマンド指定）を撤廃し、`--edit-agent` / `--review-agent` を `--edit-by` / `--review-by` へ改名、バッチ起動を `--auto` へ一本化する \| \| 申請者 \| _TODO_ \| \| 申請日 \| 2026-08-07 \| \| 変更理由 \| agent 指定が `--by` / `--cmd` / `--agent-cmd` / `--edit-agent` / `--review-agent` の5系統に分散し分かりにくい。`--cmd` が override とバッチ起動トリガの二重責務、`--cmd` と `--agent-cmd` の重複、値の型が nickname と生コマンドで不統一、`--by` が actor 記録と agent 解決の二重責務、`command-reference.md` に大半が未記載で優先順位も不明という問題がある。生コマンド指定は actor が `auto-agent` プレースホルダになり provider 別の失敗処理も効かず、roster を SSOT とする設計から外れるため撤廃する \|
        - field: type
          from: ""
          to: change-request
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
      legacy_commit: cd1b73858e656fb13b3f3aefc6d351770f06e220
      previous_event_id: reg_135fc82b782f754a9f81529fe1244310
    - v: 1
      id: reg_65eafe584b7b58c28200c68a4c5954e2
      ts: "2026-08-07T12:31:46Z"
      action: update
      actor: SpecDojo Test
      from_status: open
      to_status: open
      reason: "chore(register): PJR-0159 の申請者を BA に設定し個票を ready へ昇格"
      changes:
        - field: description
          from: \| 項目 \| 内容 \| \| -------- \| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- \| \| 要求内容 \| `exec run` / `exec resume` / `exec worktree agent` の agent 指定フラグを roster nickname へ一本化し `--by` 系へ統一する。`--cmd` / `--agent-cmd`（生コマンド指定）を撤廃し、`--edit-agent` / `--review-agent` を `--edit-by` / `--review-by` へ改名、バッチ起動を `--auto` へ一本化する \| \| 申請者 \| _TODO_ \| \| 申請日 \| 2026-08-07 \| \| 変更理由 \| agent 指定が `--by` / `--cmd` / `--agent-cmd` / `--edit-agent` / `--review-agent` の5系統に分散し分かりにくい。`--cmd` が override とバッチ起動トリガの二重責務、`--cmd` と `--agent-cmd` の重複、値の型が nickname と生コマンドで不統一、`--by` が actor 記録と agent 解決の二重責務、`command-reference.md` に大半が未記載で優先順位も不明という問題がある。生コマンド指定は actor が `auto-agent` プレースホルダになり provider 別の失敗処理も効かず、roster を SSOT とする設計から外れるため撤廃する \|
          to: \| 項目 \| 内容 \| \| -------- \| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- \| \| 要求内容 \| `exec run` / `exec resume` / `exec worktree agent` の agent 指定フラグを roster nickname へ一本化し `--by` 系へ統一する。`--cmd` / `--agent-cmd`（生コマンド指定）を撤廃し、`--edit-agent` / `--review-agent` を `--edit-by` / `--review-by` へ改名、バッチ起動を `--auto` へ一本化する \| \| 申請者 \| BA \| \| 申請日 \| 2026-08-07 \| \| 変更理由 \| agent 指定が `--by` / `--cmd` / `--agent-cmd` / `--edit-agent` / `--review-agent` の5系統に分散し分かりにくい。`--cmd` が override とバッチ起動トリガの二重責務、`--cmd` と `--agent-cmd` の重複、値の型が nickname と生コマンドで不統一、`--by` が actor 記録と agent 解決の二重責務、`command-reference.md` に大半が未記載で優先順位も不明という問題がある。生コマンド指定は actor が `auto-agent` プレースホルダになり provider 別の失敗処理も効かず、roster を SSOT とする設計から外れるため撤廃する \|
      legacy_commit: 59fd8e5d5cc07419d7fc0dfdc05095c2507744a5
      previous_event_id: reg_679f92b0db84a43e34d729dc75f90b32
    - v: 1
      id: reg_0098f1f41fa12dca4d49fd6a62a5f5ec
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
          from: \| 項目 \| 内容 \| \| -------- \| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- \| \| 要求内容 \| `exec run` / `exec resume` / `exec worktree agent` の agent 指定フラグを roster nickname へ一本化し `--by` 系へ統一する。`--cmd` / `--agent-cmd`（生コマンド指定）を撤廃し、`--edit-agent` / `--review-agent` を `--edit-by` / `--review-by` へ改名、バッチ起動を `--auto` へ一本化する \| \| 申請者 \| BA \| \| 申請日 \| 2026-08-07 \| \| 変更理由 \| agent 指定が `--by` / `--cmd` / `--agent-cmd` / `--edit-agent` / `--review-agent` の5系統に分散し分かりにくい。`--cmd` が override とバッチ起動トリガの二重責務、`--cmd` と `--agent-cmd` の重複、値の型が nickname と生コマンドで不統一、`--by` が actor 記録と agent 解決の二重責務、`command-reference.md` に大半が未記載で優先順位も不明という問題がある。生コマンド指定は actor が `auto-agent` プレースホルダになり provider 別の失敗処理も効かず、roster を SSOT とする設計から外れるため撤廃する \|
          to: exec run/resume/worktree の agent 指定フラグを nickname 一本化・--by 系へ統一する。--cmd/--agent-cmd（生コマンド指定）を撤廃し agent 指定は roster nickname のみ、バッチ起動は --auto に一本化、--edit-agent/--review-agent を --edit-by/--review-by へ改名。旧フラグは deprecated alias を経て撤去。
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
        - field: conclusion
          from: "-"
          to: agent指定を --by 系（--by/--edit-by/--review-by）＋--auto へ統一。旧フラグは deprecated alias＋警告で維持し normalizeAgentFlags に集約。物理撤去は PJR-0162 で実施。
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_65eafe584b7b58c28200c68a4c5954e2
    - v: 1
      id: reg_a178ca1e9a15faba57b82d9f2e03a67e
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
      previous_event_id: reg_0098f1f41fa12dca4d49fd6a62a5f5ec
---

# PJR-0159 exec の agent 指定フラグを --by 系へ統一（--cmd/--agent-cmd 撤廃、--edit-agent/--review-agent を --edit-by/--review-by へ改名）

## 1. 変更要求

exec run/resume/worktree の agent 指定フラグを nickname 一本化・--by 系へ統一する。--cmd/--agent-cmd（生コマンド指定）を撤廃し agent 指定は roster nickname のみ、バッチ起動は --auto に一本化、--edit-agent/--review-agent を --edit-by/--review-by へ改名。旧フラグは deprecated alias を経て撤去。

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 要求内容 | `exec run` / `exec resume` / `exec worktree agent` の agent 指定フラグを roster nickname へ一本化し `--by` 系へ統一する。`--cmd` / `--agent-cmd`（生コマンド指定）を撤廃し、`--edit-agent` / `--review-agent` を `--edit-by` / `--review-by` へ改名、バッチ起動を `--auto` へ一本化する                                                                                                                                                                                                                  |
| 申請者   | BA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 申請日   | 2026-08-07                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 変更理由 | agent 指定が `--by` / `--cmd` / `--agent-cmd` / `--edit-agent` / `--review-agent` の5系統に分散し分かりにくい。`--cmd` が override とバッチ起動トリガの二重責務、`--cmd` と `--agent-cmd` の重複、値の型が nickname と生コマンドで不統一、`--by` が actor 記録と agent 解決の二重責務、`command-reference.md` に大半が未記載で優先順位も不明という問題がある。生コマンド指定は actor が `auto-agent` プレースホルダになり provider 別の失敗処理も効かず、roster を SSOT とする設計から外れるため撤廃する |

## 2. 影響評価

| 観点         | 影響                                                                                                                                                                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | CLI 公開インターフェース変更。対象は `exec run` / `exec resume` / `exec worktree agent`。解決ロジックが `resolveInPlaceCommand` / `resolveRegisterCommand` / `resolveAgentOverride` / `resolveClaimingActor` の4箇所に分散しており一元化を伴う |
| スケジュール | 段階移行前提。`command-reference.md` への現状フラグ・優先順位の追記は挙動非変更で先行実施できる                                                                                                                                                |
| コスト       | 中。テストが raw `--cmd` を多用（`tests/src/exec-run-inplace.test.ts` ほか）しており roster のダミー nickname へ移行が必要。`tests/src/exec-run-resolve-command.test.ts` の生コマンド系ケースも改訂が必要                                      |
| 品質         | nickname 一本化で actor 記録・provider 別失敗処理・再現性が一貫し、値の型と責務の重複が解消する                                                                                                                                                |
| 運用         | roster 未登録 agent のアドホック実行という抜け道が消えるため、agent は `pm-members.yaml` へ登録し nickname 参照する運用へ統一する                                                                                                              |

## 3. 審査・決定

| 項目     | 内容                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------- |
| 審査結果 | 承認                                                                                                        |
| 決定者   | PO                                                                                                          |
| 決定日   | 2026-08-07                                                                                                  |
| 実施条件 | 破壊的変更のため、旧フラグは deprecated alias（新フラグへ読み替え＋警告）を1〜2リリース維持してから撤去する |

## 4. 実施追跡

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 実施担当 | ARC                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 実施期限 | 2026-08-31                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 完了条件 | `--cmd` / `--agent-cmd` を撤廃し agent 指定を nickname のみにする。`--edit-agent` / `--review-agent` を `--edit-by` / `--review-by` へ改名する。バッチ起動を `--auto` へ一本化する。解決ロジックを単一関数へ集約しユニットテストで優先順位を検証する。`command-reference.md` にフラグと優先順位を明記する。旧フラグの deprecated alias と警告を実装する。`npm run build` / `npm run lint:ts` と関連テストが通る                                                                                                                                                                                                                                        |
| 対応結果 | 段階移行フェーズを実装。新フラグ `--edit-by` / `--review-by`（`--edit-agent` / `--review-agent` の改名先）を追加、単体指定は `--by`、バッチは `--auto` へ集約。旧フラグ `--cmd` / `--agent-cmd` / `--edit-agent` / `--review-agent`（および `exec worktree agent` の `--agent-cmd`）は deprecated alias として動作維持＋stderr 警告。フラグ正規化を単一関数 `normalizeAgentFlags` に集約し優先順位・警告をユニットテスト。`command-reference` にフラグ・優先順位・非推奨移行表を追記。`build` / `lint:ts` / `lint:md` / 全 863 テスト green。旧フラグの物理撤去は `実施条件` に従い後続タスク [[prj-0001:pjr-0162-exec-agent-flag-removal]] で実施する |

## 5. 関連ドキュメント

- [[specdojo:command-reference]]: `exec run` / `exec resume` の主要オプション表。フラグと優先順位の追記対象。
- [[prj-0001:pjr-0157-cli-verb-taxonomy]]: CLI 破壊的リネームの先行事例（生成系動詞の整理）。
- `src/exec-run.ts`: 対象フラグ定義（`registerRunCommand` / `registerResumeCommand`）と解決ロジック。
- `src/exec-worktree-command.ts`: `exec worktree agent` の `--by` / `--agent-cmd`。
