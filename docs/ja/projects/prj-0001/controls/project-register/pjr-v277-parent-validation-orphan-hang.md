---
specdojo:
  id: prj-0001:pjr-v277-parent-validation-orphan-hang
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
