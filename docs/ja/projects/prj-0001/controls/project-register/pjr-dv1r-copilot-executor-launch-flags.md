---
specdojo:
  id: prj-0001:pjr-dv1r-copilot-executor-launch-flags
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
