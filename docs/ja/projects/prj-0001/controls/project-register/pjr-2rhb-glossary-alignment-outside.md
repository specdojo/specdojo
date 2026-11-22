---
specdojo:
  id: prj-0001:pjr-2rhb-glossary-alignment-outside
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-12T23:14:58Z"
  completed_at: "2026-11-22T14:06:42Z"
  conclusion: 用語集の外の「Job Run」を「job run」に統一した（225 箇所・56 ファイル）。gl-rulebook に英語の用語を小文字で書く決まりと notes に書く内容の決まりを足した。履歴と用語集そのものは変えていない
  derived_from:
    - PJR-6XQ4
  commit_type: docs
  commit_scope: glossary
---

# PJR-2RHB 用語集の確定に合わせて、用語集の外の文書と型の表記をそろえる

## 1. 概要

用語集の確定のレビューで決めた表記（job run など）と気づいた点を、用語集の外の文書・型・コードのメッセージへまとめて反映する

## 2. 入力

- 用語集の確定のレビュー（2026-11-13）で、用語集の外にも直す点が出てきた。用語集の外の直しは、まとめて 1 回で行う（indie の依頼）。項目は indie が後から追記する
- 「Job Run」を「job run」に統一する。用語集の見出しは直した。設計書（sysd-job-execution など）・状態定義（stsd-job-run）・ガイド・コードのメッセージなど、用語集の外でおよそ 29 ファイルが「Job Run」を使っている。文書の題名（「Job実行設計」など）の扱いも含めて決める
- 英語名と英語の用語は小文字で書き、SpecDojo の概念の名前として大文字で定着しているもの（Kata など）と固有名詞（SpecDojo など）だけを例外にする、という決まりを用語集の型（gl-rulebook）に足す。gl を PJR-960C に足すときに、rulebook の見直しの段で入れてもよい
- 用語集の型（gl-rulebook）に、`notes` には読み手向けの補足（前提・例外・使う文脈）だけを書き、`category` や `relatedTerms` の指定のしかたなど YAML の書き方のメモを書かない、という決まりを足す。用語集の確定のレビュー（2026-11-13）で、「構成要素の `category` に本用語を指定する」のような注記が読み手に分からないと indie が指摘した

## 3. 完了条件

- 今の入力にある項目だけを直す。後から足す項目は次の回の実行で扱う（利用者の決定、2026-11-22、indie）。
- 用語集の外の文書・型・コードのメッセージで「Job Run」と書いている箇所を「job run」に統一する。文書の題名（「Job実行設計」など）の扱いは executor が決め、理由を個票の対応結果に書く。直した前後の件数を書く。
- `gl-rulebook` に、英語名と英語の用語は小文字で書き、SpecDojo の概念の名前として大文字で定着しているもの（Kata など）と固有名詞（SpecDojo など）だけを例外にする、という決まりを足す。
- `gl-rulebook` に、`notes` には読み手向けの補足（前提・例外・使う文脈）だけを書き、`category` や `relatedTerms` の指定のしかたなど YAML の書き方のメモを書かない、という決まりを足す。
- 結論や意味は変えない。表記だけを直す。コードのメッセージを直したら、そのメッセージを確かめているテストも直す。
- 過去の履歴（plan・result・個票の対応結果・CHANGELOG の公開済みの版の節）は直さない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                                        | 担当         | 状態 | メモ                 |
| --- | ------------------------------------------------------------------------------------------- | ------------ | ---- | -------------------- |
| 1   | 「Job Run」を「job run」へ統一（コード・テスト・fixture・設計書・ガイド・schema・カタログ） | sol-executor | done | 56 ファイル 225 箇所 |
| 2   | `gl-rulebook` に英語表記の小文字の決まりと `notes` の書き方の決まりを追加                   | sol-executor | done | 6.4・6.5 の節        |
| 3   | 検証（typecheck・lint:ts・test:unit・lint:md・lint:fm）                                     | sol-executor | done | 全件通過             |

## 5. 対応結果

### 5.1. 実施内容

- 「Job Run」を「job run」へ統一した。直す前は対象範囲に 225 箇所（56 ファイル）、直した後は 0 箇所。対象は `src`・`tools`・`tests`（メッセージを確かめるテストと表示ページの snapshot を含む）・`docs/specdojo`（schema）・`docs/ja/product`・`docs/ja/specdojo`・成果物カタログ（`dct-*.yaml` と生成ページ）・`rtn-grade-recheck.yaml`。
- 文書の題名は「Job実行設計」など「Job Run」を含まないため変えていない。「ステータス定義（Job Run）」は「ステータス定義（job run）」へ直した。
- `gl-rulebook` に、英語名と英語の用語は小文字で書き、概念名として大文字で定着したもの（Kata など）と固有名詞（SpecDojo など）だけを例外とする決まりを足した（6.4 の節）。`notes` に読み手向けの補足だけを書き、YAML の書き方のメモを書かない決まりも足した（6.5 の節）。
- 直さなかったもの: 履歴（`execution/runs/`・個票・`events/`・grade の結果と条件）、`archive/`、`CHANGELOG.md`、用語集（`gl-execution.yaml` と生成ページ。PJR-960C の範囲）。保護された設定は変えていない。

### 5.2. 判断と理由

- 題名は変えない。「Job実行設計」は日本語の題名で、決まりの対象は英語の用語だけのため。
- 用語集の `source` にある wikilink の表示名「ステータス定義（Job Run）」は、用語集の範囲のため直していない。表示名だけの食い違いで、リンク先は解決する。

### 5.3. CHANGELOG に書く事項

- 区分: Changed
- 文案: CLI の出力・エラーメッセージの「Job Run」を「job run」へ表記統一した（文言のみで挙動は変わらない）。

### 5.4. 検証

- `npm run typecheck`・`npm run lint:ts`（エラー 0、既存の警告のみ）・`npm run test:unit`（4208 件）・`npm run lint:md`・`npm run lint:fm` が通った。

## 6. 関連ドキュメント

- `gl-rulebook`（`docs/ja/specdojo/rulebooks/gl-rulebook.md`）
- [[prj-0001:pjr-index]]
