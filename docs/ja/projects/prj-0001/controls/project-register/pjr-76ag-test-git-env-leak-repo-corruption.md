---
specdojo:
  id: prj-0001:pjr-76ag-test-git-env-leak-repo-corruption
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-28T10:10:24Z"
  due_on: "2026-09-30"
  register_events:
    - v: 1
      id: reg_90a1afff79f74d12b5be0a023c4ef88e
      ts: "2026-08-28T10:10:24Z"
      action: add
      actor: manual
      from_status: null
      to_status: open
      reason: item added
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: テストがgitフック配下でGIT_DIRを引き継ぎ実リポジトリを破壊する事故が3度目の再発をした
        - field: description
          from: ""
          to: PJR-TPY9 の実行結果をコミットした際、lefthook の pre-commit が npm test を起動し、その中で新規追加されたテストが一時ディレクトリのつもりで git init / add / commit を実行した。git フック配下では親の git が GIT_DIR / GIT_INDEX_FILE を環境変数へ設定するため、env を渡さずに git を起動すると実リポジトリへ適用される。共有 config へ core.bare=true と user.name=test が書き込まれ、worktree ブランチへ不正コミットが作られた。いずれも復旧済みで push 済み履歴には到達していない。PJR-X3E8、PJR-A99J に続く3度目の同型再発であり、規約の記述だけでは再発を止められないことが確認された。
        - field: type
          from: ""
          to: issue
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-28"
        - field: due
          from: ""
          to: "2026-09-30"
---

# PJR-76AG テストがgitフック配下でGIT_DIRを引き継ぎ実リポジトリを破壊する事故が3度目の再発をした

## 1. 課題内容

PJR-TPY9 の実行結果をコミットした際、lefthook の pre-commit が npm test を起動し、その中で新規追加されたテストが一時ディレクトリのつもりで git init / add / commit を実行した。git フック配下では親の git が GIT_DIR / GIT_INDEX_FILE を環境変数へ設定するため、env を渡さずに git を起動すると実リポジトリへ適用される。共有 config へ core.bare=true と user.name=test が書き込まれ、worktree ブランチへ不正コミットが作られた。いずれも復旧済みで push 済み履歴には到達していない。PJR-X3E8、PJR-A99J に続く3度目の同型再発であり、規約の記述だけでは再発を止められないことが確認された。

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- 暫定対処を含む実装: [[prj-0001:pjr-tpy9-register-git-github|PJR-TPY9 Register履歴をGitコミット粒度から分離する]]
- 1度目の同型事故: [[prj-0001:pjr-x3e8-test-git-env-bare-repository]]
- 2度目の同型事故: [[prj-0001:pjr-a99j-agent-git-isolation-breach]]
- git identity の混入: [[prj-0001:pjr-ex5e-git-identity-isolation]]
- 検査の実体: `tests/src/git-environment-isolation.test.ts`、`src/exec-worktree.ts` の `gitEnvironment()`
