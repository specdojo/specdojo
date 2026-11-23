---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opd-incident-management-sample-080-20261123t172702z-41a3e582
  type: exec-result
  task_id: T-KATA-WAVE-5-opd-incident-management-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opd-incident-management-sample-080/T-KATA-WAVE-5-opd-incident-management-sample-080-20261123T172702Z-41a3e582/plan.md
  started_at: "2026-11-23T17:27:04.837Z"
  completed_at: "2026-11-23T17:34:46.627Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:opd-incident-management-sample
  condense_records:
    - location: 2.2. 停止・切替の判断 冒頭段落
      category: canonical-restatement
      action: reference
      reason: opd-index が定める切替方針の再掲を、表が方針を具体化する旨の 1 文に置き換えた。表の列に同内容があり意味は維持される。
      cause:
        type: document
    - location: 2.4. 障害記録 冒頭段落
      category: canonical-restatement
      action: reference
      reason: opd-index の障害記録の定めの再掲を削り、本書が加える記録項目という趣旨のみ残した。記録項目は不変。
      cause:
        type: document
    - location: 2.3. 周知の対象・手段・時機 末尾の P2・P3 は来店客へ周知しない旨の文
      category: table-prose
      action: retain
      reason: 表に来店客の行がないことの理由を示す例外の判断根拠であり、残す。
      cause:
        type: document
    - location: 2.1. 優先度の判定 の箇条書き 3 件
      category: table-prose
      action: retain
      reason: 複数行該当時の扱い、回避策喪失時の引き上げ、予備機の仮定は表にない判断規則・前提であり、残す。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書である `docs/ja/specdojo/samples/opd-incident-management-sample.md` において、`opd-index` からの正本再掲箇所を、表への参照に置き換えることで冗長さを解消しました。
- 具体的には、「2.2. 停止・切替の判断」および「2.4. 障害記録」の冒頭段落において、既存の定めの再掲を削り、本書が扱う内容を示すための参照に置き換えました。
- 一方で、「2.3. 周知の対象・手段・時機」における例外的な判断根拠や、「2.1. 優先度の判定」における表に含まれない判断規則・前提事項については、意味を維持するために保持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-incident-management-sample.md`: `opd-index` の正本再掲箇所（「2.2. 停止・切替の判断」冒頭および「2.4. 障害記録」冒頭）を、表への参照に置き換えて簡略化しました。また、表に記載のない重要な判断規則や例外事項はそのまま保持しています。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

文書内の冗長な記述（正本の再掲）を、既存の規約への参照に置き換えることで整理しました。判断に不可欠な制約や前提条件は維持し、意味の変容を防いでいます。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `2.2. 停止・切替の判断 冒頭段落` | `canonical-restatement` | `reference` | `opd-index が定める切替方針の再掲を、表が方針を具体化する旨の 1 文に置き換えた。表の列に同内容があり意味は維持される。` | `document` |
| `2.4. 障害記録 冒頭段落` | `canonical-restatement` | `reference` | `opd-index の障害記録の定めの再掲を削り、本書が加える記録項目という趣旨のみ残した。記録項目は不変。` | `document` |
| `2.3. 周知の対象・手段・時機 末尾の P2・P3 は来店客へ周知しない旨の文` | `table-prose` | `retain` | `表に来店客の行がないことの理由を示す例外の判断根拠であり、残す。` | `document` |
| `2.1. 優先度の判定 の箇条書き 3 件` | `table-prose` | `retain` | `複数行該当時の扱い、回避策喪失時の引き上げ、予備機の仮定は表にない判断規則・前提であり、残す。` | `document` |
