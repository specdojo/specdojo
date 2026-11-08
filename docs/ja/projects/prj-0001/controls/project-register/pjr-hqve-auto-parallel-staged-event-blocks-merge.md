---
specdojo:
  id: prj-0001:pjr-hqve-auto-parallel-staged-event-blocks-merge
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  registered_at: "2026-11-05T15:55:21Z"
  derived_from:
    - PJR-3APD
---

# PJR-HQVE schedule の --auto --parallel の統合が、index に残った記録のファイルで止まる

## 1. 課題内容

stsd-pilot の schedule を --auto --parallel 2 で流している間に、block の event ファイルが commit されずに index に載ったまま残り、別のタスクの統合の git merge が「local changes would be overwritten」で止まった。原因を調べ、統合が止まらないようにする

## 2. 入力

- 2026-11-05 13:07 に T-STSD-PILOT-stsd-register-entry-070 が block され、その block の event ファイルが index に追加（A）されたまま残った。13:14 の T-STSD-PILOT-stsd-routine-run-070 の統合の git merge が、このファイルを理由に止まった（integrate.log）。index から外すと統合できた
- 同じ時間帯に orchestrator が register add --commit を続けて実行していた（10 件の起票）。そのうち 1 件は利用者の中断で commit の前に止まり、自分の 2 ファイルを index に載せたまま残した。どちらが block の event を index に載せたかは確かめていない
- schedule の --auto で流したタスクの claim・complete・block の event は、統合の後も作業ツリーに untracked のまま残り、orchestrator が手で commit している（exec(schedule): ... を記録する）

## 3. 影響範囲

| 観点         | 影響                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| スコープ     | schedule の `--auto --parallel` と register の `--commit` を同じ時間帯に使うと、統合の `git merge` が止まる |
| スケジュール | 止まった run は人が index から外すまで統合されず、業務仕様の代表を schedule で並べて流す前に直す必要がある  |
| コスト       | 止まるたびに、原因のファイルを探して index から外し、`--resume` する手間がかかる                            |
| 品質         | index に残ったファイルが、無関係な commit に混ざるおそれがある                                              |
| 関係者       | runner を使う orchestrator と利用者                                                                         |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | _TODO_: schedule の block の記帳と、中断した `register add --commit` のどちらが event のファイルを index に残したかは未確認。executor が特定して記録する |
| 対応策   | 3 章の完了条件のとおり、index に残す処理を直し、統合が無関係な index の変更で止まらないか、止まる場合は対象と直し方を示す                                |
| 依存事項 | runner の変更のため、統合の後に JSEY の手順で実際の `exec run --register` を 1 回流して確かめる                                                          |
| 完了条件 | 下の一覧のとおり                                                                                                                                         |

完了条件:

- どの処理が event のファイルを index に残したかを、コードと再現で特定し、個票の対応結果に書いている。特定できない場合はその理由を書いている。pipeline では報告の `handoff` にも書く。
- 統合の前に、統合と関係のない index の変更があっても merge が止まらない。または、止まる場合は対象のファイルと直し方を示すメッセージで止まる。どちらにするかは executor が決め、理由を個票の対応結果と報告の `handoff` に書いている。
- index にファイルを残した処理が、失敗したときや中断されたときに、自分が stage したファイルを index から外す。
- 上の 2 つを再現する統合テストを足している。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証 `test-integration` も通る。
- CHANGELOG は未公開の版の節にだけ書き、公開済みの版の節を変えていない。
- schedule の `--auto` の event が統合の後も untracked で残る件は、この項目の範囲の外とする。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
