---
specdojo:
  id: prj-0001:pjr-7kqt-claude-edit-executor-bash-validation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-21T09:00:54Z"
---

# PJR-7KQT Claude の edit executor の権限設定がコマンドを許可せず、plan が求める検証を流せない

## 1. 課題内容

templates/claude/settings.edit.json の allow は Edit(**) だけでコマンドを1つも許可しない。claude -p は承認を求められないため、executor が Prettier・markdownlint・Slidev build などの検証を流すと拒まれ incomplete で止まる。claude-executor.md は役割を「編集と検証」とし tools に Bash を挙げており食い違う。利用者のリポジトリごとに異なる検証コマンドをどの範囲で許すかを決める

## 2. 入力

- 発端は利用者のプロジェクト coderdojo-lessons-specdojo の prj-0001:PJR-AF5N（SpecDojo 0.9.2、2026-11-21）。
- sonnet-executor（claude、mode: edit）で register 項目を実行したところ、教材2ファイルの編集はできたが、npx prettier・npx markdownlint・npx slidev build がすべて拒まれ、`completion_status:` incomplete で止まった。モデルを opus に替えても同じ設定を使うため変わらない。
- 利用者のリポジトリで settings.edit.json の allow に Bash(npx prettier `*)`・Bash(npx markdownlint-cli2 `*)`・Bash(npx markdownlint `*)`・Bash(npx slidev `*)` を足すと、opus-executor は Prettier と Slidev build を流せた。ただし雛形を config scaffold --force で当て直すと元に戻る。
- exec-config-guide の provider 設定の節は Edit の allow と deny の範囲だけを説明し、コマンドの許可には触れていない。関連：[[prj-0001:pjr-tm1b-claude-edit-allowlist-too-narrow]]（Edit の範囲を広げた項目。Bash は扱っていない）。

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
