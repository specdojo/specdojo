---
specdojo:
  id: specdojo:kata-guide
  type: guide
  status: ready
---

# 実践の型活用ガイド

Kata Guide

SpecDojo で成果物を作成・更新・レビューするときに、rulebook / recipe / sample / template（実践の型）がそれぞれ何を担い、成果物を書くときにどう使い分けるかを説明します。整備状況に応じてどこまで参照するか（`approach`）の選び方は [実践の進め方ガイド](ryu-guide.md) を参照してください。

**対象読者**

- 成果物を作成・更新・レビューする人、エージェント

**この文書で分かること**

- rulebook・recipe・sample・template それぞれの役割と、成果物を書くときの使い分け
- kata を確定する前に、agent が人のレビューの流れに沿って段ごとにレビューする方法

**次に読む文書**

- 整備状況に応じた進め方（`approach`）の選び方は [実践の進め方ガイド](ryu-guide.md) を参照してください。
- 実践の型そのものの種別と役割は [型の構成ガイド](practice-system-composition-guide.md) を参照してください。

## 1. 実践の型の使い分け

実践の型は rulebook / recipe / sample / template の4種です。各種別の役割の正本は [型の構成ガイド](practice-system-composition-guide.md) とし、本章では成果物を書くときの使い方を示します。

| 種別     | 役割                           | 確認できること                                     |
| -------- | ------------------------------ | -------------------------------------------------- |
| rulebook | 成果物として成立するための規約 | 構造、必須項目、禁止事項                           |
| recipe   | 良い内容を書くための作り方     | 問い、観点、深掘り手順、レビュー観点               |
| sample   | 完成例                         | 粒度、文体、表の書き方                             |
| template | 成果物の雛形                   | 章構成の骨組み、記述すべき箇所を示すプレースホルダ |

成果物を書くときは、template があれば雛形として開始し、rulebook で構造・必須項目・禁止事項を確認し、recipe の問いと深掘り手順に沿って内容を組み立て、sample で粒度・文体・表の書き方を合わせます。

template は、記述する部分を _TODO_ などのプレースホルダとして配置した雛形です。内容が埋まった完成例である sample と役割を分担し、成果物作成の開始点として使います。

4 種類すべてが揃っているとは限りません。整備状況に応じてどこまで参照するかは、`approach`（進め方）で切り替えます。詳細は [実践の進め方ガイド](ryu-guide.md) を参照してください。

ファイルが存在することと、内容を基準にできることは別です。存在・宣言形式・参照切れはコードが判定し、内容品質は `specdojo grade` の共通 rubric で評価します。Schedule は保存済み grade と strategy の intent から approach を都度導出します。詳しくは [Schedule設計ガイド](schedule-design-guide.md) の `intent 宣言と approach の決定論的導出` を参照してください。

## 2. 実践の型を作る条件

実践の型は4種すべてを機械的に作るのではなく、成果物種別ごとの方針で要否を判断します。成果物カタログは成果物と rulebook の対応だけを持ち、recipe / sample / template の要否と所在は rulebook frontmatter で次の宣言により区別します。

| 要否   | 整備状況 | rulebook frontmatter 宣言                         |
| ------ | -------- | ------------------------------------------------- |
| 未判断 | 未整備   | `undecided`                                       |
| 必要   | 未整備   | 項目を省略                                        |
| 必要   | 整備済み | 実在する rulebook / recipe / sample / template ID |
| 不要   | 対象外   | `not-needed`                                      |

`undecided` は要否をまだ判断していない状態です。項目の省略は必要と判断済みだが文書 ID をまだ宣言できない状態であり、両者を兼用しません。

| 種別     | 方針・作る条件                                                                                                                                                                 | 作らない条件                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| rulebook | 構造・必須項目・禁止事項について、schema だけでは伝わらない判断がある場合に作る                                                                                                | 構造が schema で完全に規定され、判断の余地がない       |
| recipe   | 他の型とは独立して判断する。規約を満たすだけでは品質を担保できず、書き手による品質差、浅い内容になりやすい、レビューで同じ指摘が繰り返される、のいずれかに当てはまる系統に作る | 規約と schema を満たせば内容がほぼ一意に決まる         |
| sample   | rulebook がある成果物系統には一律に作る。完成例として粒度・文体・表の書き方を示す                                                                                              | 構造が schema で完全に決まる YAML 成果物               |
| template | 個別成果物ごとではなく rulebook 系統単位で判断する。定型の骨組みがあり、同じ系統の成果物を毎回同じ章立てから始める場合に作る                                                   | 対象ごとに構成が変わり、固定の雛形がかえって制約になる |

要否は初回の `bootstrap` で判断します。`undecided` の型は、必要なら項目を省略したうえで必要な型を成果物と一緒に整備し、不要なら `not-needed` へ更新します。既存の型を廃止する、または `not-needed` を必要へ変更する場合は、成果物の実績・繰り返し発生したレビュー指摘・schema の表現範囲を根拠として rulebook frontmatter の宣言も同時に更新します。

成果物と型を一組で初めて作るときは `bootstrap` を使います。成果物がすでにあり、そこから再利用可能な型だけを新しく起こすとき、または手本なしで型だけを作るときは `rulebook-authoring` / `recipe-authoring` / `sample-authoring` / `template-authoring` を使います。authoring では `--target` に新しい kata ID、繰り返し可能な `--source` に読み取り専用の手本を指定します。手本は文書索引で解決できる doc id、プロジェクトリポジトリの相対パス、または project の `repos` に宣言した `<repo>:<path>` です。パスにはファイル、ディレクトリ、glob を指定できます。展開後の手本は重複を除いて 100 ファイルまでです。広すぎるパターンによる読み取り範囲と plan の肥大化を抑えるため、超過時は起票・実行を停止します。

`<repo>` が `repos[].name` と一致する値はプロダクトリポジトリのパスとして扱います。それ以外で `/` または拡張子を含む値はプロジェクトリポジトリのパス、残りは doc id として文書索引で解決します。いずれの形も手本が見つからなければ停止します。成果物カタログは必須ではありません。手本がカタログ成果物で、その kata 参照が `undecided` または未記入の場合だけ新しい kata ID へ更新します。カタログ外とプロダクトリポジトリの手本は変更せず、参照も付け替えません。互換性のため、新しい kata ID に続く 2 個目以降の `--target` も `--source` と同じ手本として受け付けます。

利用者が作る kata はリポジトリ単位の `kata_authority` を使い、`docs/ja/specdojo/{rulebooks,recipes,samples,templates}/<kata_authority>/` に置きます。たとえば `customer:payment-rulebook` の配置は `docs/ja/specdojo/rulebooks/customer/payment-rulebook.md` です。`specdojo:` は SpecDojo 本体専用であり、利用者リポジトリでは新規作成できません。これにより、同じリポジトリの複数 project で型を共有しながら、将来追加される同名の同梱 kata と衝突しません。

0.4.4 のあいだは旧 `docs/ja/kata/` 配置も読みますが、解決時に新配置への移動案内を出します。同じ ID が新旧の両方にある場合は authority サブディレクトリ側を使い、旧ファイルの削除を案内します。

`kind: generated` の成果物には実践の型を適用しません。成果物ごとの型宣言は置かず、`kind` から非適用を導出します。rulebook を持たない成果物は成果物カタログの `rulebook: not-needed` で表します。

## 3. 進め方（approach）との参照分担

実践の型の「使い分け」と「進め方」は次のように役割を分けます。本ガイドは型の役割・使い分けを扱い、進め方の選択・一覧・メンテナンス・review への適用は [実践の進め方ガイド](ryu-guide.md) を正本とします。

| 知りたいこと                                                   | 参照先                                  |
| -------------------------------------------------------------- | --------------------------------------- |
| rulebook / recipe / sample / template それぞれの役割と使い分け | 本ガイド `実践の型の使い分け`           |
| 整備状況・タスク目的に応じた `approach` の選び方と一覧         | [実践の進め方ガイド](ryu-guide.md)      |
| `approach` にかかわらず適用する参照の共通原則                  | [実践の進め方ガイド](ryu-guide.md)      |
| 実践の型メンテナンス（`*-maintenance`）の進め方                | [実践の進め方ガイド](ryu-guide.md)      |
| review でどこまで実践の型に照らすか                            | [実践の進め方ガイド](ryu-guide.md)      |
| kata そのものを agent の段でレビューする方法                   | 本ガイド `kata を agent でレビューする` |

型そのものの種別と型全体での位置づけは [型の構成ガイド](practice-system-composition-guide.md) を正本とします。

## 4. Slidev の kata を検証する

スライドの sample・template を作る場合、SpecDojo を入れたリポジトリにも Slidev の実行環境を
用意すると、kata をビルドして確かめられます。新規導入は `specdojo init --slidev`、既存リポジトリへの
追加は次のコマンドを使います。`init` は Dev Container の `full` を選んだ場合だけ導入の既定が「はい」です。
オプションの詳細は [[specdojo:command-reference|コマンドリファレンス]] を参照してください。

```bash
specdojo config scaffold --slidev --dry-run
specdojo config scaffold --slidev
npm install
```

scaffold が加えるのは `@slidev/cli`・`prettier-plugin-slidev`・`prettier` の開発依存と、スライドだけを
整形する Prettier overrides、markdownlint の基本設定と Slidev 用の CLI2 overrides、CLI 用の除外です。
既存の依存の版は変えません。既存の設定・ignore は保持するため、表示された追加例を確認し、
足りない設定を手で統合してから整形・commit してください。

既定の対象は `docs/ja/specdojo/samples/**/*-slidev-sample.md` と
`docs/ja/specdojo/templates/**/*-slidev-template.md` です。たとえば利用者の `kata_authority` が
`edu-scratch` なら、sample は `docs/ja/specdojo/samples/edu-scratch/lesson-slidev-sample.md` に置きます。
別名の `lsd-sample.md` や旧配置の kata は、実際のパスを Prettier overrides の `files`、
`.markdownlint-cli2.yaml` の `overrides.filter`、`.markdownlintignore` の 3 か所に追加してください。
通常の Markdown として整形するとページ区切り直後の
設定が本文に変わる場合があるため、Slidev のファイルだけに `slidev` parser と
`prettier-plugin-slidev` を当てます。設定方法は [公式 plugin の説明](https://github.com/slidevjs/prettier-plugin) に従っています。

markdownlint の基本設定は `.markdownlintrc`（先頭が `{` の JSON）に置きます。commit hook と
`exec run` の result 検査は markdownlint-cli のままで、この基本設定と `.markdownlintignore` を読みます。
Slidev の kata は ignore で対象外にします。VS Code の markdownlint 拡張と CLI2 は
`.markdownlintignore` を読まないため、`.markdownlint-cli2.yaml` の `config.extends` から
`.markdownlintrc` を読み、Slidev 用の規則で検査します。スライドごとの見出しレベル・H1 とページ区切りに
隣接するブロックを許すため、基本設定に加えて `MD001`・`MD022`・`MD025`・`MD031`・`MD032` を外します。

CLI2 の overrides は最初の一致だけを使うため Slidev 用を先頭に置き、`filter` に対象 glob、
`combine: merge`、`config` に規則を指定します。Prettier は後の一致を優先するため Slidev 用を末尾に置きます。
通常の文書に対する規則は基本設定に残してください。

旧 scaffold の `.markdownlint.jsonc` などがある場合は、規則を JSON の `.markdownlintrc` に移し、
旧 `.markdownlint.*` を取り除き、CLI2 の `config.extends` を設定します。先頭にコメントを書くと
markdownlint-cli が JSON として読めません。親ディレクトリの `.markdownlint.*` も確認してください。
既存設定は `--force` でも自動移行しないため、表示された例を手で統合します。具体的な設定例と移行手順は
[[specdojo:command-reference|コマンドリファレンス]] の `config scaffold --lefthook` の説明を参照してください。

### 4.1. sample のビルドと表示

テーマの選定とインストールは利用者の作業です。scaffold は `slidev-theme-neversink` などのテーマを
選びません。sample の先頭の Slidev frontmatter の `theme` に合わせて開発依存を追加します。
たとえば `theme: default` を使う場合は次のようにします。

```bash
npm install --save-dev @slidev/theme-default
./node_modules/.bin/slidev build docs/ja/specdojo/samples/edu-scratch/lesson-slidev-sample.md --out "$PWD/tmp/slidev-dist"
./node_modules/.bin/slidev docs/ja/specdojo/samples/edu-scratch/lesson-slidev-sample.md
```

`build` の終了コードが 0 であることを確認し、表示されたローカル URL をブラウザで開いて、ページ区切り・
レイアウト・日本語・コンポーネントを確認します。CLI の引数は [Slidev 公式 CLI リファレンス](https://sli.dev/builtin/cli) を参照してください。
SSH / Dev Container 越しに開く場合は、開発サーバーのコマンドに `--remote` を加え、ポート 3030 を転送します。
`tmp/` は検証用の出力先なので、利用者の `.gitignore` に `/tmp/` を追加して管理対象から外してください。

### 4.2. 活動固有の部品と template

`ScratchBlocks.vue` などの活動固有のコンポーネント、`scratchblocks` などの追加依存、画像・
スタイル・setup は利用者がプロダクトリポジトリから用意します。部品に依存する場合は、sample を
`tmp/slidev-check/slides.md` にコピーし、同じ活動の `components/`・`public/` などをその横へ配置して、
相対参照を再現したうえで `./node_modules/.bin/slidev build tmp/slidev-check/slides.md --out "$PWD/tmp/slidev-dist"`
を実行します。template はプレースホルダを埋めた検証用コピーで同じ手順を使い、kata の原本を保持します。

PNG / PDF の書き出しに使う Playwright・Chromium、その OS ライブラリと日本語フォントは scaffold に
含みません。`slidev export` も行う場合は利用者が追加してください。ビルドとブラウザでの表示確認を先に行います。

## 5. kata の付属ファイル

`kata list` と `kata status` は、ID を読める形式（`.md`・`.mdx`・`.yaml`・`.yml`・`.json`）だけを
kata として表示します。この形式で ID の宣言がない場合は、従来どおりファイル名を ID とします。
CSS・画像など、それ以外の形式は独立した kata として表示しません。

付属ファイルは、kata と同じディレクトリに、最後の拡張子を除いた名前をそろえて置きます。
たとえば `lsd-sample.md` には `lsd-sample.css` を付けられます。複数の画像や部品は、同じ名前の
ディレクトリ `lsd-sample/` 以下にまとめられます。`generated/` 以下は対象外です。
ID を読める 5 形式のファイルは、同じ名前やディレクトリ内にあっても別の kata として扱い、
親 kata の付属ファイルには含めません。frontmatter に付属ファイルを宣言する必要はありません。

```text
samples/
  lsd-sample.md
  lsd-sample.css
  lsd-sample/
    images/
      example.png
```

`specdojo kata eject --id <id>` は、同梱 kata とその付属ファイルを同じ相対パスへコピーします。
`--dry-run` では付属ファイルも 1 ファイルずつ表示し、書き込みません。既存ファイルはそれぞれ
`skip` となり、`--force` を付けた場合に上書きします。kata 本体が既存でも、未配置の付属ファイルは
コピーします。`kata install --all` も同じ規則で付属ファイルをコピーします。

コピー後に kata を別の場所で使う場合は、相対参照が保たれるよう付属ファイルも一緒に配置します。
Slidev の全ページに効かせる CSS は、検証用の `slides.md` の横へコピーするときに
`lsd-sample.css` を `style.css` にします。`kata eject` 自体は名前を変えません。

`kata status` は、eject 済みの kata 本体と付属ファイルをまとめて package と比較します。
付属ファイルだけの変更・追加・欠落も、親 kata の行を `modified` として表示します。
kata 本体が package にない場合は `package-missing`、package から参照中の場合は `-` です。
利用者の `kata_authority` に属する独自 kata の差分は、従来どおり `-` です。

## 6. kata を agent でレビューする

人が kata を確定する前に、agent のレビューで人のレビューの流れ（目的の過不足、構成、読みやすさ、正しさ、ほかの文書との整合）を済ませます。人は agent が直した案を確かめ、採るか戻すかを決めます。grade は観点ごとの採点で品質の水準を示し、この段のレビューは直した案と根拠を示します。sample がひととおりそろった後の横串の確認で使います。

### 6.1. 段と渡す材料

レビューは次の 5 段を順に行います。各段は前の段が直した版を読み、前の段の指摘を繰り返しません。直すのは対象の kata だけで、ほかの kata に直すべき点は直さずに指摘として残します。

| 段              | 確かめること                                                                               | 渡す材料（読む範囲）                                                                                                                                                   | 出すもの                               |
| --------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| R1 目的の過不足 | 種別の責務と rulebook の目的に対し、要る内容が欠けていないか、要らない内容が入っていないか | 対象の kata、対応する rulebook、種別の記述標準（[[specdojo:sample-authoring-standard\|Sample 記述標準]] など）、成果物カタログの `done_criteria`                       | 足す・削る差分と指摘                   |
| R2 構成         | 章の順・粒度・表と本文の配置が rulebook の本文構成に沿い、前提から結論の順に読めるか       | 対象の kata、rulebook の本文構成、template                                                                                                                             | 章の移動・分割・統合の差分と指摘       |
| R3 読みやすさ   | `文章のチェック項目` を満たすか                                                            | 対象の kata、`文章のチェック項目`、[[specdojo:specdojo-philosophy\|SpecDojo の考え方]] の `簡潔さと文章量を責務に合わせる`                                             | 文の直しの差分と指摘                   |
| R4 正しさ       | 書いてある事実（コマンド、オプション、キー、既定値、列挙値、パス、挙動）が正本と合うか     | 対象の kata、schema（`docs/specdojo/schemas/v1/`）、`src/`、[[specdojo:command-reference\|コマンドリファレンス]]、確かめに要るコマンドの実行（`--help`、検証コマンド） | 主張ごとの確かめの表、誤りの直しの差分 |
| R5 整合         | 同じ系列の sample、参照先、用語集と食い違わないか                                          | 対象の kata、同じ接頭辞の sample（index と個別）、wikilink と `based_on` の参照先、用語集（`docs/ja/product/010-business-specs/060-glossary/`）、`共通サンプル文脈`    | 食い違いの直しの差分、相手側を直す案   |

R4 の確かめの表は、主張 1 つを 1 行にし、列を `No`、`主張`（本文の箇所）、`正本`（ファイルのパスまたはコマンド）、`確かめ方`（読み取り・実行したコマンド）、`結果`（一致・不一致・確かめられない）、`根拠`（該当の行や出力）とします。確かめられなかった主張も行に残し、確かめに要るものを根拠の列に書きます。

### 6.2. 文章のチェック項目

一文一主張、段落と箇条書きの論点の数、表と本文の分担は [[specdojo:specdojo-philosophy|SpecDojo の考え方]] の `簡潔さと文章量を責務に合わせる` を、ファイル内の用語の統一は [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]] を、曖昧語と表の前の 1 文は [[specdojo:sample-authoring-standard|Sample 記述標準]] を正本とします。R3 では、これらに加えて次を確かめます。

| No  | 項目               | 確かめること                                                                                                               | 直し方の例                                                                       |
| --- | ------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| W1  | 主語の明示         | 誰が行うか、何がそうなるかが、前後の文から一つに決まる                                                                     | 「確かめる」を「店番が在庫を確かめる」にする                                     |
| W2  | 主語と述語の対応   | 主語と述語がねじれていない                                                                                                 | 「目的は、在庫を管理する」を「目的は、在庫を管理できるようにすることです」にする |
| W3  | 文の長さ           | 読点が 3 つを超える文、80 字程度を超える文は、条件・理由・結論に分けても意味が保てるかを確かめる（目安であり合否にしない） | 条件を前の文に出し、結論の文を短くする                                           |
| W4  | 指示語の参照先     | 「これ」「その」「上記」が指す先が直前の文から一つに決まる                                                                 | 指示語を指す先の名詞に置き換える                                                 |
| W5  | 修飾の係り         | 長い修飾語が二つ以上の語にかかると読めない                                                                                 | 修飾語を被修飾語の直前へ移すか、文を分ける                                       |
| W6  | 否定と受け身       | 二重否定と、行う主体が消える受け身がない                                                                                   | 「確認されない場合は」を「店番が確かめていない場合は」にする                     |
| W7  | 範囲の言い切り     | 「など」「適宜」「必要に応じて」の後に、範囲か判断の基準が読み取れる                                                       | 「など」の列挙を言い切るか、含める基準を書く                                     |
| W8  | 用語集との表記     | 用語集にある語は用語集の表記に合わせ、略語は初出で正式名を添える                                                           | 「PJR」の初出を「プロジェクト登録簿（PJR）」にする                               |
| W9  | 表・箇条書き・番号 | 二つ以上の属性を持つ項目を三つ以上並べる場合は表、属性が一つなら箇条書き、順序のある手順は番号付きの箇条書きにする         | 「名前・期限・担当」を並べた箇条書きを表にする                                   |
| W10 | 文体の統一         | ファイル内で「です・ます」と「である」が混ざっていない（表のセルと箇条書きの体言止めは除く）                               | 本文の文末をファイルの多数の文体へそろえる                                       |

### 6.3. kata の観点の組

段のレビューでは、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] のうち、kata に合う次の観点だけを使います。

| 段   | 使う観点                                                                                                       |
| ---- | -------------------------------------------------------------------------------------------------------------- |
| R1   | `vp-po-purpose-alignment`、`vp-arc-single-responsibility`、`vp-qe-kata-conformance`（種別の責務）              |
| R2   | `vp-arc-document-structure`、`vp-qe-omissions-consistency`                                                     |
| R3   | `vp-ux-readability`、`vp-ux-language-consistency`、`vp-arc-conciseness`                                        |
| R4   | `vp-arc-technical-constraints`、`vp-dev-implementation-readiness`、`vp-dev-testability`、`vp-qe-verifiability` |
| R5   | `vp-qe-kata-conformance`（kata 相互と適用先）、`vp-dev-change-impact`                                          |
| 全段 | `vp-po-publication-accountability`、`vp-ops-agent-boundary`（blocker を見つけた段が指摘する）                  |

次の観点は kata の段のレビューでは使いません。

| 観点                                                                                   | 外す理由                                                                                                          |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `vp-po-decision-readiness`、`vp-ops-release-readiness`                                 | kata の承認と ready 化は登録簿で追い、kata の本文に承認判断の材料を求めないため                                   |
| `vp-pm-plan-feasibility`、`vp-pm-dependency-risk`、`vp-pm-control-reporting`           | 計画・依存・報告は個々の成果物で問われ、kata の内容の良し悪しを表さないため                                       |
| `vp-ba-business-value`、`vp-ba-requirements-completeness`、`vp-ba-stakeholder-clarity` | sample の業務の中身は rulebook の求めとして R1 と R5 の `vp-qe-kata-conformance` で確かめ、別の観点で重ねないため |
| `vp-ops-operability`                                                                   | kata の更新と再生成の手順は kata の本文ではなく本ガイドと記述標準が持つため                                       |

### 6.4. 書き手と別のモデルの組み方

各段は、kata を書いた agent と別の provider の agent に任せます。書き手は、対象の kata を最後に変えた段（`condense` を含む）の executor で判断します。

| 書き手の provider         | 段を任せる agent                                                     |
| ------------------------- | -------------------------------------------------------------------- |
| claude（opus・sonnet）    | codex の `sol-executor`                                              |
| codex                     | claude の `opus-executor`                                            |
| opencode のローカル model | codex の `sol-executor`（R4 で `src/` を読みコマンドを実行するため） |

agent は strategy の phase の `agent` で指名します。reporter は書き手と同じ provider でもかまいません。

### 6.5. 人への報告の形

各段の result の実施内容に、次の形で報告を書きます。人は R1 から R5 の順に result を読み、段ごとの commit を差分として確かめ、採らない差分を戻します。

- executor: 報告の `handoff` に、指摘を 1 件ずつ 1 項目として書く（項目の書式は `No: 段 / 箇所 / 指摘 / 直した案 / 根拠 / 印`）。表の文字列を 1 項目に詰めない。
- reporter: `handoff` の指摘を、出力の `findings` に 1 件ずつ 1 つの組（`no`・`stage`・`location`・`finding`・`fix`・`basis`・`mark`）で渡す。表は書かず、`summary` と `handoff` に指摘を重ねない。
- runner: `findings` を result の `実施内容` の後に Markdown の表として 1 回だけ描く。セルの `|` と改行は runner が直す。

- 指摘の表: 列は `No`、`段`、`箇所`（章の名前）、`指摘`、`直した案`（差分の要約、直さない場合は `-`）、`根拠`（観点 ID またはチェック項目の No）、`印` とする。
- 印: agent が迷った指摘には `要判断` を付け、迷った理由と選ばなかった案を根拠の列に書く。迷わなかった指摘は `-` とする。
- R4 では、`段と渡す材料` の確かめの表を指摘の表の後に置く。
- 対象の kata 以外を直すべき点は、指摘の表に `直した案` を `-` として載せ、相手側の文書と直す案を根拠の列に書く。

```text
| No   | 段 | 箇所   | 指摘                                     | 直した案                         | 根拠                | 印     |
| ---- | -- | ------ | ---------------------------------------- | -------------------------------- | ------------------- | ------ |
| R3-1 | R3 | 2. 目的 | 「確かめる」の主語がない                 | 「店主代表が確かめる」にした     | W1                  | -      |
| R3-2 | R3 | 4. 範囲 | 「など」の範囲が読めない                 | 対象の 3 品目を言い切った        | W7                  | 要判断 |
```

## 7. 関連ドキュメント

- [実践の進め方ガイド](ryu-guide.md): `approach` の選び方・一覧、参照の共通原則、メンテナンス・review への適用
- [型の構成ガイド](practice-system-composition-guide.md): 実践の型を含む型（Kata）の種別と役割
- [プロジェクト概要 作成レシピ](../recipes/prj-overview-recipe.md): rulebook / recipe / sample の役割分担の記述例
- [レビューガイド](review-guide.md): レビューの進め方と、実践の型の活用方法
