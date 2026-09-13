---
specdojo:
  id: prj-0001:pjr-zkna-cdfd-uc-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-09-13T05:07:17Z"
  due_on: "2026-09-30"
---

# PJR-ZKNA ユースケース別 CDFD の cdfd-uc-rulebook と recipe・sample・template を新設する

## 1. 概要

cdfd-overview が定義するユースケース別 CDFD（`cdfd-uc-<topic>`）は、複数のプロセスグループをまたぐ順序と引き渡し条件だけを定め、グループ内部のプロセスは再掲しない。一ノード一プロセスを契約とする cdfd-rulebook では表現できないため、専用の cdfd-uc-rulebook と recipe・sample・template を新設する。章構成と記述レベルは cdfd-overview に合わせ、ID はプロジェクト修飾なしとする。

### 1.1. 決定事項（2026-09-13）

- ユースケース別 CDFD の rulebook は `cdfd-rulebook` に統合せず、`cdfd-uc-rulebook` として新設する。recipe / sample / template も一式そろえる。
- 状態遷移の正本は stsd / cstd とし、ユースケース別 CDFD でも状態の定義・遷移表を書かない。
- product 成果物の ID はプロジェクト修飾なし（`cdfd-uc-<topic>`）。
- 章構成・記述レベルは `cdfd-overview` に合わせる。

### 1.2. ユースケース別 CDFD の契約（`cdfd-overview` の「詳細 CDFD 一覧」より）

- 複数のプロセスグループをまたぐ順序と引き渡し条件だけを定める。グループ内部のプロセスは再掲せず、プロセスグループ別 CDFD を参照する。
- 単一のグループに閉じる業務はユースケース別 CDFD を作らない。
- ケース ID は `cdfd-overview` の `C-01` 形式を引き継ぐ。

### 1.3. 想定する章構成

| 番号 | 見出し                   | 内容                                                                                        |
| ---- | ------------------------ | ------------------------------------------------------------------------------------------- |
| 冒頭 | 導入文                   | 対象ユースケースを一文で定義                                                                |
| 1    | 目的                     | 対象者と利用場面                                                                            |
| 2    | 適用範囲                 | 開始イベント、終了条件、横断するプロセスグループ、対象外（グループ内部、補助操作）          |
| 3    | 横断するプロセスグループ | グループの順序と各グループの役割。`cdfd-overview` の代表ノード名と領域 ID を用いる          |
| 4    | 引き渡し                 | 引き渡し ID、送り元グループ、受け側グループ、引き渡す情報、引き渡し条件、戻す条件の表       |
| 5    | 概念データフロー         | 代表ノードと関係するデータストアだけの Mermaid 図。凡例は「凡例（本プロダクト共通）」を参照 |
| 6    | 例外時の戻り先           | 引き渡し条件を満たさない場合にどのグループへ戻すか。グループ内部の例外は扱わない            |
| 7    | 未決事項                 | 条件付き                                                                                    |

sample は共通サンプル文脈（駄菓子屋）で、`cdfd-overview-sample` の 2 グループ以上を横断するケース（例: 仕入から販売までの商品の流れ）を扱う。

## 2. 完了条件

- `cdfd-uc-rulebook` が、プロセスグループの順序と引き渡し条件だけを定める契約、`cdfd-uc-<topic>` の命名、`C-01` 形式のケース ID、グループ内部・状態遷移を扱わない境界、`cdfd-<group>` への参照方法を規定している。
- `cdfd-uc-recipe`、`cdfd-uc-template`、`cdfd-uc-sample` が rulebook と整合し、sample は `cdfd-overview-sample` の 2 グループ以上を横断するケースを矛盾なく詳細化している。
- `cdfd-overview-rulebook` の用語表と「詳細 CDFD 一覧」の記述が、新設した rulebook を参照している。
- `deliverables-reference` に成果物種別として追加され、`id-and-file-naming-standard` に命名が載っている。
- rulebook / recipe / sample / template の各 authoring standard の最終チェックを満たし、`npm run lint:md`、`npm run lint:fm`、`npm run docs:build` が成功する。

## 3. 作業内容

| No  | 作業                                               | 担当 | 状態 | メモ                                  |
| --- | -------------------------------------------------- | ---- | ---- | ------------------------------------- |
| 1   | `cdfd-uc-rulebook` を新設する                      | ARC  | open | 契約と章構成を先に確定する            |
| 2   | `cdfd-uc-template` を作成する                      | ARC  | open | 骨組み                                |
| 3   | `cdfd-uc-sample` を作成する                        | ARC  | open | 駄菓子屋で 2 グループ以上を横断する例 |
| 4   | `cdfd-uc-recipe` を作成する                        | ARC  | open | 手順                                  |
| 5   | overview-rulebook と reference・命名標準へ追記する | ARC  | open | 種別追加と命名                        |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 新しい全体概要: [[cdfd-overview]]
- 全体概要の規範: [[specdojo:cdfd-overview-rulebook]]
- プロセスグループ別の改訂: [[prj-0001:pjr-4nxr-cdfd-rulebook-process-group]]
- 記法: [[specdojo:cdfd-mermaid-rulebook]]
- 全体概要の見直し元: [[prj-0001:pjr-6pd7-cdfd-overview]]
