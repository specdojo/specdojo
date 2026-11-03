---
specdojo:
  id: prj-0001:pjr-merv-validation-applicability-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-03T12:53:22Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GQN3
  commit_type: fix
  commit_scope: exec
---

# PJR-MERV 検査の対象外の判断が runner と executor で食い違う

## 1. 課題内容

runner は自分が書く plan・result を変更ファイルに含めて履歴のリンクやカタログの検査を求め、executor は自分が変えたファイルだけを見て対象外とするため、作業が済んでも blocked になる

## 2. 入力

- 2026-11-03 の data-flow-uc-rewrite の実行で、executor が plan の求める検査を対象外として流さず、runner が「executor validation failed or not run」で止める事象が 4 回起きた（routine の opus と schedule の opus が validate:history-links、schedule の flash-high が validate:catalog。いずれもプロダクトの文書だけを変えたタスク）
- src/exec/reporter.ts の isValidNotApplicableValidation は、対象外の理由があっても、変更ファイル（runner が書く exec の plan・result を含む）から検査が対象になると判定すると block する。executor は自分が変えたプロダクトの文書だけを見て対象外と判断している（2026-11-03）
- 直し方の案: runner が書いたファイルによって対象になる検査は runner が流す、または plan に runner が書くファイルも検査の対象に入ることを明記する。どちらにするかは選択肢と理由を記録して決める（2026-11-03）

## 3. 影響範囲

| 観点         | 影響                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | exec の reporter の段で、executor の検査の結果を判定する処理（`src/exec/reporter.ts` の対象外の判定）と、plan が求める検査の書き方 |
| スケジュール | schedule の実行で、作業が済んだタスクが検査の判定で止まり、再開のたびに時間がかかる                                                |
| コスト       | 中くらい                                                                                                                           |
| 品質         | 作業と親の検証が通っても、executor の対象外の判断と runner の判定の食い違いで blocked になる                                       |
| 関係者       | exec run を使う利用者、夜間の実行                                                                                                  |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | runner は、自分が書く exec の plan・result を含む変更ファイルから、履歴のリンクやカタログの検査を対象と判定する。executor は自分が変えたファイルだけを見て対象外と判断し、流さない                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 対応策   | runner が書いたファイルだけによって対象になる検査は、runner が流して evidence に記録する（または対象外として扱う）か、plan に runner が書くファイルも検査の対象に入ることを明記する。どちらにするかを選択肢と理由とともに個票の対応結果に記録して決める                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 完了条件 | プロダクトの文書だけを変え、`validate:history-links` と `validate:catalog` を対象外と報告した executor の evidence で、runner の書く plan・result 以外に対象となる変更がなければ blocked にならないことを、単体または統合のテストで確かめている。executor 自身が履歴のファイルやカタログを変えた場合は、今までどおり検査を求めることもテストで確かめている。plan や exec の運用ガイドの記述を、決めた方式に合わせている。作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流し、親の検証（test-integration を含む）が通る。CHANGELOG は未公開の版の節（Unreleased）に書き、公開済みの版の節を変えない。保護された設定（`.specdojo/**`・`package.json` など）は変えず、必要なら案を個票の対応結果と報告の handoff に書く。未決の点は executor が決め、理由を個票の対応結果に記録する |

## 5. 対応結果

| 項目       | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 方式の選択 | 選択肢 1「runner が書く `exec/plans/`・`exec/results/` などの実行管理ファイルを executor の変更範囲から除外し、それだけによって対象になる検査（`validate:history-links`・`validate:catalog`）は executor に対して適用外（`not_applicable`）として扱う」を採用した。選択肢 2「plan に runner が書く `plan`・`result` も検査対象に入ることを明記して executor に流させる」は、executor / reporter パイプラインでは `plan` が executor 起動前に runner によって生成され、`result` の本文は executor 終了後に reporter と runner が描画するため、プロダクト文書（`docs/ja/product/`）のみを編集するタスクで executor にプロジェクト側の履歴リンク検査やカタログ検査を毎回実行させても終了後の `result` を検証できず冗長になることから退けた                                                                                                                                                                           |
| 解決内容   | `src/exec/reporter.ts` を更新し、(1) 変更範囲の判定（`deliverableChangedPathSides`）から runner が管理する `exec/` 配下（`plans/`・`results/`・`evidence/`・`events/`・`.locks/`）を除外した（ただし `attempt_changes` に記録された既存の `exec/plans/**/*.md`・`exec/results/**/*.md` を executor 自身が編集した場合は対象に残す）、(2) `CHANGE_SCOPED_VALIDATIONS` に `validate:history-links`（`npm run validate:history-links`・`npx specdojo-docs-lint history-links`・`node ... specdojo-docs-lint.js history-links`）を追加し、履歴蓄積ファイル（`pjr-*.md`（`pjr-index.md` を除く）、または executor 自身が変更した既存の `exec/plans/**/*.md`・`exec/results/**/*.md`）の変更がない場合は適用外と判定するようにした、(3) `catalog validate` の適用判定に `npm run validate:catalog` および `tools/catalog-validate-if-configured.mjs` を含め、`specdojo catalog validate` と同じ基準で判定するようにした |
| 解決内容   | 採用した方式に合わせて、plan 共通規約テンプレート（`docs/ja/specdojo/exec-templates/xep-common-conventions-template.md`）、pipeline executor プロンプト（`src/exec/run/agent.ts`）、exec 運用ガイド（[[specdojo:exec-operation-guide\|exec運用ガイド]]）、exec 設定ガイド（[[specdojo:exec-config-guide\|exec設定ガイド]]）、および `CHANGELOG.md` の `Unreleased` 節を更新した。保護された設定（`.specdojo/**`・`package.json`・`lefthook.yml` など）の変更は不要と判断した                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 確認結果   | `tests/src/exec/reporter.test.ts` および `tests/src/exec/run/run.test.ts` に単体テストを追加し、プロダクト文書（`docs/ja/product/...`）のみを変更し runner が書いた `exec/plans/`・`exec/results/` が含まれる場合に `validate:history-links` と `validate:catalog` の `not_applicable` / `not_run` が `blocked` にならないこと、executor 自身が履歴蓄積ファイル（`pjr-*.md` や `attempt_changes` に含まれる既存の `exec/results/*.md`）やカタログ（`dct-*.yaml`）を変更した場合は従来どおり `not_applicable` を拒否して `blocked` にすること、および executor プロンプトに適用条件が反映されていることを検証した。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run validate:history-links`・`specdojo catalog validate` を実行して通過を確認した                                                                                                                                             |
| 再発防止策 | 変更ファイル種別や対象パスで適用が決まる検査を共通規約や `package.json` で案内する際は、runner が生成・更新する実行管理ファイルを除外した executor 自身の変更範囲で `src/exec/reporter.ts` の機械判定・plan テンプレート・executor プロンプトの 3 箇所を揃える                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

## 6. 関連ドキュメント

- [[prj-0001:pjr-gqn3-data-flow-uc-rewrite]]
- [[prj-0001:pm-orchestrator-playbook]]
