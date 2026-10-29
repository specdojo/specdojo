---
specdojo:
  id: prj-0001:pjr-3my5-draft-approach
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-10-28T22:21:43Z"
  derived_from:
    - PJR-65DS
---

# PJR-3MY5 draft approach を設け、fully-guided を磨き込み専用・宣言された参照に改める

## 1. 概要

文脈で任された範囲を調べて下書きする draft を追加し、fully-guided の plan・review 雛形を磨き込み専用にして参照範囲に based_on・入力・brief を加える

## 2. 完了条件

- approach に `draft` を追加し、`register add` / `update` の `--approach`、schedule の task、plan の生成、組み合わせの検証が `draft` を受け付ける。成果物を対象にする approach として扱い、kata 文書を対象にすると拒否する。
- plan 雛形 `xep-draft-template.md` を新設する。参照範囲は、rulebook・recipe・sample・template、`depends_on` 成果物、対象成果物の frontmatter の `based_on`、`project_context`、個票の `入力`、カタログの `brief`、成果物内の文脈、外部の情報（出典つき）とする。
- `draft` では、文脈で任された範囲に限り「根拠のない具体化の禁止」を外し、調べて値を決めてよいと plan に書く。選んだ値は成果物で「提案」と分かる形で示し、出典と選定理由を result に残すよう求める。任されていない範囲は従来どおり `_TODO_` / `_ASSUMPTION_` で残す。
- `fully-guided` の plan 雛形（`xep-fully-guided-template.md`）と review 雛形（`xrp-fully-guided-template.md`）を磨き込み専用に整理し、参照範囲を「宣言された文書だけ」に改める。今の範囲に、対象成果物の frontmatter の `based_on`、個票の `入力`、カタログの `brief` を加える。`入力` と `brief` は後続の項目で値が入るため、本項目では差し込み口を設け、値が無いときは「なし」と出す。
- ryu-guide の approach の表と図に `draft` を加え、`fully-guided` の説明を磨き込み専用の内容にそろえる。exec-operation-guide の approach の列挙にも `draft` を加える。
- 単体テストで、`draft` の plan の生成（参照範囲と具体化の許可の文言）、`fully-guided` の plan に `based_on` が載ること、`draft` と kata 文書の組み合わせの拒否を確かめる。
- `CHANGELOG.md` の `## [Unreleased]` 節（無ければ `## [0.5.0]` の上に作る）に追記する。`0.5.0` と公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と `handoff` に書く。

## 3. 作業内容

| No  | 作業                                              | 担当     | 状態 | メモ |
| --- | ------------------------------------------------- | -------- | ---- | ---- |
| 1   | approach の値と検証に `draft` を追加する          | executor | open | -    |
| 2   | `xep-draft-template.md` を新設する                | executor | open | -    |
| 3   | fully-guided の plan・review 雛形を改める         | executor | open | -    |
| 4   | ryu-guide・exec-operation-guide・テストを更新する | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
