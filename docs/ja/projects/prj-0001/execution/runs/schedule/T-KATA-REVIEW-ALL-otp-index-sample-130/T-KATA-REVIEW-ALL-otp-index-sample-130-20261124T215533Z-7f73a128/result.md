---
specdojo:
  id: prj-0001:xer-t-kata-review-all-otp-index-sample-130-20261124t215533z-7f73a128
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-otp-index-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-otp-index-sample-130/T-KATA-REVIEW-ALL-otp-index-sample-130-20261124T215533Z-7f73a128/plan.md
  started_at: "2026-11-24T21:55:41.638Z"
  completed_at: "2026-11-24T22:05:50.552Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:otp-index-sample
    - specdojo:otp-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/otp-index-sample.md` に文の直しを 6 件入れた。内容は長文の分割、主語述語のねじれの解消、表記の統一である。
- grade の F001（`vp-qe-omissions-consistency`）は前の段で解消済みだった。「関連ドキュメント（必須）」に `opr-sales`・`opr-credit`・`opr-daily-closing`・`opr-shift-handover` が載っている。構成の指摘で R3 の担当でもないため、追加の変更はしていない。
- 主語を補う根拠を確かめられなかった 2 件（R3-7、R3-8）は、直さずに「要判断」として申し送りに残した。
- 指摘の一覧（No・段・箇所・指摘・直した案・根拠・印）は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 1. 概要（index） | 冒頭の 1 文が長く、切り替える対象と目指す状態が 1 文に重なっている | 「…共通方針を定める。」と「目指す状態は…である。」の 2 文に分けた | W3 | - | | R3-2 | R3 | 2. 監視/アラート | 日次締めの差異の行の通知先が「店番が気付き、店主代表」となり、主語と述語がねじれている | ほかの行に合わせて「日次締めの画面表示で店番と店主代表」にした | W2、`vp-ux-language-consistency` | - | | R3-3 | R3 | 3. バックアップ/リストア | リストアの検証の文が長く、戻す主体が修飾に埋もれている | 「開発担当が前日のバックアップを検証用端末へ戻す。」と合格の条件の文に分けた | W1、W3、W5 | - | | R3-4 | R3 | 4. 権限/アカウント移行 | 検証方法の最後の文で、合格の条件と直す手順が読点でつながっている | 「…拒否されたら合格とする。1 つでも違えば、正午の開店前に設定を直す。」に分けた | W3 | - | | R3-5 | R3 | 9. 旧システムの停止/参照方針 | 「問い合わせ」が、ファイルのほかの箇所と rulebook の表記「問合せ」と違う | 「問合せ」にそろえた | W8、`vp-ux-language-consistency` | - | | R3-6 | R3 | 10. 移行完了後のクローズ条件 | 最終報告物の文が長く、報告の名前が文の最後まで出てこない | 「最終報告物はハイパーケア終了報告 1 枚とし、…をまとめる。」と「この報告をもって `opr-index` の運用へ引き継ぐ。」に分けた | W3、W5 | - | | R3-7 | R3 | 2. 監視/アラート | 日次締めの差異の行の初動ルールで、書く主体が店番か店主代表か決まらない | 直していない（「店主代表が」を補う案は選ばなかった） | W1 | 要判断 | | R3-8 | R3 | 4. 権限/アカウント移行 | 移行タイミングの「アカウントを発行する」の主語がない | 直していない（「開発担当が」を補う案は選ばなかった） | W1 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/otp-index-sample.md`: 読みやすさの直しを 6 箇所に入れた。概要冒頭の長文の分割、監視/アラートの日次締めの差異の行の通知先の主語述語のそろえ、リストア検証の文の分割、権限/アカウント移行の検証方法の文の分割、「問い合わせ」から「問合せ」への表記統一、クローズ条件の最終報告物の文の分割である。意味や判断に要る背景・例外・制約は変えていない。差分は 12 行追加、12 行削除。

## 3. 申し送り

- R3-7 と R3-8 は要判断のため sample を直していない。R3-7 は、監視/アラートの日次締めの差異の初動ルールで主語を店主代表とする根拠が rulebook と関連する sample で確かめられない。R3-8 は、`cop-index-sample` が権限の確認を開発担当とするだけで、アカウントを発行する主体を書いていない。人が主体を決めたうえで、補う文を入れるかを判断する。
- R3-1: R3 / 1. 概要（index） / 冒頭の 1 文が長く、切り替える対象と目指す状態が 1 文に重なっている / 「運用へ切り替えるための共通方針を定める。目指す状態は、店主代表と家族利用者代表がシステムの記録だけで店を回せることである。」の 2 文に分けた / W3 / -
- R3-2: R3 / 2. 監視/アラート / 日次締めの差異の行の通知先が「店番が気付き、店主代表」となっていて、主語と述語がねじれている / ほかの行の書き方（「画面の警告表示で店番」）に合わせて「日次締めの画面表示で店番と店主代表」にした / W2、`vp-ux-language-consistency` / -
- R3-3: R3 / 3. バックアップ/リストア / リストアの検証の文が長く、戻す主体が「開発担当の検証用端末」の修飾に埋もれている / 「開発担当が前日のバックアップを検証用端末へ戻す。」と合格の条件の文に分けた / W1、W3、W5 / -
- R3-4: R3 / 4. 権限/アカウント移行 / 検証方法の最後の文で、合格の条件と直す手順が読点でつながっている / 「…拒否されたら合格とする。1 つでも違えば、正午の開店前に設定を直す。」に分けた / W3 / -
- R3-5: R3 / 9. 旧システムの停止/参照方針 / 「問い合わせ」がファイルのほかの箇所と rulebook の表記「問合せ」と違う / 「問合せ」にそろえた / W8、`vp-ux-language-consistency` / -
- R3-6: R3 / 10. 移行完了後のクローズ条件 / 最終報告物の文が長く、報告の名前が文の最後まで出てこない / 「最終報告物はハイパーケア終了報告 1 枚とし、…をまとめる。この報告をもって `opr-index` の運用へ引き継ぐ。」に分けた / W3、W5 / -
- R3-7: R3 / 2. 監視/アラート / 日次締めの差異の行の初動ルール「差異の理由を日次締め記録へ書く。理由が分からなければ開発担当へ連絡する」の主語が、通知先の店番か店主代表か決まらない / - / W1。要判断の理由: 主語を店主代表と書く根拠が rulebook と関連する sample で確かめられず、事実を足すことになる。選ばなかった案は「店主代表が」を補う案 / 要判断
- R3-8: R3 / 4. 権限/アカウント移行 / 移行タイミングの「アカウントを発行する」の主語がない / - / W1。要判断の理由: cop-index-sample は手順 4 で開発担当が権限を確かめるとするだけで、発行する主体を書いていない。選ばなかった案は「開発担当が」を補う案 / 要判断
- F001（grade、`vp-qe-omissions-consistency`）は前の段で解消済み: 「関連ドキュメント（必須）」に `opr-sales`・`opr-credit`・`opr-daily-closing`・`opr-shift-handover` が載っている。構成の指摘で R3 の担当でもないため、追加の変更はしていない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/otp-index-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（`*.yaml`・`*.yml` の変更がない）

## 4. 進め方と実践の型の適用

approach は sample-maintenance。参照の向きを成果物から sample に切り替え、R3（読みやすさ）の観点で対象の sample を見直した。grade の F001 は前の段の版で解消済みであることを確認し、重ねての変更はしていない。文の直しは W1〜W10 のチェック項目と `vp-ux-language-consistency` を根拠にし、書いた根拠のない主語の補いは行わず根拠不足の 2 件として見送った。次のアクションは、人が主語の補いを判断することである。検査は、executor の `npx prettier --write`（passed）と `npx markdownlint-cli2`（0 issues）、runner の `npm run lint:md:changed`・`npm run lint:fm:changed`・`npm run lint:mermaid`・`npm run lint:d2`・`npm run test:docs`・`npm run validate:schema` がいずれも passed だった。`npm run validate:history-links` と `npm run validate:schema:file` は、履歴ファイルも YAML も変更していないため `not_applicable`。ts・integration・typecheck・unit などの runner 検査も、変更種別により `not_applicable`。
