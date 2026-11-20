---
specdojo:
  id: prj-0001:pjr-08ek-opencode-extra-roots
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-18T12:17:01Z"
  due_on: "2026-11-30"
  block_reason: "integrate failed: project: Result Markdown notation violation before commit: docs/ja/projects/prj-0001/execution/runs/register/PJR-08EK/pjr-08ek-20261120T113146Z-491757ba/result.md:40:241 error MD034/…"
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

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
