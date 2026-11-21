---
specdojo:
  id: prj-0001:xep-pjr-kc0t-20261107t063832z-891d146b
  type: exec-plan
  rulebook: none
  task_id: PJR-KC0T
  name: "実行記録の検査で過去の記録の世代を正常として扱う"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
---

# Edit Plan: PJR-KC0T 実行記録の検査で過去の記録の世代を正常として扱う

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-KC0T「実行記録の検査で過去の記録の世代を正常として扱う」に対応する。

JT5J の後、exec validate が過去の世代の記録を欠落と判定して失敗するため、evidence より前の run と移行で plan と result を集めた前の試行を正常とし、別形式の grade の生成物と空の lock のディレクトリを外して、残る中途半端な記録だけを知らせる

## 2. 対象項目

- `id`: PJR-KC0T
- `type`: todo
- `priority`: high
- `owner`: _TODO_
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-kc0t-validate-missing-records-warn.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-KC0T/pjr-kc0t-20261107T063832Z-891d146b/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

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

## 3. 進め方

1. 個票（存在する場合）を読み、目的・完了条件・制約を把握する。登録簿の一覧は大きいため読まない。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、記録する。pipeline では個票の対応結果と executor の報告の `handoff` に書き、result を直接書ける実行形式では result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。
5. 個票の完了条件が result への記載を求める場合、pipeline の executor は個票の対応結果と報告の `handoff` の両方に書く。reporter と runner が result の申し送りへ反映する。executor は result を直接編集しない。
6. 判断に迷う箇所は _TODO_ / _ASSUMPTION_ で残し、根拠と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。

### grade result から展開された finding

- なし

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

## 4. 完了手順

1. 「進め方」に従って対応を完了する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result に実施内容・変更ファイル・申し送りを記入する。pipeline では executor は実施内容・変更ファイル・検証結果を報告し、申し送りを `handoff` に記載する。reporter と runner が result を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。
4. 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。状態遷移（review / close など）は runner と人間が行う。

## 5. 異常終了の条件

- 前提不足・対象ファイル不明・静的検査未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は登録簿の状態を変更せず、終了コードと標準エラー出力で runner に結果を返す。

## 再開時の追加の指示（orchestrator、2026-11-07）

- 親の検証の `test-unit` で `tests/src/exec/run-records.test.ts` の「keeps the full plan-result-lifecycle-guide layout tree aligned with the path module」が失敗した。ガイドに `exec/plans/` があるため、ガイド全体に `exec/plans/` が無いことを確かめる `expect(content).not.toContain("exec/plans/")` が通らない。
- このテストの狙いは、構成図が古い置き場所を現行の配置として描いていないことである。今回の完了条件では、ガイドで古い置き場所の記録の扱いを説明する必要がある。
- `exec/plans/`・`exec/results/` が無いことの確認を、ガイド全体（`content`）ではなく構成図（`block`）に限る。`controls/reviews/`・`assessments/generated/` の確認は今のまま `content` に対して行う。
- ガイドの文を言い換えてテストを通すこと（`exec/plans/` の文字列を避ける書き方）はしない。
- 直した後に `npm run test:unit` を流して通ることを確かめ、テストを直した理由を個票の対応結果に書く。

[共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b](../../../../conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt)
