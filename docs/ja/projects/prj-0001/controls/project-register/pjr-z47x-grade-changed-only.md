---
specdojo:
  id: prj-0001:pjr-z47x-grade-changed-only
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: QE
  registered_at: "2026-09-25T12:45:05Z"
  completed_at: "2026-09-27T15:12:32Z"
  conclusion: 観点に comparison_sources を宣言し、grade result の source_hashes で突き合わせ先の変更を changed_only の契機にした。dependency_changed も依存先の内容の hash で判定する。全件の再評価は定期経路にせず手動で行う
---

# PJR-Z47X grade の changed_only が照合型観点の突き合わせ先の変更を検出しない

## 1. 概要

`grade --changed-only` は、**対象成果物の内容だけ**から計算した `content_hash` で再評価の要否を決める。照合型の観点は他の成果物と突き合わせて判定するため、突き合わせ先が変わっても対象成果物の hash は変わらず、**古い評価結果が残り続ける**。実運用の routine は `changed_only: "true"` で動くため、この経路が既定である。

## 2. 事実

### 2.1. hash は対象成果物の内容のみから計算する

```typescript
// src/grade-result.ts
export function gradeContentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}
```

```typescript
// src/grade.ts
return !opts.changedOnly || result?.content_hash !== gradeContentHash(content);
```

突き合わせ先の成果物は hash の入力に含まれない。

### 2.2. 既定の routine は changed_only で動く

`rtn-grade-recheck`（毎日 6 時、`enabled: true`）は `changed_only: "true"` を渡す。全件再評価を行う `rtn-grade-kata` は `enabled: false` である。**現在、全件再評価は動いていない。**

### 2.3. 実測: カタログに依存する finding は 53 件

| 項目                               | 値                  |
| ---------------------------------- | ------------------- |
| grade 結果の総数                   | 303                 |
| 成果物カタログの最終変更           | 2026-09-23          |
| カタログ変更より前に評価された結果 | 286（94%）          |
| `graded_at` の範囲                 | 2026-09-01 〜 09-24 |

カタログに依存する finding を数えた。

| 内訳                                               | 件数   |
| -------------------------------------------------- | ------ |
| `vp-qe-done-criteria`（定義上カタログ依存）        | 42     |
| `vp-arc-cross-document-consistency` のカタログ言及 | 11     |
| 合計                                               | **53** |

当初は「カタログを突き合わせ先とする観点の finding 総数」240 件と見積もったが、これは過大だった。`vp-arc-cross-document-consistency` は 6 つの突き合わせ先を宣言しながら、198 件の finding のうち 45 件しかそれらに言及していない。**宣言と実際の判定が乖離しているため、宣言から影響範囲を数えられない。** 乖離そのものは [[prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance]] で扱う。

### 2.4. 対象範囲が縮めば問題も縮む

grade 対象 303 件のうち 260 件は kata である。`vp-arc-cross-document-consistency` を成果物のみへ絞ると、カタログと結合する対象は 43 件になる。**本項目の対象範囲は先行して縮む可能性がある。**

## 3. 完了条件

- 照合型の観点について、突き合わせ先の変更が再評価の契機になる。
- `changed_only` の意味が文書化され、何を検出し何を検出しないかが読み取れる。
- 全件再評価の経路が運用されている。`rtn-grade-kata` を有効化するか、代替の経路を用意する。
- 再評価の増加によるコストが見積もられている。全件再評価は 303 件を対象とし、鮮度改善の対象は 53 件である。
- `--changed-only` の既存の利用者（`rtn-grade-recheck`）の挙動変更が明示されている。

## 4. 対応の候補

| 案  | 内容                                                                 | 影響                                     |
| --- | -------------------------------------------------------------------- | ---------------------------------------- |
| 1   | 観点ごとに突き合わせ先を宣言し、その hash も `content_hash` に含める | 正確。宣言の追加と hash 形式の変更が必要 |
| 2   | 照合型の観点を含む評価は `changed_only` の対象外とし、常に再評価する | 単純。ほぼ全件再評価になりコストが増える |
| 3   | `rtn-grade-kata` を有効化し、週次で全件再評価する                    | 最小変更。日次の鮮度は改善しない         |
| 4   | 突き合わせ先の変更を検出したら該当する評価結果を無効化する           | 契機が明確。無効化の判定ロジックが必要   |

**案 1 を主案とする。** 案 3 は 303 件の再評価コストに対して 53 件の鮮度改善にとどまり、費用対効果が合わない。案 1 は突き合わせ先を宣言するため、[[prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance]] の案 3（突き合わせ先の構造化）と同じ宣言を共有できる。

着手順序は [[prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance]] を先とする。対象範囲が縮んでから本項目の方針を確定する。

### 4.1. 方針の決定（2026-09-27）

利用者の承認により、案 1 を採る。観点ごとに突き合わせ先を宣言し、その `content_hash` も再評価の要否の判定に含める。前提としていた PJR-EBTZ は完了している。

あわせて、PJR-N03W で追加した `--dependency-changed` を、依存先の評価日時（`graded_at`）ではなく依存先の `content_hash` の変化で判定するように改める。同じ仕組みで解決できるためである（PJR-N03W と PJR-2F3Y の個票に記録した問題）。

着手は PJR-WPWB の後とする。どちらも `src/grade.ts` と `pm-review-viewpoints.yaml` を変更するためである。

## 5. 作業内容

| No  | 作業                                  | 担当 | 状態 | メモ                       |
| --- | ------------------------------------- | ---- | ---- | -------------------------- |
| 1   | 対応の候補から方針を決定する          | QE   | done | 案 1（2026-09-27 決定）    |
| 2   | `changed_only` の検出範囲を文書化する | QE   | done | `command-reference` ほか   |
| 3   | 全件再評価の経路を運用に乗せる        | OPS  | open | 手動経路を文書化。承認待ち |
| 4   | 照合型観点の再評価契機を実装する      | DEV  | done | `source_hashes` を記録     |

## 6. 対応結果

- 観点定義に `comparison_sources` を追加した（`pm-review-viewpoints.schema.yaml`）。値は `catalog-entry`、`dependencies`、`schedule`、`members`、`roles`、`deliverable:<local_id>` である。
- 共通観点に突き合わせ先を宣言した。`vp-arc-cross-document-consistency` は `check` が挙げる 6 つの突き合わせ先に対応させ、自身のカタログ項目、依存先、Schedule、メンバー定義、ロール定義、`pm-raci`、`pm-organization` を宣言した。`vp-qe-done-criteria` は自身のカタログ項目を宣言した。生成物は生成元の変更として検出する。
- `grade apply` は、評価時点の突き合わせ先と成果物の依存先の SHA-256 を grade result の `source_hashes` へ記録する（`grade-result.schema.yaml` に追加）。カタログ項目は対象文書自身の項目だけを hash するため、他の成果物の項目を変更しても選ばれない。
- `grade list --changed-only` は、本文の hash が一致しても、適用される観点の突き合わせ先の hash が記録と異なる文書を選ぶ。`source_hashes` を持たない既存の結果は一度だけ変更扱いになる。
- 個票の方針の決定に従い、`--dependency-changed` を依存先の `graded_at` ではなく、依存先の内容の hash（`source_hashes` の `dependency:<local_id>`）で判定するように改めた。依存先を再評価しただけでは選ばない。
- `changed_only` の検出範囲と検出しない変更（宣言外の文書、観点定義・ルーブリックの変更、生成物）を `command-reference.md` に、grade の鮮度判断を `review-guide.md` に、routine への影響とコストを `routine-operation-guide.md` に記載した。

### 6.1. 既存の利用者の挙動変更

| 利用者                          | 変更                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `rtn-grade-deliverable-recheck` | `changed_only` が突き合わせ先の変更を検出する。`dependency_changed` は依存先の内容の変更だけを検出する |
| `rtn-grade-recheck`（kata）     | 変更なし。kata に適用される継続評価の観点は突き合わせ先を宣言していない                                |
| `grade apply`                   | サイドカーに `source_hashes` を追加で書く。既存のキーは変えない                                        |

両 routine の `changed_only` 入力にコメントで挙動変更を記載した。

### 6.2. コストの見積もり

2026-09-27 時点で `grade list --project prj-0001` を実行した結果である。

| 選択条件                           | 成果物 | kata |
| ---------------------------------- | ------ | ---- |
| 全件（選択条件なし）               | 46     | 262  |
| `--changed-only`（導入直後）       | 46     | 0    |
| `--dependency-changed`（導入直後） | 34     | -    |

導入直後は `source_hashes` を持たない結果がすべて変更扱いになる。`rtn-grade-deliverable-recheck` の上限 10 件で約 5 日かけて記録が揃い、以後は突き合わせ先を変更した日だけ該当する成果物が選ばれる。案 3 の週次全件再評価（308 文書）に比べ、定常時の再評価は突き合わせ先の変更に比例する。鮮度改善の対象として見積もった 53 件の finding はすべて成果物に属し、導入直後の一巡で再評価される。

### 6.3. 残課題

- 全件再評価の定期経路は設けていない。`rtn-grade-kata` は `enabled: false` のままとし、`changed_only` が検出しない変更（観点定義・ルーブリックの変更）は `tools/grade/run-per-document.sh` の手動実行で反映すると `routine-operation-guide.md` に記載した。_ASSUMPTION_: 案 1 の実装で突き合わせ先の陳腐化は定期経路で解消するため、定期の全件再評価は不要と判断した。完了条件の「全件再評価の経路が運用されている」をこの手動経路で満たすかは、OPS と PO の判断を要する（作業 3 を open のまま残した）。
- `--rulebook-changed` は引き続き rulebook の `graded_at` で判定している。本項目の範囲外である。

## 7. 関連ドキュメント

- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- [[prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance]]
- `docs/ja/projects/prj-0001/routines/rtn-grade-recheck.yaml`
- `docs/ja/projects/prj-0001/routines/rtn-grade-kata.yaml`
- `docs/specdojo/schemas/v1/grade-result.schema.yaml`
- `src/grade-result.ts`
- `src/grade.ts`
