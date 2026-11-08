---
specdojo:
  id: prj-0001:pjr-wq80-non-register-commit-run-ordering
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: low
  registered_at: "2026-11-08T14:03:44Z"
  derived_from:
    - PJR-HQVE
---

# PJR-WQ80 記帳以外の commit と統合が、統合中の exec run と順番を取れない

## 1. 課題内容

register --commit は登録簿の lifecycle のロックを取るが、個票の本文の普通の commit や feature ブランチの統合には順番を取る仕組みがなく、統合中の exec run と index を取り合う。直し方を決めて解消する

## 2. 入力

- 2026-11-08、PJR-2SRR の個票の commit が統合中の run の .git/index.lock に当たって失敗した。orchestrator は、run のログの終わりの行と .git/index.lock がなくなるのをシェルで待つ処理を書いて避けている。
- commit が index にファイルを残すと、次の run の checkpoint が止まるおそれがある（PJR-HQVE と同じ種類）。
- 直し方の案: (1) register lifecycle と同じロックを普通の commit からも取れるコマンド、(2) commit の hook で統合中の run を検出して待つ、(3) feature ブランチの統合を CLI のコマンドにする。どれにするかは未決。
- issue として起票する（indie が決定、2026-11-08）。直し方が決まった後の作業は、この issue から --from で todo を起票する。

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
