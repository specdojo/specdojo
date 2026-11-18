---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-bac-init-040-20261118t152944z-3a7deaa8
  type: exec-result
  task_id: T-KATA-SLIM-2-bac-init-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-bac-init-040/T-KATA-SLIM-2-bac-init-040-20261118T152944Z-3a7deaa8/plan.md
  started_at: "2026-11-18T15:29:55.269Z"
  completed_at: "2026-11-18T16:00:56.563Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - bac-init
    - specdojo:bac-rulebook
---

# Edit Result

## 1. 実施内容

- docs/ja/specdojo/rulebooks/bac-rulebook.md から、成果物に共通する文書運用の記述（役割の段落、用語の表、`draft` の指定、改訂・廃止の手順、ロールごとの確定条件と lint 検査、未決事項の担当・判断時点・追跡先および PJR 登録に関する記述）を削除しました。
- 全体方針に「共通の運用」項目を設け、ドキュメントメタ情報標準とメンバー定義を参照する形式に変更しました。
- rulebook 自身の見出しを調整し、「位置づけと用語定義」を「位置づけ」に、「確認完了と確定の条件」を「確認完了の条件」に変更しましたが、成果物の章名および必須区分は維持しています。
- 文書サイズは空白を除き、4,728 字から 3,779 字（79.9%）に削減しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/bac-rulebook.md`: 文書運用の共通記述を削除し、ドキュメントメタ情報標準等への参照に置き換え、構成を簡素化しました。

## 3. 申し送り

- 大きさ: 空白（改行を含む）を除き、表の区切り行を除いた文字数で、前 4,728 字・後 3,779 字（79.9%）。
- 章名と区分: 成果物の章名（概要・受入条件・メモ / 将来課題）と必須の区分は変えていない。rulebook 自身の見出しは、用語の表を外したため「位置づけと用語定義」を「位置づけ」に、確定の判断を共通の運用へ移したため「確認完了と確定の条件」を「確認完了の条件」に変えた。
- 用語の表（受入対象・シナリオ・判定方法）は本文要件と記述規約の言い直しのため外した。受入対象の意味は全体方針の括弧書きへ移した。
- 推奨 Frontmatter 項目の schema への Markdown の相対リンクを、インラインコードのパス表記に置き換えた。
- 変更案（template）: `bac-template.md` のメモ / 将来課題の表から「担当・判断者」「判断時点・解消条件」「追跡先」の列を外し、「論点 / 影響するシナリオ ID・受入への影響 / 当面の扱い」にする。概要の役割の表（`_CONFIRMER_ROLE_`・`_APPROVER_ROLE_`）は業務側の確認者と合意対象の表にする。
- 変更案（recipe）: `bac-recipe.md` の手順 5 の「判断依頼先、解消時点、追跡先」、手順 6 のロールごとの追従（BA・QE・ARC・PO・PM）、メモの節の「PM へ PJR 登録候補として渡す」とその良い例、品質確認の表の「合意と継承」行のロール表記を外し、影響と当面の扱いに寄せる。
- 変更案（sample）: `bac-sample.md` 冒頭の承認・確定条件の言い直し、メモ / 将来課題の表の担当・判断者・判断時点・追跡先の列と、PM へのリスク登録の記述を外す。概要の役割の表は業務側の確認者と合意対象に絞る。
- 共通の正本（ドキュメントメタ情報標準）への追記は不要と判断した。外した記述は「成果物の値制約」と「文書の改訂・廃止とライフサイクル変更管理」で賄える。
- 適用外の検証: `npm run validate:history-links`（変更は rulebook だけで、plan・result・個票などの履歴ファイルを変更していないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T15:32:51.681Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
