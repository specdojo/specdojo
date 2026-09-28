---
specdojo:
  id: prj-0001:pjr-kcmh-review-grade-verdict
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-23T05:17:28Z"
  due_on: "2026-11-07"
  completed_at: "2026-09-28T09:47:57Z"
  conclusion: review の前に runner が grade の鮮度を確認し、content_hash が一致すれば既存の結果を使い、plan の評価結果章へ確定済みの事実として提示する。review-guide を観点別評価しない形に改めた。試行で plan と判断は意図どおりと確認し、result の記入経路は PJR-E2Q3 へ引き継ぐ。N03W の経過措置は理由を記録して残す
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
- review を agent で 1 件実行し、生成される plan と result が、PJR-N22N で改訂したテンプレート（grade の結果を入力に、タスクの完了可否を判断する）と本項目の提示どおりであることを確認している（PJR-N22N の作業 No.6 を引き継ぐ）。
- `docs/ja/specdojo/guides/review-guide.md` が、review は観点ごとに評価せず、grade の結果を確定済みの事実として受け取ってタスクの完了可否を判断する形に改められている。旧来の観点別判定の説明が残っていない（PJR-N22N の残課題を引き継ぐ）。
- review 完了後に、PJR-N03W で経過措置として残した `changed_only`・`ungraded`・`incomplete` の 3 入力を外せるか判断し、外す場合は Job 定義と routine から外している。外さない場合は理由を対応結果に記録する。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                            |
| --- | --------------------------------------------------------- | ---- | ---- | ------------------------------- |
| 1   | review フェーズ前段の grade 実行を runner へ組み込む      | DEV  | done | `content_hash` 一致時はスキップ |
| 2   | grade 結果を review plan へ提示する                       | DEV  | done | 「確認対象外」の向きで示す      |
| 3   | `xrp-*` テンプレートへ判定主体の分担を明記する            | DEV  | done | 9 種すべて                      |
| 4   | `review-guide.md` を review が評価しない形に改める        | DEV  | done | PJR-N22N の残課題               |
| 5   | review を agent で 1 件実行して plan と result を確認する | DEV  | open | PJR-N22N の作業 No.6            |
| 6   | 経過措置の 3 入力を外せるか判断する                       | DEV  | open | No.5 の結果を待つ               |

## 4. 対応結果

- runner の処理として `src/review-grade.ts` を追加した。評価対象の `content_hash` と評価結果サイドカーの `content_hash` を比べて鮮度を判定し、最新なら grade を再実行しない。最新でない・サイドカーがない・読み取れない場合は `tools/grade/run-per-document.sh` を評価対象 1 件に絞って実行する。評価対象を解決できない場合、スクリプトがないリポジトリ、dry-run では実行しない。grade が失敗しても review は止めず、結果を plan に示す。
- `src/exec-run.ts` の `prepareSingleTask` と in-place 実行で、`mode: review` のタスクの plan を生成する前に上記を呼ぶ。executor には grade を実行させない。評価対象は `src/exec-plans.ts` の `reviewGradeSubject` で、review plan の「評価結果」章と同じ規則（maintenance 系は実践の型、それ以外は成果物）で決める。
- review plan の「評価結果」章へ `_GRADE_SUMMARY_` を追加し、`xrp-*` 9 種すべてに置いた。runner の grade 実行結果、鮮度、`verdict`・`score`・`graded_at`・finding 件数、grade が判定した全観点の level と score、finding を提示する。観点は `evaluation` で絞らない。冒頭で「grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない」と示す。`content_hash` が一致しない場合は、提示する評価結果が変更前の内容に対するものであることを明示する。`exec plan` は grade を実行せず、その時点の評価結果を提示する。
- 作業 No.3（判定主体の分担の明記）は、PJR-N22N で改訂した `xrp-*` の「review は成果物を再評価しない」記述で満たされているため、本項目では提示の文面を追加するだけとした。
- `tests/src/review-grade.test.ts` で、スキップ判定（一致・不一致・サイドカーなし・読み取り不能・対象解決不能・dry-run・スクリプト不在）、grade の起動引数、plan への提示（全観点、事実としての向き、不一致の明示）を検証する。`tests/src/exec-plans.test.ts` で `xrp-*` 9 種が `_GRADE_SUMMARY_` を持つことを検証する。
- `docs/ja/specdojo/guides/review-guide.md` を、review は観点ごとに評価せず、grade の結果を確定済みの事実として受け取ってタスクの完了可否を判断する形に改めた。`RVP-NNN`、`pass` / `fail` / `unclear`、`approve` / `revise` / `reject` による旧来の観点別判定の説明を除き、review 前段の grade、plan の「評価結果」章、review result の章立てと 6 値の verdict を記述した。
- _TODO_: review を agent で 1 件実行し、生成される plan と result を確認する作業（No.5）は未実施である。executor の sandbox では agent を起動できないため、runner または人が実施する。
- _TODO_: 経過措置の `changed_only`・`ungraded`・`incomplete` の 3 入力（No.6）は、現時点では外さない。runner の grade は review タスクがある文書を review の時点でしか評価せず、review 経路を持たない文書の内容変化と未評価文書は引き続き定期実行で拾う必要がある。No.5 で実際の review を確認した後に改めて判断する。
- _ASSUMPTION_: runner が grade で更新した評価結果サイドカーは、実行したリポジトリ（main 側）に書かれる。review を行う worktree へ反映されるかは未確認であり、plan 本文に評価結果を載せることで review の判断材料は確保している。

### review の試行（2026-09-28、orchestrator）

executor の sandbox で未実施だった作業 No.5 を、orchestrator が `stsd-register-entry`（rubric v2 で 2026-09-28 に評価済み、69 点、needs-work）で行った。

| 確認項目                                                                  | 結果                                                                                                                                         |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| plan に grade の結果が確定済みの事実として示される                        | 確認できた。鮮度は最新（`content_hash` が一致）、verdict・score・finding の内訳が示された                                                    |
| `content_hash` が一致すれば grade を再実行しない                          | 確認できた。plan 生成時に既存の評価結果を使った                                                                                              |
| review が観点を再評価せず、finding を事実としてタスクの完了可否を判断する | 確認できた。agent は finding（F001〜F018）を参照して verdict `incomplete` を選び、改善手順を示した                                           |
| result が新しい書式で記入される                                           | 確認できなかった。`exec run --plan` では reporter 付きの構成を使えず、`--by` の executor は result を書かない設計だった。PJR-E2Q3 へ引き継ぐ |

試行の plan と result（`stsd-register-entry-20260928T093919Z-6fd7`）は、試行の記録として残す。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-xtan-unify-verdict-vocabulary]]
- [[prj-0001:pjr-n03w-grade-role-and-triggers]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `src/review-plan.ts`
