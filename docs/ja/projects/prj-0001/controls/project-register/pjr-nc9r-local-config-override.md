---
specdojo:
  id: prj-0001:pjr-nc9r-local-config-override
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

| No  | 作業                                                 | 担当 | 状態 | メモ                                                                                              |
| --- | ---------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------- |
| 1   | ローカル設定の読み込みと許可リストの上書きを実装する | ARC  | done | `src/shared/local-config.ts` を新設し、`loadConfig` から呼ぶ                                      |
| 2   | 出力と run の記録にローカル由来の値を示す            | ARC  | done | `config show` を追加し、`where exec` と evidence の `local_config_overrides` に記録する           |
| 3   | worktree の子のプロセスへ環境変数でパスを渡す        | ARC  | done | `SPECDOJO_LOCAL_CONFIG` を build・agent の起動へ渡す                                              |
| 4   | 保護の一覧・`config init`・文書・テストを足す        | ARC  | done | 保護は既存の `.specdojo/` の範囲で効くことをテストで確かめた。`.gitignore` と既定の除外に追加した |
| 5   | orchestrator の定義の扱いを決め、変更案を書く        | ARC  | done | 含める。変更案は対応結果に書いた（反映は利用者の承認のもと）                                      |

## 5. 対応結果

### 5.1. 実施内容

- `.specdojo/specdojo.local.config.json` を `specdojo.config.json` の後に読み、許可リストのキーだけを上書きする処理を `src/shared/local-config.ts` に置いた。`loadConfig` は上書きの後の設定を既存の `repos` の検証に通す。ローカル設定を読んだ場合は、結果に `localConfigPath` と `localOverrides` を返す。
- 許可リストは次のとおり。トップレベルは `version`（`1` 固定）と `projects`。`projects.<project-id>` は `repos` だけ。共有の設定と同じ `name` の要素は `name`・`path` だけを受け付けて `path` を差し替える。共有の設定に無い `name` の要素はローカルのリポジトリとして末尾に足し、`repos` と同じキーを受け付ける。共有の設定に無い project、許可外のキー、型の誤りは、ローカル設定のファイルのパスとキーを示してエラーにする。上書きの後の検証の誤りには、見出しに `with local overrides from <path>` を付ける。
- 読むファイルの順序: 主の作業ツリーでは自分の `.specdojo/specdojo.local.config.json` を読み、環境変数は使わない。linked worktree では `SPECDOJO_LOCAL_CONFIG`（絶対パス）を読み、無ければ主の作業ツリーのファイルを読む。worktree の中の同じ名前のファイルはどちらの場合も読まない。
- 親は worktree の build（`worktreeBuildEnvironment`）と agent の起動（`agentEnvironment`・`exec worktree` の agent・trial）へ `SPECDOJO_LOCAL_CONFIG` を渡す。ローカル設定は worktree へコピーしない。
- `specdojo config show [--project <id>]` を追加した。設定とローカル設定のパス、上書きした項目、project ごとの `repos` を出力し、各リポジトリに `shared`・`local; shared: <path>`・`local; added` を付ける。`where exec` はローカル設定があるときだけ `local-config:` と `local-override:` の行を足す。ローカル設定が無い場合の出力は変えていない。
- `exec run` の executor evidence に `local_config_overrides`（`project`・`repo`・`kind`・`path`・`shared_path`）を記録する。runner が主の作業ツリーで読んだ設定から作る。`exec-evidence.schema.yaml` にこのキーを足した。
- `config init` の既定の除外（`DEFAULT_GITIGNORE_PATTERNS`）と、このリポジトリの `.gitignore` に `.specdojo/specdojo.local.config.json` を足した。`.gitignore` は保護された設定に含まれないため、直接変えた。
- テスト: 単体テストは `tests/src/shared/local-config.test.ts`（読み込み、上書き、エラー、worktree での解決、環境変数での受け渡し、`config show`、evidence の schema、gitignore の既定）と `tests/src/exec/agent-protected-config.test.ts`（executor が gitignore 済みのローカル設定を書くと保護の違反になる）に足した。統合テストは `tests/src/shared/local-config.integration.test.ts` に足した。実 Git の linked worktree で CLI の子のプロセスを起動し、主の作業ツリーのローカル設定が効くこと、worktree の中のファイルが読まれないことを確かめる。テストの共通 setup（`tests/setup/git-environment.ts`）で `SPECDOJO_LOCAL_CONFIG` を除き、runner の値が fixture に入らないようにした。`config` のサブコマンドの一覧を固定する `tests/src/cli-verb-taxonomy.test.ts` に `show` を足した。
- 文書: [[specdojo:specdojo-config-reference]] に「ローカル設定」の章を、[[specdojo:command-reference]] に `config show`・`where exec` の表示と `config init` の除外を足した。

### 5.2. 決めた内容と理由

- 保護の一覧（`src/exec/agent-protected-config.ts`）は変えていない。ローカル設定は既存の `.specdojo/` の範囲で保護され、gitignore 済みの生成物の除外（`GENERATED_PATHS`）にも入らない。そのことをコードのコメントとテストで固定した。完全一致の一覧に足すと、保護された `.specdojo/claude/settings.edit.json` の deny 一覧と一致させるテストが失敗し、保護された設定を変えることになるため、足していない。
- 環境変数は linked worktree の中でだけ受け付ける。主の作業ツリーで受け付けると、runner の子のプロセスが別リポジトリ（`external_projects` の委譲先など）を操作したときに、runner 側のローカル設定がそのリポジトリへ漏れるため。
- 環境変数が無い linked worktree では、主の作業ツリーのファイルを読む。利用者が worktree の中で手で `specdojo` を実行しても、同じ設定が効くようにするため。
- 追加したリポジトリには共有の `repos` と同じキーを許可する。宣言として成り立つには `integration_branch` などが要る場合があり、値は上書きの後に共有の設定と同じ検証を通るため。
- ローカルで宣言したリポジトリは、orchestrator の定義の「`repos` で宣言されたプロダクトリポジトリ」に含める。exec はローカルで足したリポジトリを `repos` の一員として扱い、プロダクト worktree・commit の許可範囲・`orchestrator launch` の許可対象に入れる。orchestrator だけが除くと、exec が変えるリポジトリを orchestrator が参照できず、整合しない。ローカル設定は保護対象で agent は書き換えられず、宣言できるのは利用者だけなので、範囲を広げても利用者の意思の外には出ない。

### 5.3. orchestrator の定義の変更案

`.agents/specdojo-orchestrator.agent.md` は保護された設定のため変えていない。利用者の承認のもと、feature ブランチで次の変更を反映する（同じ本文の各環境のラッパーにも同じ変更が要る）。

- 現行: 「`specdojo.config.json` の project に `repos` で宣言されたプロダクトリポジトリは参照してよい。」
- 変更案: 「`specdojo.config.json` の project に `repos` で宣言されたプロダクトリポジトリ（`.specdojo/specdojo.local.config.json` で追加・パスを差し替えたものを含む。`specdojo config show` で確かめる）は参照してよい。」
- 後続の「宣言していないリポジトリは参照も変更もしない。」はそのまま残す。

### 5.4. CHANGELOG に書く事項

- 区分: Added
- 文案: 「git で管理しないローカル設定 `.specdojo/specdojo.local.config.json` で、`repos[].path` の差し替えとローカルのリポジトリの追加をできるようにした。worktree の子のプロセスには `SPECDOJO_LOCAL_CONFIG` で主の作業ツリーのファイルを渡す。`specdojo config show` を追加し、`where exec` と executor evidence の `local_config_overrides` でローカル由来の値を示す。`config init` は `.gitignore` にこのファイルを足す。（PJR-NC9R）」

### 5.5. 残課題

- orchestrator の定義の変更案の反映（利用者の承認のもと feature ブランチで行う）。

## 6. 関連ドキュメント

- [[specdojo:specdojo-config-reference]]
