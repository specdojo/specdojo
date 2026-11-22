---
specdojo:
  id: prj-0001:pjr-86bn-kata-wave-3-itc-fix
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
  registered_at: "2026-11-22T05:42:07Z"
  derived_from:
    - PJR-ABY4
---

# PJR-86BN 第 3 波の itc の型を grade の指摘に沿って直す

## 1. 概要

第 3 波の 090 で itc の型（rulebook pass 93（minor 6）、sample needs-work 89（major 2・minor 4））が合格に届かなかったため、grade の指摘を直して評価し直す

## 2. 入力

- 2026-11-22、T-KATA-WAVE-3-itc-sample-090 の review で、型の評価は rulebook pass 93（minor 6）、sample needs-work 89（major 2・minor 4） だった。指摘は docs/ja/projects/prj-0001/execution/grade/results/specdojo.itc-rulebook.yaml と specdojo.itc-sample.yaml にある。
- 合格は、機械的な「未解決の `_TODO_` / `_ASSUMPTION_`」の指摘（PJR-7C9X）を除いて、rulebook と sample に blocker と major がないこととする（indie の判断、2026-11-22）。
- `_TODO_` は sample に残さない。`_ASSUMPTION_` は sample-authoring-standard（sample の記述の標準、読むだけで変えない）に従って残してよい。

## 3. 完了条件

- 変えるのは `docs/ja/specdojo/rulebooks/itc-rulebook.md` と `docs/ja/specdojo/samples/itc-sample.md` だけとする。ほかの型の rulebook・sample・recipe・template は変えない。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.itc-rulebook.yaml` と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.itc-sample.yaml` の `findings` を 1 件ずつ直す。直さない指摘は、ID と理由を個票の対応結果に書く。
- sample の F006（機械的な「未解決の _TODO_ / _ASSUMPTION_」の指摘、PJR-7C9X）は、`_TODO_` を解消して扱う。sample に `_TODO_` を残さない。`_ASSUMPTION_` は `sample-authoring-standard` に従って残してよい。
- sample の F005（major）: `it-sales-checkout-persistence-integrity-020` の採番が `itc-index-sample` の「ケース表の共通カラム」と食い違う。`itc-index-sample` は変えず、本書の採番を `itc-index-sample` に揃える。
- rulebook を変えた場合は、sample が rulebook に従っていることを確かめ、食い違いがあれば sample も直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に「なし」（文書の型の手直しのため）と書く。
- `npm run lint:md` を通し、親の検証を通す。
- 統合の後、オーケストレーターが `npx specdojo grade run --target kata --kata itc` で評価し直し、rulebook と sample に blocker と major がないことを確かめる。機械的な指摘（PJR-7C9X）だけが残る場合は合格とし、そのことを個票の対応結果に書く。合格しなければ、この項目に回目の完了条件を足して流し直す。
- 2 回目の実行（2026-11-22）: 統合後の評価し直し（itc-sample は needs-work 90、major 2・minor 3）で、sample の F001（major）が残った。`it-sales-checkout-transaction-boundary-010` の期待値はエラー種別 `out-of-stock` だが、観測点（アサーション）が `duplicate-transaction` になっている。観測点を期待値に揃える。あわせて `docs/ja/projects/prj-0001/execution/grade/results/specdojo.itc-sample.yaml` と `specdojo.itc-rulebook.yaml` の新しい `findings` を 1 件ずつ確かめ、直さない指摘は ID と理由を個票の対応結果に書く。F005 は機械的な指摘（PJR-7C9X）で、`_TODO_` がなければ扱いは 1 回目と同じ。

## 4. 作業内容

| No  | 作業                               | 担当                  | 状態 | メモ                                                     |
| --- | ---------------------------------- | --------------------- | ---- | -------------------------------------------------------- |
| 1   | grade の指摘を読み、直し方を決める | DEV                   | done | 直さない指摘なし（F006 は `_ASSUMPTION_` を残す）        |
| 2   | rulebook と sample を直す          | DEV                   | done | ほかの型は変えていない                                   |
| 3   | lint と親の検証を通す              | DEV                   | open | 親の runner が実行するため executor は未実行             |
| 4   | 統合の後に grade で評価し直す      | specdojo-orchestrator | open | executor は grade を起動しない。合格しなければ回目を足す |

## 5. 対応結果

rulebook（`itc-rulebook`）の指摘:

- F001・F004・F006: 「sample が未整合」の記述を削除し、`_UNDECIDED_` を `recipe`・`template` の要否に絞って PJR-WYTX で併せて判断すると書いた。
- F002: 全体方針と条件・ケース表の節、記述ガイド冒頭の重複を削った。
- F003: トレースの節に、根拠仕様の改訂・廃止時の追従（行を残し備考へ記録、ケースの見直し）を追加した。
- F005: UT・IT・ET を初出で正式名とともに示し、「Mock」を「モック」に統一した。

sample（`itc-sample`）の指摘:

- F001: BAC-03 の C-04 を `TR-06` と `it-sales-checkout-pending-hold-020`（`pending-quantity`）で扱った。
- F002: 応答の識別子 `duplicate-transaction`・`checkout-failed`・`pending-product`・`pending-quantity` を期待値と観測点に明記した。
- F003: 「テスト観点とケース」の冒頭に、観点の型ごとの採用と不採用の理由を追加した。
- F004: `TR-05` の仕様IDを BAC-01 にし、分配方針への参照を備考へ移した。
- F005: `-020` を同じ取引番号の再送、`-030` を在庫と同数の購入に入れ替え、`itc-index-sample` の採番に揃えた。
- F006: `_TODO_` は sample にない。`_ASSUMPTION_`（分離レベル）は `sample-authoring-standard` に従って残す。機械的な指摘（PJR-7C9X）として残る見込み。

### 5.1. CHANGELOG に書く事項

なし（文書の型の手直しのため）。

### 5.2. 残課題

- 統合後に orchestrator が `npx specdojo grade run --target kata --kata itc` で評価し直す。blocker・major がなく機械的な指摘だけが残る場合は合格とする。
- recipe の要否の判断は PJR-WYTX に引き継ぐ。

## 6. 関連ドキュメント

- [[specdojo:itc-rulebook]]
- [[specdojo:itc-sample]]
