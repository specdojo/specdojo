---
specdojo:
  id: prj-0001:pjr-f4tg-kata-agent-review-stages
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T23:01:49Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-24T13:29:23Z"
  conclusion: 5 段のレビューの組み方を kata-guide と strategy に定め、3 つの型で目合わせした。利用者は全段の差分を採用し、見落としと誤りはなかった。報告の表の形と全件への展開は epic の子の項目で行う
  derived_from:
    - PJR-TQZA
  depends_on:
    - PJR-TQZA
  commit_type: feat
  commit_scope: kata
---

# PJR-F4TG kata の agent のレビューの段を組み、2〜3 の型で人のレビューと目合わせする

## 1. 概要

PJR-TQZA で決めた流れで、文章のチェック項目・kata 専用の観点・別のモデルの組み方・人への報告の形を作り、2〜3 の型で利用者のレビューと比べて直す

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- sample の横串の確認（段 2）のやり方として使う
- 目合わせの型は prj-overview・opr・stsd の sample（利用者の決定、2026-11-24）

## 3. 完了条件

- PJR-TQZAで決めた流れを、kata のレビューの段として組む。案 A の場合は、R1 目的の過不足・R2 構成・R3 読みやすさ・R4 正しさ・R5 整合の 5 段とし、段ごとに渡す材料と出すものを決める。
- 文章のチェック項目（一文一義、主語の明示、用語の統一、文の長さ、表と箇条書きの使い分けなど）を作る。既存の記述の標準（`docs/ja/specdojo/standards/` の文章の規約）と重ねず、足りない点だけを足す。置き場所と理由を個票の対応結果に書く。
- grade の観点から kata に合うものを選び、kata 専用の観点の組を決める（`pm-review-viewpoints.yaml` の `kata` の扱い）。外した観点と理由を書く。
- R4 では、書いてある事実を正本（schema・src・コマンドリファレンス）と突き合わせ、主張ごとの確かめ結果を根拠とともに表にする。R5 では、同じ系列の sample・参照先・用語集を読む範囲に入れる。
- 書き手と別のモデルにレビューさせる組み方（例: claude が書いたものは codex の sol、codex が書いたものは claude）を決める。
- 人への報告の形（段の順の指摘、直した案の差分、agent が迷った点の印）を決め、1 つの型で見本を作る。
- 2〜3 の型で、利用者のレビューの指摘と agent の指摘を比べ、見落としと誤りを個票の対応結果に表で書く。見落としはチェック項目か段の指示に足す。比べる型は利用者と決める。
- 組み方は、できるだけ schedule の strategy・job・grade の観点の設定で行い、runner のコードを変える必要が出た場合は別に起票する。保護された設定（`.specdojo/` など）に触れる場合は、案を個票の対応結果に書き、反映は利用者の承認のもとで行う。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通す。

## 4. 作業内容

| No  | 作業                                                                                  | 担当 | 状態 | メモ                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 5 段（R1〜R5）の確かめること・渡す材料・出すものを決め、kata-guide に書く             | BA   | done | `段と渡す材料` の表。R4 の確かめの表の列、R5 の読む範囲を含む                                                                                                                 |
| 2   | 文章のチェック項目（W1〜W10）を、既存の規約と重ねずに作る                             | BA   | done | 置き場所と理由は対応結果の `文章のチェック項目の置き場所`                                                                                                                     |
| 3   | kata 専用の観点の組を決め、外した観点と理由を書く                                     | BA   | done | kata-guide の `kata の観点の組`。grade の採点への反映は案として対応結果に書いた（未反映）                                                                                     |
| 4   | 書き手と別のモデルの組み方を決める                                                    | BA   | done | kata-guide の `書き手と別のモデルの組み方`。3 つの型は claude が書いたため codex の `sol-executor` にした                                                                     |
| 5   | 人への報告の形を決める                                                                | BA   | done | kata-guide の `人への報告の形`（指摘の表・`要判断` の印・段ごとの commit を差分にする）                                                                                       |
| 6   | 段を schedule の strategy で組む（prj-overview・opr・stsd の sample）                 | BA   | done | `sch-strategy-kata-review-calibration.yaml`。`schedule build --dry-run` で 3 型 × 5 段の 15 タスクが順につながることを確かめた。track は未作成                                |
| 7   | 1 つの型（prj-overview-sample）で報告の見本を作る                                     | BA   | done | 2026-11-24 に sol-executor の段で 3 つの型 × 5 段を実行した。指摘の表が result で表にならず重なる問題があり、オーケストレーターが一覧に集めた。直しは epic の子の todo で行う |
| 8   | 3 つの型で利用者のレビューと agent の指摘を比べ、見落としと誤りを表に書き、項目に足す | BA   | done | 利用者（indie）が 3 つの sample の段ごとの差分を確かめ、すべて採用した（2026-11-24）。見落としと誤りの指摘はなかった。本質的な直しは利用者が 1 文書ずつ見て指示する           |

## 5. 対応結果

### 5.1. 実施内容

- [[specdojo:kata-guide|実践の型活用ガイド]] に章 `kata を agent でレビューする` を足し、段と渡す材料、文章のチェック項目、kata の観点の組、書き手と別のモデルの組み方、人への報告の形を書いた。`進め方（approach）との参照分担` の表に行を足した。
- 段の組み方は runner のコードを変えず、strategy（`docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-calibration.yaml`）の phase と `description` と `agent` で組んだ。各段は `mode: edit`・`approach: sample-maintenance` とし、sample だけを直す。段ごとの commit が人の採否の対象の差分になる。
  - review の段（`mode: review`）を使わない理由: review の plan は「確認に用いてよい文書は、宣言された文書だけ」とし、R4 の正本（schema・`src/`・コマンドリファレンス）と R5 の同じ系列の文書・用語集を読ませられない。sample-maintenance の edit plan には読む範囲の制限がなく、phase の `description` が「このフェーズで行うこと」に入る。
  - sample-maintenance の plan には全観点の grade の finding が展開される。各段の `description` で、その段の観点に当たる finding だけを扱うよう指示した。
- strategy は `npm run validate:schema:file`（sch-strategy の schema）で valid、`specdojo schedule build --track kata-review-calibration --dry-run` で 3 型 × 5 段が 110→120→130→140→150 の順につながることを確かめた。

### 5.2. 文章のチェック項目の置き場所

- 置き場所: [[specdojo:kata-guide|実践の型活用ガイド]] の `文章のチェック項目`。
- 理由: 段の内容・観点・報告の形と同じ章に置くと、各段の plan が 1 つの章を読めば済む。kata-guide の対象読者は kata を作成・更新・レビューする人と agent であり、段のレビューの読み手と合う。
- 既存の規約と重ねなかった点: 一文一主張・段落と箇条書きの論点の数・表と本文の分担は [[specdojo:specdojo-philosophy|SpecDojo の考え方]] の `簡潔さと文章量を責務に合わせる`、ファイル内の用語の統一は [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、曖昧語と表の前の 1 文は [[specdojo:sample-authoring-standard|Sample 記述標準]] を正本として参照だけにした。足したのは、主語の明示・主語と述語の対応・文の長さの目安・指示語・修飾の係り・否定と受け身・範囲の言い切り・用語集との表記・表と箇条書きと番号の使い分けの基準・文体の統一の 10 項目である。
- `docs/ja/specdojo/standards/` には文章の書き方そのものの標準がなく、新しい standard を起こすほどの量ではないため、standard は作らなかった。

### 5.3. kata 専用の観点の組と grade への反映の案

- 段のレビューで使う観点（15）と外す観点（9）と理由は、kata-guide の `kata の観点の組` に書いた。外したのは `vp-po-decision-readiness`・`vp-ops-release-readiness`・`vp-pm-plan-feasibility`・`vp-pm-dependency-risk`・`vp-pm-control-reporting`・`vp-ba-business-value`・`vp-ba-requirements-completeness`・`vp-ba-stakeholder-clarity`・`vp-ops-operability` である。
- grade の kata の採点（今は 24 観点）を同じ組に絞る変更は、この個票では反映していない。全ての kata の score の母集団が変わり、進行中の波の grade と比べられなくなるためである。反映する場合の案は次のとおり。利用者の承認のもとで別に起票して行う。
  - [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の外す 9 観点に `grade_targets: [deliverable]` を付ける（`.specdojo/` の保護された設定ではない）。
  - `grade_rubric.id` を `grade-rubric-v3` に改め、`grade list --rubric-outdated` で kata を少しずつ評価し直す。
  - kata の `weights` のうち `planning`・`business` は適用される観点がなくなり、加重平均から外れる。重みを配り直すかを同じ起票で決める。
  - `tests/fixtures/yaml-pages/specdojo--pm-review-viewpoints.md.snap` など観点一覧のスナップショットを更新する。

### 5.4. 書き手と別のモデルの組み方と目合わせの進め方

- 3 つの型の書き手: prj-overview-sample は wave-6-project、opr-sample は wave-5、stsd-sample は wave-6-notation の strategy で、sample-maintenance が `opus-executor`、condense が `sonnet-executor` である。いずれも claude のため、段の executor を codex の `sol-executor`、reporter を `sonnet-reporter` にした。
- 目合わせの次の手順（オーケストレーターと利用者が行う）:
  1. `specdojo schedule build --project prj-0001 --track kata-review-calibration` で track を作り、15 タスクを流す。track を作ると `exec run --auto` の選択に入るため、executor では作っていない。
  2. prj-overview-sample の R1〜R5 の result を報告の見本として確かめる（作業内容 No 7）。
  3. 利用者が同じ版の 3 つの sample をレビューし、agent の指摘と比べて次の表を埋める。見落としは `文章のチェック項目` か段の `description` に足す（作業内容 No 8）。

比べた結果の表は、段の実行と利用者のレビューの後に次の列で書く。

| 型  | 利用者の指摘 | agent の指摘（段・No） | 区分（一致・見落とし・誤り） | 足した先 |
| --- | ------------ | ---------------------- | ---------------------------- | -------- |
| -   | -            | -                      | -                            | -        |

### 5.5. CHANGELOG に書く事項

| 区分  | 行の文案                                                                                                                                                                                                                                     |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Added | 実践の型活用ガイドに「kata を agent でレビューする」を追加。人のレビューの流れに合わせた 5 段（目的の過不足・構成・読みやすさ・正しさ・整合）、文章のチェック項目、kata の観点の組、書き手と別のモデルの組み方、報告の形を定めた（PJR-F4TG） |

### 5.6. 残課題

- 作業内容 No 7（報告の見本）: 2026-11-24 に 3 つの型 × 5 段の 15 タスクを流し終えた（executor は sol-executor、reporter は sonnet-reporter）。オーケストレーターが prj-overview-sample の R1〜R5 の result を確かめたところ、次の 2 点が `人への報告の形` を満たしていない。
  - 指摘の表が Markdown の表にならず、申し送りの 1 行に詰めて書かれる。同じ表が申し送りに 2 回重なる（R5）。executor の handoff の指示を reporter がそのまま写している。
  - そのため人は result だけでは指摘を一覧できない。オーケストレーターが 15 の result から表を集めた一覧（指摘 45 件、段ごとの commit 付き）を作り、利用者のレビューの材料にした。
- 直し方の案: 段の `description` か kata-guide の `人への報告の形` で、指摘の表を result の `実施内容` に Markdown の表として 1 回だけ書くと定める。reporter の書き方に頼らず executor が result の表の文案を handoff に表として渡すかは、No 8 の比べの後に決める。
- 作業内容 No 8: 利用者が同じ版の 3 つの sample をレビューし、agent の指摘と比べる。利用者のレビュー待ち。
- grade の kata の観点を絞る変更（`kata 専用の観点の組と grade への反映の案`）の起票と承認。

## 6. 関連ドキュメント

- 決定: PJR-TQZA（[[prj-0001:pjr-tqza-kata-agent-review-flow]]）。
- 段の正本: [[specdojo:kata-guide|実践の型活用ガイド]] の `kata を agent でレビューする`。
- 観点の正本: [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]]。
- 組み方: `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-review-calibration.yaml`。
