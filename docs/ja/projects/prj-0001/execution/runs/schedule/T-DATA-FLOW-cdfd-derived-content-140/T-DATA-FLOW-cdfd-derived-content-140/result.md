---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-derived-content-140
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-derived-content-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-08-13T06:43:27.713Z"
  agent: indie
  execution: human
  approach: finalize
  targets:
    - prj-0001:cdfd-derived-content
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる文書だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [x] deliverable scaffold・catalog build・register build・exec refresh・yaml-pages build・index buildと一括build/watchの役割および起動関係が表と図で確認できること（BA / vp-ba-business-value）: 3章表（P-08-01〜08）と直後の対応表、4.1〜4.3図で確認した。
- [x] 個票Frontmatterから生成する登録項目一覧・状態別・優先度別・担当者別ビューを含め、各正本と生成先の対応、直接編集してはならない派生成果物、再生成時の上書き境界が識別できること（ARC / vp-arc-technical-constraints）: 5.1〜5.3表（データストア列）、5.4「直接編集と再生成時の上書き境界」表で確認した。
- [x] 正本不足・検証失敗・部分生成失敗・生成物の陳腐化を検知した場合の停止条件と再実行経路が確認できること（QE / vp-qe-verifiability）: 6.1主要例外のE-01（正本不足）、E-03（部分生成失敗）、E-07（陳腐化）で確認した。

## 3. 確定対象

最終確認と frontmatter の `status` の `ready` への昇格が済んだ対象にチェックを付ける。

- [x] 成果物: `docs/ja/product/010-business-specs/010-data-flow/cdfd-derived-content.md`（`status: ready` に更新済み）

## 4. 確定判断

- judgement: 承認

## 5. 備考

検証は `npx prettier --check` / `npx markdownlint`（エラーなし）、`specdojo catalog validate --project prj-0001`（`dct-data-flow.yaml` は `OK`）で実施した。

確定前に、5.1「`generated/dct-<domain>.md`」「`generated/` 配下の各ビュー」、5.2「`generated/<name>.md`」「`.specdojo/doc-index.json`」の代表パスを4.1・4.2図の該当データストアノード（カタログ派生ビュー、登録簿派生ビュー、YAML表示ページ、文書索引）へ追記した。`<domain>`・`<name>` は `&lt;domain&gt;`・`&lt;name&gt;` へエスケープし、`<br>` で追加分割した。`mmdc` で実レンダリングし、実測幅（105〜175px）が折り返し上限（220px）に対して十分な余裕があることを確認した。project構成、Schedule実行event、スケジュール戦略、成果物カタログ、登録項目個票、登録簿表示設定、成果物テンプレート、成果物本体、監視対象正本は本文に代表パスの記載がないため注記していない。
