---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-index-sample-110-20261125t115301z-4ac168bf
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-index-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-index-sample-110/T-KATA-REVIEW-ALL-nfr-index-sample-110-20261125T115301Z-4ac168bf/plan.md
  started_at: "2026-11-25T11:53:18.647Z"
  completed_at: "2026-11-25T13:07:40.073Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-index-sample
    - specdojo:nfr-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を `nfr-index-sample` に対して実施した。sample の「分冊ドキュメント一覧（ID/参照先）」の備考欄 2 箇所を修正した。rulebook など sample 以外は変更していない。
- F002 は、機密性・安全性の行の備考から分冊側が正本とする目標値（監査ログの保管期間 1 年）の再掲を削り、「`opd-index` と揃える」だけにして解消した。この変更は今回の実行より前から作業コピーに入っていた。executor は内容を確かめて維持した。
- F001 は、運用の行の備考にあった `_UNDECIDED_`（営業時間外の緊急連絡手段）を削る形で対応した。目標値ではない運用カテゴリの細かい中身は索引の責務を超えるため。ただしこの扱いは「要判断」とした。
- 概要、カテゴリ一覧、変更の入口、関連ドキュメント導線は rulebook の本文要件を満たしており、変更なしで維持した。
- 検証は、executor の prettier と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` がすべて passed だった。`validate:history-links` と `validate:schema:file` は履歴ファイルも YAML も変更していないため `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 | `docs/ja/specdojo/samples/nfr-index-sample.md` の「分冊ドキュメント一覧（ID/参照先）」、機密性・安全性の行の備考 | 分冊が正本とする目標値（監査ログの保管期間 1 年）を本書に再掲していた（grade F002）。 | 備考を「監査ログの保管期間は `opd-index` と揃える」にし、値を削った。この変更は今回の実行の前から作業コピーに入っていた。executor は内容を確かめて維持した。 | [[specdojo:nfr-index-rulebook]] の全体方針の責務境界（`nfr-index` は詳細要求を再掲しない）と禁止事項（`nfr-index` にカテゴリ詳細要求を記述する）。 | - |
| 2 | R1 | `docs/ja/specdojo/samples/nfr-index-sample.md` の「分冊ドキュメント一覧（ID/参照先）」、運用の行の備考 | `_UNDECIDED_: 営業時間外の緊急連絡手段` は目標値ではない運用カテゴリの細かい中身で、索引の責務を超える。同じ章の「目標値が `_UNDECIDED_` の分冊は、その指標で合否を判定せず、発生の記録だけを残す」という扱いの決まりにも当てはまらない。grade F001 は決める時期を足すよう求めている。しかし、その観点 `vp-po-decision-readiness` は kata の段のレビューに使わない観点とされている。 | 備考を `-` にした。未決事項は `nfr-operations` 分冊で扱う。残す場合は、可用性の行と同じように決める時期か同時に決める文書（例: `opd-incident-management` と同時に決める）を添える。 | [[specdojo:nfr-index-rulebook]] の責務境界・禁止事項、[[specdojo:kata-guide]] の「kata の観点の組」。 | 要判断 |
| 3 | R1 | `docs/ja/specdojo/samples/nfr-index-sample.md` の概要、カテゴリ一覧、変更の入口、関連ドキュメント導線 | rulebook の本文要件の受入条件（分冊管理の目的と正本、8 カテゴリの目的と代表指標、5 種類の変更の更新対象と完了条件、導線と `（なし）` の明示）を満たしており、足す・削る内容はなかった。 | 変更なし（維持）。 | [[specdojo:nfr-index-rulebook]] の本文要件と記述ガイド、[[specdojo:sample-authoring-standard]]。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-index-sample.md`: 「分冊ドキュメント一覧（ID/参照先）」の備考欄を 2 行修正した（差分は 2 行追加・2 行削除）。機密性・安全性の行は、再掲していた目標値（監査ログの保管期間 1 年）を削り、「監査ログの保管期間は `opd-index` と揃える」にした。運用の行は、備考の `_UNDECIDED_`（営業時間外の緊急連絡手段）を削り `-` にした。

## 3. 申し送り

- F001 の対応は「要判断」。備考を削る代わりに、決める時期や同時に決める文書を添えて `_UNDECIDED_` を残す案もある（例: `opd-incident-management` と同時に決める）。
- grade F001 の観点 `vp-po-decision-readiness` は、kata-guide の「kata を agent でレビューする」で kata の段のレビューに使わない観点とされている。このため、決定時期を足す方向ではなく削る方向で対応した。
- No: 1 / 段: R1 / 箇所: `docs/ja/specdojo/samples/nfr-index-sample.md` の「分冊ドキュメント一覧（ID/参照先）」の機密性・安全性の行の備考 / 指摘: 分冊が正本とする目標値（監査ログの保管期間 1 年）を本書に再掲していた（grade F002）。 / 直した案: 備考を「監査ログの保管期間は `opd-index` と揃える」にし、値を削った（この変更は今回の実行の前から作業コピーに入っており、内容を確かめて維持した）。 / 根拠: [[specdojo:nfr-index-rulebook]] の全体方針の責務境界（`nfr-index` は詳細要求を再掲しない）と禁止事項（`nfr-index` にカテゴリ詳細要求を記述する）。 / 印: -
- No: 2 / 段: R1 / 箇所: `docs/ja/specdojo/samples/nfr-index-sample.md` の「分冊ドキュメント一覧（ID/参照先）」の運用の行の備考 / 指摘: `_UNDECIDED_: 営業時間外の緊急連絡手段` は目標値ではない運用カテゴリの細かい中身で、索引の責務を超える。同じ章の「目標値が `_UNDECIDED_` の分冊は、その指標で合否を判定せず、発生の記録だけを残す」という扱いの決まりにも当てはまらない。grade F001 は決める時期を足すよう求めているが、その観点 `vp-po-decision-readiness` は kata-guide の「kata を agent でレビューする」で kata の段のレビューに使わない観点とされている。 / 直した案: 備考を `-` にした。未決事項は `nfr-operations` 分冊で扱う。残す場合は、可用性の行と同じように決める時期か同時に決める文書（例: `opd-incident-management` と同時に決める）を添える。 / 根拠: [[specdojo:nfr-index-rulebook]] の責務境界・禁止事項、[[specdojo:kata-guide]] の「kata の観点の組」。 / 印: 要判断
- No: 3 / 段: R1 / 箇所: 概要、カテゴリ一覧、変更の入口、関連ドキュメント導線 / 指摘: rulebook の本文要件の受入条件（分冊管理の目的と正本、8 カテゴリの目的と代表指標、5 種類の変更の更新対象と完了条件、導線と `（なし）` の明示）を満たしており、足す・削る内容はなかった。 / 直した案: 変更なし（維持）。 / 根拠: [[specdojo:nfr-index-rulebook]] の本文要件と記述ガイド、[[specdojo:sample-authoring-standard]]。 / 印: -
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票などの履歴ファイルを変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

approach は sample-maintenance。根拠に使った規範は、`specdojo:nfr-index-rulebook` の責務境界・禁止事項・本文要件、`specdojo:sample-authoring-standard`、`specdojo:kata-guide` の「kata を agent でレビューする」と「kata の観点の組」。F002 は、`nfr-index` が詳細要求を再掲しない方針に従って値を削り、解消した。F001 は、観点が kata の段のレビュー対象外であることと索引の責務に照らして削る形で対応し、「要判断」の印を付けた。再評価は grade 側で行う。grade result サイドカーは直接編集していない。
