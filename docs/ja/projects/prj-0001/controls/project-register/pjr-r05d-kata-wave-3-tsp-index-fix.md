---
specdojo:
  id: prj-0001:pjr-r05d-kata-wave-3-tsp-index-fix
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
  registered_at: "2026-11-22T05:41:14Z"
  derived_from:
    - PJR-ABY4
---

# PJR-R05D 第 3 波の tsp-index の型を grade の指摘に沿って直す

## 1. 概要

第 3 波の 090 で tsp-index の型（rulebook pass 93（minor 4）、sample needs-work 89（major 1・minor 8））が合格に届かなかったため、grade の指摘を直して評価し直す

## 2. 入力

- 2026-11-22、T-KATA-WAVE-3-tsp-index-sample-090 の review で、型の評価は rulebook pass 93（minor 4）、sample needs-work 89（major 1・minor 8） だった。指摘は docs/ja/projects/prj-0001/execution/grade/results/specdojo.tsp-index-rulebook.yaml と specdojo.tsp-index-sample.yaml にある。
- 合格は、機械的な「未解決の `_TODO_` / `_ASSUMPTION_`」の指摘（PJR-7C9X）を除いて、rulebook と sample に blocker と major がないこととする（indie の判断、2026-11-22）。
- `_TODO_` は sample に残さない。`_ASSUMPTION_` は sample-authoring-standard（sample の記述の標準、読むだけで変えない）に従って残してよい。

## 3. 完了条件

- 変えるのは `docs/ja/specdojo/rulebooks/tsp-index-rulebook.md` と `docs/ja/specdojo/samples/tsp-index-sample.md` だけとする。ほかの型の rulebook・sample・recipe・template は変えない。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.tsp-index-rulebook.yaml` と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.tsp-index-sample.yaml` の `findings` を 1 件ずつ直す。直さない指摘は、ID と理由を個票の対応結果に書く。
- sample の F009（機械的な「未解決の _TODO_ / _ASSUMPTION_」の指摘、PJR-7C9X）は、`_TODO_` を解消して扱う。sample に `_TODO_` を残さない。`_ASSUMPTION_` は `sample-authoring-standard` に従って残してよい。
- rulebook を変えた場合は、sample が rulebook に従っていることを確かめ、食い違いがあれば sample も直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に「なし」（文書の型の手直しのため）と書く。
- `npm run lint:md` を通し、親の検証を通す。
- 統合の後、オーケストレーターが `npx specdojo grade run --target kata --kata tsp-index` で評価し直し、rulebook と sample に blocker と major がないことを確かめる。機械的な指摘（PJR-7C9X）だけが残る場合は合格とし、そのことを個票の対応結果に書く。合格しなければ、この項目に回目の完了条件を足して流し直す。

## 4. 作業内容

| No  | 作業                               | 担当                  | 状態 | メモ                                                       |
| --- | ---------------------------------- | --------------------- | ---- | ---------------------------------------------------------- |
| 1   | grade の指摘を読み、直し方を決める | DEV                   | done | 直さない指摘はなし                                         |
| 2   | rulebook と sample を直す          | DEV                   | done | ほかの型は変えない                                         |
| 3   | lint と親の検証を通す              | DEV                   | done | lint:md 相当は通過、親の検証は runner が実行               |
| 4   | 統合の後に grade で評価し直す      | specdojo-orchestrator | open | executor は grade を起動できない。合格しなければ回目を足す |

## 5. 対応結果

### 5.0. 実施内容

rulebook（F001〜F004）と sample（F001〜F009）の指摘をすべて直した。直さなかった指摘はない。

- rulebook F001: 「共通の運用」に追従対象と担当（QE・DEV・PO）を追記した。
- rulebook F002: 「不具合管理方針」を、出口条件で重大度を使う場合は必須と明記した。
- rulebook F003: 良い例を `receipt-print` と復元用保管サービスに合わせて書き換えた。
- rulebook F004: 「試験」を「テスト」に統一した。
- sample F001・F009: 未決論点に引き継ぎ先（`kinuya:pjr-i003`・`kinuya:pjr-i006`・`kinuya:pjr-i007`、いずれも架空）を足し、`_TODO_` を `_ASSUMPTION_` に変えた。sample に `_TODO_` は残っていない。
- sample F002・F005: 開発環境の保管サービスをスタブにし、実接続は内部結合テストに限ると明記した。
- sample F003: 回帰の範囲に保管サービス連携と記録の保全・復元を加えた。
- sample F004: 総合テストの出口条件の行に応答の閾値を書いた。
- sample F006: 単体テストと受入テストの出口条件に重大度別の許容件数を足した。
- sample F007: 応答欠落時の照合待ちを内部結合テスト（`PATH-02`）で確認する記述に揃えた。
- sample F008: `based_on` に `specdojo:ifd-sample` を加えて本文でも参照し、`PATH-04`・`PATH-07` のテストレベルを書いた。

rulebook の変更は sample と食い違わないことを確かめた。

### 5.1. CHANGELOG に書く事項

なし（文書の型の手直しのため）。

### 5.2. 残課題

- 統合後の `npx specdojo grade run --target kata --kata tsp-index` による再評価は、オーケストレーターが行う（作業内容の No 4）。

## 6. 関連ドキュメント

- [[specdojo:tsp-index-rulebook]]
- [[specdojo:tsp-index-sample]]
