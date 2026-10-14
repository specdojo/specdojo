---
specdojo:
  id: prj-0002:pjr-d46k-lp-copy-revision
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: BA
  registered_at: "2026-10-13T12:52:56Z"
  due_on: "2026-10-31"
  completed_at: "2026-10-14T12:05:01Z"
  conclusion: 課題提示の順番を見直し、始め方を「5 つの手順で始めて、4 つの手順で回す」構成へ組み直して、開発中の LP を題材に 0.3.0 の挙動へそろえた
---

# PJR-D46K LP の文言を見直す

## 1. 概要

LP の各節の文言を見直し、課題提示の順番などを整える

## 2. 完了条件

- 「こんなことはありませんか」のカードが、前提が伝わらない → 書き残す時間がない → あの人がいないと進まない の順に並び、カード下の段落が同じ順で書かれ、引き継げることを結びに置いている。
- 始め方の節が「5 つの手順で始めて、4 つの手順で回す」の構成になり、起票（Plan）、AI による実行と両リポジトリへの commit（Do）、確認（Check）、完了と次の改善の起票（Action）までを、開発中の LP に FAQ の節を加える題材で、会話とコマンドの両方で示している。
- Hero に「4 つの手順で回す」のボタンがあり、実行編へ移動できる。
- 始め方の節のコマンドが CLI 0.3.0 の挙動と一致している（`specdojo init` による初期設定、`--executor-by` / `--reporter-by` の指定、`repos` の宣言）。
- 変更が specdojo-lp の `feature/prj-0002/lp-copy-revision` に commit され、`format:check`・`lint:ts`・`typecheck`・`build` が通る。

## 3. 作業内容

| No  | 作業                                                                                              | 担当         | 状態 | メモ                                                                      |
| --- | ------------------------------------------------------------------------------------------------- | ------------ | ---- | ------------------------------------------------------------------------- |
| 1   | 課題提示（Problems）の順番と段落を見直す                                                          | orchestrator | done | specdojo-lp `020332a`                                                     |
| 2   | 始め方（GetStarted）に実行編の 3 手順を加え、0.3.0 に合わせる                                     | orchestrator | done | 使い捨てリポジトリで `init --exec` から `exec run --dry-run` まで確認した |
| 3   | 始め方の手順を LP 開発の題材で具体化し、Hero に実行編へのボタンを加える                           | orchestrator | done | 題材は FAQ の節の追加と OGP 画像の issue                                  |
| 4   | 実行編を PDCA の 4 手順（つなぐ・Do・Check・Action）に組み直し、app1 を開発中の LP として説明する | orchestrator | done | -                                                                         |
| 5   | 例のリポジトリ名を app1 から landing-page に改める                                                | orchestrator | done | 何のリポジトリかを名前で伝えるため                                        |
| 6   | 導入の手順から .gitignore を作る行を削る                                                          | orchestrator | done | 公開版 0.3.0 の init が node_modules/ を追記することを確認した            |

## 4. 対応結果

対応経路: 利用者が orchestrator を実装者に指定し、orchestrator が specdojo-lp の `feature/prj-0002/lp-copy-revision` で直接対応した。

実施内容:

- 課題提示（`src/components/sections/Problems.astro`）のカードを、前提が伝わらない → 書き残す時間がない → あの人がいないと進まない の順に並べ替え、カード下の段落を同じ順にそろえた（`020332a`）。
- 始め方（`src/components/sections/GetStarted.astro`）を「5 つの手順で始めて、4 つの手順で回す」構成に組み直した。開発中の LP（`landing-page`）に FAQ の節を加える題材で、起票（Plan）、AI による実行と両リポジトリへの commit（Do）、確認（Check）、完了と次の改善の起票（Action）までを、会話とコマンドの両方で示した（`acdda24`、`cfc8b1c`、`b9cb239`）。
- Hero（`src/components/sections/Hero.astro`）に「4 つの手順で回す」のボタンを加えた（`acdda24`）。

検証結果:

- 各 commit の時点で、specdojo-lp の `format:check`・`lint:ts`・`typecheck`（`astro check`）・`build` が成功した。
- 公開版 `specdojo@0.3.0` を使い捨てリポジトリへ入れ、`init --yes --provider claude --exec` で設定・名簿・起動設定が作られ、`.gitignore` に `node_modules/` が追記されることを確かめた。
- 0.3.0 相当の版で `repos` を宣言し、`exec run --register --worktree --dry-run` を実行した。担当が未定の項目は `--executor-by` がないと止まり、`--executor-by claude-executor --reporter-by claude-reporter` で executor と reporter が解決されることを確かめた。

残課題:

- agent を実際に起動する実行は試していない。実行編の会話例にあるオーケストレーターの返答は、ガイドと PJR-4ZSN の実績にもとづく例文である。
- Hero の「4 つの手順で回す」の移動先は「会話で始める」タブの中にあり、「コマンドで始める」タブを開いているときは移動できない。
- 画面での見た目（ボタンの折り返し、吹き出しの長さ、狭い幅での横スクロール）は orchestrator では確かめていない。

統合:

- close 後に、利用者の指示で `feature/prj-0002/lp-copy-revision` を specdojo-lp の `feature/lp-v1` へ `--no-ff` で merge した（`697aead`）。merge 後の `feature/lp-v1` で `format:check` と `build` が成功した。

## 5. 関連ドキュメント

- 変更先: specdojo-lp の `src/components/sections/Problems.astro`、`src/components/sections/GetStarted.astro`、`src/components/sections/Hero.astro`
- 先行の対応: [[prj-0002:pjr-4zsn-lp-tech-stack-tsd]]
