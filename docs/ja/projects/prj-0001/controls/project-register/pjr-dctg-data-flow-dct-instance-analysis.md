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
| 1   | 現行の Timeline、DCT template、`catalog scaffold` の入力・生成責務を確認する          | ARC  | done | 既存 template と `--var` を再利用し、別形式の template 展開規則を増やさない                  |
| 2   | `dct-plan-<domain>.yaml` の正準配置、schema、更新・差分確認規則を設計する             | ARC  | done | agent 出力をバージョン管理対象とし、`generated/` 配下の派生ビューとは区別する                |
| 3   | agent が読む入力範囲と、成果物候補・placeholder・除外・未確定事項の判定手順を実装する | ARC  | done | data-flow 以外の上流成果物が必要な場合は Timeline の依存先または明示された入力だけを参照する |
| 4   | schema 検証、既存 plan 保護、判定差分の提示を実装する                                 | ARC  | done | agent の自由文を後続ジェネレーターへ直接渡さない                                             |
| 5   | 代表 fixture と異常系を含む自動テストを追加する                                       | ARC  | done | data-flow template の `_TERM_` と product 系の複数 placeholder を最低1件ずつ検証する         |
| 6   | 設計ガイド、rulebook、schema・CLI リファレンスを更新する                              | ARC  | done | agent 判定は draft 作成支援であり、カタログの `primary` 確定ではないことを明記する           |

## 4. 対応結果

- `dct-plan-<domain>.yaml` の schema を `docs/specdojo/schemas/v1/dct-plan.schema.yaml` として定義した。project ID、domain、template、参照した入力文書、`iteration_pattern`、placeholder 値（`variables`）、成果物インスタンス、除外候補、未確定事項、判定理由、確度を機械可読に保持する。カタログ構造（`groups` / `base_path` / `done_criteria`）は保持せず、`additionalProperties: false` で自由文の混入を防ぐ。
- 正準配置は成果物カタログディレクトリ配下の `plans/`（例: `docs/ja/projects/prj-0001/010-deliverables-catalog/plans/dct-plan-data-flow.yaml`）とした。`catalog validate` / `catalog build` が読む `dct-*.yaml` と同階層に置かないことで、カタログとしての誤読を避ける。
- CLI に `catalog plan prompt` / `catalog plan scaffold` / `catalog plan validate` を追加した。`prompt` は data-flow と DCT template を入力にする agent 指示（出力先・schema・入力文書一覧・判定手順・禁止事項）を生成し、特定の agent 製品 API を CLI へ組み込まずに既存の agent 実行経路から利用できる形にした。
- パターンA（`pattern-a`。`_TERM_` を業務領域ごとに置換）とパターンB（`pattern-b`。単一領域を処理単位の固定 `local_id` へ分割）を `iteration_pattern` で区別し、pattern-a では `local_id` が `template_local_id` の展開結果と一致すること、pattern-b では `variables` を使わないことを検証する。
- 根拠を得られない placeholder は推測で確定できない。未解決の placeholder はエラーにし、`open_questions` へ理由と次のアクションを残すよう促す。`blocking: true` の未確定事項がある場合は「生成が止まる」警告を出す。
- 既存 plan は既定で保護する。差分がある場合は上書きせず行単位の差分を表示し、上書きは `--force`、事前確認は `--dry-run` で行う。内容が同一なら書き込みを行わない。キー順を固定して出力するため、再判定時の差分がレビュー可能になる。
- 入力規則を実装した。data-flow が無いドメインは `--input` で上流成果物を明示しない限りエラー、複数 data-flow はすべて（`trash/` 配下の非推奨成果物を除いて）入力に列挙、既存 DCT があるドメインは既存カタログを基準線として入力に記録し差分レビューを促す警告を出す。
- テストを追加した。`tests/src/catalog-plan.test.ts`（40件。正常系・placeholder 未解決・パターンA/B・入力不足・trash 除外・既存 plan 競合・差分・スキーマ違反）と `tests/src/catalog-plan-command.test.ts`（10件。CLI 経由の scaffold / `--from` 取り込み / 検証失敗時の非書き込み / `--force` / validate / prompt 出力）。
- ドキュメントを更新した。[[specdojo:command-reference|CLIコマンドリファレンス]] に `catalog plan` の節、[[specdojo:timeline-design-guide|Timeline設計ガイド]] に判定の位置づけと責務分担、[[specdojo:dct-rulebook|成果物カタログ（ドメイン別）作成ルール]] に判定計画の記述ルールと禁止事項を追加した。
- _ASSUMPTION_: `dct-plan-<domain>.yaml` 自体の実インスタンス（prj-0001 の data-flow 等）は agent 判定の実行結果であり、本タスクでは作成していない。仕組みの提供までを完了範囲とした。
- _TODO_: `package.json` への `validate:schema:dct-plan` script 追加は実行環境の権限制約により未実施。当面は `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/dct-plan.schema.yaml --data "docs/ja/**/plans/dct-plan-*.yaml" --allow-empty` または `specdojo catalog plan validate` を使う。
- 後続の PJR-STRG（決定論的ジェネレーター）は、この判定計画と既存 DCT template から `dct-<domain>.yaml` を生成する。判定計画の存在は `catalog_status: primary` を意味しない。

## 5. 関連ドキュメント

- [[prj-0001:tml-index|トラック順序計画]]
- [[specdojo:timeline-design-guide|Timeline設計ガイド]]
- [[specdojo:dct-rulebook|成果物カタログ（ドメイン別）作成ルール]]
- [[specdojo:deliverables-reference|成果物リファレンス]]
- [[specdojo:dct-data-flow-template|成果物カタログ（データフロー）テンプレート]]
- [[specdojo:command-reference|CLIコマンドリファレンス]]
- 後続: [[prj-0001:pjr-strg-deterministic-dct-strategy-generation|DCTとsch-strategyの決定論的ジェネレーター実装]]
