---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-assumptions-constraints-dependencies-sample-150-20261126t094059z-fd011bd0
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-assumptions-constraints-dependencies-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-assumptions-constraints-dependencies-sample-150/T-KATA-REVIEW-ALL-prj-assumptions-constraints-dependencies-sample-150-20261126T094059Z-fd011bd0/plan.md
  started_at: "2026-11-26T09:41:12.403Z"
  completed_at: "2026-11-26T09:50:08.846Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-assumptions-constraints-dependencies-sample
    - specdojo:prj-assumptions-constraints-dependencies-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、前提・制約・依存関係の sample を、プロジェクト概要・成功条件・スコープ・憲章などの関連 sample と突き合わせ、sample 側の食い違いを直した。
- プロジェクト概要が本書へ引き継ぐと書く前提・依存のうち、本書に欠けていた2件を追加した。追加したのは ACD-A03（家族利用者代表の参加）と ACD-D05（ベースライン記録）。
- 項目追加に合わせて、影響評価の参照範囲と ACD-A01 のトリガーを成功条件の SC-03 に合わせて更新した。
- 憲章と成功条件の側に残る食い違い2件は、相手側を変更せず、直す案を findings に記した。どちらも「要判断」。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | 前提条件の表（ACD-A03 を追加） | プロジェクト概要の「前提条件」は、家族利用者代表の不参加による試行と家族利用指標の判定遅れを本書へ引き継ぐと書く。本書には該当する項目がなかった。 | ACD-A03「家族利用者代表が、初期受入の代表シナリオと運用開始後2週間の店番に参加できる」を `_ASSUMPTION_` として追加した。影響（SC-01・SC-07・SC-09・SC-08 の遅れ）、確認方法（代表シナリオの日程を決める前に参加可能日を確かめ、`kinuya-schedule` に記録する）、所有者、対応方針も埋めた。 | prj-overview-sample の「前提条件」、rulebook 6.1 の良い例、pm-members-sample の家族利用者代表の参加条件 | - |
| 2 | R5 | 依存関係の表（ACD-D05 を追加） | プロジェクト概要は、ベースライン記録不足による欠品・在庫改善指標の判定不能を本書へ引き継ぐと書く。本書には該当する項目がなかった。 | ACD-D05「店主代表による運用開始前1か月のベースライン記録」を依存に追加した。成立条件は成功条件の「判定手順と証跡」を正とした。開発担当が記録開始日を運用開始の候補日から逆算して `kinuya-schedule` に置き、運用開始前に1か月分がそろったことを照合する。欠落時は成功条件の手順どおり SC-04・SC-05 を判定不能として扱いを決め直す。 | prj-overview-sample の「前提条件」、prj-success-criteria-and-acceptance-criteria-sample の「判定手順と証跡」、pm-plan-sample のベースライン記録を先行作業に置く記述 | - |
| 3 | R5 | 影響評価と対応方針の表の「最初に確認すること」 | 項目の追加により、前提・依存の参照範囲（ACD-A01・ACD-A02、ACD-D01〜ACD-D04）が古くなった。 | 参照範囲を ACD-A01〜ACD-A03、ACD-D01〜ACD-D05 に広げた。 | 本書の前提条件・依存関係の表 | - |
| 4 | R5 | ACD-A01 の「変化のトリガー」 | 「負担が許容範囲を超えた」は、同じ行で参照する成功条件の SC-03（1営業日の追加操作時間が合計10分以内）の基準と結び付いていなかった。 | 「追加操作時間が SC-03 の上限を超えた」に直した。 | prj-success-criteria-and-acceptance-criteria-sample の SC-03 | - |
| 5 | R5 | 相手側 prj-charter-sample（プロジェクト憲章）の「ハイレベルスコープ」と「未決事項」のオフライン時の扱い | 憲章はオフライン時の扱いを、詳細計画の承認前にスコープで対象か対象外かを決める未確定事項のままにしている。スコープでは「通信断の日の記録は初期リリースの受入の対象外」と決まっており、残る未決は記録方法だけである。 | （未変更）憲章の未決事項を「オフライン時の記録方法」に絞り、受入の対象外という扱いはスコープの決定として参照する。憲章を決定前の時点の文書として据え置くなら、変更しない。 | prj-scope-sample の「スコープ外」、prj-charter-sample の「未決事項」 | 要判断 |
| 6 | R5 | 相手側 prj-success-criteria-and-acceptance-criteria-sample（成功基準と受入条件）の「例外条件と未解決事項」のオフライン時の記録方法 | 成功条件は判断を「変更要求ログへ起票し決定記録に残す」と書く。本書の ACD-D03 は登録簿の個票 `PJR-KN01` を判断証跡とする。pm-plan-sample の「決定は登録簿の `decision` 項目」とは矛盾しないが、記録先の呼び方がそろっていない。 | （未変更）成功条件の「決定記録」を「プロジェクト登録簿の決定項目（`PJR-KN01`）」と書いて本書とそろえる。あるいは、本書の ACD-D03 に「決定記録（`PJR-KN01`）」と書き添える。 | pm-plan-sample の情報の正本の表、本書の ACD-D03 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-assumptions-constraints-dependencies-sample.md`: 前提条件の表に ACD-A03（家族利用者代表の参加）、依存関係の表に ACD-D05（運用開始前1か月のベースライン記録）を追加した。影響評価と対応方針の表の「最初に確認すること」の参照範囲を ACD-A01〜ACD-A03 と ACD-D01〜ACD-D05 に広げた。ACD-A01 の変化のトリガーを「追加操作時間が SC-03 の上限を超えた」に直した。

## 3. 申し送り

- No: 1 / 段: R5 / 箇所: 前提条件の表（ACD-A03 を追加） / 指摘: [[specdojo:prj-overview-sample|プロジェクト概要]] の「前提条件」は、家族利用者代表の不参加による試行と家族利用指標の判定遅れを本書へ引き継ぐと書くが、本書に該当する項目がなかった / 直した案: ACD-A03「家族利用者代表が、初期受入の代表シナリオと運用開始後2週間の店番に参加できる」を `_ASSUMPTION_` として追加し、影響（SC-01・SC-07・SC-09・SC-08 の遅れ）、確認方法（代表シナリオの日程を決める前に参加可能日を確かめて `kinuya-schedule` に記録）、所有者、対応方針を埋めた / 根拠: prj-overview-sample の「前提条件」、rulebook 6.1 の良い例（代表試行への協力者の確保は前提として扱う）、pm-members-sample の家族利用者代表の参加条件 / 印: なし
- No: 2 / 段: R5 / 箇所: 依存関係の表（ACD-D05 を追加） / 指摘: プロジェクト概要は、ベースライン記録不足による欠品・在庫改善指標の判定不能を本書へ引き継ぐと書くが、本書に該当する項目がなかった / 直した案: ACD-D05「店主代表による運用開始前1か月のベースライン記録」を依存に追加し、成立条件は成功条件の「判定手順と証跡」を正とした。開発担当が記録開始日を運用開始の候補日から逆算して `kinuya-schedule` に置き、運用開始前に1か月分がそろったことを照合する。欠落時は成功条件の手順どおり SC-04・SC-05 を判定不能として扱いを決め直す / 根拠: prj-overview-sample の「前提条件」、prj-success-criteria-and-acceptance-criteria-sample の「判定手順と証跡」、pm-plan-sample のベースライン記録を先行作業に置く記述 / 印: なし
- No: 3 / 段: R5 / 箇所: 影響評価と対応方針の表の「最初に確認すること」 / 指摘: 項目の追加で、前提・依存の参照範囲（ACD-A01・ACD-A02、ACD-D01〜ACD-D04）が古くなった / 直した案: ACD-A01〜ACD-A03、ACD-D01〜ACD-D05 に広げた / 根拠: 本書の前提条件・依存関係の表 / 印: なし
- No: 4 / 段: R5 / 箇所: ACD-A01 の「変化のトリガー」 / 指摘: 「負担が許容範囲を超えた」は、同じ行で参照する成功条件の SC-03（1営業日の追加操作時間が合計10分以内）の基準と結び付いていなかった / 直した案: 「追加操作時間が SC-03 の上限を超えた」に直した / 根拠: prj-success-criteria-and-acceptance-criteria-sample の SC-03 / 印: なし
- No: 5 / 段: R5 / 箇所: 相手側 [[specdojo:prj-charter-sample|プロジェクト憲章]] の「ハイレベルスコープ」と「未決事項」のオフライン時の扱い / 指摘: 憲章はオフライン時の扱いを「詳細計画の承認前に、スコープで対象か対象外かを決める」未確定事項のままにしている。スコープでは「通信断の日の記録は初期リリースの受入の対象外」と決まり、残る未決は記録方法だけである / 直した案（未変更）: 憲章の未決事項を「オフライン時の記録方法」に絞り、受入の対象外という扱いはスコープの決定として参照する。憲章を決定前の時点の文書として据え置くなら、変更しない / 根拠: prj-scope-sample の「スコープ外」、prj-charter-sample の「未決事項」 / 印: 要判断
- No: 6 / 段: R5 / 箇所: 相手側 [[specdojo:prj-success-criteria-and-acceptance-criteria-sample|成功基準と受入条件]] の「例外条件と未解決事項」のオフライン時の記録方法 / 指摘: 成功条件は判断を「変更要求ログへ起票し決定記録に残す」と書き、本書の ACD-D03 は登録簿の個票 `PJR-KN01` を判断証跡とする。pm-plan-sample の「決定は登録簿の `decision` 項目」とは矛盾しないが、記録先の呼び方がそろっていない / 直した案（未変更）: 成功条件の「決定記録」を「プロジェクト登録簿の決定項目（`PJR-KN01`）」と書いて本書とそろえる。あるいは、本書の ACD-D03 に「決定記録（`PJR-KN01`）」と書き添える / 根拠: pm-plan-sample の情報の正本の表、本書の ACD-D03 / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がないため）

## 4. 進め方と実践の型の適用

根拠にしたのは、プロジェクト概要の「前提条件」、成功条件の「判定手順と証跡」と SC-03、スコープ、憲章、pm-plan、pm-members の各 sample と、rulebook の良い例である。rulebook と関連 sample を正として、本書の側だけを直した。憲章と成功条件に関わる食い違いは、相手側を変更せず、直す案を findings に残した。executor が実行した整形と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は通った。
