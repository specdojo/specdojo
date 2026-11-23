---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-support-sample-050-20261123t182405z-ad9ea488
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-support-sample-050
  mode: edit
  status: blocked
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-support-sample-050/T-KATA-WAVE-5-opr-support-sample-050-20261123T182405Z-ad9ea488/plan.md
  started_at: "2026-11-23T18:24:07.591Z"
  completed_at: "2026-11-23T19:50:16.078Z"
  agent: opus-executor
  execution: agent
  approach: fully-guided
  targets:
    - specdojo:opr-support-sample
  block_reason: "integration failed: git merge failed: CONFLICT (content): Merge conflict in docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-access-control-sample.yaml; worktree kept: /workspaces/specdojo-workspace/worktrees/prj-0001-T-KATA-WAVE-5-opr-support-sample-050; next: fix the artifacts with exec resume --task T-KATA-WAVE-5-opr-support-sample-050 --resume-from executor (syncs the integration target first), or retry only the integration with exec resume --task T-KATA-WAVE-5-opr-support-sample-050"
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/opr-support-sample.md` を、駄菓子屋きぬや 販売管理システムの問い合わせ一次対応に関する完成例（sample）として厚くすることを実施しました。
- `opr-rulebook` の必須構成（12章）に従い、分類表、一次対応の流れ、完了条件、証跡、および関連ドキュメント導線を具体的な値で埋めて構成しました。
- Frontmatter の `rulebook` を `specdojo:opr-rulebook` に修正し、`based_on` を sample 群の ID (`specdojo:opd-index-sample` および `specdojo:opr-sample`) に更新しました。
- 利用者によって決める必要がある値（権限・設定の依頼の応答目標、営業時間外の連絡手段、保管期間）については、`_UNDECIDED_` として残しています。
- 既存の記述を整理し、分類の整合性をとり、用語（「引継ぎ」など）の表記揺れを解消しました。
- PJR-76N9 の規定に基づき、文書の役割（承認の進み具合など）は本文には含めていません。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-support-sample.md`: `opr-rulebook` の要求に従い、構成を大幅に拡充しました。具体的には、問い合わせの分類表、受付から引き継ぎまでのステップ、完了条件、および 証跡 に関する情報を加筆しました。また、`based_on` の設定を sample としての整合性を保つために修正しました。

## 3. 申し送り

- 利用者が決める値として `_UNDECIDED_` のまま残した点: 権限・設定の依頼の応答の目標、営業時間外の緊急連絡手段、問い合わせ記録の保管期間。いずれも `opd-index-sample` の問い合わせ運用方針・未決事項で決めることになる。
- 既存記述の扱い: 4 分類は運用方針の分類に対応付けた（仕様確認→操作の質問、データ修正要否→記録の訂正の依頼、障害疑い→障害にあたるもの）。依頼（権限・設定）は `opd-index-sample` にない分類のため、受け付けた後に権限・変更の申請へ移す行として残した。「P判定」は P1〜P3 の判定条件に置き換え、「引継ぎ」は「引き継ぎ」に統一した。
- 削除した記述: 本文冒頭の「参照: `../rulebooks/opr-rulebook.md`」。rulebook への対応は Frontmatter の `rulebook` で宣言されており、必須要素にも `done_criteria` にも寄与しないため。
- `based_on` を `opd-index` から `specdojo:opd-index-sample` と `specdojo:opr-sample` に変更した。sample 群の id に揃え、分冊として `opr-index` の共通規約を判断に使うため。
- PJR-76N9 に従い本文に入れなかった grade 指摘: F002（PO の承認待ち事項）と F023（ready 化の基準・保留タスク）。どちらも文書の承認の進み具合にあたるため、登録簿の個票で追う。rulebook や viewpoint 側で、sample にはこれらを求めないと明記する変更案を検討してほしい。
- rulebook の変更案: 6.10 の問い合わせ一次対応に、分類ごとの判定の条件と応答の目標を表で示すことを記述ガイドとして足すと、grade の F013 の判定基準と揃う。
- plan の指示に従い template は読み込んでいない。見出し名は `depends_on` の `opr-sample` に揃えた。

## 4. 進め方と実践の型の適用

fully-guided に従い、既存の `docs/ja/specdojo/samples/opr-support-sample.md` を `opr-rulebook` の要件を満たす「厚い sample」へと磨き込みました。`opr-sample` を形式の参照として活用し、業務内容はプロジェクト共通文脈から構成しています。
