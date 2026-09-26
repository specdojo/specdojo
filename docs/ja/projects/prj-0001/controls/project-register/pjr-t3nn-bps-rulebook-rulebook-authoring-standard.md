---
specdojo:
  id: prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-26T02:13:22Z"
---

# PJR-T3NN bps-rulebook を rulebook-authoring-standard 準拠で作り直す

## 1. 概要

`bps-rulebook.md` は 2026-08-24 が最終更新で、現行の `rulebook-authoring-standard.md` に準拠していない。章構成、埋め込みサンプルの Frontmatter 形式、見出し番号の書式が規約と食い違う。部分修正では sample の作り直しと絡み合うため、**bootstrap 相当で作り直す**。

## 2. 事実

### 2.1. grade が既に問題を検出している

| 文書           | verdict      | score | findings         | 評価日     |
| -------------- | ------------ | ----- | ---------------- | ---------- |
| `bps-rulebook` | `needs-work` | 88    | major 1、minor 2 | 2026-09-01 |

```text
[major] サンプル内の Frontmatter で type: data となっているが、
        第 4 章の定義では domain 固定とされており矛盾している
[minor] 指定のサンプルファイルが実質的なメタ説明に留まっており、具体的な作成例が不十分である
[minor] Frontmatter の定義に、メタ情報標準や共通スキーマへの参照がなく、具体性が不足している
```

### 2.2. 章構成が standard と一致しない

| 現在の章                    | `rulebook-authoring-standard` | 差分                   |
| --------------------------- | ----------------------------- | ---------------------- |
| 5. 本文構成（標準テンプレ） | 5. 本文要件                   | 章タイトルと役割が相違 |
| 8. 階層分解ガイド           | なし                          | standard にない章      |
| 10. よくある誤りと対策      | なし                          | standard にない章      |
| 2. 用語定義                 | 2. 位置づけと用語定義         | 章タイトルが相違       |

standard の必須章は `全体方針` / `ファイル命名・ID規則` / `本文要件` / `記述ガイド` / `禁止事項` である。

### 2.3. 埋め込みサンプルの Frontmatter が旧形式

`## 11. サンプル（簡易）` のコードブロックは `specdojo:` 名前空間へ移行する前の形式である。

```yaml
id: bps-order-candidate-generation
type: data
title: 発注候補生成
status: draft
part_of: []
based_on: [bes-stock-amount-updated]
```

`type: data` は本文 `4. 推奨 Frontmatter 項目` の定義と矛盾する。これが grade の major finding に当たる。

### 2.4. 見出し番号が markdown 規約に違反する

`### 6.1 概要` から `### 6.8 メモ / 将来課題` まで、番号末尾の `.` が欠落している。`.github/instructions/markdown.instructions.md` は `n.m.` 形式を必須とする。

### 2.5. recipe と template が未決

```yaml
recipe: undecided
template: undecided
```

対応する recipe と template が存在しない。standard は `template: undecided` の系統について「本文要件に必要な章・キーと必須・任意を記載する」ことを求めるが、現在の `本文構成（標準テンプレ）` は見出しの羅列であり要件を示していない。

## 3. 完了条件

- 章構成が `rulebook-authoring-standard.md` の標準章構成に準拠し、`## 1.` からの連番で必須章が欠落していない。
- 見出し番号が `n.` / `n.m.` 形式で、末尾に `.` が付いている。
- 埋め込みサンプルの Frontmatter が `specdojo:` 名前空間形式であり、本文の Frontmatter 定義と一致している。
- `本文要件` が各章・キーの目的、必須・任意、記述規約を示している。見出しの羅列にしない。
- `recipe` と `template` が `undecided` ではなく、文書 ID または `not-needed` で宣言されている。
- 本文に sample / recipe / template へのリンク章と wikilink がない。
- BPS が扱う対象（概念データフローの 1 プロセス領域）と粒度の方針が読み取れる。カタログが「1 ファイル = 1 プロセス」で 29 件を定義している前提と整合する。
- `npm run -s lint:md` が通過している。
- grade を再実行し、`needs-work` の 3 件が解消している。

## 4. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                             |
| --- | ------------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | standard との差分を洗い出す                 | ARC  | open | 章構成、Frontmatter、記述規約    |
| 2   | `recipe` / `template` の要否を決める        | ARC  | open | 作る、または `not-needed` を宣言 |
| 3   | 章構成を standard 準拠へ作り直す            | ARC  | open | bootstrap 相当                   |
| 4   | 埋め込みサンプルを現行 Frontmatter 形式へ   | ARC  | open | `type` の矛盾を解消              |
| 5   | grade を再実行して finding の解消を確認する | QE   | open | 変更前 88 点との比較             |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-8ten-bps-sample-bps-template-bps-recipe]]
- [[prj-0001:pjr-h4h7-bps-grade-review]]
- `docs/ja/specdojo/rulebooks/bps-rulebook.md`
- `docs/ja/specdojo/standards/rulebook-authoring-standard.md`
- `.github/instructions/rulebook.instructions.md`
