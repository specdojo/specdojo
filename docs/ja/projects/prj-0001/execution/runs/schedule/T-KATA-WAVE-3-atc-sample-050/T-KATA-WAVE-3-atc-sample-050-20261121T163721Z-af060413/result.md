---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-atc-sample-050-20261121t163721z-af060413
  type: exec-result
  task_id: T-KATA-WAVE-3-atc-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-atc-sample-050/T-KATA-WAVE-3-atc-sample-050-20261121T163721Z-af060413/plan.md
  started_at: "2026-11-21T16:37:26.667Z"
  completed_at: "2026-11-21T16:47:55.630Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:atc-sample
    - specdojo:atc-sample
---

# Edit Result

## 1. 実施内容

- 受入テストカタログの完成例として、`docs/ja/specdojo/samples/atc-sample.md` を更新しました。
- rulebook の標準的な 6 章構成（`## 1. 概要` 〜 `## 6. 受入観点とケース`）に従い、駄菓子屋の現金販売（`atc-cash-sale`）の具体的なケースを含む内容に書き換えました。
- grading 結果で指摘された `F001` 〜 `F029` のうち、`F010`（用語定義の章の不在）を除くほとんどの指摘に対応しました。
- `atc-index-sample.md` との整合性を考慮し、`atc-rulebook.md` を正とした記述（優先度や実施形態など）を適用しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-sample.md`: rulebook の構成に準拠した完成例（駄菓子屋の現金販売）として、概要、環境・データ、受入条件、および具体的な受入観点とケースの記述を追加しました。また、`based_on` や `depends_on` を設定し、整合性を確保しました。

## 3. 申し送り

- F010（用語定義の欠落）は rulebook の必須章にないため、sample に独自の章は足さなかった。用語は rulebook と同じ言葉に揃えた。
- atc-index-sample.md は優先度 P2 と実施形態 assisted を定義しているが、atc-rulebook.md は P0/P1 と manual/automated だけを定義している。atc-sample では rulebook を正とした。atc-index-sample を揃えるか、rulebook に両者の関係を書くかを判断する必要がある。
- atc-index-sample.md のケース表の例は、トレース列に SC/AC/BAC の ID を直接書いている。atc-rulebook.md ではこれが禁止事項（TR-xx を使う）。atc-sample は TR-xx を使った。atc-index-sample の見直しを申し送る。
- atc-rulebook.md の全体方針にある `_UNDECIDED_` の『sample は本文要件の章構成・トレース表・条件・ケース表へ未整合』の一文は、今回の改訂で解消した。削除または更新を rulebook の変更案とする（rulebook はこの段では変更しない）。
- sample 内の `_ASSUMPTION_` 2 件（確定前の取消の業務受入条件がない、レシートに取引番号が印字される前提）は、BAC の取消条件の追加と画面・帳票の設計で確かめる。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan / result / pjr 個票）を変更していない）

## 4. 進め方と実践の型の適用

Rulebook に基づき、受入テストカタログの完成例となる `atc-sample.md` を、駄菓子屋のプロジェクト（`atc-cash-sale`）のコンテキストを用いて詳細に記述しました。`based_on` や `depends_on` を明示し、検証可能なケース（`case_id`、`trace_key` を用いた記述）を盛り込むことで、成果物カタログとしての実践の型を構築しました。また、整合性の観点から `atc-index-sample.md` との差異についても確認を行っています。
