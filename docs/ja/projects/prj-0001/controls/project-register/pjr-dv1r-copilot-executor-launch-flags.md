---
specdojo:
  id: prj-0001:pjr-dv1r-copilot-executor-launch-flags
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-11-28T09:56:16Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GDMB
---

# PJR-DV1R Copilot の executor の起動の設定が今の CLI に合わず、起動と拒否の指定が効かないおそれがある

## 1. 課題内容

exec-defaults の Copilot の command_template が、今の Copilot CLI でなくなった --no-remote・--no-remote-export を渡すため起動で失敗する。--deny-tool 'shell(git push)' など末尾に :* のない拒否は、引数付きのコマンドに当たらないおそれがある

## 2. 入力

- 2026-11-28 の GDMB の executor の確認で、copilot -p に雛形の引数を渡すと「error: --no-remote was removed. Use /remote off in a session; manage incoming connections in /environments.」で終了コード 1 になった
- 同じ確認で、--deny-tool 'shell(specdojo guarded-push)' は引数付きの specdojo guarded-push … を拒まず、'shell(specdojo `guarded-push:*)'` にすると拒んだ。既存の shell(git push)・shell(git add)・shell(git commit)・shell(git reset) にも `:*` がない
- executor の雛形は git push を許していないため、--no-ask-user の起動では今も拒まれるはずだが、拒否の指定そのものが効いているかは確かめていない
- indie が推奨どおりの起票を指示した（2026-11-28）。担当と期限は未定

## 3. 影響範囲

| 観点         | 影響                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------- |
| スコープ     | Copilot の executor の起動の雛形（`.specdojo/exec-defaults.yaml`・`templates/`）と、その説明の文書 |
| スケジュール | Copilot を executor に指定した run が起動の時点で失敗し、ほかの agent への付け替えが要る           |
| コスト       | 失敗した run のやり直し                                                                            |
| 品質         | 拒否の指定が効かないと、executor の権限の境界が想定より広くなる                                    |
| 関係者       | DEV（実装）、オーケストレーター（agent の選び方と保護された設定の反映）                            |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | Copilot CLI の更新で `--no-remote`・`--no-remote-export` がなくなった。`shell(<command>)` の拒否は、末尾の `:*` がないと引数付きのコマンドに当たらない |
| 対応策   | 起動の雛形から廃止された引数を外し、代わりの手段があれば使う。拒否の指定を引数付きのコマンドにも当たる形にそろえる                                     |
| 依存事項 | なし                                                                                                                                                   |
| 完了条件 | 下の一覧のとおり                                                                                                                                       |

- 配布原本の Copilot の起動の雛形（`templates/init-exec-defaults.yaml` と `templates/copilot/exec-defaults-snippet.yaml`）から `--no-remote` と `--no-remote-export` を外す。remote の接続を断つ代わりの起動引数が今の Copilot CLI（`copilot --help`）にあれば使い、なければ外したことと理由を個票の対応結果に書く。
- 同じ雛形の `--deny-tool 'shell(<command>)'` を、引数付きのコマンドにも当たる形（末尾に `:*`）にそろえる。`--allow-tool` の指定も、意図どおりに引数付きのコマンドを許すかを確かめ、必要ならそろえる。
- Copilot の起動の雛形を検査する単体テスト（あれば）を新しい形に合わせる。
- `.specdojo/exec-defaults.yaml` などの保護された設定は変えない。同じ変更の案を個票の対応結果と報告の `handoff` に書く。反映はオーケストレーターが利用者の承認のもとで行う。
- Copilot の説明の文書（`templates/copilot/README.md` と exec の設定のガイドの Copilot の段落）に、起動の引数の記述があれば合わせて直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run -s lint:md` を通し、親の検証を通す。
- 統合の後に、オーケストレーターが直した雛形で `copilot -p` を起動し、起動できること、`git push` と `specdojo guarded-push` が拒まれることを確かめてから close する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 5. 対応結果

### 5.1. 実装と判断

- 配布原本の `templates/init-exec-defaults.yaml` と `templates/copilot/exec-defaults-snippet.yaml` の Copilot の `command_template` から `--no-remote` と `--no-remote-export` を外し、`--sync-session=off` を足した。
- 引数の根拠は Copilot CLI のコマンドリファレンス（<https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference>）である。`--no-remote` は「Removed. Use `/remote off` during an interactive session」、`--no-remote-export` は「Renamed to `--sync-session=off`」とある。`--remote` は `-p` の起動に使えないため、遠隔操作を断つ起動引数は置かなかった。sandbox から `copilot --help` は実行できなかった（承認が要る）ため、確認はリファレンスによる。
- 同じ雛形の `--allow-tool 'shell(...)'` と `--deny-tool 'shell(...)'` を、素の形と `:*` 付きの形を並べる形にそろえた。リファレンスでは `:*` は「the command stem followed by a space」に当たるとあり、引数のない素のコマンド（例: `git push`）に当たるかは書かれていない。素の `git push` を拒み損ねないよう、`:*` だけに置き換えず両方を書くと決めた。
- `--allow-tool` も同じ理由で両方の形にした。末尾に `:*` のない `shell(npm run)` は `npm run lint:md` などの引数付きのコマンドを許していなかったおそれがある。`shell(specdojo:*)` は素の `specdojo` を許す必要がないため据え置いた。
- `specdojo guarded-push` と `npx specdojo guarded-push` の拒否にも、素の形を足した。
- 雛形の引数を検査する単体テストはなかった（`tests/` を `no-remote`・`shell(git` で検索）。テストの変更はない。
- 説明の文書は、exec の設定のガイド（Copilot の段落の雛形と箇条書き）と `templates/copilot/README.md` のカスタマイズの章を直した。
- `.specdojo/exec-defaults.yaml` は保護された設定のため変えていない。製品設計の [[sysd-github-copilot-agent-settings|GitHub Copilot エージェント設定]] にも同じ引数の記述が残っているが、完了条件に挙がっていないため直していない。

### 5.2. 保護設定の変更案（未反映）

`.specdojo/exec-defaults.yaml` の `providers.copilot.command_template` を、`--model auto` を残したまま次の形にする。反映はオーケストレーターが利用者の承認のもとで行う。

```yaml
command_template: >-
  copilot -p "$(cat)" --no-color --no-ask-user --model auto
  --sync-session=off --disable-builtin-mcps
  --allow-tool write
  --allow-tool 'shell(git status)' --allow-tool 'shell(git status:*)'
  --allow-tool 'shell(git diff)' --allow-tool 'shell(git diff:*)'
  --allow-tool 'shell(git log)' --allow-tool 'shell(git log:*)'
  --allow-tool 'shell(git show)' --allow-tool 'shell(git show:*)'
  --allow-tool 'shell(npm run)' --allow-tool 'shell(npm run:*)'
  --allow-tool 'shell(npm test)' --allow-tool 'shell(npm test:*)'
  --allow-tool 'shell(specdojo:*)'
  --deny-tool 'shell(git add)' --deny-tool 'shell(git add:*)'
  --deny-tool 'shell(git commit)' --deny-tool 'shell(git commit:*)'
  --deny-tool 'shell(git push)' --deny-tool 'shell(git push:*)'
  --deny-tool 'shell(git reset)' --deny-tool 'shell(git reset:*)'
  --deny-tool 'shell(specdojo guarded-push)' --deny-tool 'shell(specdojo guarded-push:*)'
  --deny-tool 'shell(npx specdojo guarded-push)' --deny-tool 'shell(npx specdojo guarded-push:*)'
```

### 5.3. 検証結果

- 2 つの雛形を YAML として読み、展開した `command_template` に `--no-remote` が含まれず、上の引数が並ぶことを確かめた。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run -s lint:md` などは親 runner が実行する。
- 未了: 統合の後に、オーケストレーターが直した雛形で `copilot -p` を起動し、起動できること、`git push`（素の形と引数付きの形）と `specdojo guarded-push` が拒まれること、`npm run lint:md` などの引数付きの検証が許されることを確かめてから close する。実機の起動は premium request を使うため、executor では行っていない。

### 5.4. CHANGELOG に書く事項

- 区分: Fixed
- 行の文案: Copilot の executor の起動の雛形から、今の Copilot CLI で廃止された `--no-remote`・`--no-remote-export` を外し、`--sync-session=off` に置き換えました。`shell(...)` の許可と拒否は、素の形と `:*` 付きの形を並べ、引数付きのコマンドにも当たるようにしました。既存の `.specdojo/exec-defaults.yaml` は手で同じ形に直してください。

## 6. 関連ドキュメント

- [[prj-0001:pjr-gdmb-guarded-push-entry|PJR-GDMB guarded-push の入口]]
- [[specdojo:exec-config-guide|exec 設定ガイド]]
- [[sysd-github-copilot-agent-settings|GitHub Copilot エージェント設定]]
