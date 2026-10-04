---
specdojo:
  id: prj-0001:pjr-e9h3-grade-deterministic-reporter
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T00:28:36Z"
  due_on: null
---

# PJR-E9H3 grade の reporter を LLM から executor の marker の機械変換に置き換える

## 1. 概要

grade の reporter は executor の [VIEWPOINT] / [DONE_CRITERIA] marker を GradeSubmission JSON へ一字一句写すだけだが、LLM が担うため書き写しの誤り（例: 三箇所→三箇会）、JSON の構文破損、根拠のない JSON の生成が起き、時間もかかる。grade apply は既に executor の分析を parse して忠実性を検証しているため、同じ parse から GradeSubmission を機械的に生成すれば、reporter 起因の失敗をなくし、executor の選択肢も広げられる

## 2. 完了条件

- executor の出力（`[VIEWPOINT]` / `[END VIEWPOINT]` / `LEVEL` / `FINDING`、成果物の場合は `[DONE_CRITERIA]`）から GradeSubmission を生成する処理を CLI に持ち、`grade apply` の忠実性検証と同じ parse 結果を使う。LLM の reporter を通さずに kata と成果物の grade を記録できる。
- marker の欠落・重複・level と severity の矛盾など、executor の出力が契約を満たさない場合は、現在の忠実性検証と同じ条件で拒否し、理由を記録する。拒否時の再試行は executor の再実行とする。
- 形式の軽微な揺れ（marker の太字囲み、`FINDING` が行頭にない等）を正規化して受理するかを判断し、採否と理由を記録する。受理する場合も、message の内容は変更しない。
- `tools/grade/run-per-document.sh`、job 定義、`exec-defaults.yaml` など reporter を前提にした経路を、機械変換を既定とする形へ更新する。LLM の reporter を残す場合は、その用途を明記する。
- grade の plan（reporter plan を含む）、運用ガイド、コマンドリファレンスを更新する。
- unit test で、正常な出力、marker 欠落、level と severity の矛盾、done_criteria を含む成果物の各ケースを検証する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                          |
| --- | ------------------------------------------------------ | ---- | ---- | --------------------------------------------- |
| 1   | 機械変換の設計（parse の共有、拒否条件、正規化の範囲） | DEV  | open | `parseGradeExecutorAnalysis` を起点に検討する |
| 2   | CLI と grade pipeline への実装                         | DEV  | open | reporter を前提にした経路を置き換える         |
| 3   | 文書とテストの更新                                     | DEV  | open | -                                             |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 2026-10-03〜04 の比較で、reporter の書き写しの誤り・JSON 構文破損・根拠のない JSON の生成を観測した。
- [[prj-0001:pjr-ankr-grade-executor-reporter]]: executor と reporter を分けた経緯。
- [[prj-0001:pjr-akj4-agent-json-response]]: agent の JSON 応答の抽出。
