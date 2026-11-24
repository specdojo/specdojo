---
specdojo:
  id: prj-0001:pjr-1jf6-register-branch-merge-into-develop
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T00:21:44Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-24T00:11:47Z"
  conclusion: register のブランチを develop へ一方向に取り込む register branch-merge と、develop 側の直接の変更を見つける branch-guard を足し、register の worktree の実行の前に取り込むようにした
  derived_from:
    - PJR-2TX0
  depends_on:
    - PJR-N5J8
  commit_type: feat
  commit_scope: register
---

# PJR-1JF6 register のブランチを develop へ一方向に取り込む

## 1. 概要

register のブランチを develop へ merge し続け、develop で register のファイルを直接変えないことを検査する

## 2. 入力

- PJR-2TX0 の決定（D、1b・2a・3a・4a）を展開する。個人の運用でも、別のプロジェクトから specdojo へ起票することが多いため、早めに着手する（利用者の依頼、2026-11-23）
- v0.10.0 に入れる（利用者の指定、2026-11-24）

## 3. 完了条件

- register のブランチを develop へ一方向に取り込み続ける仕組みを作る（3a）。GitHub Actions で push のたびに merge するか、CLI と runner が develop の作業の前に取り込むかを executor が決め、理由を個票の対応結果に書く。Actions の定義（`.github/`）が要る場合は、案を個票の対応結果に書く。
- develop では register のファイル（register のブランチに置くもの）を直接変えないことを検査する（hook など）。設定がなければ検査しない。
- 取り込みで衝突しないこと（register のファイルは register のブランチだけが変える）を統合テストで確かめる。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`.github/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                                                                                                     |
| --- | ---------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------------------- |
| 1   | 一方向の取り込みのコマンドと runner の取り込みを実装 | DEV  | done | `register branch-merge` を追加し、`exec run --register --worktree` の worktree 作成前に呼ぶ              |
| 2   | develop での直接の変更を検出する検査を実装           | DEV  | done | `register branch-guard --staged` / `--range`。`register_sync` が未設定なら検査しない                     |
| 3   | 実 Git の統合テストを追加                            | DEV  | done | 繰り返しの取り込みで衝突しないこと、直接の変更の検出、衝突時の中止、範囲外の拒否、未設定時の無動作を確認 |
| 4   | 関連文書と個票を更新し、hook・CI の変更案を記載      | DEV  | done | 保護された `lefthook.yml`・`.github/` は変えず、変更案を対応結果に記載。親の検証は runner が実行         |

## 5. 対応結果

### 5.1. 実施内容

- `src/shared/register-merge.ts` を追加した。`mergeRegisterBranch` はリモートの register のブランチを fetch し、現在のブランチへ `--no-ff` で merge する。staged の変更・進行中の merge・register のファイルの未 commit 変更・detached HEAD・記帳の範囲の外を変える register のブランチでは止まる。衝突したときは merge を中止して理由を出す。`checkRegisterGuard` は index（`--staged`）または commit の範囲（`--range`）で、register のファイルの直接の変更を検出する。
- `src/register/branch-commands.ts` で `register branch-merge` と `register branch-guard` を追加した。
- `src/exec/run/register-worktree.ts` で、register の worktree 実行が worktree を作る前に取り込むようにした。失敗したときは worktree を作らずに止める。
- `tests/src/register/register-branch-merge.integration.test.ts` に、実 Git と bare remote・別 clone の統合テストを足した。
- CLI コマンドリファレンス、登録簿運用ガイド、Git ブランチ運用標準を更新した。

### 5.2. 決めた内容と理由

- 取り込みは GitHub Actions ではなく、CLI と runner が develop の作業の前に行う方式にした。Actions で develop へ push するには、PR で守る develop の保護を越える資格（PJR-2TX0 で C を退けた理由の GitHub App に当たる）と、保護された `.github/` の変更が要る。CLI の方式は各自の手元の資格で動き、取り込みの merge の commit は通常の PR で develop へ入る。develop は register のファイルを変えないため、この merge は衝突しない。
- 検査の規則は「register のファイルの変更は、merge で取り込んだ親が register のブランチから受け取った内容（その親と register のブランチの merge base の内容）と一致する場合だけ許す」とした。register のブランチ自身の commit は検査しない。この規則で、develop を経由して feature へ入った取り込みも許し、squash や手での編集は止める。
- runner の取り込みは register の worktree 実行（`exec run --register --worktree`）だけに入れた。schedule の実行のイベントの読み取りは PJR-N5J8 で同期先を参照するため、schedule の run には入れていない。
- 検査を有効にすると、runner が今の方式で exec のブランチから develop へ統合する個票の変更（2a の未対応分）も違反になる。検査を hook に組み込むのは、runner の対応結果の転送（2a）が入ってからにする。

### 5.3. hook と CI の変更案（保護された設定のため未変更）

- `lefthook.yml` の pre-commit に、`register-branch-guard` として `[ ! -f dist/specdojo.js ] || node dist/specdojo.js register branch-guard --project prj-0001 --staged` を足す。dist がなければ何もせず、違反は commit を止める。
- CI（`.github/workflows/`）に、develop への push と PR で `specdojo register branch-guard --project prj-0001 --range <base>..<head>` を実行する job を足す。`<base>` は push の前の SHA または PR の base とし、`fetch-depth: 0` と register のブランチの fetch を含める。
- 取り込みは、`register_sync` を有効にした利用者が作業の前に `specdojo register branch-merge --project prj-0001` を実行する。post-checkout などの hook に置く案は、merge の commit を暗黙に作るため採らない。

### 5.4. 検証

- `tests/src/register/register-branch-merge.integration.test.ts` を単独で実行し、6 件が通った。
- 型検査、TypeScript・Markdown・frontmatter の lint、単体・統合テストは pipeline の親の検証へ委任した。

### 5.5. CHANGELOG に書く事項

- 区分: Added（v0.10.0）
- 行の文案: `register branch-merge` で register のブランチを develop へ一方向に `--no-ff` で取り込み、`register branch-guard` で develop での register のファイルの直接の変更を検出できる。`exec run --register --worktree` は worktree の作成前に取り込む。いずれも `register_sync` が有効な project だけで動く（PJR-1JF6）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-2tx0-register-branch-remote-ssot|PJR-2TX0 の決定]]
- [[prj-0001:pjr-n5j8-register-commit-to-register-branch|PJR-N5J8]]
- [[specdojo:command-reference|CLI コマンドリファレンス]]
- [[specdojo:register-operation-guide|登録簿運用ガイド]]
- [[specdojo:git-branching-standard|Git ブランチ運用標準]]
