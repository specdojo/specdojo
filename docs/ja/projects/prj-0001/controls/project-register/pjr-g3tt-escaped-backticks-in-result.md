---
specdojo:
  id: prj-0001:pjr-g3tt-escaped-backticks-in-result
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
  registered_at: "2026-11-21T14:02:38Z"
---

# PJR-G3TT result のバッククォートがエスケープされて書かれ、統合の前の検査で止まる

## 1. 課題内容

reporter などが result の本文にバックスラッシュでエスケープしたバッククォートを書き、統合の前の Markdown の検査（MD038）で止まる。原因を確かめ、書かせないか runner が直す

## 2. 入力

- 2026-11-21、T-KATA-WAVE-3-utc-sample-050 の統合が、result.md のバッククォートが \` とエスケープされていたため MD038（Spaces inside code span elements）で止まった。成果物と親の検証は通っていた。オーケストレーターがエスケープを戻して exec resume --task で統合した
- オーケストレーターの観察: 同じ形の止まり方は以前にもあった（回数は未集計）
- 利用者の決定（2026-11-21、indie）: 夜の間に流す。直し方は executor が決めて理由を記録する

## 3. 影響範囲

| 観点         | 影響                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| スコープ     | exec の result の本文の書き方と、統合の前の Markdown の検査                 |
| スケジュール | 止まった run を、オーケストレーターが手で直して統合し直すまで後続の段が待つ |
| コスト       | 1 回あたり数分の手作業。夜間の実行では朝まで止まる                          |
| 品質         | 成果物と親の検証は通っているのに、記録の書式だけで統合が止まる              |
| 関係者       | prj-0001 のオーケストレーターと、exec を使う利用者                          |

## 4. 対応方針

| 項目     | 内容                                                                           |
| -------- | ------------------------------------------------------------------------------ |
| 原因     | 未確定。どの reporter・どの経路でエスケープが入るかを executor が確かめる      |
| 対応策   | executor が決める（reporter への指示を直す、または runner が書き込む前に直す） |
| 依存事項 | なし                                                                           |
| 完了条件 | 下の箇条書きのすべてを満たす                                                   |

- reporter や runner が書いた result の本文で、バッククォートの前にバックスラッシュが付いて（`` \` ``）エスケープされ、統合の前の Markdown の検査（MD038）で止まる原因を確かめ、個票の対応結果に書く（どの reporter・どの経路で起きるか）。
- 直し方は executor が決め、理由を対応結果に書く。候補は、reporter への指示を直す、runner が result を書き込む前にコードの書式の中でないエスケープを戻す、の 2 つ。runner が直す場合は、コードの書式やコードブロックの中のバックスラッシュとバッククォートは変えない。
- 単体テストで、エスケープされたバッククォートを含む result が検査を通る形になること、コードブロックの中は変わらないことを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分と行の文案を書く。利用者に影響がなければ「なし」と書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 5. 対応結果

### 5.0. 原因

reporter が構造化出力（JSON）の文字列でバッククォートを ``\` `` と二重にエスケープして返し、runner の `src/exec/results.ts` の `reporterFreeText` がそのまま result 本文へ書いていた。Markdown では ``\` `` は code span にならず、対になる位置で MD038 が出る。経路は reporter の自由記述（`summary`・`approach`・`grade_check` など `reporterFreeText` を通る欄）。executor の検証要約も同じ関数を通る。reporter ごとの発生回数は未集計。

### 5.0.1. 直し方と理由

runner が書き込む前に直す方を選んだ。agent への指示は LLM の出力を保証できず再発するため。`src/shared/text.ts` に `unescapeBackticksWhenUniform` を追加し、`reporterFreeText` から呼ぶ。文中のバッククォートがすべてバックスラッシュ付きのときだけ、エスケープを外して元のバッククォートへ戻す。エスケープなしのバッククォートが混ざる文は、code span 内の意図したバックスラッシュを壊さないため変えない。対象は 1 行化済みの自由記述で、コードブロックは対象外。

### 5.0.2. 確認

- `tests/src/shared/text.test.ts` に 3 件追加（一律エスケープの復元、混在時は不変、エスケープなしは不変）。
- 実行した検証: `npx vitest run`（text・results・reporter のテスト 232 件）と `npm run typecheck` が通過。親の検証は runner が実行する。

### 5.1. CHANGELOG に書く事項

- 区分: Fixed
- 文案: reporter が result の本文でバッククォートをバックスラッシュ付きで返しても、runner が戻してから書き込み、統合の前の Markdown の検査（MD038）で止まらないようにした。

## 6. 関連ドキュメント

- `src/exec/results.ts`、`src/shared/text.ts`
