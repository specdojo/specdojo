---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cop-sample-150-20261126t145451z-cbcd99e3
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cop-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cop-sample-150/T-KATA-REVIEW-ALL-cop-sample-150-20261126T145451Z-cbcd99e3/plan.md
  started_at: "2026-11-26T14:55:03.240Z"
  completed_at: "2026-11-26T15:04:41.399Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cop-sample
    - specdojo:cop-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として `docs/ja/specdojo/samples/cop-sample.md` を、`cop-index-sample`・`cop-rulebook`・共通サンプル文脈に合わせて直しました。直した点は、再照合と GO3 の時刻、重大度「高」の基準、連絡チャネル名、ロールバック時の再周知、臨時休業開始時刻の未決表記です。
- 相手側（`cop-index-sample`）を直すべき点は変更せず、直す案を findings と handoff に残しました。
- grade の F001（判断者 `PO` と店主代表の対応）は、前の段で解消済みでした。観点 `vp-ux-language-consistency` は R3 の観点のため、この段では扱っていません（R5-8）。
- 検証では、executor の prettier、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通りました。変更種別により非適用になった検査は runner が判定済みです。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | `cop-sample.md` の 2. 当日タイムライン、3. 作業手順チェックリスト、5. 実施条件（事前完了条件）、6. 切替判定ポイント（GO/NO-GO）、8. 障害時判断・エスカレーション | 再照合の締め切りと GO3 の時刻が `cop-index-sample` と食い違っていました。`cop-index-sample` は再照合 T+2:10（T-50m）、GO3 T+2:30（T-30m）です。本 sample は再照合 T-30m、動作確認 T-30m、GO3 T-10m でした。 | 取り込み直しの締め切り、手順 8、GO2 の失敗時、リハーサルの条件、障害時の行を T-50m にしました。動作確認を T-50m、開店の判定（GO3）を T-30m に変えました。 | `vp-qe-kata-conformance`、`cop-rulebook` の禁止事項（`cop-index` と矛盾させない）、`cop-index-rulebook` の禁止事項（判定条件を分冊と矛盾させない）。本 sample は照合に時間がかかり、取り込み直しに使える時間が 25 分しかありません。`cop-index-sample` 側の締め切りを遅らせる案は選びませんでした。 | 要判断 |
| R5-2 | R5 | `cop-sample.md` の 7. ロールバック手順、8. 障害時判断・エスカレーション | 重大度「高」の基準が「販売の記録が 10 分以上できない」で、見込みにかかわらずロールバックとしていました。`cop-index-sample` は「15 分を超え、閉店までに直る見込みがない」です。開店前の遅れ（延期）も、本 sample は「中」、`cop-index-sample` は「高」で食い違っていました。 | 基準を「15 分を超え、閉店までに直る見込みがない」に合わせ、開店前の遅れの行を「高」にしました。章の冒頭に「重大度の区分は `cop-index` に従う」を足しました。 | `vp-qe-kata-conformance`、`cop-rulebook` の位置づけ（`cop-index` の共通判断を受ける） | - |
| R5-3 | R5 | `cop-sample.md` の 4. 担当者/連絡系統、8. 障害時判断・エスカレーション | チャネル名が「家族の連絡用グループチャット「きぬや移行当日」」「CoderDojo のメンター連絡チャネル」で、`cop-index-sample` の「店の連絡用グループチャット」（技術メンターも同じ）と食い違っていました。 | 「店の連絡用グループチャット」に統一し、エスカレーション経路の「（チャネル）」を「（グループチャット）」にしました。 | `vp-qe-kata-conformance` | - |
| R5-4 | R5 | `cop-sample.md` の 9. 周知（ユーザ通知/停止告知） | 「ロールバックした場合も来店客への周知は変えない」が、`cop-index-sample` の再周知（延期・ロールバック時に貼り紙を差し替える）と矛盾していました。 | 「ロールバックしても正午に開店し、ノートで販売する。延期・ロールバックを決めた後の再周知は `cop-index` に従う。」にしました。 | `vp-qe-kata-conformance`、`cop-rulebook` の禁止事項 | - |
| R5-5 | R5 | `cop-sample.md` の 1. 概要（cutover-day） | `_UNDECIDED_` で臨時休業の開始時刻を未決にしていましたが、`cop-index-sample` は 9:00 開始・9 時〜12 時休業と決めています。 | 該当の `_UNDECIDED_` 段落を消しました。T-180m＝9:00 はタイムラインの表に残っています。 | `vp-qe-kata-conformance`、`cop-index-rulebook` の分冊との関係（全体前提は `cop-index` を正とする）。開始時刻が本当に未決なら `cop-index-sample` 側に `_UNDECIDED_` を移すべきで、その案は選びませんでした。 | 要判断 |
| R5-6 | R5 | `cop-index-sample` の 10. 関連ドキュメント | 「分冊: （本書のみ）」とありますが、分冊の `cop-sample`（`cop-cutover-day`）があり、互いの導線が食い違っています。 | （相手側のため未変更）`docs/ja/specdojo/samples/cop-index-sample.md` を「分冊: `cop-cutover-day`（切替日の取り込みと開店）」に直す案です。 | `vp-dev-change-impact` | - |
| R5-7 | R5 | `cop-index-sample` の 3. 作業手順チェックリスト、7. ロールバック手順 | 実施者が `cop-sample` と食い違っています。最終棚卸は `cop-index-sample` が店主代表・開発担当、`cop-sample` が店主代表・家族利用者代表です。タブレットを下げる手順は `cop-index-sample` が開発担当、`cop-sample` が家族利用者代表です。 | （相手側のため未変更）`cop-index-sample` の実施者を、細かい手順の正である分冊（`cop-sample`）に合わせる案です。 | `vp-qe-kata-conformance` | 要判断 |
| R5-8 | R5 | `cop-sample.md` の 4. 担当者/連絡系統（grade F001） | 判断者 `PO` と店主代表の対応は、前の段ですでに「判断者の店主代表の Role code `PO`」と直っています。観点 `vp-ux-language-consistency` は R3 の観点のため、この段では扱いません。 | - | kata-guide の段と観点の組 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cop-sample.md`: `cop-index-sample` との整合を取りました。取り込み直しの締め切り、手順 8、GO2 の失敗時、リハーサルの条件、障害時の行を T-50m にしました。動作確認を T-50m、開店の判定（GO3）を T-30m に変えました。重大度「高」の基準を「15 分を超え、閉店までに直る見込みがない」に合わせ、開店前の遅れ（延期）を「高」にし、章の冒頭に「重大度の区分は `cop-index` に従う」を足しました。連絡チャネルを「店の連絡用グループチャット」に統一しました。ロールバック時の周知は、再周知を `cop-index` に従う記述にしました。臨時休業の開始時刻の `_UNDECIDED_` 段落を削除しました。

## 3. 申し送り

- R5-1 と R5-5 は「要判断」です。R5-1 は、GO2 が T-75m で取り込み直しに使える時間が 25 分しかない点を踏まえた判断です。R5-5 は、開始時刻が本当に未決なら `_UNDECIDED_` を `cop-index-sample` 側へ移す選択肢があります。
- R5-6 と R5-7 は相手側（`cop-index-sample`）の修正案です。この task では変更していないため、別途対応が必要です。
- R5-1: 段 R5 / 箇所 2. 当日タイムライン・3. 作業手順チェックリスト・5. 実施条件（事前完了条件）・6. 切替判定ポイント（GO/NO-GO）・8. 障害時判断・エスカレーション / 指摘 再照合の締め切りと GO3 の時刻が cop-index-sample（再照合 T+2:10＝T-50m、GO3 T+2:30＝T-30m）と食い違い、本 sample は再照合 T-30m、動作確認 T-30m、GO3 T-10m だった / 直した案 取り込み直しの締め切り・手順 8・GO2 の失敗時・リハーサルの条件・障害時の行を T-50m にし、動作確認を T-50m、開店の判定（GO3）を T-30m に変えた / 根拠 vp-qe-kata-conformance、cop-rulebook の禁止事項（`cop-index` と矛盾させない）、cop-index-rulebook の禁止事項（判定条件を分冊と矛盾させない）。迷った理由: 本 sample は照合に時間がかかり（GO2 は T-75m、cop-index-sample は T+0:40）、取り込み直しに使える時間が 25 分しかない。cop-index-sample 側の締め切りを遅らせる案は選ばなかった / 印 要判断
- R5-2: 段 R5 / 箇所 7. ロールバック手順・8. 障害時判断・エスカレーション / 指摘 重大度「高」の基準が「販売の記録が 10 分以上できない」で、見込みにかかわらずロールバックとしており、cop-index-sample の「15 分を超え、閉店までに直る見込みがない」と食い違う。開店前の遅れ（延期）を「中」としていたが、cop-index-sample では延期は「高」 / 直した案 基準を「15 分を超え、閉店までに直る見込みがない」に合わせ、開店前の遅れの行を「高」にした。章の冒頭に「重大度の区分は `cop-index` に従う」を足した / 根拠 vp-qe-kata-conformance、cop-rulebook の位置づけ（`cop-index` の共通判断を受ける） / 印 -
- R5-3: 段 R5 / 箇所 4. 担当者/連絡系統・8. 障害時判断・エスカレーション / 指摘 チャネル名が「家族の連絡用グループチャット「きぬや移行当日」」「CoderDojo のメンター連絡チャネル」で、cop-index-sample の「店の連絡用グループチャット」（技術メンターも同じ）と食い違う / 直した案 「店の連絡用グループチャット」に統一し、エスカレーション経路の「（チャネル）」を「（グループチャット）」にした / 根拠 vp-qe-kata-conformance / 印 -
- R5-4: 段 R5 / 箇所 9. 周知（ユーザ通知/停止告知） / 指摘 「ロールバックした場合も来店客への周知は変えない」が、cop-index-sample の再周知（延期・ロールバック時に貼り紙を差し替える）と矛盾する / 直した案 「ロールバックしても正午に開店し、ノートで販売する。延期・ロールバックを決めた後の再周知は `cop-index` に従う。」にした / 根拠 vp-qe-kata-conformance、cop-rulebook の禁止事項 / 印 -
- R5-5: 段 R5 / 箇所 1. 概要（cutover-day） / 指摘 `_UNDECIDED_` で臨時休業の開始時刻を未決にしていたが、cop-index-sample は 9:00 開始・9 時〜12 時休業と決めている / 直した案 該当の `_UNDECIDED_` 段落を消した（T-180m＝9:00 はタイムラインの表に残る） / 根拠 vp-qe-kata-conformance、cop-index-rulebook の分冊との関係（全体前提は `cop-index` を正とする）。迷った理由: 開始時刻が本当に未決なら、cop-index-sample 側に `_UNDECIDED_` を移すべきで、こちらの案は選ばなかった / 印 要判断
- R5-6: 段 R5 / 箇所 cop-index-sample の 10. 関連ドキュメント / 指摘 「分冊: （本書のみ）」とあるが、分冊の cop-sample（`cop-cutover-day`）があり、互いの導線が食い違う / 直した案 - / 根拠 vp-dev-change-impact。相手側の docs/ja/specdojo/samples/cop-index-sample.md を「分冊: `cop-cutover-day`（切替日の取り込みと開店）」に直す案 / 印 -
- R5-7: 段 R5 / 箇所 cop-index-sample の 3. 作業手順チェックリスト・7. ロールバック手順 / 指摘 実施者が cop-sample と食い違う。最終棚卸は cop-index-sample が 店主代表・開発担当、cop-sample が 店主代表・家族利用者代表。タブレットを下げる手順は cop-index-sample が 開発担当、cop-sample が 家族利用者代表 / 直した案 - / 根拠 vp-qe-kata-conformance。相手側の cop-index-sample の実施者を、細かい手順の正である分冊（cop-sample）に合わせる案 / 印 要判断
- R5-8: 段 R5 / 箇所 4. 担当者/連絡系統 / 指摘 grade の F001（判断者 `PO` と店主代表の対応）は、前の段ですでに「判断者の店主代表の Role code `PO`」と直っている。観点 vp-ux-language-consistency は R3 の観点のため、この段では扱わない / 直した案 - / 根拠 kata-guide の段と観点の組 / 印 -
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/cop-sample.md だけで、plan・result・個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは `*.md` だけで、`*.yaml` / `*.yml` は変更していない）

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → sample」に切り替え、同じ接頭辞の `cop-index-sample`、`cop-rulebook`、`cop-index-rulebook`、共通サンプル文脈を照合しました。食い違いのうち sample 側で直せるものは `cop-sample.md` に反映しました。相手側を直すべきものは変更せず、案を findings に記録しました。F001 は前の段で解消済みで、観点も R3 のものです。status は `draft` のまま据え置きました。
