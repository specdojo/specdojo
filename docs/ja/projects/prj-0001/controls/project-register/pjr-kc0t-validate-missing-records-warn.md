---
specdojo:
  id: prj-0001:pjr-kc0t-validate-missing-records-warn
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  registered_at: "2026-11-07T06:32:53Z"
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

## 3. 完了条件

- 普通の `exec validate`（`--records-only` も `--schedule-only` も付けない）は、置き場所の検査の `missing` を `WARN:` の行で出し、終了コードに含めない。`misplaced`・`lock-not-ignored`・`git-check-failed` は今のままエラーとし、終了コード 1 にする。
- `exec validate --records-only` の動きは変えない（`missing` もエラーで、終了コード 1）。`--schedule-only` も変えない。
- 品質評価の生成物 `execution/grade/generated/` を、実行記録とは別の形式として置き場所の検査から外す（`src/exec/validate-records.ts` の別形式の一覧に足す）。
- 中にファイルがない lock のディレクトリ（`.locks` など）は `lock-not-ignored` にしない。中に lock のファイルがあるときは今のまま検査する。
- 欠落の基準（どの世代の run に plan・result・evidence を求めるか）は変えない。基準の見直しは別の項目で扱う。
- 単体テストで次を確かめる。普通の validate で欠落だけのときに終了コード 0 で `WARN:` が出る。普通の validate で `misplaced` があるときに終了コード 1。`--records-only` で欠落があるときに終了コード 1。`execution/grade/generated/` の下のファイルが報告されない。空の lock のディレクトリが報告されず、ファイルの入った lock のディレクトリは報告される。
- 作業後に worktree で `npx specdojo exec validate --project prj-0001` を流し、終了コード 0 になることと、出た `ERROR` と `WARN` の件数を個票の対応結果に書く。
- `docs/ja/specdojo/references/command-reference.md` と `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md` の `exec validate` の説明を、欠落の扱い（普通は警告、`--records-only` はエラー）に合わせる。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run lint:md` が通り、親の検証（`test-integration`）が通る。
- 保護された設定（`.github/workflows/`、`.specdojo/` の定義、`package.json` など）は変えない。変更が要ると判断した場合は、案を個票の対応結果に書き、報告の `handoff` にも書く。

## 4. 作業内容

| No  | 作業                                                       | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 普通の validate で欠落を警告にする                         | DEV  | open | -    |
| 2   | `grade/generated` と空の lock のディレクトリを検査から外す | DEV  | open | -    |
| 3   | 単体テストを足す                                           | DEV  | open | -    |
| 4   | リファレンス・ガイド・CHANGELOG を合わせる                 | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:command-reference]]: `exec validate` のオプション
- [[specdojo:plan-result-lifecycle-guide]]: 実行記録の置き場所と検査
