---
specdojo:
  id: prj-0001:pjr-fbp0-register-branch-push-checks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T00:21:48Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2TX0
  depends_on:
    - PJR-N5J8
  commit_type: feat
  commit_scope: register
---

# PJR-FBP0 register のブランチへの push を検査する

## 1. 概要

push のたびに記録の形と schema を検査し、register の範囲の外のファイルを含む commit を止める。hook と CI の両方で流せるようにする

## 2. 入力

- PJR-2TX0 の決定（D、1b・2a・3a・4a）を展開する。個人の運用でも、別のプロジェクトから specdojo へ起票することが多いため、早めに着手する（利用者の依頼、2026-11-23）
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- register のブランチへの push のたびに、記録の形（個票とイベントの対応、schema）を検査し、register の範囲の外のファイルを含む commit を止める検査を用意する（4a）。ローカルの hook（pre-push）と、CI で流せるコマンドの両方を用意する。CI の定義（`.github/`）が要る場合は、案を個票の対応結果に書く。
- 別のプロジェクトから `external_projects` で push された起票も、同じ検査を通す。
- 検査に落ちたときに、どのファイルのどこが違うかと直し方を出す。
- 単体テストを足す（範囲の外のファイル、形の違反、正しい commit）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`.github/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                         | 担当 | 状態 | メモ                                                            |
| --- | ---------------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------- |
| 1   | `register branch-check` の実装（範囲の外のパスと、個票・イベントの形の検査） | DEV  | done | `src/register/push-check.ts`、`src/register/branch-commands.ts` |
| 2   | pre-push の入口 `tools/check-register-push.mjs` と単体テスト                 | DEV  | done | `lefthook.yml` への接続は保護のため案を handoff に記載          |
| 3   | CLI リファレンス・運用ガイド・分岐の標準の更新                               | DEV  | done | 3 文書                                                          |
| 4   | CI の workflow 案を記載                                                      | DEV  | done | `.github/` は保護のため案のみ（対応結果 3 節）                  |

## 5. 対応結果

### 5.1. 実施内容

- `specdojo register branch-check --project <id> --commit <sha> [--base <sha>] [--remote-ref <ref>]` を追加した。`--remote-ref` が register のブランチでなければ何もしない。`register_sync` 未設定の project でも何もしない。
- 検査は 2 つ。(1) `--base..--commit`（`--base` が省略・全 0 のときはリモートにない commit）の各 commit が、`project_register_path` と `execution_path/exec/events/` の外のファイルを含まないこと。commit ごとに調べ、正味の差分で隠れる変更を見逃さない。(2) 先端の tree を一時ディレクトリへ書き出し、`register build` と同じ `validateRegisterItemDocs` と `validateRegisterEventDocs` を通すこと。
- 違反は、`<commit>: <path>` または `<file>: <内容>` の形で出し、直し方を添える。
- 別の project から `external_projects` で起票した commit も同じブランチへ入るため、同じ検査を通る（個別の分岐は作っていない）。
- 単体テストを追加した（`tests/src/register/push-check.test.ts`、`tests/tools/check-register-push.test.ts`）。範囲の外のファイル、形の違反、正しい（空の）場合、hook の入口を検証する。

### 5.2. 決めた内容と理由

- 検査の入口を、既存の `branch-guard`（develop 側の直接変更の検出）と別の `branch-check` にした。向きが逆（register のブランチ側で範囲の外を止める）で、引数も異なるため。
- 範囲の外の判定は、`assertRegisterBranchPaths` と同じ規則（2 つの接頭辞）に合わせた。
- 形の検査は個票と event に限った。epic・依存・`derived_from` の横断検証は、push 先の tree 全体を要し、register のブランチでは参照先が develop にあるため含めない。
- 実 Git を使う統合テストは足していない（executor は `test:integration` を流せない）。範囲の判定は `rev-list` と `diff` の薄い組み立てで、判定そのもの（`findOutOfScopePaths`）と形の検査は単体テストで検証した。

### 5.3. CI の workflow 案（`.github/` は変えていない）

`.github/workflows/check-register-push.yml` として次を置く案。

```yaml
name: Check register branch push
on:
  push:
    branches:
      - "project/*/register"
permissions:
  contents: read
jobs:
  register:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v5
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - name: Check register branch push
        run: >-
          node --import tsx src/specdojo.ts register branch-check --project prj-0001
          --commit "$GITHUB_SHA" --base "${{ github.event.before }}" --remote-ref "$GITHUB_REF"
```

`github.event.before` が全 0 の新規ブランチでは、リモートにない commit だけを調べる。

### 5.4. lefthook.yml の変更案（保護のため変更していない）

`pre-push` の `protect-main.run` の末尾へ、次を `&&` でつなぐ。

```text
&& printf '%s\n' "$input" | node tools/check-register-push.mjs --project prj-0001
```

### 5.5. CHANGELOG に書く事項

- 区分: Added
- 文案: `specdojo register branch-check` を追加した。register のブランチへ push する commit について、register の範囲の外のファイルと、個票・イベントの形の違反を検査し、直し方を出す。pre-push の入口（`tools/check-register-push.mjs`）と CI で使える。

### 5.6. 残課題

- `lefthook.yml` と `.github/workflows/` への組み込み（5.3 と 5.4 の案、人が反映する）。
- 統合テスト（実 Git の `rev-list` を通る経路）は、親の `test:integration` では未追加。

## 6. 関連ドキュメント

- [[specdojo:command-reference]]
- [[specdojo:register-operation-guide]]
- [[specdojo:git-branching-standard]]
