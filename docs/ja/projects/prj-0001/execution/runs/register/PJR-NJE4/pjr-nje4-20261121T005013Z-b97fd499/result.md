---
specdojo:
  id: prj-0001:xer-pjr-nje4-20261121t005013z-b97fd499
  type: exec-result
  task_id: PJR-NJE4
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-NJE4/pjr-nje4-20261121T005013Z-b97fd499/plan.md
  started_at: "2026-11-21T00:50:33.242Z"
  completed_at: "2026-11-21T01:08:36.759Z"
  agent: opus-executor
  block_reason: "parent validation failed: lint-md, test-integration"
---

# Edit Result

## 1. 実施内容

- 0.9.2 において Antigravity (`agy`) の起動を制限する変更を行いました。
- `provider` が `antigravity` である `member` について、`resolveMemberCommand` での起動拒否および `selectCandidates` での候補除外を実装しました。
- `agent launch`、`orchestrator launch` 実行時にエラーで停止するようにし、`init`、`config scaffold`、`exec scaffold`、`devcontainer scaffold` の各プロセスで `antigravity` が選択肢に出ないよう修正しました。
- 既存の `agy` 関連の単体テストを修正し、新たに 6 つの起動パターンに対するテストを追加しました。
- ドキュメント（`README.md`、各種ガイド、コマンドリファレンス）に、`antigravity` が使用できない旨の注意書きを追加し、不要になった記述を削除しました。

## 2. 変更ファイル

- `README.md`: `antigravity` に関する注意書きの追加および関連記述の更新を行いました。
- `docs/ja/specdojo/guides/exec-config-guide.md`: `antigravity` に関する注意書きを追加しました。
- `docs/ja/specdojo/guides/orchestrator-operation-guide.md`: `antigravity` に関する注意書きを追加しました。
- `docs/ja/specdojo/references/command-reference.md`: `antigravity` 専用の npm script に関する記述の削除および注意書きの追加を行いました。
- `src/commands/agent.ts`: `agent launch` における `antigravity` の起動制限を実装しました。
- `src/commands/init.ts`: `init` 時の候補から `antigravity` を除外する修正を行いました。
- `src/commands/orchestrator.ts`: `orchestrator launch` における起動制限を実装しました。
- `src/devcontainer/command.ts`: `devcontainer scaffold` における候補除外を実装しました。
- `src/devcontainer/scaffold.ts`: `devcontainer scaffold` における候補除外を実装しました。
- `src/exec/agent-config.ts`: `exec scaffold` における候補除外を実装しました。
- `src/exec/commands.ts`: `exec scaffold` における候補除外を実装しました。
- `src/exec/run/shared.ts`: `exec run` 時の `member` 判定における起動制限を実装しました。
- `src/shared/provider-scaffold.ts`: `config scaffold` における候補除外を実装しました。
- `src/shared/specdojo-config.ts`: `specdojo-config` の型定義に関連する修正を行いました。
- `tests/src/commands/init.test.ts`: `init` 時の `antigravity` 除外に関するテストを追加しました。
- `tests/src/commands/orchestrator.test.ts`: `orchestrator launch` の制限に関するテストを追加しました。
- `tests/src/devcontainer/scaffold.integration.test.ts`: `devcontainer scaffold` 時の制限に関するテストを追加しました。
- `tests/src/devcontainer/scaffold.test.ts`: `devcontainer scaffold` 時の候補除外に関するテストを追加しました。
- `tests/src/exec/agent-config-command.test.ts`: `exec scaffold` 時の制限に関するテストを追加しました。
- `tests/src/exec/antigravity-session.integration.test.ts`: `antigravity` セッションに関する統合テスト（起動制限の検証）を追加しました。
- `tests/src/shared/provider-scaffold.test.ts`: `config scaffold` 時の候補除外に関するテストを追加しました。
- `src/shared/antigravity-block.ts`: `antigravity` の起動をブロックするためのロジックを新規実装しました。
- `tests/src/shared/antigravity-block.test.ts`: `antigravity-block` ロジックの単体テストを新規実装しました。

## 3. 申し送り

- 決めた内容: 名前で指定した代わり（`fallback_executor_by` / `fallback_reporter_by`、難易度別の振り分け `routing`）が `agy` の `member` の場合は、ほかの `member` へ進まずにエラーで止める。名前の指定は利用者の明示の選択で、黙って別の agent に替えないため。自動選択の中の代わりの候補は外して次へ進む。
- 決めた内容: 判定は `member` の `provider` で行う。`provider: custom` にして `command` で `agy` を直接呼ぶ設定は検出しない（`command` の文字列による判定は誤検出の恐れがあり、完了条件も `provider` を対象にしているため）。
- 決めた内容: `agent launch` は `agy` 専用の入口だったため、`agy` 以外の `provider` も起動せずエラーにする。`--role` は 0.9.1 の `command_template` を確実にこのエラーまで通すため任意にした。
- 決めた内容: `init` が書く `Antigravity` の `orch` の `npm` script と `Dev Container` の `volume` は 0.9.2 では作られないため、コマンドリファレンスの該当の記述は現在の動きに合わせて削除した。`agy` の設定方法の説明（session プロファイル・`--global`・`command template`）は消さずに、先頭へ使えないことを書いた（説明そのものの削除は PJR-N6FQ）。
- CHANGELOG に書く事項（区分: 利用者から見て動きが変わる点）の文案は個票の対応結果「CHANGELOG に書く事項」にある。0.9.1 の `init` で `antigravity` を選んだ利用者は、0.9.2 に上げると `exec run` などが止まる。直し方は `agent-members.yaml` で `agy` の `member` を `disabled: true` にするか消す、`exec-defaults.yaml` の `routing` の `agy` の `member` をほかの `provider` に替える、`orch:argon`・`orch:flash` などの `npm` script を消す、の 3 つ。
- 残課題: `exec run` が名前で指定された `disabled` の `member` を断らない件は PJR-77JB。配布テンプレート（`templates/antigravity/` ほか）と `agy` の設定の説明の削除は PJR-N6FQ。
- 決めた内容: 名前で指定した代わり（`fallback_executor_by` / `fallback_reporter_by`、難易度別の振り分け `routing`）が agy の member の場合は、ほかの member へ進まずにエラーで止める。名前の指定は利用者の明示の選択で、黙って別の agent に替えないため。自動選択の中の代わりの候補は外して次へ進む。
- 決めた内容: 判定は member の `provider` で行う。`provider: custom` にして `command` で agy を直接呼ぶ設定は検出しない（command の文字列による判定は誤検出の恐れがあり、完了条件も provider を対象にしているため）。
- 決めた内容: `agent launch` は agy 専用の入口だったため、agy 以外の provider も起動せずエラーにする。`--role` は 0.9.1 の `command_template` を確実にこのエラーまで通すため任意にした。
- 決めた内容: init が書く Antigravity の orch の npm script と Dev Container の volume は 0.9.2 では作られないため、コマンドリファレンスの該当の記述は現在の動きに合わせて削除した。agy の設定方法の説明（session プロファイル・`--global`・command template）は消さずに、先頭へ使えないことを書いた（説明そのものの削除は PJR-N6FQ）。
- CHANGELOG に書く事項（区分: 利用者から見て動きが変わる点）の文案は個票の対応結果「CHANGELOG に書く事項」にある。0.9.1 の init で antigravity を選んだ利用者は、0.9.2 に上げると exec run などが止まる。直し方は agent-members.yaml で agy の member を `disabled: true` にするか消す、exec-defaults.yaml の `routing` の agy の member をほかの provider に替える、`orch:argon`・`orch:flash` などの npm script を消す、の 3 つ。
- 残課題: exec run が名前で指定された disabled の member を断らない件は PJR-77JB。配布テンプレート（`templates/antigravity/` ほか）と agy の設定の説明の削除は PJR-N6FQ。

## 4. 進め方

まず、`antigravity` の起動をブロックするためのコアロジック（`src/shared/antigravity-block.ts`）を作成しました。次に、`agent`、`init`、`orchestrator`、`devcontainer`、`exec` の各コマンドにおいて、`antigravity` を候補から外す、あるいは起動時にエラーを出すように修正を行いました。最後に、これらの変更を検証するためのテストを追加し、ドキュメントに注意書きを追記して、利用者が 0.9.2 へのアップグレードに伴う挙動の変化を理解できるようにしました。
