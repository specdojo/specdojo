---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-security-safety-sample-120-20261125t221221z-16311b0e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-security-safety-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-security-safety-sample-120/T-KATA-REVIEW-ALL-nfr-security-safety-sample-120-20261125T221221Z-16311b0e/plan.md
  started_at: "2026-11-25T22:12:31.081Z"
  completed_at: "2026-11-25T22:14:35.338Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-security-safety-sample
    - specdojo:nfr-security-safety-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として sample の 2 か所を直した。1 つ目は `nfr-sec-003` の測定方法で、母数の「許可しない操作」に合わせて管理と本部連携を対象に足した。2 つ目は導線の表の運用手順の行で、対象に `nfr-sec-001` を足し、説明を測定・検証方法の表に合わせた。
- 章の移動・分割・統合は不要と判断した。F004 は総合テストの行（「（なし）」と `stc-*` を置かない理由）がすでにあり、rulebook の求めを満たしている。
- F001・F005 は kata の段のレビューでは使わない観点、F002 は R4 の観点なので、この段では直していない。
- 検証では、executor の整形と markdownlint、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が passed だった。その他の検査は変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 4. 測定・検証方法 / `nfr-sec-003` | 母数は主体の表の「許可しない操作」すべてだが、測定方法の対象が店番・運用・保守だけで、管理（監査ログの削除）と本部連携（顧客情報の受け渡し）が抜けている。 | 測定方法を「店番・管理・運用・保守のアカウントと本部連携の認証値で、主体の表の「許可しない操作」をすべて試す」に直した。 | `vp-qe-omissions-consistency`（grade F003） | - |
| R2-2 | R2 | 6. 関連ドキュメント導線 / 運用手順の行 | 対象に、棚卸し記録で月次に点検する `nfr-sec-001` が入っていない。また「緊急権限の使用ごと」に判定する `nfr-sec-011` を含むのに、説明が「月次点検の手順」で、測定・検証方法の表と食い違う。 | 対象に `nfr-sec-001` を足し、説明を「点検と記録の手順」に直した。 | `vp-qe-omissions-consistency` | - |
| R2-3 | R2 | 6. 関連ドキュメント導線 | `stc-*` への導線がないという grade の指摘（F004）は、総合テストの行（「（なし）」と `stc-*` を置かない理由）がすでにあり、rulebook の求めを満たしている。 | - | `vp-qe-omissions-consistency`（grade F004）、rulebook の本文要件 | - |
| R2-4 | R2 | 3. 機密性・安全性要件一覧 / `nfr-sec-012` | `_UNDECIDED_` に決定者・期限・解消の条件がないという grade の指摘（F001・F005）は、kata の段のレビューでは使わない観点（`vp-po-decision-readiness`、`vp-ops-release-readiness`）に当たるので扱わない。 | - | kata-guide.md の「kata の観点の組」（kata の承認と ready 化は登録簿で追う） | - |
| R2-5 | R2 | 5. 例外運用 / `nfr-sec-ex-001` | 期限「初期リリースの 30 日後」は相対的な書き方で、期限切れを表から判別しにくい（grade F002、`vp-qe-verifiability`）。R4 の観点なので R2 では直さない。 | R4 で、日付に置き換えるか起算日を明記する案を検討する。 | `vp-qe-verifiability`、rulebook の「期限切れの例外が表から判別できること」 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-security-safety-sample.md`: `nfr-sec-003` の測定方法を、店番・管理・運用・保守のアカウントと本部連携の認証値で「許可しない操作」をすべて試す記述に直した。関連ドキュメント導線の運用手順の行は、対象に `nfr-sec-001` を足し、説明を「点検と記録の手順」に直した。

## 3. 申し送り

- F001・F005（`nfr-sec-012` の `_UNDECIDED_`）の決定者・期限・暫定運用の終了条件は、kata の承認と ready 化を追う登録簿側で扱う。
- F002（`nfr-sec-ex-001` の相対期限）は R4 で、rulebook の「期限切れの例外が表から判別できること」と照らして扱う。
- R2-1: R2 / 4. 測定・検証方法 / `nfr-sec-003` の母数は主体の表の「許可しない操作」すべてだが、測定方法の対象が店番・運用・保守だけで、管理（監査ログの削除）と本部連携（顧客情報の受け渡し）が抜けている / 測定方法を「店番・管理・運用・保守のアカウントと本部連携の認証値で、主体の表の「許可しない操作」をすべて試す」に直した / `vp-qe-omissions-consistency`（grade F003） / -
- R2-2: R2 / 6. 関連ドキュメント導線 / 運用手順の行の対象に、棚卸し記録で月次に点検する `nfr-sec-001` が入っていない。また「緊急権限の使用ごと」に判定する `nfr-sec-011` を含むのに、説明が「月次点検の手順」になっていて、測定・検証方法の表と食い違う / 対象に `nfr-sec-001` を足し、説明を「点検と記録の手順」に直した / `vp-qe-omissions-consistency` / -
- R2-3: R2 / 6. 関連ドキュメント導線 / `stc-*` への導線がないという grade の指摘（F004）は、総合テストの行（「（なし）」と `stc-*` を置かない理由）がすでにあり、rulebook の求めを満たしている / - / `vp-qe-omissions-consistency`（grade F004）、rulebook の本文要件 / -
- R2-4: R2 / 3. 機密性・安全性要件一覧 / `nfr-sec-012` の `_UNDECIDED_` に決定者・期限・解消の条件がないという grade の指摘（F001・F005）は、kata の段のレビューでは使わない観点（`vp-po-decision-readiness`、`vp-ops-release-readiness`）に当たるので扱わない / - / kata-guide.md の「kata の観点の組」（kata の承認と ready 化は登録簿で追う） / -
- R2-5: R2 / 5. 例外運用 / `nfr-sec-ex-001` の期限「初期リリースの 30 日後」は相対的な書き方で、期限切れを表から判別しにくい（grade F002、`vp-qe-verifiability`）。R4 の観点なので R2 では直さない / - / R4 で rulebook の「期限切れの例外が表から判別できること」と照らし、日付に置き換えるか起算日を明記する案を検討する / -
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown だけで、`*.yaml`・`*.yml` の変更がない）

## 4. 進め方と実践の型の適用

sample-maintenance。参照の向きを成果物から sample に切り替え、grade の finding のうち R2 の観点（構成・整合）に当たる F003・F004 を rulebook の本文要件に照らして確認した。F003 は sample を修正し、F004 は既存の行で満たしていると確認した。F001・F002・F005 は段の担当外として見送った。rulebook など sample 以外は変更していない。
