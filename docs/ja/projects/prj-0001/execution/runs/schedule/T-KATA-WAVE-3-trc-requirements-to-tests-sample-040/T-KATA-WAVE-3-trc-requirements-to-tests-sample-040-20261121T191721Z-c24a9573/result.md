---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-trc-requirements-to-tests-sample-040-20261121t191721z-c24a9573
  type: exec-result
  task_id: T-KATA-WAVE-3-trc-requirements-to-tests-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-trc-requirements-to-tests-sample-040/T-KATA-WAVE-3-trc-requirements-to-tests-sample-040-20261121T191721Z-c24a9573/plan.md
  started_at: "2026-11-21T19:17:27.909Z"
  completed_at: "2026-11-21T19:25:08.251Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:trc-requirements-to-tests-sample
    - specdojo:trc-requirements-to-tests-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook である `docs/ja/specdojo/rulebooks/trc-requirements-to-tests-rulebook.md` を、grade result の finding `F001` 〜 `F010` に基づいて改訂しました。
- 主な修正内容は、トレース表の行単位（要求項目 ID とテスト ID の構成）、生成手段（コマンドや手順）の定義、各カラムの生成元と変換規則、および `一部充足` や母集団外の参照の扱いに関する規定の見直しです。
- また、既存の `sample` （完成例）との整合性を保つため、`based_on` の記載規則や、更新時の編集境界（手入力の禁止と再生成の徹底）を明文化しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/trc-requirements-to-tests-rulebook.md`: grade finding `F001` から `F010` までの指摘に基づき、トレースマトリクスの生成規則（要求 ID およびテスト ID の構成）、生成手段の定義、各列の生成元と変換規則、`一部充足` の定数定義、および `based_on` の記載ルールを拡充・修正しました。また、成果物の `sample` を更新するための適用契約を定義しました。

## 3. 申し送り

- sample-maintenance: `trc-requirements-to-tests-sample.md` を改訂後の rulebook に合わせる（`F006`: `based_on` に母集団の要求文書と抽出したテスト文書をすべて書く / `F008`: ギャップ表の担当・期限の列を削り、対応テストがある `req-r1-004` の `未着手` を直し、前提に生成手段・生成日・生成元の版を書く / `F010`: 更新規則を手編集から再生成の形に改め、要求ID を `&lt;要求文書ID&gt; &lt;項目ID&gt;`、対応テストID を `&lt;テスト文書ID&gt; &lt;trace_key&gt;` の形式にする）。
- `stc-sample.md` に `relations.verifies` がないため、「生成の手順」の手順 2 で抽出されない。sample を完成例として作り直す際は、`bac-sample` を `verifies` に持つ atc/stc を前提にするか、stc-sample への追加を別タスクで判断する。
- `trc-requirements-to-specs-rulebook.md` にも項目単位の対応・母集団外の参照・編集の境界について同じ欠けがある。直すなら別タスクで揃えるかを判断する。
- sample-maintenance: `trc-requirements-to-tests-sample.md` を改訂後の rulebook に合わせる（F006: `based_on` に母集団の要求文書と抽出したテスト文書をすべて書く / F008: ギャップ表の担当・期限の列を削り、対応テストがある `req-r1-004` の `未着手` を直し、前提に生成手段・生成日・生成元の版を書く / F010: 更新規則を手編集から再生成の形に改め、要求ID を `&lt;要求文書ID&gt; &lt;項目ID&gt;`、対応テストID を `&lt;テスト文書ID&gt; &lt;trace_key&gt;` の形式にする）。

## 4. 進め方と実践の型の適用

対象の `rulebook` を、`grade` の指摘 (`F001` 〜 `F010`) および `done_criteria` に沿って、簡潔かつ厳密な生成規則を含む形式へと整えました。具体的には、トレース表の行単位、生成手段、各列の変換規則、および `sample` との整合性を確保するための規定を明文化しています。
