---
specdojo:
  id: prj-0001:pjr-y3xs-register-commit-integration-race
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-18T12:03:53Z"
  due_on: "2026-11-30"
---

# PJR-Y3XS register の --commit が実行中の統合を止め、-m を 2 つ付けると commit せずに終わることがある

## 1. 課題内容

register ... --commit の記帳の commit が exec の統合と重なると、統合が staged changes を理由に止まる。また -m を 2 つ付けた close が記帳だけして commit せずに終わる。原因を調べて直す

## 2. 入力

- orchestrator の観測（2026-11-18）: PJR-6998 を register add --commit で起票した commit の途中（commit hook の register-build は 50 秒ほどかかる）に、T-KATA-SLIM-2-utc-catalog-040 の統合が走り、integration failed: Staged changes in integration target（pjr-6998 の個票とイベント）で止まった。統合だけを exec resume でやり直した
- orchestrator の観測（2026-11-18）: register close --commit に -m を 2 つ（2 つ目は複数行の本文）付けた PJR-3VJM・PJR-ANKZ・PJR-QTB6 の close が、記帳は済んだのに commit されず、出力の最後の行は 'Co-Authored-By… -- 2 paths)' だった。どれも specdojo git -- commit で手で commit した。-m を 1 つだけ付けた register add --commit は commit できた
- orchestrator の観測（2026-11-18・2026-11-19）: 個票とイベントを specdojo git -- add と commit（パスを指定）で commit した後に、イベントの YAML（pjr-5ctm・pjr-p318・pjr-y3xs・pjr-x21w・pjr-ygzf・pjr-a5fy など）が index に残ることが繰り返しあった。commit の hook（lint-staged の整形）が整形したファイルを index へ戻しているとみられる。残った index は次の統合を staged changes で止めるため、commit のたびに git diff --cached を確かめて外している
- orchestrator の運用（pm-orchestrator-playbook）: 記帳は register ... --commit で行えば、lifecycle のロックを取るため実行中の run と取り合わない、としている

## 3. 影響範囲

| 観点         | 影響                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| スコープ     | `register ... --commit` の commit、記帳の commit と exec の統合の取り合い、commit の hook が index に残すファイル |
| スケジュール | 統合が止まると、その run を `exec resume` でやり直すまで後の run が進まない                                       |
| コスト       | orchestrator が commit のたびに index を確かめ、手で commit し直す手間がかかる                                    |
| 品質         | 記帳したのに commit されない状態に気づかないと、登録簿の状態と履歴が食い違う                                      |
| 関係者       | ARC・DEV（register と統合の修正）、オーケストレーター（記帳）                                                     |

## 4. 対応方針

| 項目     | 内容                                                                 |
| -------- | -------------------------------------------------------------------- |
| 原因     | _UNDECIDED_: executor が調べ、個票の対応結果に書く                   |
| 対応策   | 下の完了条件のとおり、3 つの現象をそれぞれ再現するテストを足して直す |
| 依存事項 | なし                                                                 |
| 完了条件 | 下の「完了条件」を満たす                                             |

完了条件:

- 3 つの現象（記帳の commit の途中の統合が staged changes で止まる、`-m` を 2 つ付けた `register close --commit` が commit せずに終わる、commit の後に hook の整形したファイルが index に残る）の原因を調べ、個票の対応結果に書く。
- `register ... --commit` は、`-m` を 1 つ付けた場合も複数付けた場合（本文を含む）も、そのコマンドが変えた個票とイベントだけを commit する。commit できなかった場合は、理由を示して 0 以外で終わる。
- 記帳の commit の途中に exec の統合が始まっても、統合が記帳の staged のファイルを理由に失敗しない（記帳の commit が終わるのを待つ、または記帳のファイルを統合の対象から外す）。どちらにするかは executor が決め、理由を個票の対応結果に書く。
- `register ... --commit` と `specdojo git -- commit` の後に、そのコマンドが stage したファイルが index に残らない。
- 上の 3 点を確かめるテストがある（実 Git が要るものは統合テスト）。
- 保護された設定（`lefthook.yml`・`package.json` など）の変更が要る場合は、案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証（test-integration）を通す。
- `CHANGELOG.md` は変えず、個票の対応結果の `### <n>.<m>. CHANGELOG に書く事項`（Markdown の連番ルールに従う）に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ「なし」と書く。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pm-orchestrator-playbook]]（記帳は `register ... --commit` で行う運用）
