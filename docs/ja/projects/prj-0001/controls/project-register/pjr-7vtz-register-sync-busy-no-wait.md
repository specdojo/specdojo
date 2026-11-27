---
specdojo:
  id: prj-0001:pjr-7vtz-register-sync-busy-no-wait
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-27T12:32:07Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-86RK
---

# PJR-7VTZ 専用ブランチが使用中だと、exec のイベントの書き込みが待たずに失敗する

## 1. 課題内容

inRegisterBranchSync が使用中ならすぐ例外を投げるため、register の記帳と重なった exec refresh が worktree の用意の段で失敗し、run が waiting になる

## 2. 入力

- 2026-11-27 の PJR-86RK の 2 回目で、worktree の用意の exec refresh が「Register branch project/prj-0001/register is busy; retry the schedule operation.」で失敗し、run が waiting になった。同じ時刻にオーケストレーターが PJR-G5DY の close を register ... --commit で記帳していた
- エラーは src/shared/register-branch.ts の inRegisterBranchSync が tryAcquirePoolSlot で枠を取れないときに投げる。非同期の inRegisterBranch は CrossProcessMutex で待つ

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/shared/register-branch.ts` の `inRegisterBranchSync` は、専用ブランチの枠が使用中だと待たずに「busy; retry the schedule operation」を投げる。exec のイベントを書く API が同期のため |
| 対応策   | 使用中のときは、上限の時間まで待ってから書く。待ち方（同期のまま待つか、呼び出し側を非同期にするか）は executor が決め、理由を個票の対応結果に書く                                       |
| 依存事項 | なし                                                                                                                                                                                     |
| 完了条件 | 下の一覧のとおり                                                                                                                                                                         |

完了条件:

- 専用ブランチへ exec のイベントを書く操作（`exec refresh`・claim・complete など）は、同期の枠が別の操作（`register ... --commit` など）で使用中でも、すぐ失敗せず、上限の時間まで待ってから書く。
- 上限の時間を超えたら、今と同じく、対象のブランチと待った時間を含むエラーで止まる。上限の既定値と設定の要否は executor が決め、理由を個票の対応結果に書く。
- `exec run --register --worktree` の worktree の用意の段で `exec refresh` が使用中に当たっても、run が waiting にならない。
- 単体テストか統合テストで、枠が使用中の間に書き込みが待ち、解放後に書けること、上限を超えると止まることを確かめている。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.github/`・`.agents/`・`.claude/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
