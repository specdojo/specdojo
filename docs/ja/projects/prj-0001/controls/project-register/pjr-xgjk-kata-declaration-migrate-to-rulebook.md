---
specdojo:
  id: prj-0001:pjr-xgjk-kata-declaration-migrate-to-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: ARC
  registered_at: "2026-08-24T11:34:30Z"
  due_on: "2026-08-31"
  conclusion: 'agent exited with non-zero code: "... is not valid JSON'
---

# PJR-XGJK 実践の型の宣言をrulebook frontmatterへ移行する

## 1. 概要

PJR-3N21 の決定に従い、実践の型の要否と所在の正本を rulebook frontmatter へ一本化する。成果物カタログ208件から型宣言を削除して rulebook の宣言のみを残し、要否を rulebook 側へ移す。src/kata.ts の解決をカタログ優先から rulebook 正本へ変更し、kind が generated の成果物には型を適用しない導出を実装する。schema と検証も決定内容に合わせる。PJR-K4TA と PJR-JT1Y で導入した要否の4状態と判断基準は意味を変えず、置き場所のみを移す。

## 2. 完了条件

- 成果物カタログで型を宣言している234件から `recipe` / `sample` / `template` の宣言が削除され、`rulebook` の宣言のみが残っている。
- 削除前にカタログ側にあった要否の判断が、rulebook frontmatter 側へ漏れなく移されている。特に `not-needed` と `undecided` を失わない。移行前後の対応が確認できる形で記録されている。
- `src/kata.ts` の解決が rulebook frontmatter を正本とし、カタログを参照しない。
- `kind: generated` の成果物には型を適用しない。成果物ごとの宣言ではなく `kind` から導出する。
- schema が成果物カタログ側の型宣言を受け付けなくなっている。
- PJR-1Z1H で追加した宣言と実ファイルの双方向検証が、移行後の構造でも機能する。
- 検証を追加・変更する場合は、テスト用の最小構成リポジトリでも動作することを確認する。実リポジトリの構成を前提にしたファイルシステム走査は、ディレクトリ不在で失敗する。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration`、`catalog validate`、`catalog build` が成功する。

## 3. 作業内容

| No  | 作業                                                           | 担当 | 状態 | メモ                                 |
| --- | -------------------------------------------------------------- | ---- | ---- | ------------------------------------ |
| 1   | カタログ側の要否判断を rulebook frontmatter へ移す             | ARC  | open | 判断を失わないことが最優先           |
| 2   | 成果物カタログ234件から型宣言を削除する                        | ARC  | open | `rulebook` の宣言のみ残す            |
| 3   | `src/kata.ts` の解決を rulebook 正本へ変更する                 | ARC  | open | カタログを参照しない                 |
| 4   | `kind: generated` への非適用を `kind` からの導出として実装する | ARC  | open | 成果物ごとの宣言にしない             |
| 5   | schema と双方向検証を移行後の構造へ合わせる                    | ARC  | open | 最小構成リポジトリでの動作も確認する |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 根拠となる決定: [[prj-0001:pjr-3n21-kata-declaration-ssot-split|PJR-3N21 実践の型の要否と所在の正本を分ける]]
- 種別ごとの作成方針: [[prj-0001:pjr-vv3m-kata-creation-policy-by-type|PJR-VV3M 実践の型は種別ごとに作成方針を変える]]
- 要否判断の基準: [[specdojo:kata-guide|実践の型ガイド]]
- 移行対象を導入した項目: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 要否の状態を整理した項目: [[prj-0001:pjr-jt1y-kata-undecided-state|PJR-JT1Y 実践の型の要否に未判断の状態を追加]]
- 所在の宣言を揃えた項目: [[prj-0001:pjr-1z1h-rulebook-sample-declaration-gap|PJR-1Z1H 実践の型の宣言の欠落を埋める]]
- 完了を待つ項目: [[prj-0001:pjr-k9kg-kata-requirement-existing-deliverables|PJR-K9KG 実在する成果物の要否確定]]
