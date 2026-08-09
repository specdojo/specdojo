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
  completed_on: "2026-08-07"
  conclusion: agent指定を --by 系（--by/--edit-by/--review-by）＋--auto へ統一。旧フラグは deprecated alias＋警告で維持し normalizeAgentFlags に集約。物理撤去は PJR-0162 で実施。
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
