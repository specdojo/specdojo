---
specdojo:
  id: prj-0001:pjr-5znk-stale-run-record-paths
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  registered_at: "2026-11-07T23:24:02Z"
  derived_from:
    - PJR-JT5J
---

# PJR-5ZNK ガイドとコマンドリファレンスに残る旧来の実行記録の置き場所を直す

## 1. 概要

ガイドとコマンドリファレンスが、plan・result・evidence の置き場所として旧来の `exec/plans/`・`exec/results/`・`exec/evidence/` を挙げたままになっている。今の `execution/runs/<origin>/<item>/<run>/` に揃える。

## 2. 入力

- 2026-11-08 時点で、旧来の置き場所はガイド 8 本とコマンドリファレンスの計 9 ファイル・32 か所に残っている。
- quick-start-guide.md は PJR-V5AZ で書き直し中のため、この項目では旧来の置き場所の記述に限って直す。

## 3. 完了条件

- 次の 9 ファイルの旧来の置き場所（`exec/plans/`・`exec/results/`・`exec/evidence/`）を、今の `execution/runs/<origin>/<item>/<run>/` 配下の `plan.md`・`result.md`・`evidence.json`・`pipeline-state.json` に直している。
  - `docs/ja/specdojo/guides/` の `exec-operation-guide.md`・`review-guide.md`・`exec-config-guide.md`・`quick-start-guide.md`・`exec-worktree-guide.md`・`plan-result-lifecycle-guide.md`・`schedule-operation-guide.md`・`release-v0-3-0-migration-guide.md`
  - `docs/ja/specdojo/references/command-reference.md`
- 旧来の置き場所を「旧来の形式」や「移行前の場所」として説明している箇所は残している。直さなかった箇所とその理由を、個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 例に出てくる `plan_ref` の値とコマンドの `--plan` の値も、今の置き場所に合わせている。
- 2 回目の実行（2026-11-08 追加）: `exec-operation-guide.md` と `exec-config-guide.md` にある `validate:history-links` の適用対象の説明（「executor 自身が変更した既存の `exec/plans/**/*.md`・`exec/results/**/*.md`」）は、旧来の形式の説明ではなく今の規則の説明である。実装（`src/exec/reporter.ts` の `isHistoryLinkTargetPath`）に合わせ、`execution/runs/<origin>/<item>/<run>/` 配下の `plan.md`・`result.md` を対象として書き、旧来の `exec/plans/`・`exec/results/` は旧来の置き場所として残す形にしている。個票の対応結果の「旧来の置き場所を残した箇所とその理由」から、この 2 か所を外して直した箇所として書き直している。
- `quick-start-guide.md` は旧来の置き場所の記述だけを直し、ほかの文は変えていない（PJR-V5AZ で書き直し中のため）。
- 上の 9 ファイル以外のファイルと、`src/`・`tests/` を変えていない。
- `npm run lint:md`・`npm run validate:history-links`・`npm run test:unit -- tests/src/exec/run-records.test.ts` が通っている。

## 4. 作業内容

| No  | 作業                                                             | 担当  | 状態 | メモ                                            |
| --- | ---------------------------------------------------------------- | ----- | ---- | ----------------------------------------------- |
| 1   | 9 ファイルの旧来の置き場所を洗い出し、直す箇所と残す箇所に分ける | agent | done | 計 32 か所を洗い出し、25 か所更新・7 か所保持   |
| 2   | 直す箇所を今の置き場所に書き換える                               | agent | done | `execution/runs/` の現在配置・`plan_ref` に修正 |
| 3   | 検査を流し、残した箇所とその理由を対応結果に書く                 | agent | done | 単体テスト・`validate:history-links` 通過確認   |

## 5. 対応結果

### 実施内容

- ガイド 8 本およびコマンドリファレンス 1 本の計 9 ファイルに残っていた旧来の実行記録の置き場所（`exec/plans/`・`exec/results/`・`exec/evidence/`）を監査し、現行の `execution/runs/<origin>/<item>/<run>/`（`plan.md`・`result.md`・`evidence.json`・`pipeline-state.json`）および `plan_ref`・`--plan` の指定形式へ更新した。
- `quick-start-guide.md` は PJR-V5AZ での改訂作業と干渉しないよう、旧来の置き場所の記述（3 か所）のみを最小限で更新した。
- `src/` および `tests/` には一切変更を加えていない。

### 変更した成果物

- [[specdojo:exec-operation-guide]]
- [[specdojo:review-guide]]
- [[specdojo:exec-config-guide]]
- [[specdojo:quick-start-guide]]
- [[specdojo:exec-worktree-guide]]
- [[specdojo:schedule-operation-guide]]
- [[specdojo:command-reference]]

### 旧来の置き場所を残した箇所とその理由

次の 7 か所は、旧配置互換性・歴史的記録・検査免除規則の説明として正当な言及であるため、意図的に保持した。

1. `docs/ja/specdojo/guides/exec-operation-guide.md`（403 行目）:
   旧配置 `<execution_path>/exec/evidence/<task-id>/<run-id>/` に checkpoint がある場合の `--resume` の復帰動作を説明しているため保持。
2. `docs/ja/specdojo/guides/exec-operation-guide.md`（413 行目）:
   `validate:history-links` の適用判定における履歴蓄積ファイル（既存の `exec/plans/**/*.md`・`exec/results/**/*.md`）の条件説明であるため保持。
3. `docs/ja/specdojo/guides/exec-config-guide.md`（564 行目）:
   `validate:history-links` の適用対象判定に関する上記と同様の説明であるため保持。
4. `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`（72 行目）:
   `exec validate` における旧配置（`execution/exec/plans/`・`results/`・`evidence/`）の検査対象外免除規則を説明しているため保持。
5. `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`（106 行目）:
   旧 `exec/evidence/` 配下の run が自動再開の探索対象にならない移行制約を説明しているため保持。
6. `docs/ja/specdojo/guides/release-v0-3-0-migration-guide.md`（50 行目）:
   v0.3.0 リリース時の移行対象として旧 `execution/exec/plans/` を挙げている歴史的文書であるため保持。
7. `docs/ja/specdojo/references/command-reference.md`（646 行目）:
   `exec validate` が旧 `exec/plans/`・`results/`・`evidence/` の記録をエラー・警告としない免除規則を説明しているため保持。

### 検証

- `npm run test:unit -- tests/src/exec/run-records.test.ts`: 全 16 テスト通過
- `npm run validate:history-links`: 通過
- `npm run lint:md`: 通過

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-jt5j-exec-run-record-layout-check]]
- 対象: [[specdojo:exec-operation-guide]]、[[specdojo:review-guide]]、[[specdojo:exec-config-guide]]、[[specdojo:quick-start-guide]]、[[specdojo:exec-worktree-guide]]、[[specdojo:plan-result-lifecycle-guide]]、[[specdojo:schedule-operation-guide]]、[[specdojo:release-v0-3-0-migration-guide]]、[[specdojo:command-reference]]
