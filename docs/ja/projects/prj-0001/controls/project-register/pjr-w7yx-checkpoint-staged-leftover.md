---
specdojo:
  id: prj-0001:pjr-w7yx-checkpoint-staged-leftover
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-03T05:23:33Z"
  due_on: "2026-11-07"
  derived_from:
    - PJR-GQN3
  depends_on:
    - PJR-561Q
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

| 観点         | 影響                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| スコープ     | exec run の checkpoint の commit の失敗時の後始末と、register --commit の commit の対象 |
| スケジュール | track data-flow-uc-rewrite の 3 タスク（epic PJR-GQN3）の並列の実行がこの修正を待つ     |
| コスト       | 中くらい（失敗時の index の扱いと、commit の対象の絞り込み）                            |
| 品質         | 失敗のあとに次のタスクの setup が失敗し、別の記帳の commit に関係のないファイルが混ざる |
| 関係者       | exec run と register --commit を同時に使う利用者、夜間の実行                            |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | checkpoint の commit が失敗したとき、runner が index に載せたファイルを外さない。register --commit が commit するとき、index にすでに載っているほかのファイルも含まれる                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 対応策   | checkpoint の commit が失敗したら、runner は自分が index に載せたファイルだけを外す（作業ツリーのファイルは消さない）。register --commit は、そのコマンドが変更した個票・event・生成物だけを commit し、ほかのプロセスが index に載せたファイルは含めない（含まれるおそれがあるときは commit の前に止まるかを executor が決める）                                                                                                                                                                                                                                                                                                                                |
| 依存事項 | PJR-561Q と同じ runner のコードに触れるため、PJR-561Q の統合のあとに流す                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 完了条件 | checkpoint の commit が失敗したあと、index に runner の載せたファイルが残らないことを統合のテストで確かめている。index にほかのファイルが載った状態で register --commit を実行しても、そのファイルが commit に含まれないこと（または commit の前に止まること）をテストで確かめている。作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流し、親の検証（test-integration を含む）が通る。CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。保護された設定（`.specdojo/**`・`package.json` など）は変えず、必要なら案を個票の対応結果と報告の handoff に書く。未決の点は executor が決め、理由を個票の対応結果に記録する |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-gqn3-data-flow-uc-rewrite]]
- [[prj-0001:pm-orchestrator-playbook]]
