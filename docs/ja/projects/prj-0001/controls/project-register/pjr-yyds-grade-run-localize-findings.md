---
specdojo:
  id: prj-0001:pjr-yyds-grade-run-localize-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T22:56:47Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: grade
---

# PJR-YYDS grade run でも finding の日本語の表示用の文を作る

## 1. 概要

TypeScript 版の grade run は翻訳の段を持たず、表示用の message_ja が英語のまま入る

## 2. 入力

- 2026-11-16、orchestrator が grade run --target deliverable / kata で再 grade した 20 件ほどの結果で、findings の `message_ja` が英語の正本のままだった。翻訳（grade translation-plan → agent run --by gemma26-translator → grade localize）は tools/grade/run-per-document.sh にだけ組み込まれており、grade run は行わない。個票に英語の指摘がそのまま書かれ、利用者から日本語にしてほしいと依頼があった
- 作業: grade run が正本の結果を保存した後、run-per-document.sh と同じ翻訳の段（不合格の項目の 1 回の再試行と、失敗時に英語を表示用に残す扱いを含む）を流す。翻訳の agent は --translation-by で変えられるようにし、既定は gemma26-translator とする。翻訳が失敗しても grade そのものは失敗にしない
- 完了条件: grade run の後の結果で、英語の finding に日本語の `message_ja` が付く。翻訳の agent が使えないときも grade の結果は保存され、警告が出る。command-reference の grade run の説明に翻訳の段が書かれている

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
