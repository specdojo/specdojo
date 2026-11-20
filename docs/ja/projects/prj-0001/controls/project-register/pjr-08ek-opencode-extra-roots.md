---
specdojo:
  id: prj-0001:pjr-08ek-opencode-extra-roots
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-18T12:17:01Z"
  due_on: "2026-11-30"
---

# PJR-08EK exec で opencode の executor がプロダクトリポジトリの worktree を編集できない

## 1. 課題内容

exec の opencode 起動にだけプロダクトの worktree の許可が渡らず、external_directory の deny で編集がすべて拒まれる

`repos` で宣言したプロダクトリポジトリを対象にする register 項目を、`exec run --register --worktree` で opencode の executor に流すと、プロダクトの worktree への編集がすべて拒まれる。

- 期待する動き: claude・codex・antigravity・copilot と同じく、executor がプロダクトの worktree（`<worktree>/<repo-name>/`）を編集できる。
- 実際の動き: プロダクトの worktree のファイルへの Edit が、すべて次のエラーで拒まれる。

```text
Error: The user has specified a rule which prevents you from using this specific tool call.
... {"permission":"external_directory","action":"deny","pattern":"*"} ...
```

## 2. 入力

- repos を宣言した project で、プロダクトのファイルの変更を求める項目を opencode-executor で exec run --register --worktree に流すと、プロダクトの worktree への Edit がすべて permission `external_directory` の deny で拒まれた
- 環境: specdojo 0.7.0、opencode 1.19.5、Linux（devcontainer）
- 起票案は利用者が作成した tmp/specdojo-issue-1-opencode-extra-roots.md
- 再現の手順（検出したプロジェクトからの報告、2026-11-20）: `specdojo.config.json` の project に `repos` を宣言する（例: `path: ../<product>`）。`exec-defaults.yaml` の振り分けで executor を opencode（`opencode-executor`）にする。プロダクトのファイルの変更を求める項目を `npx specdojo exec run --register <ID> --worktree` で流す
- opencode 1.19.5 での権限の照合（同じ報告で試した結果）: `external_directory` は、対象のディレクトリの絶対パス（例: `<worktree_base>/<task>/<repo>/*`）で照合される
- 同じく: `edit` は、opencode の起動場所（project の worktree）からの相対パス（例: `../<repo>/a.txt`）で照合される。絶対パスのパターン `<abs>/**` の `allow` は当たらず、`"*": deny` で拒まれた
- 同じく: opencode.json の `agent.<name>.permission` に書いても、`.opencode/agents/<name>.md` の frontmatter が後から読まれて上書きする（`opencode debug agent` で確かめた）

## 3. 影響範囲

| 観点         | 影響                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------- |
| スコープ     | exec の opencode 起動（executor・reviewer・reporter）と `orchestrator launch` の opencode 注入 |
| スケジュール | 影響なし                                                                                       |
| コスト       | 影響なし                                                                                       |
| 品質         | `repos` を宣言した project で opencode の executor がプロダクトの worktree を編集できる        |
| 関係者       | opencode を executor に振り分けている利用者                                                    |

## 4. 対応方針

| 項目     | 内容                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------ |
| 原因     | 下記の原因の内訳（0.7.0 のコードから）                                                                 |
| 対応策   | exec の opencode 起動でも、その run のプロダクトの worktree だけに許可を注入する（下記の対応策の内訳） |
| 依存事項 | なし                                                                                                   |
| 完了条件 | 下記の条件をすべて満たすこと                                                                           |

原因の内訳（0.7.0 のコードから）。

- `dist/exec/task-repos.js` の `agentExtraRootArguments` は、claude（`--add-dir` と `Edit(//<abs>/**)`）と、codex・antigravity・copilot（`--add-dir`）にはプロダクトの worktree を追加の root として渡すが、opencode には `[]` を返す。
- コメントには「OpenCode's orchestrator entry injects `permission.external_directory` through its runtime config instead.」とあるが、注入しているのは `orchestrator launch` だけで、exec の executor・reviewer の起動には入っていない。
- 配布の `templates/opencode/agents/opencode-executor.md` は `external_directory: deny` で、`edit` も `docs/**`・`src/**`・`tests/**` に限られる。
- `orchestrator launch` の注入（`dist/commands/orchestrator.js`）は、`edit` にも絶対パスのパターンを入れている。opencode 1.19.5 では `edit` が起動場所からの相対パスで照合されるため、`external_directory` は通っても `edit` で拒まれる可能性がある（報告の推定で、未確認）。
- opencode.json の `agent.<name>.permission` は、agent の定義ファイルの frontmatter に上書きされる。許可は agent の定義より後に効く経路（runtime config など）で渡す必要がある。

対応策の内訳。

- exec で opencode を起動するときも、`orchestrator launch` と同じく runtime config（`OPENCODE_CONFIG_CONTENT` など）で、その run のプロダクトの worktree だけに `external_directory` と `edit` の許可を注入する。`external_directory` には絶対パス、`edit` には起動場所からの相対パス（`../<repo>/**`）のパターンを入れる。
- 注入できるまでの間は、プロダクトリポジトリを対象にする項目で opencode が選ばれたときに、開始する前に止める（または doctor で警告する）。

完了条件の内訳。

- exec で opencode を起動するとき、その run のプロダクトの worktree にだけ `external_directory` と `edit` の許可が渡る。それ以外の場所は今までどおり拒まれる
- `external_directory` のパターンは絶対パス、`edit` のパターンは起動場所（project の worktree）からの相対パス（`../<repo>/**`）にする。照合の形は、手元の opencode で確かめられれば確かめ、確かめられない場合はそのことを個票の対応結果に書く
- 許可は agent の定義ファイルの frontmatter に上書きされない経路で渡す
- `orchestrator launch` の注入の `edit` のパターンも同じ照合の形になっているかを確かめる。同じ問題があれば、同じ直し方で直すか、別の項目の起票の案として個票の対応結果に書く。どちらにしたかと理由を書く
- claude・codex・antigravity・copilot の起動の引数は変わらない
- 上の 2 点を単体テストで確かめる
- 対応策の 2 点目（開始前に止める・doctor で警告する）を実装するかどうかは executor が決め、理由を個票の対応結果と報告の `handoff` に書く
- `CHANGELOG.md` は変えず、個票の対応結果の `### <n>.<m>. CHANGELOG に書く事項` に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ「なし」と書く
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の検証が通る

## 5. 対応結果

### 5.1. 解決内容

- `src/exec/opencode-permissions.ts` を新設し、`orchestrator launch` にあった注入処理（`inlineOpenCodeConfig`）をここへ移して exec と共用にした。`external_directory` は `{"*": "deny", "<abs>/**": "allow"}`、`edit` は継承した値に `../<repo>/**`（起動場所からの相対パス）の `allow` を足す。
- `withAgentExtraRoots` は、provider が opencode でプロダクトの worktree があるとき、`OPENCODE_CONFIG_CONTENT='<json>'` を起動コマンドの前に付ける。対象の agent は起動コマンドの `--agent` から取り、継承した `OPENCODE_CONFIG_CONTENT` の他項目は保持する。呼び出し元（`exec/run/agent.ts`・`exec/run/in-place.ts`・`exec/worktree-command.ts`）は作業ディレクトリを渡す。
- 経路は inline config（`OPENCODE_CONFIG_CONTENT`）。opencode の公式ドキュメントでは、inline config は `.opencode` ディレクトリ（agent の定義）より後に読み込まれる（<https://opencode.ai/docs/config>）。そのため agent の定義ファイルの frontmatter に上書きされない。`opencode.json` の `agent.<name>.permission` は使わない。
- `agentExtraRootArguments` は変えていない。claude・codex・antigravity・copilot の起動の引数は従来どおり（単体テストで確認）。
- `orchestrator launch`: `edit` に絶対パス（`<abs>/**`）が入っていて、exec と同じ問題があった。同じ関数を使う形に直し、`edit` を起動場所（SpecDojo root）からの相対パスにした。理由は、同じ照合の形の問題を同じ処理で直せば、二つの経路が別々に壊れることがないため。
- 対応策の 2 点目（開始前に止める・doctor で警告）: 注入を実装したので、プロダクトリポジトリを対象にする項目を一律に止めることはしない。ただし opencode の起動コマンドに `--agent <name>` が無いと許可の範囲を決められないため、その場合だけ `withAgentExtraRoots` がエラーを投げて起動前に止める。doctor の警告は追加していない。
- 参照文書の opencode の記述（「許可には agent 定義の変更が必要」など）を今の動きに合わせた。
- e2e の fixture（`register-pipeline-e2e.integration.test.ts`）の opencode の `command_template` に `--agent fake-opencode-agent` を足した。足さないと、上の起動前のエラーで止まる。

### 5.2. 確認結果

- 単体テスト: `tests/src/exec/task-repos.test.ts` に、opencode でプロダクトの worktree だけが許可されること（絶対パスの `external_directory`、相対パスの `edit`、それ以外は `"*": deny`）、継承した設定とのマージ、`--agent` が無い場合の失敗、claude・codex・antigravity・copilot の引数が変わらないことを足した。`tests/src/exec/opencode-permissions.test.ts` を新設した。`tests/src/commands/orchestrator.test.ts` の `edit` の期待値を相対パスにした。対象の 3 ファイルを vitest で実行し、すべて通った。
- 照合の形は、手元の opencode で確かめられなかった。executor の sandbox では opencode CLI を起動できない。相対パス・絶対パスの形は報告（opencode 1.19.5）の試験結果に合わせた。inline config が agent の frontmatter より後に効くことも公式ドキュメントで確かめただけで、実機では確かめていない。

### 5.3. 再発防止策

- opencode の許可のパターンの生成を 1 つのモジュールにまとめ、exec と `orchestrator launch` で共用する。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: `repos` を宣言した project で、exec の opencode の executor がプロダクトの worktree を編集できなかった問題を修正。runner は起動時の `OPENCODE_CONFIG_CONTENT` で、その run のプロダクトの worktree だけに `external_directory` と `edit` の許可を渡す。`orchestrator launch` の `edit` の許可も、起動場所からの相対パスにそろえた。opencode の `command_template` には `--agent <name>` が必要になった（PJR-08EK）

### 5.5. orchestrator の確認（2026-11-20）

- 統合の後に、手元の opencode 1.19.5 で `opencode debug agent opencode-executor` を流し、注入した後の最終の許可の規則を見た。注入する値は `dist/exec/opencode-permissions.js` の `opencodeExtraRootConfig` で、プロダクトの root を `/workspaces/specdojo-workspace/app1` として作った。
- agent の定義の frontmatter の `edit` の規則（`*` を deny、`docs/**`・`src/**`・`tests/**` を allow、`docs/ja/projects/**/execution/exec/results/**` を deny）はそのまま残り、注入した `edit` の `../app1/**` の allow がその後ろに足された。`external_directory` も、`*` の deny の後ろに `/workspaces/specdojo-workspace/app1/**` の allow が足された。注入しないときは、この 2 つの規則は無い。inline config が frontmatter に上書きされず、後ろの規則として効くことを確かめた。
- 実際の run でプロダクトの worktree を編集できるかは、このリポジトリに `repos` が無いため確かめていない。利用者の決定（2026-11-20、案 A）で、問題を見つけたプロジェクトで 0.9.1 の候補を使って 1 回流して確かめる。見ること: プロダクトの worktree のファイルを編集できる、宣言していない外の場所は拒まれる、`opencode.json` の `agent.<name>.permission` を足さなくても動く。確かめるまで review のまま残す。
- 利用者に関わる変更: プロダクトリポジトリのある run では、opencode の `command_template` に `--agent <name>` が要る。配布の雛形（`templates/init-exec-defaults.yaml`）と、このリポジトリの `exec-defaults.yaml` には入っている。

## 6. 関連ドキュメント

- [[specdojo:specdojo-config-reference]]
- [[specdojo:command-reference]]
- [[specdojo:orchestrator-operation-guide]]
