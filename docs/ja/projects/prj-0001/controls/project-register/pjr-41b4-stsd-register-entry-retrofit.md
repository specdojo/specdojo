---
specdojo:
  id: prj-0001:pjr-41b4-stsd-register-entry-retrofit
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-05T11:24:41Z"
  completed_at: "2026-11-05T11:49:07Z"
  conclusion: 部分反映。5 章・8 状態・T-01〜T-18 を保ち、結論と履歴の正本、終了点を置かない理由を実装と Kata に合わせた
  derived_from:
    - PJR-3APD
    - PJR-PT5N
  depends_on:
    - PJR-PT5N
  approach: retrofit
  targets:
    - prj-0001:stsd-register-entry
---

# PJR-41B4 stsd-register-entry を確定した Kata と実装に合わせる（retrofit）

## 1. 概要

3APD の段 8。ステータス定義（登録項目個票）を、確定した stsd の Kata と現行の実装（カタログの evidence_refs）に合わせて retrofit する。成果物は既にある

## 2. 入力

- Kata は PJR-PT5N で確定した。代表の 1 件 stsd-task-execution（PJR-Q9AW・PJR-MC63）を書き方の参考にできるが、宣言された資料ではないため、根拠には実装とカタログを使う
- 図の分割は stsd-mermaid-rulebook の閾値を超える場合だけ行い、閾値以下の図は 1 つのままにする（PJR-PT5N）

## 3. 完了条件

- [[stsd-register-entry]] が、[[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]] の必須の章・表・図の規則を満たしている（終了点を置くか置かないかと、置かない場合の「概要」の書き方を含む）。
- 状態一覧の状態と遷移の説明の各行が、カタログの `evidence_refs` の実装で確かめられる。実装で確かめられないことは推測で埋めず、`_UNDECIDED_` か今後の検討メモで残す。既存の記述と実装が食い違う場合は、どちらに合わせたかと理由を result に書く。
- 図の分割は、図の rulebook の閾値を超える場合だけ行っている。
- 遷移 ID を振り直していない（既存の文書の場合）。
- `stsd-register-entry` 以外の成果物と Kata は変えていない。Kata に直すべき点を見つけた場合は、変えずに result の申し送りに書く。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 実装と既存の記述を照らし、維持・部分反映・作り直し・新設を決める | BA   | open | -    |
| 2   | 文書を直し、検査を通す                                           | BA   | open | -    |

## 5. 対応結果

- 判断: 部分反映。既存の 5 章・8 状態・18 遷移は有効なため維持した。状態の判定条件を正本の `item_status` にそろえ、業務上の充足条件は未確認範囲を明記して第 5 章へ保持した。T-01〜T-18 は振り直していない。
- 実装照合（一致）: `src/register/item.ts` を全体参照し、`VALID_STATUSES` の 8 状態、`TERMINAL_STATUSES_SET` の完了・決定済み・却下・延期、`item_status` の読み書き（未設定・空欄時は読み取りで `open`）、日時と結論の Frontmatter 保持を確認した。`src/register/register.ts` も全体参照し、旧履歴変換の `add` / `start` / `wait` / `review` / `close` / `reject` / `defer` / `reopen` / `update` の分類、実際の遷移元・先の保持、個票内 event の外部ファイルへの移行を確認した。履歴分類は現在の遷移の許可条件とは区別した。
- 反映した乖離: 本文としていた結論の正本を Frontmatter の `conclusion` に、個票内としていた履歴の保管先を外部 event ファイルに修正した。終了点を置かない理由に業務上の到達点と再開・記録更新の継続理由を明記した。起票済みへの入出力遷移が 6 を超えるため 3 図を維持し、図間の接続状態を明示した。
- 未反映の乖離・判断待ち: 再開先は起票済みとする既存の業務方針を保持した。旧履歴変換が終端から任意の非終端への変更を `reopen` に分類する事実だけでは、直接再開を業務上許可した根拠にならないためである。起票済み経由とみなす旧仮定は撤回した。対応中・待機中からの却下・延期、`note` の着手・終了制約も指定実装では再確認できず、既存方針を保持して未決とした。PO・ARC が方針を決め、必要に応じて文書更新または別の実装修正タスクに分ける。
- 実装から確認不能: 承認者の業務権限、承認方式の妥当性、人間が判断責任を担う根拠はコードから確定できない。既存の業務方針とプロジェクトの判断原則を保持し、PO・BA の合意対象とした。
- 未確認: `src/register/create-commands.ts`、`src/register/transition-commands.ts`、`src/register/update.ts` は指定エビデンス外として遷移仕様の追加調査をしていない。許可元状態、起票時の初期状態、状態別必須項目、type 別終端先・承認者・証跡、人間と Agent の操作境界、成功・失敗時の制御、再開時の結論保持・完了日時削除、`epic` の実行制約、外部 event の整合性検証・日時検証の本体は未確認である。カタログの `evidence_refs` の追加を別途検討し、ARC・QE が検証設計の確定前に確認する。
- 依存資料: カタログと [[prj-0001:prj-overview|プロジェクト概要]] を参照した。`docs/ja/product/010-business-specs/020-data-model/bdd-register-entry.yaml` は未作成のため読めず、`based_on` は空のまま維持した。BA は辞書の作成後に用語を照合し、依存 ID を追加する。Kata と他の成果物、実装は変更していない。
- 検証: `npx prettier --write` で変更した 2 ファイルを整形した。`node --import tsx tools/catalog-validate-if-configured.mjs`、`npm run validate:history-links`、`node --import tsx src/specdojo.ts register build`、`git diff --check` は成功した。カタログには未作成文書の警告があるがエラーはない。一時スクリプト `python3 tmp/pjr-41b4-check-stsd.py` でも必須章・8 状態・既存 18 遷移 ID の維持、図と表の全遷移・条件の一致、到達性、分割閾値、終了点の省略理由、frontmatter 不変を確認した。一時スクリプトは削除済みである。自分の変更は Markdown のみのため `validate:schema:file` は非適用とする。`lint:md`・`lint:fm`・`lint:mermaid` を含む親検証は runner に委ねる。result は reporter が記入する。

## 6. 関連ドキュメント

- `stsd-register-entry`: 対象の成果物
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: 確定した Kata（PJR-PT5N）
