---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-usability-sample-080-20261123t143305z-1a6ec034
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-usability-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-usability-sample-080/T-KATA-WAVE-4-nfr-usability-sample-080-20261123T143305Z-1a6ec034/plan.md
  started_at: "2026-11-23T14:33:08.903Z"
  completed_at: "2026-11-23T14:43:55.693Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:nfr-usability-sample
  condense_records:
    - location: 第 2 章 適用範囲・利用者前提 の最初の導入文（「表は対象とする業務と画面、対象外とする業務を示す。」）
      category: table-prose
      action: delete
      reason: 表の見出しと内容が示す事項の再説明。前半の文（基準値が成り立つ前提）は残した。
      cause:
        type: document
    - location: 第 2 章 の利用者属性の表の導入文（「次の表は、基準を分ける利用者属性を示す。」）
      category: table-prose
      action: merge
      reason: 表の説明を削り、被験者を属性で選ぶという判断に要る一文だけにまとめた。
      cause:
        type: document
    - location: 第 4 章 測定・検証方法 の導入文（「次の表は、要件 ID ごとの測定手段と条件、判定の時期、判定者を示す。」）
      category: table-prose
      action: delete
      reason: 表の列見出しの再説明。基準値の参照先を示す文は残した。
      cause:
        type: document
    - location: 第 5 章 関連ドキュメント導線 の導入文（「次の表は、各要件の合否判定・試験・画面の正本と…示す。」）
      category: table-prose
      action: delete
      reason: 表の列見出しの再説明。変更時に見直す対象の指示は残した。
      cause:
        type: document
    - location: 第 1 章 概要（対象・目的）の第 2 段落
      category: unneeded-background
      action: retain
      reason: 基準の厳しさの根拠を示す判断に要る記述のため残した。
      cause:
        type: document
    - location: 第 3 章 操作性要件一覧 の表の直後の補足段落（`nfr-usb-002` の分子の範囲）
      category: table-prose
      action: retain
      reason: 表に書かれていない分子の除外条件と、他の要件との分担を示す例外のため残した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 表の内容をなぞる導入文 4 か所を削る・まとめる形で整理し、文書の冗長さを解消した。
- 「第 1 章 概要（対象・目的）」の第 2 段落、および「第 3 章 操作性要件一覧」の表の直後の補足段落については、判断に要る重要な背景・例外であるため、そのまま保持している。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-usability-sample.md`: 表の列見出しや内容を説明する冗長な導入文（`table-prose`）を削除または集約した。具体的には、第 2 章の導入文、利用者属性の表の説明、第 4 章の導入文、および 第 5 章の導入文を整理した。一方で、判断に要る背景や例外事項に関する記述は維持している。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `第 2 章 適用範囲・利用者前提 の最初の導入文（「表は対象とする業務と画面、対象外とする業務を示す。」）` | `table-prose` | `delete` | `表の見出しと内容が示す事項の再説明。前半の文（基準値が成り立つ前提）は残した。` | `document` |
| `第 2 章 の利用者属性の表の導入文（「次の表は、基準を分ける利用者属性を示す。」）` | `table-prose` | `merge` | `表の説明を削り、被験者を属性で選ぶという判断に要る一文だけにまとめた。` | `document` |
| `第 4 章 測定・検証方法 の導入文（「次の表は、要件 ID ごとの測定手段と条件、判定の時期、判定者を示す。」）` | `table-prose` | `delete` | `表の列見出しの再説明。基準値の参照先を示す文は残した。` | `document` |
| `第 5 章 関連ドキュメント導線 の導入文（「次の表は、各要件の合否判定・試験・画面の正本と…示す。」）` | `table-prose` | `delete` | `表の列見出しの再説明。変更時に見直す対象の指示は残した。` | `document` |
| `第 1 章 概要（対象・目的）の第 2 段落` | `unneeded-background` | `retain` | `基準の厳しさの根拠を示す判断に要る記述のため残した。` | `document` |
| ``第 3 章 操作性要件一覧 の表の直後の補足段落（`nfr-usb-002` の分子の範囲）`` | `table-prose` | `retain` | `表に書かれていない分子の除外条件と、他の要件との分担を示す例外のため残した。` | `document` |
