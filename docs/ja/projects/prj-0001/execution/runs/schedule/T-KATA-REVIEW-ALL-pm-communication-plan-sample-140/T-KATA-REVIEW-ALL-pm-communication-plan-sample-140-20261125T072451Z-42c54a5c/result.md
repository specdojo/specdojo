---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-communication-plan-sample-140-20261125t072451z-42c54a5c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-communication-plan-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-communication-plan-sample-140/T-KATA-REVIEW-ALL-pm-communication-plan-sample-140-20261125T072451Z-42c54a5c/plan.md
  started_at: "2026-11-25T07:25:00.628Z"
  completed_at: "2026-11-25T07:39:25.853Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-communication-plan-sample
    - specdojo:pm-communication-plan-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample の主張 14 件を正本（schema、関連 sample、`pm-plan-sample.md`、`pm-roles-sample.yaml` など）と突き合わせた。すべて一致し、誤りは見つからなかった。
- F001（RACI が本書内で定義・参照されていない）は、前の段で RACI が wikilink `[[specdojo:pm-raci-sample|RACI]]` になっており、解消済みと確認した。
- executor は sample を含むどのファイルも変更していない（`changes` は空）。そのため差分はない。
- 確認した主張は次の 14 件。frontmatter の参照先 ID、本文の wikilink 先、判断ゲート名、ステークホルダー ID、機会ごとの責任、機会の証跡、M-03・M-04 の上限、U-03 の依存、受入確認と試用結果の証跡、架空記録の扱い、エスカレーションの最終判断、RACI 判断行への追従、Role code、営業時間外の緊急連絡手段。確認の詳細は handoff の R4 確認表にある。
- runner が実行した検査のうち、lint:md:changed・lint:fm:changed・lint:mermaid・lint:d2・validate:schema は passed。ほかは変更種別により `not_applicable`。

## 2. 変更ファイル

- なし

## 3. 申し送り

- R5（整合）への申し送り: 家族利用者向けの手段を、登録簿は「操作メモ, 対面」、本書は「簡易手順書と短時間の対面実演」と書いている。正しさの誤りではないため R4 では直していない。用語をそろえるかは整合の段で判断する。
- R4 確認表 No1 | 主張: frontmatter の `rulebook`・`based_on` の参照先 ID（`specdojo:pm-communication-plan-rulebook`・`specdojo:pm-plan-sample`・`specdojo:prj-stakeholder-register-sample`） | 正本: 各ファイルの frontmatter `id`、docs/specdojo/schemas/v1/common-frontmatter.schema.yaml | 確かめ方: grep で `id:` と schema の `based_on`・`supersedes` を確認 | 結果: 一致 | 根拠: 3 つの ID が存在し、`based_on`・`supersedes` は common-frontmatter schema の 72・75 行目で定義されている
- R4 確認表 No2 | 主張: 本文の wikilink（課題ログ・リスク登録簿・変更要求ログ・RACI）の参照先 | 正本: docs/ja/specdojo/samples/pm-issue-log-sample.md・pm-risk-register-sample.md・pm-change-request-log-sample.md・pm-raci-sample.md | 確かめ方: grep で各 `id:` を確認 | 結果: 一致 | 根拠: 4 つとも同名の `id` がある
- R4 確認表 No3 | 主張: 判断ゲート名「準備着手」「初期リリース・店頭試用開始」「店頭試用後の継続」「重大変更・再開」と章名「判断ゲートとエスカレーション」 | 正本: docs/ja/specdojo/samples/pm-plan-sample.md | 確かめ方: 41〜50 行目を読んだ | 結果: 一致 | 根拠: 章 3 のゲート表の 47〜50 行目に 4 つのゲートがある
- R4 確認表 No4 | 主張: ステークホルダー ID（`STH-SHOP-OWNER`・`STH-TECH-MENTOR`・`STH-FAMILY-USER`・`STH-REGULAR-CUSTOMER`）と、店主代表が `PO` を担うこと | 正本: docs/ja/specdojo/samples/prj-stakeholder-register-sample.md | 確かめ方: grep で `STH-` を確認 | 結果: 一致 | 根拠: 24〜28 行目。`STH-SHOP-OWNER` の対応 Role code は `PO`
- R4 確認表 No5 | 主張: 機会ごとの責任（技術メンター相談 `DEV`、家族利用者の試用 `BA`、常連顧客への告知 `PO`、店主代表への判断依頼 `PM`） | 正本: prj-stakeholder-register-sample.md の関与方針の表 | 確かめ方: 48〜52 行目を読んだ | 結果: 一致 | 根拠: 責任者がそれぞれ `PM`・`DEV`・`DEV`・`BA`・`PO`
- R4 確認表 No6 | 主張: 機会の証跡（Issue の判断と理由、完了定義との対応、完了・所要時間・支援内容、氏名・残高を含めない告知文面） | 正本: prj-stakeholder-register-sample.md の 60〜64 行目 | 確かめ方: 読み取り | 結果: 一致 | 根拠: 証跡の列と同じ内容
- R4 確認表 No7 | 主張: 管理計画の M-03（現金支出）・M-04（作業時間）の上限 | 正本: pm-plan-sample.md の 32〜33 行目 | 確かめ方: 読み取り | 結果: 一致 | 根拠: M-03 は U-01 の上限、M-04 は U-02 の上限
- R4 確認表 No8 | 主張: U-03 が決まるまで、つけの切替開始日と告知の掲示開始日が定まらない | 正本: pm-plan-sample.md の 107 行目 | 確かめ方: 読み取り | 結果: 一致 | 根拠: U-03 は初期リリース・店頭試用の具体日で未決。切替開始日を試用開始と結び付けるのは共通サンプル文脈内の仮定で、食い違いはない
- R4 確認表 No9 | 主張: 受入確認は `QE`、試用結果の確認は `BA`、それぞれの証跡は `kinuya-acceptance-record`（合否・判断日・公開可否）と `kinuya-trial-log` | 正本: pm-plan-sample.md の 48〜49 行目と 71 行目 | 確かめ方: 読み取り | 結果: 一致 | 根拠: 起案・整理が `QE`・`PM` と `BA`・`PM`。正本表では `kinuya-acceptance-record` が `QE`、`kinuya-trial-log` が `BA`
- R4 確認表 No10 | 主張: `kinuya-schedule`・`kinuya-acceptance-record`・`kinuya-trial-log` を架空記録として扱う | 正本: pm-plan-sample.md の 62 行目 | 確かめ方: 読み取り | 結果: 一致 | 根拠: `kinuya-` で始まる記録は未同梱の架空記録と定義されている
- R4 確認表 No11 | 主張: エスカレーションの最終判断はすべて `PO`、上限超過・停止・情報漏えいでは次の支出・利用・公開より前に判断を求める | 正本: pm-plan-sample.md の 47〜56 行目 | 確かめ方: 読み取り | 結果: 一致 | 根拠: 全ゲートの最終判断が人間の `PO`。56 行目に同じ順序がある
- R4 確認表 No12 | 主張: エスカレーション判断者の追従先が RACI の判断行（F001 の対象行。現在は 72 行目） | 正本: docs/ja/specdojo/samples/pm-raci-sample.md | 確かめ方: grep で `id` と「判断」を確認 | 結果: 一致 | 根拠: `id: specdojo:pm-raci-sample`、38 行目に「判断・プロセス別 RACI」章、67・89 行目で「判断行」を使っている。F001 は解消済み
- R4 確認表 No13 | 主張: Role code `PO`・`PM`・`BA`・`DEV`・`QE` | 正本: docs/ja/specdojo/samples/pm-roles-sample.yaml | 確かめ方: grep で `code:` を確認 | 結果: 一致 | 根拠: 19・22・25・31・34 行目
- R4 確認表 No14 | 主張: 営業時間外の緊急連絡手段は判断ゲート「初期リリース・店頭試用開始」の前に決める | 正本: pm-plan-sample.md の 48 行目 | 確かめ方: 読み取り | 結果: 一致 | 根拠: このゲートの判断条件に「実運用前の未決事項が解消」がある
- R5 への申し送り: 家族利用者向けの手段を、登録簿は「操作メモ, 対面」、本書は「簡易手順書と短時間の対面実演」と書いている。正しさの誤りではないため R4 では直していない。用語をそろえるかは整合の段で判断する
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票を含め、どのファイルも変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の主張を正本と突き合わせた。確認した正本は、common-frontmatter schema、`pm-plan-sample.md`、`prj-stakeholder-register-sample.md`、`pm-raci-sample.md`、`pm-roles-sample.yaml`、課題ログ・リスク登録簿・変更要求ログの各 sample。14 件すべてが一致したため、sample の記述はそのまま維持した。F001 は前の段の修正で RACI が wikilink になっており、判定根拠に照らして解消済みと確認した。確かめられなかった主張はない。根拠不足による見送りもない。grade result サイドカーは更新していない。
