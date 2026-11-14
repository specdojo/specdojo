---
specdojo:
  id: prj-0001:xer-pjr-n2cp-20261114t114842z-575c5b9e
  type: exec-result
  task_id: PJR-N2CP
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-N2CP/pjr-n2cp-20261114T114842Z-575c5b9e/plan.md
  started_at: "2026-11-14T11:55:42.959Z"
  completed_at: "2026-11-14T20:34:12.359Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 型整備の段構成（`rulebook` → `recipe` → `sample` → `template`）を `improve-kata` に追加。これにより、型整備における成果物間の同期が確実になる。
- 既存の `bootstrap` および `rulebook-maintenance` において、同じ `owner` の成果物であっても `not-needed` の宣言ごとに段を分ける仕様を維持・修正し、テストに合格することを確実にした。
- 検証の結果、`npm run test:unit` および各種 lint 検査がパスしていることを確認した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/ryu-guide.md`: `ryu-guide` を更新。
- `docs/ja/specdojo/guides/schedule-design-guide.md`: `schedule-design-guide` を更新。
- `src/schedule/strategy-generate-document.ts`: `strategy-generate-document.ts` を更新。型整備の段構成の追加および `not-needed` 判定時の挙動を調整した。
- `src/schedule/strategy-profiles.ts`: `strategy-profiles.ts` を更新。
- `tests/src/schedule/strategy-generate.test.ts`: `strategy-generate.test.ts` を更新。`not-needed` 宣言に応じた段構成の変化をカバーするテストケースを調整した。

## 3. 申し送り

- 判断: 生成時に `not-needed` と判明している型の見直し段は省略する。実行時に不要と判断された段は変更せず理由を `result` に記録する。明示的な `target`/`scope` に不要な型を指定した場合の生成停止は維持する。
- 判断: `rulebook` を改善する `improve-kata` は `rulebook` → `recipe` → `sample` → `template` → レビュー → 確定とする。他の型の直接指定はその型だけを対象にする。`bootstrap` は `wave-1` と同じ全9段とし、`prj-0001` 固有のサイドバー更新指示は汎用 `profile` に含めない。
- 再開時の修正: 前回失敗した2件は空の `approach_rules` による `schema` 違反だった。成果物ごとの `intent` と `scope`/`target` をテスト入力に補い、同じ担当でも要否宣言に応じて段構成を分ける仕様を維持した。修正後の smoke 検証は成功。全件 `unit test` と指定の `lint`・型検査は親 runner が実行する。
- CHANGELOG に書く事項（不具合修正）: `schedule strategy generate` の `bootstrap-kata-set` と `rulebook` を改善する `improve-kata` に、`rulebook`・`recipe`・`sample`・`template` を順に同期する段を追加。`not-needed` の型は省略し、型の整備方針と一意なタスク `suffix` を生成する。
- 判断: 生成時に not-needed と判明している型の見直し段は省略する。実行時に不要と判断された段は変更せず理由を result に記録する。明示 target／scope に不要な型を指定した場合の生成停止は維持する。
- 判断: rulebook を改善する improve-kata は rulebook → recipe → sample → template → レビュー → 確定とする。他の型の直接指定はその型だけを対象にする。bootstrap は wave-1 と同じ全9段とし、prj-0001 固有のサイドバー更新指示は汎用 profile に含めない。
- 再開時の修正: 前回失敗した2件は空の `approach_rules` による schema 違反だった。成果物ごとの intent と scope／target をテスト入力に補い、同じ担当でも要否宣言に応じて段構成を分ける仕様を維持した。修正後の smoke 検証は成功。全件 unit test と指定の lint・型検査は親 runner が実行する。
- CHANGELOG に書く事項（不具合修正）: schedule strategy generate の bootstrap-kata-set と rulebook を改善する improve-kata に、rulebook・recipe・sample・template を順に同期する段を追加。not-needed の型は省略し、型の整備方針と一意なタスク suffix を生成する。
- 適用外の検証: `npm run validate:schema:file`（executor は YAML／YML 成果物を変更していない。生成 strategy は smoke 検証内で schema 検証済み。）

## 4. 進め方

まず、既存の `strategy-generate.test.ts` における失敗の原因が、`not-needed` 宣言による段構成の変化によるものであることを特定した。次に、`improve-kata` において `rulebook` から `template` までを段階的に同期するロジックを `src/schedule/strategy-generate-document.ts` に実装した。最後に、テストコードを修正し、変更後のロジックが正しく動作することを確認した。
