---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-security-safety-sample-140-20261126t051335z-5c2b46dd
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-security-safety-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-security-safety-sample-140/T-KATA-REVIEW-ALL-nfr-security-safety-sample-140-20261126T051335Z-5c2b46dd/plan.md
  started_at: "2026-11-26T05:13:45.111Z"
  completed_at: "2026-11-26T05:23:27.033Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-security-safety-sample
    - specdojo:nfr-security-safety-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として `nfr-security-safety-sample` の事実を、参照先 sample と rulebook に突き合わせた。誤り 6 件を直した。
- 直した内容は次のとおり。`nfr-sec-005` の検証先と導線、`nfr-sec-007` の `scp-SEC-001` の範囲、`nfr-sec-008` の根拠、`nfr-sec-009` の測定方法、`nfr-sec-ex-001` の期限表現。
- 整形（prettier）と markdownlint は通り、runner の `lint:md:changed`・`lint:fm:changed`・`test:docs`・`validate:schema` も成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 6. 関連ドキュメント導線 / `nfr-sec-005` | `nfr-sec-005` の参照先を障害対応の運用方針にしていたが、その sample には紛失・漏えいの疑いの扱いがない。 | 障害対応の運用方針の行を消し、運用手順の行に `nfr-sec-005` を加えた。 | vp-qe-verifiability。`opd-access-control-sample` 2.2 と `opr-access-control-sample` 9.3 緊急停止。 | - |
| R4-2 | R4 | 4. 測定・検証方法 / `nfr-sec-005` | 検証先を障害記録にしていたが、緊急停止は権限変更記録へ起票する。 | 測定方法を、権限変更記録の緊急停止に書いた気付いた時刻と監査ログの停止の時刻の差にし、検証先を権限変更記録にした。 | vp-dev-testability。`opr-access-control-sample` 9.3 の手順 2。 | - |
| R4-3 | R4 | 3. 機密性・安全性要件一覧 / `nfr-sec-007` の備考 | `scp-SEC-001` と「同じ制約」と書いていたが、正本は起動引数と印刷コマンドへの引き渡しも禁じており、範囲が一致しない。 | 「横断ルール `scp-SEC-001` に従う」にした。 | vp-arc-technical-constraints。`sysd-cross-cutting-policy-sample` 3.7 の Rule。 | - |
| R4-4 | R4 | 3. 機密性・安全性要件一覧 / `nfr-sec-008` の備考 | 根拠を ACD-C03 だけにしていたが、ACD-C03 は公開資料の制約で、診断ログの根拠は横断ルールにある。 | 「前提・制約の ACD-C03 と横断ルールの診断ログの定め」にした。 | vp-arc-technical-constraints。`prj-assumptions-constraints-dependencies-sample` の ACD-C03 と `sysd-cross-cutting-policy-sample`。 | - |
| R4-5 | R4 | 4. 測定・検証方法 / `nfr-sec-009` | 測定方法がつけ残高と価格の履歴しか照合せず、備考の母数（権限変更記録を含む）と食い違う。 | 権限変更記録と、つけ残高の訂正・価格の変更の履歴の件数を、監査ログと突き合わせる形にした。 | vp-qe-verifiability。本書の `nfr-sec-009` の備考と `opd-access-control-sample` 2.5。 | - |
| R4-6 | R4 | 5. 例外運用 / `nfr-sec-ex-001` | 期限「初期リリースの 30 日後」は相対表現で、期限切れを表から判別できない（grade F002）。 | 「初期リリース日の 30 日後（リリース日が決まった時点で日付に置き換える）」にした。日付は仮置きしていない。 | vp-qe-verifiability。共通サンプル文脈がリリース日程を未確定とするため、日付は仮置きしなかった。 | 要判断 |
| R4-7 | R4 | 5. 例外運用 / 自動ログアウト 20 分 | `opd-access-control-sample` 2.3 は 10 分の自動ログアウトだけを定め、例外 `nfr-sec-ex-001` を参照していない。 | - | R5 で、`opd-access-control-sample` 2.3 から `nfr-sec-ex-001` を参照するかを判断する。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-security-safety-sample.md`: 事実の誤りを直した。`nfr-sec-005` の測定方法と検証先を権限変更記録の緊急停止に合わせ、導線の障害対応の運用方針の行を消して運用手順の行へ `nfr-sec-005` を加えた。`nfr-sec-007` は横断ルール `scp-SEC-001` に従う書き方にした。`nfr-sec-008` の根拠は ACD-C03 と横断ルールの診断ログの定めにした。`nfr-sec-009` の測定方法は権限変更記録を含めて監査ログと突き合わせる形にした。`nfr-sec-ex-001` の期限は「初期リリース日の 30 日後（リリース日が決まった時点で日付に置き換える）」にした。導線の表に、`stc-*` を置かない旨の行を加えた。

## 3. 申し送り

- `sac-store-sales` は sample として存在せず、確かめられなかった。受入条件 sample の作成が要る。
- grade F001・F005（`nfr-sec-012` の未決日数）と F003 は、executor の記録では R4 で扱っていない。F001・F005 は kata の段で使わない観点として見送った。F003 は executor の記録に扱いがないため、後続の段または人の確認が要る。
- R4-1: R4 / 6. 関連ドキュメント導線 / `nfr-sec-005` の参照先を「障害対応の運用方針」（opd-incident-management-sample）にしていたが、その sample には紛失・漏えいの疑いの扱いがない / 障害対応の運用方針の行を消し、運用手順（opr-access-control-sample）の行に `nfr-sec-005` を加えた / vp-qe-verifiability。正本は opd-access-control-sample 2.2 の紛失・漏えいの疑いの契機と opr-access-control-sample 9.3 緊急停止 / -
- R4-2: R4 / 4. 測定・検証方法 / `nfr-sec-005` の検証先を「障害記録」にしていたが、緊急停止は権限変更記録へ起票する / 測定方法を「権限変更記録の緊急停止に書いた気付いた時刻と、監査ログの停止の時刻の差」にし、検証先を権限変更記録にした / vp-dev-testability。opr-access-control-sample 9.3 の手順 2 / -
- R4-3: R4 / 3. 機密性・安全性要件一覧 / `nfr-sec-007` の備考で `scp-SEC-001` と「同じ制約」と書いていたが、正本は起動引数と印刷コマンドへの引き渡しも禁じており、範囲が一致しない / 「横断ルール `scp-SEC-001` に従う」にした / vp-arc-technical-constraints。sysd-cross-cutting-policy-sample 3.7 の Rule / -
- R4-4: R4 / 3. 機密性・安全性要件一覧 / `nfr-sec-008` の備考の根拠を ACD-C03 だけにしていたが、ACD-C03 は公開資料の制約で、診断ログの根拠は横断ルールにある / 「前提・制約の ACD-C03 と横断ルールの診断ログの定め」にした / vp-arc-technical-constraints。prj-assumptions-constraints-dependencies-sample の ACD-C03 と sysd-cross-cutting-policy-sample 99 行目 / -
- R4-5: R4 / 4. 測定・検証方法 / `nfr-sec-009` の測定方法がつけ残高と価格の履歴しか照合せず、備考の母数（権限変更記録を含む）と食い違う / 権限変更記録と、つけ残高の訂正・価格の変更の履歴の件数を監査ログと突き合わせる形にした / vp-qe-verifiability。本書の `nfr-sec-009` の備考と opd-access-control-sample 2.5 / -
- R4-6: R4 / 5. 例外運用 / `nfr-sec-ex-001` の期限「初期リリースの 30 日後」は相対表現で、期限切れを表から判別できない（grade F002） / 「初期リリース日の 30 日後（リリース日が決まった時点で日付に置き換える）」にした / vp-qe-verifiability。rulebook の例外運用の判断基準。リリース日程は共通サンプル文脈で未確定のため、日付は仮置きしなかった / 要判断（日付を仮に置く案は、共通サンプル文脈がリリース日程を未確定とするため採らなかった）
- R4-7: R4 / 3. 機密性・安全性要件一覧 / grade F001・F005（`nfr-sec-012` の ○○ 日数の決定者・期限・解消条件）は vp-po-decision-readiness・vp-ops-release-readiness の指摘で、kata-guide の「kata の観点の組」で kata の段のレビューでは使わない観点 / - / kata-guide の「kata の観点の組」。kata の承認と ready 化は登録簿で追う / -
- R4-8: R4 / 5. 例外運用 / 例外で自動ログアウトを 20 分にしているが、opd-access-control-sample 2.3 は 10 分の自動ログアウトだけを定め、例外を参照していない / - / R5 で、opd-access-control-sample 2.3 から `nfr-sec-ex-001` を参照するかを判断する / -
- 確かめの表（R4）: No1 自動ログアウト 10 分 → opd-access-control-sample 2.3 と一致。No2 店番をやめた日の停止（当日中） → opd 2.2「やめた日のうち」と一致。No3 紛失時に 15 分以内で停止 → opd 2.2・opr 9.3 と一致。No4 緊急権限の 24 時間失効と延長 → opd 2.4 と一致。No5 監査ログの記録対象と 1 年保管、削除不可 → opd-index-sample 9・opd 2.5 と一致。No6 主体の表 → opd 2.1 と一致（監査ログの削除不可は opd 2.5 で全区分に適用）。No7 ACD-C03 → 内容が一致。No8 `scp-SEC-001` → 範囲の差を R4-3 で直した。No9 診断ログの根拠 → R4-4 で直した。No10 `nfr-sec-005` の検証先と導線 → 不一致で R4-1・R4-2 で直した。No11 wikilink の参照先 7 件 → すべて samples に実在する。No12 Frontmatter の type・rulebook・`part_of` → rulebook の推奨 Frontmatter 項目と一致。No13 `sac-store-sales` → sample として存在せず、確かめられない（受入条件 sample の作成が要る）。No14 TLS 1.2 以上・CVSS 7.0 → 仮定で正本がなく、対象外。No15 `stc-*` を置かない記述 → rulebook の導線の要求を満たす。

## 4. 進め方と実践の型の適用

sample-maintenance。根拠は参照先の `opd-access-control-sample`・`opr-access-control-sample`・`sysd-cross-cutting-policy-sample`・`prj-assumptions-constraints-dependencies-sample` と rulebook。sample の事実は主張ごとに突き合わせ、不一致の箇所だけを直した。仮定の値（TLS 1.2 以上、CVSS 7.0）は正本がなく、確かめの対象にしなかった。
