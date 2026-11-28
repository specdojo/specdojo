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
  registered_at: "2026-11-28T09:56:16Z"
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

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

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
