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
