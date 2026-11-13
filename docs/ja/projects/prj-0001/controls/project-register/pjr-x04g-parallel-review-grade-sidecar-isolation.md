---
specdojo:
  id: prj-0001:pjr-x04g-parallel-review-grade-sidecar-isolation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-12T13:48:52Z"
  block_reason: "parent validation failed: test-integration, typecheck"
  derived_from:
    - PJR-Z4H8
  autopilot: approved
  commit_type: fix
  commit_scope: grade
---

# PJR-X04G 並べて流す review の段が、grade の共有ファイルを取り合わないようにする

## 1. 概要

schedule の review の段を --parallel で流しても、grade の pipeline の進み具合のファイルを run ごとに分け、ほかの run の統合を止めないようにする

## 2. 入力

- PJR-Z4H8 の修正。今晩の夜間に流す（indie が 2026-11-12 に承認）

## 3. 完了条件

- PJR-Z4H8 の原因（schedule の review の段の grade が、なぜ主の作業ツリーの `execution/grade/pipeline/*.json` を書き換えるか、grade の agent が失敗したときにも書き換わる理由）を確かめ、個票の対応結果に書いている。
- review の段を `--parallel` で流しても、ある run の grade の進み具合のファイルが、ほかの run の統合の前の確認（`Grade sidecar changed after checkpoint`）を止めない。run ごとの worktree に閉じる・対象ごとに分ける・確認の対象を自分の run の分に絞る、など、原因に合った形で直す。
- grade の agent が失敗したときに、進み具合のファイルが中途半端な状態で主の作業ツリーに残らない。
- 2 つの review の段を並べて流し、片方の grade が失敗しても、もう片方が統合まで進むことを回帰テスト（統合テストでよい）で確かめている。
- 関連する設計・ガイドを、振る舞いの変化に合わせて直している。直った後、`rtn-exec-cycle` などの `parallel` を 2 に上げてよいかの判断の材料を対応結果に書く（設定は変えない）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                  | 担当     | 状態 | メモ                                                  |
| --- | ----------------------------------------------------- | -------- | ---- | ----------------------------------------------------- |
| 1   | 原因を確かめ、review の段の grade を run ごとに分ける | executor | done | 再試行状態の run 内分離、回帰テスト、設計・ガイド更新 |

## 5. 対応結果

### 5.1. 原因

`prepareSingleTask` は worktree 作成より前に `gradeBeforeReviewPlan` → `ensureReviewGrade` を呼び、主の作業ツリーを cwd として `grade run` を起動する。従来は run ごとの `run.json` と別に、再試行状態を共有の `execution/grade/pipeline/<文書名>-<パスハッシュ>.json` へ保存していた。

agent の異常終了や応答の変換・適用エラーは、runner の catch で `recordGradePipelineStage(status: failed)` により失敗段・連続失敗回数を保存する。旧 `tools/grade/run-per-document.sh` も agent / apply の失敗時に `record_pipeline_stage` を呼ぶ。同ファイルを書いていたのは runner であり、review agent の書き込み権限とは無関係である。PJR-Z4H8 の入力にある直接の失敗は `invalid finding cause` であり、権限拒否ではない。

`gradeCheckpointPaths` が主の作業ツリーにある grade の results / criteria / pipeline の変更を checkpoint に含め、その後に別 run が同じ pipeline JSON を更新すると、先行 branch の checkpoint 内容との差が生じる。統合処理は新しい状態を消さないために `Grade sidecar changed after checkpoint` で停止していた。

### 5.2. 実施内容と判断

- `grade run --isolate-pipeline-state` を追加し、再試行状態の読み取り・失敗記録・完了時の削除を run 保存先の `pipeline/` に揃えた。既定では `<execution_path>/grade/generated/runs/<grade-run-id>/pipeline/`、`--work-dir` 指定時はその配下を使う。保存先は既存のリポジトリ内パス検証を通す。
- review 前の grade は必ずこのオプションを指定する。失敗状態は調査・同一 run の再開用に生成物として残し、主の作業ツリーの共有 pipeline JSON は更新・削除しない。連続失敗回数・上限も run ごとに独立させた。
- 判断: 状態を消して失敗の痕跡を失う方法や、統合前のガードを緩める方法ではなく、失敗状態の保存先を分離した。通常の grade の文書単位の再試行契約、正本の results / criteria の checkpoint、project 単位の grade lock は維持する。オプション省略時の既存 run の再開ハッシュを変えないよう、新しい CLI オプションに既定値を追加しない。
- 変更ファイル: `src/grade/command-run.ts`（CLI）、`src/grade/run.ts`（保存先選択）、`src/grade/pipeline-state.ts`（分離先の読み書き）、`src/review/grade.ts`（review からの指定）。
- [[sysd-critical-flows|システム設計重要フロー]] の scf-004、[[specdojo:schedule-operation-guide|Schedule実行運用ガイド]]、[[specdojo:command-reference|CLIコマンドリファレンス]] に保存境界と失敗時の動作を記載した。

### 5.3. 検証

- `tests/src/exec/worktree-ops.integration.test.ts` に、共有失敗状態を checkpoint に含む review と別 review を重ね、後者の grade が agent failure でも前者が実 Git の merge まで進む回帰テストを追加した。共有状態の保持、失敗 run 専用状態、失敗側 worktree の保持、生成物が追跡されないことも確認する。
- `tests/src/grade/run.test.ts` に、agent failure・不正応答、共有状態と他 run から独立した失敗上限、`--work-dir`、成功再開時の専用状態削除を追加した。CLI からのオプション伝達と `tests/src/review/grade.test.ts` の review 呼び出し引数も更新した。
- executor の Prettier 整形、`npm run validate:history-links`、`node --import tsx tools/catalog-validate-if-configured.mjs`、個票の secret scan、`git diff --check` は合格。カタログ検証は既存の未作成文書や re-export の参照に関する警告を伴うが、終了コードは 0。型検査・TS / Markdown 等の lint・schema・unit / integration テストは指定された親 runner の検証に委ね、executor で二重実行しない。最終的な合否は runner が result に追記する。

### 5.4. 並列数を上げる判断材料と申し送り

この修正は pipeline 状態による run 間の干渉を除くため、親検証と統合後の実運用確認が通れば、独立した review で `rtn-exec-cycle` の `parallel: 2` を試す根拠になる。grade 自体の project lock は維持されるため、別 runner の同時 grade は busy として失敗し得る。正本の同一評価結果の同時更新や同じ成果物の編集競合も保護ガードの対象のままである。共有状態を参照する `grade list --incomplete` / `grade state --exhausted` に review 専用の失敗状態は混ぜない。

設定は変更していない。統合後、runner に関わる変更の確認手順として PJR-JSEY と独立 review 2 件の実 CLI 確認を orchestrator 側で行い、その結果を踏まえて並列数を判断する。本 executor では別登録項目の実行や実 agent の起動を行わない。

### 5.5. CHANGELOG に書く事項

- 不具合修正: Schedule の review 前に実行する grade の再試行状態を run ごとに分離し、grade の失敗状態の更新が別 review の統合を止める問題を修正。

## 6. 関連ドキュメント

- [[prj-0001:pjr-z4h8-parallel-review-grade-sidecar-conflict]]
