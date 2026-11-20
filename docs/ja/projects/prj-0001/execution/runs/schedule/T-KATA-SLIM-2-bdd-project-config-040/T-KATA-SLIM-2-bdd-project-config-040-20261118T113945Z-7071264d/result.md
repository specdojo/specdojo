---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-bdd-project-config-040-20261118t113945z-7071264d
  type: exec-result
  task_id: T-KATA-SLIM-2-bdd-project-config-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-bdd-project-config-040/T-KATA-SLIM-2-bdd-project-config-040-20261118T113945Z-7071264d/plan.md
  started_at: "2026-11-18T11:39:58.078Z"
  completed_at: "2026-11-18T13:03:15.518Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - bdd-project-config
    - specdojo:bdd-rulebook
---

# Edit Result

## 1. 実施内容

- `bdd-rulebook.md` から、どの成果物にも共通する文書運用の記述を外し、全体方針の「共通の運用」1項目から共通の正本を参照する形にした。
- 外した記述は、役割の記述、`status` の昇格と承認、改訂と廃止の手順、台帳登録の段落、重複する用語定義、共通禁止事項、業務受入確認内の整形・modeline 検査である。
- BDD 固有の判断基準、本文要件の必須・任意・条件付き区分、業務照合の6行は維持した。
- 空白除去後の全文字数（Frontmatter 含む）は 13,107 字から 10,085 字になり、変更前の約 76.94% になった。
- executor の検証（`prettier --check`、`git diff --check`）は成功した。runner の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`test:integration`、`validate:schema`、`test:unit` も成功した。`lint:ts` と `typecheck` は変更種別により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/bdd-rulebook.md`: 共通の文書運用の記述を外し、全体方針に「共通の運用」を1項目だけ置いて共通の正本を参照する形にした。重複する用語定義と共通禁止事項、業務受入確認内の整形・modeline 検査、rulebook 自体の enum 確認手順も削除した。第2章は「位置づけ」に改め、「個別の構造・modeline 検証」は「個別の構造検証」に改めた。「全体検証と整形」と「rulebook 改訂候補の enum 網羅確認」は削除し、手動照合の連番を振り直した。本文要件の必須・任意・条件付き区分と業務照合6行は変えていない。差分は 16 行追加、67 行削除。

## 3. 申し送り

- 共通の正本への変更案: `rulebook-authoring-standard` の enum 網羅検証に、次の共通手順を補う余地がある。draft 候補で schema の全 enum 値と本文の位置を直接照合し、対象・版・定義位置・合否を残す手順である。既存の自動検査は ready のみが対象のためである。本段では正本を変更せず、提案にとどめた。
- 章構成の変更（第2章の改名と、検証章の改名・削除）は、重複の除去と、文書品質の検査を業務確認から分離したことによるものである。本文要件の必須・任意・条件付き区分は変えていない。
- result 記載用: 変更ファイルは docs/ja/specdojo/rulebooks/bdd-rulebook.md のみ。役割、status 昇格・承認、文書の改訂・廃止、台帳登録の手順を外し、全体方針の「共通の運用」1項目に集約した。重複する用語定義と共通禁止事項、業務受入確認内の整形・modeline 検査、rulebook 自体の enum 確認手順を削除した。
- 判断根拠: SLD 試行個票の「他の型へ広げるときの一覧」、改訂済み sld-rulebook、document-metadata-standard、rulebook-authoring-standard、共通規約、共通レビュー観点の `vp-arc-conciseness`、BDD schema・sample・bdd-register-entry と既存 grade result を確認した。bdd-project-config.yaml は未作成だが、カタログの対象宣言と既存資料から判断できる範囲を改訂した。
- 構造の記録: 重複する用語定義を除いたため、第2章を「位置づけ」に変更した。文書品質の検査を業務確認から分離したため、「個別の構造・modeline 検証」を「個別の構造検証」に変更し、「全体検証と整形」と「rulebook 改訂候補の enum 網羅確認」を削除した。手動照合は連番を振り直した。本文要件の必須・任意・条件付き区分と、業務照合6行は変更していない。
- result 記載用: 空白除去後の全文字数（Frontmatter 含む）は13,107字から10,085字へ減少し、変更前の76.94%となった。Frontmatter、本文要件、業務照合表の一致と schema の文字列 enum 全10値の本文記載を確認した。成果物本体・sample・recipe・template・result・設定・grade result は編集していない。includes の宣言はない。
- 共通正本への変更案: rulebook-authoring-standard の enum 網羅検証には、draft 候補で schema の全 enum 値と本文位置を直接照合し、対象・版・定義位置・合否を残す共通手順を補う余地がある。既存の自動検査は ready のみが対象のため。本段では正本を変更せず提案に留めた。sample・recipe・template の追従変更は不要と判断した。親 runner が担当する検証は実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown rulebook のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 内のみで、docs/ja/projects/ 配下を変更していない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル、plan、result を変更していない。）

## 4. 進め方と実践の型の適用

根拠にしたのは、sld 試行の個票にある「他の型へ広げるときの一覧」と、改訂済みの `sld-rulebook`、`document-metadata-standard`、`rulebook-authoring-standard`、共通規約、`vp-arc-conciseness` である。あわせて BDD の schema、sample、`bdd-register-entry` と既存の grade result も確認した。これらに基づき、共通の運用の記述を共通の正本への参照に置き換え、BDD 固有の判断基準、本文要件、業務照合条件は維持した。`bdd-project-config.yaml` は未作成だが、カタログの対象宣言と既存資料から判断できる範囲を改訂した。`includes` の宣言はないため、取り込み先の rulebook の整理はない。recipe・template・sample は変更しておらず、追従して直す点もないと判断した。
