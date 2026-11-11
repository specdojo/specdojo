---
specdojo:
  id: prj-0001:pjr-vzt1-uis-kata-polish
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T12:44:22Z"
  derived_from:
    - PJR-T88P
  autopilot: approved
  approach: rulebook-maintenance
  targets:
    - specdojo:uis-rulebook
---

# PJR-VZT1 画面仕様（uis）の型を、標準の章立てと中身の厚さに磨き込む

## 1. 概要

uis-rulebook と uis-sample を、ほかの業務仕様の型と同じく標準の章立て、記述ガイドの判断の基準と良い例・悪い例、clis-sample 程度の厚さの sample に磨き込み、grade を通す

## 2. 入力

- uis の代表は今回作らなかった（SpecDojo に GUI がないため、PJR-RMMM）が、型は磨き込んでおく（indie の要望、2026-11-10）。夜間に流す。
- 保存済みの grade は uis-rulebook が needs-work 83（2026-10-10）、uis-sample が fail 54（2026-10-20）で、どちらも PJR-X3T8 で GUI だけにした後（2026-11-08）の評価ではない。

## 3. 完了条件

- [[specdojo:uis-rulebook]] を、[[specdojo:rulebook-authoring-standard]] の章立てに合わせている。rulebook にサンプルの章を置かず、`##` から `####` の見出しに連番を付けている。
- 記述ガイドに、章（概要・対象ユーザー/利用目的・表示項目・操作・遷移・バリデーション・エラー表示と利用者の次の手）ごとの判断の基準と、良い例・悪い例を書いている。
- `uis-sample` を、駄菓子屋の販売管理システムの GUI の画面の完成例として、[[specdojo:clis-sample]] 程度の厚さにしている。規則の必須の項目をすべて満たしている。
- GUI の画面仕様だけを対象とし、CLI は clis で書く、ワイヤーフレーム・レイアウトは含めない、という今の決まり（PJR-RMMM・PJR-PJYJ）を保っている。
- recipe と template の要否を決め、frontmatter に書いている。
- 磨き込みの後に `specdojo grade run --project prj-0001 --target kata --path docs/ja/specdojo/rulebooks/uis-rulebook.md --path docs/ja/specdojo/samples/uis-sample.md --run-id <任意>` を流し、rulebook と sample がどちらも pass になっている。pass にならない指摘は直すか、直さない理由を個票の対応結果に書いている（grade を流すのは orchestrator が行ってもよい）。
- 2 回目の実行（2026-11-11 追加）: 1 回目の後の grade（run id `uis-20261111`）で、uis-rulebook は pass 100 になったが、uis-sample は needs-work 93 で pass に届かなかった。次の minor の指摘を直し、grade で uis-sample が pass になっている（grade は orchestrator が流してよい）。
  - 未解決の点の表に、確認の担当（Role code）と報告先を書く。
  - PO の承認の責任と、公開の対象の範囲を書く。
  - プロジェクト側へ引き継ぐ未解決の点を、sample の中の点と分けて書く。
  - 在庫 0 の商品を初めて足すときに失敗した操作では明細の行ができないため、「明細削除」を次の手としている例を、実際の状態に合う次の手に直す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- uis 以外の型と、カタログを変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                         | 担当                    | 状態           | メモ                                                                                  |
| --- | -------------------------------------------- | ----------------------- | -------------- | ------------------------------------------------------------------------------------- |
| 1   | 今の uis の型と、標準・clis の型を読み比べる | executor                | done           | 執筆標準、既存の決定、保存済み grade の判定根拠を確認                                 |
| 2   | rulebook と sample を磨き込む                | executor                | done           | 標準章構成、章別の判断基準と例、GUI 販売登録の完成例を整備                            |
| 3   | 検査と grade を流し、対応結果に書く          | executor / orchestrator | ホスト確認待ち | 整形・静的検査と grade の対象選択を確認。親検証と実 agent による grade は後続段で確認 |

## 5. 対応結果

### 5.1. 実施内容と成果物

- [[specdojo:uis-rulebook|画面仕様作成ルール]] を、全体方針・位置づけ・ファイル命名・ID規則・推奨 Frontmatter 項目・本文要件・記述ガイド・禁止事項の 7 章に整理した。内容の重なる用語定義と運用ルールを統合し、`##`〜`####` の連番を定めた。
- 記述ガイドの概要、対象ユーザー/利用目的、表示項目、操作、遷移、バリデーション、エラー表示と利用者の次の手に、それぞれ判断基準と良い例・悪い例を記した。表示・操作・遷移・入力制約・エラーの推奨表には、記入する列と具体例を示した。
- [[specdojo:uis-sample|販売登録画面の完成例]] に、空の明細、入力の初期値・更新契機、内税と釣銭の確認例、状態別の操作可否、戻り・中止・再認証、入力境界、通信失敗と会計結果不明時の回復を記した。担当者名は共通サンプル文脈の役割表記へ合わせた。

### 5.2. 進め方と実践の型の適用

- 規範は [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:docs-structure-guide|ドキュメント構成ガイド]] を確認した。[[specdojo:ryu-guide|進め方活用ガイド]] の実践の型メンテナンスに従い、構造・必須項目・禁止事項の正本を rulebook として sample と照合した。
- 比較対象は [[specdojo:clis-rulebook|CLI仕様作成ルール]] と [[specdojo:clis-sample|販売管理 CLI の完成例]]。入力・出力を業務上の意味と失敗時の扱いまで記述する粒度を、GUI の表示項目・操作・入力制約・回復へ適用した。
- [[prj-0001:pjr-rmmm-uis-kata-confirm|PJR-RMMM]]、[[prj-0001:pjr-pjyj-clis-uis-kata-confirm|PJR-PJYJ]]、[[prj-0001:pjr-x3t8-uis-kata-gui-only|PJR-X3T8]] と成果物リファレンスを確認し、GUI 専用、CLI は clis、ワイヤーフレーム・レイアウトを含めない範囲を引き継いだ。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.uis-rulebook.yaml` と `specdojo.uis-sample.yaml` を確認した。両評価は GUI 専用化前の内容を対象としているため、現行本文と照合して適用を判断した。plan の成果物由来の Kata finding・condense 記録はともに 0 件だった。
- 判定根拠は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-qe-omissions-consistency`、`vp-qe-kata-conformance`、`vp-ux-language-consistency`、`vp-arc-conciseness`。必須章・メタ情報・完成例の整合と、判断情報を失わず統合できる重複を確認した。

| 指摘                                     | 現行版の確認と対応                                                                                                                 |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| rulebook F001・F002・F005                | `type: ui` への統一は現行版で修正済み。宣言、項目表、良い例、sample で一致することを確認し、誤った `screen` は悪い例だけに限定した |
| rulebook F003                            | `part_of` は現行版の定義表に追加済み。所属する親の ID 配列という意味を保ち、完成例の空配列と照合した                               |
| rulebook F004                            | 現行 sample は標準構成へ修正済み。今回、本文要件の全項目を具体化し、各章の内容を操作・遷移・エラー間で対応づけた                   |
| 旧 sample の抽象性・構成不整合           | 販売登録画面の完成例として、対象ロール、表示値、操作可否、遷移、入力境界、回復結果を具体化した                                     |
| 旧 sample の `screen`・`title` 要求      | 現行のメタ情報標準と rulebook を正とし、`type: ui` と本文 H1 の画面名を維持した                                                    |
| 旧 sample の計画・承認・公開に関する要求 | 現行の完成例へプロジェクト管理の章は追加しなかった。画面の業務上の条件は本文へ具体化し、文書の確定は共通規約に従う                 |

### 5.3. executor が決めた内容と理由

- `recipe: not-needed` と `template: not-needed` を採用した。単一画面の本文要件と章別ガイドに記述上の判断を集約でき、完成例から粒度を確認できるため、独立した手順書や骨組みの二重管理を増やす必要はないと判断した。要否と所在は Frontmatter の宣言で示した。
- 入力がある画面のバリデーションを条件付き必須とした。入力のない画面の省略は維持し、入力があるのに制約が未記載となる余地を解消した。
- sample の会計結果不明時は、同じ取引番号の「結果確認」を経て復帰する仕様とした。販売の二重記録を避け、利用者が確定の有無を判断できる例を示すため、会計処理中・結果確認待ちの操作制限と再試行条件を明記した。
- 金額例は税込単価と税率別内税額を使い、合計 326 円・預かり金 500 円・釣銭 174 円の検証可能な組合せとした。税額を請求額へ二重加算しないことを明記した。実プロジェクトの業務規則がある場合は、rulebook の参照方針に従ってその正本を使用する。
- 共通サンプル文脈に合わせて単一店舗・タブレット 1 台とし、接続できない場合の扱いは本画面の仮定として表示した。店主が紙による継続を判断する際は、未確認取引の番号と状況を引き継ぐ。

### 5.4. 検証と後続確認

- Prettier の整形と `--check`、`git diff --check`、`register build --project prj-0001`、`npm run validate:history-links` は通過した。
- hook の `node --import tsx tools/catalog-validate-if-configured.mjs` は終了コード 0。既存カタログには実装参照が再エクスポートのみの警告と、未作成仕様の参照確認を省略する警告が出た。
- `grade run --dry-run` で、rulebook と sample の 2 件が `sol-review-executor` の評価対象へ解決されることを確認した。
- 実 grade は実 agent CLI の起動と利用枠の消費を伴うため、executor の sandbox 外で行う `requires_human` の確認事項とした。旧評価の値は現行版の pass 証跡として使用しない。orchestrator が次を実行し、両方の verdict を確認する。

```bash
node --import tsx src/specdojo.ts grade run --project prj-0001 --target kata \
  --path docs/ja/specdojo/rulebooks/uis-rulebook.md \
  --path docs/ja/specdojo/samples/uis-sample.md \
  --run-id pjr-vzt1-uis-polish-20261111
```

- `npm run lint:md`・`npm run lint:fm`・`npm run test:unit` を含む指定済みの親検証は runner の実行結果を正とする。grade が pass にならない場合は、指摘の修正または改訂しない理由を本節へ追記する。

### 5.5. CHANGELOG に書く事項

- 区分は「変更」。
- 行の文案は「画面仕様（uis）の型を標準章構成へ整理し、章別の判断基準と良い例・悪い例、入力境界・会計結果確認・回復操作まで含む GUI 販売登録画面の完成例を整備」。

### 5.6. 申し送り

- 実 agent による grade の実行と両文書の pass 確認、親 runner による検証結果の確認が残る。編集成果物は uis の rulebook・sample と本個票であり、後続段は本節の根拠と判断内容を実行結果へ転記する。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-t88p-business-specs-kata]]
- 対象: [[specdojo:uis-rulebook]]
- 手本: [[specdojo:clis-rulebook]]
