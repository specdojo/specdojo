---
specdojo:
  id: prj-0001:pjr-99ns-sf-task-execution-refine-confirmed-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T13:12:06Z"
  derived_from:
    - PJR-2GD6
    - PJR-T88P
  autopilot: approved
  approach: fully-guided
  targets:
    - prj-0001:sf-task-execution
---

# PJR-99NS 代表の sf-task-execution を、確定した型で磨き込む

## 1. 概要

business-specs-kata で確定した型（specdojo:sf-rulebook と sample）に合わせて、代表の sf-task-execution を磨き込み、冗長さを整理する。review は schedule の review の段で流す

## 2. 入力

- 型一式の確定（2026-11-10、indie が決定）の後に、代表を磨き込みから流し直す。schedule の磨き込み・condense の段はゲートで bes・br・clis の段まで巻き戻すことになるため、register の todo で行う（orchestrator の判断、indie に報告）。
- 夜間の register の routine で流す（indie が承認）。review は T-BUSINESS-SPECS-REPS-sf-task-execution-090 を reopen 済みで、6:00 の exec cycle で流す。

## 3. 完了条件

- 代表の [[prj-0001:sf-task-execution]] を、確定した型 [[specdojo:sf-rulebook]] と [[specdojo:sf-sample]] に合わせて磨き込んでいる。型の本文要件の章立て・必須の項目・記述ガイドの判断の基準に沿い、型が禁止することを書いていない。
- 冗長さを整理している（判断に要る背景・制約・例外と意味は保ち、新しい内容を足さない）。
- 実装・schema・リファレンスと同じことを書かず、正本を参照する方針（PJR-2GD6）を保っている。
- 決められない点は `_UNDECIDED_` か `_ASSUMPTION_` のまま、理由（どの成果物がない、誰の判断が要る）を書いて残してよい。依存の成果物がないことを理由に未完了としない。
- これまでの review の指摘のうち、確定した型の範囲で直せるものを直し、直さないものは理由を個票の対応結果に書いている。
- 型と、ほかの成果物とカタログを変えていない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`specdojo catalog validate --project prj-0001` が通っている。

## 4. 作業内容

| No  | 作業                               | 担当     | 状態 | メモ |
| --- | ---------------------------------- | -------- | ---- | ---- |
| 1   | 確定した型と代表の文書を読み比べる | executor | done | -    |
| 2   | 磨き込みと冗長さの整理を行う       | executor | done | -    |
| 3   | 検査を流し、対応結果に書く         | executor | done | -    |

## 5. 対応結果

### 5.1. 実施内容・変更ファイル

[[prj-0001:sf-task-execution|システム化機能（タスク実行）]] を既存の 8 章構成のまま磨き込んだ。公開範囲・確認者の合意対象・上位目的との対応と文書の承認条件を補い、業務対応表の重複説明、設定値の再掲、根拠のない互換性保証を整理した。変更ファイルは対象仕様と本個票だけであり、実装・型・カタログ・CHANGELOG は変更していない。result の記入は reporter、状態遷移は runner に委ねる。

### 5.2. 進め方と実践の型の適用

- 指定の SF rulebook・sample、プロジェクト概要、対象仕様、共通規約 2 件、本個票、運用メモを実際に参照した。rulebook を構造・必須要素・禁止事項の基準とし、sample は既存仕様に欠ける公開範囲・承認条件・未決事項の形式確認に限って用いた。sample の業務内容・値は転記していない。`vp-arc-conciseness` の定義も確認し、判断に必要な背景・例外・完了条件を保持した。
- recipe は rulebook で `not-needed`、併用 rulebook は指定なし。template・approach 全体ガイドは不要で参照していない。未作成の `sf-index`・`bps-task-selection-preparation` は本文を参照できず、`based_on` は空のまま維持した。owner は plan で未定義のため補っていない。対象に `_CONTEXT_:` はなかった。
- 読み取り専用の `src/exec/run/agent-pipeline.ts` で executor・reporter の分担、未完了時の停止、親検証の更新とゲートの任意適用を確認した。業務目的や新方針の根拠には使っていない。検査適用のため `package.json`・`.specdojo/specdojo.config.json`・`lefthook.yml` を参照した。仕様内のリンク先（exec 設定・運用・ライフサイクル等のガイド、BR・STSD・CLIS・BPS）、finding に挙がる `src/exec/parent-validation.ts` と関連実装・schema は参照許可範囲外のため読んでいない。カタログの本文探索や外部調査も行っていない。
- 第 2 章は詳細ステップ ID の確定根拠がないため業務区分による暫定対応へ戻し、第 3 章の同じ ID も除いた。表の責務説明は第 4 章を正本として要約し、統合と記録の同一 BPS 行をまとめた。範囲・未作成文書名・入出力との対応は保持した。
- 第 5.1 章と V-13・V-14 の固定値およびフォールバック説明は、設定正本の再掲と適用範囲の誤りを避けるため、有効設定・上書き・省略・適用外で判定する記述へ変更した。親検証は plan の F004 に従いコマンド単位とし、新しい既定値や設定項目を補っていない。値と全適用経路の最終照合は ARC・QE に引き継ぐ。
- 第 5.2 章の一律の未知フィールド許容・任意項目追加・版更新と移行層の義務は、rulebook が禁止する未合意の互換性保証のため削除した。V-15 は契約正本の特定後に判定する条件へ修正し、正本・版が未特定である理由、担当、判断時点、次の確認と承認保留条件を第 8 章へ記載した。推測で schema パスや版を追加していない。
- 第 5.3 章の責務分離の再掲は第 4.2〜4.4 章へ統合し、第 6 章は参照表と一次対応の重複した案内を短縮した。第 3.2 章と V-11 では完了記録を状態追跡する経路に限定した。章立ては既存を保ち、rulebook の必須要素に必要な記述だけを補った。

### 5.3. 指摘への対応と申し送り

| 指摘       | 対応結果・残る確認                                                                                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F001・F003 | 第 2 章を暫定対応と明示し、根拠未確認の詳細 ID を除いた。詳細照合は未解消。BA が未作成 BPS 正本作成時に照合し、ARC・PO が境界・対応に合意するまで承認を保留する。                                                                               |
| F002・F006 | 業務対応と資源制約の未確定を第 8 章で分離し、担当・判断時点・次アクション・追跡先・承認保留条件を明示した。対応と最終受入値の確定自体は未解消であり、文書検査合格を充足証拠にしない。                                                           |
| F004       | 固定の 300 秒・provider 既定 1 の断定を除き、親検証のコマンド単位の上限と、ゲート適用経路の有効設定へ委ねた。600 秒等の値を再掲せず、動作変更も要求していない。実装・設定正本の詳細照合は参照制限のため行っておらず、ARC・QE の後続確認が残る。 |
| F005       | 公開契約の未確認な互換性保証を撤去し、論理契約・schema・版管理の正本の特定を第 8 章へ明示した。正本の特定は未解消。ARC が特定し、DEV・QE が既存記録との互換性を照合するまで V-15 と公開承認を保留する。                                         |
| F007       | V-13・V-14 を有効設定に対する判定とし、上書き・省略、ゲート適用外と上限境界を対象条件に加えた。実行時設定と計測結果を残し、ARC・QE が確認する。機能試験は本 edit の範囲外。                                                                     |
| F008       | 第 3.2 章と V-11 の完了記録を 4.4 の状態追跡する実行に限定し、隔離統合の成功条件と区別した。                                                                                                                                                    |

executor は、根拠未特定の値・契約を具体化せず未決事項として残すと判断した。これは欠落の推測を禁止する fully-guided の規約と、未確定事項を残してよい本個票の完了条件に基づく。PM は上記の未解消点を後続の独立した schedule review へ渡し、必要な根拠の参照許可と確認担当を整理する。別の登録項目の実行・decision の決定は行っていない。

### 5.4. 検証

executor は対象 2 文書の Prettier 整形、`npm run validate:history-links`、`node --import tsx src/specdojo.ts register build --project prj-0001`、`node --import tsx src/specdojo.ts catalog validate --project prj-0001` を実行し、すべて終了コード 0 を確認した。カタログ検査には対象外の既存文書・実装参照に関する警告があり、変更範囲を広げずそのままとした。hook の `node tools/check-evidence-secrets.mjs --staged` は対象 0 件・検出 0 件で終了した（今回の編集内容は runner のステージ後の検査対象）。生成された登録簿は Git 管理外であり、追加の変更ファイルはない。`lint:md`・`lint:fm`・`validate:schema` を含む指定の親検証は runner が終了後に実行するため、executor で重複実行せず、その結果を最終証跡とする。実行結果は pipeline evidence と reporter の result に記録する。

### 5.5. CHANGELOG に書く事項

区分: 変更。文案: 「タスク実行の機能仕様を確定した SF の型に合わせ、状態追跡の適用範囲、設定正本による資源制約の判定、未確定契約の承認条件を明確化しました。」

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]、[[prj-0001:pjr-t88p-business-specs-kata]]
- 対象: [[prj-0001:sf-task-execution]]
- 型: [[specdojo:sf-rulebook]]
