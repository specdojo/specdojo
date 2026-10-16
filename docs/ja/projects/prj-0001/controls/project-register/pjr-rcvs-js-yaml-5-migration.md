---
specdojo:
  id: prj-0001:pjr-rcvs-js-yaml-5-migration
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T22:17:17Z"
  completed_at: "2026-10-15T20:39:58Z"
  conclusion: js-yaml を 5.4.3 へ上げ、import を YAML 1.1 互換の読み込みをするラッパーへ寄せて、引用符なしの日付と merge key の読み込み結果を 4 系と同じにした
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
| 1   | js-yaml 5 の変更点を確かめ、影響する箇所を洗い出す  | DEV          | done | import・日付・merge key |
| 2   | import と日付の扱いを書き換え、テストを加える       | DEV          | done | -                       |
| 3   | `package.json` の変更を申し送りに提案差分として書く | DEV          | open | 保護設定                |
| 4   | 申し送りを適用し、lock ファイルを再生成して再開する | orchestrator | open | `exec handoff apply`    |

## 4. 対応結果

- js-yaml を利用する本体コードを named import の互換ラッパー経由へ変更し、v5 では `YAML11_SCHEMA`、依存更新前の v4 では `DEFAULT_SCHEMA` を使うようにした。これにより、引用符なしの日付と merge key の読み込み結果を 4 系と同じに保つ。
- js-yaml 5 で廃止された `quotingType` を `quoteStyle` へ変更し、依存更新前にも実行できるよう互換ラッパーで変換するようにした。
- 引用符なしの日付、引用符付きの日付、merge key の互換性を確認する単体テストを追加した。リポジトリ内の実データには merge key（`<<:`）がないことを確認した。
- ESM default import をすべて named import に変更し、CHANGELOG の 0.4.0 節へ依存更新を記載した。
- 残課題は、保護対象の本体および `packages/docs-lint` の `package.json` で js-yaml を `^5.4.3` に変更し、v5 が型定義を同梱するため両方の `@types/js-yaml` を削除して、各 lock ファイルを再生成することである。reporter の申し送り後に orchestrator が `exec handoff apply` を実行し、本タスクを再開する。

- 2026-10-16、orchestrator が `feature/prj-0001/js-yaml-5` で残課題を行った。本体と `packages/docs-lint` の `package.json` の js-yaml を `^5.4.3` に上げ、`@types/js-yaml` を外して lock ファイルを再生成した（7952bffc1）。
- js-yaml 5 での `npm run check` で、過去の result 3 件の frontmatter が読めないことが分かった。原因は result の書き出しの不具合で、[[prj-0001:pjr-tmaw-result-frontmatter-block-reason-yaml]] として直し、3 件の frontmatter は orchestrator が値を変えずに直した（5d36efc20）。
- その後の `npm run check`（テスト 148 ファイル・2,241 件）が通り、develop へ統合した（90b04fbdc）。本体の作業場所の `node_modules` を入れ替え、`register build`・`routine validate`・`job validate`・`catalog validate`・`index build` が js-yaml 5 で動くことを確かめた。

## 5. 関連ドキュメント

- [[prj-0001:pjr-q3f0-dev-dependencies-major-update]]: 段 7 の 2 件目。
