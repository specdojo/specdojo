---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-notation-cnd-sample-050-20261123t072857z-cd7d3555
  type: exec-result
  task_id: T-KATA-WAVE-6-NOTATION-cnd-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-NOTATION-cnd-sample-050/T-KATA-WAVE-6-NOTATION-cnd-sample-050-20261123T072857Z-cd7d3555/plan.md
  started_at: "2026-11-23T07:29:10.711Z"
  completed_at: "2026-11-23T07:51:00.218Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cnd-sample
    - specdojo:cnd-sample
---

# Edit Result

## 1. 実施内容

- C4コンテナ図の完成例である `docs/ja/specdojo/samples/cnd-sample.md` を、共通サンプル文脈として厚く更新しました。
- F001 に対応し、販売画面の資材配置について `_ASSUMPTION_` を付与して明示し、未確定事項として上位図との照合問題へ含めました。
- F002 および F004 に対応し、存在しないコマンドや手順への参照を削除し、`cnd-rulebook` の内容に基づいた確認記録の形式へ改めました。
- F003 に対応し、`cnd-template.md` の構造に従い、検証事項を '4.2. コンテナ間・外部依存の検証対象' の末尾に配置しました。
- F005 に対応し、'店番担当' が `Person` 表のどの役割を指すかを明記しました。
- PJR-76N9 に基づき、テンプレートに存在しない役割の割り当てや承認の進捗に関する記述を削除し、文書の責務を簡潔に保ちました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cnd-sample.md`: sample の内容を更新。資材の配置仮定 (`_ASSUMPTION_`) の追加、検証手順を rulebook の内容と整合する記録形式への変更、Person 名の定義、および不要な役割・進捗記述の削除を行いました。

## 3. 申し送り

- F003: `cnd-template.md` には '4.3. 検証・承認前の確認' という見出しが存在しないため、template の見出し構造を正として、検証記録は '4.2. コンテナ間・外部依存の検証対象' の末尾に配置しました。Kata への提案として、template に '4.3. 検証・承認前の確認' を追加するか、rulebook 側で記録場所を指定するよう修正を検討してください。
- PJR-76N9 に基づき、この sample から役割の割り当て（ARC/BA/DEV/QE/OPS/PO）や承認の進捗に関する記述は削除しています。将来的にこれらの情報を求める grade がある場合は、これらを Kata の変更提案として result に記録してください。
- 未確定事項: 販売画面の資材がどこから配信されるか（`_ASSUMPTION_` 内に記載）は、ユーザーによる決定が必要です。
- F003: the template `cnd-template.md` has no '4.3. 検証・承認前の確認' heading, and rulebook body requirements make the template authoritative for heading order, so no heading was added to the sample and the check record was placed at the end of '4.2. コンテナ間・外部依存の検証対象'. Proposed Kata fix: either add a '4.3. 検証・承認前の確認' heading to the template, or state in the rulebook '検証・承認前の確認' section that the check results are recorded at the end of 'コンテナ間・外部依存の検証対象'.
- Per PJR-76N9, the sample no longer contains role assignment (ARC/BA/DEV/QE/OPS/PO responsibilities), the '主確認ロール'/'担当ロール' columns, or approval-progress text. If a future grade asks for these, do not add them back; record them as Kata change proposals instead.
- Value to be decided by the user: where the sales screen assets are delivered from (left unresolved under `_ASSUMPTION_` and in the 上位図・配備案との照合 issue).
- 適用外の検証: `npm run validate:history-links`（Only docs/ja/specdojo/samples/cnd-sample.md was changed; no plan/result/pjr history files were edited）

## 4. 進め方と実践の型の適用

指示に基づき、`docs/ja/specdojo/samples/cnd-sample.md` を `cnd-rulebook` および `cnd-template.md` と整合させ、実例としての厚みを持たせる編集を行いました。各 finding (`F001`-`F005`) に対する修正を適用し、制約や未確定事項を `_ASSUMPTION_` や未決事項として明示的に残すことで、サンプルの完成度を高めています。
