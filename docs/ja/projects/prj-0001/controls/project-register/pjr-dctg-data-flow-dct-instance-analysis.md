---
specdojo:
  id: prj-0001:pjr-dctg-data-flow-dct-instance-analysis
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-16T13:17:17Z"
  due_on: "2026-08-31"
  conclusion: "checkpoint failed: git add -- docs/ja/projects/prj-0001/execution/exec/plans/pjr-dctg-20260818T151438Z-ce4f-plan.md docs/ja/projects/prj-0001/execution/exec/results/pjr-dctg-20260818T151438Z-ce4f-resu…"
---

# PJR-DCTG data-flow等からDCT成果物インスタンスを判定するagentの実装

## 1. 概要

Timeline が着手対象として示す product 系ドメインについて、DCT template と確定済みの上流成果物、特に data-flow を agent が読み、template の placeholder 値、必要な成果物インスタンス、採用しない候補を構造化判定する処理を実装する。判定結果は、後続の決定論的ジェネレーターが同じ入力から再生成できるよう、バージョン管理対象の `dct-plan-<domain>.yaml` として保存する。

agent は候補の意味判断と根拠整理だけを担い、成果物カタログ YAML 自体の組み立て、ID・パスの生成、template 展開、schema 検証はコード側へ委ねる。特定の agent 製品 API を CLI 本体へ直接組み込まず、既存の SpecDojo agent 実行経路から利用できる形にする。

## 2. 完了条件

- `dct-plan-<domain>.yaml` の schema と正準配置先が定義され、少なくとも project ID、対象 domain、参照した文書 ID、template、placeholder 値、成果物インスタンス、除外候補、未確定事項、判定理由、confidence を機械可読に保持できる。
- data-flow と DCT template を入力にする agent 用の指示または実行処理が実装され、自由文ではなく上記 schema に適合する YAML を出力する。
- DCT template の `_TERM_` 等について、複数業務領域へ複製するパターンAと、単一領域を処理単位の固定 `local_id` へ分割するパターンBを区別できる。
- 上流成果物から根拠を得られない placeholder、成果物の要否、名称、依存関係を推測で確定せず、未確定事項として理由とともに残す。
- 同じ入力に対する再判定で既存 plan を無条件に上書きせず、差分をレビューできる。上書きを許す場合は既存 CLI と同じ明示的な `--force` 相当の操作を必要とする。
- data-flow が存在しないドメイン、複数の data-flow が入力になるドメイン、既存 DCT があるドメインを扱う規則が定義されている。
- 正常系、placeholder 未解決、パターンA、パターンB、入力不足、既存 plan 競合を含む unit test または integration test が追加されている。
- Timeline、成果物カタログ、agent 判定、後続ジェネレーターの責務分担と操作手順が関連ガイド・コマンドリファレンスへ反映されている。
- `npm run typecheck`、変更対象に対応する test、`npm run lint:md` が成功する。

## 3. 作業内容

| No  | 作業                                                                                  | 担当 | 状態 | メモ                                                                                         |
| --- | ------------------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------- |
| 1   | 現行の Timeline、DCT template、`catalog scaffold` の入力・生成責務を確認する          | ARC  | open | 既存 template と `--var` を再利用し、別形式の template 展開規則を増やさない                  |
| 2   | `dct-plan-<domain>.yaml` の正準配置、schema、更新・差分確認規則を設計する             | ARC  | open | agent 出力をバージョン管理対象とし、`generated/` 配下の派生ビューとは区別する                |
| 3   | agent が読む入力範囲と、成果物候補・placeholder・除外・未確定事項の判定手順を実装する | ARC  | open | data-flow 以外の上流成果物が必要な場合は Timeline の依存先または明示された入力だけを参照する |
| 4   | schema 検証、既存 plan 保護、判定差分の提示を実装する                                 | ARC  | open | agent の自由文を後続ジェネレーターへ直接渡さない                                             |
| 5   | 代表 fixture と異常系を含む自動テストを追加する                                       | ARC  | open | data-flow template の `_TERM_` と product 系の複数 placeholder を最低1件ずつ検証する         |
| 6   | 設計ガイド、rulebook、schema・CLI リファレンスを更新する                              | ARC  | open | agent 判定は draft 作成支援であり、カタログの `primary` 確定ではないことを明記する           |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:tml-index|トラック順序計画]]
- [[specdojo:timeline-design-guide|Timeline設計ガイド]]
- [[specdojo:dct-rulebook|成果物カタログ（ドメイン別）作成ルール]]
- [[specdojo:deliverables-reference|成果物リファレンス]]
- [[specdojo:dct-data-flow-template|成果物カタログ（データフロー）テンプレート]]
- [[specdojo:command-reference|CLIコマンドリファレンス]]
- 後続: [[prj-0001:pjr-strg-deterministic-dct-strategy-generation|DCTとsch-strategyの決定論的ジェネレーター実装]]
