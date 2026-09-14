---
specdojo:
  id: prj-0001:pjr-s190-strategy-scope-local-ids
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-13T22:02:55Z"
  due_on: "2026-10-31"
  completed_at: "2026-09-14T11:39:39Z"
  conclusion: sch-strategy の scope.catalogs[] に任意の local_ids を追加し、指定時はその成果物だけを scope として approach_rules / owner_rules の網羅検査とタスク生成を行うようにした。省略時は従来どおり全件。同じ成果物を複数 track が選択でき、track ごとに独立した task ID を持つ。schedule strategy generate も同じ選択に従い、track-design-guide・schedule-design-guide・sch-rulebook に分担・再修正の意味を記述した。
---

# PJR-S190 strategy の scope を成果物単位にし、1 ドメインを複数トラックで分担・再修正できるようにする

## 1. 概要

sch-strategy の scope はカタログファイル単位（catalogs と include_kinds）しかなく、approach_rules と owner_rules は scope 内の全 work 成果物を網羅する必要がある。このため同じカタログを 2 つ目の track に入れると全成果物のタスクが再生成され、事実上 1 ドメイン 1 トラックの運用になる。track-design-guide はドメインとトラックが 1 対 1 でないことを明記しており、実装後に業務仕様を直す・横断パスで複数ドメインを直すといった現実の修正に合わない。scope に成果物（local_id）単位の選択を追加し、rules の網羅要件を選択した部分集合に限定する。

### 1.1. 制約の発生源

| 場所                                                | 内容                                                                                                                                        |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [[specdojo:track-design-guide]]「ドメインの切り方」 | ドメインとトラックは 1 対 1 にならない。1 つのドメインを複数のトラックが参照してよい、と明記                                                |
| `timeline build` / `tml-index` schema               | 検査は track id の重複と、`domains` に対する `catalog_status` とカタログ存在の整合のみ。同じ domain を複数 track が持つことは禁止していない |
| `sch-strategy` schema の `scope`                    | `catalogs`（ファイル単位）と `include_kinds` のみ。成果物単位の選択がない                                                                   |
| `approach_rules` / `owner_rules`                    | scope 内の全 work 成果物をちょうど 1 回ずつ網羅する要件（schema の description と `schedule build` の `No owner_rule found`）               |

同じカタログを 2 つ目の track の scope に入れると、全成果物の rules を書かされ、全成果物のタスクが再生成される。
重複を避ける手段は `initial_state.completed_deliverables` だけで、結果として 1 カタログを 1 track に抱え込む運用になる。
ガイドの track モデルは「定義する track」と「参照する track」の二分で、別 track が既存成果物を修正するケースを
想定していない。近いのは `cross_deliverable_passes` の `target_local_ids` だけである。

### 1.2. 採用する案（A）

`scope` に成果物単位の選択を追加し、rules の網羅要件を選択した部分集合に対して適用する。

```yaml
scope:
  catalogs:
    - id: prj-0001:dct-data-flow
      path: /docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-flow.yaml
      local_ids: [cdfd-onboarding, cdfd-plan] # 省略時は従来どおり全件
  include_kinds: [work]
```

- `local_ids` を省略した既存 strategy は挙動を変えない。
- 選択した成果物だけが approach_rules / owner_rules の網羅対象とタスク生成の対象になる。
- 同じ成果物を複数 track が選択することを許す。task ID は `T-<TRACK>-<local_id>-<suffix>` で track ごとに分かれるため衝突しない。
- 成果物の完了・レビュー済みの状態は track ごとに持つ。どの track がその成果物を定義した track か（`catalog_status` の所有）の意味を [[specdojo:track-design-guide]] と [[specdojo:schedule-design-guide]] で定義する。
- `schedule strategy generate` も同じ選択に従い、選択外の成果物に rules を生成しない。

不採用の案: 同じ track の追加パスで修正する（B）はドメインの全作業が 1 track に縛られる。`cross_deliverable_passes` の汎用化（C）は成果物ごとの phase を持たせにくい。

## 2. 完了条件

- `sch-strategy.schema.yaml` の `scope.catalogs[]` に任意の `local_ids` があり、指定時はその成果物だけが scope になる。省略時は従来どおり全件。
- `schedule build` と `schedule strategy generate` が、選択した部分集合に対して approach_rules / owner_rules の網羅を検査し、選択外の成果物にタスクや rules を生成しない。存在しない local_id を指定した場合はエラーになる。
- 同じ成果物を 2 つの track が選択した strategy で `schedule build` が成功し、track ごとに独立した task ID が生成される。`exec refresh` と dashboard が両 track の状態を区別して表示する。
- [[specdojo:track-design-guide]] と [[specdojo:schedule-design-guide]]、[[specdojo:sch-rulebook]] に、成果物単位の scope、複数 track での分担・再修正、成果物を定義した track の意味が記述されている。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功し、`local_ids` 指定・省略・不正値の単体テストがある。

## 3. 作業内容

| No  | 作業                                                              | 担当 | 状態 | メモ                                   |
| --- | ----------------------------------------------------------------- | ---- | ---- | -------------------------------------- |
| 1   | schema に `scope.catalogs[].local_ids` を追加する                 | ARC  | done | 省略時は全件                           |
| 2   | `schedule build` の scope 展開と rules の網羅検査を部分集合にする | ARC  | done | 不正な local_id はエラー               |
| 3   | `schedule strategy generate` を同じ選択に従わせる                 | ARC  | done | -                                      |
| 4   | 複数 track で同じ成果物を選択した場合の状態表示を確認する         | ARC  | done | `exec refresh`、dashboard              |
| 5   | ガイドと sch-rulebook に分担・再修正の意味を記述する              | ARC  | done | 定義した track と修正する track の区別 |

## 4. 対応結果

- schema と build / generator に catalog ごとの `local_ids` 選択を追加し、省略時の全件選択との後方互換を維持した。
- 選択部分集合に対する `approach_rules` / `owner_rules` の網羅・重複・範囲外参照と、catalog に存在しない `local_id` を検出するようにした。
- 同じ成果物を複数 track が選択した場合に、track を含む task ID と schedule file によって状態を区別できることを単体テストで確認対象にした。
- [[specdojo:track-design-guide]]、[[specdojo:schedule-design-guide]]、[[specdojo:sch-rulebook]] と CLI リファレンスへ、分担・再修正および定義責任の意味を反映した。
- 残課題: なし。

## 5. 関連ドキュメント

- 設計意図: [[specdojo:track-design-guide]]、[[specdojo:schedule-design-guide]]
- 規範: [[specdojo:sch-rulebook]]
- 制約に当たった事例: [[prj-0001:pjr-6pd7-cdfd-overview]]（data-flow の作り直しで別 track を作れず、同 track の再生成で対応した）
