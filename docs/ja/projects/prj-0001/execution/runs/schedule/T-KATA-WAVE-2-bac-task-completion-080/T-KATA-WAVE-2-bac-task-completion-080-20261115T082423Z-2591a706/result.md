---
specdojo:
  id: prj-0001:xer-t-kata-wave-2-bac-task-completion-080-20261115t082423z-2591a706
  type: exec-result
  task_id: T-KATA-WAVE-2-bac-task-completion-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-2-bac-task-completion-080/T-KATA-WAVE-2-bac-task-completion-080-20261115T082423Z-2591a706/plan.md
  started_at: "2026-11-15T08:24:24.670Z"
  completed_at: "2026-11-15T09:59:50.038Z"
  agent: qwen-executor
  execution: agent
  approach: condense
  targets:
    - bac-task-completion
  condense_records:
    - location: 受入条件 冒頭の共通前提段落「各例外では、これと異なる前提を明記する。」
      category: canonical-restatement
      action: delete
      reason: bac-rulebook の記述ルール（共通前提は冒頭に一度だけ置き、例外では異なる前提を明示する）を本文で繰り返していた。各例外シナリオの前提はすでに「共通前提と異なり」と明記しているため、削除しても判断情報は失われない
      cause:
        type: document
    - location: メモ / 将来課題 末尾の段落「grade・finding に疑義がある場合は、review が品質判定を置き換えず成果物評価へ評価要求を戻す。」
      category: repetition
      action: merge
      reason: 2.5.3 の「review は品質を再評価せず、確定済みの grade・finding を事実として利用する」と同じ原則が離れた場所に分かれていた。疑義がある場合に評価要求を戻すという例外は 2.5.3 の同じ項目に移して保持した
      cause:
        type: document
    - location: 2.7.3 期待結果 表の下の項目「いずれも review 自身は再評価せず…完了判断を再開する。」
      category: repetition
      action: retain
      reason: 再評価禁止の部分は 2.5.3 と重なるが、判断を止めた後の再開条件（独立した runner による最新の grade・finding の確定と、鮮度確認を起点にした再開）はここにしか書かれておらず、判断に必要なため
      cause:
        type: document
    - location: 2.5.3 C-04 行「finding を消去・再評価せず」
      category: table-prose
      action: retain
      reason: finding が残っているのに完了とするケースに固有の制約で、表の下の共通の項目だけでは finding を消去しないという条件を判定できないため
      cause:
        type: document
    - location: 概要の「根拠」項目
      category: canonical-restatement
      action: retain
      reason: AC-01・AC-02・AC-04 との対応と、プロジェクト全体の受入とは扱わないという範囲の限定を含み、based_on を並べ直しただけではないため
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- `docs/ja/product/050-business-acceptance-criteria/bac-task-completion.md` の冗長さを整理し、記述の簡潔化を行いました。
- 具体的には、`bac-rulebook` の記述ルールを繰り返していた箇所の削除、および `review` の再評価禁止に関する重複記述を 2.5.3 節に統合しました。
- 判断に必要な情報を含む箇所（再開条件や特定の制約など）については、意味を保持するため `retain` とし、修正を避けました。

## 2. 変更ファイル

- `docs/ja/product/050-business-acceptance-criteria/bac-task-completion.md`: 共通前提の重複記述の削除、および `review` の再評価禁止に関する重複箇所の統合（2.5.3 節への集約）を行い、冗長さを整理しました。

## 3. 申し送り

- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/projects/ 配下に届いておらず、成果物の変更が docs/ja/product/ の中だけのため）
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票を変更しておらず、変更は bac-task-completion.md だけのため）

## 4. 進め方と実践の型の適用

対象文書を読み、繰り返し（`repetition`）、正本の再掲（`canonical-restatement`）などの候補を洗い出し、判断に要る背景・制約・完了条件の意味を維持したまま、削除（`delete`）または統合（`merge`）することで簡潔化を図りました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `受入条件 冒頭の共通前提段落「各例外では、これと異なる前提を明記する。」` | `canonical-restatement` | `delete` | `bac-rulebook の記述ルール（共通前提は冒頭に一度だけ置き、例外では異なる前提を明示する）を本文で繰り返していた。各例外シナリオの前提はすでに「共通前提と異なり」と明記しているため、削除しても判断情報は失われない` | `document` |
| `メモ / 将来課題 末尾の段落「grade・finding に疑義がある場合は、review が品質判定を置き換えず成果物評価へ評価要求を戻す。」` | `repetition` | `merge` | `2.5.3 の「review は品質を再評価せず、確定済みの grade・finding を事実として利用する」と同じ原則が離れた場所に分かれていた。疑義がある場合に評価要求を戻すという例外は 2.5.3 の同じ項目に移して保持した` | `document` |
| `2.7.3 期待結果 表の下の項目「いずれも review 自身は再評価せず…完了判断を再開する。」` | `repetition` | `retain` | `再評価禁止の部分は 2.5.3 と重なるが、判断を止めた後の再開条件（独立した runner による最新の grade・finding の確定と、鮮度確認を起点にした再開）はここにしか書かれておらず、判断に必要なため` | `document` |
| `2.5.3 C-04 行「finding を消去・再評価せず」` | `table-prose` | `retain` | `finding が残っているのに完了とするケースに固有の制約で、表の下の共通の項目だけでは finding を消去しないという条件を判定できないため` | `document` |
| `概要の「根拠」項目` | `canonical-restatement` | `retain` | `AC-01・AC-02・AC-04 との対応と、プロジェクト全体の受入とは扱わないという範囲の限定を含み、based_on を並べ直しただけではないため` | `document` |
