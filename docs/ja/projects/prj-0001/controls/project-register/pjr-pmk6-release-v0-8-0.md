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
    - PJR-0X0S
    - PJR-A7CR
  commit_type: chore
  commit_scope: release
---

# PJR-PMK6 0.8.0 でリリースする

## 1. 概要

0.7.0 の後の完了分（業務仕様の型の標準化・clis・uis・dss・grade の YAML 対応など）と PJR-RX14 の修正を 0.8.0 として公開する

## 2. 入力

- 範囲は 0.7.0 の後に close した項目と、PJR-RX14 の修正（PJR-0X0S）。代表の確定と cdt・bes・ifx-cmd の 2 回目、予定の epic、中程度の issue は次に回す（indie が 2026-11-11 に承認）
- review で止まっている 7 件（PJR-AD33・B0B8・GQ14・Q8KP・RVTB・SZGZ・V5AZ）は、利用者の確認の結果で含めるかを決める
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
