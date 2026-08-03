---
specdojo:
  id: prj-0001:pjr-0147-retrofit-design-docs-for-existing-implementation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0147 実装先行（コード先行）時に設計書/仕様書/要件書へ反映・新設するapproachの整備

## 1. 概要

実装が既に存在するにもかかわらず、対応する設計書・仕様書・要件書が未整備、または実装内容と文書内容が乖離しているケースがある。この場合に、実装を正本として成果物へ「反映」または「新設」する新しい`approach: retrofit`を新設し、対応する plan テンプレート（`xep-retrofit-template.md` / `xrp-retrofit-template.md`）を作成する。

## 2. 完了条件

- 実装先行が発生し得る対象範囲（成果物カタログ`dct-*.yaml`で管理される文書種別）が明確化されている。
- 実装と文書の乖離を検知する方法（レビュー時のチェック、既存の exec/review フロー内での確認等）が定義されている。
- 既存文書へ「反映」する場合と、文書を「新設」する場合の判断基準が定義されている。
- `retrofit` approach の参照方針・進め方が [[specdojo:kata-guide|実践の型活用ガイド]] の「初期整備・横断整理」に追加されている。
- `xep-retrofit-template.md`（edit）が作成されている。
- `xrp-retrofit-template.md`（review）が作成されている。
- `exec-common.schema.yaml` の `Approach` enum に `retrofit` が追加され、依存する各 schema（exec-plan / exec-result / sch-strategy frontmatter）に反映されている。
- 関連ガイド（`exec-config-guide.md`、`plan-result-lifecycle-guide.md`）に `retrofit` approach の記載が反映されている。

## 3. 作業内容

| No  | 作業                                                                       | 担当 | 状態 | メモ |
| --- | -------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 実装先行が発生している既存箇所の洗い出し（サンプル調査）                   | ARC  | open | -    |
| 2   | 文書への「反映」/「新設」の判断基準の設計                                  | ARC  | open | -    |
| 3   | 乖離検知の方法（レビュー観点・チェックタイミング）の設計                   | ARC  | open | -    |
| 4   | `retrofit` approach の参照方針・進め方の設計とkata-guide.mdへの反映        | ARC  | open | -    |
| 5   | `xep-retrofit-template.md`（edit用plan テンプレート）の作成                | ARC  | open | -    |
| 6   | `xrp-retrofit-template.md`（review用plan テンプレート）の作成              | ARC  | open | -    |
| 7   | `exec-common.schema.yaml` の `Approach` enum への `retrofit` 追加          | ARC  | open | -    |
| 8   | 関連ガイド（exec-config-guide.md、plan-result-lifecycle-guide.md）への反映 | ARC  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[specdojo:docs-structure-guide|ドキュメント構成ガイド]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
- [[specdojo:kata-guide|実践の型活用ガイド]]
- [[specdojo:plan-result-lifecycle-guide|plan/resultライフサイクルガイド]]
- [[specdojo:exec-config-guide|exec設定ガイド]]
