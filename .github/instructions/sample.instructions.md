---
applyTo: "docs/ja/specdojo/samples/**/*-sample.md"
---

# Sample 記述ルール

`docs/ja/specdojo/samples` 配下の `*-sample.md` を作成/更新するための作業手順です。構成・記述品質・禁止事項・共通サンプル文脈は standards を正本とし、本書は作業時の参照順序と最終チェックを定義します。

## 1. 目的と適用範囲

- 目的は、`*-sample.md` を SSOT の standards に準拠させて作成/更新すること
- 本ルールは `docs/ja/specdojo/samples/` 配下の `*-sample.md` に適用する

## 2. 入力情報

- 構成・記述ルールの正本: `docs/ja/specdojo/standards/sample-authoring-standard.md`
- Frontmatter 規約の正本: `docs/ja/specdojo/standards/document-metadata-standard.md`
- 一次根拠: `docs/ja/specdojo/rulebooks/<prefix>-rulebook.md`
- 共通の背景・目的・登場人物: `sample-authoring-standard.md` の `共通サンプル文脈`

## 3. 記述ルール

- 構成・記述ルール・禁止事項は `docs/ja/specdojo/standards/sample-authoring-standard.md` に従う。
- Frontmatter は `docs/ja/specdojo/standards/document-metadata-standard.md` に従う。
- 業務文脈は `sample-authoring-standard.md` の `共通サンプル文脈` に統一する。前提が不足する場合は同文脈で合理的に仮定する。

## 4. 最終チェック

- [ ] Frontmatter に `id` / `type` / `status` / `rulebook` が含まれている
- [ ] H1 が 1 つだけ存在する
- [ ] 章構成・必須表が rulebook の要求と整合している
- [ ] rulebook の禁止事項に抵触していない
- [ ] 業務文脈が駄菓子屋プロジェクトに統一されている
- [ ] `npm run -s lint:md` でエラーがない
- [ ] `npm run docs:build` でエラーがない
