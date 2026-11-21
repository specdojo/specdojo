---
specdojo:
  id: prj-0001:pjr-f6mc-local-config-external-projects
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: low
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-21T09:03:34Z"
  block_reason: "parent validation failed: lint-fm, validate-schema, test-unit"
---

# PJR-F6MC ローカル設定で external_projects を宣言できない

## 1. 課題内容

external_projects の path は相手のリポジトリの置き場所で、環境ごとに違う。しかし specdojo.local.config.json が許すキーは version と `projects.<id>.repos` だけで、external_projects を書くと unknown key で止まる。利用者は環境に依存するパスを共有の specdojo.config.json に commit するしかない。ローカル設定で external_projects を宣言・上書きできるようにするかを決める

## 2. 入力

- 発端は利用者のプロジェクト coderdojo-lessons-specdojo（SpecDojo 0.9.2、2026-11-21）。
- 本家へ起票するため .specdojo/specdojo.local.config.json に `external_projects` だけを書いたところ、register add が「unknown key `"external_projects"` (allowed: version, projects)」「version must be 1」で止まった。
- specdojo-config-reference の `external_projects` の節は、ローカル設定で書けないことに触れていない。利用者のプロジェクトでは、共有の specdojo.config.json に `external_projects`（path: ../specdojo）を置いて回避した。

## 3. 影響範囲

| 観点         | 影響                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| スコープ     | ローカル設定（`.specdojo/specdojo.local.config.json`）で扱えるキー                      |
| スケジュール | なし（回避策: 共有の設定に path を書く）                                                |
| コスト       | 小さい（runner と CLI の一部の修正）                                                    |
| 品質         | 環境ごとに違うパスを共有の設定へ commit する必要がある                                  |
| 関係者       | 利用者のプロジェクト（coderdojo-lessons-specdojo など）と prj-0001 のオーケストレーター |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                            |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | ローカル設定の読み込みと検査が、キーを `version` と `projects.<id>.repos` だけに限っている                                                                                                                      |
| 対応策   | ローカル設定で `external_projects` を書けるようにする。共有の設定にある別名の `path` などを上書きでき、共有の設定にない別名を足すこともできる。`config show` に、ローカル設定で上書きされた値と分かる表示を出す |
| 依存事項 | なし                                                                                                                                                                                                            |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                                                                                                    |

- ローカル設定だけに `external_projects` を書いた状態で、外部プロジェクトへの `register add` が通る（テストで確かめる）。
- 共有の設定の別名の `path` を、ローカル設定で上書きできる（テストで確かめる）。
- schema（ローカル設定の schema があればそれ）と `specdojo-config-reference` の `external_projects` とローカル設定の節を直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分（追加・変更・不具合修正など）と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
