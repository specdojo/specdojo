---
specdojo:
  id: prj-0001:pjr-wb78-lint-reporter-result
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-22T03:13:28Z"
  block_reason: "parent validation failed: typecheck"
  derived_from:
    - PJR-G3TT
---

# PJR-WB78 reporter が書いた result を、書き込む前に lint していない

## 1. 概要

reporter の出力で lint に落ちる語（中国語の字など）が result に入り、親の検証や統合の commit で止まる。runner が result を書く前に lint し、落ちたら reporter をやり直すか直す。

## 2. 入力

- 2026-11-22、QTZ7 の result に reporter（gemma）が中国語の簡体字（U+4E2A）を書き、lint-md で止まった。G3TT ではバッククォートのエスケープで止まった。
- 利用者の承認（2026-11-22、indie）で起票した。
- 2026-11-22、T-KATA-WAVE-3-utc-sample-090 の review result に reporter（gemma26-reporter）が、箇条書きの中の ### 見出し（文末の句点つき）と、1 行につながった ### と #### を書き、統合の前の lint で MD022・MD026 により止まった。review 自体は終わっていた。オーケストレーターが result の該当行を地の文に直し、exec resume --task で統合した。
- 2026-11-22、PJR-09HA の result に reporter が素の URL を書き、MD034 で止まった。T-KATA-WAVE-3-itc-index-sample-090 の review result では、見出しとコードブロックが 1 行につぶれ、MD038 で止まった。どちらもオーケストレーターが result を直して統合だけを流し直した。

## 3. 完了条件

- runner は、reporter が書いた result を書き込む前に、統合の前の検査と同じ markdownlint の規則（`Result Markdown notation violation before commit` を出す検査と同じもの）で検査する。
- 違反があれば、違反の行と規則を示して reporter に書き直させる。書き直しは、今の書式の再試行（format attempts）と同じ枠と上限で行い、別の上限を足さない。
- 上限まで直らなければ、今と同じく waiting にし、違反の行と規則を理由に示す。
- 入力にある事例（箇条書きの中の見出しと句点で終わる見出し、素の URL、見出しとコードブロックが 1 行につぶれたもの、エスケープされたバッククォート、中国語の簡体字）を fixture にして、検出と書き直しの指示を単体テストで確かめる。簡体字のように markdownlint の規則で検出できないものは、検出できるかを executor が確かめ、扱いと理由を個票の対応結果に書く。
- `exec-operation-guide` の reporter の段の説明に、書き込む前の検査を書く。
- `exec-defaults.yaml`・`package.json` などの保護された設定の変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分「不具合修正」と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- runner のコードを変えるため、統合の後にオーケストレーターが PJR-JSEY で runner の動作を確かめる。

## 4. 作業内容

| No  | 作業                                            | 担当                  | 状態 | メモ                                                                        |
| --- | ----------------------------------------------- | --------------------- | ---- | --------------------------------------------------------------------------- |
| 1   | result を書き込む前に検査する                   | DEV                   | done | `src/exec/result-markdownlint.ts`。統合の前の検査と同じ設定で描画内容を検査 |
| 2   | 違反を示して reporter に書き直させる            | DEV                   | done | `runReporterWithFormatRetry` の `validateOutput`。format attempts と同じ枠  |
| 3   | 事例の fixture のテストと文書、CHANGELOG の文案 | DEV                   | done | 簡体字は MD061 を加えて検出。理由は対応結果に記載                           |
| 4   | 統合の後に JSEY で確かめる                      | specdojo-orchestrator | open | 統合の後にオーケストレーターが PJR-JSEY で行うため executor は実行しない    |

## 5. 対応結果

### 5.0. 実施内容

- `src/exec/results.ts` の `renderReporterResult` から、書き込まずに result の Markdown を返す `renderReporterResultContent` を分けた。書き込みと整形の経路は変えていない。
- `src/exec/result-markdownlint.ts` を追加した。reporter の出力を描画した内容を、`assertResultMarkdownlint`（`Result Markdown notation violation before commit` を出す検査）と同じ設定（リポジトリの markdownlint の設定、なければ `DEFAULT_MARKDOWNLINT_CONFIG`）で、同じ行末の空白の正規化をしてから markdownlint の API で検査する。違反は行番号・規則・描画した行の内容で示す。markdownlint が見つからない環境では、統合の前の検査と同じく検査を省く。
- `src/exec/reporter.ts` の `runReporterWithFormatRetry` に `validateOutput` を足した。スキーマを通った出力に違反があれば、その内容を既存の再試行の指示（`The previous response failed validation: ...`）として reporter に渡し、同じ `formatAttempts` の枠で書き直させる。上限に達した場合は既存と同じ `reporter output invalid after 3 format attempts: ...` の失敗になり、理由に違反の行と規則が入る。register 実行では、既存の reporter 失敗と同じく waiting になる。
- 呼び出し元の `src/exec/run/agent-pipeline.ts`（register・job・resume・post-review の pipeline が共用）、`src/exec/run/schedule-task.ts`、`src/exec/run/in-place.ts` で検査を渡した。result を書かない `exec trial` の reporter には足していない。reporter を使わない機械的な result（`pipeline.mechanical_result`）も対象外とした。
- `src/exec/plan-markdownlint.ts` の `markdownlintApi`・`planLintConfig` を export して共用した。
- `tests/src/exec/result-markdownlint.test.ts` に、入力の事例の fixture（箇条書きの中の見出しと句点で終わる見出し（MD022・MD026）、素の URL（MD034）、見出しとコードブロックが 1 行につぶれたもの（MD038）、エスケープされたバッククォートとコードの書式の混在（MD038）、中国語の簡体字（MD061））の検出と、違反を示した書き直しの指示・上限での失敗を確かめる単体テストを足した。
- `exec-operation-guide` の reporter の段の説明と、stage 別の失敗の表に、書き込む前の検査を書いた。

### 5.0.1. 中国語の簡体字の扱い

統合の前の検査（`assertResultMarkdownlint`）は markdownlint-cli を規則の追加なしで動かすため、簡体字を検出しない。QTZ7 を止めたのは、親の検証の `lint:md` が加える `packages/docs-lint/src/markdownlint-rule-no-chinese-glyphs.cjs`（MD061）である。書き込む前の検査では、この規則のファイルがリポジトリにあり markdown-it を読み込めるときだけ MD061 を加える（`lint:md` と同じ規則）。U+4E2A を含む fixture で検出できることを単体テストで確かめた。規則は `@specdojo/docs-lint` の `exports` で公開されておらず、配布先のプロジェクトでは読み込めないため、その場合は統合の前の検査と同じ規則だけで検査する。

エスケープされたバッククォートは、PJR-G3TT の `unescapeBackticksWhenUniform` が一律にエスケープされた文を戻すため、それだけでは違反にならない。コードの書式と混在して戻されない形が MD038 になるため、その形を fixture にした。

### 5.0.2. 保護された設定

`exec-defaults.yaml`・`package.json` の変更は要らない。

### 5.0.3. 確認

- `npx vitest run --config vitest.unit.config.ts tests/src/exec`（93 ファイル・1677 件）が通過。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` などは親の検証が実行する。
- 統合の後の runner の動作確認は、オーケストレーターが PJR-JSEY で行う（作業内容の No 4）。

### 5.1. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: runner が reporter の書いた result を書き込む前に、統合の前の検査と同じ markdownlint の規則で検査し、違反があれば行と規則を示して reporter に書き直させるようにした。書き直しは出力形式の再試行と同じ回数までで、直らなければ違反を理由に止める。見出し・素の URL・コードの書式の崩れや中国語の字体で、統合の前に止まることを防ぐ。

## 6. 関連ドキュメント

- [[specdojo:exec-operation-guide|exec 運用ガイド]]
- [[prj-0001:pjr-g3tt-escaped-backticks-in-result]]
- `src/exec/result-markdownlint.ts`、`src/exec/reporter.ts`、`src/exec/results.ts`
