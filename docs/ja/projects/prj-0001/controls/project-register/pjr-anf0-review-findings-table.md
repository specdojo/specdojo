---
specdojo:
  id: prj-0001:pjr-anf0-review-findings-table
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  registered_at: "2026-11-24T17:43:28Z"
  completed_at: "2026-11-25T22:00:35Z"
  conclusion: 指摘を構造で受け取り、runner が result に表を 1 回だけ描くようにした。
  derived_from:
    - PJR-QCJ5
    - PJR-0BGE
---

# PJR-ANF0 レビューの段の指摘を構造で受け取り runner が result に表として描く

## 1. 概要

PJR-QCJ5 で指示の文面（kata-guide と strategy）を直した後も、全件レビュー（PJR-0BGE）の result の指摘の表は 1 行に詰まったまま描かれる（例: `T-KATA-REVIEW-ALL-cxd-sample-110`・`T-KATA-REVIEW-ALL-mip-index-sample-130`、2026-11-24）。原因は runner の側にある。`src/exec/results.ts` の `reporterInlineText` が reporter の文の改行を空白に変え、`reporterBulletList` が 1 文を箇条書き 1 行にするため、文面の指示では表にならない。指摘を構造で受け取り、runner が表を描く形に変える。

## 2. 入力

- QCJ5 の指示の直しの後も、全件レビューの result の表は 1 行に詰まる（2026-11-24 の cxd-sample-110・mip-index-sample-130）
- 原因は src/exec/results.ts の reporterInlineText と reporterBulletList（オーケストレーターの調べ、2026-11-25）
- 担当と期限は利用者の確認待ち

## 3. 完了条件

- reporter の出力（edit の形）に、指摘を構造で渡す任意の欄（例: `findings`。1 件ごとに No・段・箇所・指摘・直した案・根拠・印）を足し、runner がそれを result の `実施内容` の後に Markdown の表として 1 回だけ描く。セルの `|` と改行は runner が正規化する。欄の名前と形は executor が決め、理由を個票の対応結果と報告の `handoff` に書く。
- 欄が無い出力は今までどおり描く（既存の result と reporter の出力の互換を保つ）。
- reporter に渡す指示（出力の形の説明）を新しい欄に合わせる。kata-guide の `人への報告の形` と、`sch-strategy-kata-review-calibration.yaml`・`sch-strategy-kata-review-all.yaml` の段の `description` の報告の指示を、新しい欄を使う形に直す。track は直接編集しない。
- reporter の agent の定義など保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 単体テストを足す（表の描き方、セルの `|` と改行の正規化、欄が無いときに変わらないこと、schema の検査）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- 統合の後に、オーケストレーターがレビューの段を 1 件 `exec run` で流し、result の指摘が Markdown の表として 1 回だけ描かれることを確かめてから close する。runner を変えるため、全件レビュー（PJR-0BGE）の auto loop が止まっている間に統合する。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                                           | 担当         | 状態 | メモ                                                                                                          |
| --- | ---------------------------------------------------------------------------------------------- | ------------ | ---- | ------------------------------------------------------------------------------------------------------------- |
| 1   | reporter の edit の出力に任意の欄 `findings` を足す（型・検証・公開 schema）                   | executor     | done | `src/exec/reporter-output.ts`・`exec-reporter-output.schema.yaml`                                             |
| 2   | runner が `findings` を `実施内容` の後に表として 1 回だけ描き、セルの `\|` と改行を正規化する | executor     | done | `src/exec/results.ts` の `renderFindingsTable`                                                                |
| 3   | reporter への指示（prompt）を新しい欄に合わせる                                                | executor     | done | `src/exec/reporter.ts` の `buildReporterPrompt`                                                               |
| 4   | kata-guide の `人への報告の形` と 2 つの strategy の段の `description` を新しい欄に合わせる    | executor     | done | track は変更していない                                                                                        |
| 5   | 単体テストを足す（表の描き方、セルの正規化、欄が無いときの不変、schema の検査、prompt）        | executor     | done | `tests/src/exec/results.test.ts`・`tests/src/exec/reporter.test.ts`                                           |
| 6   | 統合の後にレビューの段を 1 件 `exec run` で流し、指摘が表として 1 回だけ描かれることを確かめる | orchestrator | open | executor では実行できない（統合後の実 agent の run が要る。PJR-0BGE の auto loop が止まっている間に統合する） |

## 5. 対応結果

### 5.1. 実施内容

- reporter の edit の出力に任意の欄 `findings` を足した。1 件は `no`・`stage`・`location`・`finding`・`fix`・`basis`・`mark` の 7 つの文字列（どれも必須・空不可・4000 字以内）、最大 100 件。欄の外のキーや欠けた列は検証で返す。
- runner は `findings` が 1 件以上あるとき、`## 1. 実施内容` の箇条書きの後に `No・段・箇所・指摘・直した案・根拠・印` の表を 1 回だけ描く。セルは自由記述と同じ正規化（改行と連続空白を空白 1 つ、山括弧のエスケープ、`_` 入りの語のコード化）をしたうえで、`|`（既に `\|` のものも含む）を `\|` 1 つにそろえる。空のセルは `-` にする。
- `findings` が無い出力と空の配列は、今までと同じ本文になる（単体テストで同一を確かめた）。
- reporter の prompt（edit）に、plan が指摘を求めるときは `findings` に 1 件ずつ入れ、`summary` と `handoff` に表や指摘を重ねないことを足した。
- kata-guide の `人への報告の形` と `sch-strategy-kata-review-all.yaml`・`sch-strategy-kata-review-calibration.yaml` の段 R1〜R5 の `description` を、reporter は `findings` で渡し runner が表を描く形に直した。executor が `handoff` に 1 件ずつ書く指示は変えていない。

### 5.2. 決めたことと理由

- 欄の名前は `findings`、列のキーは英語の `no`・`stage`・`location`・`finding`・`fix`・`basis`・`mark` にした。既存の欄（`summary`・`handoff`・`changed_files` の `path`）が英語のキーで、表の見出しは runner が日本語で付けるため。kata-guide の列の順に対応させた。
- 欄は edit の形だけに足した。レビューの段は edit の plan で流れる（review の形は grade の結果の判定に使う）ため。
- `fix` と `mark` も必須にし、値が無いときは `-` を書かせた。kata-guide の表が `-` を使っており、列の欠けで表が崩れないようにするため。
- 表の位置は `実施内容` の箇条書きの後とし、章は足していない。result の章立て（template）を変えず、既存の result と描き方をそろえるため。
- executor の報告の形（`handoff` に 1 件ずつ）は変えていない。executor の報告の envelope を変えると runner の evidence の検証まで広がり、このタスクの完了条件の外になるため。

### 5.3. 残課題

- executor が `handoff` に書いた指摘は、runner が `申し送り` にも機械的に残すため、指摘が `申し送り` の箇条書きにも 1 件ずつ出る（表は 1 回だけ）。重ねたくない場合は、executor の報告の形へ構造の欄を足すか、レビューの段では指摘を `final_message` に書かせる変更が要る。別の項目で扱う。
- R4 の「主張ごとの確かめの表」は今も reporter の自由記述として描かれ、1 行に詰まる。同じ形の構造の欄が要るかは R4 の result を見て判断する。
- 統合の後の `exec run` での確かめ（作業内容の No 6）はオーケストレーターが行う。

### 5.4. CHANGELOG に書く事項

- 区分: Changed
- 文案: `exec` の reporter の edit の出力に任意の欄 `findings`（`no`・`stage`・`location`・`finding`・`fix`・`basis`・`mark`）を足し、runner が result の実施内容の後に指摘の表として描くようにした。欄の無い出力は今までどおり描く（PJR-ANF0）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-qcj5-kata-review-report-table]]: 指示の文面を直した前の項目。
- [[prj-0001:pjr-0bge-kata-review-all]]: 1 行に詰まった result の出どころの全件レビュー。
- [[specdojo:kata-guide|実践の型活用ガイド]]: `人への報告の形` を直した。
- [[prj-0001:sch-strategy-kata-review-all]]・[[prj-0001:sch-strategy-kata-review-calibration]]: 段の `description` を直した。
