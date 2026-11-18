---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-cop-specdojo-operations-040-20261118t071214z-8e98d946
  type: exec-result
  task_id: T-KATA-SLIM-2-cop-specdojo-operations-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-cop-specdojo-operations-040/T-KATA-SLIM-2-cop-specdojo-operations-040-20261118T071214Z-8e98d946/plan.md
  started_at: "2026-11-18T07:12:24.154Z"
  completed_at: "2026-11-18T07:40:54.312Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:cop-specdojo-operations
    - specdojo:cop-rulebook
---

# Edit Result

## 1. 実施内容

- `cop-rulebook` から、どの成果物にも共通する運用の記述を外し、全体方針の「共通の運用」1 項目からドキュメントメタ情報標準を参照する形に改めた。
- 外した記述は、運用方針の段落、Frontmatter の項目表、大きな埋め込みサンプル、共通規約と重複する禁止事項。
- Frontmatter 規約は、`specdojo:` 名前空間、`rulebook` 必須、`title` なしへ直した。これで F006・F007・F011 を解消した。
- 型固有の finding である F001・F002・F003・F004・F010 は、本文要件と記述ガイドに反映した。
- 大きさは、空白と表の区切り行を除いて 5,985 字から 3,325 字になった(55.6%)。目安の 8 割以下を満たしている。
- F012 は未解消である。`specdojo:cop-sample` が本 rulebook の 10 章構成に沿っていないためで、変更案は handoff に記載した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cop-rulebook.md`: 運用の記述を削って共通の正本への参照にした。全体方針に「共通の運用」を 1 項目置き、役割・status・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準を参照させた。Frontmatter の項目表と大きな埋め込みサンプルは外し、サンプルは Frontmatter 例と当日タイムライン・判定ポイントの最小例だけを残した。型固有の要件として、概要の `_UNDECIDED_` の論点と影響、内部限定の連絡先を「担当者/連絡系統」に閉じる判断基準、実施者をメンバー定義の役割で書く要件、実施条件の他チーム・後続予定への依存、判定条件を照合対象・閾値・証跡で書く要件と禁止事項を追加した。第 5 章名は「本文構成(標準テンプレ)」から「本文要件」に改名した。成果物の 10 章の章名と必須の区分は変えていない。

## 3. 申し送り

- F012 は未解消。`specdojo:cop-sample` は「目的と適用範囲」など独自の 5 章で、本 rulebook の 10 章構成に沿っていない。変更案は次のとおり。cop-sample を駄菓子屋の販売管理システムの切替を例に、10 章(概要〜関連ドキュメント)と各表の標準の列で作り直す。判定条件は照合対象・閾値で書き、共通の運用の参照文は書かない。作り直した後に、rulebook の「サンプル(最小・整合版)」の章(経過措置)を外すかを判断する。sample は commit の対象外のため本タスクでは変更していない。
- F005・F008・F013・F014 は rulebook に個別の規定を足さず、共通の運用としてドキュメントメタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」と「成果物の値制約」への参照に置き換えた。F009 は、文書品質の検査を業務の受入条件に入れない方針により rulebook に入れなかった。
- plan の根拠成果物 `docs/ja/projects/prj-0001/060-migration-planning/cop-specdojo-operations.md` が存在せず、成果物との照合はできなかった。
- 変更ファイル: docs/ja/specdojo/rulebooks/cop-rulebook.md のみ。成果物本体・sample・recipe・template は変更していない。
- 大きさ（空白と表の区切り行を除く文字数）: 前 5,985 字、後 3,325 字（55.6%）。
- rulebook 自身の第 5 章を「本文構成（標準テンプレ）」から「本文要件」に改名した。理由は rulebook-authoring-standard の標準章名に合わせ、同じ段で直した `cop-index-rulebook` と揃えるため。成果物の 10 章の章名と必須の区分（全章必須）は変えていない。
- finding の扱い: F006/F007/F011 は Frontmatter を `specdojo.type: operations`・`specdojo.rulebook: specdojo:cop-rulebook`・`title` なしへ直して解消した。F001 は概要に `_UNDECIDED_` の論点と影響、F002 は内部限定の連絡先を「担当者/連絡系統」に閉じる判断基準と禁止事項、F003 は実施者をメンバー定義の役割で書く要件、F004 は実施条件に他チーム・後続予定への依存、F010 は判定条件を照合対象・閾値・証跡で書く要件と禁止事項を足して対応した。F005（登録簿への転記）・F008（変更時の追従）・F013（`ready` の条件）・F014（改訂・更新責任）は共通の運用として、ドキュメントメタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」と「成果物の値制約」への参照に置き換えた。F009（lint・検証コマンド）は、文書品質の検査を業務の受入条件に入れない方針により rulebook に入れなかった。
- F012 は未解消: `specdojo:cop-sample` は「目的と適用範囲」など独自の 5 章で、本 rulebook の 10 章の構成に沿っていない。変更案: cop-sample を駄菓子屋の販売管理システムの切替を例に、10 章（概要（`&lt;term&gt;`）〜関連ドキュメント）と各表の標準の列で作り直す。判定条件は照合対象・閾値で書き、共通の運用の参照文は書かない。作り直した後に、rulebook の「サンプル（最小・整合版）」の章（経過措置）を外すかを判断する。
- rulebook の「サンプル」の章は、rulebook-authoring-standard の「個別の改訂で先行して削除しない」に従い、Frontmatter の例と当日タイムライン・判定ポイントの最小例だけを残した。
- 根拠: pjr-8s4t の「他の型へ広げるときの一覧」、sld-rulebook と cop-index-rulebook（改訂済み）、rulebook-authoring-standard、document-metadata-standard、deliverable-frontmatter.schema.yaml。plan の根拠成果物 `docs/ja/projects/prj-0001/060-migration-planning/cop-specdojo-operations.md` は存在せず、成果物との照合はできなかった。
- 共通の正本への追記は不要と判断した（ドキュメントメタ情報標準で外した記述を賄える）。保護された設定の変更は不要。
- 適用外の検証: `npm run validate:history-links`（変更したのは rulebook だけで、plan・result・pjr の個票は変更していないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T07:15:13.354Z に再開

## 4. 進め方と実践の型の適用

根拠は、pjr-8s4t の「他の型へ広げるときの一覧」、改訂済みの sld-rulebook と cop-index-rulebook、rulebook-authoring-standard、document-metadata-standard、deliverable-frontmatter.schema.yaml。運用の記述は共通の正本への参照に置き換え、型固有の判断基準・区分・禁止事項・受入確認は残した。Frontmatter の不整合(F006・F007・F011)は規約に合わせて直した。型固有の指摘(F001・F002・F003・F004・F010)は本文要件と記述ガイドに反映した。F012 は sample が commit の対象外のため、変更案として申し送った。共通の正本への追記は不要と判断した。rulebook の「サンプル」の章は、rulebook-authoring-standard の「個別の改訂で先行して削除しない」に従い、最小の例を残して維持した。
