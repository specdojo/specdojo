---
specdojo:
  id: prj-0001:pjr-tn50-kata-wave-3-stc-index-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T05:40:48Z"
  completed_at: "2026-11-22T07:02:38Z"
  conclusion: stc-index の型を grade の指摘に沿って直し、評価し直しで合格の基準（機械的な指摘を除いて blocker と major がない）を満たした
  derived_from:
    - PJR-ABY4
---

# PJR-TN50 第 3 波の stc-index の型を grade の指摘に沿って直す

## 1. 概要

第 3 波の 090 で stc-index の型（rulebook pass 96（minor 2）、sample needs-work 94（major 1・minor 4））が合格に届かなかったため、grade の指摘を直して評価し直す

## 2. 入力

- 2026-11-22、T-KATA-WAVE-3-stc-index-sample-090 の review で、型の評価は rulebook pass 96（minor 2）、sample needs-work 94（major 1・minor 4） だった。指摘は docs/ja/projects/prj-0001/execution/grade/results/specdojo.stc-index-rulebook.yaml と specdojo.stc-index-sample.yaml にある。
- 合格は、機械的な「未解決の `_TODO_` / `_ASSUMPTION_`」の指摘（PJR-7C9X）を除いて、rulebook と sample に blocker と major がないこととする（indie の判断、2026-11-22）。
- `_TODO_` は sample に残さない。`_ASSUMPTION_` は docs/ja/specdojo/standards/sample-authoring-standard.md に従って残してよい。

## 3. 完了条件

- 変えるのは `docs/ja/specdojo/rulebooks/stc-index-rulebook.md` と `docs/ja/specdojo/samples/stc-index-sample.md` だけとする。ほかの型の rulebook・sample・recipe・template は変えない。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.stc-index-rulebook.yaml` と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.stc-index-sample.yaml` の `findings` を 1 件ずつ直す。直さない指摘は、ID と理由を個票の対応結果に書く。
- sample の F005（機械的な「未解決の _TODO_ / _ASSUMPTION_」の指摘、PJR-7C9X）は、`_TODO_` を解消して扱う。sample に `_TODO_` を残さない。`_ASSUMPTION_` は `sample-authoring-standard` に従って残してよい。
- rulebook を変えた場合は、sample が rulebook に従っていることを確かめ、食い違いがあれば sample も直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に「なし」（文書の型の手直しのため）と書く。
- `npm run lint:md` を通し、親の検証を通す。
- 統合の後、オーケストレーターが `npx specdojo grade run --target kata --kata stc-index` で評価し直し、rulebook と sample に blocker と major がないことを確かめる。機械的な指摘（PJR-7C9X）だけが残る場合は合格とし、そのことを個票の対応結果に書く。合格しなければ、この項目に回目の完了条件を足して流し直す。

## 4. 作業内容

| No  | 作業                               | 担当                  | 状態 | メモ                                                               |
| --- | ---------------------------------- | --------------------- | ---- | ------------------------------------------------------------------ |
| 1   | grade の指摘を読み、直し方を決める | DEV                   | done | 全指摘を直した                                                     |
| 2   | rulebook と sample を直す          | DEV                   | done | ほかの型は変えていない                                             |
| 3   | lint と親の検証を通す              | DEV                   | done | markdownlint は通過。親の検証は runner が実行                      |
| 4   | 統合の後に grade で評価し直す      | specdojo-orchestrator | open | executor は grade を起動できない。統合後にオーケストレーターが実施 |

## 5. 対応結果

### 5.1. CHANGELOG に書く事項

なし（文書の型の手直しのため）

### 5.2. 実施内容

rulebook（`stc-index-rulebook`）:

- F001: 推奨カラムの見出しを「省略してよい。置く場合は必須カラムの後に、この順で並べる」に改め、必須と推奨の矛盾を解消した。
- F002: 分割候補の閾値は rulebook の「表が60行以上」を正とし、sample を揃えた。

sample（`stc-index-sample`）:

- F001: 印刷の用紙切れを観点 `会計維持` に付け替え、観点の系統表にも追加した。
- F002: P2 を「BAC-01〜BAC-03 に含まれない頻度の低い組合せ」に限った。
- F003: 閾値を「60行以上」に揃えた。
- F004: 印字結果不明（30秒タイムアウト）を対象外の例外とスタブの一覧に加えた。
- F005: `_TODO_` の2行を解消した。証跡形式は共通方針へ決定として取り込み、スモークと回帰の分離は P0 全件再実行の方針があるため行を削除した。`_ASSUMPTION_` と `_UNDECIDED_` は残した。

直さなかった指摘はない。

### 5.3. 残課題

- 統合後の `npx specdojo grade run --target kata --kata stc-index` による再評価は、オーケストレーターが行う。

### 5.4. 統合後の評価し直し

- 2026-11-22、オーケストレーターが `npx specdojo grade run --target kata --kata stc-index`（run id `regrade-wave3-fix-2026-11-22`、opus-review-executor）で評価し直した。
- `stc-index-rulebook`: pass、score 97（minor 1、2026-11-22T06:44:46.190Z）
- `stc-index-sample`: needs-work、score 91（minor 4・major 1、2026-11-22T06:45:57.721Z）
- 残った major は sample の F005（機械的な「未解決の _TODO_ / _ASSUMPTION_」の指摘、PJR-7C9X）だけで、sample の `_TODO_` は 0 件、`_ASSUMPTION_` だけが残る。合格の基準（この指摘を除いて blocker と major がない）を満たすため、合格とした。

## 6. 関連ドキュメント

- [[specdojo:stc-index-rulebook]]
- [[specdojo:stc-index-sample]]
