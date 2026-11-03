---
specdojo:
  id: prj-0001:pjr-w7yx-checkpoint-staged-leftover
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-03T05:23:33Z"
  due_on: "2026-11-07"
  derived_from:
    - PJR-GQN3
  commit_type: fix
  commit_scope: exec
---

# PJR-W7YX checkpoint の commit に失敗しても index に載せたファイルが残る

## 1. 課題内容

exec run の checkpoint の commit が失敗すると、runner が index に載せたファイルが残り、その後の register --commit がそれを巻き込んで commit する。失敗時に外し、register --commit はほかのプロセスが載せたファイルを含めないようにする

## 2. 入力

- 2026-11-03 に track data-flow-uc-rewrite の 3 タスクを exec run --auto --parallel 3 で流したところ、3 タスクとも checkpoint の commit が markdownlint の MD032 で拒否されて始まる前に失敗した（原因は phase の説明で箇条書きの前に空行がなかったこと、72749b20e で修正済み）
- 失敗した checkpoint のあと runner が index に載せた event ファイル 2 件が残り、次のタスクの setup が「Root index has staged checkpoint changes」で失敗した。さらに、その後の register close --commit（PJR-8HCB の decided、244c9f901、push 済み）がその 2 件を巻き込んで commit した
- pm-orchestrator-playbook と配布するオーケストレーターの本文は「commit に失敗したら index に載ったファイルを残さない」としているが、runner がそうなっていない。register --commit は「そのコマンドが変更した個票とイベントだけ」を commit すると説明している（2026-11-03）

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
