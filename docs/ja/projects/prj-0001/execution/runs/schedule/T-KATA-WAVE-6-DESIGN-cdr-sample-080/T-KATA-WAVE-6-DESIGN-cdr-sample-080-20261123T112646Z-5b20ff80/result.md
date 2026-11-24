---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-cdr-sample-080-20261123t112646z-5b20ff80
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-cdr-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-cdr-sample-080/T-KATA-WAVE-6-DESIGN-cdr-sample-080-20261123T112646Z-5b20ff80/plan.md
  started_at: "2026-11-23T11:26:49.454Z"
  completed_at: "2026-11-23T16:14:46.817Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:cdr-sample
  condense_records:
    - location: '## 2. モジュールと import の最終箇条書き（型の import は consistent-type-imports に従う）'
      category: repetition
      action: delete
      reason: 「1. 基本方針」の『import の規則は ESLint の設定を正とする』と「6. テストと検証」の lint 行で既に示されており、同じ主張の繰り返しのため。規則の意味は失われない。
      cause:
        type: document
    - location: '## 6. テストと検証 の表と、続く箇条書き'
      category: table-prose
      action: retain
      reason: 表はコマンドと実行条件、箇条書きは境界テストと未決事項で、役割が異なり二重の説明ではない。
      cause:
        type: document
    - location: '## 7. 禁止事項 の表'
      category: canonical-restatement
      action: retain
      reason: 各行は理由付きの禁止事項で、本文の規則と同じ文ではない。rulebook が必須とする表のため残す。
      cause:
        type: document
    - location: 冒頭の _ASSUMPTION_ 段落
      category: unneeded-background
      action: retain
      reason: 参照先が架空の文書で、CLI 版の設計を根拠にしない旨は、判断に要る前提として必要。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- `cdr-sample.md` の冗長さを整理した。「2. モジュールと import」末尾の箇条書き 1 行（型の import は `consistent-type-imports` に従う）を、「1. 基本方針」と「6. テストと検証」の lint 行で既に示されている繰り返しとして削除した。
- 他の 3 候補（「6. テストと検証」の表と箇条書き、「7. 禁止事項」の表、冒頭の `_ASSUMPTION_` 段落）は、判断に要る情報を含むため保持した。
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。他は変更種別により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdr-sample.md`: 重複する箇条書き 1 行を削除した（差分は 7 行追加・9 行削除）。削除した行は、import の規則を ESLint 設定に委ねる既存の記述の繰り返しだった。規則の意味と必須の表は変えていない。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

condense。冗長さの 5 観点（`repetition`、`table-prose`、`figure-prose`、`unneeded-background`、`canonical-restatement`）で候補を洗い出した。`repetition` の 1 件は削除（原因は `document`）。残りの 3 件は役割が異なる、または前提として必要なため `retain` とした。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `## 2. モジュールと import の最終箇条書き（型の import は consistent-type-imports に従う）` | `repetition` | `delete` | `「1. 基本方針」の『import の規則は ESLint の設定を正とする』と「6. テストと検証」の lint 行で既に示されており、同じ主張の繰り返しのため。規則の意味は失われない。` | `document` |
| `## 6. テストと検証 の表と、続く箇条書き` | `table-prose` | `retain` | `表はコマンドと実行条件、箇条書きは境界テストと未決事項で、役割が異なり二重の説明ではない。` | `document` |
| `## 7. 禁止事項 の表` | `canonical-restatement` | `retain` | `各行は理由付きの禁止事項で、本文の規則と同じ文ではない。rulebook が必須とする表のため残す。` | `document` |
| `冒頭の _ASSUMPTION_ 段落` | `unneeded-background` | `retain` | `参照先が架空の文書で、CLI 版の設計を根拠にしない旨は、判断に要る前提として必要。` | `document` |
