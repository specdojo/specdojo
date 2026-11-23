---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-mtp-sample-050-20261123t134207z-b9881329
  type: exec-result
  task_id: T-KATA-WAVE-5-mtp-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-mtp-sample-050/T-KATA-WAVE-5-mtp-sample-050-20261123T134207Z-b9881329/plan.md
  started_at: "2026-11-23T13:42:36.592Z"
  completed_at: "2026-11-23T13:56:31.771Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mtp-sample
    - specdojo:mtp-sample
---

# Edit Result

## 1. 実施内容

- 移行テスト計画の sample 文書（`docs/ja/specdojo/samples/mtp-sample.md`）を、rulebook の必須構成に従って、駄菓子屋きぬやの具体的な移行リハーサルの完成例として再構成しました。
- `mip-index-sample` や `dmd-index-sample` との整合性を高めるため、`based_on` による参照の追加、および停止許容・許容差・判定者などの値の具体化を行いました。
- grading によって指摘された構成の欠落（`## 1. 概要` から `## 9. 関連ドキュメント` まで）および、内容の具体性（業務シナリオ、環境、合否基準の記述）の不足を解消しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mtp-sample.md`: rulebook の必須 9 章構成（概要から関連ドキュメントまで）に則り、駄菓子屋の販売管理システムにおける移行リハーサルの具体的な設定値（回数、判定基準、対象範囲、環境、判定者など）を盛り込んだ完成例へと書き換えました。`based_on` による上位文書への参照も追加し、`Prettier` による整形を適用しています。

## 3. 申し送り

- `_UNDECIDED_:` 仮置きの切替日と定休日の曜日（第1回リハーサルの予定日が決まらないため、店主代表が準備フェーズの開始前に決める）。
- `_UNDECIDED_:` 臨時休業の開始時刻（合否基準の所要時間の基準になる。店主代表が第1回の実測を見て第2回の前までに決める）。
- `_ASSUMPTION_:` 定休日は週1日あり、リハーサルはその午前に行う。販売管理システムは本番の台帳と分けたリハーサル用の保存先を持つ。
- rulebook の変更案: 6.1 合否基準の良い例は件数の判定者を QE にしているが、`mip-index-sample` の成功条件では件数の判定者が開発担当（DEV）。sample は `mip` に合わせて DEV にした。rulebook の例と `mip` のどちらに揃えるか決める必要がある。
- rulebook の変更案: 「関連ドキュメント」章は分冊への導線だけを求めている。F018 は上位文書（`mip`/`dmd`/`cop`/`otp`）への参照を求めているため、上位文書への導線も書いてよいと rulebook に明記するか検討する。
- rulebook の frontmatter で `recipe` と `template` が `undecided` のまま残っている。
- PJR-76N9 に従い、文書を作る・確かめる・承認する役割の割り当ては本文に書いていない。合否判定者・GO/NO-GO の判断者・データ準備の担当は、rulebook が求める文書の中身として Role code で書いた。
- rulebook の変更案: 6.1 合否基準の良い例は件数の判定者を QE にしているが、mip-index-sample の成功条件では件数の判定者が開発担当（DEV）。sample は mip に合わせて DEV にした。rulebook の例と mip のどちらに揃えるか決める必要がある。
- rulebook の変更案: 「関連ドキュメント」章は分冊への導線だけを求めている。F018 は上位文書（mip/dmd/cop/otp）への参照を求めているため、上位文書への導線も書いてよいと rulebook に明記するか検討する。
- rulebook の frontmatter で recipe と template が undecided のまま残っている。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/mtp-sample.md だけで、plan・result・個票などの履歴ファイルを変更していない）

## 4. 進め方と実践の型の適用

Rulebook の必須構成（`## 1. 概要` から `## 9. 関連ドキュメント`）に従い、`docs/ja/specdojo/samples/mtp-sample.md` を「駄菓子屋きぬや」の具体的な移行リハーサル計画の完成例として書き直しました。`mip-index-sample` や `dmd-index-sample` との整合性を保つため、`based_on` による参照や、具体的な判定基準・環境・役割の割り当てを記述しました。また、未決定事項については `_UNDECIDED_` を使用して残しています。
