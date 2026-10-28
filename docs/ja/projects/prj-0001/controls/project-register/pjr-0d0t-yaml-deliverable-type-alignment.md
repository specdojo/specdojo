---
specdojo:
  id: prj-0001:pjr-0d0t-yaml-deliverable-type-alignment
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-27T12:32:57Z"
  block_reason: "parent validation failed: lint-fm, test-unit"
  derived_from:
    - PJR-XSM8
  depends_on:
    - PJR-484B
---

# PJR-0D0T YAML の成果物の type を原則に沿った値にそろえる

## 1. 概要

bdd の domain を data、ifx-cmd・ifx-msg の command・message を api にするなど、YAML の type を成果物の type の値にそろえ、schema・rulebook・テンプレート・sample を直す。古い値はエラーにし、置き換え先を示す。YAML の表示用ページは YAML の type を引き継ぐ

- PJR-RYK8 の決定と PJR-484B の宣言・照合に合わせて、YAML の成果物の type をそろえる。

## 2. 完了条件

- bdd の `domain` を `data`、ifx-cmd・ifx-msg の `command`・`message` を `api` にし、gl に `glossary` を書く。YAML の schema・rulebook・テンプレート・sample を rulebook の宣言に合わせて直す。ifx-cmd のテンプレートの `template` は残す。
- `domain`・`command`・`message` は検証でエラーにし、文面で置き換え先を示す。
- `bdd-rulebook` の「`type: data` の成果物に適用する」と「`type` は `domain` 固定」の矛盾を、宣言に合わせて解消する。
- PJR-484B の照合を、YAML の成果物と sample にも広げる。
- `src/docs/yaml-pages.ts` が YAML の type をそのまま引き継ぎ、配置パスで決める処理と非推奨の `sample` を出す処理をなくす。YAML の sample 11 件すべての生成結果をテストで確かめる。
- CHANGELOG の `## [Unreleased]` に移行の手順を書く。公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                                  | 担当     | 状態 | メモ |
| --- | ----------------------------------------------------- | -------- | ---- | ---- |
| 1   | YAML の schema・rulebook・テンプレート・sample を直す | executor | open | -    |
| 2   | 古い値のエラーと照合の拡張を実装する                  | executor | open | -    |
| 3   | yaml-pages が YAML の type を引き継ぐようにする       | executor | open | -    |
| 4   | CHANGELOG を更新し、テストを足す                      | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:document-metadata-standard]]
- [[specdojo:bdd-rulebook]]
- [[specdojo:gl-rulebook]]
