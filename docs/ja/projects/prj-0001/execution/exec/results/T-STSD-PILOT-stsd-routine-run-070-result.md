---
specdojo:
  id: prj-0001:xer-t-stsd-pilot-stsd-routine-run-070
  type: exec-result
  task_id: T-STSD-PILOT-stsd-routine-run-070
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-STSD-PILOT-stsd-routine-run-070-plan.md
  started_at: "2026-11-05T12:57:20.127Z"
  completed_at: "2026-11-05T13:13:59.025Z"
  agent: sol-executor
  execution: agent
  approach: fully-guided
  targets:
    - stsd-routine-run
---

# Edit Result

## 1. 実施内容

- 定期処理の実行結果に関する状態定義（`stsd-routine-run.md`）の磨き込みを実施しました。
- 業務価値、BA・POの確認責任、および実装エビデンスに基づく状態遷移の補強を行いました。
- 未定義の例外的な状態値（`never`）を、ルールブックに従い `-` へ修正しました。
- 既存の業務上の論点（復旧・重複起動・旧記録の扱い）を、追跡可能な申し送り事項（`M-01`〜`M-04`）として整理・補強しました。
- 依存先である `bdd-routine-definition` の未作成に伴うリスク管理として、追跡項目を設定しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-routine-run.md`: 定期処理の実行結果の状態定義について、業務価値の明示、責任範囲の補強、および未決事項（復旧方針・重複起動方針等）を追跡可能な検討メモ（`M-01`〜`M-04`）として整理し、実装エビデンスとの整合性を確保するための記述を加えました。また、未実行状態の値をルールブックに準拠して修正しました。

## 3. 申し送り

- 変更ファイルは `docs/ja/product/010-business-specs/020-data-model/stsd-routine-run.md` のみ。業務価値と BA・PO の確認責任、実装エビデンス、未決事項の追跡条件を補強し、未実行の値を `-` に修正、存在する Job Run 文書へのリンクを設定した。result、grade result、実装、設定は編集していない。
- 進め方と実践の型の適用: 指定の共通規約2件、stsd-rulebook、stsd-mermaid-rulebook、stsd-recipe、stsd-sample、PJR-PT5N、prj-overview、対象文書と宣言された実装2件を参照した。rulebook は必須構造と記法、recipe は一意判定・例外経路の確認、sample は形式だけに使用した。既存の章構成・状態・遷移 ID を保持した。試行中への接続数が6を超えるため既存の二図を維持した。template、未宣言の関連文書本文・実装・外部情報は参照していない。
- F007・F008・F011・F012・F016・F017・F020: 既存草案には既に `missed_run: skip` と、開始時に `last_run`・`last_result: running` を更新する規則があり、今回の実装エビデンスとも一致したため保持した。取りこぼしを実行しない経路と結果としてのスキップの違いを補足した。F018 はコードを持たない未実行だけを `-` に変更し、実装値が存在する `running` は保持した。F006・F009・F021 は目的・責任・リンクの補強で対応した。
- F001・F004・F010・F019・F024: `bdd-routine-definition` は未作成であり、上位の業務定義との照合はできない。未参照の依存を `based_on` に追加せず、既存の `_TODO_` を追跡項目 `M-04` に置換した。BA による辞書の draft 作成→本書照合→PO 確認→`based_on` 反映が必要。PM は PJR 登録と Schedule への影響・実日程を確定する。依存関係の実質的な解消は未了。
- F002・F003・F005・F022・F023: 既存の復旧・重複起動・旧記録の論点を `M-01`〜`M-03` として、選択肢・業務影響・単一担当 Role・成果・完了条件・判断ゲート付きで補強した。PJR 登録先、報告先、運用上の確認証跡候補と引渡し案も記載した。これらは未登録・未承認の申し送りである。ARC が案を具体化し、PM が担当・日程を確定し、PO が採用方針を判断する必要がある。検知閾値、確定した復旧手順、問い合わせ先は根拠不足のため断定していない。
- F013・F014: 今回は状態管理の実装変更を行っていない。`running` は既存の保存値であり、未実行には保存値を新設していない。将来の変更時は DEV・ARC が宣言された実装2件、routine state、run history、表示・監視、旧記録の互換性への影響を確認する。QE・DEV は対象テストファイルと期待結果を確定し、開始時の旧結果消去、結果集約、cron の各方針、例外・重複・旧記録を検証対象にする。未宣言のテスト・schema のパスや生成コマンドは推測していない。指定の lint・schema・typecheck・unit/integration test は親 runner に委ねる。
- F015: 通常の状態判定と図表の定義は維持・補強したが、業務承認を含む成果物全体の完了判定は `M-01`〜`M-04` の解消後に行う。未決の例外方針と先行根拠を推測で確定せず、`status: draft` を保持した。実装の現在動作の確認を業務承認として扱っていない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown 文書のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）
- 適用外の検証: `npm run validate:history-links`（executor は PJR、既存 exec plan、result を変更していない。）

## 4. 進め方と実践の型の適用

PJR-PT5N に従い、既存の `stsd-routine-run.md` をベースに、findings（F001〜F024）を解消するための磨き込みを行いました。rulebook および recipe に基づき、構造の維持、記法の適用、および業務的な不確定事項の整理（`M-01`〜`M-04`）を行いました。既存の仕様と実装エビデンスとの整合性をとりつつ、決定が必要な事項を論点として残しています。
