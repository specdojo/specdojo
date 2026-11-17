---
specdojo:
  id: prj-0001:pjr-nc9r-local-config-override
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-17T23:07:38Z"
  due_on: "2026-11-30"
---

# PJR-NC9R git で管理しないローカル用の設定（specdojo.local.config.json）で、環境ごとのリポジトリを上書きできるようにする

## 1. 概要

specdojo.config.json は git の管理下のため、ローカルで足したいリポジトリやパスを書けない。.specdojo/specdojo.local.config.json で許可したキーだけを上書きでき、worktree の子のプロセスにも本体側の設定が効くようにする

## 2. 入力

- 利用者の要望（2026-11-18）: .specdojo/specdojo.config.json は git で管理されるため、ローカルで追加したいリポジトリが反映されない。git で管理しない config で上書きでき、worktree を作るときにも効くようにしたい
- orchestrator の調べ（2026-11-18）: .gitignore には .claude/settings.local.json・CLAUDE.local.md の前例がある。repos は exec が変えてよいリポジトリの宣言で、commit の許可範囲と変更範囲の予約もここから決まる。worktree の build は worktree を cwd にして .specdojo/specdojo.config.json を辿る（src/exec/worktree.ts）
- 利用者の決定（2026-11-18、orchestrator の推奨の案）: ファイルは .specdojo/specdojo.local.config.json。上書きできるキーは許可リストで決め、最初は共有の設定で宣言した repos[].path の差し替えとローカルのリポジトリの追加。worktree へはコピーせず、親が本体の作業ツリーのローカル設定を読み、子のプロセスには環境変数でそのパスを渡す。ローカル設定は保護された設定に含める。config init で .gitignore に足し、config show・where でローカル由来の値を示し、run の記録にローカルで上書きした項目を書く。ローカルで宣言したリポジトリを orchestrator の「宣言したリポジトリ」に含めるかを決め、orchestrator の定義の変更案を書く

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
