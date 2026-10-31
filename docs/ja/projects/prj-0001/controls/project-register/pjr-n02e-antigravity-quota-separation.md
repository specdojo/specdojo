---
specdojo:
  id: prj-0001:pjr-n02e-antigravity-quota-separation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  owner: ARC
  registered_at: "2026-10-10T21:23:46Z"
  due_on: "2026-10-31"
  completed_at: "2026-10-31T06:46:51Z"
  conclusion: Antigravity 経由の claude と GPT（gpt-oss-120b）は Google AI のプランの枠で数えられ、Anthropic 直・OpenAI 直の利用枠とは別勘定である。直の枠で止まったときの退避経路に使える
---

# PJR-N02E Antigravity 経由の claude と GPT が各社直の利用枠と別勘定かを実測する

## 1. 概要

agy CLI には利用枠を確認するコマンドがないため、Anthropic 直か OpenAI 直の枠を使い切った状態で agy-claude-* / agy-gpt-executor を起動し、実行できるかを確かめる。別勘定なら利用制限で exec が止まったときの退避経路にする。rate limit の文言を観測したら rate_limit_detection へ反映する。

## 2. 完了条件

- Antigravity 経由の claude と GPT の利用枠が、Anthropic 直・OpenAI 直の利用枠と別勘定かを、一次情報（Google の公式の文書）で確かめ、出典とあわせて本個票に記録する。
- 実際に枠を使い切った状態での実測は、一次情報で別勘定と確かめられた場合は行わない（2026-10-31 の利用者の判断）。

## 3. 作業内容

| No  | 作業                               | 担当                  | 状態 | メモ |
| --- | ---------------------------------- | --------------------- | ---- | ---- |
| 1   | 公式の文書で利用枠の勘定を確かめる | specdojo-orchestrator | done | -    |

## 4. 対応結果

別勘定である。実測は行わず、2026-10-31 に Google の公式の文書で確かめた。

- Antigravity の Claude（Sonnet・Opus）は、Google の Vertex AI Model Garden のモデルとして提供され、利用枠は Google AI のプラン（Free・Pro・Ultra など）で決まる。枠を使い切った後は、Google の AI クレジットを使うかどうかの設定（AI Credit Overages）で扱いが決まる。Anthropic 直の利用枠は使わない。
  - <https://antigravity.google/docs/models>
  - <https://antigravity.google/docs/plans>
  - <https://support.google.com/googleone/answer/14534406?hl=en>
- Antigravity の GPT は OpenAI の GPT ではなく、オープンなモデルの gpt-oss-120b を Google が提供するものであり、OpenAI 直の利用枠は使わない。
- 個票の概要には「agy CLI には利用枠を確認するコマンドがない」とあるが、現在は `/usage` で確かめられる（<https://antigravity.google/docs/cli/commands/usage/>）。
- このため、Anthropic 直や OpenAI 直の利用枠で exec が止まったときの退避経路として、agy-claude-* / agy-gpt-executor を使える。ただし Antigravity の Claude の枠は Google AI のプランに左右され、Pro では数日単位のロックアウトの報告もある（運用メモの「agy の opus は割り当てが数日単位」と一致する）。
- 残課題: rate limit の文言は今回は観測していない。agy で利用制限に当たって新しい文言を観測した場合は、`rate_limit_detection` へ反映する項目を起票する。

## 5. 関連ドキュメント

- [[prj-0001:pm-orchestrator-playbook]]
