---
specdojo:
  id: prj-0001:pjr-ankr-grade-executor-reporter
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-30T11:06:46Z"
  due_on: "2026-09-30"
  completed_at: "2026-08-30T11:56:35Z"
  conclusion: grade plan が1文書ごとに executor plan と reporter plan を生成するようにした。executor plan から JSON 契約を除き、各 viewpoint の LEVEL と FINDING を軽量 marker で申告させる。reporter plan は対象文書を再評価せず、executor の申告を追加・省略・変更せず JSON へ写す責務に限定した。grade apply --analysis-from により reporter の忠実性を機械照合し、level の変更や finding の追加・省略を適用前に拒否する。qwen を executor、gemma を reporter として検証し、所要時間が 1 段構成の 18 分から 27 分に対し 6.5 分へ短縮され、構文破損も解消することを確認した。--analysis-from を省略する 1 段構成も維持している。
---

# PJR-ANKR grade を executor と reporter の2段構成へ分ける

## 1. 概要

grade は1つの agent へ分析と JSON 構造化の両方を求めているため、どちらかが犠牲になる。

実測では、qwen が関連文書を読み込んで実在の不整合を発見する分析能力を示す一方、閉じ括弧の過剰により JSON が破損した。muse は前置きのない素の JSON を返す一方、8 観点中 7 つを level 3 とする横並びの判定となり、`major` と `blocker` を一度も出さなかった。分析能力と構造化能力は独立した軸である。

exec の pipeline と同じく executor と reporter を分ける。executor には JSON 契約を課さず、各観点の level と finding を自由形式で述べさせる。reporter は判定内容を変更せず GradeSubmission JSON へ構造化する。

## 2. 完了条件

- grade が executor と reporter の2段で動作する。
- executor 向けの plan に JSON 出力の契約がなく、各観点の level と finding を述べる指示がある。
- reporter が executor の判定を変更せずに構造化する。level と severity が executor の申告と一致する。
- reporter の出力が `grade apply` の検証を通過する。
- executor が JSON を出力できなくても評価が成立する。
- 既存の1段構成との互換性、または移行方法が定められている。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                      | 担当 | 状態 | メモ                                       |
| --- | ------------------------- | ---- | ---- | ------------------------------------------ |
| 1   | 2段構成の設計             | ARC  | done | 文書ごとに executor / reporter plan を生成 |
| 2   | reporter への制約の設計   | ARC  | done | 判定を変更させない指示と機械検証           |
| 3   | executor 向け plan の変更 | ARC  | done | JSON 契約を除き marker 付き自由記述へ変更  |
| 4   | reporter 段の実装         | ARC  | done | executor 応答から GradeSubmission を構成   |
| 5   | 検証                      | ARC  | done | JSON でない分析と改変拒否を自動検証        |
| 6   | 規範文書の更新            | ARC  | done | command-reference、guide、Job 定義を更新   |

### 3.1. 分離が有効な根拠

同一の plan で6つの agent を比較した結果である。

| agent | 分析能力                   | JSON 出力      |
| ----- | -------------------------- | -------------- |
| qwen  | 高い。実在の不整合を発見   | 構文破損あり   |
| muse  | 低い。判定が横並び         | 素の JSON      |
| gemma | 弁別が最良。blocker を出す | コードフェンス |
| codex | 網羅的                     | 素の JSON      |

現状は1つの agent へ両方を求めるため、qwen の分析能力を活かせていない。分離すれば executor に qwen、reporter に gemma を割り当てられる。

初回の比較で qwen は JSON を出力せず散文で終えたが、その内容は claude に匹敵する質だった。Frontmatter が指す rulebook と本文の参照が食い違うという実在の不整合を、関連する rulebook と authoring standard を読んだうえで指摘している。2段構成であればこの分析を構造化して利用できる。

### 3.2. reporter の要件

reporter の役割は構造化に限る。判定を変更させない。

- level と severity は executor の申告をそのまま用いる。
- executor が述べていない finding を追加しない。
- executor が述べた finding を省略しない。
- 構造化できない場合はエラーとし、推測で埋めない。

gemma は reporter として十分な出力形式の安定性を持つ。コードフェンスを伴うが、既存の抽出処理で除去できる。

### 3.3. 想定される課題

| 課題       | 内容                                               |
| ---------- | -------------------------------------------------- |
| 実行時間   | 2段になるため1件あたりの所要時間が増える           |
| 情報の欠落 | executor の自由記述から level を正確に抽出できるか |
| 判定の改変 | reporter が level や severity を変える恐れがある   |

判定の改変は grade の信頼性に直結する。reporter の出力と executor の申告を突き合わせる検証を設けるか、reporter への指示だけで足りるかを判断する必要がある。指示の遵守能力はモデルにより異なることが実測で判明しているため、機械的な検証を置くほうが確実である。

### 3.4. 未決の論点

- plan を executor 用と reporter 用に分けるか、1つの plan を両者が異なる観点で読むか。
- executor の出力形式をどこまで規定するか。完全に自由にすると reporter の抽出が難しくなり、規定しすぎると現状と変わらない。
- 既存の1段構成を残すか。codex のように単独で完結できる agent には2段構成が冗長になる。
- agent の選定基準が変わる。分析用と構造化用を別々に評価することになるため、PJR-VQB5 の推奨も見直しが要る。

## 4. 対応結果

- `grade plan` が1文書ごとに executor plan と reporter plan を生成するようにした。executor plan から GradeSubmission JSON 契約を除き、各 viewpoint の `LEVEL` と `FINDING` だけを軽量 marker で申告し、根拠と検討過程は自由記述できるようにした。
- reporter plan は対象文書を再評価せず、executor 応答の level、severity、line、message を追加・省略・変更せず GradeSubmission JSON へ写す責務に限定した。
- `grade apply --analysis-from <executor-output>` を追加し、reporter の提出内容を executor の申告と機械照合するようにした。level の変更、finding の追加・省略、severity・line・message の変更は適用前に拒否する。
- JSON でない前置きと根拠を含む executor 応答を解析できること、忠実な reporter 出力を受理すること、level と severity を変更した reporter 出力を拒否することをテストへ追加した。
- 移行用に `--analysis-from` を省略する既存の1段構成を維持した。新規の2段構成では executor の nickname を `--by` に指定し、reporter ではなく判定主体を `graded_by` へ記録する。
- CLI リファレンス、routine 運用ガイド、`job-grade-kata` を2段の受け渡し手順へ更新した。

### 4.1. 検証結果

`qwen-expert-executor` を executor、`gemma-reporter` を reporter として `dec-rulebook.md` を評価した。

| 段階     | agent | 所要時間 | 結果                           |
| -------- | ----- | -------- | ------------------------------ |
| executor | qwen  | 5 分     | 8 観点すべて申告。構文破損なし |
| reporter | gemma | 1.5 分   | GradeSubmission JSON を生成    |
| 照合     | CLI   | 即時     | 忠実性の検証を通過             |

`grade apply --analysis-from` による照合を通過しており、reporter は executor の判定を改変していない。

1段構成では qwen の所要時間が 18 分から 27 分であり、閉じ括弧の過剰による構文破損も発生していた。2段構成では executor が JSON 構造を生成しないため、所要時間が 5 分へ短縮され破損も起きない。全体でも 6.5 分で完了しており、1段構成より速い。

executor の申告は marker 形式で軽量だが、内容は従来と同等である。判断軸が未定義で pass/fail を判定できないという指摘に、用語定義節での定義または例示という修正案を添えている。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 分析能力と構造化能力が独立していることを示す実測記録。
- [[prj-0001:pjr-akj4-agent-json-response]]: 応答からの JSON 抽出。reporter の出力にも適用される。
- [[prj-0001:pjr-4tz7-grade-per-document]]: plan の生成と保存。plan の分割はこの構造に影響する。
- [[specdojo:exec-operation-guide]]: exec の executor と reporter の pipeline。同じ設計を流用する。
