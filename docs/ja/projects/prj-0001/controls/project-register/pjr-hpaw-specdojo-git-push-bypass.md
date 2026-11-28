---
specdojo:
  id: prj-0001:pjr-hpaw-specdojo-git-push-bypass
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-11-28T04:16:53Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-D4RJ
---

# PJR-HPAW specdojo git が push を止めずに通し、executor が git push の deny をすり抜けられる

## 1. 課題内容

specdojo git -- push が git push をそのまま実行するため、npx specdojo を許された executor が push の deny をすり抜けられる。v0.10.0 の前に push を拒むように直す

## 2. 入力

- src/commands/git.ts は push を止めずに git へ渡す（2026-11-28 の確認）。executor の .specdojo/claude/settings.edit.json は Bash(npx specdojo `*)` を許し、deny は Bash(git push `*)` の形だけを見る。codex の rules も git push の形だけを見る
- PJR-D4RJ でオーケストレーターの push を守りのある入口で許すと決めた際に見つけた。入口は別の todo で作る
- v0.10.0 に入れる。担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 影響範囲

| 観点         | 内容                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| スコープ     | `specdojo git`（`src/commands/git.ts`）と、それを許している各 provider の権限の設定                              |
| スケジュール | v0.10.0 の前に直す                                                                                               |
| コスト       | 小さい                                                                                                           |
| 品質         | 成果物の本文などから指示を差し込まれた executor が、Dev Container の共有の GitHub 認証で push できるおそれがある |
| 関係者       | `specdojo git` を使うオーケストレーターと、exec の executor・reporter                                            |

## 4. 対応方針

| 観点     | 内容                                                                                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `specdojo git -- <git の引数>` は書き込みの git 操作をロックに並べるための入口で、`push` を止めずに git へ渡す。executor の claude の設定は `npx specdojo *` を許し、`git push` の deny は `git push` の形しか見ない |
| 対応策   | `specdojo git` で `push` を拒む。拒み方（サブコマンドの判定、global option を挟んだ形・別名の扱い）は executor が決め、理由を個票の対応結果に書く                                                                    |
| 依存事項 | PJR-D4RJ の守りのある push の入口は別の todo で作る。この項目ではその入口を作らない                                                                                                                                  |
| 完了条件 | 下の一覧のとおり                                                                                                                                                                                                     |

- `specdojo git --project <id> -- push ...` を、git を起動する前にエラーで止める。global option（`-C`・`-c` など）を前に置いた形も止める。エラーには、push は人が行うか、PJR-D4RJ の入口を使うことを書く。
- git の別名（alias）で `push` を呼ぶ形を止められるかを確かめる。止められない場合は、その理由と残る危うさを個票の対応結果に書く。
- `push` 以外の、remote を書き換える操作（例: `send-pack`）で同じ穴がないかを確かめ、あれば同じく止める。何を止めたかと理由を個票の対応結果に書く。
- `commit`・`merge` など今の使い方と、読み取りのコマンドは今どおり動く。
- 単体テストで、`push`、global option を前に置いた `push`、今どおり通る操作を確かめている。
- コマンドリファレンスの `git` の説明に、`push` を拒むことを書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 5. 対応結果

### 5.1. 実装と判断

- `src/commands/git.ts` の引数解析で、`push`・`send-pack`・`http-push`・`receive-pack` を Git の起動前に拒否する。前二つは通常の push と pack 送信、`http-push` は HTTP 経由の送信、`receive-pack` は受信側の ref 更新を行う入口のため拒否した。エラーには、人が push するか、PJR-D4RJ で予定している守りのある入口を使うことを記載した。
- 既存の global option 解析を使い、`-C`・`-c` の分離形・連結形、`--git-dir`・`--work-tree`・`--namespace`・`--config-env` の値を飛ばしてサブコマンドを判定する。拒否は worktree の解決・設定の参照・ロックの取得より前に行う。
- 許可する組み込みコマンドを明示し、alias・未知のコマンド・外部の `git-*` コマンドを一律に拒否した。alias の設定場所をたどったり、Git に展開させたりせず、通常の alias・連鎖・`!` で始まるシェル alias とも実行しない。安全な alias も通らなくなるが、Git 起動前に拒否を確定でき、実行までの設定変更にも左右されない方式を選んだ。既存の組み込みコマンドは同名 alias では置き換わらない。
- `remote-ext`・`remote-https` などの通信 helper の直接実行、任意のコマンドを渡せる `bisect`・`submodule`・`for-each-repo` も許可しない。`--exec-path` による補助プログラムの差し替えも拒否する。`commit`・`merge`・既存の読み取りコマンドのロック判定と実行手順は維持し、fetch・pull・branch・tag・stash・worktree なども許可した。
- [[specdojo:command-reference|コマンドリファレンス]] の git 節に、拒否する操作、alias の互換性への影響、設定されたプログラムとの境界を記載した。

### 5.2. 検証

- 単体テストに拒否する26通りの引数を追加した。直接の push、global option 付き、別の送信コマンド、alias・連鎖・シェル alias、外部コマンドについて、エラーの案内と `spawn` / `spawnSync` が呼ばれないことを検証する。安全な alias も拒否するケース、既存の commit・merge・読み取り判定を残し、オプション値・commit メッセージ・pathspec 内の `push` などを誤って拒否しないケースも追加した。
- 結合テストに、CLI の `--project p -- -C missing push` がリポジトリも project 設定もない場所で終了コード1と拒否理由を返すケースを追加した。既存の commit、hook、読み取り、ロックの回帰テストは維持した。
- 初回実装時は Prettier 整形、`npm run check:src-imports`、`npm run validate:history-links`、hook のカタログ検証が成功した。カタログ検証には変更対象外の未作成文書・re-export 参照などの警告があり、エラーはない。カタログ検証と register build は `dotenv.config` をプロセス内で無効にして実行し、`.env` を読まない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、その他の指定済み親検証は executor 内で実行せず親 runner に委ねる。追加テストの実行結果を含め、親の evidence を正とする。
- 前回の親検証で `tests/src/commands/git.test.ts` の `import()` 型注釈が `@typescript-eslint/consistent-type-imports` 違反となったため、再開時に既存の `childProcess` import を参照する型指定へ修正した。mock の動作は維持し、lint・型検査・テストの再実行は親 runner に委ねる。
- 前回の再開で履歴リンクの全体検査を止めていた、別項目 PJR-D5RS の result の Markdown リンク3件は修正済みで、今回の `npm run validate:history-links` は成功した。`npm run check:src-imports`、カタログ検証、register build も再実行して成功した。別項目の result は本 executor では編集していない。

### 5.3. 制限と申し送り

- この対処は Git に直接渡すサブコマンドと alias・外部コマンドの制限であり、Git 全体を隔離するものではない。許可した操作から起動する hook・pager・外部 diff・通信 helper は引き続き実行され、それらが push を呼ぶ危うさは残る。設定の実行コードまで信頼できない executor を隔離する場合は、別途それらの設定・実行権限と共有認証の扱いを見直す必要がある。
- 本項目の拒否処理に保護設定の変更は不要と判断し、権限設定・依存・Git 設定は変更していない。PJR-D4RJ の入口の実装・権限の変更は同決定の後続項目で扱う。`CHANGELOG.md`、result、登録簿の一覧、個票のステータスは変更していない。

### 5.4. CHANGELOG に書く事項

- 不具合修正: `specdojo git` が `push`・`send-pack` などの送信操作を Git 起動前に拒否するよう修正した。global option を前に置いた呼び出しも拒否し、alias・外部コマンド経由の迂回を防ぐため、実行対象を許可した組み込みコマンドに限定した。

## 6. 関連ドキュメント

- [[prj-0001:pjr-d4rj-orchestrator-git-push-with-approval|PJR-D4RJ 守りのある push の入口の決定]]
- [[prj-0001:pjr-30sa-specdojo-git-serialized|PJR-30SA Git の書き込みの直列化]]
- [[specdojo:command-reference|コマンドリファレンス]]
