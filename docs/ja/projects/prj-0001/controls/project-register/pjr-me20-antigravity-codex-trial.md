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

| No  | 作業                                                                                                                 | 担当 | 状態 | メモ                                         |
| --- | -------------------------------------------------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------- |
| 1   | 比較対象の plan を選ぶ。実装量が中程度で親検証が効く register todo を 1 件用意する                                   | ARC  | open | trial 用に既存の todo を使ってもよい         |
| 2   | `exec trial` で `agy-expert-executor` と `codex-expert-executor` を並走させ、親検証・review 判定・所要時間を記録する | ARC  | open | 実行枠の空いている時間帯に行う               |
| 3   | 比較結果から `agy-*` member の `priority` と `proficiency` を確定し、`pm-members.yaml` を更新する                    | ARC  | open | 自動選択の対象に加えるかもここで決める       |
| 4   | Antigravity 経由の claude / GPT が各社直の枠と別勘定かを実測し、記録する                                             | ARC  | open | 片方の枠を使い切った状態で確認すると分かる   |
| 5   | rate limit の実文言を観測し、`rate_limit_detection` へ反映する                                                       | ARC  | open | 観測できない場合はその旨を対応結果へ記録する |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-2t2s-antigravity-provider]]
- [[sysd-antigravity-agent-settings|Antigravity CLI エージェント設定]]
- [[specdojo:exec-config-guide]]
- `docs/ja/projects/prj-0001/030-project-management/pm-members.yaml`
- `.specdojo/exec-defaults.yaml`
