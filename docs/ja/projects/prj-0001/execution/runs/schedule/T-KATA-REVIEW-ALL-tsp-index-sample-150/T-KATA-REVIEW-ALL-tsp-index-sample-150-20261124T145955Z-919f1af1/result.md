---
specdojo:
  id: prj-0001:xer-t-kata-review-all-tsp-index-sample-150-20261124t145955z-919f1af1
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-tsp-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-tsp-index-sample-150/T-KATA-REVIEW-ALL-tsp-index-sample-150-20261124T145955Z-919f1af1/plan.md
  started_at: "2026-11-24T15:00:08.122Z"
  completed_at: "2026-11-24T15:16:18.416Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsp-index-sample
    - specdojo:tsp-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`tsp-index-sample` を同接頭辞の sample、wikilink と `based_on` の参照先、用語集、Sample 記述標準の共通サンプル文脈と照合し、sample 側の食い違いを修正した。
- grade の F001〜F003 のうち、F001（内部経路の分担）は R2、F003（仮置き根拠）は R1 で解消済みのため修正を維持し、F002（印刷のスタブ／モック方針）は本段で解消した。
- 初期受入の範囲を SC-07・SC-09・AC-05 まで広げ、SAC-PERF-01〜04 を総合テストの出口条件へ接続した。
- 相手側文書（`utc-sample`、`nfr-index-sample`、`stc-index-sample`、`atc-index-sample`）は変更せず、直す案を handoff に残した。
- 整形と差分検査は通過した。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も通過した。 指摘一覧（R5-1〜R5-8）: | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | - | - | - | - | - | - | - | | R5-1 | R5 | 2.1. テストレベル一覧、4.1. 環境区分と用途 | 印刷を一律スタブ、記録サービスと DB をモックとする方針が単体テストカタログの Mock・Stub・Fake と食い違っていた（F002） | 単体と内部結合の環境行を分けた。印刷要求の回数・内容を検証するためモックを使う例外理由を明記した。DB は Fake、記録サービスはスタブとし、単体の範囲に印刷要求を含めた | `vp-qe-kata-conformance`、TSP rulebook 2.2・6.4、`utc-index-sample` 7章、`utc-sample` 4・6.3章 | - | | R5-2 | R5 | 1. 概要、2.1.、3. スコープ、5. 品質ゲート | 初期受入の範囲が SC-01・AC-01〜AC-04 に限られ、必須の SC-07・SC-09・AC-05 が欠けていた | 必須条件をすべて出口条件に対応付けた。在庫・つけの記録更新、両代表の照合、操作メモと文書照合、条件別の証跡を反映した。運用開始後の成功基準は初期受入から除外した | `vp-qe-kata-conformance`、成功基準と受入条件 1〜4章、TSP rulebook 5章・5.3 | - | | R5-3 | R5 | 1.、2.1.、3.、5.、8章 | 定義済みの SAC 性能条件と出口条件が未接続で、つけ残高確認・日次締めの性能判定も明示されていなかった | 総合テストの出口を SAC-PERF-01〜04 の合格へ接続した。測定条件・判定方法は SAC を参照した。応答時間の計測境界と、P99・商品検索応答は記録のみとする扱いを明記した。接続未反映という旧課題は削除した。60取引/時・2秒の仮置き値と根拠は維持した | `vp-qe-kata-conformance`、`sac-sample` 1〜3章、`nfr-performance-sample` 2〜4章、TSP rulebook 5.3 | - | | R5-4 | R5 | 2.2. 観点/条件設計の共通原則 | 観点を販売確定だけ、観測点を記録・画面だけに限定しており、単体カタログの戻り値・Mock 呼び出しや SAC の性能ログに合わなかった | 観点は対象処理の振る舞いについての1命題とした。レベルに応じて戻り値・依存の呼び出し・各業務記録・ログを観測点に選べるようにした | `vp-qe-kata-conformance`、`utc-sample` 6章、`sac-sample` 2章、TSP rulebook 5.2 | - | | R5-5 | R5 | 相手側: `utc-sample` 3. 対象外 | 印刷失敗の外部結合を PATH-05、DB 保存の内部結合を PATH-01 としているが、IFD ではそれぞれ保管サービスへの転送、画面資材の取得である | `utc-sample` 側で印刷の PATH-05 を外し、DB 保存は記録サービスと DB の PATH-03 を含む経路として修正する案。相手側のため未変更 | `vp-qe-kata-conformance`、`ifd-sample` 4章 | - | | R5-6 | R5 | 相手側: `nfr-index-sample` 3. 分冊ドキュメント一覧 | 未確定の指標は合否を判定しないという一律の扱いが、性能分冊・SAC・TSP の暫定基準による判定と食い違う | `nfr-index-sample` 側を、暫定基準がある場合はそれに従い、記録のみと定めた指標は合否を判定しない、という記述へ直す案。相手側のため未変更 | `vp-qe-kata-conformance`、`nfr-performance-sample` 3・4章、`sac-sample` 1・3章 | - | | R5-7 | R5 | 相手側: `stc-index-sample` 2. テスト対象の括り方と分割基準 | TSP の範囲を具体化する分配表に、AC-05 の在庫・つけの更新と SAC-PERF-03・04 の性能確認の委譲先が示されていない | `stc-index-sample` 側で、更新後の TSP 出口条件を対象別カタログへ分配する案。会計確定の性能ケースは `stc-sample` に既存であり維持する。相手側のため未変更 | `vp-dev-change-impact`、`vp-qe-kata-conformance` | - | | R5-8 | R5 | 相手側: `atc-index-sample` 1・2・6章 | 受入範囲と P0 の根拠が旧 TSP の SC-01・AC-01〜AC-04 のままで、SC-07・SC-09・AC-05 の対象別への分配がない | `atc-index-sample` 側の範囲・P0 基準・分配に、両代表の確認結果一致、全試行1分以内、在庫・つけの記録更新を接続する案。相手側のため未変更 | `vp-dev-change-impact`、`vp-qe-kata-conformance` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsp-index-sample.md`: R5 整合の修正を反映した。印刷のモック例外理由を単体・内部結合の環境行に分けて明記した。初期受入の範囲を SC-07・SC-09・AC-05 まで広げ、出口条件に対応付けた。総合テストの出口を SAC-PERF-01〜04 に接続し、応答時間の計測境界と記録のみの指標の扱いを書いた。観点と観測点の原則を戻り値・依存呼び出し・業務記録・ログまで広げた。接続未反映という旧課題を削除した。60取引/時・2秒の仮置き値と `status: draft`、`based_on` は維持した。

## 3. 申し送り

- 別段の注意なし。相手側 4 文書（`utc-sample`、`nfr-index-sample`、`stc-index-sample`、`atc-index-sample`）への修正案は実施内容の表（R5-5〜R5-8）を参照。これらの文書は本タスクで未変更。
- 性能の正式閾値と通信不能時の販売継続は、参照元でも未確定のため、既存の仮置き・対象外の扱いを維持した。
- R5-1: R5 / 2.1. テストレベル一覧、4.1. 環境区分と用途 / F002: 印刷を一律スタブ、記録サービスと DB をモックとする方針が単体テストカタログの Mock・Stub・Fake と食い違っていた / 単体と内部結合の環境行を分け、印刷要求の回数・内容を検証するためモックを使う例外理由を明記した。DB は Fake、記録サービスはスタブとし、単体の範囲に印刷要求を含めた / `vp-qe-kata-conformance`。[[specdojo:tsp-index-rulebook|TSP 作成ルール]] 2.2・6.4、[[specdojo:utc-index-sample|単体テストカタログ: 概要]] 7章、[[specdojo:utc-sample|単体テストカタログ: 会計確定]] 4・6.3章 / -
- R5-2: R5 / 1. 概要、2.1. テストレベル一覧、3. スコープ、5. 品質ゲート / 初期受入の範囲が SC-01・AC-01〜AC-04 に限られ、参照先が必須とする SC-07・SC-09・AC-05 が欠けていた / 必須条件をすべて出口条件に対応付け、在庫・つけの記録更新、両代表の照合、操作メモと文書照合、条件別の証跡を反映した。運用開始後の成功基準は初期受入から除外した / `vp-qe-kata-conformance`。[[specdojo:prj-success-criteria-and-acceptance-criteria-sample|成功基準と受入条件]] 1〜4章、[[specdojo:tsp-index-rulebook|TSP 作成ルール]] 5章・5.3 / -
- R5-3: R5 / 1. 概要、2.1. テストレベル一覧、3. スコープ、5. 品質ゲート、8章 / 定義済みの SAC 性能条件と出口条件が未接続で、つけ残高確認・日次締めの性能判定も明示されていなかった / 総合テストの出口を SAC-PERF-01〜04 の合格へ接続し、測定条件・判定方法は SAC を参照した。応答時間の計測境界と、P99・商品検索応答は記録のみとする扱いを明記し、接続未反映という旧課題を削除した / `vp-qe-kata-conformance`。[[specdojo:sac-sample|システム受入条件: 性能]] 1〜3章、[[specdojo:nfr-performance-sample|性能要件]] 2〜4章、[[specdojo:tsp-index-rulebook|TSP 作成ルール]] 5.3。既存の60取引/時・2秒の仮置き値と根拠は維持 / -
- R5-4: R5 / 2.2. 観点/条件設計の共通原則 / 観点を販売確定だけに限定し、観測点も記録・画面だけに限定しており、単体カタログの戻り値・Mock 呼び出しや SAC の性能ログに合わなかった / 観点は対象処理の振る舞いについての1命題とし、レベルに応じて戻り値・依存の呼び出し・各業務記録・ログを観測点に選べるようにした / `vp-qe-kata-conformance`。[[specdojo:utc-sample|単体テストカタログ: 会計確定]] 6章、[[specdojo:sac-sample|システム受入条件: 性能]] 2章、[[specdojo:tsp-index-rulebook|TSP 作成ルール]] 5.2 / -
- R5-5: R5 / 相手側: utc-sample 3. 対象外 / 印刷失敗の外部結合を PATH-05、DB 保存の内部結合を PATH-01 としているが、IFD ではそれぞれ保管サービスへの転送、画面資材の取得である / - / `vp-qe-kata-conformance`。[[specdojo:ifd-sample|インフラ構成図]] 4章と照合。[[specdojo:utc-sample|単体テストカタログ: 会計確定]] 側で印刷の PATH-05 を外し、DB 保存は記録サービスと DB の PATH-03 を含む経路として修正する案。対象外文書のため未変更 / -
- R5-6: R5 / 相手側: nfr-index-sample 3. 分冊ドキュメント一覧 / 未確定の指標は合否を判定しないという一律の扱いが、性能分冊・SAC・TSP の暫定基準による判定と食い違う / - / `vp-qe-kata-conformance`。[[specdojo:nfr-performance-sample|性能要件]] 3・4章、[[specdojo:sac-sample|システム受入条件: 性能]] 1・3章を確認。[[specdojo:nfr-index-sample|非機能要件インデックス]] 側を、暫定基準がある場合はそれに従い、記録のみと定めた指標は合否を判定しない、という記述へ直す案。対象外文書のため未変更 / -
- R5-7: R5 / 相手側: stc-index-sample 2. テスト対象の括り方と分割基準 / TSP の範囲を具体化する分配表に、AC-05 の在庫・つけの更新と SAC-PERF-03・04 の性能確認の委譲先が示されていない / - / `vp-dev-change-impact`、`vp-qe-kata-conformance`。[[specdojo:stc-index-sample|総合テストカタログ: 概要]] 側で、更新後の TSP 出口条件を対象別カタログへ分配する案。会計確定の性能ケースは [[specdojo:stc-sample|総合テストカタログ: 店頭の現金販売]] に既存であり維持する。対象外文書のため未変更 / -
- R5-8: R5 / 相手側: atc-index-sample 1・2・6章 / 受入範囲と P0 の根拠が旧 TSP の SC-01・AC-01〜AC-04 のままで、SC-07・SC-09・AC-05 の対象別への分配がない / - / `vp-dev-change-impact`、`vp-qe-kata-conformance`。[[specdojo:prj-success-criteria-and-acceptance-criteria-sample|成功基準と受入条件]] の初期受入必須条件に合わせ、[[specdojo:atc-index-sample|受入テストカタログ: 概要]] 側の範囲・P0 基準・分配に、両代表の確認結果一致、全試行1分以内、在庫・つけの記録更新を接続する案。対象外文書のため未変更 / -
- reporter 記録用: 変更ファイルは `docs/ja/specdojo/samples/tsp-index-sample.md` のみ。R5-1〜R5-8 を result の実施内容へ指定7列の Markdown 表として1回だけ記載し、申し送りには表を重ねない。相手側の文書は未変更。result、grade サイドカー、Git 設定・コミットには変更を加えていない。
- 進め方と実践の型の適用への記録: 共通規約2文書、kata-guide 6.1・6.3・6.5、Sample 記述標準の共通文脈、TSP rulebook、テストドキュメントスコープ定義標準、共通レビュー観点、dct-kata の対象 `done_criteria`、grade result、R1〜R4 result を確認した。同接頭辞の sample は index の1本だけ。全 wikilink・`based_on` の参照先と関連する UTC・STC・ATC を照合した。用語集6ファイルの見出し語を確認し、Role の定義と整合することを確認した。テスト固有語は TSP rulebook 2.2 に従った。`recipe`・`template` は `undecided` で参照対象なし。章構成・必須表・禁止事項は rulebook を正とし、個別ケースや測定手順は参照先へ委ねた。`status: draft` と `based_on` は維持した。
- grade と前段の扱い: 展開元は `docs/ja/projects/prj-0001/execution/grade/results/specdojo.tsp-index-sample.yaml` の `source=grade` 相当の F001〜F003。condense 記録と `cause.location` はない。F001 は R2 の内部経路分担、F003 は R1 の仮置き根拠によって解消済みであり、再指摘せず修正を維持した。F002 は R5-1 で解消した。性能の正式閾値と通信不能時の販売継続は、参照元でも未確定のため、既存の仮置き・対象外の扱いを維持した。親 runner 指定の lint・schema・test は重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample のみで YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下へ及ばない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan/result を変更していない。）

## 4. 進め方と実践の型の適用

根拠にした資料は、共通規約 2 文書、kata-guide のレビューの節、Sample 記述標準の共通文脈、TSP rulebook、テストドキュメントスコープ定義標準、共通レビュー観点、`dct-kata` の対象 `done_criteria`、grade result、R1〜R4 result である。同接頭辞の sample は index の 1 本だけで、全 wikilink と `based_on` の参照先、関連する UTC・STC・ATC を照合した。用語集 6 ファイルの見出し語を確認し、Role の定義と整合することを確認した。`recipe`・`template` は `undecided` で参照対象がない。構造・必須表・禁止事項は rulebook を正とし、個別ケースや測定手順は参照先に委ねた。F001 は R2、F003 は R1 で解消済みのため維持し、F002 は R5-1 で解消した。grade の `source=grade` 相当は F001〜F003 で、condense 記録と `cause.location` はない。grade result サイドカーは編集していない。
