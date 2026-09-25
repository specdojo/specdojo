---
specdojo:
  id: prj-0001:pjr-z47x-grade-changed-only
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: QE
  registered_at: "2026-09-25T12:45:05Z"
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

### 2.3. 実測: 94% の評価結果が最新のカタログを見ていない

| 項目                               | 値                  |
| ---------------------------------- | ------------------- |
| grade 結果の総数                   | 303                 |
| 成果物カタログの最終変更           | 2026-09-23          |
| カタログ変更より前に評価された結果 | 286（94%）          |
| `graded_at` の範囲                 | 2026-09-01 〜 09-24 |

カタログを突き合わせ先とする観点は次の 2 つで、合計 240 件の finding を出している。

| 観点                                | finding | 突き合わせ先                       |
| ----------------------------------- | ------- | ---------------------------------- |
| `vp-arc-cross-document-consistency` | 198     | カタログ、Schedule、RACI、組織定義 |
| `vp-qe-done-criteria`               | 42      | カタログの `done_criteria`         |

これらの finding は、286 件の成果物については**変更前のカタログに対する判定**である。カタログ側の変更で解消した finding も、新たに発生した finding も反映されない。

## 3. 完了条件

- 照合型の観点について、突き合わせ先の変更が再評価の契機になる。
- `changed_only` の意味が文書化され、何を検出し何を検出しないかが読み取れる。
- 全件再評価の経路が運用されている。`rtn-grade-kata` を有効化するか、代替の経路を用意する。
- 再評価の増加によるコストが見積もられている。全件再評価は 303 件を対象とする。
- `--changed-only` の既存の利用者（`rtn-grade-recheck`）の挙動変更が明示されている。

## 4. 対応の候補

| 案  | 内容                                                                 | 影響                                     |
| --- | -------------------------------------------------------------------- | ---------------------------------------- |
| 1   | 観点ごとに突き合わせ先を宣言し、その hash も `content_hash` に含める | 正確。宣言の追加と hash 形式の変更が必要 |
| 2   | 照合型の観点を含む評価は `changed_only` の対象外とし、常に再評価する | 単純。ほぼ全件再評価になりコストが増える |
| 3   | `rtn-grade-kata` を有効化し、週次で全件再評価する                    | 最小変更。日次の鮮度は改善しない         |
| 4   | 突き合わせ先の変更を検出したら該当する評価結果を無効化する           | 契機が明確。無効化の判定ロジックが必要   |

案 3 は即座に効果があり変更が小さい。案 1 は正確だが `grade-result.schema.yaml` の変更を伴う。**まず案 3 で鮮度を確保し、案 1 を別途検討する**のが妥当と考える。

## 5. 作業内容

| No  | 作業                                  | 担当 | 状態 | メモ                      |
| --- | ------------------------------------- | ---- | ---- | ------------------------- |
| 1   | 対応の候補から方針を決定する          | QE   | open | 案 3 を起点に検討         |
| 2   | `changed_only` の検出範囲を文書化する | QE   | open | `grade-guide` を想定      |
| 3   | 全件再評価の経路を運用に乗せる        | OPS  | open | `rtn-grade-kata` の有効化 |
| 4   | 照合型観点の再評価契機を実装する      | DEV  | open | 方針決定後                |

## 6. 対応結果

-

## 7. 関連ドキュメント

- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- `docs/ja/projects/prj-0001/routines/rtn-grade-recheck.yaml`
- `docs/ja/projects/prj-0001/routines/rtn-grade-kata.yaml`
- `docs/specdojo/schemas/v1/grade-result.schema.yaml`
- `src/grade-result.ts`
- `src/grade.ts`
