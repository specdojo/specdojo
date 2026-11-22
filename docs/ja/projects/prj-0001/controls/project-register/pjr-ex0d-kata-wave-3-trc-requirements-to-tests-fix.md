---
specdojo:
  id: prj-0001:pjr-ex0d-kata-wave-3-trc-requirements-to-tests-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T05:42:59Z"
  derived_from:
    - PJR-ABY4
---

# PJR-EX0D 第 3 波の trc-requirements-to-tests の型を grade の指摘に沿って直す

## 1. 概要

第 3 波の 090 で trc-requirements-to-tests の型（rulebook needs-work 88（major 2・minor 2）、sample pass 93（minor 3））が合格に届かなかったため、grade の指摘を直して評価し直す

## 2. 入力

- 2026-11-22、T-KATA-WAVE-3-trc-requirements-to-tests-sample-090 の review で、型の評価は rulebook needs-work 88（major 2・minor 2）、sample pass 93（minor 3） だった。指摘は docs/ja/projects/prj-0001/execution/grade/results/specdojo.trc-requirements-to-tests-rulebook.yaml と specdojo.trc-requirements-to-tests-sample.yaml にある。
- 合格は、機械的な「未解決の `_TODO_` / `_ASSUMPTION_`」の指摘（PJR-7C9X）を除いて、rulebook と sample に blocker と major がないこととする（indie の判断、2026-11-22）。
- `_TODO_` は sample に残さない。`_ASSUMPTION_` は sample-authoring-standard（sample の記述の標準、読むだけで変えない）に従って残してよい。

## 3. 完了条件

- 変えるのは `docs/ja/specdojo/rulebooks/trc-requirements-to-tests-rulebook.md` と `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md` だけとする。ほかの型の rulebook・sample・recipe・template は変えない。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.trc-requirements-to-tests-rulebook.yaml` と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.trc-requirements-to-tests-sample.yaml` の `findings` を 1 件ずつ直す。直さない指摘は、ID と理由を個票の対応結果に書く。
- sample に `_TODO_` を残さない。`_ASSUMPTION_` は `sample-authoring-standard` に従って残してよい。
- rulebook の F003（major）: `充足` の判定が、`stc-rulebook` が定めていない `relations.verifies` の宣言を前提にしている。`stc-rulebook` は変えず、総合テストの場合の判定の規則を本 rulebook に定める。`stc-rulebook` の改訂が要ると判断した場合は、その案を個票の対応結果に書く。
- rulebook を変えた場合は、sample が rulebook に従っていることを確かめ、食い違いがあれば sample も直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に「なし」（文書の型の手直しのため）と書く。
- `npm run lint:md` を通し、親の検証を通す。
- 統合の後、オーケストレーターが `npx specdojo grade run --target kata --kata trc-requirements-to-tests` で評価し直し、rulebook と sample に blocker と major がないことを確かめる。機械的な指摘（PJR-7C9X）だけが残る場合は合格とし、そのことを個票の対応結果に書く。合格しなければ、この項目に回目の完了条件を足して流し直す。

## 4. 作業内容

| No  | 作業                               | 担当                  | 状態 | メモ                             |
| --- | ---------------------------------- | --------------------- | ---- | -------------------------------- |
| 1   | grade の指摘を読み、直し方を決める | DEV                   | done | 全指摘を直した                   |
| 2   | rulebook と sample を直す          | DEV                   | done | ほかの型は変えていない           |
| 3   | lint と親の検証を通す              | DEV                   | open | 親の runner が実行する           |
| 4   | 統合の後に grade で評価し直す      | specdojo-orchestrator | open | 統合後に orchestrator が実行する |

## 5. 対応結果

rulebook（`trc-requirements-to-tests-rulebook`）の指摘:

- F001（minor）: 生成の手順 3 に、仕様ID から要求文書 ID と項目 ID を取り出す規則（wikilink、併記、下位項目、項目 ID なしの行）を追加した。
- F002（major）: 手順 2 を 2 経路（`relations.verifies`、索引のテストの「トレース」の表の走査）に改め、手順 4 の照合条件を揃えた。
- F003（major）: 総合テストは `relations.verifies` を宣言しない種別とし、「トレース」の表が要求文書を指すことを文書単位の対応とする規則を「充足状況の判定」に定めた。`stc-rulebook` は変えていない。`stc-rulebook` の改訂は不要と判断した（改訂案なし）。
- F004（minor）: 生成コマンドと recipe・template の要否を `_UNDECIDED_` で残し、`ready` の昇格条件を明記した。

sample（`trc-requirements-to-tests-sample`）の指摘:

- F001・F002（minor）: 抽出条件を rulebook の手順 2 の 2 経路に揃えた。
- F003（minor）: ギャップ表の要求項目を `<要求文書ID> <項目ID>` の表記に統一した。
- rulebook の変更に合わせ、`stc-cash-sale` の `relations.verifies` 欠落をギャップ・優先事項・ギャップ表から除いた。`_TODO_` は残していない。

直さなかった指摘はない。再評価（作業 4）は統合後に orchestrator が実行する。

### 5.1. CHANGELOG に書く事項

なし（文書の型の手直しのため）。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
