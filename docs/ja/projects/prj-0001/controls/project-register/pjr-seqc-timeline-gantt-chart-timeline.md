---
specdojo:
  id: prj-0001:pjr-seqc-timeline-gantt-chart-timeline
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-08-14T15:08:17Z"
  due_on: "2026-08-31"
  conclusion: agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)
---

# PJR-SEQC timelineをgantt-chartへ改名し、timelineをトラック順序計画として新設する

## 1. 概要

現状のtimeline（sch-track群から生成するGantt可視化）をgantt-chartへ改名し、空いたtimelineという名前を、成果物カタログ作成〜トラック実行までのマクロな順序を人間が決めて記録する新しい成果物種別（`tml-`）として新設する。設計判断は本チケットで確定済みのため、以降の実装はAI Agentが本文の仕様に沿って進めてよい。

## 2. 確定した設計（実装の前提）

### 2.1. `tml-index.yaml` の仕様

- 記述形式: YAML。
- 配置先: `docs/ja/projects/prj-0001/timeline/tml-index.yaml`（`schedule/`等と同様、プロジェクト直下の横断ディレクトリ）。
- ID: `prj-0001:tml-index`。prefixは `tml-`。
- Kata: `specdojo:tml-rulebook` のみ新設する（`sch-rulebook.md` が `recipe: none` / `sample: none` / `template: none` であるのに倣い、recipe/sample/templateは作らない）。
- 保持するフィールド（最低限）:

```yaml
id: prj-0001:tml-index
type: project
status: draft
rulebook: specdojo:tml-rulebook
project_id: prj-0001
tracks:
  - track: <track-id> # sch-strategy-<track>/sch-track-<track> の <track> と対応
    domains: [<dct-<domain>.yaml の domain 値の配列>]
    catalog_status: not_started | draft | primary # カタログ作成状況
    catalog_duration_estimate_days: <number> # draft→primaryに要する見積り工期
    order: <int> # 逐次実行時の順序。同値は並行可能候補
    parallel_group: <string> # 任意。同じ値を持つtrack同士は並行実行してよい
    depends_on: [<track-id>, ...] # 依存する他トラック（先に着手すべきtrack）
    note: <string> # 任意の補足
```

- `catalog_status` は3値固定（`not_started`／`draft`／`primary`）。フル成果物カタログ化（カタログ作成自体を子カタログとしてdone_criteria付きで管理する案）は今回は採用せず、この軽量フィールドと工期見積りで進捗管理する。将来フル化する可能性は`tml-rulebook.md`の「今後の検討」節に明記する。

### 2.2. `dct`/Schedule との接続方針

`schedule build` 側が`tml-index.yaml`を読み込む形にはしない。代わりに **新コマンド `specdojo timeline build`** を新設し、`tml-index.yaml`を入力として、`dct-<domain>.yaml`未作成のtrackへの`catalog scaffold`相当の準備、および`depends_on`/`order`/`parallel_group`から算出した着手順序の提示（`generated/`配下への出力）など、後続コマンド（`catalog scaffold`・`schedule build`）への入力情報を作る一方通行の生成コマンドとする。既存の「正本→`build`系コマンド→生成物」という流れに合わせる。具体的な生成内容は実装時に`timeline-build.ts`で設計してよい。

### 2.3. `sch-milestones.yaml` との関係

廃止しない。`sch-milestones.yaml`は各trackの`phase_gates`/`group_milestones`から**実行後に集計・生成される実績**、`tml-index.yaml`は**着手前に人間が決める計画**という役割分担を`tml-rulebook.md`に明記する。

### 2.4. 既存生成物・カタログ登録

- 改名後、`docs/ja/projects/prj-0001/execution/generated/timeline*.svg`／`timeline*.md`（現状8ファイル）を削除し、`specdojo exec refresh`で`gantt-chart*`として再生成する。
- `tml-index`を`dct-project-management.yaml`へ成果物カタログエントリとして登録する（`sch-milestones`等と同様の粒度）。

## 3. 完了条件

- 既存`timeline`関連モジュール（`exec-schedule-timeline.ts`／`exec-schedule-timeline-scope.ts`／`exec-schedule-timeline-render.ts`）と参照元（`exec-schedule.ts`／`exec-schedule-calendar.ts`）の`timeline`という語が`gantt-chart`へ改名されていること（export名・内部変数名を含む）。
- 生成ファイル名（`timeline.svg`／`timeline.md`／`timeline-milestones.*`／`timeline-track-<track>.*`）が`gantt-chart*`系へ改名され、`command-reference.md`／`schedule-design-guide.md`／`docs/ja/projects/prj-0001/execution/README.md`の記述が追随していること。
- 既存の生成済み`timeline*`ファイル（8件）が削除され、`gantt-chart*`として再生成されていること。
- `docs/ja/specdojo/rulebooks/tml-rulebook.md` が「2.1」の仕様で新設されていること。
- `docs/ja/projects/prj-0001/timeline/tml-index.yaml` が新設され、プロジェクトの既存track（`launch`／`data-flow`）と、まだtrack化していないドメインについて`catalog_status`・`order`等を記載していること。
- `specdojo timeline build` コマンドが実装され、「2.2」の contract を満たすこと。
- `tml-index` が `dct-project-management.yaml` に登録されていること。
- `docs/specdojo/schemas/v1/tml-index.schema.yaml` が新設され、`tml-rulebook.md`から参照されていること（`sch-track.schema.yaml`等の既存パターンに倣う）。
- `id-and-file-naming-standard.md` に `tml-` prefixの命名規則が追記されていること。
- `sch-milestones.yaml`との役割分担が`tml-rulebook.md`に明記されていること。
- `npm run -s lint:md`／`npm run typecheck`／`npm run build`／`npm run docs:build` が成功すること。

## 4. 作業内容

<!-- prettier-ignore -->
| No  | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1   | `exec-schedule-timeline*.ts`のモジュール名・export名・内部変数名の改名 | ARC | open | 対象: `src/exec-schedule-timeline.ts`等3ファイル、参照元`exec-schedule.ts`／`exec-schedule-calendar.ts` |
| 2   | 生成ファイル名の改名（`timeline*` → `gantt-chart*`） | ARC | open | `exec-schedule-timeline-scope.ts`の`fileBase`定義を中心に変更 |
| 3   | ドキュメント記述の追随 | ARC | open | `command-reference.md`／`schedule-design-guide.md`／`execution/README.md` |
| 4   | 既存生成物`timeline*`（8件）の削除・`gantt-chart*`としての再生成 | ARC | open | `specdojo exec refresh --project prj-0001` |
| 5   | `tml-rulebook.md`の新設 | ARC | open | 2.1の仕様、2.3の役割分担を含む |
| 6   | `tml-index.yaml`の新設 | ARC | open | 2.1のフィールドで、既存track（launch/data-flow）と未着手17ドメインを記載。`order`等の値はこれまでの検討順・`track-design-guide.md`の標準順を初期案として仮置きし、`tml-index.yaml`自体の`status`を`draft`とする（内容の最終確定は人間レビュー対象。本チケットの完了条件はスキーマ・仕組みの整備であり、最終的な着手順の確定は含めない） |
| 7   | `specdojo timeline build`コマンドの実装 | ARC | open | 対象: `src/timeline-build.ts`（新設）、`src/specdojo.ts`へのコマンド登録。contractは2.2 |
| 8   | `tml-index`を`dct-project-management.yaml`へ登録 | ARC | open | - |
| 9   | `docs/specdojo/schemas/v1/tml-index.schema.yaml`の新設 | ARC | open | `sch-track.schema.yaml`等に倣う |
| 10  | `id-and-file-naming-standard.md`への`tml-`prefix追記 | ARC | open | 14.1または新設セクション |
| 11  | 検証コマンド実行 | ARC | open | lint:md／typecheck／build／docs:build |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[specdojo:schedule-design-guide]]: 改名対象の生成物・現行Schedule設計との関係、`sch-milestones`の生成ロジック
- [[specdojo:command-reference]]: `exec refresh`の`timeline`言及箇所
- [[specdojo:track-design-guide]]: トラックの標準的な実行順序（新`timeline`が機械可読化する対象のプローズ）
- [[specdojo:id-and-file-naming-standard]]: `tml-`prefixを追加する対象
- [[specdojo:kata-guide]]: rulebook / recipe / sample / template の役割分担
- [[specdojo:sch-rulebook]]: recipe/sample/templateを持たない構成の先例
- [[prj-0001:dct-project-management]]: `tml-index`の登録先
