---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-cxd-specdojo-040-20261118t042028z-f6e26535
  type: exec-result
  task_id: T-KATA-SLIM-2-cxd-specdojo-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-cxd-specdojo-040/T-KATA-SLIM-2-cxd-specdojo-040-20261118T042028Z-f6e26535/plan.md
  started_at: "2026-11-18T04:20:34.893Z"
  completed_at: "2026-11-18T04:41:55.252Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - cxd-specdojo
    - specdojo:cxd-rulebook
---

# Edit Result

## 1. 実施内容

- CXD の rulebook（`cxd-rulebook.md`）と、`includes` で取り込む `cxd-mermaid-rulebook.md` から、共通の文書運用の記述を外して共通正本への参照に置き換え、簡潔にしました。
- 空白除外文字数は `cxd-rulebook.md` が 9,169字→7,333字（79.98%）、`cxd-mermaid-rulebook.md` が 7,906字→5,472字（69.21%）です。
- grade の F001 は、全体方針の委譲先列挙を「正本の選び方と参照の境界」への参照に変えて解消しました。F002 は共通標準に Mermaid 検査手順がないため未解消で、変更案として申し送ります。
- `source=condense` の 6 記録は原因箇所と照合し、いずれも保持と判断した内容を維持しました。
- 変更は `docs/ja/specdojo/rulebooks/` 配下の 2 ファイルだけです。成果物本体、recipe、template、sample は変更していません。
- runner が実行した `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`validate:schema`、`test:unit`、`test:integration` は passed でした。`lint:ts` と `typecheck` は変更種別により対象外です。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cxd-mermaid-rulebook.md`: 重複する plainText ブロックと共通規約の再掲を削除して簡潔にしました。見出し階層と番号末尾を標準に合わせ、章タイトルと Mermaid の図例は維持しました。「一店員」の誤記は「店員」に直しました。空白除外文字数は 7,906字→5,472字です。
- `docs/ja/specdojo/rulebooks/cxd-rulebook.md`: 全体方針の委譲先列挙を「正本の選び方と参照の境界」への参照に置き換え（F001）ました。役割・status・承認・改訂と廃止・未決事項の引き継ぎなど共通運用の記述を `document-metadata-standard` への参照へ寄せました。章名・順序・必須／条件付き区分と、Person・外部システム・Relationship の推奨列は維持しました。空白除外文字数は 9,169字→7,333字です。

## 3. 申し送り

- F002 の変更案: 共通標準（`document-metadata-standard` の「バリデーション」など）に、`npm run lint:mermaid -- &lt;document-path&gt;` を使う手順を追記してください。合格条件は構文エラーと未検査がともにゼロであることです。失敗時は構文または依存環境を直して再検査する旨も書いてください。`package.json` と `tools/lint-mermaid.mjs` でコマンドと判定動作を確認済みです。この段の変更範囲外のため、共通標準には追記していません。
- 後続変更案（recipe・template・sample）: `cxd-template` と `cxd-sample` の「メモ / 将来課題」は、担当ロール列と引き継ぎ先の管理情報を外し、論点・影響・解消条件を中心にしてください。`cxd-recipe` の手順 6、メモの問い・例、仕上げ確認にある担当・追跡先の要求も共通運用へ委ねてください。
- 空白除外文字数: cxd-rulebook.md は9,169字→7,333字（79.98%）、cxd-mermaid-rulebook.md は7,906字→5,472字（69.21%）。変更ファイルは docs/ja/specdojo/rulebooks/ 配下のこの2ファイルのみです。
- 判断根拠: rulebook-authoring-standard、document-metadata-standard、SLD rulebook、PJR-8S4T「他の型へ広げるときの一覧」、CXD recipe・template・sample、cxd-specdojo、grade result（specdojo.cxd-rulebook.yaml）、condense result（prj-0001:xer-t-kata-wave-1-cxd-specdojo-080-20261114t124526z-e35312ed）、共通観点 vp-arc-conciseness / vp-dev-testability を確認しました。
- F001（source=grade）は全体方針の委譲先列挙を「正本の選び方と参照の境界」への参照に変更して解消しました。同節の対応表は変更していません。
- F002（source=grade）は共通正本の不足として未解消です。document-metadata-standard の「バリデーション」には Mermaid の検査手順・合格条件がありません。exec-config-guide は親検証の概要を示しますが、対象指定と未検査ゼロの条件を満たしません。変更案: 共通標準に `npm run lint:mermaid -- &lt;document-path&gt;`、構文エラー・未検査がともにゼロであること、失敗時は構文または依存環境を修正して再検査することを追記してください。package.json と tools/lint-mermaid.mjs でコマンドと判定動作を確認済みです。この段の変更範囲に従い、共通標準へは追記していません。
- source=condense の6記録を原因箇所と照合しました。概要の読者確認観点と Person の利用責務を区別し、人間とシステムの責任分界、図の方向・応答省略の注記、仮定と見直し条件、同一端末上の外部責務、詳細正本への委譲を維持しました。文書運用の役割割り当て・承認手順は共通参照に置き換えました。
- 成果物の章名・順序・必須／条件付き区分、Person・外部システム・Relationship の推奨列を維持しました。Mermaid rulebook は章タイトルを維持し、見出し階層と番号末尾を標準へ合わせ、重複する plainText ブロックを削除しました。Mermaid の図例は保持し、「一店員」の誤記だけを「店員」に直しました。
- 後続変更案: cxd-template と cxd-sample の「メモ / 将来課題」は担当ロール列と引き継ぎ先の管理情報を外し、論点・影響・解消条件を中心にしてください。cxd-recipe の手順6、メモの問い・例、仕上げ確認にある担当・追跡先の要求も共通運用へ委ねてください。recipe・template・sample と成果物本体は今回変更していません。
- 親 runner に指定された lint・schema・型検査・単体／統合テストは executor では実行していません。result の実施内容・変更ファイル・判断根拠には本レポートの内容を反映してください。
- 適用外の検証: `npm run validate:schema:file`（YAML ファイルの変更がありません。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイルや plan・result を変更していません。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下だけで、docs/ja/projects/ 配下の成果物変更がありません。）

## 4. 進め方と実践の型の適用

`rulebook-maintenance` の進め方に従い、`rulebook-authoring-standard`、`document-metadata-standard`、改訂済み SLD rulebook、PJR-8S4T の「他の型へ広げるときの一覧」を手本にしました。あわせて CXD の recipe・template・sample、成果物 `cxd-specdojo`、grade result、condense result、共通観点 `vp-arc-conciseness` と `vp-dev-testability` を確認しました。共通運用の記述は参照へ置き換え、型固有の判断基準・区分・禁止事項・受入確認は残しました。F001 は解消しました。F002 は共通標準に Mermaid 検査手順がなく根拠が不足するため、推測で rulebook を改訂せず変更案として申し送りました。condense の 6 記録（読者別とアクター別の表の役割差、責任分界、図の注記、仮定と将来課題の分担、同一端末上の外部責務、詳細正本への委譲）はすべて保持と判断し、その内容を維持しました。
