---
specdojo:
  id: prj-0001:pjr-qqrh-runner-false-success
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-18T12:17:56Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-08EK
---

# PJR-QQRH executor が編集を拒まれたまま完了と報告すると、runner が成功として review に進める

## 1. 課題内容

権限で拒まれた出力や、プロダクトの変更がないことを見落とし、waiting にせず review へ進めてしまう

## 2. 入力

- opencode の executor（Ollama のローカルモデル）はプロダクトの worktree への Edit を 20 回拒まれたあと、直したと報告した
- evidence.json は stage.status succeeded、`exit_code` 0、`completion_status` complete で、changes は登録簿のイベントの 1 件だけだった
- executor が報告した検証 npm run test:browser は passed と記録されたが、ログ上はルートの npm test（no test specified）が走っていた
- runner のログは integrate で no changes; skipped のあと review へ進んだ
- 環境: specdojo 0.7.0、opencode 1.19.5、Linux（devcontainer）
- 起票案は利用者が作成した tmp/specdojo-issue-2-runner-false-success.md

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
