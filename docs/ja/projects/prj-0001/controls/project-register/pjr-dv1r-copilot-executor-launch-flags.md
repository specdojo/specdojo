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

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
