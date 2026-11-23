---
specdojo:
  id: prj-0001:pjr-tahv-auto-loop-deferred
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T22:24:39Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: exec
---

# PJR-TAHV exec run --auto --loop が、一度後回しにしたタスクをプロセスが終わるまで選ばない

## 1. 課題内容

- 2026-11-23 の kata の一括実行（列 `kata-blitz-2026-11-23`）で、第 4 波と第 6 波の project の track が、着手できる todo が残っているのに選ばれなくなった。
- runner の PID を止め、列 `kata-blitz-2-2026-11-23` として起動し直すと、同じタスクが選ばれて進んだ。loop は、一度後回し（変更範囲の待ちや busy など）にしたタスクを、プロセスが終わるまで候補から外している。

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- 2026-11-23〜24 の kata の一括実行（第 4〜6 波）で詰まった所から起票した

## 3. 影響範囲

- 長時間の一括実行が、見かけ上は動いたまま進まなくなる。
- 人が気づいて起動し直すまで、残りのタスクが流れない。

## 4. 対応方針

- 後回しにしたタスクを、後回しの理由が解けた次の回で候補に戻す。戻す条件（変更範囲の予約の解除、先行タスクの完了など）を個票の対応結果に書く。
- 単体テストで、1 回目に後回しにしたタスクが、理由が解けた 2 回目に選ばれることを確かめる。
- 後回しの理由と回数を、loop の各回の出力に出す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- 関連: PJR-YQ32（準備の段で失敗した run の変更範囲の予約）、PJR-C11R（register の run の変更範囲）。
