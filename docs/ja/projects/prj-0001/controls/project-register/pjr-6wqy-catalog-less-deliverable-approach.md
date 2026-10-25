---
specdojo:
  id: prj-0001:pjr-6wqy-catalog-less-deliverable-approach
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-25T05:11:58Z"
  due_on: "2026-10-31"
---

# PJR-6WQY 成果物カタログがなくても fully-guided などで成果物を作れるようにする

## 1. 概要

カタログのない project でも、作るファイルの置き場所と rulebook を個票に指定するか、既存の文書の frontmatter から辿ることで、fully-guided・recipe-guided・freeform・retrofit・bootstrap・finalize・bootstrap-finalize の plan を作れるようにする

- 起きたこと: 利用者の project（coderdojo-lessons-specdojo の prj-0001）で、カタログのないまま `fully-guided` の todo を dry-run すると、`Approach "fully-guided" requires a deliverable target, but catalog_path is not configured for project prj-0001` で止まった（2026-10-25）。
- 今の決まり: [[prj-0001:pjr-zjxq-register-approach-fields|PJR-ZJXQ]] で、成果物を作る・直す approach の対象はカタログで解決すると決めた。まだ文書のない成果物も対象にするためである。plan はカタログの成果物の項目から、作るファイルの置き場所、名前・概要・依存先、種類と rulebook、`done_criteria` を読む（`src/exec/plans-generation.ts`）。`finalize`・`bootstrap-finalize` の人の plan は、`done_criteria` のチェック表と確定対象の一覧を作る。
- カタログなしで使えるのは、kata を作る `*-authoring` だけである（[[prj-0001:pjr-zv60-kata-authoring-sources|PJR-ZV60]]）。
- 手がかり: 成果物の frontmatter には `specdojo.rulebook` が、rulebook の frontmatter には `recipe`・`sample`・`template` がある。作るファイルの置き場所と rulebook が分かれば、カタログがなくても kata を辿れる。

## 2. 完了条件

- 対象の approach は `fully-guided`・`recipe-guided`・`freeform`・`retrofit`・`bootstrap`・`finalize`・`bootstrap-finalize` とする。`cross-deliverable-dedup` は、カタログの成果物のまとまりを対象にするため、これまでどおりカタログを必要とし、そのことを文書に書く。
- カタログのない project で、対象の approach の個票を `register add` で起票し、`exec plan --register` で plan を作れる。
  - 対象がすでにある文書の場合は、id の索引で文書を見つけ、置き場所と、frontmatter の `specdojo.rulebook` を使う。
  - 対象がまだない文書の場合は、作るファイルの置き場所（リポジトリからの相対パス）と rulebook の id を、`register add`・`register update` のオプションで個票に記録する。オプションと frontmatter の項目の名前は executor が決め、理由を個票の対応結果と報告の `handoff` に書く。
  - 既存の文書の frontmatter と個票の指定が食い違う場合の扱いを決め、個票の対応結果と報告の `handoff` に書く。
- recipe・sample・template は、rulebook の frontmatter から辿る。`not-needed` のものは plan に載せない。
- approach が求める kata がそろわない場合（`fully-guided` で sample がない、`recipe-guided` で recipe がない、など）は、起票の時点で、足りない kata の名前を挙げて止める。`bootstrap` は kata を作る approach のため、kata が足りなくても止めない。
- `bootstrap`:
  - 作るファイルの置き場所と、新しく作る rulebook の id を個票で指定する。既にある rulebook を指定した場合の扱いを決め、個票の対応結果と報告の `handoff` に書く。
  - plan には、まだない kata を「未作成」の状態で載せる。作る kata の置き場所は `docs/ja/specdojo/<kind>s/<kata_authority>/` とし、`kata_authority` がない場合は起票の時点で止める。
  - recipe・sample・template の id の付け方は executor が決め、理由を個票の対応結果と報告の `handoff` に書く。
  - 作った rulebook の id を、成果物の frontmatter の `specdojo.rulebook` に書くよう plan で指示する。
- `finalize`・`bootstrap-finalize`:
  - 対象は既にある文書に限る。まだない文書を対象にした場合は、起票の時点で止める。
  - チェック表は、個票の完了条件から作る。
  - 確定対象は、`finalize` では成果物、`bootstrap-finalize` では成果物と、frontmatter の `specdojo.rulebook` と rulebook の frontmatter から辿った kata 一式とする。
- カタログのない plan の完了条件は、個票の完了条件と rulebook とする。plan に、カタログの `done_criteria` がないことを書く。
- カタログのある project では、これまでどおりの動きを変えない。カタログを設定していて対象がカタログにない場合は、置き場所と rulebook の明示の指定があるときだけ、カタログなしと同じ解決を使う。指定がないときは、今のエラーで止める。
- 作るファイルの置き場所は、リポジトリの外を指さないことと、既存の別の文書と重ならないことを確かめる。
- [[specdojo:quick-start-guide]]、[[specdojo:command-reference]]、approach を説明する文書に、カタログなしで使う手順と、カタログを必要とする approach を書く。
- 単体テストで、既存の文書の対象、まだない文書の対象、kata が足りない場合、カタログのある project の互換、置き場所の検証を確かめる。`bootstrap`（`kata_authority` がない場合を含む）・`finalize`・`bootstrap-finalize` の plan も確かめる。統合テストで、カタログのない一時リポジトリで `register add` から `exec plan --register` までが通ることを確かめる。
- plan の生成を変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ                                    |
| --- | ------------------------------------------------------------ | ---- | ---- | --------------------------------------- |
| 1   | 置き場所と rulebook を個票に記録するオプションと項目を決める | DEV  | open | 名前と理由を対応結果に書く              |
| 2   | 起票の検証と plan の生成を、カタログなしの解決に対応させる   | DEV  | open | カタログのある project の動きは変えない |
| 3   | 文書と test を足す                                           | DEV  | open | 統合テストで起票から plan までを通す    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zjxq-register-approach-fields]]：成果物の approach の対象をカタログで解決すると決めた項目
- [[prj-0001:pjr-zv60-kata-authoring-sources]]：kata を作る approach をカタログなしで使えるようにした項目
- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）
