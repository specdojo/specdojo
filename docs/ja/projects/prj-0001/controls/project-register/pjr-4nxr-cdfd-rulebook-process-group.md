---
specdojo:
  id: prj-0001:pjr-4nxr-cdfd-rulebook-process-group
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-13T05:07:17Z"
  due_on: "2026-09-30"
---

# PJR-4NXR cdfd-rulebook と recipe・sample・template をプロセスグループ別 CDFD へ改訂する

## 1. 概要

cdfd-overview は詳細 CDFD をプロセスグループ別（`cdfd-<group>`）とユースケース別（`cdfd-uc-<topic>`）に再定義したが、cdfd-rulebook / cdfd-recipe / cdfd-sample / cdfd-template は旧来の領域別（1 領域 1 文書、`cdfd-<domain>`）のままである。cdfd-rulebook をプロセスグループ別 CDFD 専用に改め、章構成と記述レベルを cdfd-overview に合わせて recipe・sample・template を追従させる。状態遷移の正本は stsd / cstd とし CDFD は参照に留める。product 成果物の ID はプロジェクト修飾なしとする。

### 1.1. 決定事項（2026-09-13）

| 論点                            | 決定                                                                                                                                                                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユースケース別 CDFD の rulebook | 別に新設する（[[prj-0001:pjr-zkna-cdfd-uc-rulebook]]）。`cdfd-rulebook` はプロセスグループ別 CDFD 専用にする                                                                                                                        |
| 状態遷移の正本                  | `stsd`（ステータス定義）と `cstd`（概念状態遷移図）。CDFD は状態を変えるプロセスと起動条件を示し、状態の定義・遷移表は参照に留める。`cdfd-overview` の「詳細 CDFD 一覧」冒頭にある「状態遷移…を定める正本」の文言も合わせて修正する |
| product 成果物の ID             | プロジェクト修飾なし（`cdfd-<group>`）。`cdfd-overview-rulebook` の方針に揃える                                                                                                                                                     |
| 章構成・記述レベル              | `cdfd-overview`（プロセスグループごとの節、主要入力・主要出力・データストアの箇条書き、表、データストア一覧との名称一致、図直後の注記）に合わせる                                                                                   |

### 1.2. 見直し点

rulebook:

- 導入文・全体方針・用語表を「領域別」から「プロセスグループ別」へ改める。1 文書 = 1 プロセスグループ（複数領域）。各領域はちょうど 1 文書に属する。
- 「対象プロセス領域」章を追加し、`cdfd-overview` が委ねた領域単位の主要入力・主要出力・データストアを表で示す。領域 ID・業務目的・起点イベントは `cdfd-overview` を参照し再掲しない。
- プロセス ID は `P-<領域 ID>-<nn>` を必須とし、文書内一意の `P-01` 形式を廃止する（`cdfd-overview` の領域 ID と衝突するため）。例外 ID の形式も定める。
- ファイル名・ID を `cdfd-<group>` とし、`<group>` は `cdfd-overview` のグループ名の英小文字とする。
- データストアは `cdfd-overview` の「データストア一覧」と同じ名称・区分（マスタ・構成／トランザクション）を使い、図の色クラスは「凡例（本プロダクト共通）」に従うことを要求する。
- 「領域外への委譲」を「グループ外への委譲」へ改め、委譲先は他グループの CDFD（`cdfd-<group>`）またはユースケース別 CDFD（`cdfd-uc-<topic>`）とする。同一グループ内の領域間の受け渡しは内部フローとして図に描く。
- 図の分割は領域ごと、または業務の性質ごとを既定とする。
- 完成判定に「グループに属する全領域のプロセスが一覧に登場する」「領域単位の入出力表が `cdfd-overview` のグループ単位の箇条書きと矛盾しない」「状態の定義・遷移表を書かず stsd / cstd を参照している」を加える。

recipe:

- 手順に「グループと含む領域群を `cdfd-overview` から転記し、領域単位の入出力表を先に作る」を加える。
- 各章の問いに「人間と AI Agent の責任分担を対応文書から参照しているか」「データストアの名称・区分が一覧と一致しているか」「図を領域単位で分けたか」「状態遷移を stsd / cstd へ委ねているか」を加える。
- 良い例・悪い例の固有語（`init`、`provider`、`Schedule`）を共通サンプル文脈へ置き換え、レビュー観点の用語とロール略称を統一する（grade の finding F006〜F008）。

sample / template:

- `cdfd-sample` を `cdfd-overview-sample` の仕入グループ（`P-01`〜`P-02`）を詳細化する `cdfd-purchasing` 相当へ書き直す。現在は旧 overview-sample の 1 領域だけを扱い、境界が不整合（grade の finding F001〜F003）。
- `cdfd-template` を新章構成へ更新する。

周辺:

- `cdfd-overview` の「詳細 CDFD 一覧」冒頭の役割分担から「状態遷移」を外し、stsd / cstd への参照に改める。
- `deliverables-reference` の cdfd 行、`id-and-file-naming-standard` と `directory-layout-reference` の例（`cdfd-sales-management.md`）を `cdfd-<group>` へ追従させる。

## 2. 完了条件

- `cdfd-rulebook` がプロセスグループ別 CDFD 専用になり、対象プロセス領域章、`P-<領域 ID>-<nn>` の ID、`cdfd-<group>` の命名、データストア一覧との名称一致、グループ外委譲、stsd / cstd 参照を規定している。
- `cdfd-recipe`、`cdfd-template`、`cdfd-sample` が改訂後の rulebook と整合し、`cdfd-sample` が `cdfd-overview-sample` の 1 グループを矛盾なく詳細化している。
- `cdfd-overview` の「詳細 CDFD 一覧」が状態遷移の正本を stsd / cstd へ委ねる記述になっている。
- `deliverables-reference`、`id-and-file-naming-standard`、`directory-layout-reference` の cdfd の記述が新しい命名と一致している。
- rulebook / recipe / sample / template の各 authoring standard の最終チェックを満たし、`npm run lint:md`、`npm run lint:fm`、`npm run docs:build` が成功する。
- `specdojo grade` で `cdfd-rulebook`、`cdfd-recipe`、`cdfd-sample` の既存 finding（境界不整合、責任分担参照、固有語、用語統一）が解消している。

## 3. 作業内容

| No  | 作業                                                            | 担当 | 状態 | メモ                                        |
| --- | --------------------------------------------------------------- | ---- | ---- | ------------------------------------------- |
| 1   | `cdfd-rulebook` をプロセスグループ別へ改訂する                  | ARC  | open | 規範を先に確定する                          |
| 2   | `cdfd-template` を新章構成へ更新する                            | ARC  | open | 骨組み                                      |
| 3   | `cdfd-sample` を仕入グループの詳細化へ書き直す                  | ARC  | open | 完成例。`cdfd-overview-sample` と整合させる |
| 4   | `cdfd-recipe` を更新する                                        | ARC  | open | 手順。grade の finding も解消               |
| 5   | `cdfd-overview` の状態遷移の文言と周辺の reference を追従させる | ARC  | open | stsd / cstd 参照、`cdfd-<group>` の例       |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 新しい全体概要: [[cdfd-overview]]
- 全体概要の規範: [[specdojo:cdfd-overview-rulebook]]
- 改訂対象: [[specdojo:cdfd-rulebook]]、[[specdojo:cdfd-recipe]]、[[specdojo:cdfd-sample]]、[[specdojo:cdfd-template]]
- 状態遷移の正本: [[specdojo:stsd-rulebook]]、[[specdojo:cstd-rulebook]]
- ユースケース別の新設: [[prj-0001:pjr-zkna-cdfd-uc-rulebook]]
- 全体概要の見直し元: [[prj-0001:pjr-6pd7-cdfd-overview]]（作業 2 は overview 側のみ完了）
- 状態定義の移設: [[prj-0001:pjr-zffz-cdfd-3-stsd-cstd]]
