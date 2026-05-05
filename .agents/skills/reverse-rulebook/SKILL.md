---
name: reverse-rulebook
description: '成果物ファイルを分析し、対応する `docs/ja/specdojo/rulebooks/*-rulebook.md` を逆生成（新規作成または差分更新）する Skill です。'
---

# SKILL: reverse-rulebook

成果物ファイルを分析し、対応する `docs/ja/specdojo/rulebooks/*-rulebook.md` を新規作成または差分更新する Skill です。

## 使いどころ

- 開いているファイルが成果物で、対応する `*-rulebook.md` を新規作成したいとき
- 既存 `*-rulebook.md` と成果物の実態に乖離があり、差分アップサートしたいとき
- 汎用名ファイル（`サンプル.md`、`README.md` など）から規則を逆引きしたいとき

## 前提

- 共通運用ルール: `.github/instructions/rulebook.instructions.md`
- ドキュメント内容ガイド: `docs/ja/specdojo/guidelines/docs-contents-guide.md`

## 対象ファイルから rulebook を特定する方法

以下のシグナルを優先順に使い、対応する `<prefix>-rulebook.md` を特定する。

1. Frontmatter の `rulebook` フィールド（最優先）
   - `rulebook: <prefix>-rulebook` なら `<prefix>-rulebook.md` を優先採用する
   - `rulebook` が未記載、または `none` の場合は次の手段へ進む
2. Frontmatter の `id` フィールド
   - `id: <prefix>-order-flow` → プレフィックス `<prefix>-` → `<prefix>-rulebook.md`

## 逆生成の実行フロー

1. 対象特定: 上記シグナルで `<prefix>-rulebook.md` を特定する
2. 既存確認: `docs/ja/specdojo/rulebooks/<prefix>-rulebook.md` の存在を確認する
   - 存在する場合: 成果物との乖離を分析し、差分アップサートする
   - 存在しない場合: 新規作成する
3. 構造抽出: 見出し、表カラム、Mermaid、Frontmatter または先頭メタ項目を確認する
4. 類似確認: 同カテゴリまたは同ディレクトリの 2〜3 件を見て共通パターンを把握する
5. 内容照合: docs-contents-guide と照合し、目的・内容定義との整合を確認する
6. 汎用化: 再利用可能な構造、責務境界、判定可能な記述ルール、表カラム定義を rulebook 向けに正規化する
7. 生成/更新: `upsert-rulebook` の通常フローに合流し、リンクと最終チェックを含めて反映する

## 実行ルール

- 開いているファイルが `*-rulebook.md` / `*-instruction.md` / `*-sample.*` の場合は対象外として中止し、対応プロンプトへ誘導する
- 特定できない場合のみユーザー確認を行う
- ある対象で失敗しても、複数対象時は他対象の処理を継続する
- 判断が割れる場合は docs-contents-guide と類似 rulebook を優先し、単一成果物の記述は参考情報として扱う
- 一時的運用、個別案件限定の事情、実装依存の詳細は採用しない

## 出力

- 対象ごとの結果（更新 / 新規 / スキップ / 失敗）
- 変更ファイル一覧
- 根拠に使った情報（プレフィックス照合、docs-contents-guide、類似 rulebook）
- 汎用化の要約（採用した規則 / 汎用化した規則 / 非採用項目）
- `npm run -s lint:md` の結果
