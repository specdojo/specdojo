---
specdojo:
  id: prj-0001:pjr-qtb6-legacy-gcs-samples
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-17T22:47:12Z"
  due_on: "2026-11-30"
---

# PJR-QTB6 古い駄菓子屋の sample（sample-gcs-*）の中身を specdojo の sample へ反映し、local/ へ移す

## 1. 概要

docs/ja/sample-gcs-product・sample-gcs-projects・sample-gcs-story の古い sample のうち、今の specdojo の sample に足すと役に立つ記述を反映し、ディレクトリを local/ へ移して git の管理から外す

## 2. 入力

- 利用者の要望（2026-11-18）: docs/ja/sample-gcs-product・sample-gcs-projects・sample-gcs-story は古い sample の文書で、local 以下に移し、git の履歴からも消したい。内容のうち specdojo の sample に反映したほうがよいものは反映したい
- orchestrator の調べ（2026-11-18）: sample-gcs-product は 74 ファイル（業務仕様・外部 IF 仕様・アーキテクチャ、日本語ディレクトリ名の旧構成）、sample-gcs-story は 13 ファイル（物語、484KB）、sample-gcs-projects は .gitkeep の 3 ファイルだけ。参照は docs/ja/index.md の表の 2 行と、過去の登録簿・実行の記録（書き換えない）
- 利用者の決定（2026-11-18）: git の履歴からの削除は履歴の書き換えと強制 push を伴い、記録に書かれた commit の hash が全部変わるため、todo では手順と影響の調べに留めて `_UNDECIDED_` で残す。実施は決めた後に利用者が行う
- 利用者の決定（2026-11-18）: local/ は git の管理外のため、exec の worktree では移せない。反映を exec run で先に行い、統合の後に orchestrator が承認を得て local/ への複製と git rm を行う

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
