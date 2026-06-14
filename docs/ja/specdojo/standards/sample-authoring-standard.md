---
id: sample-authoring-standard
type: standard
status: draft
---

# Sample 記述標準

Sample Authoring Standard

`docs/ja/specdojo/samples/` 配下の各 `*-sample.(md|yaml|json)` が従うべき構成・記述ルール・禁止事項・運用ルールを定義します。Frontmatter（メタ情報）の規約は [document-metadata-standard.md](document-metadata-standard.md) を正本とし、本書では扱いません。

## 1. 適用範囲

- 対象: `docs/ja/specdojo/samples/` 配下のすべての `*-sample.(md|yaml|json)`
- 目的: sample の構成・記述品質を統一し、粒度・文体・表の書き方を確認できる完成最小例を提供する
- 一次根拠: 対応する `docs/ja/specdojo/rulebooks/<prefix>-rulebook.md`
- Frontmatter 規約の正本: [document-metadata-standard.md](document-metadata-standard.md)
- 共通の業務文脈: `.github/instructions/sample.instructions.md` の `想定するプロジェクトの業務文脈`
- ファイル名・ID 規則: [docs-structure-guide.md](../guides/docs-structure-guide.md)

## 2. 出力フォーマットと命名

- ファイル名は `<prefix>-sample.md` / `<prefix>-sample.yaml` / `<prefix>-sample.json` とし、対応 rulebook の `target_format` に合わせる。
- `target_format` が未記載の場合は markdown を対象とみなす。
- Markdown の場合、H1 はファイル内で 1 つだけとし、`id` / `type` / `status` / `rulebook` を含む Frontmatter を先頭に置く。
- YAML / JSON の場合、対応 rulebook が定める先頭メタ項目・ルートキー・必須キーを満たす。

## 3. 構成の原則

- 章構成・必須表は対応 rulebook の `本文構成（標準テンプレ）` に従い、sample 独自の章立てを作らない。
- Markdown の見出しは `##` から開始し、章番号は 1 始まりの連番、末尾に `.` を付ける。
- 必須章をすべて満たしつつ、最小の記述量で完成例として成立させる。
- 任意章は、完成例として理解を助ける場合に限り含める。

## 4. 記述ガイド

- sample は対応 rulebook を一次根拠とし、必須要件を満たす最小記述例に再構成する。
- rulebook の本文を丸写しせず、完成した記述例として書き下す。
- 用語は参照元の rulebook と整合させ、命名ゆれを持ち込まない。
- 業務文脈は共通の業務文脈（駄菓子屋プロジェクト）に統一する。前提が不足する場合は同文脈で合理的に仮定する。
- 曖昧語を避け、粒度・文体・表の書き方が手本になる判定可能な記述にする。
- リンクはファイルがある場合に記載し、ない場合はバッククォートで仮置きする。

## 5. 内容充実化（薄いドキュメント防止）

- 各必須章に、対応 rulebook が要求する具体項目をすべて埋める。
- 「適切に」「十分に」などの抽象語だけで終わらせず、判断可能な記述にする。
- 表が要求される章では、カラムを埋めた実例を 1 行以上示す。
- 数値・指標を扱う章では、測定方法や判定の前提が読み取れるようにする。
- ただし、実装依存の詳細（SQL 全文、具体クラス名、詳細 API 設計）には踏み込まない。

## 6. 禁止事項

- 章番号なし見出し（例: `## 基本情報`）を使用しない（Markdown の場合）。
- 章番号末尾の `.` を省略しない。
- 共通の業務文脈以外の業種題材を混在させない。
- rulebook の本文をそのまま複製しない。
- デッドリンクを記載しない。
- sample 本文に実装詳細（SQL 全文、具体クラス名、詳細 API 設計）を書かない。
- 対応 rulebook の禁止事項に抵触する記述を含めない。

## 7. 運用ルール

- 対応 rulebook の本文構成が変わった場合は、sample の章構成と必須表を追従させる。
- 共通の業務文脈が更新された場合は、既存 sample との整合を確認する。
- 表は必要に応じて整形スクリプト（`Format Markdown Table` タスク）で揃える。
