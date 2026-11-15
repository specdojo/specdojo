---
specdojo:
  id: prj-0001:xer-pjr-t123-20261115t185936z-47171e12
  type: exec-result
  task_id: PJR-T123
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-T123/pjr-t123-20261115T185936Z-47171e12/plan.md
  started_at: "2026-11-15T19:00:16.799Z"
  completed_at: "2026-11-15T19:44:08.027Z"
  agent: opus-executor
  approach: template-maintenance
  targets:
    - specdojo:cdfd-template
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- cdfd-template における概念データフローの図の枠を、`overview` や `uc` の template と同様に、`classes` 構成を用いた D2 形式に変更しました。
- 図の記述における凡例の扱いについて、Mermaid を宣言する場合、記法の選択を省略する場合、および凡例がない場合の分岐ルールをコメントとして追加しました。
- 図の直後に記述する注記の `_TODO_` について、共通凡例の有無によって書き分けられるよう、finding (`F001`, `F002`) に基づいて修正を行いました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/cdfd-template.md`: 概念データフローの図の枠を D2 に変更し、凡例に関する指示および図の直後の注記の `_TODO_` を、共通凡例の有無による条件分岐形式に更新しました。

## 3. 申し送り

- cdfd-rulebook の「プロセス領域」は各節を表だけにすると定めているが、cdfd-template の各節には主要入力・主要出力・データストアの箇条書きが残っている。本タスクの範囲外のため変更していない。別の項目で直すかどうかを判断する。
- 個票の「完了条件」は `_TODO_` のまま残っている。

## 4. 進め方と実践の型の適用

既存の `cdfd-template` を、他の D2 を用いた template と整合性を取る形でメンテナンスしました。まず、図の定義部分を D2 形式に書き換え、次に `finding` (`F001`, `F002`) で指摘された、凡例の有無に応じた記述の分岐を `_TODO_` セクションに組み込みました。
