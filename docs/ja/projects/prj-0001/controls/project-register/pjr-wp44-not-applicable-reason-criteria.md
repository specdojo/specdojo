---
specdojo:
  id: prj-0001:pjr-wp44-not-applicable-reason-criteria
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-10-11T15:00:52Z"
  block_reason: "agent exited with non-zero code: parent validation failed: test-unit"
---

# PJR-WP44 not_applicable の理由の条件が分かりにくく正当な対象外が失敗扱いになる

## 1. 課題内容

catalog_path を設定していない project の catalog validate を executor が not_applicable と記録しても、理由が条件を満たさず失敗扱いになり run が止まる。条件が executor へ伝わっていない

## 2. 影響範囲

| 観点         | 影響                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| スコープ     | executor 検証を `not_applicable` と記録した run の判定（`src/exec-reporter.ts` の `isValidNotApplicableValidation`） |
| スケジュール | v0.3.0 の公開前に直す                                                                                                |
| コスト       | 正当な対象外の検証で run が止まり、再実行や orchestrator による統合の手間が生じる                                    |
| 品質         | 成果物に問題がなくても `waiting` になり、判定の信頼性が下がる                                                        |
| 関係者       | exec を使う利用者と orchestrator                                                                                     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 2 点ある。(1) プロダクトリポジトリのコマンド（例: `npx prettier --write specdojo-lp:src/pages/index.astro`）の適用可否を、project リポジトリの `package.json` の script と依存で判定している。project 側に prettier があるため、プロダクト側に無いという正当な理由が退けられた。(2) `specdojo catalog validate` などの適用可否を、対象 project ではなく設定全体で判定している。prj-0001 が `catalog_path` を持つため、`catalog_path` を持たない prj-0002 でも適用ありと判定された                                                                          |
| 対応策   | (1) `<repo>:<path>` を対象に含むコマンドや `--prefix <repo>` 付きのコマンドは、そのプロダクトリポジトリの `package.json` で判定する。(2) `specdojo` のコマンドの適用可否は、run の対象 project の設定（`catalog_path` など）で判定する。(3) executor の prompt に、`not_applicable` の理由として認められる条件を短く示す                                                                                                                                                                                                                                   |
| 依存事項 | [[prj-0001:pjr-2gze-product-validation-not-run-delegation]] と同じ判定の箇所を扱う。順に実行する                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 完了条件 | 上の 2 つの事例（プロダクト側に prettier が無い、対象 project に `catalog_path` が無い）が正当な `not_applicable` として受理されることを単体テストで確認する。project 側に依存がある project リポジトリのコマンドや、対象 project で適用される `specdojo` コマンドの `not_applicable` は従来どおり退けられることも確認する。統合テストで子プロセスとして CLI を起動する場合は、実リポジトリの `node_modules/.bin/tsx` を絶対パスで起動する。fixture の `agent-members.yaml` は schema の必須項目（`capabilities`・`proficiency`・`priority` など）を満たす |

## 4. 対応結果

| 項目       | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 解決内容   | `src/exec-reporter.ts` の適用可否の判定を変えた。(1) `<repo>:<path>` を引数に含むコマンドと `--prefix <repo>` 付きのコマンドは、対象 project が `repos` で宣言したプロダクトリポジトリの `package.json` で判定する。(2) `specdojo catalog validate` は `--project`、run の対象 project（execution path に一致する project）、`current_project` の順に対象を決めて判定する。対象 project は `evidenceForReporter` が特定し、`deriveReporterFacts` も同じ project で判定する |
| 確認結果   | executor の prompt（`src/exec-run.ts`）に、`not_applicable` が退けられる条件とプロダクトリポジトリ・`catalog_path` の扱いを示した。`tests/src/exec-reporter.test.ts` に、プロダクト側に prettier や script が無い場合と run の対象 project に `catalog_path` が無い場合の受理、project 側に依存がある場合と対象 project に `catalog_path` がある場合の拒否の単体テストを追加した                                                                                           |
| 再発防止策 | exec-config-guide と exec-operation-guide に、対象 project の決め方とプロダクトリポジトリのコマンドの判定先を記載した                                                                                                                                                                                                                                                                                                                                                      |

## 5. 関連ドキュメント

- prj-0002 の PJR-HEPK（`project/prj-0002/develop` 上）: 事象が起きた実行
- [[prj-0001:pjr-a0ne-not-applicable-check-blocks]]: 同じ判定を以前に直した項目
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]: v0.3.0 の公開前に直すと利用者が判断した（2026-10-12）
