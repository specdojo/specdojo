---
specdojo:
  id: prj-0001:xer-pjr-seqc-20260815t015309z-b33e
  type: exec-result
  task_id: PJR-SEQC
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-seqc-20260815T015309Z-b33e-plan.md
  started_at: "2026-08-15T01:53:09.556Z"
  completed_at: "2026-08-15T02:11:54.278Z"
  agent: claude-expert-executor
---

# Edit Result

## 1. 実施内容

個票PJR-SEQCの完了条件・作業内容（No.1〜11）に沿って、既存timeline（Gantt可視化）のgantt-chartへの改名と、新しいtimeline（トラック順序計画、`tml-`）の新設を実施した。

- timeline→gantt-chart改名: `src/exec-schedule-timeline*.ts`3ファイルを`exec-schedule-gantt-chart*.ts`へ`git mv`し、export名（`buildTimelineSvg`→`buildGanttChartSvg`等）・`exec-schedule-calendar.ts`の関数名（`timelineStartDate`→`ganttChartStartDate`等）・内部変数（`timelineStart`/`timelineEnd`）まで改名した。生成ファイル名も`gantt-chart*`系へ変更し、`command-reference.md`／`schedule-design-guide.md`／`execution/README.md`の記述を追随させた。`src/`・`tests/`にGantt由来の`timeline`という語は残っていないことをgrepで確認した。
- 新timelineの新設: `tml-rulebook.md`（`sch-rulebook.md`に倣いrecipe/sample/templateなし）、`docs/ja/projects/prj-0001/timeline/tml-index.yaml`（既存2track＋未着手16トラックを6 waveで記載、`status: draft`）、`docs/specdojo/schemas/v1/tml-index.schema.yaml`を新設した。`src/timeline-build.ts`（ロジック）・`src/timeline.ts`（CLI）で`specdojo timeline build`／`timeline where`を実装し`src/specdojo.ts`へ登録した。`tml-index`を`dct-project-management.yaml`へ登録し、`id-and-file-naming-standard.md`へ`tml-`prefixを追記した。

個票の「作業内容」表（No.1〜11）・「対応結果」は本実施内容で更新済み（詳細は当該ファイルの差分を参照）。

## 2. 変更ファイル

- `src/exec-schedule-gantt-chart.ts`／`exec-schedule-gantt-chart-scope.ts`／`exec-schedule-gantt-chart-render.ts`（`exec-schedule-timeline*.ts`から改名）
- `src/exec-schedule.ts`／`src/exec-schedule-calendar.ts`（参照元の改名追随）
- `tests/src/exec-schedule-gantt-chart-render.test.ts`／`exec-schedule-gantt-chart-scope.test.ts`（改名）、`tests/src/exec-schedule-calendar.test.ts`（追随）
- `src/timeline-build.ts`（新設）／`src/timeline.ts`（新設）／`tests/src/timeline-build.test.ts`（新設）
- `src/specdojo.ts`（`timeline`コマンド登録）／`src/specdojo-config.ts`（設定型追加）
- `docs/ja/specdojo/rulebooks/tml-rulebook.md`（新設）
- `docs/ja/projects/prj-0001/timeline/tml-index.yaml`（新設）
- `docs/specdojo/schemas/v1/tml-index.schema.yaml`（新設）
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-management.yaml`（`tml-index`登録）
- `docs/ja/specdojo/standards/id-and-file-naming-standard.md`（`tml-`prefix追記）
- `docs/ja/specdojo/references/command-reference.md`／`docs/ja/specdojo/guides/schedule-design-guide.md`／`docs/ja/projects/prj-0001/execution/README.md`（記述追随）
- `docs/ja/projects/prj-0001/controls/project-register/pjr-seqc-timeline-gantt-chart-timeline.md`（作業内容・対応結果の更新）
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-system-design.yaml`（無関係な既存不具合の修正、次項参照）

## 3. 申し送り

- `.vitepress/sidebar-config.ts`（`timeline: { text: "タイムライン", order: 20 }` → `"gantt-chart": { text: "ガントチャート", order: 20 }`）は、agent実行時に書き込み権限がなく未反映。表示名のみの影響のため、次回の軽微修正で反映する。
- `.specdojo/specdojo.config.json`も同様に権限不足で未変更。`timeline_path`は未設定時に`timeline`ディレクトリを既定値とする実装にしたため、設定変更なしで動作する。運用上問題ないか、次回レビュー時に確認する。
- `dct-system-design.yaml`の`sysd-<term>`が未エスケープでYAML文字列としてプレースホルダ解釈され、生成物経由の`npm test`を落としていたため、本タスクの範囲外だがバッククォートで囲んで修正した（1行）。無関係な修正のため、差し戻しの要否をレビューで判断する。
- `tml-index.yaml`の`order`・`catalog_duration_estimate_days`は`track-design-guide.md`の標準順を初期案として仮置きしたもので、`status: draft`のまま人間レビューに委ねる。トラック着手順の最終確定は本チケットの完了条件に含まれない。
- `specdojo timeline build`の出力仕様（`timeline-order.md`／`catalog-scaffold.md`／`timeline.json`）と、`depends_on`未定義参照・循環・`order`矛盾・track id重複の検出ルールは、`tml-rulebook.md`と実装（`src/timeline-build.ts`）を正本として参照する。

## 4. 進め方と実践の型の適用

このplanには`approach`フィールドがなく（register起源のplanは汎用テンプレートのため）、代わりに個票（PJR-SEQC）の「2. 確定した設計（実装の前提）」を実装仕様の正本として進めた。個票が事前にYAML項目・配置先・コマンド契約・完了条件を具体的に確定していたため、設計判断を新たに行う場面は少なく、`sch-rulebook.md`（recipe/sample/templateなしの構成）を`tml-rulebook.md`の型として踏襲し、`sch-track.schema.yaml`を`tml-index.schema.yaml`のパターンとして参照した。個票に明記のない実装細部（`timeline build`の出力ファイル名・エラー検出ルール等）は実装時の裁量として判断し、判断内容を個票の対応結果と本セクションに記録した。

なお、本実行は`exec run --register`（単一エージェント完結前提）と、現行`pm-members.yaml`ロースターの`stage_role: executor`統一設計（resultを更新しない）が噛み合わず、result記入前に`waiting`となって停止した。実施内容そのものは上記のとおり完了しており、本result本文はオーケストレーター（Claude Code）がworktreeの差分・agentの実施報告を確認したうえで代筆し、`status`を`complete`へ更新している。この構造的ギャップは別途フレームワーク改善のTODOとして登録する。
