---
specdojo:
  id: prj-0001:xer-t-kata-slim-pm-organization-040-20261117t153829z-ba5766ee
  type: exec-result
  task_id: T-KATA-SLIM-pm-organization-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-pm-organization-040/T-KATA-SLIM-pm-organization-040-20261117T153829Z-ba5766ee/plan.md
  started_at: "2026-11-17T15:38:35.604Z"
  completed_at: "2026-11-17T15:53:50.183Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-organization
    - specdojo:pm-organization-rulebook
---

# Edit Result

## 1. 実施内容

- `pm-organization-rulebook` から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えた。変更は rulebook 1 ファイルだけで、成果物本体、recipe、template、sample は編集していない。
- 全体方針に「共通の運用」を 1 項目だけ置いた。役割の割り当ては適用先のメンバー定義を参照する。status、承認、改訂と廃止、未決事項の引き継ぎは、ドキュメントメタ情報標準を参照する。
- 型固有の判断基準、推奨 4 表の列、良い例と悪い例、体制変更トリガーと追従先、使用可能な owner、責任境界は維持した。
- 空白を除いた文字数は 4,349 字から 3,327 字になり、76.50% だった。表の区切り行を除く場合は 3,990 字から 3,023 字で、75.76% だった。どちらも目安の 80% 以下である。
- 検証では、executor の Prettier 整形・整形確認と `git diff --check` が成功した。runner の lint:fm、lint:md、lint:mermaid、lint:d2、validate:schema、test:unit、test:integration も成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-organization-rulebook.md`: 共通の文書運用の記述を削り、全体方針の「共通の運用」1 項目から正本を参照する形にした。削ったのは、個別の改訂手順、台帳への登録、Agent の承認禁止、共通禁止事項の再掲である。未決事項は、管理先の指定を論点と体制への影響の記述に置き換えた。章名、見出し、必須区分、推奨 4 表の列、Frontmatter は変更していない。

## 3. 申し送り

- recipe の「見直し条件」にある未決事項の管理記録への引き渡しと、仕上げチェックの共通禁止事項は、正本へ委譲する変更案がある。recipe は今回の対象外のため編集していない。
- sample は、兼務時の承認記録・Agent の最終判断禁止と、末尾の文書改廃・台帳登録の共通手順を削る候補がある。体制固有のトリガー・更新先・判断者と、QE による担当不在・使用不可ロールの受入確認は残す想定である。sample は今回の対象外のため編集していない。
- template の章と列は維持でき、変更案はない。共通の正本への追記も不要と判断した。
- result の実施内容・変更ファイルへ記録: docs/ja/specdojo/rulebooks/pm-organization-rulebook.md を編集。全体方針に「共通の運用」を1項目置き、役割の割り当ては適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準への参照にした。個別の改訂手順、台帳への登録、Agent の承認禁止、個人情報等の共通禁止事項の再掲を除いた。
- 文字数: 改行を含む空白を除き、表の区切り行を含めて4,349字→3,327字（76.50%）。sld試行と同じく表の区切り行も除く場合は3,990字→3,023字（75.76%）。いずれも80%以下。章名、全見出し、必須区分、推奨4表の列、Frontmatter は変更していない。
- 進め方と実践の型の適用へ記録: 根拠は人と組織の定義標準、ドキュメントメタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」「成果物の値制約」、Rulebook 記述標準、共通レビュー観点 vp-arc-conciseness、PJR-8S4T の展開一覧と改訂済み sld-rulebook。prj-overview、prj-0001 の pm-organization、宣言された recipe・template・sample、T-PROJECT-KATA-pm-organization-090 の review result、rulebook の grade result も確認した。grade の findings は空。
- 維持判断: ロール採用・未採用と代替方針、使用可能な owner、責任境界、体制変更トリガーと追従先は組織定義固有の要件として残した。体制変更の良い例には、変更後の RACI・Schedule に担当不在や使用不可ロールが残らない確認を残した。未決事項は管理先の指定から論点と体制への影響へ置き換えた。共通の正本への追記は不要と判断した。
- 対象外ファイルへの変更案: pm-organization-recipe の「見直し条件」にある未決事項の管理記録への引き渡しと、仕上げチェックの共通禁止事項は正本へ委譲する。pm-organization-sample は兼務時の承認記録・Agent の最終判断禁止、末尾の文書改廃・台帳登録の共通手順を削る候補。ただし体制固有のトリガー・更新先・判断者、QE による担当不在・使用不可ロールの受入確認は残す。template の章と列は維持でき、変更案なし。recipe・template・sample・成果物本体・result は編集していない。
- 検証: Prettier 整形・整形確認、git diff --check が成功。補助確認で全見出し・Frontmatter・必須区分・推奨4表の列の維持、共通運用1項目、参照先ID、文字数80%以下、変更対象1ファイルを確認した。親 runner 指定の lint・schema・型検査・テストは executor で重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown rulebook のみで、YAML ファイルの変更はない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下への成果物変更はない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan・result の履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

根拠にしたのは、人と組織の定義標準、ドキュメントメタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」「成果物の値制約」、Rulebook 記述標準、共通レビュー観点 `vp-arc-conciseness` である。PJR-8S4T の展開一覧と改訂済みの `sld-rulebook` も根拠にした。prj-overview、prj-0001 の pm-organization、宣言された recipe・template・sample、T-PROJECT-KATA-pm-organization-090 の review result、rulebook の grade result も確認した。grade の findings は空だった。維持したのは、ロール採用・未採用と代替方針、使用可能な owner、責任境界、体制変更トリガーと追従先で、組織定義に固有の要件にあたる。体制変更の良い例には、変更後の RACI と Schedule に担当不在や使用不可ロールが残らない確認を残した。外したのは、どの成果物にも共通する運用の記述である。recipe・template・sample と矛盾する点は、rulebook を正として変更案を handoff に残した。
