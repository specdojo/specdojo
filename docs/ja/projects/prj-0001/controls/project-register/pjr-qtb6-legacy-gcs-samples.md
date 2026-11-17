---
specdojo:
  id: prj-0001:pjr-qtb6-legacy-gcs-samples
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-17T22:47:12Z"
  due_on: "2026-11-30"
---

# PJR-QTB6 古い駄菓子屋の sample（sample-gcs-*）の中身を specdojo の sample へ反映し、local/ へ移す

## 1. 概要

docs/ja/sample-gcs-product・sample-gcs-projects・sample-gcs-story の古い sample のうち、今の specdojo の sample に足すと役に立つ記述を反映し、ディレクトリを local/ へ移して git の管理から外す。

## 2. 入力

- 利用者の要望（2026-11-18）: docs/ja/sample-gcs-product・sample-gcs-projects・sample-gcs-story は古い sample の文書で、local 以下に移し、git の履歴からも消したい。内容のうち specdojo の sample に反映したほうがよいものは反映したい
- orchestrator の調べ（2026-11-18）: sample-gcs-product は 74 ファイル（業務仕様・外部 IF 仕様・アーキテクチャ、日本語ディレクトリ名の旧構成）、sample-gcs-story は 13 ファイル（物語、484KB）、sample-gcs-projects は .gitkeep の 3 ファイルだけ。参照は docs/ja/index.md の表の 2 行と、過去の登録簿・実行の記録（書き換えない）
- 利用者の決定（2026-11-18）: git の履歴からの削除は履歴の書き換えと強制 push を伴い、記録に書かれた commit の hash が全部変わるため、todo では手順と影響の調べに留めて `_UNDECIDED_` で残す。実施は決めた後に利用者が行う
- 利用者の決定（2026-11-18）: local/ は git の管理外のため、exec の worktree では移せない。反映を exec run で先に行い、統合の後に orchestrator が承認を得て local/ への複製と git rm を行う

## 3. 完了条件

- `docs/ja/sample-gcs-product/` と `docs/ja/sample-gcs-story/` の文書を、型ごとに今の specdojo の sample（`docs/ja/specdojo/samples/`）と見比べる。今の sample にない、役に立つ記述（具体例・判断・図など）だけを今の sample へ反映する。
- 型ごとに、反映したもの・反映しなかったものと理由を、個票の対応結果に表で書く。
- 今の sample の結論と、kata-slim（[[prj-0001:pjr-mnm5-kata-slim|PJR-MNM5]]）で外した運用の記述や言い直しは戻さない。反映した sample は、その rulebook と `sample-authoring-standard` に合っている。
- `docs/ja/index.md` の表から `sample-gcs-projects/` と `sample-gcs-product/` の 2 行を外す。過去の登録簿と実行の記録にある名前は書き換えない。
- `docs/ja/sample-gcs-*` は executor が消したり移したりしない。`local/` への複製と `git rm` は、統合の後に orchestrator が利用者の承認を得て行う。
- git の履歴から消す件は、executor は履歴の書き換えも push もしない。手順（`git filter-repo` など）と影響を対応結果に書き、やるかどうかは `_UNDECIDED_` で残す。影響には、commit の hash を書いている記録（登録簿のイベント・実行の記録・個票）の数え上げ、worktree とブランチ、clone の作り直しを含める。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run docs:build` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                    | 担当         | 状態 | メモ |
| --- | ------------------------------------------------------- | ------------ | ---- | ---- |
| 1   | 古い sample と今の sample を型ごとに見比べる            | BA           | open | -    |
| 2   | 役に立つ記述を今の sample へ反映し、判断を表に書く      | BA           | open | -    |
| 3   | `docs/ja/index.md` の表から古い sample の行を外す       | BA           | open | -    |
| 4   | 履歴から消す手順と影響を調べて書く                      | BA           | open | -    |
| 5   | 統合の後に `local/` へ複製し、`git rm` する（承認の後） | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:sample-authoring-standard]]
- [[prj-0001:pjr-mnm5-kata-slim]]
