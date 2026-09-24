---
specdojo:
  id: prj-0001:pjr-8myj-remote-host-development-guide
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-23T22:30:57Z"
  due_on: "2026-10-24"
  completed_at: "2026-09-24T12:48:57Z"
  conclusion: 常時稼働ホストへリモート接続する構成例のガイドを新設した。役割と代替手段で一般化し、構成例として位置づけ、採らない選択も明示した。
---

# PJR-8MYJ 常時稼働の母艦へリモート接続して agent を動かす構成例のガイドを書く

## 1. 概要

SpecDojo は自律実行を前提とする。routine は cron で定期実行され、`exec run` は 1 回あたり 10〜30 分かかる。ノート PC を閉じると止まるため、**常時稼働する実行環境が要る**。

この要求はツールの性格に由来する。

| ツール              | 常時稼働の必要性                         |
| ------------------- | ---------------------------------------- |
| Spec Kit / OpenSpec | 低い。人が起動したときだけ動く           |
| Kiro                | 低い。IDE を開いている間                 |
| Gas Town / Gas City | 高い。ただし cloud / Kubernetes へ向かう |
| SpecDojo            | 高い。個人規模で完結させたい             |

Gas Town / Gas City の答えは cloud である。**個人が手元の常時稼働マシンで完結させる構成**の案内は、この領域で空白になっている。

prj-0001 では Tailscale + SSH + tmux + devcontainer で母艦へ接続して開発しており、運用知見が [[tsd-home-mac-dev-server-usage|自宅 MacBook Pro 開発サーバ運用ガイド]]（265 行）にある。ただしこれは `docs/ja/product/` 配下の product 側文書で、[[prj-0001:pjr-tbhh-detached-unit-default]] の境界によりプロダクト実装のリポジトリに属し、npm package にも含まれない（`files` は `docs/ja/specdojo` と `docs/specdojo` のみ）。

配布するには `docs/ja/specdojo/guides/` へ一般化する必要がある。

### 1.1. 位置づけ

主たる差別化ではなく**補強材料**として扱う。理由は 2 つある。

- SpecDojo の機能ではない。Tailscale・tmux・Docker という第三者ツールの組み合わせ方であり、競合が真似るのも容易で防御力がない。
- 「簡単に実行できる」と書くと支援範囲が広がる。OS の差、Tailscale のアカウント、SSH 鍵、Docker の導入に加え、[[prj-0001:pjr-hz4c-tmux-terminal-npm-run-docs-dev-port-forwarding]] で判明した VS Code Remote SSH と Dev Containers の入れ子構成の制限など、こちらの責任外で壊れる箇所がある。

したがって「サポートされた手順」ではなく「**構成例**」として書く。値は「長時間動く agent を止めない環境に、cloud を使わず答える例を示すこと」にある。これは「SpecDojo は自律実行を前提とする」という性格を具体化し、[[prj-0001:pjr-e8tt-initial-release-positioning]] の主張を裏づける。

なお tmux の用法を混同しない。Gas City の既定 runtime provider である「agent を tmux で回す」とは別で、本項目が扱うのは「人の作業セッションを切断後も保つ」ことである。

## 2. 完了条件

- `docs/ja/specdojo/guides/` にガイドがあり、母艦への接続、tmux でのセッション永続化、devcontainer 内での agent 実行、切断と再接続の手順が書かれている。
- 特定の機種名、ホスト名、個人のアカウント設定を含まない。読み手が自分の環境へ読み替えられる。
- 「構成例」であることが明記され、サポートされた手順として書かれていない。
- 既知の制限が併記されている。少なくとも VS Code Remote SSH と Dev Containers の入れ子構成でのポート転送（`appPort` と SSH local forwarding での回避）を含む。
- cron による routine 実行が母艦側で動くこと、切断中も継続することが説明されている。
- README から 1 行で辿れる。README 本文へ手順を複製しない。
- `npm run lint:md` と `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                           |
| --- | ---------------------------------------------------- | ---- | ---- | ------------------------------ |
| 1   | product 側の運用ガイドから一般化できる内容を抽出する | DEV  | done | 265 行。個人環境の記述を落とす |
| 2   | `docs/ja/specdojo/guides/` へガイドを新設する        | DEV  | done | 構成例として書く               |
| 3   | 既知の制限を併記する                                 | DEV  | done | PJR-HZ4C の内容                |
| 4   | README から 1 行リンクする                           | DEV  | done | 手順は複製しない               |

## 4. 対応結果

- [[specdojo:remote-host-development-guide|常時稼働ホスト運用ガイド]] を新設した（163 行、8 章）。
- 一般化は「役割と代替手段の表」で行った。常時稼働ホスト、ネットワーク到達手段、端末多重化、実行環境の 4 つの役割を示し、それぞれに代替を並べた。Tailscale + SSH + tmux + devcontainer は例として挙げるに留め、特定の機種名・ホスト名・アカウント設定は含めていない。
- 冒頭で「特定の製品構成を推奨するものではなく、構成例です」と明示した。さらに `この構成を採らない選択` を設け、`routine` を使わない場合・都度実行できる場合・`register` だけを使う場合は不要であることを書いた。常時稼働環境が入口の条件に見えると [[prj-0001:pjr-e8tt-initial-release-positioning]] の「段階的に使える」という主張と矛盾するためである。
- 既知の制限として、入れ子のリモート接続でエディタのポート転送が届かない問題と `LocalForward` による回避を記載した（[[prj-0001:pjr-hz4c-tmux-terminal-npm-run-docs-dev-port-forwarding]] の一般化）。どの接続用エントリへ設定するかという、実際に間違えた点も含めている。
- 切断後の再開方法を対象ごとに表で示した。`exec run --worktree` は `--resume`、agent CLI は各 CLI の再開機能、`routine` は次の起動時刻か `routine run --id`。
- README の `使い始める` 末尾から 1 行でリンクした。手順は複製していない。docs-site の sidebar では `routine運用` の直後へ配置した。
- ローカル feature ブランチ `feature/prj-0001/remote-host-guide` で実施し、`--no-ff` merge で develop へ統合した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-e8tt-initial-release-positioning]]
- [[prj-0001:pjr-hz4c-tmux-terminal-npm-run-docs-dev-port-forwarding]]
- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]
- [[tsd-home-mac-dev-server-usage|自宅 MacBook Pro 開発サーバ運用ガイド]]
- [[specdojo:routine-operation-guide]]
