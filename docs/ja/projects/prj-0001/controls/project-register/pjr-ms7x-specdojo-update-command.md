---
specdojo:
  id: prj-0001:pjr-ms7x-specdojo-update-command
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-20T13:57:09Z"
---

# PJR-MS7X specdojo update で、版の更新と移行の案内をまとめて行えるようにする

## 1. 概要

npm i -D では版が上がるだけで、CHANGELOG の動きが変わる点や設定の手直しを利用者が自分で探す必要がある。specdojo update で、版の比較・CHANGELOG の表示・更新・更新の後の確認をまとめて行う

## 2. 入力

- 利用者の提案（2026-11-20）: specdojo の更新は npm i -D で行っているが、specdojo update のようなコマンドで行えた方がよい
- orchestrator の案（2026-11-20）: 1. 今の版と npm の latest を比べる。2. その間の CHANGELOG の「利用者から見て動きが変わる点」を表示する。3. 利用リポジトリの package manager（npm・pnpm・yarn）で更新する（--dry-run あり）。4. 更新の後に設定の検証と kata status を流し、手直しの要る点を表示する
- orchestrator の調べ（2026-11-20）: 0.9.1 では、repos を宣言した project の opencode の `command_template` に --agent が要る変更があり、版を上げるだけでは気づけない
- 2026-11-22、PJR-09HA で skill specdojo-exec-in-session も config scaffold で配るようになった。scaffold は --force なしで既にあるファイルを上書きしないため、版を上げても配ったファイル（skill・agent 定義・rules）は古いまま残る。
- 決定（2026-11-22、indie）: 手直しは対話で行う。候補ごとに差分を示して聞き、対話できないときは何も書き換えず一覧だけを出す。--yes は作らない。
- 決定（2026-11-22、indie）: @specdojo/docs-lint・docs-site は入っているときだけ同じ回で上げる。package.json の版の指定の形（^ か固定か）は保つ。
- 決定（2026-11-22、indie）: 難しさは hard、executor は opus-executor、代わりは sonnet-executor。

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
