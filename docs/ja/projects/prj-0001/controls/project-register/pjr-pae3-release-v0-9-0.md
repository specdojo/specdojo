---
specdojo:
  id: prj-0001:pjr-pae3-release-v0-9-0
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
  registered_at: "2026-11-19T12:48:18Z"
  due_on: "2026-11-30"
  depends_on:
    - PJR-DM9B
    - PJR-8Z71
    - PJR-8NB8
    - PJR-9JN6
    - PJR-C07H
    - PJR-ZK3T
    - PJR-P318
    - PJR-2HT5
    - PJR-PEJS
    - PJR-4YS7
  commit_type: chore
  commit_scope: release
---

# PJR-PAE3 0.9.0 でリリースする

## 1. 概要

0.8.0 の後の完了分（register と exec の不具合修正、exec queue・exec smoke・specdojo git、依存の audit の解消と関門、kata-slim-2 の型の簡素化など）を 0.9.0 として公開する

## 2. 入力

- 範囲（利用者が 2026-11-19 に B 案で決定）: 新しい機能は止め、develop に統合済みで review の項目を確かめて close してから切る。0.8.0 の後に close した項目は CHANGELOG の対象にする。
- 先に close する項目: runner・CLI の DM9B・8Z71・8NB8・9JN6・C07H・ZK3T、CI の P318（リリースの PR の CI で関門と CodeQL を確かめる）、文書サイトの 2HT5・PEJS・4YS7（利用者がブラウザで確かめる）。
- docs-lint は tinyglobby を外し engines を 22.17 に上げ markdownlint-cli を 0.50 に上げたため 0.5.0 にする。kata-slim-2 の rulebook と recipe の簡素化は個票に属さないため、CHANGELOG に 1 行でまとめる。
- 0.9.0 に入れないもの: PJR-6998 の決定、kata-slim-3、SV9G、planning の track の作り直し、kata-slim-2 の後の型の grade。
- 手順は pm-orchestrator-playbook の「リリースの手順」に従う。push・PR の merge・タグ・npm の公開の承認は利用者が行う。期限は未定。

## 3. 完了条件

- `depends_on` の 10 件が close されている。利用者の確認が要る 2HT5・PEJS・4YS7 は、確認の結果で close するか、既知の制限として CHANGELOG に書いて次の版に回すかが決まっている。
- 版を変更内容から決め、利用者の確認を得ている。本体は `0.9.0`、`packages/docs-lint` は `0.5.0`。`packages/docs-site` は前の公開（0.5.0）の後に変更があるかを確かめ、版を上げるかを決める。
- `package.json` と `package-lock.json` の版を上げ、`CHANGELOG.md` に `## [0.9.0] - <日付>` の節を作っている。0.8.0 の公開（PJR-PMK6 の close、2026-11-16T11:13:58Z）の後に close した項目の個票の「CHANGELOG に書く事項」を集めて書き、close の件数と集めた件数を照合している。節のない項目のうち利用者に関わるもの（V141・981V・3VJM・ANKZ など）と kata-slim-2 の型の簡素化は、orchestrator が個票の結論から文案を書いている。
- ルートと `packages/*` の `npm ci` が通り、クリーンな作業ツリーで `npm run check` と `npm audit --omit=dev --audit-level=high` が通る。
- `npm pack` の配布物を空の Git リポジトリへ入れ、`init`・`register add`・`exec run --register`（start から review まで）と、この版で変えた機能（`exec queue`・`exec smoke`・`specdojo git`・`register --commit` の `-m` の繰り返し、`kata show` で簡素化した rulebook が読めること）を確かめている。
- 公開候補が PR の merge commit で `main` へ入り、PR の CI で audit の関門と CodeQL が動いている（PJR-P318）。その commit を指すタグから npm の公開 workflow が起動する。push・PR の merge・タグ・npm の公開の承認は利用者が行う。
- 公開後に npm の `latest`、タグで起動した workflow の結果、npm から入れた版の動作を確かめている。

## 4. 作業内容

| No  | 作業                                                          | 担当         | 状態 | メモ                            |
| --- | ------------------------------------------------------------- | ------------ | ---- | ------------------------------- |
| 1   | 先に close する項目を確かめて close する                      | orchestrator | open | 2HT5・PEJS・4YS7 は利用者の確認 |
| 2   | CHANGELOG の節を集めて書き、件数を照合する                    | orchestrator | open | -                               |
| 3   | release ブランチで版を上げ、check・audit・npm pack を確かめる | orchestrator | open | -                               |
| 4   | push・PR の merge・タグ・npm の公開の承認                     | PO           | open | 利用者                          |
| 5   | 公開後の確認                                                  | orchestrator | open | -                               |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-pmk6-release-v0-8-0|PJR-PMK6]]（前のリリース）
- [[prj-0001:pm-orchestrator-playbook]]（リリースの手順）
