---
specdojo:
  id: prj-0001:pjr-9xeg-project-move-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-03T05:00:06Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-8HCB
  commit_type: feat
  commit_scope: project
---

# PJR-9XEG project を別リポジトリへ移す前の読むだけの点検を作る

## 1. 概要

project を別リポジトリへ移す前に、実行中の項目・exec の worktree とブランチ・リポジトリをまたぐリンク・写すべき設定を一覧にする、何も書き換えない点検のコマンドを作る

## 2. 入力

- 利用者は、prj-0002（specdojo-lp の管理）を将来、管理用の別リポジトリ（例: specdojo-lp-specdojo）へ移す可能性を考え、安全に移すための機能を用意することを求めた。全自動の移行コマンドは後回しにし、読むだけの点検・手順のガイド・リポジトリをまたぐリンクの 3 件に分けると判断した（2026-11-03）
- 点検する項目の候補: 実行中・waiting の登録簿の項目と doing の schedule タスク、exec の worktree とブランチ（exec/`<project-id>-``*`）、統合先のブランチ、定期実行の設定、移す project とほかの project の間の wikilink（prj-0002 から prj-0001 の個票へ 10 種類ある）、写すべき設定（specdojo.config.json の project の項目、repos の相対パス、.specdojo の名簿と exec-defaults）、Kata の参照元（移した後は npm パッケージで版を固定する）（2026-11-03）
- コマンドの名前の例は specdojo project move --check。名前と出力の形は executor が決め、理由を記録してよい（2026-11-03）

## 3. 完了条件

- 読むだけの点検のコマンドを足す。名前と出力の形は executor が決め、理由を個票の対応結果に書く（例: `specdojo project move --check`）。
- 入力に挙げた候補（実行中・waiting の項目と doing のタスク、exec の worktree とブランチ、統合先のブランチ、定期実行の設定、project をまたぐ wikilink、写すべき設定、型の参照元）を項目ごとに点検し、「問題なし・移す前に片付けが要る・手で確かめる」のどれかを出す。
- 片付けが要る項目があれば、0 以外の終了コードで終わる。
- ファイル・git の refs・登録簿を書き換えないことを、統合テストで確かめる（点検の前後で作業ツリー・HEAD・refs が変わらない）。
- prj-0002 を対象に流した出力の例を、個票の対応結果に書く。
- `command-reference` に、足したコマンドを書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                        | 担当     | 状態 | メモ                   |
| --- | ------------------------------------------- | -------- | ---- | ---------------------- |
| 1   | 読むだけの点検のコマンドを作る              | executor | open | 名前と出力の形を決める |
| 2   | 書き換えないことを確かめる統合テストを足す  | executor | open | -                      |
| 3   | prj-0002 で流した出力の例と参照の文書を書く | executor | open | -                      |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
