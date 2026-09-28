---
specdojo:
  id: prj-0001:pjr-n22n-xrp-xrr-review
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: QE
  registered_at: "2026-09-26T06:13:37Z"
  block_reason: "agent exited with non-zero code: runner 検証 `test-unit`（`npm run test:unit`、source=runner）が failed。`tests/src/exec-reporter.test.ts` のテスト `accepts every task-completion verdict and rejects per-viewpoin…"
---

# PJR-N22N xrp と xrr テンプレートを review が評価しない前提へ改訂する

## 1. 概要

[[prj-0001:pjr-h4h7-bps-grade-review]] で確定した設計では、review は成果物を再評価せず、grade を事実として受け取ってタスクの完了可否を判断する。現在の `xrp-*` テンプレートはレビュー観点ごとに pass / fail / unclear を判定する指示であり、**review が評価を行う前提**で書かれている。12 本のテンプレートを改訂する。

## 2. 事実

### 2.1. 現在は review が観点を評価する指示である

`xrp-freeform-template.md` の記述である。

```text
1. レビュー観点（`RVP-NNN`）を満たしているかを主な基準にする。
- レビュー観点ごとの pass / fail / unclear 判定と根拠:
  review result の `レビュー観点別結果` セクション（各 `RVP-NNN`）。
```

これは成果物の評価であり、`bps-deliverable-evaluation` が定める `P-08` の責務と重複する。

### 2.2. owner 以外のロールを絞る指示が残っている

```text
owner ロールの観点は、成果物がその責務を果たしているかを確認する。owner 以外の
ロールの観点は…入力適合性の最低限の確認とし…過剰な再レビューはしない
```

[[prj-0001:pjr-2zvs-grade-review-integration]] の決定 3.2 は責務による重み付けを撤回している。review が評価しない前提では、この指示自体が不要になる。

### 2.3. 対象は 12 本

| 種別    | 本数 |
| ------- | ---- |
| `xrp-*` | 10   |
| `xrr-*` | 2    |

`xrp-viewpoint-detail-template.md` と `xrr-viewpoint-detail-template.md` は観点別の詳細を記録する雛形であり、review が評価しないなら役割が変わる。

## 3. 改訂の方向

| 対象                   | 変更前                                  | 変更後                                           |
| ---------------------- | --------------------------------------- | ------------------------------------------------ |
| `xrp-*`                | 観点ごとに pass / fail / unclear を判定 | grade の結果を確認し、タスクの完了可否を判断する |
| `xrr-*`                | 観点別結果を記録                        | 判断とその根拠、改善指示を記録                   |
| `*-viewpoint-detail-*` | 観点別の詳細を記録                      | **要否を判断する**。grade 側へ移るなら不要       |

`bps-task-completion` の受入観点が改訂の基準になる。

```text
完了可能 / 品質 finding を伴う完了 / 品質良好だが未完了 /
評価結果が最新でない / 評価不能 / review 中の成果物変更
```

## 4. 完了条件

- `xrp-*` が観点ごとの評価を指示していない。grade の結果を入力として使う指示になっている。
- `xrp-*` に grade が最新でない場合の扱いがある。`bps-task-completion` の `E-01` と対応する。
- `xrr-*` が判断とその根拠、改善指示を記録する構成になっている。
- `xrr-*` の verdict が `bps-task-completion` の受入観点 6 区分と対応している。
- `*-viewpoint-detail-*` の要否が決まっている。不要なら削除し、参照元から外す。
- owner 以外のロールを絞る指示が削除されている。決定 3.2 で撤回済みである。
- 12 本の間で記述が矛盾していない。共通事項は `xep-common-conventions-template.md` へ寄せる。
- `specdojo exec validate` が通過している。
- review を 1 件試行し、生成される plan と result が意図どおりであることを確認している。

## 5. 留意点

**review の実務が変わる変更である。** 現在 review を通す運用があるため、改訂と同時に既存の review plan が無効にならないかを確認する。`sch-strategy-*.yaml` の `review` phase の位置づけ変更も連動するが、そちらは別途扱う。

grade が 28 観点すべてを見る前提（[[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]] と [[prj-0001:pjr-k351-continuous-abolition-all-viewpoints]]）が未実装の段階では、grade は 12 観点しか見ない。**改訂の適用時期を、観点範囲の拡大と合わせるかを判断する。** 先に改訂すると、review が見なくなった 16 観点を誰も見ない期間が生じる。

### 5.1. 適用順序の決定（2026-09-27）

利用者の承認により、本項目は PJR-K351 の完了後に適用する。grade が 28 観点すべてを評価するようになってから review を「観点ごとに評価しない」形へ改めることで、16 観点を誰も評価しない期間を作らない。2026-09-27 に claude-expert-executor で 1 回実行したが、executor はこの判断が未決定であることを理由に着手せず waiting とした。この判断は妥当だった。

## 6. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ                                                                  |
| --- | -------------------------------------- | ---- | ---- | --------------------------------------------------------------------- |
| 1   | 観点範囲の拡大との適用順序を決める     | QE   | done | 適用順序の決定に従い、`PJR-K351` の完了後に適用した                   |
| 2   | `*-viewpoint-detail-*` の要否を決める  | QE   | done | 不要と判断して 2 本を削除し、参照元のコードとテストから外した         |
| 3   | `xrp-*` 10 本を改訂する                | QE   | done | 残る 9 本を改訂した（detail 1 本は削除）                              |
| 4   | `xrr-*` 2 本を改訂する                 | QE   | done | `xrr-template.md` を改訂し、verdict を受入観点 6 区分と対応させた     |
| 5   | owner 以外のロールを絞る指示を削除する | QE   | done | 該当段落を持つ 4 本から削除した                                       |
| 6   | review を 1 件試行して確認する         | QE   | open | plan 生成のみ試行した。agent による review 実行と result 確認は未実施 |
| 7   | 前回実行の変更を作り直す               | QE   | done | 前回実行の変更は作業ツリーに残っていなかったため、全体を再実装した    |

## 7. 対応結果

- 前提確認: `PJR-K351` と `PJR-WPWB` は `done` であり、適用順序の決定（`PJR-K351` の完了後に適用）を満たす。
- 再実装: 2026-09-27 の前回実行は親 runner の `typecheck` で失敗し、その変更は作業ツリーに残っていなかった。本実行で全体を作り直した。前回の失敗原因は、`scaffoldClaimResult` の引数型から `viewpointsPath` を外したのに、呼び出し側（`src/exec.ts`）が渡し続けていたことである。本実行では引数型と 2 箇所の呼び出し、分割代入をそろえて外した。
- `*-viewpoint-detail-*` の要否: review が観点ごとに評価しないため不要と判断した。`xrp-viewpoint-detail-template.md` と `xrr-viewpoint-detail-template.md` を削除した。あわせて `src/exec-plans.ts` の展開処理（`reviewViewpointDetails`・`reviewResultSections`・`reviewResultSectionsForDeliverable`、および review plan 専用だった `coverage_types` の読み込み）を外した。`src/exec.ts`・`src/exec-run.ts`・`src/exec-results.ts` の `reviewSections` 受け渡しも外した。
- `xrp-*`: 観点ごとの pass / fail / unclear 判定と owner 以外のロールを絞る指示を削除した。「評価結果」章を追加し、評価対象、grade の対象種別、評価結果サイドカーのパスを `_GRADE_SUBJECT_PATH_`・`_GRADE_TARGET_`・`_GRADE_RESULT_PATH_` として plan 生成時に展開する。実践の型メンテナンス系では対象種別を `kata`、評価対象を実践の型とする。レビュー観点表は `done_criteria` を示す「完了条件」表（ID は `DC-NNN`）に改めた。
- 共通事項: `xep-common-conventions-template.md` に「review の判断手順」を追加し、12 本に共通する正本とした。内容は次のとおり。
  - 再評価しない原則と、`grade list --changed-only`（deliverable は `--dependency-changed` も）による鮮度確認（`E-01` に対応）。
  - `--incomplete` による評価不能の判定（`E-02`）と、review 中の変更検知。
  - verdict 表。この節は `<!-- review-only:start -->` と `<!-- review-only:end -->` で囲み、review plan にだけ残す。edit・登録簿・Job の plan からは取り除く。
- `xrr-template.md`: 評価結果の確認、判断根拠、未充足事項・改善指示、approach に応じた確認、decision（`verdict`）の構成に改めた。`verdict` は `complete` / `complete-with-findings` / `incomplete` / `grade-stale` / `grade-unavailable` / `changed-during-review` の 6 値である。[[bps-task-completion]] の受入観点 6 区分と一対一に対応する。
- reporter: `src/exec-reporter.ts` と `exec-reporter-output.schema.yaml` の review 出力を `grade_check`・`rationale`・`improvements`・`approach`・`verdict` に置き換えた。`src/exec-results.ts` の描画と未記入検知も新しい構成に合わせた。reporter への指示には「`complete` 以外の verdict も記録済みの結果として `outcome=complete` で返す」旨を加えた。改訂前に scaffold 済みの review result のために、`recommendation: _TODO_` の未記入検知は残した。
- 試行: `exec plan --deliverable pm-plan --mode review` を `fully-guided` と `rulebook-maintenance` で `/tmp` へ生成し、次を確認した。
  - 評価対象・対象種別・既存サイドカーのパスが展開されること。
  - 完了条件表と review の判断手順が出力されること。
  - 区切りのマーカー行が残らないこと。
  - 同じ評価対象に `grade list --changed-only` を実行すると評価対象が出力され、この時点の review は `grade-stale` になること。
- 既存 review plan への影響: 改訂前の plan から scaffold した review result は、reporter の新しい出力で本文ごと置き換わるため描画は失敗しない。改訂前の plan 本文は観点別評価を指示したままなので、未着手の review plan は再生成が必要である。
- 未完了: review を agent で 1 件実行して生成される result を確認する作業（No.6）は、executor の sandbox では実行できないため未実施である。`review-guide.md` は旧来の観点別判定と `recommendation` を説明したままであり、別途改訂が必要である。`sch-strategy-*.yaml` の `review` phase の位置づけ変更も別途扱う。

## 8. 関連ドキュメント

- [[prj-0001:pjr-h4h7-bps-grade-review]]
- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- [[bps-task-completion]]
- `docs/ja/specdojo/exec-templates/xrp-template.md`
- `docs/ja/specdojo/exec-templates/xrr-template.md`
