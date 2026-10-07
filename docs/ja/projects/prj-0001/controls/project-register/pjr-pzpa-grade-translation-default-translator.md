---
specdojo:
  id: prj-0001:pjr-pzpa-grade-translation-default-translator
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-06T22:14:59Z"
  due_on: null
  completed_at: "2026-10-07T10:31:34Z"
  conclusion: grade の既定の翻訳の agent を gemma26-translator に切り替えた。実モデルで 13 件中 12 件が翻訳され、gemma26-reporter（7 件）より改善した
---

# PJR-PZPA grade の既定の翻訳の agent を gemma26-translator へ切り替える

## 1. 概要

[[prj-0001:pjr-wafc-grade-translation-no-added-code]] の実モデルでの確認で、`gemma26-reporter` は翻訳の指示で禁じても英語の語句をバッククォートで囲み、訳さずに残した。原因は reporter 向けの「識別子はインラインコードで囲む」指示とみられる。翻訳だけを担う `gemma26-translator`（`.opencode/agents/gemma26-translator.md`、名簿にも追加済み）を orchestrator が追加した。

grade の翻訳の既定の agent を `gemma26-translator` に切り替える。agent の定義と名簿は agent の書き込み禁止対象のため、この todo では変更しない。

## 2. 完了条件

- `tools/grade/run-per-document.sh` の `--translation-by` の既定値を `gemma26-translator` にする。help の表示も合わせる。
- 翻訳の agent の既定値として `gemma26-reporter` を記載している文書（コマンドリファレンス、routine 運用ガイド、文書メタデータ標準など）を `gemma26-translator` に合わせる。`gemma26-reporter` を reporter として説明している記述は変えない。
- `tests/tools/grade-per-document.test.ts` の既定の翻訳の agent に関する期待値を合わせる。
- `.opencode/agents/` と `pm-members.yaml` は変更しない。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                      | 担当         | 状態 | メモ                                        |
| --- | ----------------------------------------- | ------------ | ---- | ------------------------------------------- |
| 1   | script の既定値・文書・テストを切り替える | DEV          | done | agent の定義と名簿は変更しない              |
| 2   | Ollama の起動後、実モデルで翻訳を確かめる | orchestrator | done | 13件中12件を採用（1回目7件、訳し直しで5件） |

## 4. 対応結果

- `tools/grade/run-per-document.sh` の `--translation-by` の既定値と help を `gemma26-translator` へ切り替え、pipeline fixture の期待値を同期した。
- コマンドリファレンス、routine 運用ガイド、文書メタデータ標準に記載する既定の翻訳 agent を `gemma26-translator` へ更新した。
- `.opencode/agents/` と `pm-members.yaml` は変更していない。
- 残作業は、Ollama の起動後に orchestrator が `pm-risk-register-rulebook.md` の表示翻訳を実モデルで確認する No. 2 のみである。判定はやり直さない。
- 実モデルでの確認（orchestrator、2026-10-07）: `pm-risk-register-rulebook.md` の英語の finding 13 件を `gemma26-translator` で翻訳し直した。1回目の翻訳で7件が点検に通り（46 秒）、不合格の6件を1件ずつ訳し直して5件が通った（121 秒）。最終的に12件が翻訳され、1件は英語の正本を表示に使った。`gemma26-reporter` での確認（1回目2件、最終7件）より大きく改善し、訳文も英語の語句をバッククォートで残さない日本語になった。一部の訳文では、`readiness criteria` のような英語の語句がバッククォートなしで残っている。

## 5. 関連ドキュメント

- [[prj-0001:pjr-wafc-grade-translation-no-added-code]]（翻訳の点検とバッククォートの問題）
- [[prj-0001:pjr-27y0-grade-english-canonical-translation]]（英語正本と翻訳の仕組み）
