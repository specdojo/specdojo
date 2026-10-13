---
specdojo:
  id: prj-0002:pjr-d46k-lp-copy-revision
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-10-13T12:52:56Z"
  due_on: "2026-10-31"
---

# PJR-D46K LP の文言を見直す

## 1. 概要

LP の各節の文言を見直し、課題提示の順番などを整える

## 2. 完了条件

- 「こんなことはありませんか」のカードが、前提が伝わらない → 書き残す時間がない → あの人がいないと進まない の順に並び、カード下の段落が同じ順で書かれ、引き継げることを結びに置いている。
- 始め方の節が「5 つの手順で始めて、4 つの手順で回す」の構成になり、起票（Plan）、AI による実行と両リポジトリへの commit（Do）、確認（Check）、完了と次の改善の起票（Action）までを、開発中の LP に FAQ の節を加える題材で、会話とコマンドの両方で示している。
- Hero に「4 つの手順で回す」のボタンがあり、実行編へ移動できる。
- 始め方の節のコマンドが CLI 0.3.0 の挙動と一致している（`specdojo init` による初期設定、`--executor-by` / `--reporter-by` の指定、`repos` の宣言）。
- _TODO_: ほかに見直す節と、その完了条件を追記する。
- 変更が specdojo-lp の `feature/prj-0002/lp-copy-revision` に commit され、`format:check`・`lint:ts`・`typecheck`・`build` が通る。

## 3. 作業内容

| No  | 作業                                                                                              | 担当         | 状態 | メモ                                                                      |
| --- | ------------------------------------------------------------------------------------------------- | ------------ | ---- | ------------------------------------------------------------------------- |
| 1   | 課題提示（Problems）の順番と段落を見直す                                                          | orchestrator | done | specdojo-lp `020332a`                                                     |
| 2   | 始め方（GetStarted）に実行編の 3 手順を加え、0.3.0 に合わせる                                     | orchestrator | done | 使い捨てリポジトリで `init --exec` から `exec run --dry-run` まで確認した |
| 3   | 始め方の手順を LP 開発の題材で具体化し、Hero に実行編へのボタンを加える                           | orchestrator | done | 題材は FAQ の節の追加と OGP 画像の issue                                  |
| 4   | 実行編を PDCA の 4 手順（つなぐ・Do・Check・Action）に組み直し、app1 を開発中の LP として説明する | orchestrator | done | -                                                                         |
| 5   | _TODO_: ほかの節の文言を見直す                                                                    | _TODO_       | open | -                                                                         |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
