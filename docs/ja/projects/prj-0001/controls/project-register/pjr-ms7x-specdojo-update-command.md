---
specdojo:
  id: prj-0001:pjr-ms7x-specdojo-update-command
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
