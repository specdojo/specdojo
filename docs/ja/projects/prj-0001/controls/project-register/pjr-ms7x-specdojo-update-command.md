---
specdojo:
  id: prj-0001:pjr-ms7x-specdojo-update-command
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-20T13:57:09Z"
---

# PJR-MS7X specdojo update で、版の更新と移行の案内をまとめて行えるようにする

## 1. 概要

npm i -D では版が上がるだけで、CHANGELOG の動きが変わる点や設定の手直しを利用者が自分で探す必要がある。specdojo update で、版の比較・CHANGELOG の表示・更新・更新の後の確認をまとめて行う

## 2. 入力

- 利用者の提案（2026-11-20）: specdojo の更新は npm i -D で行っているが、specdojo update のようなコマンドで行えた方がよい
- orchestrator の案（2026-11-20）: 1. 今の版と npm の latest を比べる。2. その間の CHANGELOG の「利用者から見て動きが変わる点」を表示する。3. 利用リポジトリの package manager（npm・pnpm・yarn）で更新する（--dry-run あり）。4. 更新の後に設定の検証と kata status を流し、手直しの要る点を表示する
- orchestrator の調べ（2026-11-20）: 0.9.1 では、repos を宣言した project の opencode の `command_template` に --agent が要る変更があり、版を上げるだけでは気づけない
- 2026-11-22、PJR-09HA で skill specdojo-exec-in-session も config scaffold で配るようになった。scaffold は --force なしで既にあるファイルを上書きしないため、版を上げても配ったファイル（skill・agent 定義・rules）は古いまま残る。
- 決定（2026-11-22、indie）: 手直しは対話で行う。候補ごとに差分を示して聞き、対話できないときは何も書き換えず一覧だけを出す。--yes は作らない。
- 決定（2026-11-22、indie）: @specdojo/docs-lint・docs-site は入っているときだけ同じ回で上げる。package.json の版の指定の形（^ か固定か）は保つ。
- 決定（2026-11-22、indie）: 難しさは hard、executor は opus-executor、代わりは sonnet-executor。

## 3. 完了条件

- 新しいコマンド `specdojo update` を足す。`--dry-run`（何も書き換えず、するはずのことを示す）、`--no-interactive`（手直しを聞かず一覧だけを出す）、`--to <spec>`（上げる先の版、または tarball のパス。省くと npm の `latest`）を持つ。
- 手順 1: 利用リポジトリに入っている `specdojo` の版と、上げる先の版を比べて示す。同じ版なら版の更新を飛ばし、手順 4 の確かめだけを行う。
- 手順 2: 今の版から上げる先の版までの `CHANGELOG.md` の節を、版ごとに示す。どの時点の CHANGELOG を読むか（更新の前に取りに行くか、更新の後のものを読むか）は executor が決め、理由を個票の対応結果に書く。
- 手順 3: 利用リポジトリの package manager（lockfile から npm・pnpm・yarn を判定）で更新する。`package.json` の版の指定の形（`^` か固定か）は保つ。`@specdojo/docs-lint`・`@specdojo/docs-site` は、入っているときだけ同じ回で上げる。`--dry-run` では実行するコマンドを示すだけにする。
- 手順 4: 更新の後、`config scaffold` で配ったファイル（skill・agent 定義・rules など、利用リポジトリにある provider の分）が、新しい版の配る原本と違わないかを確かめる。
- 手直しは対話で行う。違うファイルごとに、差分と、関係する CHANGELOG の行を示し、「適用する／飛ばす／残り全部に適用する」を聞く。利用者が手で直したファイルも上書きの前に差分を示して聞く。
- 端末が対話できないとき（stdin が TTY でないとき）と `--no-interactive` のときは、何も書き換えず、手直しの候補と `config scaffold --provider <name> --force` などの案内を一覧で出す。黙って書き換える経路を作らない。`--yes`（全部を聞かずに適用する）は作らない。
- 設定ファイル（`specdojo.config.json`・`exec-defaults.yaml` など）の書き換えを候補に出すかは _UNDECIDED_ とする。最初の版では書き換えず、CHANGELOG の該当の行を示すだけにする。規則を持って書き換える案があれば、個票の対応結果に書く。
- `git commit` と `git push` はしない。終わりに、変わったファイルの一覧と、commit を利用者に促す文を出す。
- 単体テストで、版の比較、package manager の判定と版の指定の保持、CHANGELOG の範囲の切り出し、配ったファイルの差分の検出、対話での適用・飛ばし・残り全部、対話できないときに何も書き換えないこと、`--dry-run` で何も書き換えないことを確かめる。package manager の実行と npm への問い合わせは、テストでは差し替える。
- `command-reference` に `update` の節を足し、導入のガイド（版を上げる手順を書いている文書）を直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分「追加」と行の文案を書く。
- `package.json`・`lefthook.yml` などの保護された設定の変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- 統合の後、オーケストレーターが空のリポジトリに npm の 0.9.1 を入れて `config scaffold --provider claude` を流し、`npm pack` した tarball を `--to` に渡して `specdojo update` を流す。版の更新、CHANGELOG の表示、skill の写しが古いことの検出と対話での適用、`--no-interactive` で書き換えないことを確かめる。
- 2 回目の実行（2026-11-22）: 統合の後の確かめで、`update` を持たない版（0.9.2 まで）では `npx specdojo update` が `unknown command 'update'` で止まることが分かった。`README.md`・`quick-start-guide`・`command-reference` の `update` の節に、`update` を持たない版から上げる最初の 1 回は `npx specdojo@latest update`（版を指定する場合は `npx specdojo@<版> update`）で呼ぶことを書く。オーケストレーターは、0.9.1 の入ったリポジトリで `npx --package=<tarball> specdojo update` が新しい版の `update` として動くことを確かめた。個票の `### 5.1. CHANGELOG に書く事項` の文案にも、この呼び方を 1 文足す。`src/` は変えない。

## 4. 作業内容

| No  | 作業                                                                       | 担当                  | 状態 | メモ                                                                                                              |
| --- | -------------------------------------------------------------------------- | --------------------- | ---- | ----------------------------------------------------------------------------------------------------------------- |
| 1   | 版の比較と CHANGELOG の範囲の切り出し                                      | DEV                   | done | 更新の前に取り出した新しい版の CHANGELOG を読む（対応結果の「CHANGELOG を読む時点」）                             |
| 2   | package manager の判定と更新                                               | DEV                   | done | lockfile で判定し、`^`・`~`・固定の形を保つ。docs-lint・docs-site は入っているときだけ                            |
| 3   | 配ったファイルの差分の検出と対話での手直し                                 | DEV                   | done | 対話できないときと `--no-interactive`・`--dry-run` は一覧だけ                                                     |
| 4   | テストと文書、CHANGELOG の文案                                             | DEV                   | done | 単体テスト 35 件、`command-reference`・Quick Start・README、文案は「CHANGELOG に書く事項」                        |
| 5   | 空のリポジトリで 0.9.1 から上げて確かめる                                  | specdojo-orchestrator | open | 統合の後にオーケストレーターが行う。npm の取得と実 tarball が要り、executor の sandbox では実行できないため未実施 |
| 6   | `update` を持たない版からの最初の 1 回の呼び方を文書に書く（2 回目の実行） | DEV                   | done | `README.md`・Quick Start・`command-reference` の `update` の節と、CHANGELOG の文案に足した。`src/` は変えていない |

## 5. 対応結果

- `specdojo update` を足した（`src/commands/update.ts`、`src/update/`）。`--to <spec>`（版・範囲・tag・tarball のパス、省くと `latest`）、`--dry-run`、`--no-interactive` を持つ。`--yes` は作っていない。
- 手順 1: `node_modules/specdojo/package.json` の版と上げる先の版（tarball は `tar` で `package/package.json` を読む、npm は `npm view specdojo@<spec> version --json`）を比べる。同じ版か上げる先が古いときは更新を飛ばし、今入っている版の原本で手順 4 だけを行う。
- 手順 2（CHANGELOG を読む時点）: 更新の前に、上げる先の版のパッケージを一時ディレクトリへ取り出し（tarball は展開、npm は `npm pack` してから展開）、その `CHANGELOG.md` を読む。理由は次のとおり。
  - CHANGELOG は累積のため、新しい版のものに今の版との間の節がすべてある。今入っている古い版のものには無い。
  - 更新の前に示せるため、`--dry-run` でも本番と同じ内容を示せる。
  - 同じ取り出したパッケージを手順 4 の比べる原本にも使え、yarn PnP のように `node_modules/specdojo` ができない構成にも依らない。代わりに tarball を 1 回余分に取りに行く。
- 手順 3: lockfile（`pnpm-lock.yaml`→pnpm、`yarn.lock`→yarn、`package-lock.json`→npm、無ければ npm）で判定する。`^`・`~` は範囲付きの引数で、固定は `--save-exact`（yarn は `--exact`）で形を保つ。依存の区分（`devDependencies`・`dependencies`）ごとにコマンドを分ける。`@specdojo/docs-lint`・`@specdojo/docs-site` は `package.json` にあるときだけ npm の `latest` へ上げ、入っている版が新しければ飛ばす。`--dry-run` ではコマンドを示すだけにする。tarball から入れると `package.json` にはパスが記録される旨を表示する。
- 手順 4: 使っている provider（共有の skill 以外の写しが 1 つでもある provider）について、`config scaffold` の配置規則（`buildProviderScaffoldPlan`）で新しい版の原本と比べる。中身が違うファイルと、新しい版で増えたファイルを候補にする。今の版の原本と同じなら「前の版のまま」、違えば「手で直した可能性があり、適用すると手の修正を上書きする」と示す。前の版にもあったのに無いファイルは利用者が消したものとして候補にしない。
- 手直し: 候補ごとに unified 形式の差分（200 行で打ち切り）と、パスや skill 名に触れる CHANGELOG の行を示し、`y`（適用）・`n`（飛ばす、空の入力も同じ）・`a`（残り全部に適用）を聞く。stdin が TTY でないとき、`--no-interactive`・`--dry-run` のときは何も書き換えず、一覧と `npx specdojo config scaffold --provider <name> --force` の案内（手の修正も上書きすることを添える）を出す。
- 設定ファイル: 書き換えない。`specdojo.config.json`・`specdojo.local.config.json`・`exec-defaults.yaml`・`agent-members.yaml`・`pm-members.yaml`・`command_template`・`lefthook.yml` に触れる CHANGELOG の行を「手で見直す点」として示す。
- 終わりに変わったファイル（`package.json`・lockfile・適用したファイル）を示し、commit を利用者に促す。`git commit`・`git push` はしない。
- テスト: `tests/src/update/` に単体テスト 35 件（版の比較、CHANGELOG の範囲、package manager の判定と版の指定の保持、配ったファイルの差分の検出、対話での適用・飛ばし・残り全部、手で直したファイルの表示、TTY でないときと `--no-interactive` で書き換えないこと、`--dry-run` で何も書き換えないこと、同じ版、tarball、更新の失敗）。npm への問い合わせ・パッケージの取り出し・package manager の実行・対話は deps で差し替える。
- 文書: [[specdojo:command-reference|CLIコマンドリファレンス]] に `update` の節を足し、[[specdojo:quick-start-guide|Quick Start ガイド]] と `README.md` の導入に版の上げ方を足した。版を上げる手順を専用に書いた導入の文書は見つからなかったため、導入の手順を書いている 2 つを直した。
- _UNDECIDED_: 設定ファイルの書き換えを候補に出すか。規則を持って書き換える案として、CHANGELOG の節に機械可読の移行の記述（例: 「`exec-defaults.yaml` の `providers.opencode.command_template` に `--agent` が無ければ足す」の JSON Patch 風の宣言）を版ごとに同梱し、update が該当するときだけ差分を示して聞く案がある。最初の版では入れていない。
- 残り: 作業内容の No.5（空のリポジトリで npm の 0.9.1 から `npm pack` の tarball へ上げる確かめ）はオーケストレーターが統合の後に行う。
- 保護された設定（`package.json`・`lefthook.yml` など）の変更は要らなかった。
- 2 回目の実行（2026-11-22）: `update` を持たない版（0.9.2 まで）では `npx specdojo update` が `unknown command 'update'` で止まるため、最初の 1 回は `npx specdojo@latest update`（版を指定する場合は `npx specdojo@<版> update`）で呼ぶことを、`README.md`・[[specdojo:quick-start-guide|Quick Start ガイド]]・[[specdojo:command-reference|CLIコマンドリファレンス]] の `update` の節に書いた。CHANGELOG の文案にも 1 文足した。`src/` は変えていない。

### 5.1. CHANGELOG に書く事項

- 区分: 追加
- 文案: `specdojo update` を追加しました。入っている版と上げる先の版（`--to <spec>` で版・tag・tarball のパスを指定、省くと npm の `latest`）を比べ、その間の `CHANGELOG.md` を版ごとに示してから、lockfile から決めた package manager（npm・pnpm・yarn）で版の指定の形（`^`・`~`・固定）を保って更新します。`@specdojo/docs-lint`・`@specdojo/docs-site` は入っているときだけ同じ回で上げます。更新の後、`config scaffold` で配った skill・agent 定義・rules が新しい版と違うときは、ファイルごとに差分と関係する CHANGELOG の行を示して、適用する・飛ばす・残り全部に適用するを聞きます。stdin が TTY でないときと `--no-interactive` のときは書き換えず一覧と案内だけを出し、`--dry-run` では何も書き換えません。設定ファイルは書き換えず、関係する CHANGELOG の行を示します。`update` を持たない版（0.9.2 まで）から上げる最初の 1 回は、`npx specdojo@latest update`（版を指定する場合は `npx specdojo@<版> update`）で呼びます（PJR-MS7X）。

## 6. 関連ドキュメント

- [[specdojo:command-reference|CLIコマンドリファレンス]]: `update` の節（影響先）
- [[specdojo:quick-start-guide|Quick Start ガイド]]: 導入の手順に版の上げ方を追記（影響先）
