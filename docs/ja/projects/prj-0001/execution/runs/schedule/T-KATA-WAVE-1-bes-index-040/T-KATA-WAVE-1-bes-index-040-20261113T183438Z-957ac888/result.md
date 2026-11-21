---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-bes-index-040-20261113t183438z-957ac888
  type: exec-result
  task_id: T-KATA-WAVE-1-bes-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-bes-index-040/T-KATA-WAVE-1-bes-index-040-20261113T183438Z-957ac888/plan.md
  started_at: "2026-11-13T18:34:44.401Z"
  completed_at: "2026-11-13T21:12:31.673Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - bes-index
    - specdojo:bes-index-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/bes-index-rulebook.md` を改訂し、業務イベント一覧の作成における参照記法、イベント追加・廃止時の追従手順、担当ロール、検証方法、および公開前提条件を具体化しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/bes-index-rulebook.md`: F003, F005, F006, F009, F010, F011, F012, F017 の指摘に対応。具体的には、参照元の追従対象・担当ロールの明記、wikilink 記法の採用、標準列変更時の影響範囲、ID の整合性検証コマンド、判定可能な禁止表現への置き換え、`document-metadata-standard` への参照、およびイベント追加・廃止手順を記述しました。

## 3. 申し送り

- reporter 記録用（根拠）: rulebook-authoring-standard、document-metadata-standard、docs-structure-guide、bes-rulebook、pm-review-viewpoints.yaml の該当観点、PJR-2GD6、成果物 bes-index・cdfd-overview・bes-task-ready-selected、bes-index-sample・clis-sample、grade results の specdojo.bes-index-rulebook.yaml・specdojo.bes-index-sample.yaml、T-KATA-WAVE-1-bes-index-005 の result.md を確認した。plan の成果物由来 finding・condense 記録はなし。旧 grade の指摘箇所は現行本文と照合した。
- reporter 記録用（変更ファイル）: docs/ja/specdojo/rulebooks/bes-index-rulebook.md のみ。F003/F005/F006/F009/F010/F011/F012/F017 に対応し、追従対象・担当、wikilink、列変更の影響、ID検証、判定不能な省略の禁止、schema の所在、追加・廃止手順を具体化した。
- reporter 記録用（維持・判断）: F002 は発生境界・時点・起点・相関を一行で判定できるかを基準として維持し、根拠のない項目数の閾値は設けなかった。F004/F007/F008/F013/F015 は現行の本文要件・列順の一文・requirement 宣言・標準章名・bes-&lt;event&gt; 表記で解消を確認した。時点を『一語』に限定する規定は、成果物と良い例の記述に合わせて削除した。
- reporter 記録用（要否判断・公開条件）: recipe は上位 CDFD の起点イベントから一覧を起こし、詳細化判断を bes-rulebook に委ねられるため not-needed。template は対象範囲ごとに一つの一覧で、本文要件の構成・列定義で開始できるため not-needed。既存宣言を維持した。F001/F016 に対して完成例照合・要否判断記録・未解決指摘確認を公開前提に追加し、未決判断の表示方法を明記した。status は draft のまま。
- reporter 記録用（完成例）: F014 が指摘した一覧欠落は、現行 bes-index-sample の10領域・10行・必須8列の具体例で解消を確認した。完成例は外出しを維持し、sample 文書 ID とイベント ID の区別をメタ情報標準に合わせて明記した。sample・recipe・template の後続整合と grade 再評価は予定された後続段で行う。既存 rulebook/sample は sidebar に登録済みで、新規文書はない。
- 範囲外の既存不整合: docs/ja/projects/prj-0001/010-deliverables-catalog/dct-business-model-bes.yaml の bes-index overview は『10プロセス領域』だが、現行 cdfd-overview と成果物 bes-index は14領域。BA/PO がカタログの更新要否を判断する。今回の rulebook には固定件数を規定しなかった。
- CHANGELOG 文案（変更）: 業務イベント一覧の作成ルールに、参照記法、イベント追加・廃止と参照元の追従、検証・公開条件を明記。親 runner の lint・schema・型検査・テスト結果は後続で evidence に追加される。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ のみで、docs/ja/projects/ に及ばない。）
- 適用外の検証: `npm run validate:history-links`（executor は PJR 個票・plan.md・result.md を変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
