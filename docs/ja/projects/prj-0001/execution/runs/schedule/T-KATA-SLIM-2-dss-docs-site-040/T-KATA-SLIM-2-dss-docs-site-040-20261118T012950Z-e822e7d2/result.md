---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-dss-docs-site-040-20261118t012950z-e822e7d2
  type: exec-result
  task_id: T-KATA-SLIM-2-dss-docs-site-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-dss-docs-site-040/T-KATA-SLIM-2-dss-docs-site-040-20261118T012950Z-e822e7d2/plan.md
  started_at: "2026-11-18T01:29:57.532Z"
  completed_at: "2026-11-18T03:11:51.582Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - dss-docs-site
    - specdojo:dss-rulebook
---

# Edit Result

## 1. 実施内容

- `dss-rulebook` から、どの成果物にも共通する文書運用の記述を外し、共通の正本（`document-metadata-standard` など）への参照に置き換えた。
- 型固有の判断基準、標準の列、章の受入条件、良い例・悪い例、型固有の禁止事項は残した。
- 空白を除いた文字数は 7,061字から 5,603字になり、79.35% に減った。目安の 8 割以下を満たす。表の区切り行も除外すると 6,476字から 5,206字（80.39%）になる。
- 成果物本体、sample、recipe、template、result は変更していない。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/dss-rulebook.md`: 共通運用の記述を外して正本参照に置き換えた。全体方針に「共通の運用」を 1 項目だけ置いた。役割、`status` の維持と昇格、承認、改訂と廃止、未決事項の引き継ぎの記述と、共通規約と重複する禁止事項は削った。用語表の 3 語は本文要件・記述ガイドと重複するため削除し、第2章を「位置づけ」に変更した。第8章「運用ルール」は、recipe・template が不要な理由だけを全体方針へ移して削除した。成果物に求める 8 章の名称・順序・必須区分と、正本の更新責任・検証担当を含む標準列は維持した。

## 3. 申し送り

- sample への変更案: `dss-sample` の第2章の役割分担段落、第8章の PO・PM 等の承認・台帳登録・追跡手順、8.5節の公開条件を共通運用として削除する。規則検証・利用者評価・採用の順序、必須条件未達時の保留、例外の対象規則・理由・影響・検証結果・期限・失効条件は残す。検証表には合格条件を明示する。recipe・template は `not-needed` で、`includes` で取り込む記法の rulebook はない。
- 共通正本への補足案: `document-metadata-standard` は `status`・改訂と廃止・役割別責務・未決事項の引き継ぎを定義している。ただし、同梱文書の公開対象版と公開承認の記録先は明示していない。旧運用ルールにあった公開承認について、公開対象 commit・判断根拠・承認記録を共通規則へ追加する案を申し送る。今回は正本を変更していない。
- 根拠成果物 `docs/ja/product/040-system-design/dss-docs-site.md` は未作成のままである。カタログの受入条件、テーマ実装、完成例から今回の整理を判断できたため、作成や成果物変更は行っていない。
- 判断根拠: sld 試行個票の「他の型へ広げるときの一覧」、改訂済み sld-rulebook、rulebook-authoring-standard、document-metadata-standard、ryu-guide、共通レビュー観点の `vp-arc-conciseness`、dss-sample、dss の grade 記録、カタログとテーマ実装を確認した。grade 記録の finding は両文書ともなし。成果物本体・sample・result は今回編集していない。
- 文字数: Frontmatter を含む全文から空白・改行を除外すると7,061字→5,603字（79.35%）。sld 試行同様に表の区切り行も除外すると6,476字→5,206字（80.39%）。
- 章の変更理由: 用語表の3語は本文要件・記述ガイドと重複するため削除し、rulebook 第2章を「位置づけ」に変更した。第8章「運用ルール」は共通運用・検査・改訂手順の再掲を除き、recipe・template 不要の理由だけ全体方針へ移して章を削除した。成果物に求める8章の名称・順序・必須区分と、正本の更新責任・検証担当を含む標準列は維持した。
- 後続の sample 変更案: dss-sample の第2章の役割分担段落、第8章の PO・PM 等の承認・台帳登録・追跡手順、8.5節の公開条件を共通運用として削除する。規則検証・利用者評価・採用の順序、必須条件未達時の保留、例外の対象規則・理由・影響・検証結果・期限・失効条件は残す。検証表には合格条件を明示する。recipe・template は `not-needed`、includes の記法 rulebook はない。
- 共通正本への補足案: document-metadata-standard は status・改訂廃止・役割別責務・未決事項の引き継ぎを定義しているが、同梱文書の公開対象版と公開承認の記録先を明示していない。旧運用ルールの公開承認については、公開対象 commit・判断根拠・承認記録を共通規則へ追加する案を申し送る。今回は正本を変更していない。
- 根拠成果物 docs/ja/product/040-system-design/dss-docs-site.md は未作成。カタログの受入条件、テーマ実装、完成例から今回の共通運用整理を判断できるため、作成や成果物変更は行わなかった。lint・スキーマ・テストは指定された親 runner の検証に委ねる。
- 対象 `dss-docs-site` は未変更: 本タスクは対応 rulebook のみを編集し、成果物本体を変更しない計画である。宣言パスの成果物は未作成であり、新規作成も行っていない。
- 適用外の検証: `npm run validate:schema:file`（今回の編集は Markdown rulebook のみで、変更した YAML ファイルがない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿・plan・result を編集していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）

## 4. 進め方と実践の型の適用

sld 試行個票の「他の型へ広げるときの一覧」、改訂済みの `sld-rulebook`、`rulebook-authoring-standard`、`document-metadata-standard`、`ryu-guide`、`vp-arc-conciseness`、`dss-sample`、dss の grade 記録、カタログ、テーマ実装を根拠に判断した。grade 記録に finding はなく、成果物から届いた Kata が原因の finding もない。共通運用の記述は削って正本参照にし、型固有の判断基準・標準列・例・禁止事項は維持した。章の変更は、第2章を用語表の削除に伴い「位置づけ」へ変更したこと、第8章を削除したことの 2 点である。変更理由は `changed_files` に記載した。矛盾が生じた場合は rulebook を正とする方針は変えていない。
