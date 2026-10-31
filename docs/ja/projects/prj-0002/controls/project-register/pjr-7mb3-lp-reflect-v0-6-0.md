---
specdojo:
  id: prj-0002:pjr-7mb3-lp-reflect-v0-6-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-10-31T09:38:30Z"
  due_on: "2026-11-30"
  derived_from:
    - prj-0001:PJR-2FV2
---

# PJR-7MB3 specdojo-lp に v0.6.0 の変更を反映する

## 1. 概要

prj-0001 の `CHANGELOG.md` の 0.6.0 の節を LP の文言とコマンド例に照らし、利用者に見える変更を反映するか、載せない理由を対応結果に書く。

## 2. 入力

- specdojo 0.6.0 と @specdojo/docs-lint 0.4.0 を 2026-10-31 に公開した（prj-0001:PJR-2FV2）。v0.5.0 までの反映は PJR-HDTZ で済んでいる
- LP の読み手に関わりそうな 0.6.0 の変更は、文脈を渡して成果物を作る流れ（draft approach・`_CONTEXT_`・--input・brief）、deliverable scaffold --target、プロダクトのリポジトリの git の運用への対応（`branch_template`・`commit_subject_template`・`merge_message_template`・`integration_strategy` ff・`commit_type` と `commit_scope`）。親の検証の lint-mermaid は SpecDojo 自身の開発用

## 3. 完了条件

- LP の画面の文言とコマンド例を、prj-0001 の `CHANGELOG.md` の `0.6.0` の節の利用者に見える変更と照合し、食い違いは LP 側を直すか、直さない理由を対応結果に書く。少なくとも次を判断し、判断と理由を対応結果に書く。
  - 文脈を渡して成果物を作る流れ（`deliverable scaffold --target` で雛形を作り、`_CONTEXT_:`・個票の `入力`（`--input`）・カタログの `brief` で前提を渡し、`draft` で下書きし `fully-guided` で磨く）を載せるか。載せる場合は、技術スタックなどの前提を渡して書かせる使い方として説明する。
  - プロダクトのリポジトリの git の運用（git-flow・GitHub flow に合わせた作業ブランチの名前、commit と merge commit の書式、`ff` の統合、個票の `commit_type` / `commit_scope`）への対応を載せるか。
  - `fully-guided` を磨き込み専用とした変更で、LP の既存の説明と食い違う箇所がないか。
- 親の検証の `lint-mermaid` は SpecDojo 自身の開発用のため載せない。
- 説明とコマンド例は、prj-0001 の現行のガイド（`exec-operation-guide`・`ryu-guide`・`specdojo-config-reference`・`command-reference`）と矛盾しない。
- 画面に表示する文言を変えた場合を除き、出力される HTML を変えない。
- 変更は `specdojo-lp` の `develop` へ統合する（prj-0002 の `integration_branch`）。
- `specdojo-lp` で `npm run build` が成功する。agent の sandbox では npm を実行できないため、executor は evidence の `validations` でこの検証を `requires_human` と記録し、ビルドは orchestrator が sandbox の外で確認する。
- prj-0002 は `catalog_path` を設定していないため、`specdojo catalog validate` は実行しない（evidence にも記録しない）。
- `specdojo-lp` には Prettier などの整形・lint の道具がないため、`specdojo-lp` のファイルに対して `prettier` などを実行しない（evidence にも記録しない）。

## 4. 作業内容

| No  | 作業                          | 担当         | 状態 | メモ |
| --- | ----------------------------- | ------------ | ---- | ---- |
| 1   | 食い違いを洗い出し、LP を直す | BA           | open | -    |
| 2   | ビルドを確認する              | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0002:pjr-hdtz-lp-v0-5-0-update]]
