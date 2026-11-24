---
specdojo:
  id: prj-0001:xer-t-kata-review-all-stc-index-sample-140-20261124t182753z-b1f421a9
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-stc-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-stc-index-sample-140/T-KATA-REVIEW-ALL-stc-index-sample-140-20261124T182753Z-b1f421a9/plan.md
  started_at: "2026-11-24T18:28:01.998Z"
  completed_at: "2026-11-24T18:39:45.899Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stc-index-sample
    - specdojo:stc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）を実施した。sample の主張を schema・rulebook・TSP・関連 sample と突き合わせ、誤りは 1 件（共通合格基準の P0 対象の定義）だけだった。
- 指摘 R4-1 は次のとおり。 | No | 段 | 箇所 | 指摘 | 直し | 根拠 | | - | - | - | - | - | - | | R4-1 | R4 | 7.2. 共通合格基準 / F002 | P0 の対象が「記録の欠落・誤り、販売の誤確定につながるケース」だけで、性能ケース `会計確定応答` を P0 として判定できない | P0 の対象に「TSP 出口条件の性能基準」を追加した | `vp-qe-verifiability`、stc-index-rulebook 6.7、tsp-index-sample 第5章の総合テスト出口条件、stc-sample 6.4 の P0 指定 |
- 確かめた主張の表（C01〜C22）。列は No、主張（本文の箇所）、正本、確かめ方、結果、根拠。 | No | 主張（本文の箇所） | 正本 | 確かめ方 | 結果 | 根拠 | | - | - | - | - | - | - | | C01 | frontmatter を `specdojo` 配下に置く | `deliverable-frontmatter.schema.yaml`、`src/shared/frontmatter-namespace.ts` | 読み取り | 一致 | schema は `specdojo` を必須とし、`readSpecdojoNamespace` は同名前空間を取得する | | C02 | `id` は `specdojo:stc-index-sample` | `common-frontmatter.schema.yaml`、sample-authoring-standard 第4章 | 読み取り | 一致 | `idRef` の文字制約と sample の接尾辞規則を満たす | | C03 | `type` は test | `deliverable-frontmatter.schema.yaml`、stc-index-rulebook frontmatter・4.1 | 読み取り | 一致 | test は種別の列挙値で、rulebook の `deliverable_type` も test | | C04 | `status` は draft | `common-frontmatter.schema.yaml` | 読み取り | 一致 | 許可値 draft・ready・deprecated に含まれる。既存値を維持 | | C05 | `rulebook` は `specdojo:stc-index-rulebook` | stc-index-rulebook 4.1、`common-frontmatter.schema.yaml` | 読み取り | 一致 | 参照先が存在し `rulebookRef` の形式を満たす | | C06 | `based_on` は文書 ID の配列 | `common-frontmatter.schema.yaml` | 読み取り | 一致 | 重複のない `idRefArray`。TSP と BAC の参照先も存在する | | C07 | 第2章の term は開始から完了までの業務シナリオで分割する | stc-index-rulebook 6.2 | 読み取り | 一致 | 業務・価値境界、境界横断、データ境界、運用境界の順序が一致 | | C08 | 第2章で観点15以上またはケース表60行以上なら分割を再検討する | stc-index-rulebook 6.2 | 読み取り | 一致 | 分割候補の閾値と一致 | | C09 | 第4章で5系統から観点を立てる | stc-index-rulebook 6.4 | 読み取り | 一致 | 業務フロー、例外・回復、データ整合、運用観測、代表的非機能の順序が一致 | | C10 | 第5章の条件の要素は入力・状態・環境・経路 | stc-index-rulebook 6.5 | 読み取り | 一致 | 4要素の定義が一致 | | C11 | 第5章で代表シナリオ、重要分岐、重大例外の順に条件を追加する | stc-index-rulebook 6.5 | 読み取り | 一致 | 追加順序と直積を作らない方針が一致 | | C12 | 6.1 で1観点を1合否命題、1条件を1差分とする | stc-index-rulebook 6.6.1 | 読み取り | 一致 | 定義単位が一致 | | C13 | 6.2 で理由のない主担当の重複を認めない | stc-index-rulebook 6.6.2 | 読み取り | 一致 | 主担当は原則1つで、複数の場合は理由を備考へ書く | | C14 | 7.1 で ST 専用環境の版数・設定を固定する | stc-index-rulebook 6.7 | 読み取り | 一致 | ST 専用環境とバージョン・設定の固定を定めている | | C15 | 第3章・7.1 の印字結果不明を30秒タイムアウトで再現する | `ifx-cmd-sample.yaml` | 読み取り | 一致 | `execution.timeout_seconds` は30。`timeout_action` は自動再試行せず印字結果不明として通知する。架空 CLI の契約定義として照合 | | C16 | 7.2 の P0 対象で TSP 出口条件の性能ケースを判定できる | tsp-index-sample 第5章、stc-index-rulebook 6.7 | 読み取り、修正後の差分確認 | 不一致（修正済み） | TSP は性能条件の合格を出口条件とするが旧定義は記録・誤確定のみ。性能基準を追加した | | C17 | 7.2 の Major を残す例外は PM 承認と回避手順を要する | tsp-index-sample 第5章 | 読み取り | 一致 | 総合テストの Major に限り PM の例外承認と回避手順の引継ぎを認める | | C18 | 第8章の `case_id` は `st-&lt;term&gt;-&lt;perspective_key&gt;-&lt;nnn&gt;` | stc-index-rulebook 6.8 | 読み取り | 一致 | 形式に `level=st` を適用した形と一致 | | C19 | 第8章のケース番号は010から10刻み | stc-index-rulebook 6.8 | 読み取り | 一致 | 3桁・10刻みの推奨規則と一致 | | C20 | 第8章の必須列は `case_id`、条件、手順、期待値の順 | stc-index-rulebook 6.8 | 読み取り | 一致 | 4必須列の順序が一致し、推奨6列も所定の順序 | | C21 | 第8章の優先度の値は P0・P1・P2 | stc-index-rulebook 6.8 | 読み取り | 一致 | 推奨カラムの列挙値と一致 | | C22 | 第8章の自動化の値は manual・automated・mixed | stc-index-rulebook 6.8 | 読み取り | 一致 | 推奨カラムの列挙値と一致 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-index-sample.md`: 7.2 共通合格基準の P0 の対象に「TSP 出口条件の性能基準」を追加し、性能ケース（`会計確定応答`）が P0 に当たるかを判定できるようにした（F002）。表の整形による空白調整以外の変更はない。必須9章、列、既存の数値・例外・期待値、frontmatter は維持した。

## 3. 申し送り

- F001 は kata-guide 6.3 の除外観点にあたり、引継ぎ先 PJR の要否は前段どおり R5 に委ねる。F003 は R2 の実施者表記削除で解消済み、F005 は R1 の個別ケース表削除で概要側の重複が解消済みのため、再修正していない。
- F004 は `stc-sample` 6.2 の観点名を `会計維持` に揃える対応が必要で、R5 で扱う。本タスクでは `stc-sample` を変更していない。
- condense 由来の記録はなく、grade サイドカーは編集していない。駄菓子屋の業務値や架空の CI・データ領域などの仮定は、計画どおり確かめの対象にしていない。
- R4-1: R4 / 7.2. 共通合格基準 / F002: P0 の対象定義から性能ケースを判定できない / P0 の対象に「TSP 出口条件の性能基準」を追加した / `vp-qe-verifiability`、stc-index-rulebook 6.7、tsp-index-sample 第5章の総合テスト出口条件、stc-sample 6.4 の P0 指定 / -
- reporter 向け: 指摘 R4-1 を result の実施内容の指摘表へ1回だけ記載し、その後に以下の C01〜C22 を確かめの表として記載する。列は No、主張（本文の箇所）、正本、確かめ方、結果、根拠。指摘表と確かめの表を申し送りへ重ねないこと。
- C01: 主張=frontmatter を `specdojo` 配下に置く / 正本=docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml、src/shared/frontmatter-namespace.ts / 確かめ方=両ファイルを読み取り / 結果=一致 / 根拠=schema は `specdojo` を必須とし、実装の `readSpecdojoNamespace` は同名前空間を取得する。
- C02: 主張=frontmatter の `id` は specdojo:stc-index-sample / 正本=docs/specdojo/schemas/v1/common-frontmatter.schema.yaml、docs/ja/specdojo/standards/sample-authoring-standard.md 第4章 / 確かめ方=読み取り / 結果=一致 / 根拠=`idRef` の文字制約と sample の接尾辞規則を満たす。
- C03: 主張=frontmatter の `type` は test / 正本=docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml、docs/ja/specdojo/rulebooks/stc-index-rulebook.md frontmatter・4.1 / 確かめ方=読み取り / 結果=一致 / 根拠=test は成果物種別の列挙値で、rulebook の `deliverable_type` も test。
- C04: 主張=frontmatter の `status` は draft / 正本=docs/specdojo/schemas/v1/common-frontmatter.schema.yaml / 確かめ方=読み取り / 結果=一致 / 根拠=許可値 draft・ready・deprecated に含まれる。既存値を維持した。
- C05: 主張=frontmatter の `rulebook` は specdojo:stc-index-rulebook / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 4.1、docs/specdojo/schemas/v1/common-frontmatter.schema.yaml / 確かめ方=読み取り / 結果=一致 / 根拠=指定された参照先が存在し、`rulebookRef` の形式を満たす。
- C06: 主張=frontmatter の `based_on` は文書 ID の配列 / 正本=docs/specdojo/schemas/v1/common-frontmatter.schema.yaml / 確かめ方=読み取り / 結果=一致 / 根拠=重複のない `idRefArray`。TSP と BAC の参照先も存在する。
- C07: 主張=第2章の term は開始から完了までの業務シナリオで分割する / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.2 / 確かめ方=読み取り / 結果=一致 / 根拠=業務・価値境界、境界横断、データ境界、運用境界の順序が一致する。
- C08: 主張=第2章で観点15以上またはケース表60行以上なら分割を再検討する / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.2 / 確かめ方=読み取り / 結果=一致 / 根拠=rulebook の分割候補の閾値と一致する。
- C09: 主張=第4章で5系統から観点を立てる / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.4 / 確かめ方=読み取り / 結果=一致 / 根拠=業務フロー、例外・回復、データ整合、運用観測、代表的非機能の順序が一致する。
- C10: 主張=第5章の条件の要素は入力・状態・環境・経路 / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.5 / 確かめ方=読み取り / 結果=一致 / 根拠=4要素の定義が一致する。
- C11: 主張=第5章で代表シナリオ、重要分岐、重大例外の順に条件を追加する / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.5 / 確かめ方=読み取り / 結果=一致 / 根拠=追加順序と、原則として直積を作らない方針が一致する。
- C12: 主張=6.1 で1観点を1合否命題、1条件を1差分とする / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.6.1 / 確かめ方=読み取り / 結果=一致 / 根拠=観点・条件の定義単位が一致する。
- C13: 主張=6.2 で理由のない主担当の重複を認めない / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.6.2 / 確かめ方=読み取り / 結果=一致 / 根拠=主担当は原則1つで、複数の場合は理由を備考へ書く。
- C14: 主張=7.1 で ST 専用環境の版数・設定を固定する / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.7 / 確かめ方=読み取り / 結果=一致 / 根拠=ST 専用環境とバージョン・設定の固定を定めている。
- C15: 主張=第3章・7.1 の印字結果不明を30秒タイムアウトで再現する / 正本=docs/ja/specdojo/samples/ifx-cmd-sample.yaml / 確かめ方=読み取り / 結果=一致 / 根拠=`execution.timeout_seconds` は30。`timeout_action` は自動再試行せず印字結果不明として通知する定義。架空 CLI の契約定義として照合した。
- C16: 主張=7.2 の P0 対象で TSP 出口条件の性能ケースを判定できる / 正本=docs/ja/specdojo/samples/tsp-index-sample.md 第5章、docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.7 / 確かめ方=読み取り、修正後の差分確認 / 結果=不一致（修正済み） / 根拠=TSP は性能条件の合格を出口条件としているが旧定義は記録・誤確定のみ。性能基準を追加し、全件 Pass の基準を適用できるようにした。
- C17: 主張=7.2 の Major を残す例外は PM 承認と回避手順を要する / 正本=docs/ja/specdojo/samples/tsp-index-sample.md 第5章 / 確かめ方=読み取り / 結果=一致 / 根拠=TSP は総合テストの Major に限って PM の例外承認と回避手順の引継ぎを認める。
- C18: 主張=第8章の `case_id` は `st-&lt;term&gt;-&lt;perspective_key&gt;-&lt;nnn&gt;` / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.8 / 確かめ方=読み取り / 結果=一致 / 根拠=rulebook の形式に `level=st` を適用した形と一致する。
- C19: 主張=第8章のケース番号は010から10刻み / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.8 / 確かめ方=読み取り / 結果=一致 / 根拠=3桁・10刻みの推奨規則を採用している。
- C20: 主張=第8章の必須列は `case_id`、条件、手順、期待値の順 / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.8 / 確かめ方=読み取り / 結果=一致 / 根拠=4必須列の順序が一致し、推奨6列も必須列の後に所定の順序で置いている。
- C21: 主張=第8章の優先度の値は P0・P1・P2 / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.8 / 確かめ方=読み取り / 結果=一致 / 根拠=推奨カラムの列挙値と一致する。
- C22: 主張=第8章の自動化の値は manual・automated・mixed / 正本=docs/ja/specdojo/rulebooks/stc-index-rulebook.md 6.8 / 確かめ方=読み取り / 結果=一致 / 根拠=推奨カラムの列挙値と一致する。
- 進め方と実践の型の適用用: 共通規約、kata-guide 6.1〜6.5、Sample 記述標準、ドキュメントメタ情報標準、テストドキュメントスコープ定義標準、stc-index-rulebook、共通レビュー観点一覧、成果物カタログの対象項目と `done_criteria`、grade result、R2・R3 result、TSP・対象別 STC・印刷連携 sample、frontmatter schema、src/shared/frontmatter-namespace.ts を確認した。rulebook の `recipe`・`template` は `not-needed`。F002 は判定可能性と TSP の出口条件を根拠に修正し、その他の記述と前段の変更を維持した。
- 確認範囲: 対象 sample に実在の SpecDojo コマンド実行例・オプション・既定値の記述はない。コマンドリファレンスも確認した。駄菓子屋の業務値、架空のデータ領域・CI・レポート、7日後の削除など sample 固有の仮定は、計画の指定どおり実在性・実運用の検証対象にしていない。対象とした主張に確かめられないものはなかった。
- finding の扱い: F001 は kata-guide 6.3 の除外観点で、引継ぎ先の要否は前段どおり R5 へ委ねる。F003 は R2 の実施者表記削除で解消済み。F004 は R5 で stc-sample 6.2 の観点名を会計維持へ揃える案を確認する。F005 は R1 の個別ケース表削除で概要側の重複が解消済み。これらを再修正していない。condense 由来の記録はなく、grade サイドカーは変更していない。
- 追従確認: 共通合格基準の明確化で影響する対象は分配表の stc-cash-sale。stc-sample 6.4 の会計確定応答ケースは既に P0 であり、ケース表の変更は不要。架空の kinuya-ci-st のテストコードは本タスクの実装対象ではない。
- 変更ファイル: docs/ja/specdojo/samples/stc-index-sample.md のみ。意味の変更は P0 対象への性能基準の追加で、残りは当該表の整形。必須9章、列、既存の数値・例外・期待値、frontmatter を維持した。result は executor 段の指示に従って編集していない。親 runner 指定の検査は重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下に達していない。）
- 適用外の検証: `npm run validate:history-links`（executor は履歴ファイル、plan、result を変更していない。）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の主張を schema、stc-index-rulebook、tsp-index-sample、`ifx-cmd-sample.yaml`、`src/shared/frontmatter-namespace.ts` と突き合わせた。根拠にした規範は、共通規約、kata-guide 6.1〜6.5、sample-authoring-standard、document-metadata-standard、stc-index-rulebook、共通レビュー観点一覧、成果物カタログの `done_criteria`、grade result、R2・R3 result である。rulebook の `recipe` と `template` は `not-needed`。修正したのは F002 に対応する P0 対象の定義だけで、判定可能性（`vp-qe-verifiability`）と TSP の出口条件を根拠にした。その他の記述と前段の変更は根拠と整合するため維持した。F001・F003・F004・F005 は、この段の観点外か前段で解消済みのため再修正していない。確かめられなかった主張はなかった。
