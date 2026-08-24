---
specdojo:
  id: specdojo:tml-rulebook
  type: rulebook
  status: draft
  target_format: yaml
  recipe: not-needed
  sample: not-needed
  template: not-needed
  based_on:
    - specdojo:rulebook-authoring-standard
---

# タイムライン作成ルール

Timeline Documentation Rules

本ドキュメントは、Timeline（`tml-index.yaml`）を一貫した粒度と命名で作成・更新するためのルールです。
Timeline は「どのトラックを、どの順で、いつ着手するか」というマクロな順序を**人間が着手前に決めて記録する計画層**であり、成果物カタログ作成からトラック実行までの見通しを 1 ファイルで表します。
本書は命名・ID 規則と schema で表現できない記述規範を定義し、構造・必須キーは schema を、トラックの標準構成と実行順序の考え方は [[specdojo:track-design-guide]] を参照します。

## 1. 全体方針

- Timeline はプロジェクトごとに `tml-index.yaml` 1 ファイルとし、プロジェクト直下の `timeline/` に置く。トラック単位のファイル分割は行わない。
- Timeline が扱うのは**トラック粒度のマクロな順序**であり、タスク粒度の日付・依存関係は扱わない。タスク粒度は Schedule（`sch-track-<track>.yaml`）が正本とする。
- Timeline は人間が着手前に決める**計画**である。実行結果や実績日付を書き戻さない。
- Timeline はまだ成果物カタログ（`dct-<domain>.yaml`）が存在しないトラックも記載できる。カタログ未作成のトラックを計画へ載せられることが、Schedule との最大の違いである。
- Timeline は `specdojo timeline build` の入力であり、後続の `catalog scaffold` / `schedule build` への入力情報を生成する一方通行の流れに置く。生成物から Timeline を逆生成しない。

## 2. 位置づけと用語定義

Timeline・Schedule・成果物カタログは、決める時点と粒度が異なります。

| 用語                           | 意味                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| track                          | 関連する成果物と活動をまとめた作業系列。`sch-strategy-<track>.yaml` の `<track>` と対応する |
| domain                         | 成果物カタログの管理単位。`dct-<domain>.yaml` の `domain` 値と対応する                      |
| catalog_status                 | 成果物カタログの作成状況。`not_started` / `draft` / `primary` の3値                         |
| order                          | 逐次実行時の着手順序を表す整数。同値は並行実行の候補                                        |
| parallel_group                 | 並行実行してよいトラック群を表すラベル。同じ値を持つトラック同士は並行してよい              |
| catalog_duration_estimate_days | カタログを `draft` から `primary` にするまでに要する見積り工期（稼働日）                    |

### 2.1. `sch-milestones.yaml` との役割分担

`tml-index.yaml` と `sch-milestones.yaml` はどちらも「節目」を扱いますが、決める時点と生成方向が逆です。両者は併存し、`sch-milestones.yaml` を Timeline で置き換えません。

| 観点     | `tml-index.yaml`                                   | `sch-milestones.yaml`                                        |
| -------- | -------------------------------------------------- | ------------------------------------------------------------ |
| 位置づけ | 着手前に人間が決める計画                           | 実行後に集計・生成される実績                                 |
| 生成方向 | 人間が手で書く正本                                 | 各トラックの `phase_gates` / `group_milestones` から生成する |
| 粒度     | トラック粒度（着手順・並行可否・カタログ作成状況） | マイルストーン粒度（ゲート・承認・リリース地点）             |
| 前提     | 成果物カタログが未作成のトラックも記載できる       | 成果物カタログと Schedule が存在するトラックだけを対象とする |
| 更新契機 | 着手順の見直し、トラックの追加・除外               | `specdojo schedule build` / `specdojo exec refresh` の実行   |

## 3. ファイル命名・ID規則

### 3.1. ファイル名と配置

- プロジェクトのトラック順序計画は `tml-index.yaml` とする。プロジェクトごとに 1 ファイルだけ置く。
- 配置先はプロジェクト直下の横断ディレクトリ `timeline/` とする（例: `docs/ja/projects/prj-0001/timeline/tml-index.yaml`）。
- prefix は `tml-` を使う。`tml-` は Timeline 層の予約 prefix であり、他の用途に転用しない。

### 3.2. `id`

- 形式は `<project-id>:tml-index` とする（例: `prj-0001:tml-index`）。
- `project_id` にはプロジェクト識別子（例: `prj-0001`）を記載し、`id` の接頭辞と一致させる。
- `rulebook` には `specdojo:tml-rulebook` を宣言する。

### 3.3. `track` と `domains` の値

- `track` は `sch-strategy-<track>.yaml` / `sch-track-<track>.yaml` の `<track>` と同じ識別子を使う。まだ Schedule が存在しないトラックでも、将来使う予定の識別子を先に決めて記載する。
- `track` の値は [[specdojo:track-design-guide]] の標準トラック構成に定義された id を優先して使い、プロジェクト固有のトラックを足す場合だけ新しい id を定義する。
- `domains` には、そのトラックが対象とする `dct-<domain>.yaml` の `domain` 値を配列で記載する。1 トラックが複数ドメインを対象にしてよい。
- 英小文字・数字・ハイフンで構成する（パターン: `^[a-z0-9][a-z0-9-]*$`）。

## 4. 本文構成（標準テンプレ）

Timeline は Markdown の章構成を持たない YAML 成果物であり、ルートキー・必須キー・型は次の schema を正本とする。キー一覧は本書に複製しない。

| ファイル         | schema                                           |
| ---------------- | ------------------------------------------------ |
| `tml-index.yaml` | `docs/specdojo/schemas/v1/tml-index.schema.yaml` |

- ルートには `id` / `type` / `status` / `title` / `rulebook` / `version` / `project_id` / `tracks` を必須で置く。
- `tracks[]` の各要素には `track` / `domains` / `catalog_status` / `order` / `depends_on` を必須で置き、`catalog_duration_estimate_days` / `parallel_group` / `note` は任意とする。
- 互換性を壊す schema 変更（required 追加、型変更、制約強化など）を行う場合は `version` を上げ、既存の全 `tml-index.yaml` への影響を確認する。

## 5. 記述ガイド

schema で機械検証できない記述規範だけを定める。トラックの標準構成・情報の流れ・進め方別の実行順序は [[specdojo:track-design-guide]] を参照する。

### 5.1. `catalog_status` の判定基準

3値の判定は成果物カタログの実体と使われ方で決める。ファイルの `status` 値をそのまま転記しない。

| 値            | 判定基準                                                                     |
| ------------- | ---------------------------------------------------------------------------- |
| `not_started` | 対象ドメインの `dct-<domain>.yaml` がまだ存在しない                          |
| `draft`       | `dct-<domain>.yaml` は存在するが、エントリ・完了条件が未確定で追加変更が続く |
| `primary`     | カタログが SSOT として確定し、`schedule build` の入力として使える状態にある  |

- `not_started` のトラックは `specdojo timeline build` が `catalog scaffold` の対象候補として扱う。
- `primary` へ上げる判断は人間が行う。トラックの実行開始（`sch-strategy-<track>.yaml` の作成）は `primary` 到達後を原則とする。

### 5.2. `order` と `parallel_group`

- `order` は 1 始まりの整数とし、着手順を表す。値の連番・一意性は要求しない。
- 同じ `order` を持つトラックは並行実行の候補である。実際に並行させてよいかを明示する場合は `parallel_group` に同じラベルを付ける。
- `parallel_group` のラベルには、並行させる理由が分かる名前を使う（例: `business-specs`、`design`）。トラック名をそのまま繰り返さない。
- `order` は依存関係と矛盾させない。`depends_on` に挙げたトラックには、自分より小さい `order` を与える。

### 5.3. `depends_on` の書き方

- 前提のないトラックも `depends_on: []` と明示する。
- `depends_on` には「先に着手すべきトラック」だけを書く。成果物を参照するだけの情報の流れ（入力元）は依存として書かない。入力元の一覧は [[specdojo:track-design-guide]] を正本とする。
- 推移的に導ける依存は重複して書かない（`a -> b`、`b -> c` のとき `a -> c` を書かない）。
- `depends_on` に書いた track id は、同じ `tracks[]` 内に定義されていなければならない。

### 5.4. `catalog_duration_estimate_days` と `note`

- `catalog_duration_estimate_days` は、カタログを `draft` から `primary` にするまでの稼働日見積りとし、小数可・ゼロ不可とする。トラック本体の実行工期は含めない。
- `catalog_status: primary` のトラックでは `catalog_duration_estimate_days` を省略してよい。
- `note` には、順序をそう決めた理由や保留事項など、他のフィールドで表せない判断だけを書く。フィールド値の言い換えを書かない。
- 未確定の順序は `note` に _UNDECIDED_ を付けて残し、ファイルの `status` を `draft` に据え置く。

## 6. 禁止事項

- タスク粒度の日付・工期・担当を `tml-index.yaml` に書くこと（タスク粒度は Schedule が正本）。
- 成果物パス・完了条件（`done_criteria`）を書くこと（成果物カタログが正本）。
- 実行実績（完了日、実際の着手日、進捗率）を書き戻すこと（実績は `sch-milestones.yaml` と `generated/` が正本）。
- `depends_on` を省略すること（前提なしでも `[]` と明示する）。
- `tracks[]` に定義されていない track id を `depends_on` に書くこと。
- `depends_on` の向きと `order` の大小を矛盾させること。
- `sch-milestones.yaml` のマイルストーンを `tml-index.yaml` に複製すること。
- プロジェクトごとに `tml-index.yaml` を複数置くこと、またはトラック単位へ分割すること。
- `specdojo timeline build` の生成物を直接編集すること。

## 7. サンプル

最小構成の例を示す。`launch` を起点に、業務仕様のドメイン別トラックを並行候補として並べている。

```yaml
id: prj-0001:tml-index
type: project
status: draft
title: トラック順序計画
rulebook: specdojo:tml-rulebook
version: 1
project_id: prj-0001

tracks:
  - track: launch
    domains: [project-definition, project-management]
    catalog_status: primary
    order: 1
    depends_on: []
    note: プロジェクト全体の前提を定義する起点トラック。

  - track: data-flow
    domains: [data-flow]
    catalog_status: primary
    order: 2
    parallel_group: business-specs
    depends_on: [launch]

  - track: data-model
    domains: [data-model]
    catalog_status: draft
    catalog_duration_estimate_days: 3
    order: 2
    parallel_group: business-specs
    depends_on: [launch]
    note: data-flow と同じ入力を使うため並行候補とする。

  - track: architecture
    domains: [architecture]
    catalog_status: not_started
    catalog_duration_estimate_days: 2
    order: 3
    depends_on: [data-flow, data-model]
```

## 8. 今後の検討

- 現時点の `catalog_status` は3値の軽量フィールドであり、カタログ作成作業そのものを子カタログ（`done_criteria` 付きの成果物エントリ）として管理する「フル成果物カタログ化」は採用していない。カタログ作成の工数管理をタスク粒度で行う必要が出た場合に、フル化を再検討する。
- フル化する場合でも `tml-index.yaml` はトラック粒度の計画層として残し、カタログ作成タスクは Schedule 側へ展開する方針を想定する。
- 複数プロジェクトを横断したトラック順序計画（プログラム単位の Timeline）は現時点では扱わない。
