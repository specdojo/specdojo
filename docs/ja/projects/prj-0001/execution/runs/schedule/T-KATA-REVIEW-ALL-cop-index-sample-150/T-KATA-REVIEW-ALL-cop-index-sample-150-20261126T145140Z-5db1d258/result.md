---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cop-index-sample-150-20261126t145140z-5db1d258
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cop-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cop-index-sample-150/T-KATA-REVIEW-ALL-cop-index-sample-150-20261126T145140Z-5db1d258/plan.md
  started_at: "2026-11-26T14:51:50.751Z"
  completed_at: "2026-11-26T15:00:01.957Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cop-index-sample
    - specdojo:cop-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`cop-index-sample` を同じ接頭辞の sample と照合した。sample 側の修正は 1 件で、「作業手順チェックリスト」の手順 4 を `otp-index-sample` の定めに合わせた。
- 相手側を直すべき点 6 件は変更せず、直す案を findings に記載した。そのうち No.3 と No.6 は「要判断」とした。
- F001 と F002 は前の段で解消済みで、R5 の観点外のため扱っていない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | cop-index-sample「作業手順チェックリスト」手順 4 | アカウントの権限を「確かめる」だけになっていた。`otp-index-sample` の「権限/アカウント移行」は、切替日の午前、取り込みの前にアカウントを発行し権限を設定すると定めている。 | 「タブレットの充電と画面ロックを確かめ、各アカウントを発行して権限を設定する」、備考は「発行と権限の設定は `otp-index` に従う」に直した（反映済み）。 | docs/ja/specdojo/samples/otp-index-sample.md の移行タイミングの記述 | - |
| 2 | R5 | mip-index-sample「カットオーバー概要」の表の T+7 日の行（GO4） | 完了条件が「理由の分からない差異が残っていない」のままで、同じ文書の移行段階の表（並行記録の行）や cop-index-sample の GO4 と言い方が違う。`cop-index` は `mip-index` を判定点の正本としているため、正本の側をそろえる必要がある。 | mip-index-sample の GO4 の完了条件を「並行記録の最終日の日次締めで、売上額とつけ残高合計の差異が 0 円であるか、差異の理由が日次締めの差異欄に記録されている」に直す（相手側のため未変更）。 | mip-index-sample の移行段階の表とカットオーバー概要の表、cop-index-rulebook の禁止事項「判定条件を `mip-index` や分冊と矛盾させる」 | - |
| 3 | R5 | cop-index-sample「関連ドキュメント」の「分冊: （本書のみ）」と cop-sample の概要 | cop-sample は自分を `cop-index` から導く分冊 `cop-cutover-day` と書いているが、cop-index-sample は分冊なしで当日手順をすべて持っている。同じ系列の sample として親と分冊の関係が読み取れない。 | 案 A は cop-sample の概要から `cop-index` との親子関係の記述を外し、単独の対象別計画の例とする。案 B は cop-index-sample の分冊欄に `cop-cutover-day` を挙げ、当日の詳細手順を分冊へ移す（構成の変更が大きい）。 | cop-index-rulebook の全体方針（分冊は対象固有の手順に限る）と本文要件（分冊がなければ（本書のみ））、cop-rulebook の全体方針 | 要判断 |
| 4 | R5 | cop-sample「切替判定ポイント（GO/NO-GO）」の GO2 とタイムラインの取り込み直しの予備枠 | 取り込み直しの締め切りが cop-sample では T-30m（11:30）、cop-index-sample では T+2:10（11:10）で、20 分ずれている。cop-rulebook は判断体系を `cop-index` を正とし、矛盾させないと定めている。 | cop-sample の取り込み直しの締め切りを T-50m（11:10）にし、動作確認を T-50m から T-30m の範囲に収める（相手側のため未変更）。 | cop-rulebook の正本参照と責務境界、cop-index-sample の GO2 | - |
| 5 | R5 | cop-sample「障害時判断・エスカレーション」の重大度「高」とロールバックの発動条件 | cop-sample は販売を記録できない状態が 10 分以上続けば、見込みにかかわらずロールバックするとしている。cop-index-sample は 15 分を超え、閉店までに直る見込みがない場合としており、基準が食い違う。 | cop-sample の重大度「高」の基準を cop-index-sample と同じ「15 分を超え、閉店までに直る見込みがない」に合わせ、ロールバック手順の発動条件の記述も同じ値に直す（相手側のため未変更）。 | cop-rulebook の正本参照と責務境界、cop-index-sample の障害時判断の表 | - |
| 6 | R5 | cop-sample のタイムライン（最終棚卸 C+70m、GO1） | cop-index-sample は閉店 T-15:00 から最終棚卸の終了 T-13:00（約 2 時間）、cop-sample は閉店から C+70m で、GO1 の締め切りが合わない。 | cop-sample の最終棚卸の完了と GO1 を C+120m にし、以降の前日作業の時刻をずらす。または cop-index-sample の T-13:00 を短縮する。どちらをリハーサル結果に合わせるかは店主代表の想定で決める。 | cop-index-sample のタイムラインと GO1、cop-sample のタイムラインと GO1 | 要判断 |
| 7 | R5 | cop-sample「担当者/連絡系統」のグループチャットの名称 | cop-sample は「家族の連絡用グループチャット「きぬや移行当日」」、cop-index-sample・otp-index-sample・otp-sample は「店の連絡用グループチャット」で、同じ窓口の呼び名が割れている。 | cop-sample の呼び名を「店の連絡用グループチャット」にそろえる（相手側のため未変更）。 | otp-index-sample の受付時間とチャネル、cop-index-sample の担当者、連絡系統の表 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cop-index-sample.md`: 「作業手順チェックリスト」の手順 4 を、タブレットの充電と画面ロックの確認に加えて各アカウントを発行して権限を設定する内容に直した。備考は「発行と権限の設定は `otp-index` に従う」とした。表の列幅は prettier で整えた。

## 3. 申し送り

- 検証: prettier と markdownlint は executor が実行し、成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。
- 未対応: 相手側の sample を直す案は、いずれも変更していない。No.3 と No.6 は判断者の確認が要る。
- No: 1 / 段: R5 / 箇所: cop-index-sample「作業手順チェックリスト」手順 4 / 指摘: アカウントの権限を「確かめる」だけになっていた。`otp-index-sample` の「権限/アカウント移行」は、切替日の午前、取り込みの前にアカウントを発行し権限を設定すると定めている / 直した案: 「タブレットの充電と画面ロックを確かめ、各アカウントを発行して権限を設定する」、備考は「発行と権限の設定は `otp-index` に従う」に直した（反映済み） / 根拠: docs/ja/specdojo/samples/otp-index-sample.md の移行タイミングの記述 / 印: -
- No: 2 / 段: R5 / 箇所: mip-index-sample「カットオーバー概要」の表の T+7 日の行（GO4） / 指摘: 完了条件が「理由の分からない差異が残っていない」のままで、同じ文書の移行段階の表（並行記録の行）と cop-index-sample の GO4（差異が 0 円か、差異の理由が日次締めの差異欄にある）と言い方が違う。`cop-index` は `mip-index` を判定点の正本としているため、正本の側をそろえる必要がある / 直した案: mip-index-sample の GO4 の完了条件を「並行記録の最終日の日次締めで、売上額とつけ残高合計の差異が 0 円であるか、差異の理由が日次締めの差異欄に記録されている」に直す（相手側のため未変更） / 根拠: mip-index-sample の移行段階の表とカットオーバー概要の表、cop-index-rulebook の禁止事項「判定条件を `mip-index` や分冊と矛盾させる」 / 印: -
- No: 3 / 段: R5 / 箇所: cop-index-sample「関連ドキュメント」の「分冊: （本書のみ）」と cop-sample の概要 / 指摘: cop-sample は自分を `cop-index` から導く分冊 `cop-cutover-day` と書いているが、cop-index-sample は分冊なしで当日手順をすべて持っている。同じ系列の sample として親と分冊の関係が読み取れない / 直した案: 案 A は cop-sample の概要から `cop-index` との親子関係の記述を外し、単独の対象別計画の例とする。案 B は cop-index-sample の分冊欄に `cop-cutover-day` を挙げ、当日の詳細手順を分冊へ移す（構成の変更が大きい） / 根拠: cop-index-rulebook の全体方針（分冊は対象固有の手順に限る）と本文要件（分冊がなければ（本書のみ））、cop-rulebook の全体方針 / 印: 要判断
- No: 4 / 段: R5 / 箇所: cop-sample「切替判定ポイント（GO/NO-GO）」の GO2 とタイムラインの取り込み直しの予備枠 / 指摘: 取り込み直しの締め切りが cop-sample では T-30m（11:30）、cop-index-sample では T+2:10（11:10）で、20 分ずれている。cop-rulebook は判断体系を `cop-index` を正とし、矛盾させないと定めている / 直した案: cop-sample の取り込み直しの締め切りを T-50m（11:10）にし、動作確認を T-50m〜T-30m の範囲に収める（相手側のため未変更） / 根拠: cop-rulebook の正本参照と責務境界、cop-index-sample の GO2 / 印: -
- No: 5 / 段: R5 / 箇所: cop-sample「障害時判断・エスカレーション」の重大度「高」とロールバックの発動条件 / 指摘: cop-sample は販売を記録できない状態が 10 分以上続けば、見込みにかかわらずロールバックするとしている。cop-index-sample は 15 分を超え、閉店までに直る見込みがない場合としており、基準が食い違う / 直した案: cop-sample の重大度「高」の基準を cop-index-sample と同じ「15 分を超え、閉店までに直る見込みがない」に合わせ、ロールバック手順の発動条件の記述も同じ値に直す（相手側のため未変更） / 根拠: cop-rulebook の正本参照と責務境界、cop-index-sample の障害時判断の表 / 印: -
- No: 6 / 段: R5 / 箇所: cop-sample のタイムライン（最終棚卸 C+70m、GO1） / 指摘: cop-index-sample は閉店 T-15:00 から最終棚卸の終了 T-13:00（約 2 時間）、cop-sample は閉店から C+70m で、GO1 の締め切りが合わない / 直した案: cop-sample の最終棚卸の完了と GO1 を C+120m にし、以降の前日作業の時刻をずらす。または cop-index-sample の T-13:00 を短縮する（どちらをリハーサル結果に合わせるかを店主代表の想定で決める） / 根拠: cop-index-sample のタイムラインと GO1、cop-sample のタイムラインと GO1 / 印: 要判断
- No: 7 / 段: R5 / 箇所: cop-sample「担当者/連絡系統」のグループチャットの名称 / 指摘: cop-sample は「家族の連絡用グループチャット「きぬや移行当日」」、cop-index-sample・otp-index-sample・otp-sample は「店の連絡用グループチャット」で、同じ窓口の呼び名が割れている / 直した案: cop-sample の呼び名を「店の連絡用グループチャット」にそろえる（相手側のため未変更） / 根拠: otp-index-sample の受付時間とチャネル、cop-index-sample の担当者、連絡系統の表 / 印: -

## 4. 進め方と実践の型の適用

根拠にした資料は、`otp-index-sample`、`mip-index-sample`、`cop-sample`、`otp-sample`、`cop-index-rulebook` と `cop-rulebook` の責務境界と禁止事項、共通サンプル文脈である。手順 4 は `otp-index-sample` の移行タイミングの記述と食い違っていたため直した。ほかの記述は他の sample と整合していたため維持した。食い違いのうち相手側に原因があるものは、変更せずに直す案として記録した。rulebook と矛盾する場合は rulebook を正とした。
