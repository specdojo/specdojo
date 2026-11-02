---
specdojo:
  id: prj-0002:pjr-rwqv-lp-changelog
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-02T06:36:50Z"
  due_on: "2026-11-30"
---

# PJR-RWQV specdojo-lp に CHANGELOG.md と更新ルールを整える

## 1. 概要

LP 独自の CHANGELOG.md を作成し、確認できる直近の変更を Unreleased に記載する。develop への統合時に追記し、本番公開時に公開日付きの節へ移す運用を README に記載する。

## 2. 入力

- 利用者は specdojo-lp の develop を push 済みと述べ、CHANGELOG.md の作成を希望した。提案した todo の起票と実行を依頼し、担当 BA、期限 2026年11月末を指定した。
- 合意した方針：develop に統合した変更は Unreleased に記載し、main から本番公開する際に公開日付きの節へ移す。SpecDojo 本体の変更履歴とは分け、当面は日付で管理する。過去の変更をすべて復元せず、確認できる直近の変更から始める。
- README の運用では main が本番公開状態、develop はプレビューの統合先。develop への push を本番公開として記録しない。Git の main..develop と実際の差分を確認し、公開日を推測せず、公開済みの変更を未公開と誤記しない。

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
