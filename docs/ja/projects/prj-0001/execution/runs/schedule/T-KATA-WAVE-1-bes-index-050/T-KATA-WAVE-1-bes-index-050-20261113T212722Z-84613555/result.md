---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-bes-index-050-20261113t212722z-84613555
  type: exec-result
  task_id: T-KATA-WAVE-1-bes-index-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-bes-index-050/T-KATA-WAVE-1-bes-index-050-20261113T212722Z-84613555/plan.md
  started_at: "2026-11-13T21:27:29.687Z"
  completed_at: "2026-11-13T21:46:42.163Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - bes-index
    - specdojo:bes-index-sample
---

# Edit Result

## 1. 実施内容

- 業務イベント一覧の完成例（`bes-index-sample.md`）について、目的との整合性、利用者・確認者の明示、未決事項への判断担当・完了条件の追加、および具体的な受入条件を整備しました。
- 個別業務イベントの完成例（`bes-sample.md`）との双方向参照を修正し、相互参照性を向上させました。
- `recipe` および `template` については、`rulebook` の記述内容および上位成果物から十分に作成可能であると判断し、`not-needed` 宣言を維持しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bes-index-sample.md`: 目的・課題・役割の明示、未決事項への影響・Role code・次アクション・完了条件の追記、受入条件の定義、およびつけ上限超過等の改訂影響に関する記述を追加し、内容を充実させました。
- `docs/ja/specdojo/samples/bes-sample.md`: `bes-index-sample.md` との双方向参照を確保するため、導入部の記述を修正しました。

## 3. 申し送り

- reporter 記録用（変更ファイル）: docs/ja/specdojo/samples/bes-index-sample.md に目的との対応、利用者・確認者、例外の影響・担当・判断時期・完了条件、PJR 報告、受入条件、つけ上限超過の改訂影響を追加。補充依頼の受領時点、現金会計の条件・事実データ、月末締めの境界を修正した。docs/ja/specdojo/samples/bes-sample.md は既存一覧への双方向参照に必要な導入2段落のみ修正。成果物本体・result・grade サイドカーは変更していない。
- reporter 記録用（根拠）: xp-common-conventions-template、xep-common-conventions-template、pm-orchestrator-playbook、sample-authoring-standard、rulebook-authoring-standard、document-metadata-standard、bes-index-rulebook、bes-rulebook、ryu-guide の実践の型メンテナンス、pm-review-viewpoints.yaml の各 finding と同じ観点を確認。成果物 bes-index・cdfd-overview、共通文脈の prj-overview-sample・cdfd-overview-sample・bes-sample・clis-sample、PJR-2GD6、specdojo.bes-index-sample.yaml の grade、先行タスク T-KATA-WAVE-1-bes-index-040・045 の result を照合した。成果物由来の grade/condense 記録は plan 上なし。
- reporter 記録用（finding 対応）: F001/F006/F008/F019 は目的・課題・役割・上位範囲への対応を明示。F002/F003/F004/F005 は未決事項に影響・Role code・次アクション・完了条件・判断時期と PM から PO への報告を追加。F007/F010/F011/F015/F016/F017/F018 は既存の具体的な10行・必須8列の表を維持し、上位10領域の起点文言と全件照合。旧 grade の7列・テンプレート前提に対して、現行 rulebook の8列・template 不要宣言を正とした。
- reporter 記録用（検証・保守）: F009/F013 は受入条件から rulebook の『検証と引き渡し』とメタ情報の正本へ参照し、コマンド・schema 制約を再掲しなかった。F014/F020 は発生有無・回数、網羅、必須列、ID、個別 BES、未決事項、静的検査、QE 確認と人間 PO の承認を受入条件にした。F012 はつけ境界変更時の BPS・BR・UI・テスト・契約への影響を具体化。F021 の sample 保守は sample-authoring-standard の運用ルールに従い、rulebook 変更時に構成・表を手動追従し、再整形・構造照合・親検証・grade 再評価を行う。今回の変更に実装・schema・生成処理への変更はない。
- reporter 記録用（維持・要否判断）: recipe は上位 CDFD から一覧を起こし、詳細化判断を bes-rulebook に委ねられるため不要。template は rulebook の本文構成・列定義・判断ガイドで作成できるため不要。既存の recipe: not-needed、template: not-needed、sample: specdojo:bes-index-sample 宣言を維持した。rulebook は標準章構成・連番・良い例/悪い例を備え、完成例を外出し済みのため変更不要。既存 sample は sidebar 登録済みで、新規文書はない。
- reporter 記録用（判断の限界）: 旧記述の『月末の締め＝最終営業日の日次締め』は上位 CDFD から確定できないため削除し、関係の確認を BA・PO の判断事項へ移した。発注外納品、つけ上限超過、締め、データ照合、範囲承認は完成例内で扱いを明示した業務上の未決事項であり、今回の編集の未完了ではない。対象 sample は draft を維持。親 runner の lint・schema・型検査・テスト、および再評価結果は後続で確認する。
- CHANGELOG 文案（変更）: 業務イベント一覧の完成例に、目的・例外・判断担当・受入条件を追加し、個別業務イベントの完成例との相互参照を整備。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample 2件のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ のみで、docs/ja/projects/ 配下に及ばない。）
- 適用外の検証: `npm run validate:history-links`（executor は PJR 個票・plan.md・result.md を変更していない。）

## 4. 進め方と実践の型の適用

提供された `grade result` の finding に基づき、`bes-index-sample.md` の不足項目（目的、役割、未決事項の詳細、受入条件）を補完しました。また、現行の `rulebook` の定義（必須8列・`template` 不要）を正として構成を最適化し、個別 `sample` との双方向参照を整備することで、実装者が記載水準を正しく把握できる完成例へと見直しました。
