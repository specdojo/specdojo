---
specdojo:
  id: prj-0001:pjr-fvrz-plan-markdown-early-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-03T05:23:56Z"
  due_on: "2026-11-07"
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

- 検査時点は `exec plan` の共通生成処理に決定した。phase の説明だけでなく、template・共通規約も展開した plan 全体と、その生成内容の行番号を検査でき、`exec run --auto` とも同じ処理を共有できるためである。`schedule build` の検査は追加しない。
- `src/exec/plan-markdownlint.ts` を追加し、schedule task の plan を Prettier 整形・書き込みより前に markdownlint API で検査する。違反時はタスク ID・plan のパス・生成内容の行番号・規則名を表示して失敗し、既存 plan は保持する。履歴が ignore の対象でも生成時は検査する。
- 利用側の markdownlint を優先し、SpecDojo 側のインストールへフォールバックする。利用側の設定（JSONC・JSON・YAML・上位を含む `.markdownlintrc` と `extends`）を読み、設定がなければ既存の SpecDojo 標準規則を使う。検査の省略を防ぐため、markdownlint が使えない場合や設定が壊れている場合も生成を停止する方針に決定した。利用側での `markdownlint-cli` の導入を運用ガイドに明記した。CLI2 固有設定と hook の独自ルールは対象外である。
- strategy から track を生成する fixture と、edit／review の MD032 検出・正常生成・既存 plan 保持、`exec run --auto --dry-run` の正常／異常系の回帰テストを追加した。設定なし・規則無効化・JSONC の `extends`・`.markdownlintrc`・不正設定の単体テストも追加した。
- sandbox 内のスモーク検証では、strategy から生成した edit／review plan の各正常／異常系と、auto dry-run の共通処理の正常／異常系の計 6 ケースが成功した。空行不足は `T-TEST-doc-010`・plan の 21 行目・MD032 を示して停止し、正しい説明は成功した。auto dry-run でも同じ違反を検出し、claim event と agent 起動が発生しないことを確認した。CLI の validate／refresh 子プロセスを含む全経路は親の integration テストで検証する。
- `exec run --task <task-id> --dry-run` は plan を生成しないため検査しない。schedule task を事前検査する場合は `exec plan --task <task-id>`、auto の動作確認には `exec run --auto --dry-run` を使う。この違いを [[specdojo:schedule-operation-guide|Schedule実行運用ガイド]] に記載した。
- 設定読み込みのスモーク検証 5 ケース（標準規則・規則無効化・JSONC と `extends`・`.markdownlintrc`・不正設定時の停止）も成功した。変更ファイルの Prettier 整形・整形確認、`git diff --check`、`npm run check:src-imports`、`register build`、hook と同じカタログ検証が成功した。カタログ検証には、宣言された product 文書がこの worktree にないことによる既存の警告があるが、エラーはない。
- `CHANGELOG.md` は `Unreleased` の不具合修正に追記した。保護された設定の変更は不要であり、変更していない。個票のステータスと登録簿の一覧行は変更していない。
- `typecheck`・`lint:ts`・`test:unit`・`test:integration` を含む設定済みの親検証は、pipeline の規定に従って executor 内では実行せず、終了後の親 runner に委ねる。result は reporter が作成する。
- 再開時に、前回の親検証 `lint:ts` のエラーが `src/exec/plan-markdownlint.ts` の `typeof import(...)` に対する `@typescript-eslint/consistent-type-imports` 違反であることを確認し、型専用の namespace import と `typeof` に置き換えた。検査の実行時の動作は維持する。再開後も変更ファイルの Prettier 整形、`git diff --check`、`npm run check:src-imports`、`register build`、hook と同じカタログ検証が成功した。親検証の再実行結果は runner が記録する。
- 統合後は [[prj-0001:pm-orchestrator-playbook|prj-0001 のオーケストレーター運用メモ]] の手順に従い、PJR-JSEY で runner の動作を確認してから close する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-gqn3-data-flow-uc-rewrite]]
- [[prj-0001:pm-orchestrator-playbook]]
