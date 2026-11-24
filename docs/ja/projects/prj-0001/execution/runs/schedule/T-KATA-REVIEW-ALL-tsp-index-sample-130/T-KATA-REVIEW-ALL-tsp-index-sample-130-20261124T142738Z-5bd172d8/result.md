---
specdojo:
  id: prj-0001:xer-t-kata-review-all-tsp-index-sample-130-20261124t142738z-5bd172d8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-tsp-index-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-tsp-index-sample-130/T-KATA-REVIEW-ALL-tsp-index-sample-130-20261124T142738Z-5bd172d8/plan.md
  started_at: "2026-11-24T14:27:47.644Z"
  completed_at: "2026-11-24T14:40:15.907Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:tsp-index-sample
    - specdojo:tsp-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `docs/ja/specdojo/samples/tsp-index-sample.md` の文章を直した。意味・数値条件・例外・回帰範囲、章構成、必須表、品質ゲート、`status: draft` は維持した。
- 略語に正式名を添え、表の前に判断基準を示す1文を足し、長い文を分けた。指摘は10件（下表）。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 概要、テストレベル一覧、スコープ、品質ゲート | 略語の初出に正式名がなく、意味を推測する必要があった | BAC・SC・AC・SAC・NFR・DB・外部I/F・EC・CI と Role code の正式名を初出に添えた | W8。TSP rulebook 2.2 と pm-roles-sample の名称を確認した | - | | R3-2 | R3 | 2.1、2.2、3、4.1、5、7、8章の表 | 表の前に、示す対応や判断の説明がなかった | 各表の前に、比較する内容や区分の基準を示す1文を加えた | vp-ux-readability。Sample 記述標準6章の「表の前の1文」に従った | - | | R3-3 | R3 | 1. 概要 | 参照名・経路の説明と、非機能基準を仮置きする理由が同じ段落に混在していた | 非機能基準の説明を別段落にし、条件 ID の未整備と仮置きの扱いを2文に分けた | W3、vp-ux-readability。SpecDojo の考え方3.6の一段落一論点に従った | - | | R3-4 | R3 | 4.2. I/F の確認範囲と代替方法 | 「照合待ちの判定は内部経路の故障である」と主語と述語がねじれていた | 故障時に照合待ちを判定することと、内部結合テストでスタブを使うことを別の文にした | W2、W3 | - | | R3-5 | R3 | 4.2. I/F の確認範囲と代替方法 | 外部結合と総合・受入の確認範囲を1文に詰めていた | 外部結合の導通・契約確認と、総合・受入のスモークを別の文にした | W3 | - | | R3-6 | R3 | 4.3. テストデータ | データの共通化と開始時の初期化を1文に詰めていた | 共通データの定義と、各テスト開始時に同じ状態へ戻す処理を別の文にした | W3 | - | | R3-7 | R3 | 5. 入口／出口条件（品質ゲート） | 例外承認、残課題の登録、回避手順の伝達が1文に続いていた | 例外承認と承認時の処置を分け、伝達先を店主代表と家族利用者代表と明記した | W3、W4。承認条件・伝達期限・受入出口の例外禁止は維持した | - | | R3-8 | R3 | 6. 自動化・回帰方針 | CI ジョブの実行、変更時の実行条件、回帰範囲が長い1文に入り、実行の表現も重複していた | 回帰範囲と変更時の実行条件を別の文にし、実行の表現をまとめた | W3、vp-arc-conciseness。対象サービス・ジョブ名・merge 前の実行条件は維持した | - | | R3-9 | R3 | 7. 不具合管理方針 | Critical の「記録が欠ける・誤り」は述語の形がそろっていなかった | 「記録の欠落・誤りがあり、回避手段がない」に直した | W2 | - | | R3-10 | R3 | 8. メモ / 将来課題 | 性能基準の負荷・許容時間・見直し方法が長い1文に入っていた | 負荷の仮定、2秒を許容する理由、試用後の見直しを3文に分けた | W3。R1 が追加した仮定と根拠は維持した | - |
- 検証では、整形（`prettier`）、`git diff --check`、秘密情報検査が成功した。runner 実行の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/tsp-index-sample.md`: R3（読みやすさ）として文章を直した。略語の正式名を初出に追記し、各表の前に説明文を加えた。概要、4.2、4.3、5、6、8章の長い文は分けた。7章の Critical の述語もそろえた。意味・数値条件・例外・回帰範囲・章構成は維持した。

## 3. 申し送り

- F001 は R2 で修正済み、F003 は R1 で根拠追記済みのため、R3 では扱っていない。F002（4.1 の印刷スタブと utc-index-sample の印刷要求モックの食い違い）は R3 の対象外として維持した。後続の R5 で、単体・内部結合の扱いと既定から外れる理由を書き分ける必要がある。
- result と grade サイドカーは未編集。grade の再評価で更新される。
- R3-1: R3 / 概要、テストレベル一覧、スコープ、品質ゲート / 略語の初出に正式名がなく、意味を推測する必要があった / BAC・SC・AC・SAC・NFR・DB・外部I/F・EC・CI と Role code の正式名を初出に添えた / W8。TSP rulebook 2.2 と pm-roles-sample の名称を確認した / -
- R3-2: R3 / 2.1、2.2、3、4.1、5、7、8章の表 / 表の前に、示す対応や判断の説明がなかった / 各表の前に、比較する内容や区分の基準を示す1文を加えた / vp-ux-readability。Sample 記述標準6章の「表の前の1文」に従った / -
- R3-3: R3 / 1. 概要 / 参照名・経路の説明と、非機能基準を仮置きする理由が同じ段落に混在していた / 非機能基準の説明を別段落にし、条件 ID の未整備と仮置きの扱いを2文に分けた / W3、vp-ux-readability。SpecDojo の考え方3.6の一段落一論点に従った / -
- R3-4: R3 / 4.2. I/F の確認範囲と代替方法 / 「照合待ちの判定は内部経路の故障である」と主語と述語がねじれていた / 故障時に照合待ちを判定することと、内部結合テストでスタブを使うことを別の文にした / W2、W3 / -
- R3-5: R3 / 4.2. I/F の確認範囲と代替方法 / 外部結合と総合・受入の確認範囲を1文に詰めていた / 外部結合の導通・契約確認と、総合・受入のスモークを別の文にした / W3 / -
- R3-6: R3 / 4.3. テストデータ / データの共通化と開始時の初期化を1文に詰めていた / 共通データの定義と、各テスト開始時に同じ状態へ戻す処理を別の文にした / W3 / -
- R3-7: R3 / 5. 入口／出口条件（品質ゲート） / 例外承認、残課題の登録、回避手順の伝達が1文に続いていた / 例外承認と承認時の処置を分け、伝達先を店主代表と家族利用者代表と明記した / W3、W4。承認条件・伝達期限・受入出口の例外禁止は維持した / -
- R3-8: R3 / 6. 自動化・回帰方針 / CI ジョブの実行、変更時の実行条件、回帰範囲が長い1文に入り、実行の表現も重複していた / 回帰範囲と変更時の実行条件を別の文にし、実行の表現をまとめた / W3、vp-arc-conciseness。対象サービス・ジョブ名・merge 前の実行条件は維持した / -
- R3-9: R3 / 7. 不具合管理方針 / Critical の「記録が欠ける・誤り」は述語の形がそろっていなかった / 「記録の欠落・誤りがあり、回避手段がない」に直した / W2 / -
- R3-10: R3 / 8. メモ / 将来課題 / 性能基準の負荷・許容時間・見直し方法が長い1文に入っていた / 負荷の仮定、2秒を許容する理由、試用後の見直しを3文に分けた / W3。R1 が追加した仮定と根拠は維持した / -
- reporter 記録用: 変更ファイルは docs/ja/specdojo/samples/tsp-index-sample.md のみ。上記指摘を result の実施内容に指定7列の Markdown 表として1回だけ記載し、申し送りには表を重ねない。判断根拠は kata-guide 6章、SpecDojo の考え方3.6、Sample 記述標準、Rulebook 記述標準5章、共通レビュー観点、TSP rulebook、用語集、pm-roles-sample、成果物カタログの `done_criteria`、grade result、R1・R2 result。finding は `source=grade` で condense 記録なし。rulebook の `recipe`・`template` は `undecided`。章構成・必須表・品質ゲート・回帰範囲と `status: draft` を維持した。result と grade サイドカーは未編集。親検証は runner に委ねる。
- 段の分担: F001 は R2 で修正済み、F003 は R1 で根拠追記済みのため再指摘しない。F002 は R3 の対象外として維持した。後続 R5 で、4.1 の印刷スタブと utc-index-sample の印刷要求モックを照合し、単体・内部結合の扱いと既定から外れる理由を書き分ける。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown sample のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan/result を変更していない。）

## 4. 進め方と実践の型の適用

`approach: sample-maintenance` として、`docs/ja/specdojo/guides/kata-guide.md` の R3（読みやすさ）に従い、sample の文の直しだけを行った。根拠は kata-guide 6章、SpecDojo の考え方3.6、Sample 記述標準、Rulebook 記述標準5章、共通レビュー観点、TSP rulebook、用語集、pm-roles-sample、成果物カタログの `done_criteria`、grade result、R1・R2 result。finding は `source=grade` で、condense の記録はない。rulebook の `recipe`・`template` は `undecided` のままである。F001 と F003 は前の段で解消済みのため再指摘していない。F002 は R3 の観点に当たらず、後続の R5 に回した。
