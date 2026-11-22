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

| No  | 作業                                            | 担当                  | 状態 | メモ                     |
| --- | ----------------------------------------------- | --------------------- | ---- | ------------------------ |
| 1   | result を書き込む前に検査する                   | DEV                   | open | 統合の前の検査と同じ規則 |
| 2   | 違反を示して reporter に書き直させる            | DEV                   | open | format attempts と同じ枠 |
| 3   | 事例の fixture のテストと文書、CHANGELOG の文案 | DEV                   | open | 簡体字の扱いは理由を残す |
| 4   | 統合の後に JSEY で確かめる                      | specdojo-orchestrator | open | -                        |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
