---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-notation-cnd-sample-080-20261123t082434z-659fea17
  type: exec-result
  task_id: T-KATA-WAVE-6-NOTATION-cnd-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-NOTATION-cnd-sample-080/T-KATA-WAVE-6-NOTATION-cnd-sample-080-20261123T082434Z-659fea17/plan.md
  started_at: "2026-11-23T08:24:38.175Z"
  completed_at: "2026-11-23T08:39:45.618Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:cnd-sample
  condense_records:
    - location: 3.5. External Software System 末尾の段落「外部決済・会計サービスへの接続は本図にはない。」
      category: repetition
      action: delete
      reason: 概要の対象外の記述（キャッシュレス決済・本格会計は対象外）と同じ主張のため。意味は概要に残る。
      cause:
        type: document
    - location: 4.2. 検証対象の確認結果「結合対象」末尾の「途中保存の照合・回復方式は未確定で、「メモ / 将来課題」へ引き継ぐ。」
      category: repetition
      action: delete
      reason: 同じ内容が検証対象表の保存先の障害の行と、メモ / 将来課題の表の応答欠落・保存中断の行にあるため。
      cause:
        type: document
    - location: 3.3. Container 直後の段落「画面資材の配信は営業中の販売経路ではなく配備時の前提であり、配信元が決まるまで図と関係表に描かない。」
      category: repetition
      action: delete
      reason: 営業中と配備時の区別は技術前提・制約に、描かない経路の理由は確認結果の範囲と経路に、配信元の未確定はメモ / 将来課題にあり、3 箇所で重複していたため。
      cause:
        type: document
    - location: 1. 概要 第3段落、2. 図直後の矢印の説明段落、3.4 Data Store 直後の引き継ぎ先の記述
      category: canonical-restatement
      action: retain
      reason: 上位図が未接続であることと別構成との関係、来店客を Person に含めない理由、引き継ぎ先の示し方は、判断に要る背景・例外であり他の箇所と重複しないため。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- cnd-sample.md の冗長な記述を整理しました。
- 以下の 3 箇所の重複・冗長な記述を削除しました：
- 3.5. External Software System 末尾の、概要の範囲外に関する記述
- 4.2. 検証対象の確認結果における、保存先の詳細に関する記述
- 3.3. Container 直後の、配備時の前提および配信元に関する記述
- なお、上位図との関係や、引き継ぎ先の示し方など、判断の根拠となる重要な背景・例外情報は `retain` として保持しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cnd-sample.md`: 冗長な記述（他システムへの接続範囲、検証結果の保存先、および配備時の前提条件）を削除し、構成を簡潔に整理しました。

## 3. 申し送り

- 適用外の検証: `npm run lint:md`（親 runner が実行する許可リスト検査のため、executor では実行しない）

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `3.5. External Software System 末尾の段落「外部決済・会計サービスへの接続は本図にはない。」` | `repetition` | `delete` | `概要の対象外の記述（キャッシュレス決済・本格会計は対象外）と同じ主張のため。意味は概要に残る。` | `document` |
| `4.2. 検証対象の確認結果「結合対象」末尾の「途中保存の照合・回復方式は未確定で、「メモ / 将来課題」へ引き継ぐ。」` | `repetition` | `delete` | `同じ内容が検証対象表の保存先の障害の行と、メモ / 将来課題の表の応答欠落・保存中断の行にあるため。` | `document` |
| `3.3. Container 直後の段落「画面資材の配信は営業中の販売経路ではなく配備時の前提であり、配信元が決まるまで図と関係表に描かない。」` | `repetition` | `delete` | `営業中と配備時の区別は技術前提・制約に、描かない経路の理由は確認結果の範囲と経路に、配信元の未確定はメモ / 将来課題にあり、3 箇所で重複していたため。` | `document` |
| `1. 概要 第3段落、2. 図直後の矢印の説明段落、3.4 Data Store 直後の引き継ぎ先の記述` | `canonical-restatement` | `retain` | `上位図が未接続であることと別構成との関係、来店客を Person に含めない理由、引き継ぎ先の示し方は、判断に要る背景・例外であり他の箇所と重複しないため。` | `document` |
