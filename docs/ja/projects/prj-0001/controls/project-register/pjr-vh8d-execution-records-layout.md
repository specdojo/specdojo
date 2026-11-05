---
specdojo:
  id: prj-0001:pjr-vh8d-execution-records-layout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-05T22:17:27Z"
  derived_from:
    - PJR-2WC2
---

# PJR-VH8D 実行記録のディレクトリ体系と配置を決める

## 1. 背景

exec の plan・result・evidence とジョブの記録の置き場所と命名を決め、混在・散在・ガイドとの食い違いを直す方針を定める

## 2. 入力

- 由来: PJR-2WC2 で利用者が、ディレクトリ体系とファイルの配置のおかしい箇所を直すと決めた（2026-11-06）
- orchestrator の調査 (1): exec/plans と exec/results はどちらも 1 ディレクトリに約 1,170 件。`pjr-*` 772 件・`T-*` 268 件・`JBR-grade-*` 約 100 件が混ざる（2026-11-06）
- orchestrator の調査 (2): exec/plans/done/ は空で、plan-result-lifecycle-guide の「完了した plan を移す」と食い違う（2026-11-06）
- orchestrator の調査 (3): exec/evidence は `PJR-*` 533・`T-*` 64・`JBR-grade-*` 96 のほか、`JBR-...-review` が本体と同じ階層に並び、成果物名の `stsd-register-entry` が 1 件ある。命名が 3 通り混ざる（2026-11-06）
- orchestrator の調査 (4): ジョブの定義は prj-0001/jobs/、実行記録は execution/jobs/runs/、評価の結果は execution/grade/results/、evidence と plan は execution/exec/ の下にあり、1 回のジョブの記録が 4 か所に散る（2026-11-06）
- orchestrator の調査 (5): result のない plan が 2 件、plan のない result が 16 件ある（2026-11-03 の数え）。全 plan に共通の規約（約 3 KB）が埋め込まれ、合計約 3.3 MB が重複する（2026-11-06）
- 決めること: plan・result の分け方（出どころ別か種類別か）、done/ をやめるか移す実装をするか、ジョブの記録を寄せるか、既存のファイルを動かすか新しい分だけにするか、動かす場合に `evidence.json` の `log_refs` などパスを持つ記録をどう扱うか（2026-11-06）
- 制約: 生のログは全文を Git に残す（PJR-2WC2 の決定）。履歴の書き換えは git-branching-standard で禁止されている（2026-11-06）
- orchestrator の調査 (8): 定期処理の実行状態 `routine-state.json` と実行の履歴 `routine-runs.jsonl`（2026-09-19 以降 1,127 件。success 1,092・failure 22・skipped 13、うち job を起動したのは 73 件）が `routines/generated/` にあり、`.gitignore` の `docs/**/generated/*` で無視される。stsd-routine-run が管理場所とする記録の正本が生成物の扱いになっている。Git に残すか、端末の手元の状態として置き場所を変えるかを先に決める（2026-11-06）
- orchestrator の調査 (9): 実行時のロック `routines/.locks/` が文書のツリーにあり無視されていない。`execution/exec/.locks/` は無視されており扱いが揃わない（2026-11-06）
- orchestrator の調査 (10): docs-structure-guide の構成図と `job-weekly-report.yaml` は `reporting/progress-reports` を出力先とするが、prj-0001 に `reporting/` がない（2026-11-06）
- orchestrator の調査 (11): docs-structure-guide は `controls/reviews/` を挙げるが実物はなく、`controls/generated/` がある（2026-11-06）
- orchestrator の調査 (12): 廃棄した文書 22 件が `docs/ja/product/trash/` にあり、プロダクトの文書のツリーの中で公開や索引の対象になりうる。ガイドに置き場所の記載がない（2026-11-06）
- orchestrator の調査 (13): `schedule/assessments/generated/` だけ `generated/` が 1 段深い。ほかの横断ディレクトリは直下に `generated/` を置く（2026-11-06）

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
