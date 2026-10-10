---
specdojo:
  id: prj-0001:pjr-me20-antigravity-codex-trial
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-23T01:29:28Z"
  due_on: "2026-10-17"
---

# PJR-ME20 Antigravity と codex を trial で比較し agy member の priority / proficiency を確定する

## 1. 概要

PJR-2T2S で Antigravity CLI（`agy`）を provider として追加したが、`pm-members.yaml` の `agy-*` member の `priority`（3〜4）と `proficiency` は暫定値のままで、自動選択では選ばれない。同一 plan を codex と並走させて実測し、確定させる。

PJR-2T2S の作業 4 を切り出した項目である。単発の実行では PJR-YWPH（`agy-expert-executor` / `agy-reporter`）で約 10 分・親検証 3 種通過・format attempts 1 を観測しており、codex-expert と同等の水準に見える。ただし同一 plan での比較はしていない。

あわせて次の 2 点を実測する。

- Antigravity 経由の `claude-sonnet-4-6` / `claude-opus-4-6-thinking` / `gpt-oss-120b-medium` が、Anthropic 直・OpenAI 直の利用枠と別勘定か。別勘定なら、利用制限で exec が止まったときの退避経路として使える。
- rate limit の実文言。PJR-2T2S では観測できず、初期パターン（`rate limit`、`429`、`quota`、`RESOURCE_EXHAUSTED`）のままになっている。

## 2. 完了条件

- 同一 plan を `agy-expert-executor` と `codex-expert-executor` で実行し、親検証の通過可否、codex-review の判定、所要時間、reporter の format attempts を比較した結果が本個票に記録されている。
- 比較結果をもとに `pm-members.yaml` の `agy-*` member の `priority` と `proficiency` を確定し、自動選択の対象とするかを決めている。
- Antigravity 経由の claude / GPT が各社直の利用枠と別勘定かを実測し、結果を記録している。
- rate limit の実文言を観測できた場合は `exec-defaults.yaml` の `rate_limit_detection` へ反映している。観測できない場合はその旨を記録している。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                                                                 | 担当 | 状態     | メモ                                                                           |
| --- | -------------------------------------------------------------------------------------------------------------------- | ---- | -------- | ------------------------------------------------------------------------------ |
| 1   | 比較対象の plan を選ぶ。実装量が中程度で親検証が効く register todo を 1 件用意する                                   | ARC  | done     | PJR-ZGJ4 の plan を使用（新コマンド・opencode 注入・テスト・文書を含む中規模） |
| 2   | `exec trial` で `agy-expert-executor` と `codex-expert-executor` を並走させ、親検証・review 判定・所要時間を記録する | ARC  | done     | 比較 ID `me20-zgj4`（2026-10-10）                                              |
| 3   | 比較結果から `agy-*` member の `priority` と `proficiency` を確定し、`pm-members.yaml` を更新する                    | ARC  | done     | 値は据え置き、自動選択の対象に加えない                                         |
| 4   | Antigravity 経由の claude / GPT が各社直の枠と別勘定かを実測し、記録する                                             | ARC  | deferred | PJR-N02E へ切り出し                                                            |
| 5   | rate limit の実文言を観測し、`rate_limit_detection` へ反映する                                                       | ARC  | done     | 今回の実行では未観測。初期パターンのまま                                       |

## 4. 対応結果

- 2026-10-03 に grade の plan 3 件で agy と codex を含む5系統を比較した（[[prj-0001:pjr-vqb5-agent-grade-comparison]] の「agy・ornith を加えた比較（2026-10-03）」）。agy は3件とも検証を通過し、executor 平均 101 秒・reporter 15 秒で最速、major を出した唯一の agent だった。codex は sandbox の起動失敗（[[prj-0001:pjr-27z9-codex-bwrap-proc-mount]]）で判定できず、同一 plan での agy と codex の比較は未完了である。exec trial による親検証付きの比較（作業 2）は未実施。

### 4.1. exec trial による比較（2026-10-10）

PJR-ZGJ4 の plan を変更せずに使い、起点を同項目の start commit（`38a1c25d1`）として `exec trial run --agent agy-expert-executor codex-expert-executor --reporter-by gemma26-reporter --parallel 2` を実行した。記録は `docs/ja/projects/prj-0001/execution/exec/trials/me20-zgj4/` にある。

| 観点                                 | agy-expert-executor（gemini-3.1-pro-high） | codex-expert-executor |
| ------------------------------------ | ------------------------------------------ | --------------------- |
| 結果                                 | failed                                     | succeeded             |
| 所要時間（executor / 親検証 / 合計） | 563 / 232 / 838 秒                         | 466 / 154 / 690 秒    |
| 親検証（7 種）                       | 4 通過・3 失敗                             | 7 通過                |
| executor が報告した検証              | 2 件                                       | 6 件                  |
| reporter（format attempts）          | blocked（evidence_blocked、1 回）          | succeeded（1 回）     |

agy の失敗の内訳は次のとおり。

- typecheck: 自身が追加したテストの型エラー。
- test-unit: scaffold のテスト 4 件の失敗と、CLI の `unknown option`。npm script の変更にテストが追従せず、コマンド登録も壊していた。
- lint-md: result のリスト前後の空行の欠落。

あわせて、最終応答で「All test cases passed」と述べながらテストと typecheck を実行していなかった。作業の残骸（`*.orig`、`CHANGELOG.md.rej`、`commander-test.ts`）を worktree に残し、opencode は実装せず制約の文書化にとどめた。2026-10-03 の grade（文書の評価）では agy が最速だったが、実装のタスクでは速度と正確さのいずれも codex を下回った。比較は 1 回であり、根拠は限定的である。

### 4.2. 決定

- `agy-*` member の `priority`（`agy-expert-executor` は 3）と `proficiency` は据え置き、自動選択の対象に加えない。実装のタスクには使わず、文書の評価や利用制限時の退避先として nickname で明示して選ぶ場合に限る。`.specdojo/agent-members.yaml` は変更しない。
- rate limit の文言は今回の実行で観測できなかった。`rate_limit_detection` は初期パターンのままとする。
- 各社直の枠と別勘定かの実測（作業 4）は、枠を使い切った状態でしか確かめられないため PJR-N02E へ切り出した。
- 比較に使った 2 つの trial は、PJR-ZGJ4 が完了済みのため `exec trial discard` で破棄した。比較記録は残している。
- `npm run check`（2026-10-11）は 2129 件中 2 件の統合テスト（`exec-pipeline-e2e`、`exec-worktree-ops`）がタイムアウトで失敗したが、同じ 2 ファイルを単独で再実行して 65 件すべて通過した。全件実行時の負荷によるタイムアウトであり、本項目の変更（記録のみ）とは関係しない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2t2s-antigravity-provider]]
- [[sysd-antigravity-agent-settings|Antigravity CLI エージェント設定]]
- [[specdojo:exec-config-guide]]
- `docs/ja/projects/prj-0001/030-project-management/pm-members.yaml`
- `.specdojo/exec-defaults.yaml`
- `.specdojo/agent-members.yaml`
- PJR-N02E（Antigravity 経由の利用枠の実測）
