---
specdojo:
  id: prj-0001:pjr-1hjh-claude-edit-settings-cwd-and-git
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-11-23T00:35:38Z"
  due_on: "2026-11-30"
---

# PJR-1HJH Claude の edit executor の既定の設定に、作業場所を保つ設定と git の読み取り・rm・mv の許可がない

## 1. 課題内容

`repos` でプロダクトリポジトリを宣言した project で、Claude の edit executor（`claude -p --agent claude-executor --settings .specdojo/claude/settings.edit.json`）に `exec run --register --worktree` で項目を流すと、次の 2 つのために executor が完了条件を満たせず、未完了と報告することがある。検査と個票の記入は、オーケストレーターや人が代わりに行うことになる。

1. **`cd` のあと、相対パスの Edit の規則がずれる。** executor が `cd <プロダクトの worktree>` で検査を流すと、Bash の作業場所がそのまま次の呼び出しに引き継がれる。`Edit(**)` や deny の `Edit(.specdojo/**)` などの相対パスの規則は、そのときの作業場所から照合される。そのため、project の worktree の個票への Edit が「Claude requested permissions to write to …, but you haven't granted it yet」で拒まれる。`Edit(/**)` のように `/` から書いても、`cd` のあとは効かなかった。
2. **git の読み取りと、差分に残る削除・移動が許されていない。** 配布の `settings.edit.json`（0.9.2）の allow は、`npm run *`・`npx vitest *` などの検査のコマンドだけで、`git status`・`git diff`・`git log`・`git show`・`git grep`・`git rm`・`git mv` がない。ファイルの削除や名前の変更を求める項目（例: 文書の名前を変える）では、executor が `git mv` を流せない。

利用側では、`settings.edit.json` に次を足すと、`cd` のあとでも作業場所が project の worktree に戻り、個票を書け、git のコマンドが流れた。保護された設定の Edit は拒まれたままだった。

```json
{
  "env": { "CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR": "1" },
  "permissions": {
    "allow": [
      "Bash(git status*)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git show*)",
      "Bash(git grep *)",
      "Bash(git rm *)",
      "Bash(git mv *)"
    ]
  }
}
```

project ごとのコマンド（`python -m pytest *` など）は `exec-defaults.yaml` の `allow_commands` で足せる（PJR-7KQT）。この項目で扱うのは、どの project でも要る既定の部分である。

## 2. 入力

<!-- 対話で得た前提・制約・委任範囲を記録する。完了・回答の判定条件とは分ける。 -->

- 利用側（OpenFisca-Japan の作業の project。`repos` でプロダクトリポジトリを宣言している）で、specdojo 0.9.2 を使って見つけた。
- `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` の効果は、利用側の devcontainer（Linux）の Claude Code で確かめた。
- `Bash(rm *)`・`Bash(node *)`・`Bash(*)` は利用側でも許していない。削除は差分に残る `git rm` に限った。

## 3. 影響範囲

| 観点         | 影響                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| スコープ     | 配布の `templates/claude/settings.edit.json`、exec が claude を起動するときの設定、exec 設定ガイドの provider の節 |
| スケジュール | _TODO_                                                                                                             |
| コスト       | 小さい（設定とテスト、文書）                                                                                       |
| 品質         | executor が検査を流せず、未完了の報告と人の代行が増える。`cd` のずれは許可を広げなくても起こる                     |
| 関係者       | Claude を executor にする利用者                                                                                    |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | Claude Code の Bash の作業場所が `cd` のあとも引き継がれ、相対パスの Edit の規則がその場所から照合される。配布の設定に、作業場所を保つ設定と git の許可がない                                           |
| 対応策   | _UNDECIDED_: `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` を配布の設定に入れるか（runner が起動時に env で渡す形でもよい）。git の読み取り・`git rm`・`git mv` を既定で許すか。決めた理由を対応結果に書く |
| 依存事項 | なし                                                                                                                                                                                                    |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                                                                                            |

- Claude の executor が `cd <プロダクトの worktree>` したあとも、project の worktree の個票を Edit でき、保護された設定の Edit は拒まれる（テストまたは実際の run で確かめる）。
- 既定で許す git のコマンドを決め、許さないもの（`git push`・`git reset --hard`・`git checkout` など）は拒まれる（テストで確かめる）。
- exec 設定ガイドに、作業場所の扱いと、既定で許すコマンドを書く。
- prj-0001 の `.specdojo` の保護された設定は変えない。変える案があれば個票の対応結果と報告の `handoff` に書く。
- 直すのは配布の `templates/claude/settings.edit.json` とその読み込み・テスト・ガイドとする。prj-0001 自身の `.specdojo/claude/settings.edit.json` への反映は、統合の後に利用者の承認のもとでオーケストレーターが feature ブランチで行う。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く（prj-0001 の運用。並べて流したときの統合の衝突を避けるため）。

## 5. 対応結果

### 5.1. 決定

- 作業場所: 配布の `templates/claude/settings.edit.json` の `env` に `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR=1` を入れた。設定に入れれば利用者の起動方法に依らず効き、runner の変更も要らない。
- git: 読み取りの `git status*`・`git diff*`・`git log*`・`git show*`・`git grep *` と、差分に残る `git rm *`・`git mv *` を allow した。
- 削除の限定: `git rm` の `-r`・`-f`・`--force`・`--cached`、`git mv` の `-f`・`--force` を deny した（opencode 側の再帰・強制の拒否と同じ方針）。`git push`・`gh` は従来の deny のまま。`git reset`・`git checkout`・`git commit`・`rm` は allow に無く拒まれる。

### 5.2. 変更

- `templates/claude/settings.edit.json`
- `tests/src/exec/agent-config-allow-commands.test.ts`（env・許可・拒否・保護設定の Edit deny を確認）
- `tests/src/shared/provider-scaffold.test.ts`（deny の完全一致の期待値）
- `docs/ja/specdojo/guides/exec-config-guide.md`（claude の edit executor に許すコマンドの節）

### 5.3. 申し送り

- prj-0001 自身の `.specdojo/claude/settings.edit.json` は変えていない。統合の後に、利用者の承認のもとでオーケストレーターが feature ブランチで同じ `env`・allow・deny を反映する。
- 既存の利用側は `config scaffold --force` で設定を当て直すと反映される。
- `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` の効果は、個票の利用側確認（Linux の devcontainer）に基づく。この run では実機の executor で再確認していない。

### 5.4. CHANGELOG に書く事項

- 区分: Fixed
- 文案: Claude の edit executor の既定の設定に `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` と、git の読み取り・`git rm`・`git mv` の許可を追加した（`git rm -r`・`-f` などは deny）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-7kqt-claude-edit-executor-bash-validation]]
- [[prj-0001:pjr-tm1b-claude-edit-allowlist-too-narrow]]
