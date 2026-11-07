---
specdojo:
  id: prj-0001:xep-pjr-05gn-20261027t134929z-64214fd4
  type: exec-plan
  rulebook: none
  task_id: PJR-05GN
  name: "tsd-recipe を作る"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
  approach: recipe-authoring
  targets:
    - specdojo:tsd-recipe
---

# Edit Plan: PJR-05GN

## 1. このフェーズで行うこと

見直した tsd-rulebook に沿って、技術領域ごとの TSD を書く手順を recipe にする。

## 2. 新しく作る実践の型

- id: `specdojo:tsd-recipe`
- kind: `recipe`
- path: `docs/ja/specdojo/recipes/tsd-recipe.md`
- 記述標準: [[specdojo:recipe-authoring-standard|執筆標準]]（`docs/ja/specdojo/standards/recipe-authoring-standard.md`）
- result: `docs/ja/projects/prj-0001/execution/exec/results/pjr-05gn-20261027T134929Z-64214fd4-result.md`

手本にするファイル:

- `docs/ja/product/030-architecture/020-infrastructure/tsd-ollama.md`: 技術スタック定義（Ollama）（`docs/ja/product/030-architecture/020-infrastructure/tsd-ollama.md`、現在の参照: `未記入`）
- `docs/ja/product/030-architecture/020-infrastructure/tsd-ollama-opencode.md`: 技術スタック定義（Ollama × opencode）（`docs/ja/product/030-architecture/020-infrastructure/tsd-ollama-opencode.md`、現在の参照: `未記入`）
- `docs/ja/product/030-architecture/020-infrastructure/tsd-home-mac-dev-server-usage.md`: 技術スタック定義（ホームMac開発サーバ・日常運用）（`docs/ja/product/030-architecture/020-infrastructure/tsd-home-mac-dev-server-usage.md`、現在の参照: `未記入`）

手本ファイルは読み取り専用であり、プロジェクトリポジトリとプロダクトリポジトリのどちらにあっても変更しない。手本がない場合は、記述標準と対象領域の慣行だけを根拠に実践の型を作る。

## 3. 進め方

1. 記述標準と手本ファイルを実際に読み、複数の成果物に再利用できる規則・問い・完成例・雛形を抽出する。
2. `docs/ja/specdojo/recipes/tsd-recipe.md` に `specdojo:tsd-recipe` を持つ `recipe` を新規作成する。frontmatter の `status` は `draft` とし、`ready` へ変更しない。
3. 手本の内容を丸写しせず、プロジェクト固有の値を一般化する。手本同士が矛盾する場合は、共通部分と差異を分け、判断できない点を result の申し送りへ記録する。
4. 手本のうち成果物カタログに載っているものだけ、作った種類の参照が `undecided` または未記入なら `specdojo:tsd-recipe` へ更新する。カタログ外の文書とプロダクトリポジトリのファイルは読み取り専用の手本にとどめ、参照を付け替えない。rulebook は成果物カタログの `rulebook`、recipe / sample / template は成果物が参照する rulebook frontmatter の同名フィールドを正本とする。
5. カタログ成果物の参照がすでに別の kata を指す場合は上書きせず、その成果物 ID・既存参照・新しい kata ID を result の申し送りへ記録する。`not-needed` も意図的な判断として上書きしない。
   recipe / sample / template の作成時に、手本の rulebook 自体が `undecided`・未記入・`not-needed` で参照先を記録できない場合は、別種の kata を同時作成せず、付け替え不能として result へ記録する。
6. 新しい kata と参照の更新だけを変更対象とし、手本ファイルは変更しない。

## 4. 完了手順

1. 新しい実践の型と、条件を満たす参照の更新を完了する。
2. 共通規約に従って必要な整形・静的検査を実行する。
3. result に実施内容、変更ファイル、手本、一般化した内容、参照を更新しなかった理由を記録する。

## 5. 異常終了の条件

- 新しい id が既に存在する、対象種別と id の末尾が一致しない、手本を解決できない、または検査が未解消の場合は異常終了する。
- 手本ファイル（プロダクトリポジトリを含む）へ変更が生じた場合は元に戻し、commit の対象に含めない。解消できなければ異常終了する。
- agent 自身は登録簿の状態を変更しない。

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

1. `docs/ja/specdojo/recipes/tsd-recipe.md` を [[specdojo:recipe-authoring-standard]] に従って作成する。frontmatter は `id: specdojo:tsd-recipe`、`type: recipe`、`rulebook: specdojo:tsd-rulebook`、`sample: specdojo:tsd-sample` とする。
2. [[specdojo:tsd-rulebook]] の本文要件を、作業の順に辿れる手順と判断にする（一冊にするか分冊にするかの判断、採用値・推奨値・未決事項の区別、動作確認の段階の組み立て、秘密情報の見分け方など）。rulebook の要件を本文へ転載しない。
3. 手本（個票の `sources` の 3 件）から手順を一般化し、手本に固有の製品名・値を必須の条件にしない。手本のファイルは変更しない。
4. [[specdojo:tsd-rulebook]] の frontmatter に `recipe: specdojo:tsd-recipe` を追加する。`tsd-index-rulebook.md` と sample は変更しない。
5. `npm run lint:md`・`npm run lint:fm` と、親の検証が通る。
6. `CHANGELOG.md` の未公開の版の節に変更を書く。公開済みの版の節は変えない。

## 共通: 記法・成果物規約

作業を始める前に、共通の規約の詳細 `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` を読み、その内容に従う。次の箇条書きは、そのうち守らないと失敗に直結する要点である。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 検査を実行する前に、リポジトリの `package.json`、`.specdojo/specdojo.config.json`、hook 設定（`lefthook.yml` など）を読み、本共通規約の詳細にある検査表の適用条件で、実行する検査を決める。
- 適用条件を満たさない検査は実行せず、executor evidence の validations に `not_applicable` と非適用の理由を `reason` へ記録する。適用される検査が 1 つもない場合も同じく、該当する検査ごとに `not_applicable` と理由を記録する。
- `not_run` は、適用される検査を実行できたのに実行しなかった場合だけに使う。runner は `not_run` を検証失敗として扱い、タスクを先へ進めない。
- `pipeline.parent_validations` に設定された検査は executor evidence の validations に含めなくてよい。executor が同じ検査を `not_run` または `not_applicable` として含めても、同じリポジトリで実行した親 runner の結果を正とする。
