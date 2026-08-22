---
specdojo:
  id: prj-0001:pjr-wvns-planning-artifacts-catalog-scope
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: high
  owner: ARC
  registered_at: "2026-08-22T12:24:09Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-22T13:29:14Z"
  conclusion: 計画成果物は新設の planning ドメインと planning トラックが所有する。人や agent が判断して書く入力は work、sch-track と sch-milestones は generated として登録し、dct-<domain>.yaml と表示用生成物は登録しない。トラック別ファイルは具体的な local_id で個別登録し、着手時に追加する。planning 自身の strategy は control として循環を避ける。実装は PJR-QF7T で完了した。
---

# PJR-WVNS 計画成果物をカタログへ載せ、専用の planning ドメインとトラックで所有する

## 1. 背景

timeline、dct-index、dct-plan、sch-assessment、sch-strategy、sch-track の一部がカタログ未登録で、Schedule に載っていない。トラックのスコープはドメイン単位でしか絞れず、また sch-track-X は sch-strategy-X から生成されるため、あるトラックの計画物を同じトラック自身で生成することはできない。計画物の所有トラック、カタログへの登録範囲、トラック別ファイルの粒度を決める。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                     | 利点                                                                                           | 懸念                                                                                       |
| ------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| A      | 新ドメイン `planning` を設け、専用トラック `planning` が計画物を所有する | 計画物と固定数の pm 管理文書のライフサイクルを分離できる。トラック追加のたびに増える性質に合う | ドメインが1つ増え、索引の分類にも追加が要る                                                |
| B      | `project-management` に置き、`launch` トラックが所有する                 | 追加なしで既存パターンの拡張になる                                                             | 完了した launch トラックを開け直してタスクを積むことになり、トラックの完了判定が意味を失う |
| C      | 前段トラックが次段トラックの計画物を所有する                             | 次の準備を自然にスケジュールできる                                                             | 実行順の変更が所有関係の変更になり、Timeline で順序を変えられなくなる                      |

## 3. 決定内容

選択肢 A を採択する。あわせて登録範囲と粒度を次のとおり決める。

- 所有: 新ドメイン `planning` と専用トラック `planning` を設け、計画物を所有する。トラックのスコープは `scope.catalogs` のドメイン単位でしか絞れないため、専用トラックにはドメイン分割が必要である。
- 登録範囲: 人や agent が判断して書く入力（`tml-index`、`dct-index`、`dct-plan-<domain>`、`sch-assessment-<track>`、`sch-strategy-<track>`、`sch-defaults`）は `kind: work` として登録する。生成物のうち `sch-track-<track>` と `sch-milestones` は依存関係の表現と存在検査のため `kind: generated` で登録する。`dct-<domain>.yaml` そのものと `generated/` 配下の表示用生成物は登録しない。
- 粒度: トラック別ファイルは具体的な `local_id` で個別に登録する。ただし宣言はトラック着手時に追加し、未着手トラックの分を先行して登録しない。
- 循環回避: `planning` トラック自身の strategy は `planning` の scope に含めないか `kind: control` とし、初回のみ bootstrap で起こす。

## 4. 採択理由

- 計画物はトラックを追加するたびに増え続ける。固定数の pm 管理文書と同じトラックへ置くと、完了済みの `launch` トラックへ後からタスクを積むことになり、トラックの完了判定が成立しなくなる。
- `sch-strategy` の `scope` は `catalogs` と `include_kinds` しか持たず、ドメイン未満の粒度で絞れない。計画物を独立トラックで回すにはドメインの分割が前提になる。
- ドキュメント構成ガイドは、件数が増え続けるものはディレクトリ（ドメイン）を分けると定めている。計画物はこの条件に該当する。
- `dct-<domain>.yaml` を登録すると、ドメイン追加のたびにカタログ側の宣言も増える二重管理になる。現状は手書きと `catalog scaffold --plan` 生成が混在しており `kind` を一意に決められない。存在検査は `catalog validate` が別経路で行うため、登録による追加の統制も得られない。
- インスタンスの `local_id` は kebab-case の具体値が要求され、テンプレートのようなパターン展開ができない。したがってトラック別ファイルは個別登録以外に選択肢がない。
- Timeline の 12 トラックのうち `catalog_status: primary` は 2 件のみで、残りは着手未定である。未着手分を先行登録すると完了条件が空回りし、Ready タスクにノイズが乗る。

## 5. 承認

| 項目     | 内容                                                      |
| -------- | --------------------------------------------------------- |
| 決定者   | PO                                                        |
| 決定日   | 2026-08-22                                                |
| 承認方式 | commit                                                    |
| 証跡     | 本個票を追加した commit（`docs(register): add PJR-WVNS`） |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | 成果物カタログのドメイン構成、Timeline のトラック定義、`project-management` からの計画物の移設、索引の分類                                                     |
| 必要な対応 | `dct-planning.yaml` の新設と移設、Timeline への `planning` トラック追加、`sch-assessment-planning` と `sch-strategy-planning` の作成、索引への `planning` 追加 |
| 追跡先     | 実装は PJR-QF7T で追跡する                                                                                                                                     |

## 7. 関連ドキュメント

- 分類の正本: [[specdojo:docs-structure-guide|ドキュメント構成ガイド]]
- Schedule の設計方針: [[specdojo:schedule-design-guide|Schedule設計ガイド]]
- Timeline の設計方針: [[specdojo:timeline-design-guide|Timeline設計ガイド]]
- 生成の仕組みを整備した項目: [[prj-0001:pjr-strg-deterministic-dct-strategy-generation|PJR-STRG DCTとsch-strategyの決定論的ジェネレーター実装]]
- 現在の登録先: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-management.yaml`
