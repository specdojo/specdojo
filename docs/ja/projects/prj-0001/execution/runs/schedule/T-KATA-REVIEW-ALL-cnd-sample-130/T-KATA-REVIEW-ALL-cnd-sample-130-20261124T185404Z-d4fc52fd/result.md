---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cnd-sample-130-20261124t185404z-d4fc52fd
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cnd-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cnd-sample-130/T-KATA-REVIEW-ALL-cnd-sample-130-20261124T185404Z-d4fc52fd/plan.md
  started_at: "2026-11-24T18:54:12.205Z"
  completed_at: "2026-11-24T19:06:08.484Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cnd-sample
    - specdojo:cnd-sample
---

# Edit Result

## 1. 実施内容

- cnd-sample の R3（読みやすさ）レビューを実施し、指摘6件を sample に反映した。展開済みの grade finding はなく、根拠不足による見送りや「要判断」の指摘もない。
- 指摘は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 概要 | 「販売記録は、記録漏れや確認の手間が生じる」は主語と述語の対応が不明瞭 | ノートと店主の記憶に頼ることを条件とする文にした | W2 | - | | R3-2 | R3 | 概要、メモ / 将来課題の「上位図・配備案との照合」 | 方針と構成の目的、別構成の説明と設計根拠への不採用、照合と実行可能性の確認がそれぞれ一文に重なる | 主張ごとに文を分け、別構成との関係と実行・接続の仮定を別段落にした | W3、`vp-ux-readability` | - | | R3-3 | R3 | 概要、Container、Data Store、コンテナ間・外部依存の検証対象 | CLI・API・HTTP の初出に正式名がなく、EC・DB・schema・Pass・Fail の意味を読者が補う必要がある | CLI・API・HTTP に正式名を添え、他は電子商取引・データベース・スキーマ・合格・不合格と表記した | W8、`vp-ux-language-consistency` | - | | R3-4 | R3 | Person、Container、Data Store、External Software System、Relationship、メモ / 将来課題 | 表の前に対応関係の説明がないか、架空文書である旨の注記だけになっている | 各表が対応させる情報を一文で示し、既存の注記を残した | `vp-ux-readability`、Sample 記述標準「記述ガイド」の表の前の一文 | - | | R3-5 | R3 | 技術前提・制約 | 「応答欠落では受付済み」の主体が省略され、未確定事項と利用制限の参照先も一文に重なる | 販売処理サービスの応答と依頼受付を明示し、条件・必要な契約、未確定事項・利用制限の参照先を別文にした | W1、W3 | - | | R3-6 | R3 | コンテナ間・外部依存の検証対象 | 照合方法、合否条件、未判定条件が一文にまとまっている | 照合対象、合否条件、未判定条件を別文にした | W3 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cnd-sample.md`: R3 の読みやすさ修正として、主語・述語の補完、長文の分割、CLI・API・HTTP への正式名の付記、略語・英語表記の日本語化、表の前の対応関係の一文の追加を行った。Frontmatter、Mermaid 図、見出し、関係・参照 ID、表の行列数、文意・背景・例外・制約・課題の解消条件は維持した。

## 3. 申し送り

- 変更ファイルは `docs/ja/specdojo/samples/cnd-sample.md` のみ。result と grade サイドカーは未編集。
- 親 runner の指定検証（`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`）は passed。ほかは変更種別により runner が `not_applicable` と判定した。
- R3-1: R3 / 箇所: 概要 / 指摘: 「販売記録は、記録漏れや確認の手間が生じる」は主語と述語の対応が不明瞭 / 直した案: ノートと店主の記憶に頼ることを条件とする文にした / 根拠: W2 / 印: -
- R3-2: R3 / 箇所: 概要、メモ / 将来課題の「上位図・配備案との照合」 / 指摘: 方針と構成の目的、別構成の説明と設計根拠への不採用、照合と実行可能性の確認がそれぞれ一文に重なる / 直した案: 主張ごとに文を分け、別構成との関係と実行・接続の仮定を別段落にした / 根拠: W3、`vp-ux-readability` / 印: -
- R3-3: R3 / 箇所: 概要、Container、Data Store、コンテナ間・外部依存の検証対象 / 指摘: CLI・API・HTTP の初出に正式名がなく、EC・DB・schema・Pass・Fail の意味を読者が補う必要がある / 直した案: CLI・API・HTTP に正式名を添え、他は電子商取引・データベース・スキーマ・合格・不合格と表記した / 根拠: W8、`vp-ux-language-consistency` / 印: -
- R3-4: R3 / 箇所: Person、Container、Data Store、External Software System、Relationship、メモ / 将来課題 / 指摘: 表の前に対応関係の説明がないか、架空文書である旨の注記だけになっている / 直した案: 各表が対応させる情報を一文で示し、既存の注記を残した / 根拠: `vp-ux-readability`。Sample 記述標準「記述ガイド」の表の前の一文 / 印: -
- R3-5: R3 / 箇所: 技術前提・制約 / 指摘: 「応答欠落では受付済み」の主体が省略され、未確定事項と利用制限の参照先も一文に重なる / 直した案: 販売処理サービスの応答と依頼受付を明示し、条件・必要な契約、未確定事項・利用制限の参照先を別文にした / 根拠: W1、W3 / 印: -
- R3-6: R3 / 箇所: コンテナ間・外部依存の検証対象 / 指摘: 照合方法、合否条件、未判定条件が一文にまとまっている / 直した案: 照合対象、合否条件、未判定条件を別文にした / 根拠: W3 / 印: -
- reporter 向け判断根拠: [[specdojo:kata-guide|実践の型活用ガイド]]の R3・W1〜W10・報告形式、[[specdojo:specdojo-philosophy|SpecDojo の考え方]]の「簡潔さと文章量を責務に合わせる」、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]]を確認した。対応する CND rulebook・記法 rulebook・recipe、R1・R2 result、対象 sample の既存 grade、実成果物 cnd-specdojo とその grade、cxd-sample、用語集も参照した。展開済み finding はなく、根拠不足による見送りや要判断の指摘はない。指摘6件は result の実施内容に表として1回だけ記載する。
- reporter 向け変更・維持記録: 変更ファイルは `docs/ja/specdojo/samples/cnd-sample.md` のみ。文意・背景・例外・制約・課題の解消条件を維持した。Frontmatter、Mermaid 図、見出し、関係・参照 ID、表の行列数の一致を機械比較し、R1 の保存結果不明時の追記と R2 の構成修正が残ることを確認した。result・grade サイドカーは未編集。親 runner の指定検証は runner に委ねた。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample のみで、YAML・YML ファイルを変更していない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイルおよび plan・result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は sample のみで、docs/ja/projects/ 配下の成果物を変更していない。）

## 4. 進め方と実践の型の適用

sample メンテナンスの進め方に従い、kata-guide の R3 と文章のチェック項目 W1〜W10 を基準にした。参照した資料は、SpecDojo の考え方の「簡潔さと文章量を責務に合わせる」、Sample 記述標準、Rulebook 記述標準、共通レビュー観点一覧、対応する CND rulebook・記法 rulebook・recipe、R1・R2 の result、対象 sample の既存 grade、実成果物 cnd-specdojo とその grade、cxd-sample、用語集である。R1 の保存結果不明時の追記と R2 の構成修正は維持した。文意と判断に要る背景・制約は変えていない。rulebook と矛盾する箇所はなく、rulebook を正として覆した箇所もない。
