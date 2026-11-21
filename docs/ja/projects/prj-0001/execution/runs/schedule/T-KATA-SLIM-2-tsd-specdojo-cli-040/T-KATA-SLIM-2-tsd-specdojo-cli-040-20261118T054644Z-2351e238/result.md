---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-tsd-specdojo-cli-040-20261118t054644z-2351e238
  type: exec-result
  task_id: T-KATA-SLIM-2-tsd-specdojo-cli-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-tsd-specdojo-cli-040/T-KATA-SLIM-2-tsd-specdojo-cli-040-20261118T054644Z-2351e238/plan.md
  started_at: "2026-11-18T05:46:50.731Z"
  completed_at: "2026-11-18T06:16:30.632Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - tsd-specdojo-cli
    - specdojo:tsd-rulebook
---

# Edit Result

## 1. 実施内容

- `tsd-rulebook.md` から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えた。TSD 固有の判断基準、標準の列、動作確認の合格条件は残した。
- 全体方針に「共通の運用」を1項目追加した。作成・維持・確認の役割は適用先のメンバー定義へ、`status`・承認・改訂と廃止・未決事項の引き継ぎはドキュメントメタ情報標準へ委ねた。
- 文書の整形・lint を業務の動作確認から分離した。
- 空白（改行を含む）を除いた文字数は5,084字から4,029字（79.25%）になり、目安の8割以下を満たした。
- F001 に対応し、冒頭に構築・接続・日常利用を行う人と確認者、採用設定・正常性を照合する利用場面を明示した。
- ランナー所管の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` は passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/tsd-rulebook.md`: 共通運用の記述を正本参照に置き換えて簡潔にした。全体方針に「共通の運用」を1項目追加し、役割の記述、`status`・承認・改訂と廃止・未決事項の引き継ぎ、Frontmatter の共通項目表、共通規約と重複する禁止事項を削った。位置づけ表の重なる説明は統合した。冒頭と本文要件の「概要・位置づけ」に、誰がどの作業・判断に使うかを追加した。全見出し、本文11項目の名称と必須・条件付き・任意の区分、採用設定表6列、動作確認表4列、Frontmatter は変更していない。

## 3. 申し送り

- F001 の担当 Role code は、今回の編集方針に従ってメンバー定義へ委ねた。rulebook 側では想定読者と利用場面の明示で対応しており、再評価は runner 側で行う。
- `includes` 宣言はなく、付随する記法 rulebook は対象なしだった。
- 後続の変更案（recipe・sample・template は今回未変更）として、`tsd-recipe` の担当・判断時期の要求と、`tsd-sample` の役割・担当・判断期日・承認条件の記述を共通運用へ委ねることが挙げられている。
- 変更ファイルは docs/ja/specdojo/rulebooks/tsd-rulebook.md のみ。全体方針に「共通の運用」を1項目追加し、作成・維持・確認の役割を適用先のメンバー定義へ、`status`・承認・改訂と廃止・未決事項の引き継ぎをドキュメントメタ情報標準へ委ねた。文書の整形・lint を業務の動作確認から分離した。result は executor stage の指示に従い未編集。
- 判断根拠: rulebook-authoring-standard、document-metadata-standard、共通レビュー観点の vp-ba-stakeholder-clarity／vp-arc-conciseness、PJR-8S4T の「他の型へ広げるときの一覧」、改訂済み sld-rulebook、tsd-recipe、tsd-sample を確認した。位置づけ表の重なる説明を統合し、Frontmatter の共通項目表を正本参照へ置換。禁止事項の共通規約との重複を削り、TSD 固有の禁止事項と認証情報の記述方法を残した。
- F001: 冒頭に構築・接続・日常利用を行う人と確認者、採用設定・正常性を照合する利用場面を明示し、本文要件の「概要・位置づけ」に誰がどの作業・判断に使うかを追加した。担当 Role code の割り当ては今回の編集方針に従ってメンバー定義へ委ねた。既存 grade result は編集前ファイルと内容ハッシュが異なるため歴史的な指摘として扱い、現在の本文と判定根拠を照合した。再評価は runner 側で行う。
- 根拠に指定された tsd-specdojo-cli.md は未作成。dct-architecture.yaml の宣言・完了条件、上位設計 cpd-specdojo-cli.md、既存成果物 tsd-ollama-opencode.md／tsd-home-mac-dev-server-usage.md と既存 grade 記録を補助根拠にした。再現性・接続・状態保持・切り分けの要件は維持し、成果物側の不備を理由に要件を緩和していない。
- 全見出し、本文11項目の名称と必須・条件付き・任意の区分、採用設定表6列、動作確認表4列、Frontmatter は変更なし。空白（改行を含む）除外で5,084→4,029字（79.25%）。SLD 試行と同じく表の区切り行も除く場合は4,502→3,590字（79.74%）。比較スクリプトで構造維持と両方式の80%以下を確認した。`includes` 宣言はなく、付随する記法 rulebook は対象なし。
- 後続変更案: tsd-recipe の「作成前に集める情報」、状態表、深掘り・レビュー・仕上げチェックにある担当・判断時期の要求を共通運用へ委ねる。tsd-sample の「役割と責任」、未解決事項表の担当・判断期日・管理用アクション、ready 昇格・承認条件を削り、論点・影響・技術上の判断基準と動作確認の合格条件を残す。recipe・sample・template は今回未変更。
- 共通正本への追記案と保護設定の変更案はなし。Frontmatter の旧表で `rulebook` を推奨としていた箇所は、document-metadata-standard の必須規定を正とした。親 runner 所管の lint・schema・型検査・単体／結合テストは sandbox で重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更ファイルは Markdown rulebook のみで、変更した YAML ファイルがない。）
- 適用外の検証: `npm run validate:history-links`（登録簿・既存 plan・result などの履歴蓄積ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として、`rulebook-authoring-standard`、`document-metadata-standard`、共通レビュー観点（`vp-ba-stakeholder-clarity`・`vp-arc-conciseness`）、PJR-8S4T の「他の型へ広げるときの一覧」、改訂済み `sld-rulebook`、`tsd-recipe`、`tsd-sample` を根拠に見直した。根拠に指定された `tsd-specdojo-cli.md` は未作成のため、`dct-architecture.yaml` の宣言と完了条件、上位設計 `cpd-specdojo-cli.md`、既存成果物 `tsd-ollama-opencode.md`・`tsd-home-mac-dev-server-usage.md` を補助根拠にした。再現性・接続・状態保持・切り分けの要件は維持し、成果物側の不備を理由に要件を緩めていない。Frontmatter の旧表で `rulebook` を推奨としていた箇所は、`document-metadata-standard` の必須規定を正とした。
