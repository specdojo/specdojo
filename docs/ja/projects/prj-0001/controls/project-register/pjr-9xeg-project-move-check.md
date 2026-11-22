---
specdojo:
  id: prj-0001:pjr-9xeg-project-move-check
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-03T05:00:06Z"
  due_on: "2026-12-31"
  completed_at: "2026-11-22T12:03:59Z"
  conclusion: specdojo project move `<project-id>` --check を足した。8 つの点検を ok・needs-cleanup・check-manually で出し、片付けが要れば終了コード 1 で終わる
  derived_from:
    - PJR-8HCB
  commit_type: feat
  commit_scope: project
---

# PJR-9XEG project を別リポジトリへ移す前の読むだけの点検を作る

## 1. 概要

project を別リポジトリへ移す前に、実行中の項目・exec の worktree とブランチ・リポジトリをまたぐリンク・写すべき設定を一覧にする、何も書き換えない点検のコマンドを作る

## 2. 入力

- 利用者は、prj-0002（specdojo-lp の管理）を将来、管理用の別リポジトリ（例: specdojo-lp-specdojo）へ移す可能性を考え、安全に移すための機能を用意することを求めた。全自動の移行コマンドは後回しにし、読むだけの点検・手順のガイド・リポジトリをまたぐリンクの 3 件に分けると判断した（2026-11-03）
- 点検する項目の候補: 実行中・waiting の登録簿の項目と doing の schedule タスク、exec の worktree とブランチ（exec/`<project-id>-``*`）、統合先のブランチ、定期実行の設定、移す project とほかの project の間の wikilink（prj-0002 から prj-0001 の個票へ 10 種類ある）、写すべき設定（specdojo.config.json の project の項目、repos の相対パス、.specdojo の名簿と exec-defaults）、Kata の参照元（移した後は npm パッケージで版を固定する）（2026-11-03）
- コマンドの名前の例は specdojo project move --check。名前と出力の形は executor が決め、理由を記録してよい（2026-11-03）

## 3. 完了条件

- 読むだけの点検のコマンドを足す。名前と出力の形は executor が決め、理由を個票の対応結果に書く（例: `specdojo project move --check`）。
- 入力に挙げた候補（実行中・waiting の項目と doing のタスク、exec の worktree とブランチ、統合先のブランチ、定期実行の設定、project をまたぐ wikilink、写すべき設定、型の参照元）を項目ごとに点検し、「問題なし・移す前に片付けが要る・手で確かめる」のどれかを出す。
- 片付けが要る項目があれば、0 以外の終了コードで終わる。
- ファイル・git の refs・登録簿を書き換えないことを、統合テストで確かめる（点検の前後で作業ツリー・HEAD・refs が変わらない）。
- prj-0002 を対象に流した出力の例を、個票の対応結果に書く。
- `command-reference` に、足したコマンドを書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                        | 担当     | 状態 | メモ                                               |
| --- | ------------------------------------------- | -------- | ---- | -------------------------------------------------- |
| 1   | 読むだけの点検のコマンドを作る              | executor | done | `specdojo project move <project-id> --check`       |
| 2   | 書き換えないことを確かめる統合テストを足す  | executor | done | `tests/src/project/move-check.integration.test.ts` |
| 3   | prj-0002 で流した出力の例と参照の文書を書く | executor | done | git を使う 2 点検を除いた例。全体は人が流す        |

## 5. 対応結果

### 5.1. 実施内容

- `specdojo project move <project-id> --check` を足した（`src/project/move-check.ts`・`src/project/command.ts`）。`--json` で同じ結果を JSON で出す。
- 点検は 8 つで、それぞれ `ok`（問題なし）・`needs-cleanup`（移す前に片付けが要る）・`check-manually`（手で確かめる）を出す。`needs-cleanup` があると終了コード 1 で終わる。
- 統合テストで、点検の前後で作業ツリーのファイル・HEAD・refs・`git status`・worktree の一覧が変わらないことを確かめた。単体テストで参照の拾い方・exec ブランチの接頭辞・出力の形を確かめた。
- [[specdojo:command-reference|CLIコマンドリファレンス]] の「init / config / project」にコマンドと点検の表を足した。
- `src/project` を ESLint の機能ディレクトリの一覧へ足し、`src/shared` から import できないようにした。`registerProjectCommands` は `project` コマンドを返すようにし、`move` をそこへ足した。

### 5.2. 決めたこと

- 名前は `project move <project-id> --check` にした。後で移すこと自体を自動化するときに同じ名前を使え、`--check` で読むだけであることが分かるため。今は `--check` を付けないとエラーにする。
- 片付けが要るとしたのは、移すと続きを実行できなくなるもの（`in-progress`・`waiting` の項目、`doing`・`blocked` のタスク、exec ブランチと worktree）。`blocked` も claim を持つため含めた。`review` の項目は run が終わっているため含めない。
- リンク・写す設定・定期実行・kata・見つからない統合先のブランチは、移すときに人が写すか書き換えるため「手で確かめる」にした。
- project をまたぐ参照は、wikilink はどこでも、`<project-id>:` 付きの値は frontmatter と YAML だけで拾う。本文の `specdojo:build` のようなコマンド名を参照と取り違えないため。`generated/` は生成物なので見ない。
- exec ブランチは、プロジェクトのリポジトリでは `exec/<project-id>-*`、`repos` では `branch_template` の `{id}` より前（`{project}` を展開したもの）で探す。接頭辞に project ID が入らない template は project を見分けられないため「手で確かめる」にした。

### 5.3. prj-0002 で流した出力の例

executor の sandbox では `specdojo-prj-0002` の checkout で git を流せないため、git を使わない 6 つの点検だけを、同じ関数で checkout のファイルに対して流した（2026-11-22）。`exec-worktrees` と `integration-branches` を含む全体は、人がその checkout で `specdojo project move prj-0002 --check` を流して確かめる。

```text
Move check for prj-0002 (read-only; nothing was changed)

[needs-cleanup] register-items: 1 in-progress or waiting items; finish, release, or defer them first
  - PJR-B3W9 waiting prj-0002 専用の exec 既定設定を用意する
[ok] schedule-tasks: no schedule directory
[ok] routines: routines_path is not set
[check-manually] cross-project-links: 14 outbound and 7 inbound referenced ids will cross repositories
  - out prj-0001:PJR-16S0 (1 files)
  - out prj-0001:PJR-2FV2 (2 files)
  - out prj-0001:pjr-36qg-competitive-landscape-and-release (1 files)
  - out prj-0001:pjr-5w8c-register-github-integration (1 files)
  - out prj-0001:pjr-9g9y-practice-execution-terminology (1 files)
  - out prj-0001:PJR-C50G (1 files)
  - out prj-0001:pjr-e8tt-initial-release-positioning (1 files)
  - out prj-0001:PJR-EN6M (1 files)
  - out prj-0001:pjr-evax-spec-do-notation (1 files)
  - out prj-0001:pjr-he9r-per-project-parent-validations (1 files)
  - out prj-0001:pjr-md3c-job-review-agent (1 files)
  - out prj-0001:pjr-nyzr-adoption-strategy (1 files)
  - out prj-0001:pjr-yfbw-guide-plan-mode-vs-register (1 files)
  - out prj-0001:pjr-zdvq-product-repo-branch-strategy (3 files)
  - in prj-0002:pjr-0wfv-lp-why-register (2 files)
  - in prj-0002:pjr-2cqc-lp-dev-environment (3 files)
  - in prj-0002:PJR-7MB3 (1 files)
  - in prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix (1 files)
  - in prj-0002:pjr-b3w9-exec-defaults (1 files)
  - in prj-0002:pjr-hepk-lp-content (8 files)
  - ... and 1 more
[check-manually] config: copy the listed configuration into the new repository
  - .specdojo/specdojo.config.json: copy projects.prj-0002
  - repos specdojo-lp: path ../specdojo-lp -> /workspaces/specdojo-workspace/specdojo-lp; rewrite it relative to the new repository
  - repos specdojo-assets: path ../specdojo-assets -> /workspaces/specdojo-workspace/specdojo-assets; rewrite it relative to the new repository
  - agent members: .specdojo/agent-members.yaml
  - exec defaults: .specdojo/exec-defaults.yaml
[check-manually] kata: kata source changes after the move
  - 22 distinct specdojo kata ids referenced
  - kata are read from this repository's docs/ja/specdojo; install the specdojo npm package with a pinned version in the new repository

Summary: ok 2, needs-cleanup 1, check-manually 3
```

入力にあった prj-0002 から prj-0001 の個票への wikilink の 10 種類に加え、frontmatter の `derived_from` などにある `prj-0001:PJR-XXXX` の 4 種類も拾った。

### 5.4. CHANGELOG に書く事項

- 区分: Added
- 文案: `specdojo project move <project-id> --check` を追加しました。project を別のリポジトリへ移す前に、実行中の項目とタスク、exec のブランチと worktree、統合先のブランチ、定期実行、project をまたぐ参照、写す設定、kata の出所を、何も書き換えずに点検します。移す前に片付けが要るものがあると終了コード 1 で終わります。

### 5.5. 残課題

- `exec-worktrees` と `integration-branches` を含む prj-0002 の全体の出力は、人が `specdojo-prj-0002` の checkout で確かめる。
- 移す手順のガイドと、リポジトリをまたぐリンクは、入力で分けた別の項目で扱う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-8hcb-starters-repository-layout]]: 派生元。
- [[specdojo:command-reference|CLIコマンドリファレンス]]: 足したコマンドの説明。
