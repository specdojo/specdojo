---
specdojo:
  id: prj-0001:pjr-sdxb-bootstrap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-12T01:12:02Z"
  due_on: "2026-08-31"
---

# PJR-SDXB bootstrapテンプレートに仕上げ品質チェックを追加

## 1. 概要

xep-bootstrap-template.mdの完了手順に、内容の質を上げる基本操作（不要記述の削除・重複記述の統合・可読性のための分割・論理整合の確認）を単発の仕上げチェックとして追加する。観点別自己レビュー・修正ループとは区別し、既存の禁止事項と矛盾しないよう記述する。フレームワーク共通ファイルのため他プロジェクトへの影響を確認のうえ反映する。

## 2. 完了条件

- `xep-bootstrap-template.md` の「6. 完了手順」の前に、内容の質を上げる基本操作（不要記述の削除・重複記述の統合・可読性のための分割・論理整合の確認）を明記した節が追加されている。
- 追加した節が、既存の「下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わない」という制約と矛盾しない記述（単発の仕上げ操作であり、多観点レビューループではないことが読み取れる記述）になっている。
- `ryu-guide.md` の `bootstrap` approach の説明（1.2.2）と矛盾しないことを確認している。
- `npm run lint:md` がエラーなく通る。
- フレームワーク共通ファイルであるため、`prj-0001` 以外で `bootstrap` approach を使用している track・プロジェクトへの影響有無を確認し、対応結果に記録している。

## 3. 作業内容

| No  | 作業                                                                         | 担当 | 状態 | メモ                                                                   |
| --- | ---------------------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------- |
| 1   | `xep-bootstrap-template.md` の現状構成を確認し、追加節の挿入位置を決める     | ARC  | done | 旧「6. 完了手順」の直前に新節を挿入し、以降の章番号を繰り下げ          |
| 2   | 4操作（削除・統合・分割・論理整合）を明記した節を追加する                    | ARC  | done | 「6. 仕上げの品質チェック」として追加                                  |
| 3   | 既存の自己レビューループ禁止の記述と矛盾しないか確認する                     | ARC  | done | 単発の仕上げ操作であり多観点レビューループではない旨を冒頭で明記       |
| 4   | 他 track・他プロジェクトでの `bootstrap` approach 使用箇所への影響を確認する | ARC  | done | 対象は `prj-0001` のみ。既存生成済み plan は静的ファイルのため影響なし |
| 5   | `npm run lint:md` を実行し、エラーがないことを確認する                       | ARC  | done | エラーなし。`npx markdownlint` / `npm test` も実行し合格               |

## 4. 対応結果

- `docs/ja/specdojo/templates/xep-bootstrap-template.md` に「6. 仕上げの品質チェック」を追加した。不要記述の削除・重複記述の統合・可読性のための分割・論理整合の確認の4操作を、1回だけ通しで実施する仕上げ操作として定義した。
- 追加節の冒頭に「単発の仕上げ操作であり、観点別の自己レビュー・修正ループではない。同じ観点での再確認を繰り返さず1巡で終え、多観点での検証は後続の独立した review task に委ねる」と明記し、「完了の狙い」章および `ryu-guide.md` の「通常の成果物編集では観点別の自己レビューを行わず、多観点での判定と証跡は独立したレビューが担う」という記述と矛盾しないようにした。
- 章番号を繰り下げ、旧「6. 完了手順」を「7. 完了手順」、旧「7. 異常終了の条件」を「8. 異常終了の条件」とした。完了手順の旧手順3（成果物と各実践の型の相互矛盾の確認）は新節の「論理整合の確認」に包含されるため、「「仕上げの品質チェック」の4操作を1回だけ実施する（成果物と各実践の型の相互整合の確認を含む）」に置き換え、記述の重複を避けた。
- `ryu-guide.md` の `bootstrap` approach の説明（1.2.2 の approach 表: 「成果物と rulebook / recipe / sample / template を同じタスクで初期作成し、互いに矛盾しない一式として揃える」）と矛盾しないことを確認した。approach の参照方針・対象範囲は変更していないため、`ryu-guide.md` の修正は不要と判断した。
- 影響確認: 本リポジトリのプロジェクトは `prj-0001` のみで、`bootstrap` approach は `sch-strategy-launch.yaml`（`bootstrap-pass`）と `sch-strategy-data-flow.yaml`（`overview-bootstrap-pass` / `area-bootstrap-pass`）で使用されている。いずれの `bootstrap` タスクも実行済みで、生成済みの plan は静的ファイルのため本変更の影響を受けない。影響が及ぶのは今後生成・再生成される `bootstrap` の plan のみ。
- テンプレートを参照するコード・設定（`src/` / `tools/` / `*.yaml`）に `xep-bootstrap-template` の章番号へ依存する箇所がないことを確認した。`npm test`（79 files / 1051 tests）も合格している。

## 5. 関連ドキュメント

- 変更対象（`docs/` 内だが `id` 未登録のため相対パス表記）: `docs/ja/specdojo/templates/xep-bootstrap-template.md`
- approach 定義の正本: [[specdojo:ryu-guide]]
- 提案の経緯を記録したメモ: [[prj-0001:pjr-ez9g-sch-strategy-bootstrap-human-review]]
- 対になる todo: [[prj-0001:pjr-aqmw-fully-guided-refine-pass-rulebook]]
- 同一ファイルへの過去の変更履歴: [[prj-0001:pjr-0102-xep-fully-guided-template]]（`xep-fully-guided-template.md` 側の類似修正例）
