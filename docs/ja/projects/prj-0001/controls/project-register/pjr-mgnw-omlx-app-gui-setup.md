---
specdojo:
  id: prj-0001:pjr-mgnw-omlx-app-gui-setup
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-03T01:24:08Z"
  block_reason: 個票の完了条件が commit されないまま exec run が始まったため、agent の起動前に orchestrator が止めた。直した個票で最初から実行し直す
---

# PJR-MGNW oMLX の手順をアプリ版のメニューバーと Admin UI の操作に直す

## 1. 概要

tsd-omlx と tsd-omlx-opencode は、インストールはアプリ版を前提にしながら、起動と設定を CLI の omlx serve で説明している。アプリ版の初期設定・メニューバーからの起動・Admin UI での設定（待ち受け・API key・同時リクエスト数・モデル alias）に書き直し、CLI は別の手段として短くまとめる

## 2. 完了条件

- [[tsd-omlx]] の「oMLXのインストール」に、アプリ版の初回起動とメニューバーの初期設定（モデルの置き場を `~/.omlx/models` にする、サーバーの起動、最初のモデルのダウンロード）を書く。`omlx --version` は CLI の shim の確認として残す。
- 「起動とモデル alias」を、メニューバーからのサーバーの起動と、Admin UI（`http://127.0.0.1:8000/admin`）でのモデル alias の設定に書き直す。`omlx serve` による起動の手順を本筋から外す。
- 「M3 Max 64GB向けの初期設定」の値は変えず、Admin UI のサーバーの設定とモデルの設定で入れることを明記する。
- 「devcontainerからの接続」を、Admin UI で待ち受けを `0.0.0.0` にして API key を設定し、メニューバーからサーバーを再起動する手順に書き直す。API key の値は `~/.omlx/settings.json` に保存されるため、このファイルを Git やリポジトリに置かない注意に書き換える。
- アプリと CLI は同じ `~/.omlx/settings.json` を使い、優先順位がコマンドの引数・環境変数・`settings.json`・既定値の順であること、アプリの起動中に `omlx serve` を実行するとポート 8000 が衝突することを書く。CLI による起動は、Homebrew 版や自動化のための別の手段として短くまとめる。
- アプリの画面やメニューの正確な名前は、公開情報で確かめられたものだけを書き、確かめられないものは `_TODO_` として残す。推測で画面の名前を作らない。
- [[tsd-omlx-opencode]] の「oMLX の起動確認」など、`omlx serve` の起動を前提にした記述を同じ前提にそろえる。
- 参照した公開情報の URL を本文の参照に残す（<https://github.com/TomLeeLive/jundot-omlx>、<https://jacar.es/en/omlx-api-key-port-endpoints/>）。
- `npm run lint:md`・`npm run lint:fm`・`npm run docs:build` が通る。

## 3. 作業内容

| No  | 作業                       | 担当 | 状態 | メモ                       |
| --- | -------------------------- | ---- | ---- | -------------------------- |
| 1   | tsd-omlx の書き直し        | DEV  | done | アプリ版の手順へ変更       |
| 2   | tsd-omlx-opencode のそろえ | DEV  | done | 起動・API key の前提を統一 |
| 3   | アプリの画面の名前の確認   | 人   | open | `_TODO_` を実機で埋める    |

## 4. 対応結果

[[tsd-omlx]] と [[tsd-omlx-opencode]] を、macOS アプリの初回設定、メニューバーからの起動、Admin UI での待ち受け・API key・同時リクエスト数・モデル alias の設定を本筋とする手順へ書き直した。CLI は Homebrew 版や自動化の別手段とし、設定の優先順位とポート衝突の注意を追記した。

公開情報でメニューバー項目の正確な表示名を確認できなかったため、[[tsd-omlx]] に `_TODO_` を 1 件残した。実機で表示名を確認し、同節の `_TODO_` を置き換える。

## 5. 関連ドキュメント

- [[tsd-omlx]]
- [[tsd-omlx-opencode]]
