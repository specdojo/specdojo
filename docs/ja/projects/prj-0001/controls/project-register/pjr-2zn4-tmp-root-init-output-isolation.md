---
specdojo:
  id: prj-0001:pjr-2zn4-tmp-root-init-output-isolation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-12T13:48:46Z"
  block_reason: "parent validation failed: test-unit"
  derived_from:
    - PJR-5FTV
  autopilot: approved
  commit_type: fix
  commit_scope: test
---

# PJR-2ZN4 テストと検証が /tmp の直下に init の出力を残さないようにする

## 1. 概要

どの処理が /tmp の直下に specdojo init の出力を残したかを確かめ、テストと agent の確認の手順を一時ディレクトリに閉じ込める

## 2. 入力

- PJR-5FTV の修正。今晩の夜間に流す（indie が 2026-11-12 に承認）

## 3. 完了条件

- PJR-5FTV の原因（どのテスト・検証の手順・agent の作業が `/tmp` の直下に `specdojo init` の出力を残したか）を、テストのコードと PJR-0F94 の実行記録から確かめ、個票の対応結果に書いている。確かめきれない場合は、候補と理由を書く。
- `init` を流すテストが、`mkdtemp` で作った一時ディレクトリの中だけに書き込み、`/tmp` の直下や `os.tmpdir()` そのものを cwd や出力先にしない。テストの共通の setup か静的な検査で、これを確かめる（`.github/instructions/vitest.instructions.md` の「ファイル I/O と一時ディレクトリ」に従う）。
- `/tmp` の直下に `.specdojo/`・`specdojo.config.json`・`lefthook.yml` などがあっても、`init` のテストが既存の設定を拾って落ちないことを、回帰テストで確かめている（一時ディレクトリの親を辿って設定を探さない、など、原因に合った形で）。
- agent が「空のリポジトリで確かめる」完了条件を実行するときに一時ディレクトリを使うよう、関連するガイドか exec plan の共通規約の書き方を直す必要があるかを判断し、要る場合は直すか変更案を書いている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                               | 担当     | 状態 | メモ                                                   |
| --- | -------------------------------------------------- | -------- | ---- | ------------------------------------------------------ |
| 1   | 原因を確かめ、テストを一時ディレクトリに閉じ込める | executor | done | `specdojoRootDir` 境界遮断、拒否ガード、回帰テスト追加 |

## 5. 対応結果

### 実施内容

1. **PJR-5FTV の原因の特定**:
   - `/tmp` の直下に出力されていたファイル（`.markdownlint.yaml`・`.specdojo/`・`docs/ja/projects/prj-1234`・`lefthook.yml`、および PJR-0F94 の対応記録によれば `.devcontainer`・`.prettierrc`・`.vscode` 等）のうち、`prj-1234` は `specdojo init` の CLI 既定値（`prj-0001`）ではなく、`tests/src/commands/init.test.ts` 内でのみ使用される project ID であることを特定しました。
   - 原因の発生機序：
     - 何らかの作業または先行テストで `/tmp/.git`（空ディレクトリ）が残存していた。
     - `specdojoRootDir()` が親階層をルートまで探索する際、カレントディレクトリに `.git` があっても初期化前で `.specdojo/specdojo.config.json` がない場合、親ディレクトリの `/tmp/.specdojo/specdojo.config.json` を拾って優先してしまい、`specdojoRootDir()` が `/tmp` を返すようになっていた。
     - 一度 `/tmp` に設定が出力されると、以後のテストがすべて `/tmp` をリポジトリルートと誤認して `/tmp` 直下へ書き込み続ける連鎖反応が発生していた。
     - PJR-0F94 の 1 回目実行（2026-11-08 14:39〜15:46 UTC = 2026-11-09 00:39〜00:46 JST）における単体テストや検証の実行時間帯と、ファイル生成時刻（00:25, 00:33）が一致しており、この実行過程で漏洩と連鎖が発生し、後続の PJR-FTRC 等でテストが失敗する原因となった。

2. **探索の境界遮断と親設定拾いの防止**:
   - `src/shared/specdojo-config.ts`: `specdojoRootDir` を改修し、親ディレクトリへ登る探索において一時ディレクトリのルート `systemTmp`（`/tmp` 等）に到達した場合は親へ探索を広げないよう遮断しました。また、カレントまたは祖先で `.git`（Git リポジトリ境界）に到達した場合は、それより親階層の `.specdojo/specdojo.config.json` を探索しないようにし、リポジトリ外の親設定を誤認するのを防止しました。
   - `src/shared/markdownlint-config.ts`: `hasMarkdownlintConfig` を改修し、親ディレクトリへ `.markdownlintrc` を探す際、`systemTmp` または `.git` 境界に達した時点で探索を打ち切るように修正しました。これにより、親ディレクトリにある既存設定を拾って「設定済み」と誤認し生成をスキップする問題を解消しました。

3. **一時ディレクトリ直下への初期化防止（安全ガード）**:
   - `src/commands/init.ts` の `runInit` および `src/shared/specdojo-config.ts` の `config init` に、解決された `repoRoot` が `tmpdir()`（`/tmp` 直下）そのものである場合に実行を拒否するガード例外（`Refusing to initialize specdojo directly under temporary directory root.`）を実装しました。

4. **テストの隔離とカレントディレクトリ復元の徹底**:
   - `tests/src/commands/init.test.ts`: 全テストの `finally` 節で `process.chdir(originalCwd)` を呼んでから一時ディレクトリを `rmSync` するように改修し、削除済みディレクトリにプロセスが留まるのを防止しました。
   - `tests/src/commands/init-isolation.test.ts`: `init` を実行するテストが `mkdtemp` で作られた一時ディレクトリ配下でのみ実行され、`tmpdir()` 直下を cwd や出力先にしていないことを静的 AST 解析およびランタイム境界テストで検証するテストを追加しました。
   - `tests/src/commands/init.test.ts`: 親ディレクトリに `.specdojo/specdojo.config.json` や `lefthook.yml`、`.markdownlint.yaml` が存在していても、子ディレクトリの一時リポジトリが親の設定を拾わずに正しく独立して初期化されることを検証する回帰テストを追加しました。

5. **ガイド・共通規約の改善判断**:
   - agent が「空のリポジトリで確かめる」完了条件を実施する際、コマンドごとにシェルセッションが分かれる環境で `mktemp -d` の後に `cd` が外れて `/tmp` 直下で作業してしまうリスクがあります。
   - 判断: プログラム側で `runInit` と `config init` に `/tmp` 直下での初期化拒否ガードを設けたため事故は防げますが、運用上の手戻りを防ぐため、`docs/ja/specdojo/exec-templates/xp-common-conventions-template.md` および `docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md` に以下の注意・変更案を反映・推奨します。
     - **変更案**: 「空のリポジトリでの検証を行う場合は、必ず `mktemp -d` 等で一時ディレクトリを作成し、同一コマンドチェーン内（例: `DIR=$(mktemp -d) && (cd "$DIR" && ...) && rm -rf "$DIR"`）で移動・検証・削除を完結させる。`/tmp` の直下や `os.tmpdir()` をそのまま cwd や出力先にしてはならない。」

### 迷った点と決定理由

1. **`specdojoRootDir` の探索停止境界の設計**:
   - `specdojoRootDir` がどの境界で親探索を止めるべきか検討しました。`.git` が見つかった場所は Git リポジトリの境界であるため、その外側の親ディレクトリにある `.specdojo` を拾うべきではないと判断し、`.git` を見つけた時点で親探索を打ち切るようにしました。また、一時ディレクトリ内でテストを実行するケースを考慮し、`systemTmp`（`tmpdir()`）に到達した時点でも親探索を打ち切るようにしました。
2. **`/tmp` 直下での実行に対する挙動**:
   - ユーザーや agent が `/tmp` 直下で意図的に `init` を実行したい稀なケースがあるかを検討しましたが、`/tmp` 直下への設定ファイルやリポジトリ構成の出力はシステム汚染や並行テストの破壊を引き起こす重大な害があるため、明確にエラーとして拒否する（`Refusing to initialize specdojo directly under temporary directory root.`）決定としました。

### 5.1. CHANGELOG に書く事項

#### 変更

- `specdojo init` および `specdojo config init` において、一時ディレクトリのルート（`/tmp` 直下）での初期化を拒否する安全ガードを追加し、親ディレクトリの設定を誤認しないよう探索境界を改善しました。

## 6. 関連ドキュメント

- [[prj-0001:pjr-5ftv-tmp-root-init-output-leak]]
