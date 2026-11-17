---
specdojo:
  id: prj-0001:pjr-8s4t-sld-kata-slim-pilot
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-11-17T12:48:46Z"
  derived_from:
    - PJR-0T83
  commit_type: docs
  commit_scope: kata
---

# PJR-8S4T sld の rulebook と sample から文書の運用の記述を外し、共通の正本への参照にする（試行）

## 1. 概要

業務仕様までの sample の冗長さを減らす試行として、sld 1 件で運用の記述を共通の正本へ寄せ、同じ判断の言い直しを除く。効果を確かめてから他の rulebook と sample へ広げる

## 2. 入力

- PJR-0T83 の対応策 (2)・(4) の試行である。利用者が 2026-11-17 に、sld 1 件で試してから他の rulebook と sample へ広げる進め方（案 C から B）を選んだ
- orchestrator の調査（2026-11-17）: sld-sample は 40KB（空白を除いて約 10,000 字）で業務仕様までの sample で最も大きい。運用・検証の章が全体の約 28% を占める。保管場所ごとの削除の条件を、保管場所一覧の表・3 区分の判断・場面別の対処・検証手順の 4 か所で書き、CDSD・STSD・CLIS との対応も 1.1 節と 4.1 節に二重にある。冒頭に役割の段落、検証の表に prettier・lint:md の行、末尾に PO の承認と agent の draft 維持の段落がある。表のセルは 1 行 700 字前後ある
- sld-rulebook（24KB）は、BA・ARC・DEV・QE・PM・OPS・PO の役割の表と status・承認の手順を持ち、「関連仕様・実装配置との対応と検証」を必須の章、「確認事項と変更影響」を条件付きの章として求める。status・承認・改訂と廃止の正本はドキュメントメタ情報標準にある

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
