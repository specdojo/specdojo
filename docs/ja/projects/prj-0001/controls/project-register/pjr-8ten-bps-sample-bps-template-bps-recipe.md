---
specdojo:
  id: prj-0001:pjr-8ten-bps-sample-bps-template-bps-recipe
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-26T02:13:28Z"
---

# PJR-8TEN bps-sample を実例として作り直し bps-template と bps-recipe を整備する

## 1. 概要

`bps-sample.md` は grade で `fail`（61 点、blocker 1 件）である。業務プロセスの実例ではなく「サンプルの構成を説明するメタ文書」になっており、sample として機能していない。[[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]] で rulebook を確定した後、sample を実例として作り直し、あわせて template と recipe の要否を決めて整備する。

## 2. 事実

### 2.1. grade が blocker を検出している

| 文書         | verdict  | score | findings                    | 評価日     |
| ------------ | -------- | ----- | --------------------------- | ---------- |
| `bps-sample` | **fail** | 61    | blocker 1、major 4、minor 2 | 2026-09-04 |

```text
[blocker] サンプルでありながら参照先の rulebook の記述形式（構成・項目）を
          全く遵守しておらず、サンプルとしての機能を果たしていない
[major]   rulebook で定義された本文構成（8つの必須見出し）が完全に欠落している
[major]   具体的な業務プロセスの記述例がなく、BPS の書き方を理解するための
          リファレンスとして機能していない
[major]   Frontmatter の type: project は rulebook で指定された domain と矛盾している
[major]   Frontmatter に必須項目である title が欠落している
[minor]   成果物のサンプルとしてではなく、サンプルの構成を説明するメタ文書となっている
[minor]   Frontmatter の type に project が指定されており、BPS としての用語定義に反している
```

### 2.2. H1 に Markdown リンクがある

```markdown
# [業務プロセス仕様](../rulebooks/bps-rulebook.md) サンプル
```

`rulebook-authoring-standard.md` は sample / recipe / template への本文中のリンクを禁じる。fully-guided 実行では rulebook と recipe だけが読み込まれるため、リンクは実行不能な指示になる。sample 側から rulebook へのリンクも、対応関係を Frontmatter の `rulebook` で宣言済みであり重複する。

### 2.3. 業務文脈が standard と合っていない

`sample-authoring-standard.md` は共通サンプル文脈（駄菓子屋プロジェクト）への統一を求める。現在の `bps-sample.md` は具体的な業務プロセスを持たないため、文脈そのものがない。

### 2.4. template と recipe が存在しない

`bps-rulebook.md` の Frontmatter は `recipe: undecided` / `template: undecided` である。BPS はカタログで 29 件が定義されており、**同じ構造の文書を繰り返し作る**系統に当たる。template を持つか否かで、rulebook の `本文要件` の書き方が変わる。

## 2.5. 進捗（2026-09-26）

[[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]] の実行で、**`bps-sample.md` は既に作り直された**。本項目の対象だがスコープ外の変更として行われたもので、内容は妥当なため採用する。

現在の `bps-sample.md` は駄菓子屋きぬやの「補充依頼確定」を題材とし、次を満たす。

| 項目                        | 状態                                                   |
| --------------------------- | ------------------------------------------------------ |
| `type`                      | `flow`（旧 `project` から修正）                        |
| 必須 8 章                   | 概要・トリガー・前提条件・入力・処理・出力・例外・検証 |
| H1 の Markdown リンク       | 解消                                                   |
| 共通サンプル文脈            | 駄菓子屋きぬやへ統一                                   |
| CDFD のプロセス領域との対応 | 記載あり                                               |

**本項目に残るのは template と recipe の判断である。** `bps-rulebook.md` の Frontmatter は executor が `not-needed` と宣言したが、根拠の提示がなく本項目の判断を先取りするため `undecided` へ戻した。

grade の再実行で `bps-sample` の verdict が `fail`（61 点、blocker 1 件）から改善しているかを確認する。

## 3. 完了条件

- `bps-sample.md` が具体的な業務プロセスの実例であり、rulebook が定義する本文構成をすべて満たしている。**PJR-T3NN の実行で達成済み。**
- 業務文脈が `sample-authoring-standard.md` の共通サンプル文脈に統一されている。
- Frontmatter が `id` / `type` / `status` / `rulebook` を含み、`type` が rulebook の定義と一致している。
- H1 に Markdown リンクがない。本文に rulebook / template / recipe へのリンクがない。
- `bps-template` と `bps-recipe` について、作成するか `not-needed` と宣言するかが決まり、rulebook の Frontmatter が `undecided` でなくなっている。
- 作成する場合、`template-authoring-standard.md` に準拠している。
- grade を再実行し、blocker と major が解消している。
- `npm run -s lint:md` と `npm run docs:build` が通過している。

## 4. 判断が必要な点

### 4.1. template を作るか

| 案  | 内容                     | 利点                                        | 懸念                                |
| --- | ------------------------ | ------------------------------------------- | ----------------------------------- |
| A   | `bps-template.md` を作る | 29 件を同じ骨組みで作れる。生成の起点になる | rulebook の本文要件と二重管理の恐れ |
| B   | `not-needed` と宣言する  | 管理対象が増えない                          | 29 件を毎回 rulebook から起こす     |

カタログが 29 件を定義しており繰り返しが多いため、**A が妥当と考える**。standard は「template を宣言する系統では、見出し順・表・記入欄の骨組みを template の正本とし、rulebook の本文要件には目的と必須・任意を残す」と定めるため、二重管理は避けられる。

### 4.2. recipe を作るか

recipe は fully-guided 実行で rulebook と共に読み込まれる。29 件を agent が作成する運用であれば必要になる。[[prj-0001:pjr-h4h7-bps-grade-review]] の作成方法（人が書くか agent が書くか）と合わせて決める。

## 5. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                         |
| --- | ------------------------------------------- | ---- | ---- | ---------------------------- |
| 1   | rulebook の確定を待つ                       | ARC  | open | PJR-T3NN の完了が前提        |
| 2   | template の要否を決める                     | ARC  | open | 案 A を起点に検討            |
| 3   | recipe の要否を決める                       | ARC  | open | 作成の実行主体と合わせて判断 |
| 4   | `bps-sample.md` を実例として作り直す        | ARC  | open | 共通サンプル文脈へ統一       |
| 5   | template / recipe を作成する                | ARC  | open | 2 と 3 の決定に従う          |
| 6   | grade を再実行して blocker の解消を確認する | QE   | open | 変更前 61 点との比較         |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-t3nn-bps-rulebook-rulebook-authoring-standard]]
- [[prj-0001:pjr-h4h7-bps-grade-review]]
- `docs/ja/specdojo/samples/bps-sample.md`
- `docs/ja/specdojo/standards/sample-authoring-standard.md`
- `docs/ja/specdojo/standards/template-authoring-standard.md`
- `.github/instructions/sample.instructions.md`
