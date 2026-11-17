---
specdojo:
  id: prj-0001:pjr-zk3t-flaky-reporter-resume-e2e
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-11-17T13:24:01Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-8NB8
  commit_type: test
  commit_scope: exec
---

# PJR-ZK3T pipeline-e2e の reporter の再開のテストが、時々 reporter を 1 回多く呼んで落ちる

## 1. 課題内容

tests/src/exec/pipeline-e2e.integration.test.ts の reporter の再開のテストが偶然で落ち、並べて流した run の親の検証（test-integration）を止める

## 2. 入力

- 2026-11-17 の PJR-8NB8 の 2 回目の親の検証で、「executor / reporter pipeline resume E2E (worktree) > blocks non-target changes after reporter resume and resumes only integration after review」が落ちた。期待した agent の呼び出しは 3 件だが、4 件目として local-gemma-reporter（gemma3-12b、role reporter）が呼ばれていた。時間切れではなかった（timed out: no、テストは約 6.7 秒）
- orchestrator が同じテストだけを手元で流し直すと、8NB8 の worktree では 6 回中 5 回、develop では 5 回中 5 回通った。8NB8 の変更（exec smoke の登録と、register の関数を失敗時に例外で止める形にしたこと）は reporter の再試行に関わらないため、偶然の失敗と判断して --resume で親の検証を流し直した
- 親の検証が落ちると、その項目の変更範囲の予約が残り、範囲が重なると判定された後続の項目も止まる（PJR-9JN6）。偶然の失敗でも、並べて流した複数の run が止まる

## 3. 影響範囲

| 観点         | 影響                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `tests/src/exec/pipeline-e2e.integration.test.ts` の reporter の再開のテストと、原因が runner にある場合は reporter の選択・再試行の処理 |
| スケジュール | 偶然の失敗のたびに親の検証が止まり、`--resume` での流し直しが要る                                                                        |
| コスト       | 流し直しの間、run が長くなる。agent の利用枠の追加の消費は小さい                                                                         |
| 品質         | 偶然の失敗と本当の失敗を見分けにくくなる。runner が実際に余分な reporter を呼んでいる場合は、実際の run にも影響する                     |
| 関係者       | exec run を流す orchestrator と利用者、runner の保守者                                                                                   |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | まだ特定していない。候補は、テストの中の agent の選び方が時刻や順番で変わること、前の試行の状態が残って reporter の失敗と見なされ、代わりの reporter が呼ばれること                                                                                                                                                                                                                                                                                                       |
| 対応策   | テストを繰り返し流して失敗を再現し、4 回目の reporter の呼び出しが起きる条件を突き止める。原因をテストか runner の側で直し、結果が毎回同じになるようにする。runner が時々余分に reporter を呼ぶ場合は、実際の run にも影響するため runner を直す                                                                                                                                                                                                                          |
| 依存事項 | reporter の代わりの agent の選択（`--fallback-reporter-by`・名簿の自動選択）と、reporter の段からの再開の処理                                                                                                                                                                                                                                                                                                                                                             |
| 完了条件 | 原因と再現の条件を個票の対応結果に書いている。このテストだけを 20 回続けて流してすべて通る。同じファイルのほかのテストも通る。保護された設定は変えず、変更が要る場合は変更案を個票の対応結果と報告の `handoff` に書く。迷った点は executor が決めて理由を個票の対応結果に書く。`CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」に文案を書く（PJR-EPQ3）。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る |

## 5. 対応結果

### 5.1. 原因と再現条件

`exec` イベントの時刻は秒単位であり、同種・同時刻・同一 actor のイベントはファイル名の乱数部分で順序が決まっていた。reporter の失敗による `block`、reporter 再開の `unblock`、対象外変更による統合失敗の `block` が同じ秒に入り、統合の `block` のパスが先に並ぶと、再生順序が「統合停止 → reporter 再開 → reporter 停止」になった。最終状態の `pipeline_stage` が `reporter` に戻るため、次の再開で成功済み reporter を余分に呼んでいた。agent の選択や fallback の問題ではない。

PJR-8NB8 の保存ログでは、余分な呼び出しは最後の統合再開後の呼び出し一覧の比較で発生していた。同秒のイベントと逆順のパスを固定した再現用スクリプトでも、修正前は最終段階が `reporter` となり、`integrate` を期待する検査が失敗した。

### 5.2. 作業内容と検証

| 作業                             | 状態 | 実績・メモ                                                                                                                                                                                                                                |
| -------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因の特定・再現                 | done | 秒単位のイベント再生と乱数順の組み合わせで再現した。                                                                                                                                                                                      |
| runner の修正                    | done | `src/exec/events.ts` で、`pipeline_stage` と `pipeline_state_ref` が一致する停止・再開を対応づける。再開対象の停止を先に再生し、複数の再開は直前の停止に対応するものを優先する。                                                          |
| 回帰テスト・仕様                 | done | `events.test.ts` に両方のパス順と停止・再開・完了の6条件を追加。対象 E2E に最初の呼び出し数と統合停止が最後に再生されることの検査を追加。[[prj-0001:stsd-task-execution\|状態遷移仕様（タスク実行）]] に再生順序を反映した。              |
| 決定的な再現条件での確認         | done | 修正後に再現用スクリプトの6条件を20回ずつ実行し、120件すべて成功した。対象 E2E 自体の20回実行とは別の確認である。一時スクリプトは確認後に削除済み。                                                                                       |
| sandbox 内の成果物検査           | done | Prettier、変更文書の markdownlint、`register build`、catalog 検証、`npm run validate:history-links`、`git diff --check` が成功。catalog は既存の参照に対する警告のみ。`tsx` CLI は IPC の `EPERM` のため `node --import tsx` で実行した。 |
| 対象 E2E の20回連続実行          | open | executor 指示で親検証 `test-integration` の対象限定版も sandbox 内では実行禁止。ホスト側で対象テストを20回続けて実行し、すべて成功したことを result に追記する必要がある。                                                                |
| 同じファイルの全テスト・共通検査 | open | `test-integration`、`typecheck`、`lint-ts`、`test-unit`、`lint-md` などは親 runner が実行する。executor の重複実行は禁止されているため、親検証の結果を result に反映して完了条件と照合する。                                              |

### 5.3. 判断・申し送り

- 実際の run にも同じ再生順序の問題が起こるため、待機時間や期待呼び出し数を変えず、イベントを読む runner 側を修正した。既存イベントを変更せず、既存のメタデータから停止と再開を対応づける。両項目を持たないイベントの順序は従来どおりとした。
- 保護された設定の変更は不要。登録簿の一覧・個票のステータス・result・`CHANGELOG.md` は編集しない。
- ホスト側の20回確認は、`npm run test:integration -- tests/src/exec/pipeline-e2e.integration.test.ts -t 'blocks non-target changes after reporter resume and resumes only integration after review'` を途中の失敗を無視せず20回続けて実行する。ファイル内のほかのテストは親 runner の全件検証で確認する。
- runner の修正を含むため、統合後は [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]] の JSEY 確認もホスト側で実施する。

### 5.4. CHANGELOG に書く事項

- 不具合修正: reporter の停止・再開と統合の停止が同じ秒に記録されたとき、イベントの並び順によって統合再開時に reporter を余分に実行する問題を修正。

## 6. 関連ドキュメント

- [[prj-0001:pjr-8nb8-exec-smoke-command]]
- [[prj-0001:pjr-9jn6-change-scope-protected-list-overlap]]
