---
specdojo:
  id: prj-0001:pjr-x60a-agy-model-ids-in-templates
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-14T21:42:05Z"
  due_on: null
  completed_at: "2026-10-14T22:06:15Z"
  conclusion: init の雛形・antigravity の雛形と README・ガイド 2 件・設計書・本リポジトリの orch:agy の agy の model の ID を提供中のものへ置き換え、agy models で確かめる旨を書き、init の雛形のテストを加えた。CHANGELOG の 0.3.1 に記載した
---

# PJR-X60A 配布する雛形と文書の agy の model の ID が提供終了のものになっている

## 1. 課題内容

init が生成する exec-defaults の雛形・antigravity の雛形・ガイドが、agy 1.3.5 で提供されていない gemini-3.1-pro-high・claude-sonnet-4-6・claude-opus-4-6-thinking を指す。0.3.0 で init から agy を設定した利用者は expert の agy が invalid model selection で起動しない。0.3.1 で直す

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                                                                                                                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `templates/init-exec-defaults.yaml`、`templates/antigravity/exec-defaults-snippet.yaml`、`templates/antigravity/README.md`、`docs/ja/specdojo/guides/exec-config-guide.md`、`docs/ja/specdojo/guides/orchestrator-operation-guide.md`、`docs/ja/product/040-system-design/sysd-antigravity-agent-settings.md`、本リポジトリの `package.json` の `orch:agy`・`orch:agy:work` |
| スケジュール | 0.3.1 で直す（2026-10-15、利用者の判断）                                                                                                                                                                                                                                                                                                                                    |
| コスト       | 0.3.0 で `init` から agy を設定した利用者は、expert の agy と agy の claude 系の member が `invalid model selection` で起動しない                                                                                                                                                                                                                                           |
| 品質         | 本リポジトリの `.specdojo/exec-defaults.yaml` は PJR-NMSH の対応で直したが、配布物と文書は古いまま                                                                                                                                                                                                                                                                          |
| 関係者       | agy を使う利用者                                                                                                                                                                                                                                                                                                                                                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------- |
| 原因     | agy 1.3.5 で Gemini の Pro 系と Claude の 4.6 系の model が提供されなくなった。雛形と文書は、提供されていたときの ID のまま |
| 対応策   | PJR-NMSH で本リポジトリの `.specdojo/exec-defaults.yaml` に入れたものと同じ置き換えを、スコープのファイルへ行う             |
| 依存事項 | なし                                                                                                                        |
| 完了条件 | 下記の完了条件を満たす                                                                                                      |

### 3.1. 完了条件

- スコープのファイルで、agy の model の ID を次のとおり置き換えている。`gemini-3.1-pro-high` → `gemini-3.8-flash-high`、`claude-sonnet-4-6` → `claude-sonnet-5-5-medium`、`claude-opus-4-6-thinking` → `claude-opus-5-5-high`。
- `docs/ja/product/040-system-design/sysd-claude-agent-settings.md` の `claude-sonnet-4-6` は、agy ではなく Claude Code の model の別名の説明であるため、本件では変えない。
- 雛形とガイドに、使える model の ID は `agy models` で確かめることを書いている（本リポジトリの `.specdojo/exec-defaults.yaml` のコメントと同じ趣旨）。
- 置き換えの後、スコープのファイル（`sysd-claude-agent-settings.md` を除く）に `gemini-3.1-pro`・`claude-sonnet-4-6`・`claude-opus-4-6` が残っていない。
- `init` の雛形を検証するテストがあれば、期待値を新しい ID に合わせて通す。
- CHANGELOG に `## [0.3.1] - 未定` の節を設け、不具合修正として本件を記載する。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 4. 対応結果

- `templates/init-exec-defaults.yaml` と Antigravity 向け配布原本、2 つのガイド、Antigravity のシステム設計で、提供終了した ID を `gemini-3.8-flash-high`・`claude-sonnet-5-5-medium`・`claude-opus-5-5-high` へ置き換えた。本リポジトリの `package.json` の `orch:agy`・`orch:agy:work` は作業開始時点ですでに `gemini-3.8-flash-high` へ更新済みであることを確認した。
- 雛形とガイドへ、利用可能なモデル ID は `agy models` で確認する旨を追記した。Claude Code のモデル別名を説明する `sysd-claude-agent-settings.md` の `claude-sonnet-4-6` は変更していない。
- `specdojo init` が生成する Antigravity expert のモデルと、Antigravity 配布スニペットのモデル ID を固定する回帰テストを追加した。
- CHANGELOG に 0.3.1 の不具合修正として本件を記載した。
- Prettier、登録簿生成、成果物カタログ検証、差分の空白検査を実行し、すべて成功した。親 runner が lint、型検査、単体・統合テスト、schema 検証を続けて実行する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-nmsh-agy-model-not-recognized]]: 本リポジトリの設定の対応。
