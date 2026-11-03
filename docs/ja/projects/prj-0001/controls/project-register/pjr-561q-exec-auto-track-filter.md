---
specdojo:
  id: prj-0001:pjr-561q-exec-auto-track-filter
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-03T05:23:03Z"
  due_on: "2026-11-07"
  block_reason: "parent validation failed: lint-ts"
  derived_from:
    - PJR-GQN3
  commit_type: feat
  commit_scope: exec
---

# PJR-561Q exec run --auto で選ぶタスクを track で絞れない

## 1. 課題内容

exec run --auto は対象のタスクが失敗すると、ほかの track の ready のタスクへ進む。--track で選ぶタスクを 1 つの track に限れるようにする

## 2. 入力

- 2026-11-03 に track data-flow-uc-rewrite の 3 タスクを exec run --auto --parallel 3 で流したところ、3 タスクとも checkpoint の commit が markdownlint の MD032 で拒否されて始まる前に失敗した（原因は phase の説明で箇条書きの前に空行がなかったこと、72749b20e で修正済み）
- その後 --auto が launch の track の review タスク 3 件（T-LAUNCH-pm-communication-plan-105・pm-members-105・pm-organization-105）を claim し、worktree を作って agent を動かし始めた。オーケストレーターが止めて claim を release した（628f502e3）。execution: human のタスク 8 件は自動で飛ばされた
- 利用者は、この不具合を直してから 3 タスクを並列で流すと判断した。直し方の案は exec run --auto に --track `<track>` を足し、選ぶタスクをその track に限る形（2026-11-03）

## 3. 影響範囲

| 観点         | 影響                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| スコープ     | exec run --auto の選択と、command-reference・exec の運用ガイドの記述                |
| スケジュール | track data-flow-uc-rewrite の 3 タスク（epic PJR-GQN3）の並列の実行がこの修正を待つ |
| コスト       | 小さい（選択の絞り込みと引数の追加）                                                |
| 品質         | --auto が利用者の意図しないタスクに agent を動かし、利用枠と成果物の状態を乱す      |
| 関係者       | exec run --auto を使う利用者、夜間の実行                                            |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | --auto はすべての track の ready のタスクから戦略（critical-first / fifo）で選び、選んだタスクが失敗すると次の ready のタスクへ進む。選ぶ範囲を限る指定がない                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 対応策   | exec run --auto に --track <track> を足し（繰り返し指定できるかは executor が決める）、選ぶタスクを指定した track に限る。--parallel・--loop・--dry-run と組み合わせて使えるようにする                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 完了条件 | exec run --auto --track <track> で、指定した track 以外のタスクが選ばれない（--dry-run と実際の選択の両方）。対象のタスクが失敗しても、ほかの track のタスクへ進まないことを単体または統合のテストで確かめている。存在しない track を指定したときは、claim の前にエラーで止まる。--track なしの動きは今と変えない。command-reference と exec の運用ガイドに --track を書いている。作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流し、親の検証（test-integration を含む）が通る。CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。保護された設定（`.specdojo/**`・`package.json` など）は変えず、必要なら案を個票の対応結果と報告の handoff に書く。未決の点は executor が決め、理由を個票の対応結果に記録する |

## 5. 対応結果

### 実施内容

- `exec run --auto --track <track>` を追加し、タスク準備（agent 解決・claim・worktree 作成）の前に候補を絞る。`--parallel`・`--loop`・`--dry-run` に同じ制限を適用し、準備失敗後や loop の再選択でも指定外の track に進まない。
- schedule index にある track 名で存在確認し、存在しない指定は claim 前にエラーとする。Ready がない既存 track は正常終了する。track を省略した場合は従来の選択順・範囲を保つ。
- track の所属は `schedule_file` から判定する。タスク ID の分割に依存しないため、`data-flow-uc-rewrite` のようなハイフンを含む track 名や任意のタスク ID を扱える。
- `tests/src/exec/run/track-filter.test.ts` に、dry-run／実行時の選択、並列上限、FIFO、準備失敗後、実行失敗後の loop 再選択、不明な track、Ready のない既存 track、省略時の互換性、`--auto` なしの引数拒否の回帰テストを追加した。
- [[specdojo:command-reference|コマンドリファレンス]]・[[specdojo:exec-operation-guide|exec運用ガイド]]・[[specdojo:schedule-operation-guide|Schedule実行運用ガイド]] に指定方法と挙動を追記し、CHANGELOG の Unreleased に記録した。

### 判断と確認

- `--track` は 1 回の実行範囲を 1 つの track に限る用途として単一値にした。複数 track の指定は本件の目的に不要であり、既存の schedule の track 名を大文字・小文字を区別して扱う。`--auto` 以外では指定を拒否し、手動ターゲットに無効な指定が残らないようにした。
- Ready の計算と依存関係はプロジェクト全体のままにし、戦略の順序を保って選択候補だけを絞る。対象外の依存タスクを自動的に起動することはない。
- Prettier 整形、`node --import tsx tools/catalog-validate-if-configured.mjs`、`node --import tsx src/specdojo.ts register build`、`git diff --check` は成功した。カタログ検証は未作成文書の `based_on` 検証に関する警告があるが、終了コードは 0 だった。`typecheck`・`lint-ts`・`test-unit`・`test-integration` を含む指定の親検証は、本 executor 内で重複実行せず、終了後に親 runner が実行する。追加テストの成否も親の `test-unit` で確定する。
- 保護された設定、登録簿の一覧・ステータス、result は編集していない。保護設定の変更提案および未決事項はない。

### 申し送り

- 親 runner は型検査・lint・単体／統合テストを含む親検証の成功を確認し、reporter は変更内容と検証結果を result に反映する。
- [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]] の 5.1 に従い、統合後の close 前にオーケストレーターが PJR-JSEY に本件を含めて動作確認する。実 agent CLI を起動する確認は executor sandbox の外で行う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-gqn3-data-flow-uc-rewrite]]
- [[prj-0001:pm-orchestrator-playbook]]
