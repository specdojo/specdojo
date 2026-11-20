---
specdojo:
  id: prj-0001:pjr-v277-parent-validation-orphan-hang
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-20T12:29:42Z"
  derived_from:
    - PJR-A77M
---

# PJR-V277 親の検証の時間切れの後に、残った子のプロセスで runner が止まる

## 1. 課題内容

親の検証が時間切れになったとき、kill した後も vitest などの子孫のプロセスが出力の pipe を持ったまま残り、runner がその close を待ち続けて先へ進まない。夜間の実行では人がいないため止まったままになる

## 2. 入力

- 利用者の決定（2026-11-20）: issue として起票する。担当 DEV、優先度 high、0.9.1 には入れず 0.9.2 以降で扱う。期限は未定
- orchestrator の観測（2026-11-20、PJR-A77M の run pjr-a77m-20261120T115327Z-88a833fc）: test-integration が `timeout_ms` 600000 で validation-timeout になった後、vitest（PID 87542）が親を失って PPID 1 のまま残った。その子の tests/src/register/external-project.integration.test.ts が起動した specdojo.js --version が `do_epoll_wait` で止まっていた。runner（PID 83412）は次の検証へ進まず、約 4 分後に orchestrator が 3 つの PID を kill すると typecheck・test-unit へ進んだ
- orchestrator の観測（2026-11-20）: 同じ specdojo.js --version を手で流すとすぐ 0.9.0 を返した。--resume で流し直した test-integration は通った

## 3. 影響範囲

| 観点         | 影響                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| スコープ     | 親の検証の起動と時間切れの処理（`src/exec/parent-validation.ts`）に限る。検証の一覧・時間上限・合否の判定は変えない      |
| スケジュール | 時間切れになった検証は、上限の後に最大で約 15 秒（SIGKILL までの猶予 10 秒と pipe の close を待つ 5 秒）で次の検証へ進む |
| コスト       | 夜間の実行が止まったままになり、人が PID を kill するまで待つ手間がなくなる                                              |
| 品質         | 時間切れの後に残る vitest などの子孫を止めるため、次の検証や次の run と負荷を取り合わない                                |
| 関係者       | exec run を夜間に流す orchestrator・利用者                                                                               |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/exec/parent-validation.ts` は時間切れで直接の子（npm）だけに SIGTERM を送り、`close` を待つ。孫の vitest や、そのさらに子が stdout・stderr の pipe を持ったまま残ると、`close` が来ない |
| 対応策   | 検証のプロセスを process group で起動し、時間切れのときは group ごと止める。一定の猶予の後も残れば SIGKILL を送り、それでも pipe が閉じない場合は待たずに時間切れとして返す                  |
| 依存事項 | なし                                                                                                                                                                                         |
| 完了条件 | 下記の完了条件の内訳をすべて満たすこと                                                                                                                                                       |

完了条件の内訳。

- 親の検証の時間切れのとき、検証のプロセスとその子孫をまとめて止める（Linux と macOS では process group。Windows の扱いは executor が決める）。SIGTERM の後に猶予（例: 10 秒。値は executor が決める）を置き、残れば SIGKILL を送る。
- 子孫が pipe を持ったまま残っても、runner は猶予の後に時間切れとして結果を返し、次の検証へ進む。`parent-validation-metrics.jsonl` に、止めたことと残ったプロセスがあったかが残る。
- 時間切れにならない検証の動き（終了コード・出力の取り込み・metrics）は変えない。
- 孫のプロセスが pipe を持ったまま止まらない場合を、統合テストか単体テストで再現し、runner が時間内に戻ることを確かめる。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。利用者に影響が無い場合はそう書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

## 5. 対応結果

### 5.1. 解決内容

- 親の検証を Linux・macOS では自分の process group で起動し、時間切れのときは group 全体に SIGTERM を送る。10 秒の猶予の後も group に残る子孫には SIGKILL を送る。処理は `src/exec/validation-process-group.ts` に分けた。
- SIGKILL の後 5 秒たっても出力の pipe が閉じない場合（group の外へ出た子孫が持ち続ける場合）は、pipe を閉じて close を待たずに時間切れとして返し、次の検証へ進む。
- 猶予の前に close した場合も、group に残った子孫は SIGKILL で止める。
- 止め終えた時点で `parent-validation-metrics.jsonl` に `validation-timeout-stop` を記録する。項目は `process_group`・`survivors_after_term`（SIGTERM の猶予の後に子孫が残っていたか）・`kill_sent`・`pipes_closed`・`stop_ms`。読み方を [[specdojo:exec-operation-guide|exec 運用ガイド]] の metrics の表に足した。
- 時間切れにならない検証は従来どおり close で結果を返し、終了コード・出力の取り込み・metrics は変えていない。

### 5.2. 決めた点と理由

- 猶予は SIGTERM から SIGKILL まで 10 秒、SIGKILL から pipe の close まで 5 秒とした。vitest が後始末をする時間を残しつつ、夜間でも上限の後 15 秒ほどで先へ進めるため。
- Windows は process group を使わず、従来どおり直接の子だけに送る。そのうえで pipe の close を待つ時間を区切って返す。`taskkill /T` による木全体の停止は検証できる環境が無いため入れていない。
- 検証を別の process group にすると、端末の Ctrl-C が検証へ届かなくなる。そのため検証の実行中だけ runner が SIGINT・SIGTERM・SIGHUP と自身の exit を受けて検証の group に SIGTERM を送る。他の listener が無いときは listener を外して同じ signal を送り直し、既定の終了の動きを保つ。

### 5.3. 確認結果

- 統合テスト `tests/src/exec/parent-validation-timeout.integration.test.ts` を追加した。SIGTERM を無視して pipe を持ち続ける孫を残す検証で、孫が SIGKILL で止まり、時間内に時間切れとして返ることを確かめる。group の外へ出た孫が pipe を持ち続ける場合も close を待たずに返ること、時間切れにならない検証の結果と metrics が変わらないことも確かめる。executor の環境でこのファイルを流し 3 件とも通った。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の検証は親 runner が流す。

### 5.4. 再発防止策

- 時間切れの後に残った子孫とその止め方を `validation-timeout-stop` で追えるようにした。

### 5.5. CHANGELOG に書く事項

- 不具合修正: 親の検証が時間切れになったとき、vitest などの子孫まで止め、出力の pipe を持つプロセスが残っても runner が次の検証へ進むようにした。

## 6. 関連ドキュメント

- [[specdojo:exec-operation-guide|exec 運用ガイド]]: 親検証の metrics の読み方に `validation-timeout-stop` を追加した。
- 派生元: PJR-A77M（時間切れの観測元の run）。
