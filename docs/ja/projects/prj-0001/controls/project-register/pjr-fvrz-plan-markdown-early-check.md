---
specdojo:
  id: prj-0001:pjr-fvrz-plan-markdown-early-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-03T05:23:56Z"
  due_on: "2026-11-07"
  block_reason: "parent validation failed: lint-ts"
  derived_from:
    - PJR-GQN3
  commit_type: feat
  commit_scope: schedule
---

# PJR-FVRZ phase の説明の Markdown の誤りが実行するまで分からない

## 1. 課題内容

schedule の phase の説明は plan の本文に入るが、Markdown の誤りは exec run の checkpoint の commit で初めて分かる。schedule build か exec plan の時点で plan の Markdown を検査して失敗させる

## 2. 入力

- 2026-11-03 に track data-flow-uc-rewrite の 3 タスクを exec run --auto --parallel 3 で流したところ、3 タスクとも checkpoint の commit が markdownlint の MD032 で拒否されて始まる前に失敗した（原因は phase の説明で箇条書きの前に空行がなかったこと、72749b20e で修正済み）
- exec run --dry-run は plan を作るだけで、checkpoint の commit とその検査までは試さないため、事前に見つけられなかった（2026-11-03）

## 3. 影響範囲

| 観点         | 影響                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| スコープ     | schedule build または exec plan の検査と、schedule の運用ガイドの記述          |
| スケジュール | 今回の原因は直したため、3 タスクの実行はこの修正を待たない                     |
| コスト       | 小さい（plan の Markdown の検査の呼び出し）                                    |
| 品質         | phase の説明の誤りが実行の段で初めて分かり、すべてのタスクが始まる前に失敗する |
| 関係者       | schedule の strategy を書く利用者                                              |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | phase の説明は plan の本文に入るが、schedule build と exec plan は plan の Markdown を検査しない。exec run --dry-run も checkpoint の commit とその検査を試さない                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 対応策   | schedule build（track の生成）か exec plan（plan の生成）の時点で、plan に入る Markdown を markdownlint の規則で検査し、誤りがあれば対象のタスクと行を示して失敗させる。どの時点で検査するかは executor が決め、理由を記録する                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 完了条件 | 箇条書きの前に空行のない phase の説明を持つ strategy で、選んだ時点（schedule build か exec plan）がタスク ID と行を示して失敗することをテストで確かめている。正しい説明では今と同じく成功する。exec run --dry-run でもこの検査が働くかを確かめ、結果を個票の対応結果に記録している。schedule の運用ガイドに検査のことを書いている。作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流し、親の検証（test-integration を含む）が通る。CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。保護された設定（`.specdojo/**`・`package.json` など）は変えず、必要なら案を個票の対応結果と報告の handoff に書く。未決の点は executor が決め、理由を個票の対応結果に記録する |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-gqn3-data-flow-uc-rewrite]]
- [[prj-0001:pm-orchestrator-playbook]]
