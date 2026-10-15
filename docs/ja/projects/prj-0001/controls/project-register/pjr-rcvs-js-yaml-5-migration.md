---
specdojo:
  id: prj-0001:pjr-rcvs-js-yaml-5-migration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T22:17:17Z"
  block_reason: "agent exited with non-zero code: parent validation failed: typecheck, test-unit"
---

# PJR-RCVS js-yaml 5 への移行

## 1. 概要

named import への書き換え、引用符なしの日付が文字列になること、既定 schema から merge key が消えることへの対応を行い、js-yaml を 5 に上げる（v0.3.0 の次の版）

## 2. 完了条件

リファクタリングの段取り（2026-10-14、利用者が承認）の段 7 の 1 件目。2026-10-15 時点で js-yaml は 4.3.2（最新は 5.4.3）。本体の `package.json` と `packages/docs-lint/package.json` で宣言し、66 ファイルが import している（default import 47、named import 20）。リポジトリの YAML に merge key（`<<:`）はない。CHANGELOG には 0.3.1 ではなく次の版（0.4.0）の変更として記載する（2026-10-15、利用者の判断）。

- 本体と `packages/docs-lint` の js-yaml を `^5.4.3` に上げる。`package.json` は保護設定のため、変更は result の申し送りに提案差分として書き、orchestrator が `exec handoff apply` で適用して lock ファイルを再生成する。
- js-yaml 5 で default export がなくなる場合は、すべての import を named import（`load`・`dump` など）へ書き換える。
- 引用符なしの日付（`2026-10-15` など）の読み込みの結果が 4 系から変わる場合は、変わる箇所（frontmatter・登録簿・schedule・catalog などの日付の扱い）を調べ、4 系と同じ結果になるよう呼び出し側で schema を指定するか、値を正規化する。どちらにしたかと理由を result に書く。
- merge key を使う YAML がないことを確かめ、result に書く。
- 引用符なしの日付を含む YAML の読み込みが 4 系と同じ結果になることを確かめる単体テストを加える。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- CHANGELOG に `## [0.4.0] - 未定` の節を設け、依存の更新として記載する。`@specdojo/docs-lint` の版は本件では変えない（公開の準備でまとめて上げる）。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                | 担当         | 状態 | メモ                    |
| --- | --------------------------------------------------- | ------------ | ---- | ----------------------- |
| 1   | js-yaml 5 の変更点を確かめ、影響する箇所を洗い出す  | DEV          | open | import・日付・merge key |
| 2   | import と日付の扱いを書き換え、テストを加える       | DEV          | open | -                       |
| 3   | `package.json` の変更を申し送りに提案差分として書く | DEV          | open | 保護設定                |
| 4   | 申し送りを適用し、lock ファイルを再生成して再開する | orchestrator | open | `exec handoff apply`    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-q3f0-dev-dependencies-major-update]]: 段 7 の 2 件目。
