---
specdojo:
  id: prj-0001:pjr-q3jg-grade-exclude-exec-templates
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-31T14:01:41Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-31T22:53:11Z"
  conclusion: PJR-9S41 へ統合し単独では対応しない。grade 側で本文の先頭を判定して除外する方針だったが、exec 系テンプレートを exec-templates ディレクトリへ分離すればディレクトリ単位で対象から外せる。成果物テンプレートは rulebook から宣言され実践の型の一部を成すが、exec 系を宣言する rulebook は 0 件であり、kata として評価する前提が成り立たない。分離が根本解決にあたるため除外だけを別に実装する意味がない。
---

# PJR-Q3JG exec 系テンプレートを grade の対象から除外する

## 1. 概要

`xep` / `xer` / `xrp` / `xrr` 系のテンプレート 31 件は、先頭が `_FRONTMATTER_` のプレースホルダである。生成時に実際の Frontmatter へ置換される設計であり、テンプレート自体は Frontmatter を持たない。

しかし grade は kata の template としてこれらを対象に含めるため、全件走査が `Markdown frontmatter is required` で停止する。

これらは exec の内部テンプレートであり、品質評価の対象ではない。grade 側で除外する。

## 2. 完了条件

- exec 系テンプレートが grade の対象に含まれない。
- 成果物のテンプレート（`opr-template` など）は引き続き対象となる。
- 全件走査がエラーで停止しない。
- 除外の判定方法が規範文書へ記載されている。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業           | 担当 | 状態      | メモ                                     |
| --- | -------------- | ---- | --------- | ---------------------------------------- |
| 1   | 判定方法の決定 | ARC  | done      | ディレクトリ分離により判定が不要になった |
| 2   | 実装           | ARC  | cancelled | PJR-9S41 へ統合                          |
| 3   | 規範文書の更新 | ARC  | cancelled | PJR-9S41 へ統合                          |

### 3.1. 対象となるテンプレート

| 接頭辞 | 用途          | 件数 |
| ------ | ------------- | ---- |
| `xep`  | exec plan     | 15   |
| `xer`  | exec result   | 4    |
| `xrp`  | review plan   | 10   |
| `xrr`  | review result | 2    |

いずれも本文の先頭が `_FRONTMATTER_` である。

### 3.2. Frontmatter を追記してはならない

`document-metadata-standard` は次のとおり定めている。

> Markdown 成果物テンプレートは `frontmatter_template` フィールド、exec / result テンプレートは本文先頭の `_FRONTMATTER_` を用いる

成果物のテンプレートは自身の Frontmatter に `frontmatter_template` を持ち、生成物の Frontmatter をそこへ記述する。一方 exec 系は本文先頭の置換で表現する。設計として区別されており、Frontmatter を追記すると生成物が壊れる。

### 3.3. 判定方法の候補

| 方法                         | 利点                     | 欠点                                       |
| ---------------------------- | ------------------------ | ------------------------------------------ |
| 本文の先頭が `_FRONTMATTER_` | 設計上の性質で判定できる | 将来プレースホルダの表記が変わると壊れる   |
| 接頭辞（`xep` など）で判定   | 単純                     | 命名規約に依存し、新しい接頭辞へ追随が要る |
| ディレクトリで判定           | —                        | 同じ `templates/` に両方が置かれており不可 |

本文の先頭で判定するほうが、命名ではなく実体に基づく。

### 3.4. 未決の論点

- 除外した文書を利用者へ知らせるか。黙って除外すると、評価されていないことに気づけない。
- 成果物のテンプレートは評価対象として妥当か。`frontmatter_template` を持つため Frontmatter は読めるが、本文はプレースホルダを含む。rubric の適用が適切かは別途検討が要る。

## 4. 対応結果

本項目は PJR-9S41 へ統合し、単独では対応しない。

grade 側で本文の先頭を判定して除外する方針だったが、exec 系テンプレートを `docs/ja/specdojo/exec-templates/` へ分離すれば、ディレクトリ単位で対象から外せる。判定は単純になり、除外のための特別な実装が不要になる。

分離の根拠は役割の違いである。成果物テンプレートは rulebook から `template` として宣言され実践の型の一部を成すが、exec 系を宣言する rulebook は 0 件である。exec 系は plan と result を生成する実行基盤の内部テンプレートであり、kata として評価する前提が成り立たない。

同じ問題への対処であり、分離が根本解決にあたるため、除外だけを別に実装する意味がない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-3d7q-grade-target-filter]]: grade の対象選択。除外の実装先。
- [[specdojo:document-metadata-standard]]: テンプレート自身のメタ情報と生成物 Frontmatter の分離。
