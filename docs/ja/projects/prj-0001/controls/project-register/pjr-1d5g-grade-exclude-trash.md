---
specdojo:
  id: prj-0001:pjr-1d5g-grade-exclude-trash
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-09-13T21:39:54Z"
  due_on: "2026-09-30"
---

# PJR-1D5G grade の成果物選択から trash 配下の非推奨文書を除外する

## 1. 概要

grade list / grade plan の --target deliverable は成果物カタログの全エントリを対象にするため、deliverable trash で docs/ja/product/trash/ へ退避した非推奨文書も評価対象に含まれる。旧領域別 CDFD 10 件を退避して status を deprecated にした際に content_hash がずれ、rtn-grade-deliverable-recheck が退避済み 11 件を再評価対象に選ぶ。catalog-plan.ts の isTrashedPath と同じ判定で trash 配下を選択から除外し、明示的な --path 指定も拒否する。

### 1.1. 観測

2026-09-13 に旧領域別 CDFD 10 件を `deliverable trash` で退避し、`status: deprecated` にした直後の確認。

```text
$ specdojo grade list --target deliverable | grep -c trash
11
```

`docs/ja/product/trash/` の 11 件（以前から退避されていた `cdfd-register-operation` を含む）が選択される。
`status` の変更で `content_hash` がずれるため、`--changed-only` でも選ばれ、次回の
`rtn-grade-deliverable-recheck`（毎日 6 時、上限 5 件）が退避済み文書を 1 文書約 35 分かけて再評価する。

### 1.2. 原因

`src/grade.ts` の `loadDeliverableCatalog` は成果物カタログの `kind: work` エントリを path の位置にかかわらず
すべて候補にする。`src/catalog-plan.ts` には `isTrashedPath`（path の要素に `trash` を含むか）があり、
data-flow の判定根拠から退避済み文書を除外しているが、grade 側にはこの判定がない。

### 1.3. 対処

- `loadDeliverableCatalog`（または `discoverGradeTargets` の候補生成）で、解決済み path に `trash` 要素を含む
  エントリを除外する。判定は `catalog-plan.ts` の `isTrashedPath` と同じ規則にし、共有できるなら共通化する。
- `--path` で trash 配下を明示指定した場合は、generated と同様に「退避済み文書は評価できない」として拒否する。
- `grade validate --target deliverable` も同じ候補集合を使い、退避済み文書を対象外にする。

## 2. 完了条件

- `grade list --target deliverable` の出力に `docs/**/trash/` 配下のパスが含まれない。`--changed-only` / `--ungraded` を付けても同じ。
- `grade plan --target deliverable --path docs/ja/product/trash/<file>.md` が退避済み文書として拒否される。
- `grade validate --target deliverable` が退避済み文書を検証対象にしない。
- 判定が `catalog-plan.ts` の `isTrashedPath` と同じ規則であることが、共通化またはテストで確認できる。
- 単体テストに、trash 配下のエントリが選択から除外されるケースと、明示指定が拒否されるケースがある。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit` が成功する。

## 3. 作業内容

| No  | 作業                                                     | 担当 | 状態 | メモ                     |
| --- | -------------------------------------------------------- | ---- | ---- | ------------------------ |
| 1   | 成果物の候補生成で trash 配下を除外する                  | ARC  | done | `isTrashedPath` を共通化 |
| 2   | `--path` での明示指定を拒否する                          | ARC  | done | generated と同じ扱い     |
| 3   | 単体テストを追加し、実機で `grade list` の出力を確認する | ARC  | done | trash 0 件               |

## 4. 対応結果

- `isTrashedPath` をカタログパスの共通関数として切り出し、`catalog-plan` と `grade` の候補生成で共有した。
- 成果物カタログの `trash` パスを通常選択、`--changed-only`、`--ungraded`、および `grade validate` と共通の候補集合から除外した。
- `--path` で退避済み文書を明示した場合は `trashed documents cannot be graded` として拒否するようにした。
- パス要素の判定、カタログ候補の除外、各フィルタ、明示指定拒否の単体テストを追加した。
- `grade list --target deliverable --project prj-0001` の実行結果で `trash` 配下が 0 件であることを確認した。残課題はない。

## 5. 関連ドキュメント

- 退避の設計: [[specdojo:command-reference]]（`deliverable trash`）
- 成果物評価の定期実行: [[prj-0001:pjr-08k1-deliverable-grade-done-criteria]]
- 退避を行った項目: [[prj-0001:pjr-6pd7-cdfd-overview]]
