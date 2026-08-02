---
specdojo:
  id: prj-0001:pjr-0146-forbid-links-in-history-files
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0146 履歴蓄積ファイル（plan/result/pjr-NNNN-<topic>等）はリンクを禁止しリポジトリルート相対パス記述に統一するルール化

## 1. 概要

plan/result/pjr-NNNN-`<topic>` 等、履歴として蓄積される成果物には、リンク先ファイル名変更のたびに追従修正が発生するリンク（wikilink・Markdownリンク）を含めず、リポジトリルートからの相対パス表記のみで参照先を記述するルールを定める。加えて、ルール違反を自動検知できるよう validation / スキーマチェックの仕組みを整備する。

## 2. 完了条件

- 対象となる成果物種別（plan/result/pjr-NNNN-`<topic>`等の履歴ファイル）が明文化されている。
- リンクを使わずパス表記のみで参照する記述ルールが、該当する `.github/instructions/` 配下のルール文書へ反映されている。
- 既存の履歴ファイル内リンクの扱い（移行要否）について方針が決まっている。
- 対象ファイル種別に対して、リンク記法（wikilink・Markdownリンク）の使用を検知する validation / lint チェックが導入されている。
- 上記チェックが CI もしくは `npm run lint:md` 等の既存検証コマンドに組み込まれている。

## 3. 作業内容

| No  | 作業                                                                          | 担当 | 状態 | メモ |
| --- | ----------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 対象ファイル種別の洗い出し                                                    | ARC  | open | -    |
| 2   | ルール文書への追記                                                            | ARC  | open | -    |
| 3   | 既存ファイルへの遡及要否の判断                                                | ARC  | open | -    |
| 4   | 対象ファイル種別に対するリンク使用検知の validation / lint チェック設計・実装 | ARC  | open | -    |
| 5   | 検証コマンド（CI / npm scripts）への組み込み                                  | ARC  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- .github/instructions/markdown.instructions.md
- .github/instructions/specdojo-exec-workflow.instructions.md
