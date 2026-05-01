---
applyTo: 'docs/ja/specdojo/samples/**/*-sample.md'
---

# Sample 記述ルール

`docs/ja/specdojo/samples` 配下の `*-sample.md` を作成/更新するための記述ルールです。

## 1. 目的と適用範囲

- 目的は、sample の章構成と記述品質を統一し、再現可能な記述例を作成すること
- 本ルールは `docs/ja/specdojo/samples/` 配下の `*-sample.md` に適用する

## 2. 入力情報

- 一次根拠: `docs/ja/specdojo/instructions/<prefix>-instruction.md`
- 二次根拠: `docs/ja/specdojo/rulebooks/<prefix>-rulebook.md`

## 3. 出力仕様（Frontmatter と命名）

- ファイル名は `<prefix>-sample.md` とする
- ファイル先頭に YAML Frontmatter を置き、最低限 `id` / `type` / `status` / `rulebook` を含める
- `id` は英小文字・数字・ハイフンのみを使用し、一意にする
- H1 はファイル内で 1 つだけとする

```yaml
---
id: <prefix>
type: <対象文書の type>
status: draft
rulebook: <prefix>-rulebook
---
```

## 4. 記述ルール

- sample は対応 instruction の指示を一次根拠として記述する
- rulebook は整合確認のために参照し、instruction と矛盾しないようにする
- instruction / rulebook を丸写しせず、必須要件を満たす最小記述例に再構成する
- 用語は参照元と整合させ、命名ゆれを持ち込まない
- 曖昧語を避け、判定可能な記述にする
- 業務文脈は「**駄菓子屋の販売管理システムを構築するプロジェクト**」に統一する
- 必要な前提が不足している場合は、駄菓子屋文脈で合理的な内容を仮定して記述する
- 実装依存の詳細（SQL 全文、具体クラス名、詳細 API 設計）は記載しない

## 5. 禁止事項

- 駄菓子屋以外の業種題材を混在させない
- instruction / rulebook の本文をそのまま複製しない
- 禁止事項に抵触する記述を sample に含めない

## 6. 最終チェック

- [ ] Frontmatter に `id` / `type` / `status` / `rulebook` が含まれている
- [ ] H1 が 1 つだけ存在する
- [ ] 章構成・必須表が instruction の要求と整合している
- [ ] rulebook の禁止事項に抵触していない
- [ ] 業務文脈が駄菓子屋プロジェクトに統一されている
- [ ] `npm run -s lint:md` でエラーがない
