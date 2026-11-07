---
specdojo:
  id: prj-0001:pjr-kc0t-validate-missing-records-warn
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: medium
  registered_at: "2026-11-07T06:32:53Z"
  block_reason: "parent validation failed: test-unit"
  derived_from:
    - PJR-JT5J
---

# PJR-KC0T 実行記録の検査で過去の記録の世代を正常として扱う

## 1. 概要

JT5J の後、exec validate が過去の世代の記録を欠落と判定して失敗するため、evidence より前の run と移行で plan と result を集めた前の試行を正常とし、別形式の grade の生成物と空の lock のディレクトリを外して、残る中途半端な記録だけを知らせる

## 2. 入力

- 由来: PJR-JT5J の統合後、develop で npx specdojo exec validate --project prj-0001 がエラー 665 件で失敗した。内訳は missing 644 件、misplaced 10 件、lock-not-ignored 1 件（2026-11-07）
- missing の 644 件を run のディレクトリの中身で分けると、plan と result だけがあり pipeline-state.json と evidence.json がないもの 352 件、evidence.json と pipeline-state.json とログだけがあり plan と result がないもの 132 件、それ以外の一部だけがあるもの 14 件だった（2026-11-07）
- 352 件は evidence の仕組みより前の run。132 件は、PJR-9BY9 の移行で plan と result を同じ項目の最新の試行のディレクトリに集めた、その前の試行（例: runs/register/PJR-08K1/20260911T124544877Z-ebc5e6c0。plan と result は 20260911T204039330Z-35d96f3f にある）（2026-11-07）
- 14 件の例: result だけ（PJR-2219）、plan だけ（PJR-TNDH）、integrate.log だけ（PJR-283N）、pipeline-state.json だけ（PJR-PZBP）、plan・result・pipeline-state.json があり evidence.json がない（PJR-23DT）（2026-11-07）
- misplaced の 10 件は、すべて execution/grade/generated/runs/ にある品質評価の plan（`*-grade-plan.md`・`*-grade-reporter-plan.md`）で、実行記録とは別の形式（2026-11-07）
- lock-not-ignored の 1 件は docs/ja/projects/prj-0001/routines/.locks の空のディレクトリ。今の src はこの場所に lock を作らないが、ディレクトリは 2026-11-07 02:00 に更新されている。更新した主体は分かっていない（2026-11-07）
- agent への指示（.github/instructions/specdojo-exec-workflow.instructions.md）は、作業の後の exec validate が成功で終了コード 0 になることを前提にしている（2026-11-07）
- 決定: 過去の世代の記録（evidence より前の run と、移行で plan と result を集めた前の試行）は、エラーにも警告にもしない。残る一部だけの記録は、普通の exec validate では警告、--records-only ではエラーとする。案 A（欠落をすべて警告にする）から組み替えた（2026-11-07 indie が決定）
- 決定: 古い置き場所（`exec/plans/`・`exec/results/`・`exec/evidence/`）の記録も、evidence がなくてもエラーにも警告にもしない。版を上げてもデータの移行を要らなくするため（2026-11-07 indie が決定）
- PJR-9BY9 で古い置き場所を読むコードを外したため、検査が通っても CLI が古い記録を読むわけではない（2026-11-07）

## 3. 完了条件

- `src/exec/validate-records.ts` の置き場所の検査で、次の過去の世代の記録を正常として扱い、エラーにも警告にもしない。
  - evidence より前の run: `pipeline-state.json` も `evidence.json` もなく、`plan.md` と `result.md` がそろっている run のディレクトリ。
  - 移行で plan と result を集めた前の試行: `evidence.json` と `pipeline-state.json` があり、`plan.md` と `result.md` がなく、同じ項目の別の run のディレクトリに `plan.md` と `result.md` がある run のディレクトリ。
  - 古い置き場所の記録: `exec/plans/`・`exec/results/`・`exec/evidence/` の下の記録。版を上げた利用者が `exec migrate-records` を流さなくても検査が通るようにする。
- 上のどれにも当たらず、記録の一部だけがある run のディレクトリは、普通の `exec validate` では `WARN:` の行で出して終了コードに含めず、`--records-only` ではエラーにして終了コード 1 にする。
- 品質評価の生成物 `execution/grade/generated/` を、実行記録とは別の形式として置き場所の検査から外す。
- 中にファイルがない lock のディレクトリ（`.locks` など）は `lock-not-ignored` にしない。中に lock のファイルがあるときは今のまま検査する。
- `misplaced`（上の例外に当たらないもの）・`lock-not-ignored`・`git-check-failed` は、普通の `exec validate` でも今のままエラーにする。`--schedule-only` の動きは変えない。
- 単体テストで、上の 3 種の過去の記録が報告されないこと、一部だけの記録が普通の validate で警告・`--records-only` でエラーになること、`execution/grade/generated/` の下が報告されないこと、空の lock のディレクトリが報告されずファイルの入った lock のディレクトリは報告されることを確かめる。
- 作業後に worktree で `npx specdojo exec validate --project prj-0001` と `npx specdojo exec validate --project prj-0001 --records-only` を流す。それぞれの終了コードと `ERROR`・`WARN` の件数を個票の対応結果に書く。普通の `exec validate` は終了コード 0 になる。
- 古い置き場所の記録を `exec migrate-records` で移さないままにしたとき、CLI のどの機能（再開・dashboard・登録簿の生成物のリンクなど）が古い記録を読めないかを調べ、個票の対応結果に書く。
- `docs/ja/specdojo/references/command-reference.md` と `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md` に、過去の世代の記録の扱いと、`exec migrate-records` は検査を通すためには要らないこと、移さないときに読めない機能を書く。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run lint:md` が通り、親の検証（`test-integration`）が通る。
- 保護された設定（`.github/workflows/`、`.specdojo/` の定義、`package.json` など）は変えない。変更が要ると判断した場合は、案を個票の対応結果に書き、報告の `handoff` にも書く。

## 4. 作業内容

| No  | 作業                                                        | 担当 | 状態 | メモ |
| --- | ----------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 過去の世代の記録を正常として扱う                            | DEV  | open | -    |
| 2   | 一部だけの記録を普通は警告、`--records-only` はエラーにする | DEV  | open | -    |
| 3   | `grade/generated` と空の lock のディレクトリを検査から外す  | DEV  | open | -    |
| 4   | 単体テストを足す                                            | DEV  | open | -    |
| 5   | 移さない古い記録で読めない機能を調べる                      | DEV  | open | -    |
| 6   | リファレンス・ガイド・CHANGELOG を合わせる                  | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:command-reference]]: `exec validate` のオプション
- [[specdojo:plan-result-lifecycle-guide]]: 実行記録の置き場所と検査
