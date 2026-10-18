---
specdojo:
  id: prj-0001:pjr-evax-spec-do-notation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: BA
  registered_at: "2026-10-12T07:13:04Z"
  due_on: "2026-10-31"
  block_reason: "integrate failed: project: Result Markdown notation violation before commit: docs/ja/projects/prj-0001/execution/exec/results/pjr-evax-20261018T175742Z-4289-result.md:33:54 error MD037/no-space-in-emp…"
---

# PJR-EVAX README と全体概要ガイドの冒頭を「Spec道（仕様道）の道場」に揃える

## 1. 概要

LP の Hero の小見出しを「Spec道（仕様道）の道場」とした。README・ドキュメントサイトのトップ・全体概要ガイド・遂行の技活用ガイドの「仕様道（Spec-Dō）の道場」を同じ表記に揃える

## 2. 完了条件

- 次の 4 か所の「仕様道（Spec-Dō）の道場」を「Spec道（仕様道）の道場」に改めている。
  - `README.md` の冒頭。
  - `docs/ja/index.md`（ドキュメントサイトのトップ）の冒頭。
  - [[specdojo:specdojo-overview-guide]] の `SpecDojoとは`。
  - [[specdojo:waza-guide]] の「仕様道（Spec-Dō）の道場で使う技の名前」。
- `CHANGELOG.md` の過去の記載（0.3.0 の「SpecDojo の呼び方を『仕様道（Spec-Dō）の道場』に改め」）は履歴のため書き換えない。表記を改めたことは、次に公開する版の変更点として追記する。
- `package.json` の英語の説明（`A dojo for Spec-Dō`）は英語の表記として変えない。
- `npm run lint:md` が通る。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ |
| --- | ---------------------------------------- | ---- | ---- | ---- |
| 1   | 4 か所の表記を改め、CHANGELOG に追記する | BA   | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hepk-lp-content]]: LP の Hero の小見出しを改めた項目。
- [[prj-0001:pjr-9g9y-practice-execution-terminology]]: 体系の用語と標語の決定。「仕様道」の表記は対象外だった。
