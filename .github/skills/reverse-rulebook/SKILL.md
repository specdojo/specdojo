---
name: reverse-rulebook
description: '成果物ファイルを分析し、対応する `docs/ja/handbook/rulebooks/*-rulebook.md` を逆生成（新規作成または差分更新）する Skill です。'
---

# SKILL: reverse-rulebook

開いている成果物ファイル（`sample-gcs-product/` 配下やプロジェクト固有成果物）を分析し、
対応する `docs/ja/handbook/rulebooks/*-rulebook.md` を逆生成する Skill です。

## 使いどころ

- 開いているファイルが成果物で、対応する `*-rulebook.md` を新規作成したいとき
- 既存 `*-rulebook.md` と成果物の実態に乖離があり、差分アップサートしたいとき
- 汎用名ファイル（`サンプル.md`、`README.md` など）から規則を逆引きしたいとき

## 前提

- 共通運用ルール: `@file:.github/instructions/rulebook.instructions.md`
- 章構成基準: `docs/ja/handbook/rulebooks/meta-rulebook-structure-rulebook.md`
- 命名ルール: `docs/ja/handbook/rulebooks/meta-id-and-file-naming-rulebook.md`
- ドキュメント内容ガイド: `docs/ja/handbook/guidelines/docs-contents-guide.md`
- 通常の rulebook 作成フロー: `@file:.github/skills/upsert-rulebook/SKILL.md`
- 対象除外: `meta-*-rulebook.md` は対象外

## 対象ファイルから rulebook を特定する方法

以下のシグナルを優先順に使い、対応するプレフィックスと rulebook ファイルを特定する。

1. Frontmatter の `rulebook` フィールド（最優先）
   - `rulebook: bes-rulebook` なら `bes-rulebook.md` を優先採用する
   - `rulebook` が未記載、または `none` の場合は次の手段へ進む
2. Frontmatter の `id` フィールド
   - `id: bes-order-flow` → プレフィックス `bes-` → `bes-rulebook.md`
   - `sample-gcs-product/` のファイルは Frontmatter を持たない場合があるため、次の手段へ進む

## 逆生成の実行フロー

1. 対象特定: 上記シグナルで `<prefix>-rulebook.md` を特定する
2. 既存確認: `docs/ja/handbook/rulebooks/<prefix>-rulebook.md` の存在を確認する
   - 存在する場合: 成果物との乖離を分析し、差分アップサートする
   - 存在しない場合: 新規作成する
3. 成果物構造の抽出: 開いているファイルから次を抽出する
   - 見出し構造（H1/H2/H3 パターン）
   - 表カラム構成
   - Mermaid ブロック有無と種類
   - Frontmatter 項目または先頭メタ項目
4. 同カテゴリ確認: 同ディレクトリの他ファイルを 2〜3 件確認し、共通パターンを把握する
5. docs-contents-guide 照合: 抽出結果と目的・内容定義の整合を確認する
6. 妥当性評価と汎用化: 成果物の記述を評価し、rulebook に反映する内容を汎用ルールへ正規化する
   - 採用する: 再利用可能な構造、責務境界、判定可能な記述ルール、表カラム定義
   - 汎用化して採用する: 組織名、商品名、担当者名、日付、環境名などの固有値を抽象化した規則
   - 採用しない: 一時的運用、個別案件限定の事情、実装依存の詳細
   - 判断が割れる場合は `docs-contents-guide` と類似 rulebook を優先し、単一成果物の記述は参考情報として扱う
7. 生成/更新: `upsert-rulebook` の通常フロー（既存差分確認、新規構成決定、標準章構成適用）に合流して反映する
8. リンク更新: `サンプル` と `生成 AI への指示テンプレート` のリンクを確認・更新する
9. 結果集約: 対象ごとの結果（更新 / 新規 / スキップ / 失敗）を出力する
10. 検証: `npm run -s lint:md` を実行する

## 実行ルール

- 開いているファイルが `*-rulebook.md` / `*-instruction.md` / `*-sample.*` の場合は対象外として中止し、対応プロンプトへ誘導する
- `meta-*-rulebook.md` は常にスキップする
- 特定できない場合のみユーザー確認を行う
- ある対象で失敗しても、複数対象時は他対象の処理を継続する

## 出力

- 対象ごとの結果（更新 / 新規 / スキップ / 失敗）
- 変更ファイル一覧
- 根拠に使った情報（プレフィックス照合、docs-contents-guide、類似 rulebook）
- 妥当性評価と汎用化の要約（採用した規則 / 汎用化した規則 / 非採用項目）
- `npm run -s lint:md` の結果
