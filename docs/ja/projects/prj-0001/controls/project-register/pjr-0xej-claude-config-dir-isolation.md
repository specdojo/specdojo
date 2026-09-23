---
specdojo:
  id: prj-0001:pjr-0xej-claude-config-dir-isolation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-25T22:47:29Z"
  due_on: "2026-10-31"
  completed_at: "2026-09-11T11:26:16Z"
  conclusion: 並行実行時の ~/.claude.json 競合は Claude Code 2.1.259 で上流修正されており、2.1.268 へ更新して TUI 稼働中に claude -p を 14 回並行起動しても、また PJR-08K1 を claude-expert-executor で 12 分実行しながら並行作業しても、JSON 破損・workspace trust のリセット・MCP/project 設定の消失は発生しなかった。CLAUDE_CONFIG_DIR による設定ディレクトリの分離は不要と判断し実装しない。再発時は再起票する。
---

# PJR-0XEJ claude系agentの設定ディレクトリを分離して並行実行できるようにする

## 1. 概要

PJR-E6HG で特定したとおり、Claude Code は起動のたびに共有の設定ファイルを書き換えるため、複数の claude プロセスが並行すると競合して JSON パースに失敗する。Claude Code 側に修正の予定はない。CLAUDE_CONFIG_DIR で設定ディレクトリを分離すると、実測では設定ファイル・セッション・バックアップまで含めて分離されることを確認した。ただし分離先は未認証状態であるため、専用プロファイルの認証をどう扱うかが課題となる。分離により claude 系 agent をオーケストレーターの待機なしで実行できるようにする。

### 調査済みの事実

- 共有設定ファイルは約49 KB で、内容の大半は対話 UI のための状態である。ヒントの表示履歴（`tipsHistory` 37件、`tipLifetimeShownCounts` 36件）、機能フラグのキャッシュ（`cachedGrowthBookFeatures` 546件）、利用統計（`numStartups` など）が占める。headless 実行に本質的に必要なのはアカウント情報とプロジェクトごとの信頼・許可設定程度である。
- 書き込みは起動のたびに発生し、ファイル全体の書き直しになる。書き込みを抑止するオプションは CLI にも公開ドキュメントにも見当たらない。
- `CLAUDE_CONFIG_DIR` を指定して実行したところ、分離先に設定ファイル・`sessions`・`projects`・`backups` が生成され、共有設定とは独立することを実測で確認した。ただし分離先は未認証であり、`Not logged in` で終了する。

### 1.1. 上流で修正されている（2026-09-10 確認）

並行実行時の競合は Claude Code 側で修正済みである。本項目の主要な動機が変わる。

```text
## 2.1.259
- Fixed concurrent sessions silently reverting each other's `~/.claude.json` changes
  — workspace trust no longer resets and MCP/project state is no longer lost when
  running many sessions at once
```

| 項目             | 版          |
| ---------------- | ----------- |
| 手元の版         | **2.1.226** |
| 修正が入った版   | **2.1.259** |
| changelog の最新 | 2.1.267     |
| npm の最新       | 2.1.267     |

手元が 33 版古く、修正を取り込めていない。記述は本項目が扱う事象と一致する。並行実行で
`~/.claude.json` が相互に巻き戻され、設定が失われるというものである。

以前は「上流では対応されない」と判断していたが、その後に修正されている。版を上げれば並行実行
できる可能性が高く、**設定ディレクトリを分離する必要性そのものが薄れる**。

### 1.2. 認証の引き継ぎは未解決

`CLAUDE_CONFIG_DIR` での分離は動作する。手元の 2.1.226 で実測した。

```text
分離先に生成されたもの: .claude.json / backups / projects / sessions
```

共有ファイルへは書き込まれない。ただし認証が引き継がれない。

```text
Not logged in · Please run /login
```

changelog を確認したが、認証を設定ディレクトリ間で共有する仕組みの追加はない。
`CLAUDE_CONFIG_DIR` 関連の変更はいずれも分離先を尊重する方向のもので、認証の共有ではない。

```text
- Respect CLAUDE_CONFIG_DIR everywhere
- Fixed IDE shell-integration lock files not respecting CLAUDE_CONFIG_DIR
```

### 1.3. 共有ファイルは現在も使われている

| 項目           | 起票時の記録 | 2026-09-10 |
| -------------- | ------------ | ---------- |
| `.claude.json` | 約 49 KB     | 53.5 KB    |

増えており、書き込みも継続している。分離しなければ共有ファイルへ書かれる点は変わらない。

### 1.4. 次に行うこと

版を上げて実測する。changelog の記述だけでは、この環境で解消するかを判断できない。claude CLI と
TUI を同時に動かして確かめる必要がある。

```sh
npm i -g @anthropic-ai/claude-code@latest
```

devcontainer の features 経由で導入されているが実体は npm グローバルパッケージで、
`/usr/local/share/npm-global/lib/node_modules/@anthropic-ai/claude-code` にある。

`sudo` が必要である。親ディレクトリは `node:npm` で書き込み可能だが、`@anthropic-ai` は
`root:npm` でグループ書き込み権を持たない。feature が root で作成するためである。

```text
drwxrwsr-x node:npm  .../lib/node_modules
drwxr-sr-x root:npm  .../lib/node_modules/@anthropic-ai
```

`sudo` なしで実行すると `EACCES: permission denied, rename` で失敗する。

なお devcontainer のリビルドでも最新版が入る。feature の install script は版を固定せず
`npm install -g @anthropic-ai/claude-code` を実行するため、npm が `@latest` を解決する。
ただしレイヤーがキャッシュされていると再実行されないため、確実に更新するにはキャッシュを
使わないリビルドが要る。

検証の結果、並行実行で競合しないことを確認できれば、本項目は不要として終端できる。残る問題が
あればその範囲が明確になる。

### 1.5. 版を更新した（2026-09-11）

2.1.226 から 2.1.268 へ更新した。修正が入った 2.1.259 を超えている。changelog で確認した
最新は 2.1.267 であったが、その後 2.1.268 が公開されていた。

```sh
sudo npm i -g @anthropic-ai/claude-code@latest
```

検証は行っていない。更新時点で稼働していたセッションは 2.1.226 で起動しており、プロセスは
置き換わらない。旧版の TUI と新版の CLI を並行させても正しい検証にならないため、新版同士で
行う必要がある。次回セッションは自動的に新版で起動する。

### 1.6. 検証の手順

新版同士で並行実行し、`~/.claude.json` が競合しないことを確かめる。

実務に近い形で行う。TUI で作業しながら claude 系 agent で exec を走らせる。

```sh
npm run orch:opus
# 別ターミナルで
specdojo exec run --register <PJR-XXXX> \
  --executor-by claude-expert-executor --reporter-by claude-reporter --worktree
```

これが通れば実用上の解決である。本セッションではこの組み合わせを避け、codex と gemma を
使っていた。

人工的な再現で確かめる場合は、共有ファイルを事前に保存してから繰り返し起動する。競合は確率的
に起きるため 1 回では検出できない。

```sh
cp /home/node/.claude-state/.claude.json /tmp/claude-json-before.json
# TUI 稼働中に数回実行
claude -p "1+1は？" --model sonnet
# 差分を確認
diff <(python3 -m json.tool /tmp/claude-json-before.json) \
     <(python3 -m json.tool /home/node/.claude-state/.claude.json)
```

判定は次による。

| 観察                               | 判定         |
| ---------------------------------- | ------------ |
| 設定が巻き戻らない、失われない     | 解消している |
| `workspace trust` がリセットされる | 未解消       |
| MCP / project の設定が消える       | 未解消       |

changelog が挙げる症状は `workspace trust no longer resets` と
`MCP/project state is no longer lost` であり、この 2 点を確認する。

### 1.7. 段階 A の検証結果（2026-09-11）

新版同士で並行起動し、共有設定が競合しないことを確認した。

前提として、8/29 に `--resume` で起動した 2.1.226 のセッションが `claude daemon` 配下の
`bg-pty-host` に保持されたまま残っていた。TUI を閉じてもこの構造では終了しないため、検証前に
`kill` で終了させ、検証は 2.1.268 同士で行った。

オーケストレーターの TUI（2.1.268）を稼働させたまま、次を 3 並行 × 3 ラウンドと 5 並行 × 1
ラウンドの計 14 回実行した。

```sh
claude -p "1+1は？" --model sonnet
```

| 観察項目                     | 結果                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| 終了コード                   | 14 回すべて 0。全件が `2` を返答                           |
| `is not valid JSON` の出力   | なし                                                       |
| `~/.claude.json` の妥当性    | 妥当な JSON。トップレベル 73 キーで増減なし                |
| `workspace trust`            | 3 プロジェクトとも `hasTrustDialogAccepted: true` を維持   |
| MCP / project の設定         | 変化なし                                                   |
| 事前スナップショットとの差分 | 機能フラグと実験データのキャッシュ更新、タイムスタンプのみ |

changelog が挙げる 2 症状（trust のリセット、MCP/project 状態の消失）はいずれも再現せず、
PJR-E6HG で観測した `JSON.parse` 失敗も発生しなかった。人工再現の範囲では 2.1.259 の修正が
有効と判断する。

なお `-p` モードでは `numStartups` が増えないため、書き込みの巻き戻り検出には使えない。差分と
キーの増減で判定した。

実務形式（claude 系 executor / reporter で `exec run` を走らせながら TUI で作業する段階 B）は
別途タイミングを見て実施する。

### 1.8. 段階 B の検証結果（2026-09-12）

実務形式でも競合は再現しなかった。

PJR-08K1 を `exec run --register --worktree` で `claude-expert-executor`（executor）と
`gemma-reporter`（reporter）により実行し、その間オーケストレーターの TUI（2.1.268）で
`specdojo grade list` など十数回のコマンドを並行して実行した。

| 観察項目                      | 結果                                                       |
| ----------------------------- | ---------------------------------------------------------- |
| executor の稼働時間           | 約 12 分（12:45:44Z〜12:58:03Z）                           |
| 並行作業中の `~/.claude.json` | 30 秒ごとの観測で一貫して妥当。73 キー、trust 3 件を維持   |
| `is not valid JSON` の発生    | なし                                                       |
| executor の停止理由           | claude の session limit（`You've hit your session limit`） |

停止は利用量の制限であり、PJR-E6HG の競合症状とは別の事象である。中断後は
`--executor-by codex-expert-executor --resume` で同じ worktree から再開して完了した。

なお session limit の文言は stdout に出るため、stderr だけを見る検出では見逃す。この点は本項目の
対象外とし、別途扱う。

## 2. 完了条件

- 専用の設定ディレクトリで claude 系 agent を実行できる。認証をどう扱うかが決まり、記録されている。同一アカウントで複数プロファイルを持つことの可否も確認する。
- 認証情報の複製を伴う方式は採らない。既存の設定ディレクトリをコピーして渡す方式は、秘密を扱わない運用方針に反するため対象外とする。
- `exec-defaults.yaml` の `command_template` または起動処理から、agent ごとに環境変数を渡せる。設定できるのは既定の分離先であり、agent の evidence や設定ファイルから任意の環境変数を注入できないようにする。
- claude 系 agent を実行しながらオーケストレーターが並行して作業しても、共有設定の競合による失敗が発生しないことを確認できている。executor と reporter の双方で確認する。
- 分離先が未認証の場合の挙動が定義されている。実行前に検出して分かる形で失敗するか、従来の設定へ退避するかを決める。認証切れに気づかないまま実行が失敗し続ける状態を作らない。
- 実現できない場合は、その理由と代替（codex 系での統一、オーケストレーターの待機）を記録して完了とする。本項目は手段の実現性の確認を含む。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。
- claude を 2.1.259 以降へ更新し、並行実行で `~/.claude.json` が競合しないことを実測で確認して
  いる。claude CLI と TUI を同時に動かして確かめる。
- 上記の検証で競合が解消している場合、本項目を不要として終端する判断が記録されている。分離を
  実装しない結論も成果として扱う。

## 3. 作業内容

| No  | 作業                                                                             | 担当 | 状態      | メモ                                                     |
| --- | -------------------------------------------------------------------------------- | ---- | --------- | -------------------------------------------------------- |
| 0   | claude を最新へ更新し、並行実行で競合しないことを実測する                        | ARC  | done      | 2.1.268 へ更新。人工再現 14 回で競合なし                 |
| 1   | 専用プロファイルの認証方法と、同一アカウントでの複数プロファイルの可否を確認する | ARC  | cancelled | 上流修正により設定ディレクトリの分離は不要               |
| 2   | agent ごとに環境変数を渡す仕組みを設計し、注入経路を限定する                     | ARC  | cancelled | 同上                                                     |
| 3   | 分離先が未認証の場合の挙動を決めて実装する                                       | ARC  | cancelled | 同上                                                     |
| 4   | claude 系 agent と並行作業して競合が起きないことを確認する                       | ARC  | done      | PJR-08K1 の claude executor 稼働中に並行作業して競合なし |

## 4. 対応結果

- 起票の根拠であった並行実行時の `~/.claude.json` 競合は、Claude Code 2.1.259 で上流修正されていることを changelog で確認した。
- claude を 2.1.226 から 2.1.268 へ更新し、新版の TUI を稼働させたまま `claude -p` を計 14 回並行起動した。全件が終了コード 0 で、共有設定の JSON 破損、`workspace trust` のリセット、MCP / project 設定の消失はいずれも発生しなかった。
- 上記により、`CLAUDE_CONFIG_DIR` による設定ディレクトリの分離と、それに伴う認証の引き継ぎ・環境変数の注入経路・未認証時の挙動の設計は不要と判断し、実装しない。
- 実務形式でも確認した。PJR-08K1 を claude-expert-executor で実行中にオーケストレーターが並行作業し、`~/.claude.json` の競合は発生しなかった。executor の停止は session limit によるもので、競合とは別の事象である。競合が再発した場合は、その事象を根拠に再起票する。
- 検証で用いた旧版セッションの残存は、`claude daemon` 配下の `bg-pty-host` が `--resume` セッションを保持することによる。TUI を閉じても終了しないため、版の更新後は旧版プロセスの残存を `ps` で確認する必要がある。

## 5. 関連ドキュメント

- 根本原因の記録: [[prj-0001:pjr-e6hg-claude-reporter-json-failure|PJR-E6HG claude-reporterがJSON解析失敗で再現性をもってブロックする]]
- agent の起動設定: [[specdojo:exec-config-guide|exec設定ガイド]]
- agent の権限方針: [[prj-0001:pjr-3s8q-agent-writable-config-scope|PJR-3S8Q agent が書き込める設定の範囲]]
