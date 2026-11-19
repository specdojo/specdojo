---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-pm-risk-register-040-20261119t134851z-b1310838
  type: exec-result
  task_id: T-KATA-SLIM-2-pm-risk-register-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-pm-risk-register-040/T-KATA-SLIM-2-pm-risk-register-040-20261119T134851Z-b1310838/plan.md
  started_at: "2026-11-19T13:48:57.240Z"
  completed_at: "2026-11-19T14:00:52.543Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-risk-register
    - specdojo:pm-risk-register-rulebook
---

# Edit Result

## 1. 実施内容

- `pm-risk-register-rulebook.md` から共通の運用記述を削除し、`docs/ja/specdojo/standards/document-metadata-standard.md` 等への参照に置き換えた。
- リスク登録簿が個票から生成される位置づけであることを明記し、F013・F014 の矛盾を解消した。
- 評価基準、対応計画の内容、監視の判断基準など、型固有の記述を拡充し、複数の finding（F001, F003-F005, F007, F011, F017）に対応した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-risk-register-rulebook.md`: 共通運用（役割、`status` 遷移、承認手順、検査等）の記述を削除して標準文書への参照とした。一方で、リスク評価・対応計画・モニタリングにおける具体的な判断基準や必須項目を追加し、実務的な制約を明確化した。また、登録簿の生成位置づけを定義した。

## 3. 申し送り

- 大きさ: 空白と表の区切り行を除いた文字数で、前 1,296 字、後 1,846 字（142%）。8 割の目安を超えた。理由は、元の rulebook に外す記述がほとんどなく（外せたのは用語の表と Frontmatter の表だけ）、F001・F003〜F005・F007・F011・F013・F014・F017 の対応と、登録簿から生成する位置づけの節を足す必要があったため。
- 章名と必須の区分は変えていない。第 2 章の名前を『位置づけと用語定義』から『位置づけ』に変え、用語の表（`pm-plan`・`pm-risk-register`・`pm-issue-log` の言い直し）を外した。F015 の章名『推奨 Frontmatter 項目』は、既存の成果物との対応を保つため変えていない。章の中身はドキュメントメタ情報標準への参照にした。
- F013・F014: rulebook 側では、登録簿を使うプロジェクトでは `item_type: risk` の個票から `register build` が生成し、生成物は `rulebook: specdojo:pjr-rulebook` とし直接編集しないと位置づけに書いた。template（`specdojo:pm-risk-register-template`）が派生ビューである点とは矛盾しなくなった。template の宣言を単独の登録簿用と生成ビュー用に分けるかは、template を対象とする段で判断する（変更案）。
- sample の変更案（この段の対象外）: (1) 優先度とステータスを登録簿の `priority`・`item_status` の値にそろえる。(2) 評価基準に、発生確率と影響度の組み合わせから優先度を決める対応表を置く。(3) 対応計画に期限・完了条件と、受容する場合の判断者・残存影響を書く。(4) モニタリングに、見直しが行われなかったときの連絡先を書く。
- F001・F002・F008・F016: 承認・公開・ready への昇格・役割の区別は、共通の運用（メンバー定義とドキュメントメタ情報標準）に任せた。リスク固有の意思決定者として、再評価を判断する者と受容を判断した者を書かせる形にした。F009・F010: 改訂の手順と文書の検査は、共通の正本とリポジトリの検証で扱うため、rulebook には足していない。F006: 冒頭文に、回避する業務上の影響（納期・品質）を書いた。
- 共通の正本への追記は不要と判断した。保護された設定の変更も不要だった。
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票などの履歴ファイルを変更していない（変更は rulebook のみ））
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-19T13:50:26.486Z に再開

## 4. 進め方と実践の型の適用

共通運用記述を削除し標準文書への参照に切り替えるとともに、finding に基づきリスク管理特有の判断基準（評価・対応・監視）を rulebook に具体的に定義することで、実務上の検証可能性と整合性を向上させた。
