---
specdojo:
  id: prj-0001:pjr-gdmb-guarded-push-entry
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-11-28T04:25:36Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-D4RJ
  depends_on:
    - PJR-HPAW
---

# PJR-GDMB 範囲を守る push の入口を作り、オーケストレーターにだけ承認つきで許す

## 1. 概要

PJR-D4RJ の決定（選択肢 B）に従い、範囲を守る push の入口を specdojo のコマンドとして作る。オーケストレーターにだけ毎回の承認で許し、各環境の `git push` の deny と executor の守りは残す。PJR-HPAW で `specdojo git` の `push` を拒んだ後に、この入口だけを push の経路にする。

## 2. 入力

- PJR-D4RJ で選択肢 B を採った（indie、2026-11-28）。claude・codex・copilot・opencode は道具の側で git push を拒んでおり、本文の文言だけでは許せない
- PJR-HPAW で specdojo git の push を拒む。この入口はその後に作り、push の唯一の経路にする
- v0.10.0 に入れる。担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 完了条件

- push の入口を足す。名前とコマンドの形（例: `specdojo git push --project <id> [--branch <branch>]`）は executor が決め、理由を個票の対応結果に書く。
- 次のものは拒む。
  - `project/<id>/develop` と `feature/<project-id>/*` 以外のブランチへの push
  - `main` への push
  - `--force`・`--force-with-lease`・`+refspec` など、履歴を書き換える push
  - タグの push、`--all`・`--mirror`・`--delete`
  - 上流の先端の子孫でない（fast-forward にならない）push
- 送る前に、送るブランチ・remote・commit の範囲と件数を表示する。
- `--dry-run` で、送らずに表示だけを行える。
- exec の executor・reporter の実行中（runner が agent に渡す環境など、executor が判定の仕方を決める）に呼ばれたときは、git を起動する前に拒む。
- 判定の仕方と、すり抜けが残る場合はその内容を、個票の対応結果に書く。
- 書き込みの git 操作と同じロックに並べる。
- オーケストレーターの各環境の設定の案を、個票の対応結果と報告の `handoff` に書く。案の中身は次のとおり。
  - 環境は claude の `settings.orchestrator.json`、codex の rules、copilot、opencode、agy のラッパー（PJR-D5RS）
  - この入口だけを毎回の承認（ask など）で許す
  - `git push` の deny は残す
  - executor の設定は、この入口も拒む
- 文言の案も、個票の対応結果と報告の `handoff` に書く。
  - 対象は、`CLAUDE.md`・`AGENTS.md`・`.opencode/AGENTS.md`・`.github/copilot-instructions.md`・オーケストレーターの本文
  - 中身は、push はこの入口で、範囲の中だけ、毎回の承認を得て行うこと
  - feature ブランチ `feature/prj-0001/orchestrator-git-push`（b36caa3900）の案を元にしてよい
- 単体テストまたは統合テストで、次の場合を確かめている。
  - 範囲の中の push が通る
  - 範囲の外のブランチ・`main`・force・タグ・fast-forward にならない push を拒む
  - executor の実行中の呼び出しを拒む
  - `--dry-run`
- コマンドリファレンスとオーケストレーターの運用の説明に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`CLAUDE.md`・`AGENTS.md` など）は変えない。案は上のとおり個票の対応結果と報告の `handoff` に書き、反映は利用者の承認のもとオーケストレーターが行う。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                             | 担当 | 状態 | メモ                                                                                     |
| --- | -------------------------------- | ---- | ---- | ---------------------------------------------------------------------------------------- |
| 1   | 入口・排他・送信範囲の検査を実装 | DEV  | done | `guarded-push` を追加。remote の先端と commit ID を確定して、一つの同名 ref へ普通に送る |
| 2   | agent 実行中の拒否とテストを追加 | DEV  | done | 通常・trial・in-place・分割 worktree の起動境界に役割の印を追加                          |
| 3   | 利用説明と保護設定・文言の案     | DEV  | done | リファレンス・運用ガイドを更新。未反映の案と境界を下記へ記録                             |
| 4   | 整形と sandbox 内の検査          | DEV  | done | 検証結果は 5.4 節。型・lint・unit/integration などの指定済み親検証は runner が実施       |

## 5. 対応結果

### 5.1. 実装と判断

- コマンドは `specdojo guarded-push --project <id> [--branch <branch>] [--remote <name>] [--dry-run]` とした。`specdojo git -- <Git の引数>` の透過的な引数解析と分け、権限設定で入口全体を承認・拒否の対象にできるため。PJR-HPAW の拒否処理は維持し、拒否時の案内を新しい入口名へ更新した。
- `src/commands/guarded-push.ts` で project を必須にし、同じ project の develop / feature だけを同名の remote ref へ送る。remote は設定済みの名前のみ（既定 `origin`）、push URL が一つの場合だけ通す。任意の Git 引数・refspec を受け付けず、main・他 project・タグ・force・全件・mirror・削除の入口を持たない。
- remote の push URL の実際の先端を `ls-remote` で取得し、object だけを fetch して祖先関係を検査する。追跡 ref / upstream の設定を根拠にしない。表示する件数は既存ブランチなら先端との差分、新規なら到達できる全 commit であり、pack の転送件数ではない。dry-run も読み取り通信と object の fetch は行うが、push・ローカル ref・`FETCH_HEAD` の更新は行わない。
- 検査した commit ID と送信先 ref を固定する。remote 名を push に直接渡さず解決済み URL を使い、設定の mirror・push refspec の影響を避ける。タグの追随送信と submodule の push を明示的に無効化し、force を使わない。検査後の競合更新は通常の Git / server の fast-forward 検査に委ねる。
- 検査・表示から push と hook の終了まで、`specdojo git` と同じ project の `exec-lifecycle` ロックを保持する。対象 worktree の `.specdojo/specdojo.config.json` が必要で、`.env` は読み込まない。設定のない別 repository を暗黙の対象にはしない。
- `SPECDOJO_AGENT_ROLE` を `executeAgent`・trial の `spawnAgent`・`spawnAgentInPlace`・`exec worktree agent` の子プロセスへ渡す。executor / reporter の役割を親から上書きして付け、入口はこの変数が存在すれば値によらず Git 起動前に拒む。
- この印は認証ではなく誤呼び出しを止めるためのもの。環境変数を消しての再起動、改変した CLI、許可された hook・通信 helper などの任意コードまでは隔離しない。生の Git や他 project のロックとも直列化しない。下記の executor deny と、既存の保護設定・Git 状態ガードを併用する。

### 5.2. 保護設定の変更案（未反映）

反映は利用者の承認後にオーケストレーターが行う。下記の `specdojo` と `npx specdojo` の両方を扱い、`node dist/specdojo.js`・`tsx src/specdojo.ts`・shell / env 経由など別形式を広く allow しない。直接の `git push` の deny は全環境で維持する。実機で毎回の確認・キャンセル時の未送信・executor の拒否を確認するまでは、オーケストレーターの push 禁止を維持する。

| 環境                         | オーケストレーターの案                                                                                                                                                                                                                                             | executor / reporter の案                                                                                                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude                       | `settings.orchestrator.json` と配布原本の `permissions.ask` に `Bash(specdojo guarded-push:*)`・`Bash(npx specdojo guarded-push:*)` を追加。`permissions.deny` の `Bash(git push:*)` と絶対パス版を維持。ask と競合する広い allow は整理する                       | edit / review / report の deny に同じ入口の2パターンを追加し、既存の `Bash(npx specdojo:*)` 等の allow より優先させる                                                                                                                                       |
| Codex                        | orchestrator 用 rules に `prefix_rule(pattern = ["specdojo", "guarded-push"], decision = "prompt")` と `pattern = ["npx", "specdojo", "guarded-push"]` の prompt を追加。既存の git push の forbidden は維持し、毎回の実行で承認を求める                           | executor / reporter 用 rules は同じ2パターンを `forbidden` にする。共通 rules に入口の forbidden を置くと orchestrator の prompt も阻むため、役割別の rules 読み込み先と起動経路を分離する。既存の非対話 `approval_policy="never"` とネットワーク制限を維持 |
| Copilot                      | 対話起動で入口を含む `shell(specdojo:*)`・`shell(npx:*)` 等の包括 allow を置かず、入口の実行ごとに通常の tool 承認を求める。承認を以後の実行へ保存しない。git push の deny と、全 tool 自動許可を使わない方針は維持                                                | 起動引数へ `--deny-tool 'shell(specdojo guarded-push)'`・`--deny-tool 'shell(npx specdojo guarded-push)'` を追加。reporter の shell 禁止を維持                                                                                                              |
| OpenCode                     | Qwen / Gemma の `permission.bash` と配布原本で `specdojo guarded-push*`・`npx specdojo guarded-push*` を `ask` と明示し、広い規則より後で照合させる。`git push*` と絶対パス版は `deny`                                                                             | edit / review / report では同じ入口を `deny`。`specdojo *` の allow や dry-run の allow より後へ配置する                                                                                                                                                    |
| agy（PJR-D5RS の直接起動用） | `templates/antigravity/settings.orchestrator.json` の `permissions.ask` に `command(specdojo guarded-push)`・`command(npx specdojo guarded-push)` を追加。`toolPermission: "request-review"` と `command(git push)` の deny を維持。本文ラッパーにも下記を反映する | SpecDojo から起動する provider は復元しない。手動の executor 用設定を使う場合も入口は deny。既存の全 command 禁止の reporter は維持                                                                                                                         |

Codex の rules 分離・Copilot の承認保持・OpenCode の照合順・agy の既存設定との合成は、実 CLI の確認が必要な反映時の項目である。上の案を今回動作確認済みの権限設定とは扱わない。ローカルの設定と `templates/` の配布原本の両方へ反映し、本文のラッパーは生成・同期検査を行う。

### 5.3. 文言の変更案（未反映）

`CLAUDE.md`・`AGENTS.md`・`.opencode/AGENTS.md`・`.github/copilot-instructions.md` の Safety 相当箇所を次の内容にそろえる。

> オーケストレーターに限り、push は `npx specdojo guarded-push --project <id>` を用い、`project/<id>/develop` と `feature/<id>/*` の範囲内で、送るブランチ・remote・commit の範囲と件数を提示して毎回の承認を得て行う。直接の `git push`、main・タグ・履歴を書き換える push は行わない。executor・reporter はこの入口も使わない。登録簿などの同期専用ブランチは従来どおり specdojo の専用コマンドに任せる。破壊的変更・秘密情報の読み取りは禁止を維持する。

オーケストレーターの本文（`.agents/specdojo-orchestrator.agent.md`）の基本方針・禁止事項・feature / product repository の push 引き渡しの各箇所も上記と整合させ、次を加える。

> push の前に同じ引数で `--dry-run` を実行して範囲を示す。その送信ごとに承認を得て通常実行し、ブランチの先端・送信先・範囲が変わった場合は再表示・再承認する。許可範囲外は利用者へ引き渡す。npm の公開・リリースの公開は人が行う。

SSOT から Claude・Codex・Copilot・OpenCode と agy の本文・配布テンプレートを再生成する。既存の branch `feature/prj-0001/orchestrator-git-push` の文言は今回取り込まず、この入口名に合わせた上記を反映の基準にする。

### 5.4. 検証結果

- 単体テストで、役割の印がある4通り、範囲外のブランチ10通り、force・タグ・mirror・削除・任意引数9通りを Git 起動前に拒むことを検証する。
- 結合テストで、ローカル bare remote への develop / feature の作成・更新、設定された mirror / refspec / tag 追随送信の抑止、実際の remote の先端による非 fast-forward 拒否、表示後にローカル branch が変わった場合の送信 commit の固定、dry-run 時の ref / `FETCH_HEAD` 保持、push URL の採用・複数 URL の拒否、runner と同じロックの待機を検証する。通常・trial の executor / reporter の印と、既存の in-place・分割 worktree のテストにも印の確認を追加した。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を含む指定済み親検証は executor 内で重複実行せず、終了後の runner の evidence を正とする。追加したテストもそこで実行する。
- Prettier 整形、変更した Markdown の markdownlint、`npm run check:src-imports`、`npm run validate:history-links`、カタログ検証、register build、`git diff --check` が成功した。カタログには既存の未作成文書・参照等の警告があるが、エラーはない。カタログ検証と register build は `dotenv.config` をプロセス内で無効化して実行し、`.env` を読んでいない。YAML の変更はなく、`npm run validate:schema:file` は非適用。
- 外部 remote への push、実 agent CLI の起動、保護設定・Git 設定・result・登録簿の一覧・個票のステータスの変更は行っていない。

### 5.5. CHANGELOG に書く事項

- 区分: Added（v0.10.0）
- 行の文案: project の develop / feature ブランチだけを fast-forward で送る `specdojo guarded-push` を追加しました。送信範囲の表示、dry-run、exec の executor / reporter からの呼び出し拒否に対応します。オーケストレーターの利用は、役割別の権限設定と指示を更新し、毎回の承認を得る運用が前提です。

## 6. 関連ドキュメント

- [[prj-0001:pjr-d4rj-orchestrator-git-push-with-approval|PJR-D4RJ 入口と承認の決定]]
- [[prj-0001:pjr-hpaw-specdojo-git-push-bypass|PJR-HPAW Git ラッパーの迂回防止]]
- [[prj-0001:sysd-agent-settings|エージェント実行・共通設計]]
- [[prj-0001:sysd-orchestrator-agent-settings|オーケストレーターエージェント設定]]
- [[prj-0001:pjr-d5rs-agy-interactive-orchestrator|PJR-D5RS agy の直接起動]]
- [[specdojo:command-reference|コマンドリファレンス]]
- [[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]]
