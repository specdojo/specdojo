---
specdojo:
  id: prj-0001:pjr-9m5n-npm-onboarding-path
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-09T15:30:18Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-09T22:36:58Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=package.json; agent must record the required change in the result …"
---

# PJR-9M5N npm 導入後のセットアップ導線を整備する

## 1. 概要

`npm install specdojo` で導入した利用者が、インストール後に何をすればよいか分からない。
コマンドの配置と README の双方に問題がある。

## 2. 現状

### 2.1. コマンドの発見性

agent 設定を配置する機能が `exec` の下にある。

```sh
specdojo exec scaffold --provider <name>
```

`templates/<provider>/` を利用リポジトリへ複製する処理で、初期セットアップにあたる。しかし
`exec`（タスク実行）の配下にあるため、セットアップを探す利用者が到達しにくい。`config init` の
隣か、`init` 相当の入口が自然である。

`config` の配下には `init` しかなく、設定ファイルを作った後に何をするかの導線がない。

### 2.2. README が npm 利用を想定していない

`使い始める` の記載は次の 2 つのみである。

| 記載されている方法                                | npm 利用者にとって       |
| ------------------------------------------------- | ------------------------ |
| Use this template から作成する                    | 無関係                   |
| リポジトリを取得し `docs/ja/specdojo/` を取り込む | npm install の意味を失う |

`npm install` にも `specdojo` コマンドの実行にも言及がない。npm のページに表示されるのはこの
README であり、導入直後の利用者が最初に読む文書である。

## 3. 必要な導線

インストールから最初の成果までを一連で示す必要がある。

```text
npm install specdojo
specdojo config init
specdojo exec scaffold --provider <name>   ← 位置の見直し対象
specdojo register add --type todo --title "..."
specdojo register build
```

PJR-KK07 により、kata を配置しない最小構成でも `register add` と `register build` が動作する。
この事実を導線として示せる。

## 4. 完了条件

- README に npm 経由の導入手順がある。`npm install` から最初の `register add` までを通しで示す。
- agent 設定を配置するコマンドが、セットアップの導線として発見できる位置にある。
- 既存の `exec scaffold --provider` を移動または別名で公開する場合、従来の呼び出しが壊れないか、
  移行方法が示されている。
- `config init` の後に何をするかが、コマンドの出力または README から辿れる。
- 最小構成の利用者（kata を使わず register だけを使う）向けの導線が示されている。
- 記載した手順を実際に空のリポジトリで実行し、通ることを確認している。

## 5. 作業内容

| No  | 作業                                 | メモ                                                                      |
| --- | ------------------------------------ | ------------------------------------------------------------------------- |
| 1   | セットアップ系コマンドの配置を決める | `config scaffold --provider` を推奨入口として追加                         |
| 2   | 移行方法を決める                     | `exec scaffold --provider` は同じ実装を呼ぶ互換入口として維持             |
| 3   | README へ npm 導入手順を追加する     | ローカル導入のため `npx specdojo` で `register add` までを通しで記載      |
| 4   | 空のリポジトリで手順を実地確認する   | tarball をインストールし、config・provider・register の一連の操作を確認済 |

## 6. 判断結果

- `config init` は設定ファイル生成に限定したまま、provider 設定の配置を兄弟コマンドの
  `config scaffold` にした。初期設定として発見でき、`init` の責務も広げないためである。
- README は npm 導入から最初の register 項目生成までに絞り、provider の詳細設定は exec 設定
  ガイドへ委ねた。
- npm で表示するトップレベル README は現在の日本語 README を更新した。英語版の新設は、英語
  ドキュメント全体が未整備であり本項目の完了条件外であるため対象に含めなかった。

## 7. 対応結果

- provider の agent・settings 設定を配置する推奨入口として
  `specdojo config scaffold --provider <name>` を追加した。コピー処理を共通化し、従来の
  `specdojo exec scaffold --provider <name>` は同じ処理を呼ぶ互換入口として維持した。
- `config init` は `.specdojo/` が存在しない空のリポジトリでも設定ファイルを作成できるようにし、
  `prj-0001` の register 単体構成を既定値にした。実行後は設定確認、任意の provider 設定、登録簿
  作成の順に次のコマンドを表示する。
- README に `npm install specdojo` から `npx specdojo register add` / `register build` までの手順と、
  agent を使わない最小構成、既存コマンドの互換性を記載した。Quick Start ガイド、exec 設定ガイド、
  CLI コマンドリファレンスも新しい入口へ揃えた。
- npm 利用環境で CLI の起動に必要な `fast-glob` が開発依存にのみ置かれていたため、runtime
  dependencies へ移した。
- `npm pack` した tarball を空の Git リポジトリへインストールし、README に記載した
  `config init`、`config scaffold --provider codex`、`register scaffold`、`register add`、
  `register build` が成功することを確認した。残課題はない。

## 8. 関連ドキュメント

- [[prj-0001:pjr-kk07-template-resolution-fallback]]: 同梱テンプレートの解決。最小構成の成立。
- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]: npm 公開の段取り。
