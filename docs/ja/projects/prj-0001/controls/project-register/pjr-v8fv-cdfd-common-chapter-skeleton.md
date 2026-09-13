---
specdojo:
  id: prj-0001:pjr-v8fv-cdfd-common-chapter-skeleton
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: ARC
  registered_at: "2026-09-13T13:45:01Z"
  due_on: "2026-09-30"
---

# PJR-V8FV CDFD 3 レベルの章構成を前半共通（目的・適用範囲・プロセス領域・データストア・概念データフロー）に揃える

## 1. 概要

cdfd-overview、プロセスグループ別 CDFD、ユースケース別 CDFD の章構成が 3 章以降で食い違い、読み方が揃わない。1 目的、2 適用範囲、3 プロセス領域（対象単位ごとの節: 説明文 → 主要入力・主要出力・データストアの箇条書き → 表）、4 データストア（overview の一覧と同じ名称・区分の部分集合）、5 概念データフロー（図直後の注記）を 3 レベル共通の骨組みとし、6 章以降にレベル固有の章、末尾に未決事項を置く。cdfd-rulebook / cdfd-uc-rulebook とそれぞれの template・sample・recipe を揃える。

### 1.1. 現状の対応関係

<!-- prettier-ignore -->
| 章 | overview | プロセスグループ別（`cdfd-sample`） | ユースケース別（`cdfd-uc-sample`） |
| --- | --- | --- | --- |
| 1 | 目的 | 目的 | 目的 |
| 2 | 適用範囲 | 適用範囲 | 適用範囲 |
| 3 | プロセス領域（グループごとの節: 説明文 → 主要入力・出力・データストアの箇条書き → 領域の表） | 対象プロセス領域（1 表に領域単位の入出力を列で持つ） | 横断するプロセスグループ |
| 4 | データストア一覧（2 表） | プロセス一覧（データストアの章なし。区分は本文の一文） | 引き渡し |
| 5 | 概念データフロー（概要） | 概念データフロー（領域ごとの節） | 概念データフロー |
| 6〜 | 詳細 CDFD 一覧 / 凡例 / 未決事項 | 個別プロセス主要入出力 / 状態遷移の参照 / 主要例外とグループ外への委譲 / 未決事項 | 例外時の戻り先 / 未決事項 |

グループ別は 3 章を 1 表にまとめ、データストアの章を持たない。5 章・6 章が領域ごとの節なのに 3 章だけ表 1 枚で、
領域単位で読み進める導線が途切れる。

### 1.2. 決定した章構成

前半 5 章を 3 レベル共通の骨組みとし、6 章以降にレベル固有の章、末尾に未決事項（条件付き）を置く。章名は
overview に合わせて「プロセス領域」「データストア」「概念データフロー」に統一する。

<!-- prettier-ignore -->
| 章 | 共通の骨組み | overview | プロセスグループ別 | ユースケース別 |
| --- | --- | --- | --- | --- |
| 1 | 目的 | 同左 | 同左 | 同左 |
| 2 | 適用範囲 | 同左 | 同左 | 同左 |
| 3 | プロセス領域（対象単位ごとの節: 説明文 → 主要入力・主要出力・データストアの箇条書き → 表） | グループごとの節、表は領域 | 領域ごとの節、表はプロセス（ID・業務目的・主な担当・起動条件・必須性） | グループごとの節、表はそのグループが担う役割 |
| 4 | データストア（overview の一覧と同じ名称・区分。下位は本文書で読み書きするものの部分集合） | 全体の 2 表 | 本グループが読み書きする行と読み書きの別 | 引き渡しで受け渡す行 |
| 5 | 概念データフロー（図直後に凡例参照・現物の流れ・載せていない要素・外部主体を注記） | 概要（2 図） | 領域ごとの節 | 1 図 |
| 6〜 | レベル固有 | 詳細 CDFD 一覧 / 凡例（本プロダクト共通） | 個別プロセス主要入出力 / 状態遷移の参照 / 主要例外とグループ外への委譲 | 引き渡し / 例外時の戻り先 |
| 末尾 | 未決事項（条件付き） | 同左 | 同左 | 同左 |

- グループ別の 3 章は領域ごとの節にし、5 章・6 章の領域ごとの節と 1:1 に対応させる。領域単位の主要入力・
  主要出力・データストアは 3 章の箇条書きへ移し、現在の 1 表は廃止する。
- 4 章「データストア」は overview の一覧との対応（名称・区分）を表で示す場所とし、図のノードとの突き合わせを
  overview と同じ手順でできるようにする。
- overview 側は現状の章構成をすでに満たしているため、章名の表記（「データストア一覧」→「データストア」に
  揃えるか）だけを判断する。完全同一にはしない。詳細 CDFD 一覧と凡例は overview だけの責務であり、個別プロセス
  主要入出力・状態遷移の参照・主要例外と委譲、引き渡し・例外時の戻り先はそれぞれの下位だけの責務である。

## 2. 完了条件

- `cdfd-rulebook` と `cdfd-uc-rulebook` の本文要件が、1 目的 / 2 適用範囲 / 3 プロセス領域 / 4 データストア / 5 概念データフロー を共通の骨組みとして規定し、6 章以降にレベル固有の章、末尾に未決事項を置いている。
- 3 章は対象単位ごとの節（説明文 → 主要入力・主要出力・データストアの箇条書き → 表）で、`cdfd-overview-rulebook` の「プロセス領域」と同じ構成規則になっている。
- 4 章は overview の「データストア」と同じ名称・区分を使う部分集合として規定され、図のノードとの一対一対応を完成判定に含む。
- `cdfd-template` / `cdfd-sample` / `cdfd-recipe` と `cdfd-uc-template` / `cdfd-uc-sample` / `cdfd-uc-recipe` が改訂後の rulebook と整合し、sample は `cdfd-overview-sample` と 3 レベルで同じ読み方ができる。
- `cdfd-overview-rulebook` / `cdfd-overview-template` / `cdfd-overview-sample` と `cdfd-overview` は、章名の統一で変更が必要な箇所だけを最小限に更新している。
- 各 authoring standard の最終チェックを満たし、`npm run lint:md`、`npm run lint:fm`、`npm run docs:build` が成功する。

## 3. 作業内容

| No  | 作業                                                            | 担当 | 状態 | メモ                                   |
| --- | --------------------------------------------------------------- | ---- | ---- | -------------------------------------- |
| 1   | `cdfd-rulebook` の本文要件と記述ガイドを共通骨組みへ改める      | ARC  | done | 3 章を領域ごとの節、4 章にデータストア |
| 2   | `cdfd-template` / `cdfd-sample` / `cdfd-recipe` を追従させる    | ARC  | done | sample は仕入グループ                  |
| 3   | `cdfd-uc-rulebook` の本文要件を共通骨組みへ改める               | ARC  | done | 4 データストア、6 引き渡し、7 戻り先   |
| 4   | `cdfd-uc-template` / `cdfd-uc-sample` / `cdfd-uc-recipe` を追従 | ARC  | done | sample は欠品から補充まで              |
| 5   | overview 側の章名統一の要否を判断し、必要な箇所だけ更新する     | ARC  | done | 「データストア一覧」→「データストア」  |

## 4. 対応結果

- プロセスグループ別 CDFD は、3 章を領域ごとの「説明文 → 主要入力・主要出力・データストア → プロセス表」へ統合し、4 章へ全体概要の部分集合と読み書きの別を追加した。
- ユースケース別 CDFD は、3 章をグループごとの同型構成へ変更し、4 章へ引き渡しに関係するデータストアの部分集合を追加した。引き渡しは 6 章、例外時の戻り先は 7 章へ移した。
- 両レベルの rulebook、template、sample、recipe を新しい章構成へ揃えた。sample は仕入グループと「欠品から補充まで」の内容を維持し、表・図・上位一覧のデータストア名を対応させた。
- overview の rulebook、template、sample、recipe と product の `cdfd-overview` は、4 章名と本文中の参照を「データストア」へ統一した。
- 成果物内容の残課題はない。全体 `lint:fm` は今回未変更の `br-sample.md` にある既存 frontmatter 警告、`docs:build` は sandbox の `tsx` IPC・Chromium 起動制約で完走しなかったが、変更ファイル限定の frontmatter 検査と Markdown 検査は成功した。登録項目のステータスと exec result は pipeline の runner / reporter が更新するため変更していない。

## 5. 関連ドキュメント

- 章構成の基準: [[cdfd-overview]]、[[specdojo:cdfd-overview-rulebook]]、[[specdojo:cdfd-overview-sample]]
- 改訂対象: [[specdojo:cdfd-rulebook]]、[[specdojo:cdfd-sample]]、[[specdojo:cdfd-uc-rulebook]]、[[specdojo:cdfd-uc-sample]]
- 前段の改訂: [[prj-0001:pjr-4nxr-cdfd-rulebook-process-group]]、[[prj-0001:pjr-zkna-cdfd-uc-rulebook]]
