---
specdojo:
  id: prj-0001:pjr-seqc-timeline-gantt-chart-timeline
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-14T15:08:17Z"
  due_on: "2026-08-31"
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
| 1   | `exec-schedule-timeline*.ts`のモジュール名・export名・内部変数名の改名 | ARC | done | 3ファイルを`exec-schedule-gantt-chart*.ts`へ`git mv`。`buildTimelineSvg`→`buildGanttChartSvg`等のexport名、`exec-schedule-calendar.ts`の`timelineStartDate`→`ganttChartStartDate`等、内部変数`timelineStart`／`timelineEnd`まで改名 |
| 2   | 生成ファイル名の改名（`timeline*` → `gantt-chart*`） | ARC | done | `exec-schedule-gantt-chart-scope.ts`の`fileBase`と`exec-schedule.ts`の`metadata.json` derived_files一覧を変更 |
| 3   | ドキュメント記述の追随 | ARC | done | `command-reference.md`／`schedule-design-guide.md`／`execution/README.md`を更新。`.vitepress/sidebar-config.ts`は権限不足で未変更（申し送り） |
| 4   | 既存生成物`timeline*`（8件）の削除・`gantt-chart*`としての再生成 | ARC | done | 本worktreeでは`generated/`が未生成だったため削除対象なし。`exec refresh`で`gantt-chart*`8件（md/svg各4）を生成 |
| 5   | `tml-rulebook.md`の新設 | ARC | done | 2.1の仕様、2.3の役割分担（`sch-milestones.yaml`との比較表）、今後の検討（フル成果物カタログ化）を記載 |
| 6   | `tml-index.yaml`の新設 | ARC | done | 既存track（launch/data-flow）＋未着手16トラックを6 waveで記載。`status: draft`、`notes`に_UNDECIDED_を明記 |
| 7   | `specdojo timeline build`コマンドの実装 | ARC | done | `src/timeline-build.ts`（ロジック）＋`src/timeline.ts`（CLI）を新設し`src/specdojo.ts`へ登録。`timeline build`／`timeline where`を提供 |
| 8   | `tml-index`を`dct-project-management.yaml`へ登録 | ARC | done | `タイムライン`グループ（base_path: timeline）を追加し、done_criteria5件を定義 |
| 9   | `docs/specdojo/schemas/v1/tml-index.schema.yaml`の新設 | ARC | done | `sch-track.schema.yaml`に倣い`$defs/TrackPlan`で定義。`tml-rulebook.md`の本文構成から参照 |
| 10  | `id-and-file-naming-standard.md`への`tml-`prefix追記 | ARC | done | 14.1のプロジェクト関係ドキュメント表へ「トラック順序計画 / Timeline / tml- / tml-index」を追加 |
| 11  | 検証コマンド実行 | ARC | done | typecheck／lint:ts／test（1075件）／build／docs:build／catalog validate すべて成功 |

## 5. 対応結果

- 既存timelineをgantt-chartへ改名し、`tml-`系の新成果物種別としてtimelineを新設した。両者の名前空間は完全に分離し、`src/`・`tests/`に`timeline`という語のGantt由来の用法は残っていない。
- Gantt側の改名は、モジュール名・export名・内部変数名・生成ファイル名・ドキュメント記述の5層すべてで実施した。生成物は`gantt-chart.{md,svg}`／`gantt-chart-milestones.{md,svg}`／`gantt-chart-track-{launch,data-flow}.{md,svg}`の8件。
- 新timelineは「着手前に人間が決める計画」、`sch-milestones.yaml`は「実行後に集計される実績」という役割分担を`tml-rulebook.md`に明記し、`sch-milestones.yaml`は廃止していない。
- `specdojo timeline build`は`tml-index.yaml`を入力に、`timeline-order.md`（着手wave一覧）・`catalog-scaffold.md`（カタログ未作成ドメインと実行コマンド）・`timeline.json`（機械可読サマリー）を`timeline/generated/`へ出力する一方通行の生成コマンドとして実装した。`depends_on`の未定義参照・循環・`order`との矛盾・track id重複を検出すると終了コード1で停止する。
- カタログの突き合わせは、`data-model`／`business-model`のように1ドメインが複数ファイルへ分割される実態に合わせ、ファイル名ではなく各`dct-*.yaml`の`domain`値で行う実装とした。
- `tml-index.yaml`の`order`・`catalog_duration_estimate_days`は`track-design-guide.md`のウォーターフォール段階分けを基にした初期案であり、`status: draft`のまま人間レビューに委ねる。本チケットの完了条件はスキーマ・仕組みの整備であり、着手順の最終確定は含まない。

## 6. 関連ドキュメント

- [[specdojo:schedule-design-guide]]: 改名対象の生成物・現行Schedule設計との関係、`sch-milestones`の生成ロジック
- [[specdojo:command-reference]]: `exec refresh`の`timeline`言及箇所
- [[specdojo:track-design-guide]]: トラックの標準的な実行順序（新`timeline`が機械可読化する対象のプローズ）
- [[specdojo:id-and-file-naming-standard]]: `tml-`prefixを追加する対象
- [[specdojo:kata-guide]]: rulebook / recipe / sample / template の役割分担
- [[specdojo:sch-rulebook]]: recipe/sample/templateを持たない構成の先例
- [[prj-0001:dct-project-management]]: `tml-index`の登録先
