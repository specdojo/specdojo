---
specdojo:
  id: prj-0001:pjr-kc0t-validate-missing-records-warn
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                                        | 担当 | 状態 | メモ                                               |
| --- | ----------------------------------------------------------- | ---- | ---- | -------------------------------------------------- |
| 1   | 過去の世代の記録を正常として扱う                            | DEV  | done | 導入前・集約した先行試行・旧配置を正常扱い         |
| 2   | 一部だけの記録を普通は警告、`--records-only` はエラーにする | DEV  | done | 欠落だけを通常時の終了コードから除外               |
| 3   | `grade/generated` と空の lock のディレクトリを検査から外す  | DEV  | done | 独立形式とファイルのない lock ツリーを除外         |
| 4   | 単体テストを足す                                            | DEV  | done | 世代・欠落・配置違反・lock・CLI の回帰テストを追加 |
| 5   | 移さない古い記録で読めない機能を調べる                      | DEV  | done | 自動探索と明示パス参照を調査                       |
| 6   | リファレンス・ガイド・CHANGELOG を合わせる                  | DEV  | done | 移行不要の条件と読み取りの制約を記載               |

## 5. 対応結果

### 実施内容と成果物

- `src/exec/validate-records.ts`: evidence 導入前の plan・result の対、state・evidence だけがあり同じ出どころ・項目の別 run に対がある先行試行、旧 `exec/plans/`・`exec/results/`・`exec/evidence/` を正常扱いにした。先行試行の対は同一 run 内の通常ファイルに限り、別項目・別出どころ・不正な run 名・別々の run に片方ずつある対は認めない。ログ・state・evidence の本文は読まない。
- 同ファイルで `grade/generated/` を独立した形式として除外し、ファイルのない lock のディレクトリツリーを Git 検査へ渡さないようにした。ファイルのある lock の追跡・無視の検査と Git 確認失敗の検出は維持した。
- `src/exec/commands.ts`: 欠落を通常時は `WARN:` とし、`--records-only` では従来どおり `ERROR:`・終了コード 1 にした。配置違反と lock のエラー、および `--schedule-only` の動作は維持した。
- `tests/src/exec/validate-records.test.ts`: 3 出どころの過去の世代、旧配置、不完全な組合せ、集約先の条件、grade 生成物、空／非空 lock、通常／配置限定／schedule 限定の CLI 判定を追加・更新した。単体・統合テストの実行は親 runner に委ねる。
- `tests/src/exec/run-records.test.ts`: 親の単体検証で、必要な旧配置の説明まで構成図の検査が拒否していたため、`exec/plans/`・`exec/results/` がないことの確認をガイド全体の `content` から構成図の `block` に限定した。`controls/reviews/`・`assessments/generated/` は引き続きガイド全体で確認する。ガイドの文言は維持し、`npm run test:unit` の再実行は pipeline の指示に従って親 runner に委ねる。
- [[specdojo:command-reference|コマンドリファレンス]] と [[specdojo:plan-result-lifecycle-guide|plan/resultライフサイクルガイド]] に、正常とする世代、欠落の警告／エラー、検査に移行が不要なこと、未移行時の読み取り制約を記載した。CHANGELOG は Unreleased の不具合修正に追記した。

### 未移行の記録を読む機能の調査

| 機能                               | 未移行時の扱い・根拠                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| plan・result の通常の探索、archive | `src/shared/run-records.ts` の `listRunRecords`・`findRunRecord`・`recordPathForRead` は `runs/` のみを対象とする。`src/exec/plans-storage.ts` の読み込み・archive も同じ探索を使う。旧 plan を自動で再利用しない。                                                                                                                                                                                                                |
| 再開                               | `resumeStatePaths` と `src/exec/register-resume.ts` の候補収集は `runs/` の checkpoint を探索し、register 再開と schedule の executor 再開に使う。schedule の通常実行・統合再開は plan・result の取得にも新配置の探索を使う。一方 `src/exec/pipeline-state.ts` の checkpoint 読み込みはイベントなどからの明示パスを読めるため、「すべての旧パスの読み取りが不可能」とはしない。移行コマンドは進行中 run の移行・再開を保証しない。 |
| dashboard                          | `src/dashboard/exec-records.ts` は `listRunRecords` を使う。旧記録は実行記録一覧と plan・result 件数に含まれない。                                                                                                                                                                                                                                                                                                                 |
| 登録簿の生成物・リンク             | `src/register/views.ts` は個票とイベントからビューを作り、実行記録を探索しない。個票に残るリンクは元のファイルがあれば利用できるが、検査による補完・パス更新はない。                                                                                                                                                                                                                                                               |

### worktree の実測と検証

`npm run build` で今回のソースをビルドした後、2026-11-07 に検査した。`ERROR:`・`WARN:` で始まる行の数は次のとおり。

| コマンド                                                                | 終了コード | ERROR | WARN | 判定                                                                              |
| ----------------------------------------------------------------------- | ---------- | ----- | ---- | --------------------------------------------------------------------------------- |
| `npx specdojo exec validate --project prj-0001`                         | 254        | 0     | 0    | npm が CLI を解決できず、sandbox 外のキャッシュ作成が ENOENT で失敗。検査前に停止 |
| `npx specdojo exec validate --project prj-0001 --records-only`          | 254        | 0     | 0    | 同上                                                                              |
| `node dist/specdojo.js exec validate --project prj-0001`                | 0          | 0     | 28   | ビルドした同じ CLI の通常検査は成功                                               |
| `node dist/specdojo.js exec validate --project prj-0001 --records-only` | 1          | 28    | 0    | 残る欠落だけをエラーとする期待どおりの失敗                                        |

- 初回の検出対象は 14 run・28 ファイルの欠落で、実行中の本タスクの evidence 欠落 1 件を含む。過去の世代と grade 生成物・空の lock の違反は報告されない。通常時には上表の `WARN:` のほか、schedule に存在しない旧 task の event に関する既存の警告 4 件が従来の箇条書き形式で出る。
- Prettier、履歴リンク検査、カタログ検査、register の派生ビュー生成を実施した。カタログの既存の re-export・未作成文書の警告は残るが、エラーはない。register の `tsx` 起動は IPC の EPERM で失敗したため、共通規約に従って `node --import tsx src/specdojo.ts register build` で成功を確認した。
- lint・型検査・単体／統合テスト・schema は親 runner が実行する。保護された設定の変更は不要で、登録簿の行・個票のステータス・result は編集していない。

再開後は現在のソースを直接起動して再確認した。配置違反・lock のエラーはなく、通常検査は成功した。

| コマンド                                                                            | 終了コード | ERROR | WARN |
| ----------------------------------------------------------------------------------- | ---------- | ----- | ---- |
| `node --import tsx src/specdojo.ts exec validate --project prj-0001`                | 0          | 0     | 27   |
| `node --import tsx src/specdojo.ts exec validate --project prj-0001 --records-only` | 1          | 27    | 0    |

再開時のテスト修正後も Prettier、`npm run validate:history-links`、hook の `node --import tsx tools/catalog-validate-if-configured.mjs` は成功した。カタログには既存の警告が残る。親の `test-unit` 再検証で、構成図に限った旧配置の検査と全単体テストの成功を確認する。

### 申し送り

- ホスト側で指定の `npx specdojo exec validate --project prj-0001` と `--records-only` を再確認する。sandbox では起動前の npm キャッシュ作成に失敗したため、同じビルド済み CLI の直接起動で動作を確認済み。記録が増減すると警告件数は変わる。`--records-only` は残る欠落のため終了コード 1 が正常な期待値である。
- 統合後は [[prj-0001:pm-orchestrator-playbook|運用メモ]] に従い、PJR-JSEY で exec の実 CLI 動作を確認してから close する。

## 6. 関連ドキュメント

- [[specdojo:command-reference]]: `exec validate` のオプション
- [[specdojo:plan-result-lifecycle-guide]]: 実行記録の置き場所と検査
