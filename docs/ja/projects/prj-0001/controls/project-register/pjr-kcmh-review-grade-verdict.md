---
specdojo:
  id: prj-0001:pjr-kcmh-review-grade-verdict
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-23T05:17:28Z"
  due_on: "2026-11-07"
---

# PJR-KCMH review フェーズで grade を実行し結果を plan へ提示する

## 1. 概要

[[prj-0001:pjr-2zvs-grade-review-integration]] の決定のうち review 経路を実装する。review フェーズの前段で runner が対象文書へ grade を実行し、その結果を review plan へ提示する。`content_hash` が既存 sidecar と一致する場合は再実行しない。

### 1.1. 写像と合成を範囲から外した

当初は「grade の level を `review_verdict` へ写像して verdict の初期値とし、`human` 観点の判定と合成する」も含めていたが、2026-09-24 の見直しで外した。

合成規則が未定義であり、素朴な集約（最小 level）では実データの 77% が `changes_requested` になって初期値として機能しない。写像で繋ぐのではなく語彙そのものを統一する方針へ変え、[[prj-0001:pjr-xtan-unify-verdict-vocabulary]] として切り出した。語彙が同じになれば写像は不要になる。

本項目は **review 前段での grade 実行と、判定主体の分担の明記**だけを扱う。

### 1.2. 最終結論との関係（2026-09-26）

[[prj-0001:pjr-2zvs-grade-review-integration]] の最終結論「review の時点で grade が最新でなければ実行し、最新ならそのまま使う」を runner 側で実装するのが本項目である。一時は [[prj-0001:pjr-n22n-xrp-xrr-review]] と重なるとして close を検討したが、扱う範囲が違うため残す。

| 項目     | 範囲                                                                      |
| -------- | ------------------------------------------------------------------------- |
| 本項目   | runner の処理。review の前に grade を実行・再利用し、結果を plan に載せる |
| PJR-N22N | テンプレートの文面。`xrp` / `xrr` を「review は評価しない」前提へ改める   |

以前は `cdfd-check` の「review から独立して」と矛盾するとしていたが、[[prj-0001:pjr-xzeq-cdfd-overview-cdfd-check-cdfd-action-grade-review]] で「editor から独立」へ改めたため、矛盾は解消した。

テンプレートへ「再評価しない」旨を書く作業は N22N の範囲なので、本項目の完了条件から外した。

## 2. 完了条件

- review フェーズの前段で runner が対象文書へ grade を実行する。executor には実行させない。
- 対象文書の `content_hash` が既存 sidecar と一致する場合は grade を再実行せず、既存の結果を使う。
- review plan に、対象文書の grade 結果（verdict と findings）が提示される。レビュアが判断材料として使える。
- grade 結果の提示は「確定済みの事実」の向きで行う。review が観点を再評価したり、再指摘を促したりする書き方にしない。
- 提示の対象は grade が判定した全観点とする。観点の区分（`evaluation`）で提示を絞らない。
- 対象文書の `content_hash` と grade 結果が一致しない場合、その旨が plan に示される。
- grade 実行のスキップ判定と plan への提示を検証する単体テストがある。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                            |
| --- | ---------------------------------------------------- | ---- | ---- | ------------------------------- |
| 1   | review フェーズ前段の grade 実行を runner へ組み込む | DEV  | open | `content_hash` 一致時はスキップ |
| 2   | grade 結果を review plan へ提示する                  | DEV  | open | 「確認対象外」の向きで示す      |
| 3   | `xrp-*` テンプレートへ判定主体の分担を明記する       | DEV  | open | 9 種すべて                      |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-xtan-unify-verdict-vocabulary]]
- [[prj-0001:pjr-n03w-grade-role-and-triggers]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `src/review-plan.ts`
