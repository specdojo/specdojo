---
specdojo:
  id: prj-0001:pjr-te2n-cdfd-d2-rulebook
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-10-31T14:16:02Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-01T00:35:53Z"
  conclusion: cdfd-d2-rulebook を作り、CDFD の記法を全体概要の凡例で Mermaid と D2 から選べるようにした。宣言しないプロダクトは Mermaid のまま
  derived_from:
    - PJR-2ZMY
  depends_on:
    - PJR-6NEM
    - PJR-8TQJ
---

# PJR-TE2N CDFD の D2 版の rulebook と記法の選び方を用意する

## 1. 概要

cdfd-mermaid-rulebook に対応する cdfd-d2-rulebook を作り、CDFD の記法を Mermaid と D2 から選べるようにする。今は cdfd-overview・cdfd・cdfd-uc の rulebook が includes で cdfd-mermaid-rulebook を固定している

## 2. 入力

- 利用者は cdfd-mermaid-rulebook の D2 版を求めた（2026-10-31）
- 記号の対応の案: プロセスは border-radius 付きの rectangle、データストアは cylinder、物理保管は border-radius を大きくした rectangle、外部主体は rectangle、イベントは hexagon、サブグラフはコンテナ、情報の流れは ->、物の流れは太線の class、色は classes で定義し class で当てる、方向は direction: right
- 記法をどこで選ぶか（例: プロダクトの cdfd-overview の凡例で宣言する）は executor が決め、理由を個票の対応結果に記録してよい
- D2 の描画の基盤（PJR-6NEM）と、要点に絞った CDFD の rulebook（PJR-8TQJ）の後に行う

## 3. 完了条件

1. `docs/ja/specdojo/rulebooks/cdfd-d2-rulebook.md` を作る。
   - `specdojo:cdfd-mermaid-rulebook` と同じ概念（プロセス・プロセスグループ・サブグラフ・データストア・物理保管・外部主体・イベント・情報の流れ・物の流れ）を、D2 の記法で一対一に表す対応表を持つ。記号の対応は個票の入力の案を基本とし、変える場合は理由を個票の対応結果に書く。
   - 色は `classes` で概念の大分類ごとに定義して `class` で当て、ノード単位の `style` の個別指定は禁止する。Mermaid 版の色・絵文字の方針と揃える。
   - 方向は `direction: right` を基本とする。配置のエンジンは文書のサイトと同じ ELK を前提とする。
   - PJR-8TQJ で要点に絞った CDFD の rulebook と同じ密度で書く。
   - Frontmatter は [[specdojo:rulebook-authoring-standard]] に従い、`status: draft` とする。
2. rulebook の中の D2 の例は ` ```d2 ` のコードブロックで書き、`npm run lint:d2` を通す。
3. `cdfd-overview`・`cdfd`・`cdfd-uc` の 3 つの rulebook が、CDFD の記法を Mermaid と D2 から選べるようにする。
   - どこで選ぶか（例: プロダクトの `cdfd-overview` の凡例で宣言する）は executor が決め、理由を個票の対応結果に書く。
   - 記法を宣言しない既存のプロダクトは、今までどおり Mermaid として扱われる。
4. プロダクトの CDFD の文書（`docs/ja/product/010-business-specs/010-data-flow/`）は変えない。書き直しは PJR-RXVC と PJR-T1D1 で行う。
5. どの rulebook の `status` も上げない（ready への格上げは人が行う）。
6. 終える前に `npm run lint:md`・`npm run lint:fm`・`npm run lint:mermaid`・`npm run lint:d2`・`npm run validate:schema` を通す。あわせて親の検証も通す。
7. 未決の点は executor が決め、理由を個票の対応結果に書く。

## 4. 作業内容

| No  | 作業                                                       | 担当 | 状態 | メモ                                            |
| --- | ---------------------------------------------------------- | ---- | ---- | ----------------------------------------------- |
| 1   | 完了条件に沿って D2 版の rulebook と記法の選び方を用意する | BA   | done | D2 版 rulebook 作成と 3 rulebook の選択対応完了 |

## 5. 対応結果

### 5.1. 実施内容

- **`cdfd-d2-rulebook.md` の作成**:
  - `docs/ja/specdojo/rulebooks/cdfd-d2-rulebook.md`（ID: `specdojo:cdfd-d2-rulebook`）を新規作成した。
  - `specdojo:cdfd-mermaid-rulebook` と同じ概念（プロセス・プロセスグループ・サブグラフ・データストア・物理保管・外部主体・イベント・情報の流れ・物の流れ）を D2 の記法で一対一に表す対応表を整備した。
  - 記号の対応は個票の入力案を踏襲し、プロセス／代表ノードは角丸四角形（`shape: rectangle`、`style.border-radius: 8`）、データストアは円柱（`shape: cylinder`）、物理保管は大角丸四角形（`shape: rectangle`、`style.border-radius: 20`）、外部主体は四角形（`shape: rectangle`）、イベントは六角形（`shape: hexagon`）、サブグラフはコンテナ（`container: { ... }`）、情報の流れはラベル付き `->`、物の流れは `material_flow` クラス（太線 `style.stroke-width: 3`）を適用したエッジとした。
  - 色は `classes` で大分類ごとに定義して `class` で当て、ノード単位の `style` 個別指定を禁止した。配色は Mermaid 版と揃えた。
  - 方向は `direction: right` を基本とし、配置エンジンは docs-site の既定と同じ ELK を前提とした。
  - PJR-8TQJ で要点に絞った CDFD の rulebook と同じ密度・章構成で作成し、Frontmatter は `status: draft` とした。
  - rulebook 内の D2 例は ` ```d2 ` コードブロックで記述した。
- **CDFD rulebook 3 文書における記法選択の対応**:
  - `cdfd-overview-rulebook.md`、`cdfd-rulebook.md`、`cdfd-uc-rulebook.md` の Frontmatter `includes` に `specdojo:cdfd-d2-rulebook` を追加した。
  - 「Mermaid 図」と固定されていた記述を「概念データフロー図（Mermaid または D2）」に改定した。
  - 全体概要の「凡例（本プロダクト共通）」で記法（Mermaid または D2）を選択・宣言する規程を追加した。記法を宣言しない既存プロダクトは従来どおり Mermaid 記法として扱われる。
  - 詳細 CDFD は全体概要の凡例で選択された記法に従う方針とした。
- **プロダクト CDFD 文書および rulebook の status の保持**:
  - プロダクトの CDFD 文書（`docs/ja/product/010-business-specs/010-data-flow/`）は一切変更していない（書き直しは PJR-RXVC および PJR-T1D1 で実施予定）。
  - 各 rulebook の `status` は格上げせず、`cdfd-d2-rulebook` は `status: draft`、既存の `cdfd-overview-rulebook`（ready）、`cdfd-rulebook`（ready）、`cdfd-uc-rulebook`（draft）の status も維持した。
- **共通レビュー観点の更新**:
  - `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` の `vp-ba-business-value` および `vp-arc-single-responsibility` の `confirmed_default` に `specdojo:cdfd-d2-rulebook` を追加し、rulebook 追加に伴う観点網羅テストを満たすようにした。

### 5.2. executor の未決事項と決定理由

1. **記法の選択場所**:
   - プロダクトの全体概要（`cdfd-overview.md`）の「凡例（本プロダクト共通）」章で、プロダクト共通の記法（Mermaid または D2）を宣言する方式を採用した。
   - **理由**: PJR-8TQJ において凡例章を全体概要に 1 回だけ設け、詳細 CDFD からは全体概要の凡例を参照するアーキテクチャが確立されている。記法の選択もこれに揃えて全体概要の共通凡例で行うことで、プロダクト全体の記法の一貫性が保証され、個別詳細 CDFD での冗長な再定義や不整合を防止できるため。
2. **記法を宣言しない既存プロダクトの下位互換性**:
   - 凡例章を省略した場合、または凡例章で記法を明示しない場合は、従来どおり Mermaid（`specdojo:cdfd-mermaid-rulebook`）を既定として適用することとした。
   - **理由**: 既存の CDFD 成果物に改訂を強制せず、完全な後方互換性を保つため。
3. **記号・スタイルの対応**:
   - 個票入力案に沿って一対一対応を設計した。物理保管はデータストアと同系統色・大角丸四角形（`style.border-radius: 20`）、物の流れは `material_flow` クラス（`style.stroke-width: 3`）とした。
   - **理由**: ノード形状だけで概念を識別可能にし、色やスタイルのノード単位の個別指定を排除して `classes` で一元管理するため。

## 6. 関連ドキュメント

- [[specdojo:cdfd-d2-rulebook]]
- [[specdojo:cdfd-mermaid-rulebook]]
- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-rulebook]]
- [[specdojo:cdfd-uc-rulebook]]
- [[prj-0001:pjr-2zmy-document-editing-toolset]]
- [[prj-0001:pjr-6nem-d2-rendering-foundation]]
- [[prj-0001:pjr-8tqj-cdfd-concise-rulebooks]]
