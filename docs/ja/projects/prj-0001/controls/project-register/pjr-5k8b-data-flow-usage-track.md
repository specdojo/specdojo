---
specdojo:
  id: prj-0001:pjr-5k8b-data-flow-usage-track
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: PM
  registered_at: "2026-11-01T09:54:47Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-SJQC
---

# PJR-5K8B track data-flow-usage の timeline・catalog・schedule 戦略を用意する

## 1. 概要

PJR-SJQC の決定に沿って、timeline に track data-flow-usage を定義し、dct-data-flow.yaml に overview の改訂と系統別の詳細 3 文書を定め、sch-strategy-data-flow-usage.yaml を作って schedule build が通る状態にする

## 2. 入力

- PJR-SJQC で、作業を track data-flow-usage の epic で管理し、schedule に展開して実行すると決めた。epic の track は timeline の tml-index.yaml に定義済みである必要がある（2026-11-01）
- 対象は cdfd-overview の改訂、cdfd-uc-register の書き直し、cdfd-uc-schedule と cdfd-uc-routine の新規作成の 4 件。cdfd-uc-deliverable とプロセスグループ別 6 文書の非推奨化は、新しい文書がそろってから別の todo で行う
- 前例は track data-flow-pdca（sch-strategy-data-flow-pdca.yaml と tml-index.yaml の data-flow-pdca）

## 3. 完了条件

- timeline の `tml-index.yaml` に track `data-flow-usage` が定義されている。`data-flow-pdca` の定義にならい、`depends_on` は `data-flow-pdca`、`note` に PJR-SJQC の決定に基づく作業であることを書く
- `dct-data-flow.yaml` で、`cdfd-overview` の `overview` と `done_criteria` が、共通・基盤と register・schedule・routine の関係を描く役割に合っている。`cdfd-uc-register` の `overview` と `done_criteria` が、register 系の詳細（プロセス領域の単位、入口のイベント）に合っている
- `dct-data-flow.yaml` に `cdfd-uc-schedule`（schedule 系の詳細）と `cdfd-uc-routine`（routine 系の詳細）が、`rulebook: specdojo:cdfd-uc-rulebook`、`depends_on: [cdfd-overview]`、根拠となる実装の `evidence_refs`、役割ごとの `done_criteria` を持って定義されている。`cdfd-uc-schedule` の `note` に、`cdfd-uc-deliverable` を引き継ぐ新しい ID であることを書く
- `cdfd-uc-deliverable` とプロセスグループ別 6 文書の catalog の定義は変えない（非推奨化は別の todo で行う）
- `sch-strategy-data-flow-usage.yaml` が、`sch-strategy-data-flow-pdca.yaml` にならって、上の 4 件（`cdfd-overview`・`cdfd-uc-register`・`cdfd-uc-schedule`・`cdfd-uc-routine`）を `local_ids` で scope にしている。作成と書き直しの違いに合う approach を、[[specdojo:schedule-design-guide]] に従って選び、理由を個票の対応結果に書く
- `npx specdojo schedule build --project prj-0001 --track data-flow-usage` が通り、生成された `sch-track-data-flow-usage.yaml` に 4 件のタスクがある。`npx specdojo catalog validate` も通る
- 成果物（CDFD の文書と rulebook）は変えない
- `npm run lint:md` と親の検証が通る

## 4. 作業内容

| No  | 作業                                                                                   | 担当 | 状態 | メモ |
| --- | -------------------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | tml-index.yaml に track data-flow-usage を足す                                         | PM   | done | -    |
| 2   | dct-data-flow.yaml の overview と uc-register を直し、uc-schedule と uc-routine を足す | PM   | done | -    |
| 3   | sch-strategy-data-flow-usage.yaml を作り、schedule build を通す                        | PM   | done | -    |

## 5. 対応結果

### 実施内容

1. `docs/ja/projects/prj-0001/timeline/tml-index.yaml` に track `data-flow-usage` を定義した。`data-flow-pdca` の定義にならい、`depends_on: [data-flow-pdca]`、`note` に PJR-SJQC の決定に基づく作業であることを記載した。
2. `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-flow.yaml` で `cdfd-overview` の `overview` と `done_criteria` を共通・基盤と register・schedule・routine の関係を描く役割へ更新し、`cdfd-uc-register` の `overview` と `done_criteria` を register 系の詳細（プロセス領域の単位、入口のイベント）に合わせた内容へ更新した。あわせて `cdfd-uc-schedule`（`cdfd-uc-deliverable` を引き継ぐ新しい ID）および `cdfd-uc-routine` を、`rulebook: specdojo:cdfd-uc-rulebook`、`depends_on: [cdfd-overview]`、実装の `evidence_refs`、役割ごとの `done_criteria` を持たせて追加した。`cdfd-uc-deliverable` とプロセスグループ別 6 文書の catalog 定義は変更していない。
3. `docs/ja/projects/prj-0001/schedule/sch-strategy-data-flow-usage.yaml` を作成し、上記 4 件（`cdfd-overview`、`cdfd-uc-register`、`cdfd-uc-schedule`、`cdfd-uc-routine`）を `local_ids` で scope に設定した。
4. `npx specdojo schedule build --project prj-0001 --track data-flow-usage` を実行し、4 件のタスクを含む `sch-track-data-flow-usage.yaml` を正常に生成した。あわせて `sch-milestones.yaml` が更新された。`npx specdojo catalog validate` も通ることを確認した。

### approach の選定理由

[[specdojo:schedule-design-guide]] および [[specdojo:ryu-guide]] に基づき、作成と書き直しの違いに応じて以下のとおり approach を選定した。

- **改訂・書き直し（`cdfd-overview`、`cdfd-uc-register`）**: `approach: fully-guided`
  - 理由: 既に草案・既存文書が存在する成果物の改訂・品質向上を行う段階であるため。既存の草案記述とプロジェクト文脈を尊重し、template は読み込まずに宣言された実践の型（`cdfd-overview-rulebook` / `cdfd-uc-rulebook`）に適合させて保守的に磨き込むことが適切であるため。
- **新規作成（`cdfd-uc-schedule`、`cdfd-uc-routine`）**: `approach: draft`
  - 理由: 未作成の成果物を新規に起こす段階であるため。template を骨組みにして章構成や初期記述を起こし、根拠のある範囲から下書きを作成することが適切であるため。

成果物ごとに異なる profile を適用するため、[[specdojo:schedule-design-guide]] の標準設計方針に従い、`owner_rules` の `phase_set`（改訂・書き直し用の `rewrite-pass` と新規作成用の `author-pass`）で分離した。

### 成果物

- `docs/ja/projects/prj-0001/timeline/tml-index.yaml`
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-flow.yaml`
- `docs/ja/projects/prj-0001/schedule/sch-strategy-data-flow-usage.yaml`
- `docs/ja/projects/prj-0001/schedule/sch-track-data-flow-usage.yaml`
- `docs/ja/projects/prj-0001/schedule/sch-milestones.yaml`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-5k8b-data-flow-usage-track.md`

### 残課題・申し送り

- `cdfd-overview`、`cdfd-uc-register`、`cdfd-uc-schedule`、`cdfd-uc-routine` の実文書の作成・改訂は、生成された Schedule track（`data-flow-usage`）の各タスクにて順次実施する。
- `cdfd-uc-deliverable` およびプロセスグループ別 6 文書の非推奨化（trash への退避等）は、新しい文書が完成した後に別タスクで行う。

## 6. 関連ドキュメント

- [[prj-0001:dct-data-flow]]
- [[specdojo:schedule-design-guide]]
- [[specdojo:ryu-guide]]
- [[prj-0001:pjr-sjqc-cdfd-document-structure]]
