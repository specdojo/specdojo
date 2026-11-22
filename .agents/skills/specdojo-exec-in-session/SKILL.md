---
name: specdojo-exec-in-session
description: SpecDojo の登録簿の項目を、runner（exec run）に渡さず、いまの会話の agent が自分で、または subagent で実装する手順。利用者が実装者にオーケストレーターを指定したとき、または executor が書けない保護された設定を変えるときに使う。worktree と feature ブランチの作成から、検査・保護された設定の確認・commit・承認後の merge・片付けまでを扱う。
---

# SpecDojo の項目を会話の中で実行する

この skill は、SpecDojo の登録簿の項目を `exec run --register` に渡さず、いまの会話の agent（オーケストレーター）が自分で、または subagent で実装するときの手順である。runner が自動で行う段（worktree の準備、親の検証、保護された設定の検査、commit、統合）を、オーケストレーターが同じ順で手で行う。

## 範囲

- 最初の版は、登録簿の項目（register）の edit だけを扱う。
- schedule のタスク（`--task`）と review の段（`mode: review`）は対象外である。後で広げる。これらは今までどおり `exec run` で流す。

## 使ってよい条件

次のどちらかに当たるときだけ使う。どちらにも当たらなければ `npx specdojo exec run --register <PJR-XXXX> --worktree` を使う。

- 利用者が、その項目の実装者にオーケストレーターを指定した。「着手してください」は実行経路の指示であり、実装者の指定として扱わない。
- 変える先が、executor が書けない保護された設定である。runner と同じ一覧は `src/exec/agent-protected-config.ts`（利用リポジトリでは `node_modules/specdojo/dist/exec/agent-protected-config.js`）にある。主なものは `.specdojo/`・`.agents/rules/`・`.agents/skills/`・`.claude/`・`.codex/`・`.opencode/`・`.github/agents/`・`.github/workflows/`・`package.json`・`lefthook.yml`・`AGENTS.md`・`CLAUDE.md` である。

## 手順

コマンドの `<project-id>`・`<PJR-XXXX>`・`<topic>` は対象に合わせて置き換える。書き込みを伴う git 操作は、`npx specdojo git --project <project-id> -- <git の引数>` で流し、runner の統合と同じロックに並べる。

### 1. 項目を読み、実装者を確かめる

1. 個票（`pjr-<id>-<topic>.md`）の `完了条件`・`作業内容`・`入力` を読む。完了条件が検証できる形でなければ、着手せずに利用者と直す。
2. 実装者の指定が会話で確かめられることを確認する。確かめられなければ利用者に聞く。
3. 現在のブランチを確かめる。作業ツリー（対象 project の `develop`）は runner の統合と記帳に使うため、切り替えない。

### 2. worktree と feature ブランチを作る

```bash
npx specdojo git --project <project-id> -- worktree add -b feature/<project-id>/<topic> <worktree-base>/feature-<topic> HEAD
```

- `<worktree-base>` は `specdojo.config.json` の project の `run.worktree_base` を使う。
- 検査を流すために、worktree に依存を用意する。作業ツリーの `node_modules` を共有してよい場合は、worktree の根と、`node_modules` を持つ `packages/*` のそれぞれに、`node_modules` のリンク（Windows では junction）を作る。根だけでは `packages/*` のテストが依存を見つけられずに落ちる。依存を変える項目では、worktree で `npm ci` を流す。
- リンクは commit しない。`packages/*/node_modules` のリンクは `.gitignore` に当たらず未追跡として出るため、手順 6 では対象のファイルを名前で指定して `add` する。
- `.gitignore` にある生成物（`docs/**/generated/` など）は worktree にない。検査の前に必要な生成物を作る（YAML の成果物を変えたら `npx specdojo build --only yaml-pages`）。

着手の記帳は develop で行う。自分で対応した項目は `start` を経ずに close してよい。

### 3. 実装する

自分で書くか、subagent に渡すかを、次で選ぶ。

| 選び方                                             | 実装する者 |
| -------------------------------------------------- | ---------- |
| 設計の判断を伴う、または保護された設定を変える     | 自分       |
| 範囲がはっきりし、変えるファイルが決まっている     | subagent   |
| 利用者が、会話の文脈を保ったまま変えることを求めた | 自分       |

subagent に渡すときは、次を守る。

- 計画は `npx specdojo exec plan --project <project-id> --register <PJR-XXXX>` で作る。このコマンドは状態を変えない。
- Claude Code では、subagent の種類に `claude-executor`（`.claude/agents/claude-executor.md`）を使い、作った計画・worktree のパス・変えてはいけないもの（保護された設定、完了条件の外のファイル）を渡す。
- subagent の「直した」「通った」という報告を信じない。手順 4 と 5 で、差分と検査の出力を自分で確かめる。

### 4. 検査を流す

`.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` と同じ検査を、worktree で 1 本ずつ流す。

- 検査の ID は、`-` を `:` に替えた npm の script に当たる（`lint-md` は `npm run lint:md`、`test-integration` は `npm run test:integration`）。
- `paths` を書いた検査は、変えたファイルに合うときだけ流す。
- ほかの run が流れているときは、負荷で統合テストが時間切れになりやすい。時間切れは失敗と分けて記録し、負荷を下げて流し直す。
- 文書サイトのビルド（`npm run docs:build`）は、項目の完了条件が求めるときだけ流す。メモリーを多く使うため、並べた run と重ねない。

### 5. 保護された設定を確かめる

```bash
git -C <worktree> diff --name-only <base>...HEAD
git -C <worktree> status --short
```

- 差分を、手順の「使ってよい条件」に挙げた一覧に照らす。
- 保護された設定が入っていたら、利用者が会話で承認した変更だけを残す。承認のない変更は戻す。

### 6. commit する

```bash
npx specdojo git --project <project-id> -- -C <worktree> add <files>
npx specdojo git --project <project-id> -- -C <worktree> commit -m "<subject>" -m "<body>"
```

- subject は日本語で書き、conventional commit の type と scope を保つ。本文に「なぜ」と `Refs: <project-id>:<PJR-XXXX>` を書く。
- commit の hook が止めたら、出力を読んで直し、もう一度 commit する。index に載ったファイルを残さない。

### 7. 承認を得て merge する

1. 差分の要約（変えたファイル、検査の結果、保護された設定の有無）を日本語で示し、merge の承認を得る。
2. 作業ツリー（develop）で merge する。

   ```bash
   npx specdojo git --project <project-id> -- merge --no-ff feature/<project-id>/<topic> -m "<subject>" -m "<body>"
   ```

3. `src` を変えた場合は、merge の後に `npm run build` で dist を作り直す。dist が古いと、次の run は始まる前に止まる。
4. `git push` と PR は行わない。必要なら、コマンドを示して利用者へ引き渡す。

### 8. 記帳して片付ける

1. 個票の `対応結果` に、実施内容・確かめたこと・残ったことを書く。CHANGELOG の扱いは項目の完了条件に従う。
2. 完了条件を 1 項目ずつ確かめ、満たしていれば close する。確かめられない条件が残れば review のまま残し、確かめ方を利用者に示す。

   ```bash
   npx specdojo register close --project <project-id> --id <PJR-XXXX> \
     --conclusion "<結論>" --by specdojo-orchestrator --reason "<対応経路と確かめたこと>" \
     --commit -m "docs(register <PJR-XXXX>): <subject>"
   ```

3. merge を確かめたら、worktree とブランチを片付ける。

   ```bash
   npx specdojo git --project <project-id> -- worktree remove <worktree-base>/feature-<topic>
   npx specdojo git --project <project-id> -- branch -d feature/<project-id>/<topic>
   ```

## してはいけないこと

- 作業ツリー（develop）のブランチを切り替える。
- `git push`、履歴の書き換え、承認のない merge。
- subagent の報告だけで close する。
- 認証情報・秘密鍵・`.env`・`secrets/` を読む。
