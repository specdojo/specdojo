---
specdojo:
  id: prj-0001:pjr-2ht5-yaml-pages-table-view
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-17T22:38:22Z"
  due_on: "2026-11-30"
---

# PJR-2HT5 YAML が正本の文書を、VitePress で表＋YAML 正本（折りたたみ）の形で表示する

## 1. 概要

業務データ辞書・ロール定義・メンバー定義などの表示用ページが YAML の丸写しになっているため、用語集と同じく表と折りたたんだ YAML 正本の形にする。

## 2. 入力

- 利用者の要望（2026-11-18）: 業務データ辞書・ロール定義・メンバー定義は VitePress で YAML をそのまま HTML にした形で表示される。用語集のように表＋YAML 正本（折りたたみ）にしたい。ほかの YAML が正本の文書も洗い出して対応する
- orchestrator の洗い出し（2026-11-18）: 表示用ページ 223 件のうち、表＋折りたたみは用語集・ifx-index・dct テンプレートだけで、ほかは YAML の丸写し（src/docs/yaml-pages.ts の renderYamlPage）
- 対象の候補: bdd（bdd-register-entry・bdd-sample）、pm-roles（本番・sample）、pm-members（本番・sample）、pm-review-viewpoints（project・defaults）、ifx-cmd（ifx-cmd-ai-provider-cli・ifx-cmd-sample）、ifx-file-agent-evidence、tml（tml-index・tml-sample）、dct カタログのインスタンス 9 件と dct-sample・dct-index-sample、sch-milestones
- 対象外の案: grade の判定基準・job・routine・schedule の track/strategy/defaults/assessment、schema、YAML の template、OpenAPI/AsyncAPI の sample（ifx-api-sample・ifx-msg-sample）

## 3. 完了条件

- 入力の「対象の候補」の型ごとに、表示用ページの本文を表で描く処理を `src/docs/yaml-pages.ts` に足す（1,000 行を超える場合は型ごとのモジュールへ分ける）。形は用語集と ifx-index にそろえ、表の後に YAML の正本を `<details>` で折りたたんで添える。表の列は各型の rulebook と schema の主要な項目から選び、選んだ理由を個票の対応結果に書く。
- 入力の「対象外の案」は今の YAML の丸写しのまま変えない。対象と対象外の最終の線引きは executor が決め、型ごとの判断と理由を個票の対応結果に書く。dct カタログのインスタンスを表で描き直すか `catalog build` の表のページへ案内するか、OpenAPI と AsyncAPI の sample の扱いもここで決める。
- YAML の正本の内容が表示用ページに全部残る（折りたたみの中にそのまま入る）。表は正本から生成し、手で直さない。
- 型ごとに `tests/` へ単体テストを足し、本番の文書と sample の両方で表示用ページを生成して、表と折りたたみが出ることを確かめる。生成した表示用ページの差分を commit に含める。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。`npm run docs:build` で表示用ページが描けることを確かめる。

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ                                                                                               |
| --- | ------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------------- |
| 1   | 対象と対象外の線引きを決め、型ごとの表の列を決める      | DEV  | done | 5.1 に対象・列・選定理由を記録                                                                     |
| 2   | 型ごとの表の描き方を足し、YAML の正本を折りたたみで残す | DEV  | done | 型別モジュールを追加し、原文を保持する既存処理へ接続                                               |
| 3   | 型ごとの単体テストを足し、表示用ページを生成し直す      | DEV  | done | 24 ページを再生成し、生成結果の期待値も差分へ追加                                                  |
| 4   | 検証を流し、対応結果と CHANGELOG の文案を書く           | DEV  | open | sandbox 内の描画・静的検証と文案は完了。Chromium 起動制約で全体ビルドは親環境での実行が必要（5.3） |

## 5. 対応結果

### 5.1. 対象と表の列

各型の rulebook と schema の識別・責務・判断に使う項目を優先し、一覧と補表に分けた。表に選ばない任意項目やコメントも YAML 原文で確認できる。

| 型                     | 対象と主な列                                                                                                                                   | 選定理由・参照元                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bdd`                  | 本番・sample。エンティティの物理名・説明・キー・正本参照・用語参照、フィールドの論理名・物理名・意味・型・単位・制約・許容値・例               | 業務上の意味と正本の境界、状態値をレビューするため。[[specdojo:bdd-rulebook]]、`bdd.schema.yaml`                                                       |
| `pm-roles`             | 本番・sample。コード・名称・プロジェクトでの責務                                                                                               | 採用ロールとプロジェクト固有の役割を照合するため。[[specdojo:pm-roles-rulebook]]、`pm-roles.schema.yaml`                                               |
| `pm-members`           | 本番・sample。実行主体 ID・表示名・ロール・種別・担当領域・補足、運用ルール                                                                    | 誰が何を担当するかを確認するため。連絡先などは原文へ残す。[[specdojo:pm-members-rulebook]]、`pm-members.schema.yaml`                                   |
| `pm-review-viewpoints` | project・defaults。分類・確認対象・重大度・判定・観点・ロール別観点・適用条件・採点基準。project は継承元と無効化設定も表示                    | 差分だけの YAML を共通定義の全件と誤認しないよう、宣言内容を表にし、継承元へリンクする。専用 rulebook はなく `pm-review-viewpoints.schema.yaml` に従う |
| `ifx-cmd`              | 本番・sample。実行ファイル・目的・参照・バージョン・引数・標準入出力・ファイル・終了コード・認証・実行制御・異常時・副作用                     | 起動契約と成功・失敗・再試行の条件を確認するため。[[specdojo:ifx-cmd-rulebook]]、`ifx-cmd.schema.yaml`                                                 |
| `ifx-file`             | agent evidence 仕様。ファイル名・配置・説明・書き手・読み手・形式、命名規則・型参照・必須項目、配送・データ契約・異常時・検証・未決事項        | 受け渡し責務と復旧・検証条件を確認するため。専用 schema はなく [[specdojo:ifx-file-rulebook]] と正本の構造に従う                                       |
| `tml`                  | 本番・sample。予定開始日・注記、トラック・ドメイン・カタログ状態・見積日数・順序・並行グループ・依存・補足                                     | 互換用の旧計画でも順序・依存・未確定事項を読めるようにするため。[[specdojo:tml-rulebook]]、`tml-index.schema.yaml`                                     |
| `dct`                  | YAML 表示ページが担当するインスタンス・sample。設定、成果物 ID・名称・種別・根拠・概要、パス・準拠ルール・作成指示・完了条件・確認ロール・観点 | 計画対象と完了判定の根拠を照合するため。[[specdojo:dct-rulebook]]、`dct.schema.yaml`                                                                   |
| `dct-index`            | sample と YAML 表示ページへのフォールバック。規模・グループ・ドメイン・名称・概要                                                              | 宣言した探索順と階層を保つため。[[specdojo:dct-index-rulebook]]、`dct-index.schema.yaml`                                                               |
| `sch-milestones`       | 本番。ID・名称・対象成果物・先行タスク・担当ロール・目安日・タグ・注記                                                                         | 到達条件と責任の確認に必要な項目を示すため。[[specdojo:sch-rulebook]]、`sch-milestones.schema.yaml` と `sch-common.schema.yaml`                        |

候補の DCT 9 件に対し、現在 YAML 表示ページが担当する実在正本は、業務モデル 3 件（BES・BPS・BR）とデータモデル 5 件（BDD・CCD・CDSD・CDT・STSD）の計 8 件だった。これらと sample を表で描画した。`catalog build` が作る既存のドメイン別・索引ページ 19 件は、複数 YAML を統合する既存の表を継続使用し、所有者判定による上書き防止を維持した。

対象外は grade の判定基準・結果、job・routine、schedule の track・strategy・defaults・assessment、schema、YAML template、OpenAPI／AsyncAPI の sample。設定・実行記録・構文見本の閲覧を変える範囲ではないため、従来の YAML 表示を維持する。既存の用語集・IFX 索引・DCT template の表もそのままとした。OpenAPI／AsyncAPI は固有の標準構造を持つため、今回の独自 IFX 形式の表を適用しない。

### 5.2. 実施内容・変更ファイル

- `src/docs/yaml-pages.ts`: 対応型の表生成を呼び出し、既存の長いコードフェンスと閉じた `<details>` で YAML 原文を保持する処理を共用した。
- `src/docs/yaml-tables.ts`・`yaml-business-tables.ts`・`yaml-interface-tables.ts`・`yaml-table-shared.ts`: 型とファイル系列による対象判定、型別の表、配列・入れ子・改行・パイプ・wikilink・HTML プレースホルダの処理を追加した。`0`・`false` と欠落値を区別する。
- `tests/src/docs/yaml-tables.test.ts`: 本番・sample のレコード数、表の列数、原文保持、継承元、対象外の維持、エスケープと長いフェンスのテストを追加した。
- `tests/fixtures/yaml-pages/*.md.snap`: 再生成した 24 ページの全文を期待値として保存した。`docs/**/generated/` は既存の Git 除外規約に従い、生成ページのレビュー可能な差分はこれらの期待値で残す。期待値は正本から生成し、テストで実際の出力と照合する。
- YAML 正本、保護された設定、登録簿一覧・個票の状態、`CHANGELOG.md`、result は変更していない。

### 5.3. 検証・申し送り

- `buildYamlPages` で表示ページを再生成し、再実行の冪等性を確認した。対象 24 ページは VitePress の Markdown renderer と Vue compiler で表・折りたたみを描画・コンパイルできた。
- カタログ検証と履歴リンク検証は成功した。カタログ検証には既存の未作成成果物に関する警告がある。CLI の検証では `.env` を読み込まないよう一時 preload を使用し、`tsx` の IPC 制約には `node --import tsx` で対応した。
- 整形と個票の Markdown 検査を実施した。型検査・TS／FM／MD／Mermaid／D2 lint・単体／統合テスト・schema 検証は指定どおり親 runner に委ねる。
- `npm --prefix packages/docs-site run docs:build` は Mermaid 135 図の生成で停止した。単独起動でも Chromium が `sandbox_host_linux.cc` の `Operation not permitted` で終了することを確認した。親環境で `npm run docs:build` を実行し、全体ビルドを確認する必要がある。sandbox では index の書き込みも禁止されるため、同コマンドの前処理は実行していない。
- 新たな保護設定の変更案や未決の設計判断はない。

### 5.4. CHANGELOG に書く事項

- 区分: 変更。文案: YAML を正本とする業務データ辞書・ロール／メンバー定義・レビュー観点・外部コマンド／ファイル連携仕様・旧トラック順序計画・成果物カタログ・マイルストーンの表示ページを表形式にし、YAML 原文を折りたたんで表示するようにした。

## 6. 関連ドキュメント

- [[specdojo:bdd-rulebook]]
- [[specdojo:pm-roles-rulebook]]
- [[specdojo:pm-members-rulebook]]
