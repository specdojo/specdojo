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
  block_reason: "parent validation failed: test-unit"
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

### 5.1. 実施内容

- `src/shared/local-config.ts` の `applyLocalConfig` で `external_projects` を許可リストへ追加した。トップレベルの許可キーが `version`・`projects`・`external_projects` となり、既存の共有 alias は `path` だけを差し替え、共有に無い alias は `path`・`project_id` ともに local から足す（`kind: external-path` / `external-added`）。
- `LocalConfigOverride` の型を 4 種に広げた（`path`・`added`・`external-path`・`external-added`）。`formatLocalOverride`・`formatConfigShow` も各 kind に合わせて表示する。
- `docs/specdojo/schemas/v1/exec-evidence.schema.yaml` の `local_config_overrides` を `oneOf` 形式に書き替え、`project`/`repo` 系と `external` 系の項目を同時に許すようにした。`not.properties` の禁止キーは空のサブスキーマではなくブールの `false` にし、スキーマそのものが Ajv で検証できる形に直した（lint:fm・validate:schema・test:unit の失敗原因）。
- テスト: `tests/src/shared/local-config.test.ts` に「共有の別名の `path` 差し替え＋新規 alias の追加」「許可外のキーの拒否」「`path` が空文字の拒否」を追加した。
- 文書: [[specdojo:specdojo-config-reference]] のトップレベルキー表・許可するキー表・7. ローカル設定へ、`external_projects.<alias>`（既存／追加）と `external-path` / `external-added` を足した。

### 5.2. 決めた内容と理由

- 共有 alias の local 上書きは `path` だけとし、`project_id` は共有から引き継ぐにした。相対パスだけが環境依存で、相手の project ID は利用者の意思に属するため、`path` を差し替えるだけで済む。
- `external_projects` はトップルートのオブジェクト（別名をキー）なので、`repos[]` とは別枠の処理になる。共有の alias には `path` 以外を渡すとエラー、新規 alias には `project_id` は必須と、共有の設定と同じ `validateExternalProjects` を適用する。
- `local_config_overrides` の schema は既存の要素とも後方互換のため `oneOf` にした。`kind: external-path` のときだけ `shared_path` が必須。

### 5.3. CHANGELOG に書く事項

- 区分: Added
- 文案: 「ローカル設定 `.specdojo/specdojo.local.config.json` で `external_projects` を宣言・上書きできるようになった。共有 alias は `path` の差し替え、新規 alias は `path` と `project_id` の両方を local から足す（PJR-F6MC）。」

### 5.4. 残課題

- なし。

## 6. 関連ドキュメント

- [[specdojo:specdojo-config-reference]]
- [[prj-0001:pjr-nc9r-local-config-override|PJR-NC9R ローカル設定の基盤]]
