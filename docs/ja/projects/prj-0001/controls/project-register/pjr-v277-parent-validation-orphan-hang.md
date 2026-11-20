---
specdojo:
  id: prj-0001:pjr-v277-parent-validation-orphan-hang
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
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
