---
specdojo:
  id: prj-0001:pjr-k32v-kata-wave-3-itc-index-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T05:41:41Z"
  derived_from:
    - PJR-ABY4
---

# PJR-K32V 第 3 波の itc-index の型を grade の指摘に沿って直す

## 1. 概要

第 3 波の 090 で itc-index の型（rulebook pass 98（minor 2）、sample needs-work 92（major 1・minor 4））が合格に届かなかったため、grade の指摘を直して評価し直す

## 2. 入力

- 2026-11-22、T-KATA-WAVE-3-itc-index-sample-090 の review で、型の評価は rulebook pass 98（minor 2）、sample needs-work 92（major 1・minor 4） だった。指摘は docs/ja/projects/prj-0001/execution/grade/results/specdojo.itc-index-rulebook.yaml と specdojo.itc-index-sample.yaml にある。
- 合格は、機械的な「未解決の `_TODO_` / `_ASSUMPTION_`」の指摘（PJR-7C9X）を除いて、rulebook と sample に blocker と major がないこととする（indie の判断、2026-11-22）。
- `_TODO_` は sample に残さない。`_ASSUMPTION_` は sample-authoring-standard（sample の記述の標準、読むだけで変えない）に従って残してよい。

## 3. 完了条件

- 変えるのは `docs/ja/specdojo/rulebooks/itc-index-rulebook.md` と `docs/ja/specdojo/samples/itc-index-sample.md` だけとする。ほかの型の rulebook・sample・recipe・template は変えない。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.itc-index-rulebook.yaml` と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.itc-index-sample.yaml` の `findings` を 1 件ずつ直す。直さない指摘は、ID と理由を個票の対応結果に書く。
- sample に `_TODO_` を残さない。`_ASSUMPTION_` は `sample-authoring-standard` に従って残してよい。
- sample の F001（major）: 適用対象の `PATH-04`・`PATH-07` が、根拠の `tsp-index-sample` の内部結合テストの範囲（`PATH-01`〜`PATH-03`）と食い違う。`tsp-index-sample` は変えない。上位に合わせて範囲を揃えるか、範囲を広げる根拠を本書に書く。tsp 側の改訂が要ると判断した場合は、その案を個票の対応結果に書く。
- rulebook を変えた場合は、sample が rulebook に従っていることを確かめ、食い違いがあれば sample も直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に「なし」（文書の型の手直しのため）と書く。
- `npm run lint:md` を通し、親の検証を通す。
- 統合の後、オーケストレーターが `npx specdojo grade run --target kata --kata itc-index` で評価し直し、rulebook と sample に blocker と major がないことを確かめる。機械的な指摘（PJR-7C9X）だけが残る場合は合格とし、そのことを個票の対応結果に書く。合格しなければ、この項目に回目の完了条件を足して流し直す。

## 4. 作業内容

| No  | 作業                               | 担当                  | 状態 | メモ                                                       |
| --- | ---------------------------------- | --------------------- | ---- | ---------------------------------------------------------- |
| 1   | grade の指摘を読み、直し方を決める | DEV                   | done | 直さない指摘は rulebook の F001・F002（対応結果に理由）    |
| 2   | rulebook と sample を直す          | DEV                   | done | sample のみ変更。rulebook は変更なし                       |
| 3   | lint と親の検証を通す              | DEV                   | open | 親 runner が実行する。executor は実行しない                |
| 4   | 統合の後に grade で評価し直す      | specdojo-orchestrator | open | 統合後にオーケストレーターが実行。合格しなければ回目を足す |

## 5. 対応結果

### 5.1. CHANGELOG に書く事項

なし（文書の型の手直しのため）。

### 5.2. 実施内容

変更は `docs/ja/specdojo/samples/itc-index-sample.md` のみ。rulebook は変更していない。

sample の指摘への対応は次のとおり。

- F001（major）: `tsp-index-sample` が保全の取得（`PATH-04`）と復元の回復（`PATH-07`）を外部結合テストの範囲としているため、範囲を上位に合わせた。適用対象を `PATH-01`〜`PATH-03` に絞り、`itc-record-backup`、関連する業務リスク、観点の列、分配表の行、依存の行を削除した。保全・復元は対象外の表で ET・ST へ送る。tsp 側の改訂は不要と判断した。
- F002: データの方針に、別接続やコミット済みデータが要る条件（ロック競合・ロールバック検証）は seed の再投入とスキーマ分離で独立させる例外を足した。
- F003: 分割の閾値を rulebook に合わせて「観点が 15 以上、ケース表が 50 行以上」にした。
- F004: 「通信不能時の販売継続」の代替レベルを `ST` にし、未決であることは除外理由へ移した。
- F005: 「そろえ」「揃える」の重複を解消し、「統一する」に改めた。
- `_TODO_` のあった将来課題の行は、マーカーを外して論点として残した。`_ASSUMPTION_` と `_UNDECIDED_` は残している。

rulebook の指摘のうち、次は直していない。

- F001・F002（minor）: Frontmatter の `recipe` と `template` が `undecided`。完了条件が rulebook・sample 以外の型の成果物を変えないとしており、recipe・template は型の schedule の後続の段で作成または対象外を決めるため、本項目では扱わない。

### 5.3. 残課題

- 統合後に、オーケストレーターが `npx specdojo grade run --target kata --kata itc-index` で再評価し、blocker と major がないことを確かめる。機械的な指摘（PJR-7C9X）だけが残る場合は合格とする。
- 親 runner の `npm run lint:md` などの検証結果は runner の evidence に残る。

## 6. 関連ドキュメント

- `specdojo:itc-index-rulebook`
- `specdojo:itc-index-sample`
- `specdojo:tsp-index-sample`
