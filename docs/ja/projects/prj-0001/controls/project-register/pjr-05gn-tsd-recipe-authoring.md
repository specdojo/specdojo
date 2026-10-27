---
specdojo:
  id: prj-0001:pjr-05gn-tsd-recipe-authoring
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-10-27T11:26:51Z"
  approach: recipe-authoring
  targets:
    - specdojo:tsd-recipe
  sources:
    - docs/ja/product/030-architecture/020-infrastructure/tsd-ollama.md
    - docs/ja/product/030-architecture/020-infrastructure/tsd-ollama-opencode.md
    - docs/ja/product/030-architecture/020-infrastructure/tsd-home-mac-dev-server-usage.md
---

# PJR-05GN tsd-recipe を作る

## 1. 概要

見直した tsd-rulebook に沿って、技術領域ごとの TSD を書く手順を recipe にする。

- tsd-index-rulebook は `recipe: not-needed` のままとする。
- template は作らない。tsd-rulebook は固定した見出しの順を求めず、見出しの順を正本とする template と合わないため（利用者と合意済み）。
- PJR-9SXH と PJR-EVAE で見直した sample を前提とするため、その後に実行する。

## 2. 完了条件

1. `docs/ja/specdojo/recipes/tsd-recipe.md` を [[specdojo:recipe-authoring-standard]] に従って作成する。frontmatter は `id: specdojo:tsd-recipe`、`type: recipe`、`rulebook: specdojo:tsd-rulebook`、`sample: specdojo:tsd-sample` とする。
2. [[specdojo:tsd-rulebook]] の本文要件を、作業の順に辿れる手順と判断にする（一冊にするか分冊にするかの判断、採用値・推奨値・未決事項の区別、動作確認の段階の組み立て、秘密情報の見分け方など）。rulebook の要件を本文へ転載しない。
3. 手本（個票の `sources` の 3 件）から手順を一般化し、手本に固有の製品名・値を必須の条件にしない。手本のファイルは変更しない。
4. [[specdojo:tsd-rulebook]] の frontmatter に `recipe: specdojo:tsd-recipe` を追加する。`tsd-index-rulebook.md` と sample は変更しない。
5. `npm run lint:md`・`npm run lint:fm` と、親の検証が通る。
6. `CHANGELOG.md` の未公開の版の節に変更を書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ |
| --- | ------------------------------------------------ | ---- | ---- | ---- |
| 1   | 手本と rulebook・sample から手順と判断を抽出する | ARC  | open | -    |
| 2   | recipe を書く                                    | ARC  | open | -    |
| 3   | rulebook の frontmatter に recipe を宣言する     | ARC  | open | -    |
| 4   | 検査を流し、対応結果を記録する                   | ARC  | open | -    |

## 4. 対応結果

[[specdojo:tsd-recipe|技術領域別 TSD 作成レシピ]] を `draft` で新規作成した。[[specdojo:recipe-authoring-standard|Recipe 記述標準]] の章構成に沿い、一冊・分冊の判断、採用値・推奨値・任意設定・未決事項の区別、段階的な動作確認、秘密情報の見分け方、継続利用と復旧を作業順に具体化した。[[specdojo:tsd-rulebook|TSD 作成ルール]] の変更は frontmatter の `recipe: specdojo:tsd-recipe` 追加だけとし、`CHANGELOG.md` の未公開の版へ変更を記載した。

手本として [[prj-0001:tsd-ollama|Ollama 技術スタック定義]]、[[prj-0001:tsd-ollama-opencode|Ollama の opencode 接続定義]]、[[prj-0001:tsd-home-mac-dev-server-usage|ホーム Mac 開発サーバの日常運用]] を読み、共通する実行場所・設定反映・確認の流れと、初期構築・接続・日常利用の差を一般化した。固有の製品、モデル、OS、ポート、容量、並列数は必須条件にしていない。

参照と手本についての申し送り:

- 手本 3 件は成果物カタログに登録済みで、`rulebook` は既に `specdojo:tsd-rulebook` を指している。recipe 参照の正本である同 rulebook の未記入フィールドを更新したため、カタログと手本の参照値は変更していない。`tsd-index-rulebook` の `recipe: not-needed`、sample、template も個票の範囲外として変更していない。
- 接続手本の設定例は `gemma4:e4b-mlx-light-8k` を登録する一方、接続確認要求では `gemma4:e4b-light-8k` を使う。どちらが対象環境で正しいかは本タスクで判断せず、手本を変更していない。recipe には登録・選択・確認要求の識別子を照合する手順を設けた。手本の保守時に対象環境の登録名を確認する。
- 基盤手本はモデル一覧 API の応答で常駐と環境変数反映まで確認できるとするが、応答だけでは個別設定の有効値を確定できない。recipe では疎通と有効値確認を分けた。手本の保守時には対象プロセスの有効値を確認する方法を見直す。

Prettier による変更 4 ファイルの整形、`node --import tsx src/specdojo.ts register build --project prj-0001`、`node --import tsx tools/catalog-validate-if-configured.mjs`、`git diff --check` は成功した。カタログ検査は既存の未作成文書について `based_on` を検証できない警告を出すが、終了コードは 0 だった。手本 3 件、sample、`tsd-index-rulebook`、result に差分がないことも確認した。`npm run lint:md`・`npm run lint:fm` などの指定された検査は親 runner が実行し、result は後続の reporter が記入する。

## 5. 関連ドキュメント

- [[specdojo:tsd-rulebook]]
- [[specdojo:tsd-sample]]
- [[specdojo:recipe-authoring-standard]]
- [[prj-0001:pjr-9sxh-tsd-index-sample-maintenance]]
- [[prj-0001:pjr-evae-tsd-sample-maintenance]]
