---
specdojo:
  id: prj-0001:pjr-ekgq-external-projects-path-in-worktree
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-11-23T01:37:52Z"
  due_on: "2026-11-30"
  commit_type: fix
---

# PJR-EKGQ external_projects の path が worktree から解決され、exec run の worktree の準備が止まる

## 1. 課題内容

利用側の `.specdojo/specdojo.config.json` に `external_projects` を宣言すると、`exec run --register --worktree` が、すべての項目で worktree の準備の段で止まる。runner が worktree の中で流す `specdojo build` が、設定の検証で次のエラーを出す。

```text
Error: Invalid .specdojo/specdojo.config.json (<worktree_base>/prj-0001-PJR-XXXX/project/.specdojo/specdojo.config.json):
  - external_projects.specdojo.path "../specdojo" does not exist (resolved to <worktree_base>/prj-0001-PJR-XXXX/specdojo)
```

`path` はリポジトリのルートからの相対パスで、主の作業ツリーからは正しい場所を指す。worktree（`<worktree_base>/<task>/project/`）から解決すると、`<worktree_base>/<task>/specdojo` という存在しない場所になる。項目は `checkpoint failed: Worktree preparation failed: specdojo build exited with 1` で `waiting` になる。続く項目は、統合されていない前の項目との範囲の重なりとして止まる。

dry-run は worktree を作らないため、このエラーは出ない。

## 2. 入力

<!-- 対話で得た前提・制約・委任範囲を記録する。完了・回答の判定条件とは分ける。 -->

- 利用側（OpenFisca-Japan の作業の project。`repos` でプロダクトリポジトリを宣言している）で、specdojo 0.9.2 を使って見つけた（2026-11-23）。
- 宣言は `"external_projects": { "specdojo": { "path": "../specdojo", "project_id": "prj-0001" } }` で、本家への起票（`register add --project specdojo --commit`）は主の作業ツリーで動いた。
- `.specdojo/specdojo.local.config.json` では `external_projects` を上書きできないため、利用側は宣言を外して回避した。本家への起票は、本家のリポジトリで直接行っている。

## 3. 影響範囲

| 観点         | 影響                                                                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/shared/specdojo-config.ts` の `external_projects` の `path` の検証と解決、`src/register/external-project.ts`、`orchestrator launch` の編集の許可 |
| スケジュール | _TODO_                                                                                                                                                |
| コスト       | 小さい〜中くらい                                                                                                                                      |
| 品質         | `external_projects` を宣言した利用者は、worktree の exec run をまったく使えない                                                                       |
| 関係者       | 別のリポジトリの登録簿へ起票する利用者                                                                                                                |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `repos` の `path` は `resolveRepoRoot` で worktree の中の場所に解決されるが、`external_projects` の `path` は `resolve(rootDir, path)` のまま解決され、存在しないとエラーにしている                                                                                                                                |
| 対応策   | _UNDECIDED_: 次のどれにするかを決め、理由を対応結果に書く。(a) linked worktree では、主の作業ツリーのルートから解決する。(b) 存在の検査は、`register add --project <別名>` と `orchestrator launch` の時だけ行い、設定の読み込みでは行わない。(c) `external_projects` をローカル設定で上書き・削除できるようにする |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                               |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                                                                                                                                                                                                       |

- `external_projects` を宣言したリポジトリで、`exec run --register --worktree` の worktree の準備（`specdojo build`）が通る（テストで確かめる）。
- 主の作業ツリーからの `register add --project <別名> --commit` は、今までどおり相手へ起票できる。相手がない場合の停止の動きは変えない。
- 設定リファレンスの `external_projects` の節に、worktree での `path` の扱いを書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く（prj-0001 の運用。並べて流したときの統合の衝突を避けるため）。

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[specdojo:specdojo-config-reference]]
- [[specdojo:register-operation-guide]]
