---
specdojo:
  id: prj-0001:xer-pjr-rs2p-20261121t180514z-f89752a1
  type: exec-result
  task_id: PJR-RS2P
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-RS2P/pjr-rs2p-20261121T180514Z-f89752a1/plan.md
  started_at: "2026-11-21T18:05:15.097Z"
  completed_at: "2026-11-21T18:16:49.306Z"
  agent: sonnet-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- docs/ja/product の成果物 27 ファイルから、文書の役割の割り当てと承認の進み具合の記述を削除しました。
- 個票の対応結果には、修正した成果物のリスト、記述を残した箇所とその理由、未完了の承認と留保の一覧、および CHANGELOG への記載事項（なし）を記載しました。
- 作業内容の表（4 行）はすべて `done` としました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/ccd-project-planning.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/020-data-model/cdsd-execution.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/020-data-model/cdsd-planning.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/020-data-model/cdsd-sharing.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/020-data-model/cdt-register-type.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/020-data-model/sld-specdojo.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/020-data-model/stsd-deliverable.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/020-data-model/stsd-job-run.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/020-data-model/stsd-register-entry.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/020-data-model/stsd-routine-run.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/030-business-model/bes-index.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/030-business-model/bes-task-ready-selected.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/030-business-model/br-task-selection-strategy.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/040-user-interface-model/bds-progress-report.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/050-system-functions/sf-index.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/010-business-specs/050-system-functions/sf-task-execution.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/020-external-interface-specs/ifx-file-agent-evidence.yaml`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/020-external-interface-specs/ifx-index.yaml`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/030-architecture/010-c4/cpd-specdojo-cli.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/030-architecture/010-c4/cxd-specdojo.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/030-architecture/020-infrastructure/ifd-specdojo.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/040-system-design/sysd-critical-flows.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/040-system-design/sysd-cross-cutting-policy.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/040-system-design/sysd-index.md`: 役割の割り当てと承認の進み具合に関する記述を削除
- `docs/ja/product/050-business-acceptance-criteria/bac-task-completion.md`: 役割の割り当てと承認の進み具合に関する記述を削除

## 3. 申し送り

- sysd-critical-flows と bac-task-completion の「確認する」記述の一部に役割の主体が残っている。業務プロセスの主体との切り分けが要るため、外すかどうか利用者の判断を待つ。
- 個票 5.4 の未完了の承認と留保（PJR-AK5V、PJR-TN43、PJR-Y2X4、PJR-39AB、PJR-CJMN、PJR-W63Q など追跡先ありのもの、および追跡先のない M-01〜M-04、U-01〜U-07 など）の登録簿への起票は、オーケストレーターが利用者と決める。
- `ifx-*` は YAML が正本のため YAML だけを直した。generated/ は git 管理外で build により再生成される。
- CHANGELOG への記載は不要（利用者の操作・出力に影響しない）と判断した。

## 4. 進め方

対象となる 27 件の成果物（Markdown および YAML）を走査し、文書の作成・確認・承認に関する役割の割り当ておよび承認の進み具合の記述を削除しました。`ifx-*` 形式のファイルについては、YAML ファイルを直接編集しました。作業完了後、`npm run lint:md` や `npm run validate:schema` 等の各種静的検査を実施し、問題がないことを確認しています。
