---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-utc-catalog-040-20261118t113017z-f61b0278
  type: exec-result
  task_id: T-KATA-SLIM-2-utc-catalog-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-utc-catalog-040/T-KATA-SLIM-2-utc-catalog-040-20261118T113017Z-f61b0278/plan.md
  started_at: "2026-11-18T11:30:30.622Z"
  completed_at: "2026-11-18T11:58:22.734Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - utc-catalog
    - specdojo:utc-rulebook
---

# Edit Result

## 1. 実施内容

- `utc-rulebook` から、どの成果物にも共通する文書運用の記述を外し、全体方針の「共通の運用」1項目に集約した。参照先は、適用先のメンバー定義とドキュメントメタ情報標準である。
- 空白・改行を除く文字数は 7,356 字から 5,566 字（75.67%）になり、目安の 8 割以下に収まった。表区切り行も除くと 6,812 字から 5,097 字（74.82%）である。
- 必須 6 章の名称・順序・区分、ケース列の参照先、UTC 固有の禁止事項、Frontmatter は維持した。
- F001（サンプルが標準テンプレートに従っていない）は未解消である。sample が対象外のため、rulebook の要件を正として維持した。
- 整形検査（`prettier`）と `git diff --check` は合格した。runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` も合格した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/utc-rulebook.md`: 共通の運用（役割・status・承認・改訂と廃止・未決事項の引き継ぎ）の個別記述を削り、全体方針の「共通の運用」1項目から参照する形にした。共通メタ情報の再掲と章ごとの重複説明も削減した。例示小節 8.1〜8.6 は、トレースとケースの接続を示す最小コードブロックに集約した。例のメタ情報は `specdojo` 配下へ移し、タイトルを H1 にした。形式不正ケースのトレースは期限切れ仕様を外して TR-01 に絞った。既存要件を照合する受入確認は 3 手順で明示した。

## 3. 申し送り

- F001 は未解消である。`docs/ja/specdojo/samples/utc-sample.md` は独自の 5 章構成とメタ説明のみで、rulebook が要求する必須 6 章・具体的な観点・ケースと一致しない。次段で、必須 6 章・依存制御・トレース・判定可能なケース・証跡を備えた最小の完成例に sample を再構成し、再評価する。grade サイドカーは未編集である。
- カタログ宣言先の `utc-catalog.md` と `utc-index.md` は未作成である。確認できた範囲で rulebook を改訂し、成果物本体は作成・変更していない。frontmatter の `recipe` と `template` は `undecided` のままである。
- 変更ファイルは docs/ja/specdojo/rulebooks/utc-rulebook.md のみ。全体方針の「共通の運用」1項目に、適用先のメンバー定義とドキュメントメタ情報標準への参照を集約した。共通メタ情報の再掲と章ごとの重複説明を削減した。result は executor/reporter の分担に従い未編集。
- 空白・改行を除く文字数は7,356字から5,566字（75.67%）。表区切り行も除く場合は6,812字から5,097字（74.82%）。
- 判断根拠: docs/ja/specdojo/standards/rulebook-authoring-standard.md、document-metadata-standard.md、defaults/pm-review-viewpoints.yaml の `vp-arc-conciseness` と `vp-qe-kata-conformance`、sld-rulebook、PJR-8S4T の展開一覧、utc-index-rulebook、utc-sample、dct-test-specs.yaml、execution/grade/results/specdojo.utc-rulebook.yaml を確認した。必須6章の名称・順序・区分、ケース列の参照先、UTC固有の禁止事項、Frontmatter は維持した。既存要件を照合する受入確認を3手順で明示した。
- 章の扱い: 成果物の章構成は変更なし。rulebook 内の例示小節8.1〜8.6は、記述標準に従いトレースとケースの接続を示す最小コードブロックへ集約した。例のメタ情報を `specdojo` 配下へ移し、タイトルをH1にした。形式不正ケースのトレースは期限切れ仕様を外してTR-01に絞った。
- F001 は未解消。docs/ja/specdojo/samples/utc-sample.md は独自の5章構成とメタ説明のみで、rulebook が要求する必須6章・具体的な観点とケースに一致しない。`vp-qe-kata-conformance` と記述標準に照らし、rulebook の要件を正として維持した。sample は今回の対象外のため変更せず、次段で必須6章・依存制御・トレース・判定可能なケース・証跡を備える完成最小例に再構成し、再評価する。grade サイドカーも未編集。
- カタログ宣言先の utc-catalog.md と utc-index.md は未作成。カタログ・関連規範・sample・grade result で確認できた範囲を改訂し、成果物本体は作成・変更していない。`recipe` と `template` は `undecided` のまま。`includes` 宣言はなく、併せて編集する記法rulebookはない。共通の正本への追加提案と保護設定の変更提案はない。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルはMarkdownのみで、YAMLファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executorの変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下に達しない。）
- 適用外の検証: `npm run validate:history-links`（登録簿・既存plan・resultなどの履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

参照の向きを成果物から rulebook に切り替え、`utc-rulebook` を見直した。根拠は次の資料である。rulebook-authoring-standard、document-metadata-standard、`vp-arc-conciseness` と `vp-qe-kata-conformance`（pm-review-viewpoints）、sld-rulebook、PJR-8S4T の展開一覧、utc-index-rulebook、utc-sample、dct-test-specs.yaml、grade result。共通運用の記述は参照に置き換え、UTC 固有の判断基準・禁止事項・ケース列の参照先・受入確認の手順は残した。`includes` 宣言はなく、併せて直す記法 rulebook はない。共通の正本への追加提案もない。F001 は、sample が rulebook の必須 6 章と一致しないことが原因だった。rulebook を正として維持し、sample の再構成を次段の対応とした。
