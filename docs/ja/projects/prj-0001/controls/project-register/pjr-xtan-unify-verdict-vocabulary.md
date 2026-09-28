---
specdojo:
  id: prj-0001:pjr-xtan-unify-verdict-vocabulary
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-09-24T14:01:35Z"
  due_on: "2026-10-31"
---

# PJR-XTAN 判定語彙を判定対象ごとに整理し 同じ対象の語彙だけを統一する

## 1. 概要

判定に使う語彙が 4 種類ある。当初は [[prj-0001:pjr-2zvs-grade-review-integration]] の決定 3.3 に従い、すべてを `verdict_definitions` へ統一する予定だった。しかし同項目の最終結論で、**grade と review は違う対象を判定する**ことが分かった。違う対象を同じ語彙にすると、かえって混同を招く。4 語彙を判定の対象で分け、**同じ対象を判定している語彙だけを統一する**。

## 2. 事実

### 2.1. 4 語彙の判定対象

| 使用箇所                                             | 語彙                                                          | 判定対象                       |
| ---------------------------------------------------- | ------------------------------------------------------------- | ------------------------------ |
| `pm-review-viewpoints.yaml` の `verdict_definitions` | `pass` / `conditional_pass` / `changes_requested` / `blocked` | **タスクの完了可否**（review） |
| `xrr-template.md` の `decision.recommendation`       | `approve` / `revise` / `reject`                               | **タスクの完了可否**（review） |
| grade の文書 verdict                                 | `pass` / `needs-work` / `fail`                                | **成果物の品質**（grade）      |
| `xrr-viewpoint-detail-template.md` の `result`       | `pass` / `fail` / `unclear`                                   | review 内での観点ごとの評価    |

**同じ対象（タスクの完了可否）を 2 つの語彙で表しているのは上の 2 行だけである。** `revise` が `conditional_pass` と `changes_requested` のどちらに当たるか、定めがない。

### 2.2. 観点ごとの評価は役割を失う

[[prj-0001:pjr-n22n-xrp-xrr-review]] で review は観点ごとに評価しなくなる。`xrr-viewpoint-detail-template.md` の `result` は、テンプレート自体を残すかどうかと合わせて決まる。**本項目で語彙を揃えても、N22N で削除されれば無駄になる。**

### 2.3. grade と review の対応はすでに写像がある

`review-guide.md` は grade の level から review の verdict への対応を定めている。

```text
level 4 → pass、level 3 → conditional_pass、level 0-2 → changes_requested
```

違う対象を同じ語彙にするのではなく、**この写像を「grade の結果を review の入力にする規則」として保つ**のが、判定対象を分けた結論に沿う。

## 3. 判断が必要な点

| 案  | 内容                                                             | 評価                                           |
| --- | ---------------------------------------------------------------- | ---------------------------------------------- |
| A   | 当初の案。4 語彙すべてを `verdict_definitions` へ統一する        | 違う対象を同じ語彙にする。移行は 260 件        |
| B   | review 側の 2 語彙だけを統一する。grade の語彙は残し、写像を保つ | 判定対象の区別と合う。grade の結果は移行しない |
| C   | 何もしない                                                       | `revise` の曖昧さが残る                        |

**B を推す。** 同じ対象の二重表現だけが本当の問題であり、B はそれだけを解消する。grade の結果 260 件の移行も要らなくなる。

### 3.1. 方針の決定（2026-09-27）

利用者の承認により、案 B を採る。review 側でタスクの完了可否を表す 2 つの語彙（`verdict_definitions` と `xrr-template.md` の `decision.recommendation`）だけを統一し、grade の語彙と、grade の level から review の verdict への写像は残す。grade の結果は移行しない。

着手は PJR-N22N の後とする。N22N で `xrr-*` を改訂し、`*-viewpoint-detail-*` の要否も決まるためである。PJR-WPWB と同じ版にまとめる必要はない。

## 4. 完了条件

- 案 A・B・C のどれを採るか決まり、理由が記録されている。
- B の場合、`decision.recommendation` が `verdict_definitions` の値を使っている。`revise` の対応先が決まっている。
- B の場合、grade の語彙と level からの写像が維持され、写像が「review の入力規則」であることがガイドから読み取れる。
- `xrr-viewpoint-detail-template.md` の扱いを [[prj-0001:pjr-n22n-xrp-xrr-review]] と揃えている。
- 旧値を読み込んだ場合、新しい値を示すエラーで失敗する。
- `npm run check` が通過している。

## 5. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ                                                                         |
| --- | ----------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------------- |
| 1   | 案 A・B・C から方針を決める                           | ARC  | done | 方針の決定（2026-09-27）で案 B に決定済み                                    |
| 2   | `decision.recommendation` を `verdict_definitions` へ | DEV  | done | N22N 後の 6 値 `verdict` を正とし、`verdict_definitions` を同じ 6 値へ揃えた |
| 3   | 写像を review の入力規則としてガイドへ記載する        | DEV  | done | `review-guide.md` に `grade の結果を review の入力にする規則` を追加した     |
| 4   | `xrr-viewpoint-detail` の扱いを N22N と揃える         | QE   | done | N22N で削除済み。語彙の統一対象から外した                                    |

## 6. 対応結果

- 方針: 方針の決定（2026-09-27）のとおり案 B を採った。review 側でタスクの完了可否を表す語彙だけを統一し、grade の語彙（`pass` / `needs-work` / `fail`）と level からの写像は残した。grade の結果は移行していない。
- 前提の変化: 着手時点で [[prj-0001:pjr-n22n-xrp-xrr-review]] は完了しており、`xrr-template.md` の `decision.recommendation`（`approve` / `revise` / `reject`）はすでに `verdict`（`complete` / `complete-with-findings` / `incomplete` / `grade-stale` / `grade-unavailable` / `changed-during-review`）へ置き換わっていた。残る二重表現は `verdict_definitions`（`pass` / `conditional_pass` / `changes_requested` / `blocked`）と review result の `verdict` だった。受入観点 6 区分と一対一に対応する `verdict` を正とし、`verdict_definitions` を同じ 6 値へ改めた。
- 語彙の正本: 6 値を `src/review-types.ts` の `REVIEW_VERDICTS` に移し、reporter（`src/exec-reporter.ts`）と観点定義の読み込み（`src/review-plan.ts`）が同じ定数を使う。`pm-review-viewpoints.schema.yaml` の `VerdictDefinition` の enum も同じ 6 値にした。
- `revise` の対応先: `incomplete` とした。旧値の移行先は `pass` → `complete`、`conditional_pass` → `complete-with-findings`、`changes_requested` → `incomplete`、`blocked` → `grade-stale` / `grade-unavailable` / `changed-during-review`、`approve` → `complete` または `complete-with-findings`、`reject` → `incomplete` である。
- 写像: `grade_rubric` の `review_verdict` は level 4 → `complete`、level 3 → `complete-with-findings`、level 0-2 → `incomplete` とした。3 帯の区切りは変えず、写像先の値だけを統一後の語彙へ付け替えた。写像先は level から決まる 3 値に限り、鮮度・評価不能・review 中の変更は含めない。rubric の id（`grade-rubric-v2`）と score・verdict の計算は変えていないため、既存の grade result は再評価の対象にならない。
- ガイド: `review-guide.md` に `grade の結果を review の入力にする規則` を追加した。判定対象ごとの語彙の表、写像を review の判断の起点として使う規則、起点と異なる verdict を選ぶ場合の記録、旧値の移行先を記載した。
- 旧値の拒否: 観点定義の `verdict_definitions` と `grade_rubric` の `review_verdict` に旧値があると、移行先を示すエラーで読み込みに失敗する。reporter の出力に `recommendation` や旧値の `verdict` があると、スキーマ検証より先に移行先を示すエラーで失敗する。
- `xrr-viewpoint-detail-template.md`: N22N で削除済みであり、観点ごとの `result`（`pass` / `fail` / `unclear`）は語彙として残っていない。本項目では扱わない。
- 成果物カタログ: 未作成の `br-review-verdict` の概要が旧値を挙げていたため、新しい 6 値へ改めた。
- `npm run check` の通過: typecheck・単体テスト・統合テスト・schema 検証は親 runner が実行する。

## 7. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-n22n-xrp-xrr-review]]
- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/ja/specdojo/exec-templates/xrr-template.md`
- `docs/ja/specdojo/guides/review-guide.md`
