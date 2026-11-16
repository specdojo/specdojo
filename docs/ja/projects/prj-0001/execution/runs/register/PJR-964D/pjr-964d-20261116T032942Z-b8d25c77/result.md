---
specdojo:
  id: prj-0001:xer-pjr-964d-20261116t032942z-b8d25c77
  type: exec-result
  task_id: PJR-964D
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-964D/pjr-964d-20261116T032942Z-b8d25c77/plan.md
  started_at: "2026-11-16T03:29:44.971Z"
  completed_at: "2026-11-16T03:46:42.492Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- src/shared/git.ts の index.lock の再試行を時間上限方式に変えた。最初の 10 回は 1.5 秒間隔、その後は 5 秒間隔で、既定 20 分（exec-defaults の `run.git_index_lock_wait_seconds`）まで待つ。待機中は最初と 30 秒ごとに経過を表示し、上限を越えたら lock のパスと原因の候補を示して失敗する。最初の 10 回の後に lock が残っていて /proc に git のプロセスがなければ、古い lock とみなして早めに失敗する。schema・exec-config-guide・schedule-operation-guide・CHANGELOG・個票を更新し、回帰テストを追加した。

## 2. 変更ファイル

- `CHANGELOG.md`: 変更、+4 / -0 行
- `docs/ja/specdojo/guides/exec-config-guide.md`: 変更、+3 / -0 行
- `docs/ja/specdojo/guides/schedule-operation-guide.md`: 変更、+1 / -1 行
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: 変更、+9 / -0 行
- `src/exec/agent-config.ts`: 変更、+21 / -0 行
- `src/shared/git.ts`: 変更、+160 / -12 行
- `tests/src/exec/agent-config.test.ts`: 変更、+22 / -0 行
- `tests/src/shared/git.test.ts`: 変更、+182 / -9 行

## 3. 申し送り

- `_ASSUMPTION_:` 古い lock の判定は、Linux の /proc に git のプロセスが 1 つもないときだけ働く。別の run の git が並行して動いていると判定は働かず、上限（既定 20 分）まで待つ。直列化の本対応（PJR-30SA）が入るまでの手当てとして許容した。
- /proc を読めない環境では古い lock の判定をせず、上限まで待つ。lock のファイルは runner が消さず、人が git の不在を確かめてから消す運用のまま。
- .specdojo/exec-defaults.yaml は既定値（1200 秒）で足りるため変更していない。値を変える場合は `run.git_index_lock_wait_seconds` を足す。
- 個票の完了条件の `npm run check` 全体は sandbox で実行していない。親の検証の結果で確かめる。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
