---
specdojo:
  id: prj-0001:pjr-bnk5-gl-kata-refine-from-confirmed
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T13:11:51Z"
  derived_from:
    - PJR-960C
    - PJR-6XQ4
    - PJR-2RHB
  commit_type: docs
  commit_scope: kata
  approach: rulebook-maintenance
  targets:
    - specdojo:gl-rulebook
---

# PJR-BNK5 用語集の型（gl）を、確定した用語集 6 件を手本に磨き込む

## 1. 概要

確定した用語集 6 件と確定のレビューで決めた決まりを、gl-rulebook と gl-sample に反映し、grade で pass にする

## 2. 入力

- 用語集 6 件（gl-common など）を 2026-11-13 に確定した。PJR-960C に足すとゲートで 7 種類の確定が止まるため、別の todo にした（orchestrator の判断、indie が進め方を承認）

## 3. 完了条件

- 確定した用語集 6 件（`docs/ja/product/010-business-specs/060-glossary/gl-*.yaml`）の実績から、[[specdojo:gl-rulebook]] を見直している。用語集そのものは変えない。
- [[specdojo:rulebook-authoring-standard]] の章立てに合わせ、rulebook にサンプルの章を置かず、見出しに連番を付け、記述ガイドに章ごとの判断の基準と良い例・悪い例を書いている。
- 確定のレビューで決めた次の決まりを rulebook に足している（PJR-2RHB の入力にある型の分）。
  - 英語名と英語の用語は小文字で書く。SpecDojo の概念の名前として大文字で定着しているもの（Kata など）と固有名詞（SpecDojo など）だけを例外にする。
  - 用語の見出し（`term`）は、利用者がガイド・CLI の表示・コマンド名で目にする言い方に合わせ、言い換えは別名に置く。
  - 注記（`notes`）には読み手向けの補足（前提・例外・使う文脈）だけを書き、`category` や `relatedTerms` の指定のしかたなど YAML の書き方を書かない。項目名の羅列を避け、長くなる場合は用語を分ける。
  - 領域別の用語集に分けるときは、横断の用語を `-common` に置き、同じ用語を 2 つの用語集で定義しない。用語 ID には領域の接頭辞を付けて、用語集をまたいで重ならないようにする。
  - ほかの用語の分類に使う用語を立て、分類（`category`）でまとめる。schema の条件付きの決まりは、用語の関係として短く書き、条件を写さない。
  - 確定した後は用語 ID を変えない。
- [[specdojo:gl-sample]] を、改訂した rulebook に沿う駄菓子屋の共通サンプル文脈の完成例にしている（分類の用語・英語名・注記の書き方の手本になる程度の厚さ）。
- recipe と template の要否を決め、rulebook の frontmatter に宣言している。
- rulebook の「本文要件」と、`relatedTerms`・`category` を同じ用語集の中に限る決まり（領域別の用語集をまたぐ参照の扱い）が、6 件の実績と食い違わないかを確かめ、食い違えば直している。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` と親の検証が通っている。型の grade は統合の後に orchestrator が流す。grade を流せないことを理由に未完了としない。

## 4. 作業内容

| No  | 作業                        | 担当         | 状態 | メモ                               |
| --- | --------------------------- | ------------ | ---- | ---------------------------------- |
| 1   | rulebook と sample を見直す | executor     | done | 対応結果に改訂内容と判断根拠を記録 |
| 2   | 統合の後に型の grade を流す | orchestrator | open | -                                  |

## 5. 対応結果

### 5.1. 実施内容

- [[specdojo:gl-rulebook|用語集作成ルール]] を、標準の 7 章構成のまま改訂した。記述ガイドを範囲・命名・メタ情報・表記・定義と注記・参照・改訂と廃止の判断に分け、それぞれに良い例と悪い例を置いた。完成例は sample に集約し、rulebook にサンプル章は設けていない。
- 英語表記、利用者が目にする見出し、読み手向けの注記、共通用語の集約、分類用語、schema の条件を転記しない関係の説明、確定 ID の維持を明文化した。
- [[specdojo:gl-sample|用語集の完成例]] を駄菓子屋きぬやの 10 語の完成例にした。全語に英語名を付け、販売・在庫・アクターを分類に使い、つけ残高とつけ限度額を独立した用語として定義した。人物の愛称を役割名の「店主代表」に置き換えた。
- 確定した用語集 6 件と `CHANGELOG.md`、grade result サイドカーは変更していない。実行 result の記入は pipeline の reporter に委ねる。

### 5.2. 進め方と実践の型の適用・判断根拠

規範は [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:docs-structure-guide|ドキュメント構成ガイド]]、[[specdojo:ryu-guide|実践の進め方ガイド]] と `gl.schema.yaml` を確認した。finding の判定根拠には [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-qe-kata-conformance` と `vp-arc-conciseness` を用いた。

実績は [[gl-common|共通]]、[[gl-planning|計画]]、[[gl-execution|実行]]、[[gl-quality|評価とレビュー]]、[[gl-register|登録簿]]、[[gl-setup|導入と設定]] の計 179 語、各用語集の最新 grade サイドカー（`execution/grade/results/gl-*.yaml`）、[[prj-0001:xrr-t-glossary-gl-common-090-20261111t204210z-9c30114d|共通用語集の retrofit review result]]、[[prj-0001:xrr-t-glossary-gl-register-090-20261111t214821z-fe70f290|登録簿用語集の retrofit review result]]、および [[prj-0001:pjr-2rhb-glossary-alignment-outside|確定レビューで決めた表記と注記の決まり]] を照合した。判断は次のとおりとした。

- F001（`source=grade`）: schema は authority 付きの ID を許容するため、用語集 ID を `^([a-z0-9-]+:)?gl-[a-z0-9-]+$` に訂正した。`specdojo:gl-sample` を維持して内部矛盾を解消した。今回の plan に Kata 原因の finding・condense 記録はない。
- ファイル名: 6 件すべてが locale を省略しているため、領域名を基本とし、翻訳版を併置するときだけ locale を付ける。日本語の定義に英語名・コマンド名を併記する実績を認め、「言語を混在させない」という一律禁止を定義の言語の区別に改めた。
- 本文要件: 6 件とも用語の `status` は省略しているため、任意を維持し、許容値は schema の 3 値だけとした。ルートの文書成熟度は共通メタ情報標準に従って記載する。実績は全件 `ready` である。
- 参照: 全 179 語の `category`・`relatedTerms` に用語集外の参照はなく、同一ファイル内に限る決まりを維持した。領域をまたぐ関係は `notes`・`source` の正本への文書リンクで案内する。検証実装 `packages/docs-lint/src/validate-glossary-references.ts` もファイル内だけを検証するため、横断の ID 一意性・概念の重複は別途照合することを明記した。
- ID: 6 件の ID は横断で重複していないが、領域の接頭辞は一律でない。確定済み ID は維持し、新規採番へ領域の接頭辞を必須にした。sample の既存 ID も他の完成例からの参照を維持し、人物の愛称由来で参照されていない `tm-grandma` だけを役割を表す `tm-shop-owner` へ改めた。意味の変更・廃止時は旧 ID を残し、参照元と実装・テストを追従する責務を共通標準に合わせた。
- recipe・template: 用語ごとの反復構造は schema と本文要件で判断でき、独立した作成手順や記入骨組みを追加する必要がないため、両方を `not-needed` とした。完成例の参照宣言だけを frontmatter に残した。
- 残る実績側の指摘: 最新 grade にある共通用語集の説明の反復と、導入・設定用語集の実装対応の指摘は `cause.type: document` であり、型の不備として転記しなかった。確定レビューの判断と今回の編集範囲に従い、用語集そのものは維持した。型の再 grade は統合後に orchestrator が行う。

### 5.3. 検証

- Prettier による変更 3 ファイルの整形、`git diff --check`、本個票の `validate:history-links` は通過した。
- hook と同じ `node --import tsx tools/catalog-validate-if-configured.mjs` は終了コード 0。既存カタログの再 export の参照と未作成文書に関する警告は今回の範囲外である。
- `node --import tsx src/specdojo.ts register build --project prj-0001` は終了コード 0 で、登録簿と controls の派生ビューを生成した。
- `lint:md`・`lint:fm`・`validate:schema` を含む指定済みの親検証は runner に委ね、その結果を実行 result の正本とする。

### 5.4. CHANGELOG に書く事項

- 区分: 変更
- 行の文案: 用語集の型（gl）を確定済みの実績に合わせ、英語表記・注記・領域分割・ID 維持・参照範囲の規則を明確にし、駄菓子屋の完成例を拡充した。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6xq4-glossary]]
- [[prj-0001:pjr-2rhb-glossary-alignment-outside]]
