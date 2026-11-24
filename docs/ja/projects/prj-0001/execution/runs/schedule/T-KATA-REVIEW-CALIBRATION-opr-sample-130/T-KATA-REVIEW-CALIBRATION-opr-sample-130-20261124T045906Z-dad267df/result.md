---
specdojo:
  id: prj-0001:xer-t-kata-review-calibration-opr-sample-130-20261124t045906z-dad267df
  type: exec-result
  task_id: T-KATA-REVIEW-CALIBRATION-opr-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-CALIBRATION-opr-sample-130/T-KATA-REVIEW-CALIBRATION-opr-sample-130-20261124T045906Z-dad267df/plan.md
  started_at: "2026-11-24T04:59:15.266Z"
  completed_at: "2026-11-24T05:04:53.861Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- opr-sample の R3（読みやすさ）を実施した。文の分割、略語の初出説明、主体と修飾関係の明確化、重複説明の整理を行った。
- 意味・背景・例外・制約は変えていない。frontmatter、12 章構成、判断値、表の運用条件、参照先、R1 の証跡要件、R2 の章内配置は維持した。
- result と grade サイドカーは編集していない。
- 指摘表（段 R3）: R3-1 概要｜冒頭の主語が省略され、位置づけ・目的・参照関係が混在｜「本書は」で主語を示し、位置づけと作業対象を別文にし、方針への参照を別段落にした｜根拠 W1、W3、`vp-ux-readability`｜印 -。
- R3-2 概要、手順適用範囲・前提、日次・週次・月次点検手順｜Role code、RTO/RPO、EC、KPI/SLO に初出の説明がない｜初出で正式名または日本語名称を補った｜根拠 W8、`vp-ux-language-consistency`｜印 -。
- R3-3 バックアップ確認・リストア手順｜取得の説明の主題と述語、成功表示の日時の修飾が読みにくい｜自動取得の頻度を直接述べ、取得日時が前日の閉店後であることを明示した｜根拠 W2、W5｜印 -。
- R3-4 バッチ再実行・失敗時対応｜定期バッチの範囲と日次締めの操作・失敗時対応を一文に詰めている｜二文に分け、日次締めを操作する店番担当を主語にした｜根拠 W1、W3｜印 -。
- R3-5 運用変更作業、アカウント付与・剥奪手順｜ロールバックの操作と確認・記録が連結し、付与の述語も省略されている｜DEV を主語に戻す操作を独立させ、「同じ確認」を「適用時と同じ確認」にし、付与の動詞を補った｜根拠 W2、W3、W4｜印 -。
- R3-6 問い合わせ一次対応手順｜問い合わせる主体と回答・引継ぎ・記録の主体を読み分けにくい｜窓口、問い合わせ方法、`OPS` の回答・引継ぎを別文にし、記録する主体も明示した｜根拠 W1、W3｜印 -。
- R3-7 証跡｜模擬確認の実施と判定が一文に入り、記録先が直後の文と重複する｜実施と判定を別文にし、記録先は確認項目を列挙する文へ集約した｜根拠 W3、`vp-arc-conciseness`｜印 -。
- 要判断の印を付ける指摘はない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-sample.md`: R3（読みやすさ）として文章を修正した（31 行追加・29 行削除、表の整形を含む）。概要の主語の明示と文の分割、Role code・RTO/RPO・EC・KPI/SLO の初出説明の追加、バックアップ取得とバッチ再実行・日次締めの文の分割、ロールバックとアカウント付与の主体・述語の補完、問い合わせ一次対応の主体の分離、証跡の模擬確認の記述の重複整理を行った。

## 3. 申し送り

- grade finding の扱い: F001・F004 は kata-guide 6.3 が段レビューから除外する承認判断・ready 化の観点のため、本文へ決定期限や確認者を追加していない。
- F002（証跡保管期間）は R4 の `vp-qe-verifiability`、F003（分冊と ID の整合）は R5 の `vp-qe-kata-conformance` へ引き継ぐ。R1・R2 の指摘は新規指摘として繰り返していない。
- reporter は result の実施内容へ次の指摘表を記載してください。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 1. 概要 | 冒頭の主語が省略され、文書の位置づけ・目的・参照関係が一段落に混在している | 「本書は」で主語を示し、位置づけと作業対象を別文に、方針への参照を別段落にした | W1、W3、vp-ux-readability | - | | R3-2 | R3 | 1. 概要、2. 手順適用範囲・前提、3. 日次・週次・月次点検手順 | Role code、RTO/RPO、EC、KPI/SLO に初出の説明がない | 初出で正式名または日本語名称を補った | W8、vp-ux-language-consistency | - | | R3-3 | R3 | 6. バックアップ確認・リストア手順 | 取得の説明の主題と述語、成功表示の日時を示す修飾が読みにくい | 自動取得の頻度を直接述べ、成功表示の取得日時が前日の閉店後であることを明示した | W2、W5 | - | | R3-4 | R3 | 7. バッチ再実行・失敗時対応 | 定期バッチの範囲と日次締めの操作・失敗時対応を一文に詰めている | 二文に分け、日次締めを操作する店番担当を主語にした | W1、W3 | - | | R3-5 | R3 | 8. 運用変更作業、9. アカウント付与・剥奪手順 | ロールバックの説明で操作と確認・記録が連結し、付与の述語も省略されている | DEV を主語に戻す操作を独立させ、「同じ確認」を「適用時と同じ確認」にし、付与の動詞を補った | W2、W3、W4 | - | | R3-6 | R3 | 10. 問い合わせ一次対応手順 | 問い合わせる主体と回答・引継ぎ・記録の主体を読み分けにくい | 窓口、問い合わせ方法、OPS の回答・引継ぎを別文にし、記録する主体も明示した | W1、W3 | - | | R3-7 | R3 | 11. 証跡 | 模擬確認の実施と判定が一文に入り、結果の記録先が直後の文と重複する | 実施と判定を別文にし、記録先は確認項目を列挙する文へ集約した | W3、vp-arc-conciseness | - |
- 変更ファイル欄：`docs/ja/specdojo/samples/opr-sample.md` のみ。文章と略語の説明を修正した（31 行追加・29 行削除、表の整形を含む）。frontmatter、12 章構成、判断値、表の運用条件、参照先、R1 の証跡要件と R2 の章内配置を維持した。
- 「進め方と実践の型の適用」へ記録：kata-guide 6.1〜6.3・6.5、SpecDojo の考え方 3.6、Sample 記述標準、Rulebook 記述標準の用語統一規定、opr-rulebook、共通レビュー観点一覧の R3 および finding 該当観点、grade result、R1・R2 の result、opd-index-sample の関連記述、用語集を確認した。Role code の正式名は人物と組織の定義標準・pm-roles、RTO/RPO の名称は nfr-availability-rulebook を確認した。opr-rulebook に recipe 宣言はなく、対応する OPR recipe も存在しない。W1〜W10 を確認し、意味・背景・例外・制約を変えない範囲で改訂した。章構成と必須表は rulebook に従って維持し、迷った指摘や保護された設定の変更提案はない。
- grade finding の扱い：F001・F004 は kata-guide 6.3 が段レビューから除外する承認判断・ready 化の観点のため、本文へ決定期限や確認者を追加していない。F002（証跡保管期間）は R4 の `vp-qe-verifiability`、F003（分冊と ID の整合）は R5 の `vp-qe-kata-conformance` へ引き継ぐ。R1・R2 の指摘を新規指摘として繰り返していない。
- 指定された Markdown lint・frontmatter・テスト等の親検証は runner に委ね、sandbox では重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample のみで、YAML/YML ファイルの変更がない。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイル、既存 plan、result を編集していない。）
- 適用外の検証: `npm run validate:catalog`（成果物の変更が docs/ja/specdojo/samples/ 内に限られ、docs/ja/projects/ 配下に及ばない。）

## 4. 進め方と実践の型の適用

根拠とした規範・成果物: kata-guide 6.1〜6.3・6.5、SpecDojo の考え方 3.6、Sample 記述標準、Rulebook 記述標準の用語統一規定、`opr-rulebook`、共通レビュー観点一覧の R3 と finding 該当観点、grade result、R1・R2 の result、`opd-index-sample` の関連記述、用語集。Role code の正式名は人物と組織の定義標準と pm-roles、RTO/RPO の名称は `nfr-availability-rulebook` で確認した。`opr-rulebook` に recipe 宣言はなく、対応する OPR recipe も存在しない。W1〜W10 を確認し、意味・背景・例外・制約を変えない範囲で改訂した。章構成と必須表は rulebook を正として維持した。迷った指摘や保護された設定の変更提案はない。F001・F004 は R3 の観点外、F002 は R4、F003 は R5 が扱うため本段では未改訂とし、各段へ引き継ぐ。
