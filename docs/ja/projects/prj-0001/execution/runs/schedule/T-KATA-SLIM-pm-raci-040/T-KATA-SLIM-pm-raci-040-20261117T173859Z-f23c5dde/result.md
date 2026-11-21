---
specdojo:
  id: prj-0001:xer-t-kata-slim-pm-raci-040-20261117t173859z-f23c5dde
  type: exec-result
  task_id: T-KATA-SLIM-pm-raci-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-pm-raci-040/T-KATA-SLIM-pm-raci-040-20261117T173859Z-f23c5dde/plan.md
  started_at: "2026-11-17T17:39:07.357Z"
  completed_at: "2026-11-17T18:06:14.095Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-raci
    - specdojo:pm-raci-rulebook
---

# Edit Result

## 1. 実施内容

- `pm-raci-rulebook.md` から、どの成果物にも共通する文書運用の記述を外し、共通正本への参照に置き換えた。空白を除いた文字数は 4,173 字から 3,323 字（79.63%、850 字削減）になり、目安の 8 割以下に収まった。
- 全体方針に「共通の運用」を 1 項目だけ置いた。役割の割り当ては適用先のメンバー定義へ、status・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` へ委譲した。
- 章名・章順・必須/条件付きの区分・Frontmatter は変更していない。成果物本体、recipe、template、sample、result、grade サイドカーも編集していない。
- runner の検証は `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` が passed。`lint:ts` と `typecheck` は変更種別により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-raci-rulebook.md`: 役割の段落、status の維持と承認、改訂と廃止の手順、台帳への引き継ぎ手順、上位標準と重なる列名、Agent 承認の禁止を削除し、全体方針の「共通の運用」1 項目からの参照に置き換えた。文書品質の検査はリポジトリで扱う旨を明記した。成果物別・判断プロセス別の二表、一行一つの A・一つ以上の R、採用 Role の選択と省略理由、複数 R の主担当と担当範囲、WBS の明示 owner の優先、承認・レビュー・外部待ちの例外、不一致時の更新先、見直し対象、良否例、固有の禁止事項は維持した。責任境界と影響タスク・当面の扱いも残した。

## 3. 申し送り

- 後続の変更案（recipe）: 「見直し条件」にある管理記録への引き継ぎに関する問いが共通運用と重複している。整理を検討してほしい。責任変更の論点、影響、当面の扱い、見直し完了条件は残す。
- 後続の変更案（sample）: 「見直し条件」にある改訂・廃止の参照と、管理台帳への登録・追跡の段落が共通運用と重複している。整理を検討してほしい。
- template の追従変更、共通正本への追記、保護設定の変更は、executor が不要と判断した。
- 対象 rulebook の既存 grade result に finding はなく、編集前の内容ハッシュと一致していた。成果物側の既存 4 件の finding は原因が document で、本タスクでは成果物を編集していない。正式な再 grade は未実施である。
- reporter は result の実施内容・変更ファイル・進め方と実践の型の適用へ本報告を記録してください。変更は docs/ja/specdojo/rulebooks/pm-raci-rulebook.md のみです。成果物本体、recipe、template、sample、result、grade サイドカーは編集していません。
- 判断根拠: PJR-8S4T「他の型へ広げるときの一覧」、改訂済み sld-rulebook、rulebook-authoring-standard、document-metadata-standard、people-and-organization-definition-standard、共通規約、`vp-arc-conciseness` を確認しました。適用実績として prj-0001 の pm-raci・pm-organization、宣言先の recipe・template・sample、T-PROJECT-KATA-pm-raci-040 の改訂結果、T-LAUNCH-pm-raci-090 のレビュー結果、対象 rulebook と成果物の grade result を確認しました。
- 全体方針の「共通の運用」1項目で、役割の割り当てを適用先のメンバー定義へ、status・承認・改訂と廃止・未決事項の引き継ぎをメタ情報標準へ委譲しました。改訂管理の役割段落、台帳への引き継ぎ手順、上位標準と重なる列名・Agent 承認の禁止を削除しました。文書品質の検査はリポジトリで扱う旨を明記しました。
- 成果物別・判断プロセス別の二表、一行一つの A・一つ以上の R、採用 Role の選択と省略理由、複数 R の主担当と担当範囲、WBS の明示 owner の優先、承認・レビュー・外部待ちの例外、不一致時の更新先、見直し対象、良否例、固有の禁止事項を維持しました。責任境界と影響タスク・当面の扱いを残し、共通の管理手順だけを参照へ置き換えました。章名・章順・必須区分・Frontmatter は変更していません。
- 文字数は Frontmatter を含む全文から空白・改行を除いて計測し、4,173字→3,323字（79.63%、850字削減）でした。試行と同じく表の区切り行も除く計測では4,079字→3,229字（79.16%）です。見出し・Frontmatter の一致、共通運用項目が一つであること、wikilink 参照先の存在、変更対象が rulebook のみであることを確認しました。
- 後続の変更案: recipe「見直し条件」の管理記録への引き継ぎに関する問いと、sample「見直し条件」の改訂・廃止参照および管理台帳への登録・追跡段落を共通運用との重複として整理してください。責任変更の論点、影響、当面の扱い、見直し完了条件は残します。template の追従変更、共通正本の追記、保護設定の変更は不要と判断しました。
- 対象 rulebook の既存 grade result は finding なしで、編集前の内容ハッシュとの一致を確認しました。成果物側の4件の既存 finding は原因が document であり、本タスクでは成果物を編集していません。正式な再 grade は実施していません。指定された lint・schema・型検査・単体／結合テストは親 runner に委ねています。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown rulebook のみで、変更した YAML ファイルがありません。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下に成果物の変更がありません。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan・result を変更していません。）

## 4. 進め方と実践の型の適用

rulebook メンテナンスとして、PJR-8S4T「他の型へ広げるときの一覧」と改訂済み `sld-rulebook`、`rulebook-authoring-standard`、`document-metadata-standard`、`people-and-organization-definition-standard`、共通規約、`vp-arc-conciseness` を根拠に見直した。適用実績として prj-0001 の pm-raci・pm-organization、宣言先の recipe・template・sample、T-PROJECT-KATA-pm-raci-040 の改訂結果、T-LAUNCH-pm-raci-090 のレビュー結果、対象 rulebook と成果物の grade result も確認した。RACI 固有の判断基準と区分、標準の列と章の受入条件、良否例、固有の禁止事項は維持した。どの成果物にも共通する運用の記述だけを正本参照に置き換えた。文字数は Frontmatter を含む全文から空白・改行を除いて計測した。試行と同じく表の区切り行も除く計測では 4,079 字から 3,229 字（79.16%）だった。見出しと Frontmatter の一致、共通運用項目が 1 つであること、wikilink の参照先の存在、変更対象が rulebook のみであることを確認した。
