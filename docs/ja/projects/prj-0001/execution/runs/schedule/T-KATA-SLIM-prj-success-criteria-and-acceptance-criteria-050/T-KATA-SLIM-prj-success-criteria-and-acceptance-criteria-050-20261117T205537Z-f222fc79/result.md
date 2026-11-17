---
specdojo:
  id: prj-0001:xer-t-kata-slim-prj-success-criteria-and-acceptance-criteria-050-20261117t205537z-f222fc79
  type: exec-result
  task_id: T-KATA-SLIM-prj-success-criteria-and-acceptance-criteria-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-prj-success-criteria-and-acceptance-criteria-050/T-KATA-SLIM-prj-success-criteria-and-acceptance-criteria-050-20261117T205537Z-f222fc79/plan.md
  started_at: "2026-11-17T20:55:45.757Z"
  completed_at: "2026-11-17T21:19:40.295Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:prj-success-criteria-and-acceptance-criteria
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
---

# Edit Result

## 1. 実施内容

- `prj-success-criteria-and-acceptance-criteria-sample.md` から運用の記述と同じ判断の言い直しを外し、sample を簡潔にした。変更したのは sample のみで、成果物本体、recipe、template、rulebook は変更していない。
- 結論（判定基準、閾値、タイミング、必須条件、例外、未決事項の論点）は変えていない。
- 大きさは、空白と表の区切り行を除いた文字数で 2,421 から 1,840 になった（76.0%）。目安の 7 割には届いていない。区切り行を含めると 3,217 から 2,433（75.6%）、バイト数では 8,408 から 6,152 である。
- 目安に届かなかった理由は、plan が外す対象とした役割の段落、承認と agent の段落、検証の表の文書品質の行がこの sample に元々なかったためである。残りの記述は rulebook が要求するものか、変えてはならない結論である。
- 検証では、runner の `lint:md`、`lint:fm`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` が passed だった。`lint:ts` と `typecheck` は対象ファイルがなく `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md`: 未決事項の表から「解決期限 / 判断タイミング」と「責任者」の列を外し、列を「論点」「判定への影響」「当面の扱い」にした。判断タイミングは「当面の扱い」の文に含めた。「完成例である」旨の文、独立していたコスト削減の段落（対象外の項目へ統合）、是正手順の担当の記述も削った。「重大な行き詰まりがない」という判断は AC-03 だけに置き、SC-01 は業務完了の確認だけにした。判定手順は確認者・承認者の列と章タイトルを参照する形にし、「両代表」は「判定対象と適用範囲」で 1 回だけ定義した。表のセルは要点に短縮し、prettier で整形した。

## 3. 申し送り

- `lint:md` と `lint:fm` について、executor は親 runner が実行する検査として `not_run` と記録した。runner 側の実行結果は両方 passed である。
- template の変更案（適用していない）: `docs/ja/specdojo/templates/prj-success-criteria-and-acceptance-criteria-template.md` の「例外条件と未解決事項」に「決定期限と担当を記述する」という指示と、「解決期限 / 判断タイミング」「責任者」の列がある。rulebook の「論点、判定への影響、保留条件、当面の扱い」に合わせ、「論点」「判定への影響」「当面の扱い」の列へ変更するとよい。
- recipe の変更案（適用していない）: `docs/ja/specdojo/recipes/prj-success-criteria-and-acceptance-criteria-recipe.md` が未決事項に判断時期と担当者を求めている（47、127、152 行目）。また測定方法に lint を挙げている（33、136 行目）。slim 方針に合わせ、未決事項は影響と当面の扱いだけにし、文書品質の検査は外すとよい。
- Size: non-whitespace characters excluding table separator rows went from 2,421 to 1,840 (76.0%). Including separator rows: 3,217 to 2,433 (75.6%). Bytes: 8,408 to 6,152. The 70% target was not reached because the role paragraph, approval/agent paragraph and document-quality rows that the plan says to remove were never in this sample. Most of the remaining text is required by the rulebook or is a conclusion that must not change.
- Removed: the unresolved-items columns '解決期限 / 判断タイミング' and '責任者' (owners 店主代表 and 開発担当 no longer appear in the sample). Decision timing now lives in the '当面の扱い' text. Also removed the 'this is a completed example' sentence, the separate cost-reduction paragraph (cost reduction is now listed as out of scope), and the '担当' item in the corrective-action step.
- De-duplication: the 'no serious dead-end' judgement now lives only in AC-03, and SC-01 checks only task completion. The judgement procedure refers to the confirmer/approver columns and section titles instead of repeating them. '両代表' is defined once in '判定対象と適用範囲' and used in the table cells.
- Proposed template change (not applied because the template is out of scope for this task): in docs/ja/specdojo/templates/prj-success-criteria-and-acceptance-criteria-template.md, the '例外条件と未解決事項' instruction says '決定期限と担当を記述する' and its table has the columns '解決期限 / 判断タイミング' and '責任者'. Change these to the columns '論点' / '判定への影響' / '当面の扱い', matching the rulebook ('論点、判定への影響、保留条件、当面の扱い').
- Proposed recipe change (not applied): docs/ja/specdojo/recipes/prj-success-criteria-and-acceptance-criteria-recipe.md asks for a decision time and owner on undecided items (lines 47, 127 and 152). It also lists lint as a measurement method (lines 33 and 136). Under the slim policy, align it with the rulebook: impact and current handling only, and no document-quality checks.

## 4. 進め方と実践の型の適用

根拠としたのは、plan が手本に挙げた sld の試行と改訂済みの `sld-sample.md`、rulebook の必須項目と未決事項の記述要件、sample 執筆標準である。sample は rulebook を正とした。plan に展開された grade と condense の finding はなく、根拠不足による見送りもない。運用の記述は元々少なく、削ったのは未決事項の管理台帳の列、完成例の文、重複した判断の言い直しである。判断基準、閾値、例外、未決事項の論点は維持した。rulebook が要求する記述は残した。
