---
specdojo:
  id: prj-0001:pjr-74qp-epic-plan-start-date
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  registered_at: "2026-11-05T23:58:10Z"
  derived_from:
    - PJR-PE19
---

# PJR-74QP epic に予定の開始日（`start_on`）を持たせ全体計画に使う

## 1. 概要

epic に着手の記録がないため全体計画の開始日がすべて未定になる。epic に予定の開始日 `start_on` を持たせ、全体計画の開始日に使う。

## 2. 入力

- 由来: PJR-PE19 の統合後に orchestrator が dashboard build を実行した。epic 3 件（PJR-3APD・PJR-GEZN・PJR-GQN3）とも開始日が未定、稼働日数が - で、ガントに期間が出ない（2026-11-06）
- 原因の見立て: PE19 は開始日を epic 自身の着手 event から取るが、epic は exec run --register の対象外で start が記帳されない（2026-11-06）
- 決定（A 案）: 開始日は epic の `start_on` を最優先し、なければ epic 自身の着手の記録、先行 epic の終わりの翌稼働日の順で使い、どれもなければ未定とする。子の todo の着手や起票日からは補わない。実績の開始日を別の列に出すこと（B 案）は範囲外（2026-11-06 indie が決定）
- 既にある epic 3 件の `start_on` は日付が決まっていないため、この項目では入れない（2026-11-06）

## 3. 完了条件

- `register-item-frontmatter.schema.yaml` に `start_on`（`YYYY-MM-DD` の暦日、任意）を足し、持てるのは `item_type: epic` だけとする。
- `register add` / `update` に `--start-on <YYYY-MM-DD>` を足し、`--start-on -` で外せる。epic 以外の type に指定したとき、また日付の形式が正しくないときは、記帳の前にエラーで止まる。
- dashboard の全体計画（`src/dashboard/epic-plan.ts`）の開始日を、入力の決定の順（`start_on`、epic 自身の着手の記録、先行 epic の終わりの翌稼働日、未定）で求める。`start_on` と `due_on` の両方があれば稼働日数とガントの期間が出る。
- `start_on` が `due_on` より後のときは `register build` が警告を出し、期間は未定として扱う。
- 単体テストで、`start_on` があるとき、ないとき（先行 epic から求める）、どちらもないとき（未定）、`start_on` が `due_on` より後のとき、epic 以外に指定したとき（エラー）を確かめる。
- Kata の `pjr-rulebook`（項目の表と全体計画の規則）、登録簿運用ガイド、コマンドリファレンスを `start_on` に合わせる。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run lint:md` が通り、親の検証（`test-integration`）が通る。
- 既にある epic 3 件（PJR-3APD・PJR-GEZN・PJR-GQN3）の `start_on` は入れない。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ                                              |
| --- | ------------------------------------------------ | ---- | ---- | ------------------------------------------------- |
| 1   | schema に `start_on` を足す                      | DEV  | done | epic の任意の暦日として定義                       |
| 2   | `register add` / `update` に `--start-on` を足す | DEV  | done | 設定・保持・削除・履歴記録と外部 project への転送 |
| 3   | 全体計画の開始日を決定の順で求める               | DEV  | done | 予定日、epic 自身の着手、先行 epic、未定の順      |
| 4   | `start_on` が `due_on` より後のときの警告を足す  | DEV  | done | build の警告と期間・後続推定の抑止                |
| 5   | 単体テストを足す                                 | DEV  | done | schema・CLI・全体計画・ガント・履歴の再適用       |
| 6   | Kata・ガイド・リファレンス・CHANGELOG を合わせる | DEV  | done | 未公開節に追記                                    |

## 5. 対応結果

- `start_on` を epic 専用の任意の暦日として schema・個票の読み書き・CLI・event・統合時の履歴再適用に追加した。`--start-on -` で削除でき、epic 以外への指定や形式不正・存在しない日付は記帳前に拒否する。
- 全体計画は `start_on`、epic 自身の最初の着手 event、先行 epic の最も遅い終了日の翌稼働日、未定の順に開始日を求める。子 todo の着手や起票日は使わない。開始日と終了日があれば休日を除いた稼働日数とガントを表示する。
- `start_on` が `due_on` より後なら `register build` が警告する。逆転した期間は開始日・終了日・稼働日数を未定とし、その終了日から後続の開始日を補わない。後続自身の予定日・着手記録は引き続き使う。
- [[specdojo:pjr-rulebook|登録簿の規則]]、[[specdojo:register-operation-guide|登録簿運用ガイド]]、[[specdojo:timeline-design-guide|Timeline からの移行ガイド]]、[[specdojo:command-reference|コマンドリファレンス]]、CHANGELOG の未公開節を更新した。既存 epic 3 件への日付設定は行っていない。
- schema、CLI の設定・保持・変更・削除と書き込み前エラー、開始日の優先順位・未定・日付逆転・休日・ガント、event の記録と再適用を単体テストに追加した。単体・結合テストと型・lint の検証は親 runner が実行する。
- 検証: Prettier 整形、変更した schema 3 件の JSON Schema 2020-12 検証、登録簿 build、カタログ整合性、履歴リンク検証が通過した。カタログには既存の未作成文書・再エクスポート参照の警告がある。schema 検証は meta schema の直接指定で AJV の重複 ID エラーになったため、一時 wrapper から meta schema を参照して確認した。残課題・保護設定の変更案はない。

## 6. 関連ドキュメント

- [[specdojo:pjr-rulebook]]: 登録簿の項目と全体計画の規則
- [[specdojo:register-operation-guide]]: 全体計画の生成と期間未定の扱い
