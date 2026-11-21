---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-imp-data-040-20261118t053630z-2f778671
  type: exec-result
  task_id: T-KATA-SLIM-2-imp-data-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-imp-data-040/T-KATA-SLIM-2-imp-data-040-20261118T053630Z-2f778671/plan.md
  started_at: "2026-11-18T05:36:43.377Z"
  completed_at: "2026-11-18T06:06:22.833Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:imp-data
    - specdojo:imp-data-rulebook
---

# Edit Result

## 1. 実施内容

- `imp-data-rulebook` から、どの成果物にも共通する文書運用の記述を外し、全体方針の「共通の運用」1項目で正本参照にした。
- 影響度の高・中・低の判定条件、`imp-business` を `based_on` の必須根拠とする規則、構造・整合性、データ検証・移行テスト、実装への影響の必須記述を補った。
- 空白を除いた文字数は2,641字から2,061字（78.04%）になり、目安の8割以下を満たした。
- 整形検査と差分の空白検査に合格した。runner の lint-fm、lint-md、lint-mermaid、lint-d2、test-integration、validate-schema、test-unit も合格した。lint-ts と typecheck は変更種別により対象外だった。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/imp-data-rulebook.md`: 用語表、共通 Frontmatter 項目の再掲、未解決事項の担当・期限管理、共通の重複転記禁止を外した。全体方針には「共通の運用」を1項目置いて正本を参照させた。F002 への対応として、整合性・可用性・移行難易度・利用者影響の高・中・低の判定条件、最大の判定を採る集約方法、案件の境界値の明示を追加した。F003 への対応として、`imp-data` が `local_id` であることを明記した。F004・F005 への対応として、`&lt;project-id&gt;:imp-business` を `based_on` の必須根拠にした。F006・F007 への対応として、構造・整合性、データ検証・移行テスト、実装変更への影響と、影響なしの理由を必須記述にした。F010 への対応として、波及先の型と適用先カタログの成果物 ID を備考で示す規則を加えた。F011 への対応として、「重要度」を「影響度」に統一した。章名「位置づけと用語定義（必要に応じて）」は「位置づけ」に変えた。成果物の6章名、全章必須の区分、影響詳細の標準6列は維持した。

## 3. 申し送り

- F008 は、sample に判定可能な成功条件を追記する作業が未実施である。sample は編集対象外のため、sample の改訂時に売上合計などの成功条件を追加する必要がある。
- F009 は rulebook 側に適用尺度を明記して対応した。sample 側には尺度と各判定の根拠の補完が残る。今回は rulebook を正とし、sample に合わせた要件の緩和はしていない。
- sample への変更案は次のとおり。直接根拠となる業務影響調査との対応、構造・整合性／検証・移行テスト／実装への影響、受入確認の手順・合格条件を補完する。「未解決事項」の担当・決定期限の列とレビュー運用の記述は外し、論点・不足情報・影響・当面の扱いに整理する。
- 再 grade による finding の正式な更新は後続工程で行う必要がある。
- 実施内容・変更ファイル: docs/ja/specdojo/rulebooks/imp-data-rulebook.md のみ編集。用語表、共通 Frontmatter 項目の再掲、未解決事項の担当・期限管理、共通の重複転記禁止を外した。全体方針に「共通の運用」を1項目置いた。成果物・recipe・template・sample・grade サイドカー・result は変更していない。Frontmatter は変更前と同一。includes の宣言はなく、追加の記法 rulebook は対象なし。
- 大きさ: ファイル全体から空白・改行を除去して、変更前2,641字、変更後2,061字、比率78.04%。sld 試行と同様に表の区切り行も除く補助計測では2,345字から1,970字（84.01%）。不足していた判断基準と受入条件を残し、文字数だけを理由に削除していない。
- 進め方と実践の型の適用・根拠: docs/ja/specdojo/standards/rulebook-authoring-standard.md、document-metadata-standard.md、id-and-file-naming-standard.md、docs/ja/specdojo/defaults/pm-review-viewpoints.yaml の該当6観点、docs/ja/specdojo/references/deliverables-reference.md、sld-rulebook.md、pjr-8s4t-sld-kata-slim-pilot.md の展開一覧を確認した。業務の影響判断と文書運用を分ける方針、重複用語表の省略、正規 ID、共通運用の正本参照を適用した。共通正本への追記は不要と判断した。
- 成果物・評価根拠: docs/ja/projects/prj-0001/010-deliverables-catalog/dct-impact-analysis.yaml、docs/ja/specdojo/samples/imp-data-sample.md、改訂済み imp-business-rulebook.md、docs/ja/projects/prj-0001/execution/grade/results/specdojo.imp-data-rulebook.yaml を確認。grade の内容ハッシュは編集前ファイルと一致した。指定された imp-data.md とその親の050-impact-analysisディレクトリは存在せず、カタログ・sample・grade を根拠に改訂した。成果物不在だけを理由に見送っていない。
- finding 対応: F001は重複用語表を削除。F002は整合性・可用性・移行難易度・利用者影響について高／中／低を分ける条件、最大の判定を採る集約方法、案件の境界値の明示を追加。F003は既存の正規 ID 指定を維持し、imp-data が `local_id` であることを明記。F004・F005は作成済みの `&lt;project-id&gt;:imp-business` を `based_on` の必須根拠とした。F006・F007は構造・整合性、データ検証・移行テスト、実装変更への影響と、影響なしの理由を必須記述にした。F010は波及先の型と適用先カタログの成果物 ID を備考で示す規則を追加。F011は重要度を影響度へ統一した。
- 章構成・維持判断: 成果物の6章名、全章必須の区分、影響詳細の標準6列を維持した。rulebook の「位置づけと用語定義（必要に応じて）」のみ「位置づけ」へ変更。用語表が後続の章・列定義の言い換えであり、rulebook 記述標準と冗長性の観点に従い省略したため。対応方針の実施担当・実施時期・見送りの再評価条件はデータ変更の実行判断に必要なため維持し、未解決事項の台帳管理とは区別した。
- 未解消 finding と次のアクション: F008の成功条件の sample 追記は、sample が編集対象外のため未実施。sample 改訂時に売上合計などの判定可能な成功条件を追加する。F009は rulebook 側に適用尺度を明記して対応したが、sample 側には尺度と各判定根拠の補完が残る。sample の「変更要求の概要」「影響分析サマリ」を合わせて改訂し、各行の判定と尺度を照合する。今回の範囲ではルールを正とし、sample に合わせた要件の緩和は行っていない。
- sample への追加変更案: 直接根拠となる業務影響調査との対応、構造・整合性／検証・移行テスト／実装への影響、受入確認の手順・合格条件を補完する。「未解決事項」の担当・決定期限の列とレビュー運用の記述は外し、論点・不足情報・影響・当面の扱いへ整理する。未作成の根拠 ID は追加しない。recipe と template は宣言が undecided であり、対応ファイルの変更案はない。
- 検証分担: lint-ts、lint-fm、lint-md、lint-mermaid、lint-d2、test-integration、validate-schema、typecheck、test-unit は指定どおり親 runner に委ね、sandbox では重複実行していない。再 grade による正式な finding 更新は後続工程で行う。
- 適用外の検証: `npm run validate:schema:file`（変更した成果物は Markdown rulebook のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿・既存の plan／result などの履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

根拠は次の文書である。`docs/ja/specdojo/standards/rulebook-authoring-standard.md`、`document-metadata-standard.md`、`id-and-file-naming-standard.md`、`pm-review-viewpoints.yaml` の該当観点、`deliverables-reference.md`、改訂済みの `sld-rulebook.md`、pjr-8s4t の展開一覧。成果物本体の `imp-data.md` は存在しなかったため、カタログ（`dct-impact-analysis.yaml`）、sample、grade の結果サイドカーを根拠に改訂した。成果物の不在だけを理由に見送ってはいない。業務の影響判断と文書運用を分け、共通運用は正本参照にした。重複する用語表は省いた。対応方針の実施担当・実施時期・見送りの再評価条件は、データ変更の実行判断に必要なので維持した。rulebook と sample が食い違う箇所は rulebook を正とした。`includes` の宣言がないため、追加で簡潔にする記法 rulebook はなかった。共通の正本への追記は不要と判断した。
