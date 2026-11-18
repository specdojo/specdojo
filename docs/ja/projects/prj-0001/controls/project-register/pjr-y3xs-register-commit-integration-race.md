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
- orchestrator の運用（pm-orchestrator-playbook）: 記帳は register ... --commit で行えば、lifecycle のロックを取るため実行中の run と取り合わない、としている

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
