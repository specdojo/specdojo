---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-sysd-cross-cutting-policy-060-20261118t211111z-a467ceea
  type: exec-result
  task_id: T-KATA-SLIM-2-sysd-cross-cutting-policy-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-sysd-cross-cutting-policy-060/T-KATA-SLIM-2-sysd-cross-cutting-policy-060-20261118T211111Z-a467ceea/plan.md
  started_at: "2026-11-18T21:11:19.066Z"
  completed_at: "2026-11-18T21:41:48.762Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - sysd-cross-cutting-policy
    - specdojo:sysd-cross-cutting-policy-recipe
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/recipes/sysd-cross-cutting-policy-recipe.md` から、共通の運用記述（役割、公開・承認）、未決事項管理台帳の列定義、および rulebook と重複する判断基準の言い直しを削除しました。
- 記述内容を書く順番とその理由、入力情報の収集元、執筆時の問いとコツ、深掘りの順序に絞り込み、 recipe の冗長さを解消しました。
- 文字数（空白除く）は 4700 字から 3067 字（約 65%）に削減し、8 章の構成を維持しつつ Recipe 記述標準に準拠させました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/sysd-cross-cutting-policy-recipe.md`: 共通運用（役割・承認条件）、未決事項台帳の列定義、rulebook と重複する判断基準および同一確認の繰り返しを削除し、記述を簡素化しました。

## 3. 申し送り

- 文字数（空白を除く）: 変更前 4700 字、変更後 3067 字（約 65%）。result の実施内容に記録する。
- 変更案（template、この段では直していない）: `docs/ja/specdojo/templates/sysd-cross-cutting-policy-template.md` の「利用・確認・承認責務」の表と「公開・昇格の判断条件」の節は、役割と `status` 昇格という共通の運用にあたる。メンバー定義とドキュメントメタ情報標準に委ねて外す案。
- 変更案（template）: 「報告と追跡」の表にある報告者・追跡者・再確認者の列と、「判断待ちと後続への影響」の表にある判断者・担当・判断期限・次アクションの列は、未決事項の管理台帳の列にあたる。rulebook の本文要件（対象 Rule ID、論点と影響、当面の扱い）に合わせて絞る案。
- rulebook と sample には、合わせて直すべき点は見つからなかった。
- Kata 起因の finding（grade / condense）はなかった。見直しの根拠は、rulebook の本文要件と記述ガイド、Recipe 記述標準、手本の `prj-charter-recipe`、PJR-7M9J の「他の recipe へ広げるときの一覧」。
- 適用外の検証: `npm run validate:history-links`（plan・result・個票などの履歴蓄積ファイルを変更していない）

## 4. 進め方と実践の型の適用

Recipe 記述標準および手本となる `prj-charter-recipe` の改訂結果に基づき、共通運用や rulebook と重複する判断基準を徹底的に排除しました。具体的には、役割表、`status` 昇格条件、未決事項管理台帳の詳細列、およびレビュー観点と仕上げチェックで重複していた確認事項を削除し、書き手の思考をガイドする「問い」と「コツ」に特化した構成へと見直しました。
