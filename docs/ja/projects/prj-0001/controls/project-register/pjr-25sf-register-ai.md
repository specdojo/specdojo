---
specdojo:
  id: prj-0001:pjr-25sf-register-ai
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-08-31"
  completed_at: "2026-08-08T12:00:00Z"
  conclusion: 自動レビューパスは任意導入(オプトイン)、対象はedit区分に限定、否時は既存register waitへ差し戻し、完了条件節をdone_criteria相当として活用する方針。実装は別途todo化する。
---

# PJR-25SF register系タスクへのAIレビューフェーズ導入を検討する

## 1. 概要

catalog成果物はedit/review2段階のagent実行があるが、register(PJR)系タスクはeditのみでcloseの可否確認が人間任せになっている。review-agentによる自動レビューパスの導入価値と設計（対象item_type、レビュー失敗時の遷移、必須/任意、レビュー用planテンプレートと個票「完了条件」のdone_criteria相当としての参照方法）を検討する。

catalog成果物には edit phase → review phase の2段階agent実行があるが、register(PJR)系タスク（`exec run --register`）は edit/investigate の実行区分のみで、review用のモード・planテンプレート・状態遷移が存在しない。[[prj-0001:pjr-0163-register-add-id-fetch]] の実行後、`review` 状態は「agentによる自動レビュー待ち」ではなく「人間が確認して `register close` するのを待つだけの手動チェックポイント」であることが判明した。この非対称性を踏まえ、register系タスクへの自動レビューパス導入の要否と設計を検討する。

## 2. 完了条件

- 自動レビューパスを導入すべきか、既存の人間チェックポイント運用を維持すべきかの結論が出ている。
- 導入する場合、対象範囲（全item_type共通か、`edit`区分のtodo/issue/change-requestのみか、`investigate`区分の question/risk も含めるか）が決まっている。
- 導入する場合、レビュー結果が否だったときの状態遷移（新設の差し戻し状態か、既存の `register wait` を流用するか）が決まっている。
- 導入する場合、自動レビューを必須（`exec run --register` に自動で組み込む）にするか、任意（明示オプション指定時のみ）にするかが決まっている。
- 導入する場合、レビュー用のplanテンプレートと、個票「完了条件」をcatalogの `done_criteria` 相当としてレビューagentへ渡す方法が決まっている。
- 検討結果が本個票の「対応結果」に記録され、導入しない場合はその理由も記録されている。

## 3. 作業内容

| No  | 作業                                                                    | 担当 | 状態 | メモ                                                                      |
| --- | ----------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------- |
| 1   | catalog成果物のedit/review2段階実行の仕組みを調査する                   | ARC  | done | `src/exec-run.ts`・スケジュール定義（`sch-strategy-*.yaml`の phase.mode） |
| 2   | register系タスクへ適用する場合の対象範囲・状態遷移・必須/任意を整理する | ARC  | done | 対応結果 4.2〜4.5 に整理                                                  |
| 3   | 導入可否と設計方針を決定し、個票へ記録する                              | ARC  | done | 結論=任意導入。実装todoは対応結果 4.7 に列挙                              |

## 4. 対応結果

### 4.1. 調査で判明した現状の非対称性

catalog 成果物と register(PJR) 系タスクの実行区分を実装から確認した。

- catalog 側（`docs/ja/projects/prj-0001/schedule/sch-strategy-launch.yaml`）は phase_set に `mode: review` のフェーズ（`review-pass` の `review`）を持ち、review agent が起動する。done_criteria は catalog に構造化されており、`src/exec-plans.ts` の `reviewViewpointRows` / `reviewResultSections` / `reviewResultSectionsForDeliverable` が done_criteria と `pm-review-viewpoints.yaml` を突き合わせ、観点別（RVP-NNN）のレビュー plan・result を機械生成する。review agent は観点ごとに結果・根拠を result へ記録する。
- register 側（`src/exec-run.ts` の `runSingleRegisterItem`）は `plan 生成 → register start（in-progress）→ agent 実行（in-place）→ 成功時 register review → 人間が register close` の流れで、review agent フェーズが存在しない。`register review` で入る `review` ステータスは「agent の自動レビュー待ち」ではなく「人間が確認して close するのを待つ手動チェックポイント」である。
- register plan は `src/exec-register.ts` の `registerPlanFrontmatter` が `mode: edit` を固定出力し、テンプレートは `xep-register-template.md`（edit）と `xep-register-investigate-template.md`（investigate）の2種のみ。review 用テンプレート・review mode の plan/result は存在しない。
- 実行区分は `registerItemCategory`（`src/exec-register.ts`）で `edit`=todo/issue/change-request、`investigate`=question/risk に分類される。register 項目は対象成果物 schema を特定できないため（`origin: register`、`targets` を持たない）、catalog と同じ review-viewpoints ベースの機械検証はそのままでは適用できない。
- `register close`（`src/register.ts` の `closeCmd`）は `require-active` ガードのみで、`review` ステータスを経由していなくても close できる。ステータス語彙（`VALID_STATUSES`）には `review` と `waiting` が既にある。

### 4.2. 導入可否の結論

自動レビューパスを **任意（オプトイン）で導入する** ことを推奨する。

- 導入価値: edit agent が終了コード 0 で終わっても完了条件を実質満たしていないケース（`isResultUnfilled` の必須節チェックはすり抜ける内容不備）を、人間 close の前に一段自動検証できる。catalog と運用思想を揃えられる。
- 一律必須にしない理由: register 項目は完了条件の構造化度・粒度がばらつき、個票の無い項目・完了条件が曖昧な項目ではレビューがノイズ化する。また register 実行は単発が主で、全項目必須化はコスト・レイテンシ増が大きい。
- 既存の人間チェックポイント運用は廃止せず、レビュー可の後も人間 close を残す（agent は項目を終端化しない現行方針を維持する）。

### 4.3. 対象範囲

- 初期対象は `edit` 区分（todo / issue / change-request）に限定する。これらは成果物・実装を変更するため「完了条件を満たす編集ができたか」のレビューが機能する。
- `investigate` 区分（question / risk）は初期スコープ外とする。成果物編集ではなく結論案の記録が主で、レビュー対象が「結論の妥当性」になり自動化の実効が低いため。将来、有効性が確認できた段階で再検討する。

### 4.4. レビュー結果が否のときの状態遷移

- 差し戻し用の新規ステータスは新設せず、既存の `register wait`（`waiting`）を流用する。
- 遷移: `edit 成功 → review agent 実行`。可なら現行どおり `review` ステータス（人間 close 待ち）を維持。否なら `register wait` で `waiting` へ差し戻し、`--conclusion` に差し戻し理由を記録する（`waiting` は再実行で `in-progress` に戻せる既存意味と整合）。
- 新設を避ける理由: ステータス語彙を増やすと `pjr-index`・派生ビュー（`generated/`）・遷移ガードの複雑化を招く。`waiting`＝要再対応の意味に差し戻しが合致する。

### 4.5. 必須／任意

- 任意とし、`exec run --register` に明示オプション（例: `--register-review`）を指定した時のみ review agent を起動する。
- 理由: 4.2 のとおり項目の構造化度がばらつくため。まず任意で運用知見を蓄積し、有効性が確認できた `item_type` について将来デフォルト化を検討する。catalog は phase_set で review を必須に組み込むが、register は単発実行が主で必須化の負荷が高い。

### 4.6. レビュー用 plan テンプレートと完了条件（done_criteria 相当）の渡し方

- 新規テンプレート `xrp-register-template.md`（`mode: review`）を追加する。catalog の `_REVIEW_VIEWPOINT_ROWS_`（review-viewpoints 由来）は register が対象成果物カタログを持たないため使わず、代わりに個票の「完了条件」節をレビュー観点として提示する構成にする。
- done_criteria 相当の供給源は個票（`pjr-XXXX-<topic>.md`）の `完了条件` 節とする。`pjr-rulebook` は todo 個票に `概要 / 完了条件 / 作業内容 / 対応結果` を必須節として定めており、`完了条件` 節が register 項目の done_criteria 相当にあたる。
- 渡し方: review plan 生成時に個票の `完了条件` 節を機械抽出し、review plan の観点セクションと review result のチェックリストへ差し込む。個票が無い（個票列が `-`）／`完了条件` 節が無い項目は、edit result の「実施内容」と plan のタイトル・説明から仮の完了条件を立て、review agent がそれを基準に確認する（catalog 側で `reviewResultSectionsForDeliverable` が criteria 空時に汎用 result へフォールバックするのと同じ思想）。
- 実装面: `src/exec-register.ts` の `REGISTER_PLAN_TEMPLATES` に review エントリを足すか `generateRegisterReviewPlan` を新設し、`registerPlanFrontmatter` を review 時に `mode: review` を出力できるよう拡張する。review result の scaffold は `mode: review` で行う。

### 4.7. 申し送り（導入する場合の実装 todo）

本個票は検討タスクのため実装は行わない。導入決定を受けて、別途以下の実装 todo を起票する。

- `exec run --register` への `--register-review`（任意）オプション追加と `runSingleRegisterItem` へのレビューフェーズ組み込み（`src/exec-run.ts`）。
- review 用 plan テンプレート `xrp-register-template.md` の新設と、個票「完了条件」節の抽出・埋め込み処理（`src/exec-register.ts`）。
- レビュー否時の `register wait` 差し戻し（`--conclusion` に理由）と、可時の `review` 維持のフロー実装。
- `register-operation-guide` / `pjr-rulebook` の該当節（`状態遷移とコマンド` / 承認方式）へレビューフェーズの記述追加。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0163-register-add-id-fetch|register addのID採番方式見直しと統合ブランチ予約のfetch同期]]
- [[specdojo:pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[specdojo:register-operation-guide|SpecDojo登録簿運用ガイド]]
