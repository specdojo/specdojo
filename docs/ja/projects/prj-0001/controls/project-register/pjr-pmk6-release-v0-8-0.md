---
specdojo:
  id: prj-0001:pjr-pmk6-release-v0-8-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: PO
  registered_at: "2026-11-11T11:58:00Z"
  depends_on:
    - PJR-M18B
    - PJR-X05N
    - PJR-Q2AT
    - PJR-1GCD
    - PJR-T4G3
    - PJR-M495
    - PJR-ED0K
    - PJR-V2GH
    - PJR-BJ7E
    - PJR-DVNV
    - PJR-D948
    - PJR-C6BA
    - PJR-KV37
    - PJR-JFRX
    - PJR-3HXQ
    - PJR-6XWP
    - PJR-W63Q
    - PJR-VEHX
    - PJR-X1RW
    - PJR-Q9DF
    - PJR-8ZX8
    - PJR-SBNB
  commit_type: chore
  commit_scope: release
---

# PJR-PMK6 0.8.0 でリリースする

## 1. 概要

0.7.0 の後の完了分（業務仕様の型の標準化・clis・uis・dss・grade の YAML 対応など）と PJR-RX14 の修正を 0.8.0 として公開する

## 2. 入力

- 範囲（indie が 2026-11-15 に決定）: 型（docs/ja/specdojo の rulebook・recipe・sample・template）は極力最新を取り込み、足元の不具合は直してから出す。0.7.0 の後に close した項目は、リリースの作業を始める時点までに close したものをすべて含める
- 足元の不具合（先に直す）: PJR-M18B・X05N（review の正しさ）、Q2AT・1GCD（止まる原因）、T4G3・M495・ED0K（立て直し）、V2GH・BJ7E・DVNV
- 型を最新にする: wave-2 の sample の手直し（PJR-D948・C6BA・KV37）、型を確定するための成果物の手直し（wave-2 の JFRX・3HXQ・6XWP・W63Q、wave-1 の VEHX・X1RW・Q9DF）と 140 の確定、template の id の直し（PJR-8ZX8）、ifx-index の schema の名前の変更（PJR-SBNB）
- 0.8.0 に入れないもの: project-kata の手直し（PJR-Y5AC・Y5XH・TVWR・CPZH）、stsd・cdsd の手直し（PJR-2C9W・PEJQ）、ifx-index の閲覧ページ（PJR-QJ41）。どれも配る型を変えない
- review で止まっている項目（PJR-B0B8 など）は、リリースの時点で close 済みなら含める
- 2026-11-16 の追加（利用者がリリースの夜までに入れた方がよい todo の選定と実行を orchestrator に依頼）: 道具の直し PJR-1ZQK（plan だけの run の記録と push の前の検査）・YYDS（grade の finding を最初から日本語で書かせる）・N6GK（作業内容の表を実績に合わせる）と、配る型の次の回 PJR-D948・C6BA・KV37・T123 を入れる。PJR-1Y1M は commit の許可リストの方針が未決のため入れない。成果物の手直しの次の回（VEHX・X1RW・JFRX・6XWP など）は配る型を変えないため 0.8.0 の後に回す
- 手順は pm-orchestrator-playbook の「リリースの手順」に従う。push・PR の merge・タグ・npm の公開の承認は利用者が行う

## 3. 完了条件

- PJR-0X0S と PJR-A7CR が close されている。review の 7 件は、利用者の確認の結果で close するか次の版に回すかが決まっている。
- 版を変更内容から決め、利用者の確認を得ている。本体は `0.8.0`。`packages/docs-site`・`packages/docs-lint` は前の公開の後に変更があるため、版を上げるかを確かめる。
- `package.json` と `package-lock.json` の版を上げ、`CHANGELOG.md` の `[Unreleased]` を版の節として日付を付けて確定している。PJR-EPQ3 の後に close した項目の個票の「CHANGELOG に書く事項」を集めて書き、close の件数と集めた件数を照合している。
- ルートと `packages/*` の `npm ci` が通り、クリーンな作業ツリーで `npm run check` が通る。
- `npm pack` の配布物を空の Git リポジトリへ入れ、`init`・`register add`・`exec run --register`（start から review まで）と、この版で変えた機能（`kata show` で dss・clis の rulebook が読める、grade の YAML 対応など）を確かめている。
- 公開候補が PR の merge commit で `main` へ入り、その commit を指すタグから npm の公開 workflow が起動する。push・PR の merge・タグ・npm の公開の承認は利用者が行う。
- 公開後に npm の `latest`、タグで起動した workflow の結果、npm から入れた版の動作を確かめている。

## 4. 作業内容

| No  | 作業                                                                   | 担当                  | 状態 | メモ |
| --- | ---------------------------------------------------------------------- | --------------------- | ---- | ---- |
| 1   | CHANGELOG の事項を集め、版を確定し、`npm ci` と `npm run check` を流す | specdojo-orchestrator | open | -    |
| 2   | 配布物を空のリポジトリで試す                                           | specdojo-orchestrator | open | -    |
| 3   | PR・merge・タグ・公開の承認                                            | PO                    | open | -    |
| 4   | 公開後の確認                                                           | specdojo-orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-7sea-release-v0-7-0]]
- [[prj-0001:pjr-epq3-changelog-from-register-handoff]]
- [[prj-0001:pm-orchestrator-playbook]]
