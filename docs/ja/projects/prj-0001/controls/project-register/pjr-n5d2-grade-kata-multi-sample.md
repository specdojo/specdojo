---
specdojo:
  id: prj-0001:pjr-n5d2-grade-kata-multi-sample
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-21T03:11:12Z"
  derived_from:
    - PJR-SW7T
---

# PJR-N5D2 grade run --kata が、rulebook に複数並べた sample の一部しか選ばない

## 1. 課題内容

rulebook の frontmatter の sample に複数の sample を並べた型（opd・opr）で、--kata が `<name>-sample` だけを選び、ほかの sample を評価の対象から外す

## 2. 入力

- 2026-11-21、grade run --target kata --kata opd --kata opr --dry-run で、選ばれた sample は opd-sample と opr-sample だけだった。opd-rulebook は sample を 4 件（うち opd-index-sample を除く 3 件が漏れた）、opr-rulebook は 8 件（opr-sample 以外の 7 件が漏れた）並べている
- --kata と --path は一緒に使えないため、漏れた 10 件は別の grade run で --path を並べて評価した（run id regrade-kata-op-samples-2026-11-21）
- PJR-SW7T の対応結果では、型名の解決は docs/ja/specdojo/samples/`<name>-sample``.*`（または rulebook の frontmatter で指定された sample）を対象とすると書かれている

## 3. 影響範囲

| 観点         | 影響                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------- |
| スコープ     | `grade run --kata` の型の名前から文書を選ぶ処理                                               |
| スケジュール | 複数の sample を持つ型を grade し直すたびに、漏れた sample を `--path` で別に流す手間がかかる |
| コスト       | -                                                                                             |
| 品質         | sample の一部が評価から漏れ、型の品質を見誤る                                                 |
| 関係者       | DEV                                                                                           |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `src/grade/targets.ts` の `resolveKataDocuments` は、rulebook の frontmatter の `sample` が文字列のときだけ宣言を見る。配列のときはファイル名（`<name>-sample.*`）での探し方に落ちる |
| 対応策   | `sample` が配列のときも、並べた sample をすべて選ぶ                                                                                                                                  |
| 依存事項 | なし                                                                                                                                                                                 |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                                                                         |

完了条件の内訳。

- `grade run --target kata --kata <name>` が、rulebook の frontmatter の `sample` に並べた sample をすべて選ぶ（文字列と配列の両方）。`not-needed`・`none`・`undecided` は sample なしとして rulebook だけを選ぶ。
- `sample` の宣言が無い rulebook は、今のファイル名での探し方を残す。
- 宣言した sample のファイルが無いときは、どの宣言のどの sample かを示して、実行の前にエラーにする。
- rulebook の読み込みに失敗したときに黙って次へ進む今の `catch` は、理由を示して止める形にするか、残す理由を対応結果に書く。
- 単体テストで、配列の宣言（opd の 4 件・opr の 8 件と同じ形）、文字列の宣言、`not-needed`、宣言した sample のファイルが無い場合を確かめる。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。利用者に影響が無い場合はそう書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

## 5. 対応結果

### 5.1. 作業内容

| 作業                                                   | 状態 | メモ                                                                                   |
| ------------------------------------------------------ | ---- | -------------------------------------------------------------------------------------- |
| `resolveKataDocuments` が配列の `sample` をすべて選ぶ  | done | `src/grade/targets.ts`。文字列・配列を同じ経路で処理する                               |
| 宣言した sample のファイルが無い場合に実行前にエラー   | done | 宣言元の rulebook と sample id を含むエラーを投げる                                    |
| rulebook 読み込み失敗の `catch` を止める形にする       | done | rulebook のパスと理由を含めて例外にする（`cause` 保持）                                |
| 単体テストを追加する                                   | done | `tests/src/grade/kata-documents.test.ts`（配列・文字列・`not-needed`・宣言なし・欠落） |
| `npm run typecheck`・`npm run lint:ts`・単体テスト確認 | done | typecheck・lint:ts（警告のみ）・`tests/src/grade` の 170 件が通過                      |

### 5.2. 解決内容

- `sample` が文字列でも配列でも、並べた sample をすべて選ぶ。`not-needed`・`none`・`undecided` は sample なしとして rulebook だけを選ぶ。
- `sample` の宣言が無い rulebook は、従来のファイル名（`<name>-sample.*`）での探し方を残す。
- 宣言した sample のファイルが無い場合は、`Sample file not found for '<id>' declared in sample of <rulebook> (kata <name>)` で止める。
- rulebook の読み込み失敗は握りつぶさず、rulebook のパスと理由を示して止める。
- 判断: 返すパスの相対化を `repoRelativePath` から `relativePathFromRoot(path, rootDir)` へ変えた。引数 `rootDir` と基準を揃えるためで、既定値では結果は同じ。テストで一時ディレクトリを使えるようになる。

### 5.3. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `grade run --kata` が、rulebook の `sample` に複数並べた sample をすべて評価対象に選ぶようにした。宣言した sample のファイルが無い場合や rulebook を読み込めない場合は、理由を示してエラーにする。

## 6. 関連ドキュメント

- `prj-0001:pjr-sw7t`（派生元の項目）
