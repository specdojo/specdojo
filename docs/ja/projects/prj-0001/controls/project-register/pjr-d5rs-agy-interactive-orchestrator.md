---
specdojo:
  id: prj-0001:pjr-d5rs-agy-interactive-orchestrator
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-11-28T04:17:56Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-N6FQ
---

# PJR-D5RS agy を対話のオーケストレーターとして使えるようにラッパーを戻す

## 1. 概要

PJR-N6FQ で agy の対応を外した際、SpecDojo が agy を起動する経路と一緒に、利用者が agy を自分で起動して使う対話のオーケストレーターのラッパーも消した。agy を対話のオーケストレーターとして使えるよう、ラッパーだけを戻す。SpecDojo から agy を起動する経路（exec の provider、`orchestrator launch`、`agent launch`）は戻さない。

## 2. 入力

- 利用者は agy をオーケストレーターとして使いたい（indie、2026-11-28）
- Antigravity の FAQ が consumer plan で禁じるのは、他社の agent や application の中に agy を包むこと（wrapping）と、他社のソフトから Antigravity にアクセスすること。利用者が agy を起動し、agy が specdojo のコマンドを打つ形は、包むことに当たらないと読める。agy から動かした specdojo がさらに別の agent を起動することは、FAQ に書かれていない（2026-11-28 の確認）
- N6FQ（f1071c571）で templates/antigravity/orchestrator.md・settings.orchestrator.json と、orchestrator:sync の対象の agy のラッパーを消した
- push の守りは PJR-D4RJ の決定（各環境の git push の deny を残す）に合わせる。v0.10.0 に入れる。担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 完了条件

- agy 向けのオーケストレーターのラッパーを、対話用としてだけ戻す。置き場所と形は N6FQ で消したもの（`templates/antigravity/orchestrator.md`・`templates/antigravity/settings.orchestrator.json`、`.agents/rules` 側のラッパー）を元にし、本文はオーケストレーターの SSOT とバイト一致で保つ。
- `orchestrator:sync` と `tools/validate-orchestrator-sync.mjs` の対象に agy のラッパーを戻し、`npm run lint:orchestrator-sync` で検査できるようにする。テストも合わせる。
- exec の provider、`orchestrator launch`、`agent launch`、`init`・`config scaffold`・`devcontainer scaffold` の provider の選択肢、名簿の `antigravity` の member のエラーは今のまま変えない。SpecDojo が agy を起動する経路を戻さない。
- agy のラッパーの権限の設定で、ほかの環境と同じく `git push` を拒み、認証情報・`.env`・`secrets/` を読まない。agy の設定で表せない守りがあれば、何が表せないかを個票の対応結果に書く。
- 文書（コマンドリファレンス、`orchestrator-operation-guide` など、N6FQ で agy の説明を消したもの）の「agy の対応を外した」の説明を、「SpecDojo から agy を起動する対応を外した。利用者が agy を起動して対話のオーケストレーターに使うことはできる」に直す。理由として、Antigravity の FAQ が禁じるのは他社の agent や application の中に agy を包むことである点を書く。
- `.agents/` など保護された設定に置くラッパーのファイルは executor が書かず、ファイルの中身の案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとオーケストレーターが行う。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
