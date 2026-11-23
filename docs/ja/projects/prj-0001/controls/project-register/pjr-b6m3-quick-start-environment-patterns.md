---
specdojo:
  id: prj-0001:pjr-b6m3-quick-start-environment-patterns
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T13:17:02Z"
  depends_on:
    - PJR-7EZR
    - PJR-GA72
  commit_type: docs
  commit_scope: guide
---

# PJR-B6M3 環境のパターン別のクイックスタートを書く

## 1. 概要

6 つのパターンごとに、最初の todo を起票し agent に 1 件流すまでの手順をクイックスタートに足す

## 2. 入力

- 利用者の依頼（2026-11-23）: 多くの人に使ってもらうため、Dev Container・Dev Container ＋ tmux・mac・mac ＋ tmux・WSL・WSL ＋ tmux のパターンですぐに使えるようにする
- v0.10.0 に入れる。実装はオーケストレーターが会話の中で行う（利用者の指定）

## 3. 完了条件

- クイックスタートに、6 つのパターン（Dev Container・Dev Container ＋ tmux・macOS・macOS ＋ tmux・WSL・WSL ＋ tmux）ごとに、コピーして貼るだけで「最初の todo を起票し、agent に 1 件流す」まで進める手順を足す。前提（`specdojo doctor`）を最初に確かめる。
- WSL の注意（作業ツリーを Linux 側に置く、Docker Desktop との連携）と、tmux のセッションの入り方を書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run lint:md`・`npm run lint:fm` を通す。

## 4. 作業内容

| No  | 作業                                                                                     | 担当                  | 状態 | メモ      |
| --- | ---------------------------------------------------------------------------------------- | --------------------- | ---- | --------- |
| 1   | クイックスタートに「使う環境のパターン」の節（6 パターンの表と最初の 10 分の手順）を足す | specdojo-orchestrator | done | 482fcc65e |
| 2   | Node.js の版を `engines` に合わせ（22.17）、`init` の対話例に tmux の問いを足す          | specdojo-orchestrator | done | 482fcc65e |

## 5. 対応結果

- クイックスタートの「導入とオーケストレーターの起動」に「使う環境のパターン」の節を足した。Dev Container・Dev Container ＋ tmux・macOS・macOS ＋ tmux・WSL・WSL ＋ tmux の 6 つについて、`init` の答え・オプション、`doctor` での前提の確かめ、作られるものと入り方を表にした。最後に、`doctor` → `init` → tmux のセッション → オーケストレーターに最初の todo を起票して流してもらう、の手順を置いた。
- WSL の注意（作業ツリーを `/mnt/c` でなく Linux 側に置く、Docker Desktop の WSL 連携）と tmux の入れ方・抜け方を書いた。
- あわせて、前提の Node.js の版を `engines`（22.17）に合わせ、`init` の対話例に tmux の問いを足した。
- 検証: `markdownlint-cli2` と prettier を通し、commit の hook（format・markdown）を通した。
- 残り: 各パターンを実機で通しで確かめるのは PJR-F636 で行う。

CHANGELOG に書く事項（Changed）:

- クイックスタートに、Dev Container・macOS・WSL と tmux の組み合わせ 6 つの導入手順を足した。

## 6. 関連ドキュメント

- [[specdojo:quick-start-guide|クイックスタート]]: 使う環境のパターンの節。
- [[specdojo:command-reference|コマンドリファレンス]]: `doctor`・`init` の説明。
- 関連: PJR-7EZR（init の環境のパターン。最後の案内で `doctor` を勧める）、PJR-GA72、PJR-F636。
