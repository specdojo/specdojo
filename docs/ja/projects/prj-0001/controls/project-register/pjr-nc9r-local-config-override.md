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

specdojo.config.json は git の管理下のため、ローカルで足したいリポジトリやパスを書けない。.specdojo/specdojo.local.config.json で許可したキーだけを上書きでき、worktree の子のプロセスにも本体側の設定が効くようにする。

## 2. 入力

- 利用者の要望（2026-11-18）: .specdojo/specdojo.config.json は git で管理されるため、ローカルで追加したいリポジトリが反映されない。git で管理しない config で上書きでき、worktree を作るときにも効くようにしたい
- orchestrator の調べ（2026-11-18）: .gitignore には .claude/settings.local.json・CLAUDE.local.md の前例がある。repos は exec が変えてよいリポジトリの宣言で、commit の許可範囲と変更範囲の予約もここから決まる。worktree の build は worktree を cwd にして .specdojo/specdojo.config.json を辿る（src/exec/worktree.ts）
- 利用者の決定（2026-11-18、orchestrator の推奨の案）: ファイルは .specdojo/specdojo.local.config.json。上書きできるキーは許可リストで決め、最初は共有の設定で宣言した repos[].path の差し替えとローカルのリポジトリの追加。worktree へはコピーせず、親が本体の作業ツリーのローカル設定を読み、子のプロセスには環境変数でそのパスを渡す。ローカル設定は保護された設定に含める。config init で .gitignore に足し、config show・where でローカル由来の値を示し、run の記録にローカルで上書きした項目を書く。ローカルで宣言したリポジトリを orchestrator の「宣言したリポジトリ」に含めるかを決め、orchestrator の定義の変更案を書く

## 3. 完了条件

- `.specdojo/specdojo.local.config.json` があれば、`specdojo.config.json` の後に読み、許可リストのキーだけを上書きする。最初の許可リストは、共有の設定で宣言した `repos[]` の `path` の差し替え（`name` で対応づける）と、ローカルのリポジトリの追加とする。許可リストの外のキーや型の誤りは、対象のファイルとキーを示してエラーで止める。
- ローカルで足したリポジトリと差し替えたパスは、`config show`・`where` などの出力で、ローカル由来であることが分かる。`exec run` の記録（evidence など）に、ローカルで上書きした項目を残す。
- worktree へはローカル設定をコピーしない。親は本体の作業ツリーのローカル設定だけを読み、worktree の中の子のプロセス（build など）には環境変数でそのファイルのパスを渡す。worktree の中に同じ名前のファイルがあっても、親はそれを信じない。
- ローカル設定を保護された設定の一覧（`src/exec/agent-protected-config.ts`）に含め、executor が書き換えると統合の前に止まることをテストで確かめる。
- `config init` が `.gitignore` に `.specdojo/specdojo.local.config.json` を足す。この repository の `.gitignore` への追加は保護された設定に当たらなければ行い、当たる場合は変更案を書く。
- ローカルで宣言したリポジトリを、orchestrator の定義の「`repos` で宣言されたプロダクトリポジトリ」に含めるかを決め、理由と、orchestrator の定義（`.agents/specdojo-orchestrator.agent.md`）の変更案を個票の対応結果に書く。
- 読み込み・上書き・エラー・環境変数での受け渡しを単体テストで、worktree の子のプロセスに効くことを統合テストで確かめる。
- 設定リファレンス（`docs/ja/specdojo/references/specdojo-config-reference.md`）とコマンドリファレンスに、ファイル・許可リスト・優先順位を書く。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------- | ---- | ---- | ---- |
| 1   | ローカル設定の読み込みと許可リストの上書きを実装する | ARC  | open | -    |
| 2   | 出力と run の記録にローカル由来の値を示す            | ARC  | open | -    |
| 3   | worktree の子のプロセスへ環境変数でパスを渡す        | ARC  | open | -    |
| 4   | 保護の一覧・`config init`・文書・テストを足す        | ARC  | open | -    |
| 5   | orchestrator の定義の扱いを決め、変更案を書く        | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:specdojo-config-reference]]
