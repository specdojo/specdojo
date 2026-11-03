---
specdojo:
  id: prj-0001:pjr-bc45-cdfd-overview-kata-d2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-03T02:39:38Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-6QTK
  commit_type: docs
  commit_scope: samples
---

# PJR-BC45 全体概要の sample と template の図を D2 の縦の流れにする

## 1. 概要

cdfd-overview の sample と template の概念データフローと凡例を Mermaid から D2 の縦の流れにし、データストアの色を G 案に合わせる

## 2. 入力

- PJR-6QTK の後も、cdfd-overview の sample と template の図は Mermaid の横向きのまま。全体概要は D2 の縦の流れで書いている（2026-11-03）
- 利用者の判断: sample と template の図を D2 にし、縦の流れにする。データストアの色と凡例も見直す（2026-11-03）
- 利用者の判断: rulebook の「凡例で記法を宣言しなければ Mermaid」という既定は変えず、sample と template の凡例で D2 を宣言する。詳細の CDFD の sample・template は今回含めない（2026-11-03）
- cdfd-d2-rulebook には direction: down と、データストアの色の G 案（マスタ・構成 #e8f5e9 / #43a047、トランザクションと物理保管 #c8e6c9 / #2e7d32）がすでに定めてある（2026-11-03）

## 3. 完了条件

- [[specdojo:cdfd-overview-sample]] の「概念データフロー（概要）」の図が D2（`direction: down`）で書かれている。ノード・線・ラベルの中身と、データストアの区分で分ける方式は変えない。変えるのは記法・向き・色・配置だけ。戻りの線は `a <- b` で書き、プロセスグループの並びを上から下へ読める順にそろえる
- sample の「凡例（本プロダクト共通）」が D2 の縦の流れになっている。物理保管はマスタ・構成データとトランザクションデータの横に並べ、凡例の文章で記法に D2（[[specdojo:cdfd-d2-rulebook]]）を選ぶと宣言し、形状・線種と色の意味を書いている
- データストアの色が [[specdojo:cdfd-d2-rulebook]] の G 案（マスタ・構成データ `#e8f5e9` / `#43a047`、トランザクションデータと物理保管 `#c8e6c9` / `#2e7d32`）に合い、`classes` で塗っている。ノードごとの `style` は使わない。配置のための非表示の線は使ってよい
- [[specdojo:cdfd-overview-template]] の概念データフローと凡例の雛形が、sample と同じ D2 の縦の流れ・色・凡例の形になっている
- 全体概要の凡例（[[prj-0001:cdfd-overview]] の「凡例（本プロダクト共通）」）と、色と凡例の形がそろっている
- rulebook・recipe・[[specdojo:cdfd-d2-rulebook]]・全体概要・詳細の CDFD の Kata は変えない。sample と template の status は ready のまま
- 本文の文章（目的・表など）は、図の記法を説明する箇所だけを D2 に合わせ、ほかは変えない
- sample の 2 つの図を `d2 --layout elk` で SVG に出力し、並びと大きさを個票の対応結果に記録する
- 未決の点は executor が決め、理由を個票の対応結果に記録する
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ                          |
| --- | ---------------------------------------------- | ---- | ---- | ----------------------------- |
| 1   | sample の図と凡例を D2 の縦の流れにする        | BA   | done | 戻りの矢印と G 案の色を反映   |
| 2   | template の雛形を sample に合わせる            | BA   | done | D2 の図・凡例・記法説明を統一 |
| 3   | SVG で並びと大きさを確かめ、対応結果に記録する | BA   | done | ELK の SVG 出力と配置を確認   |

## 5. 対応結果

- [[specdojo:cdfd-overview-sample|全体概要 sample]] と [[specdojo:cdfd-overview-template|全体概要 template]] の概念データフローと凡例、計 4 図を `direction: down` の D2 に変更した。凡例で [[specdojo:cdfd-d2-rulebook|D2 記法ルール]] を選択すると宣言し、通常線・太線・戻りの矢印・配置制御用の非表示の線の意味を説明した。
- sample は外部主体 2、代表ノード 5、データストア 9 の計 16 ノードと、ラベル付きの受け渡し 30 本を維持した。変更前の Mermaid とノードラベル、受け渡しの起点・終点・ラベル・情報／物の区別を照合し、一致を確認した。データストアの区分で図を分ける方式と、1 図に収める構成も維持した。
- マスタ・構成データを `#e8f5e9` / `#43a047`、トランザクションデータと物理保管を `#c8e6c9` / `#2e7d32` にした。形状・色は `classes` で共通定義し、物理保管は大角丸四角形、物の流れは `material_flow` class の太線にした。凡例の形状・色・線種は [[prj-0001:cdfd-overview|全体概要]] の凡例とそろえた。
- 配置の判断: 領域の表と同じ順に読めるよう、仕入→販売→在庫→顧客→締めを非表示の線で固定した。この線は受け渡しではないことをコード内のコメントと凡例に記載した。補充依頼、発注、顧客への商品引渡し、つけ残高の参照、台帳への精算・見直しなど、配置上の上流へ戻る線は `<-` で書き、業務上の矢印の向きを維持した。
- SVG 確認: D2 v0.9.0 の `d2 --layout elk` で sample の 2 図を出力した。概要図の `viewBox` は `0 0 2012 3586`（幅 2012、高さ 3586）。代表ノードの形状上端の Y 座標は仕入 461、販売 1263、在庫 2112、顧客 2474、締め 3025 で、上から下の並びを確認した。凡例の `viewBox` は `0 0 928 797`（幅 928、高さ 797）。上段に外部主体・起点イベント、中段にプロセス、下段にマスタ・構成データ、トランザクションデータ、物理保管が左から横に並ぶ。下段の形状上端はすべて Y=489 だった。SVG を画像化して配置も目視確認した。
- template の 2 図も同じコマンドで SVG 出力できた。概念データフローの `viewBox` は `0 0 568 842`、凡例は sample と同じ `0 0 928 797` で、凡例の下段の並びも一致した。template は最小の 3 ノード・2 本の受け渡しを保ち、ノード ID を D2 ルールの英小文字にした。表示ラベルの記入欄は維持した。
- 本文は図の記法説明がある第 5・7 章だけを変更し、それ以外の章と frontmatter が変更前と一致することを確認した。sample・template の `status` は既存の `ready` を維持した。rulebook、recipe、全体概要、詳細 CDFD の Kata は変更していない。
- 検証: 4 図の SVG 出力、変更前後の意味の照合、凡例の共通クラスの一致、概要図の縦の順序と凡例の横並びの検査は成功した。変更した 3 文書を Prettier で整形し、`git diff --check`、`node --import tsx tools/catalog-validate-if-configured.mjs`、`node --import tsx src/specdojo.ts register build` は終了コード 0 で完了した。カタログ検証には未変更文書の `based_on` 検証先が見つからない警告が出た。Markdown・D2 を含む親検証は executor 終了後に runner が実行する。
- 残課題・未決事項: なし。result への転記は pipeline の reporter / runner に引き継ぐ。

## 6. 関連ドキュメント

- [[specdojo:cdfd-overview-sample]]
- [[specdojo:cdfd-overview-template]]
- [[specdojo:cdfd-d2-rulebook]]
- [[prj-0001:cdfd-overview]]
