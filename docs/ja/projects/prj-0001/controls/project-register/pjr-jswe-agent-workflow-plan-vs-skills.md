---
specdojo:
  id: prj-0001:pjr-jswe-agent-workflow-plan-vs-skills
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: low
  owner: ARC
  registered_at: "2026-09-16T23:05:54Z"
  due_on: null
---

# PJR-JSWE agent ワークフローを plan/result/git に置き skills 等の agent 固有機能へ依存しない方針の分析

## 1. メモ

### 1.1. 結論

plan / result / git 履歴を agent ワークフローの契約とし、skills・AGENTS.md・agent 定義などの agent 固有機能へ極力依存しない現在の方向性は正しい。ただし「plan に必要情報が書けていれば精度は落ちない」という前提は、plan の遅延ロード性と、繰り返し手順の CLI 化が保たれている場合にのみ成り立つ。

### 1.2. 中核を plan / result / git に置く理由

- 提供者中立: skills（Claude Code）、AGENTS.md（codex）、agent 定義（opencode）は意味も寿命も異なる。SpecDojo は codex・claude・gemma・qwen を同じ Kata で運用しており、契約が plan にあるから executor を差し替えられる。`data-flow-pdca` の refine-2 では、plan の指示だけで codex-expert が grade の finding を解消できた。
- 監査・再現: plan は「何を根拠に何をしたか」の契約、result / evidence / イベントは実績で、すべて git に残る。skill の中身は agent 側の設定であり、成果物と一緒に版管理・grade・レビューされない。Kata（知識）はプロダクトの内容、skill は agent の都合という線引きを維持する。
- 観測された失敗は skill 不足ではない: 直近の失敗は rate limit、小型モデルの JSON schema 逸脱、保護ファイルへの書き込み、lint の整形ずれであり、「手順を知らなかった」ことに起因するものはなかった。

### 1.3. 前提が崩れる条件

skill が本質的に持つ性質は「必要になったときだけ読み込む（遅延ロード）」である。plan へ全部書くのは先行ロードなので、次の 2 点で差が出る。

- コンテキスト予算: plan が長くなるほど注意が散り、小型モデル（gemma / qwen）では中盤の指示が抜ける。qwen の refine が 8 件中 4 件無変更だったのは、能力の問題と同時に、長い plan の中で優先順位が伝わらなかった面もある。現行の plan は約 12KB で、rulebook / template / sample は本文へ埋め込まずパス参照になっており、既に遅延ロードに近い形である。この性質を崩さない。
- 手続き的な作業: 整形・schema 検証・索引再生成などの繰り返し手順は、文章で説明するより実行可能な道具にしたほうが精度が安定する。ただし道具は skill である必要はなく、`specdojo` サブコマンドや npm script で足りる。提供者中立な skill の代替は CLI である。

### 1.4. 切り出す・切り出さない判断基準

| 内容                                                       | 置き場所                                 | 理由                                                                                     |
| ---------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| 何を・どこまで・完了条件（done_criteria 由来）             | plan                                     | 契約。タスク固有で監査対象                                                               |
| 記法・章構成・禁止事項（Kata）                             | rulebook / template（plan からパス参照） | grade・レビュー・版管理の対象。agent 設定へ埋めない                                      |
| 繰り返す検証・整形・生成手順                               | CLI / npm script（plan から呼び出す）    | 提供者中立で決定的。文章より安定                                                         |
| 権限・sandbox・失敗時の扱い                                | exec-defaults / provider 設定            | 知識ではなく実行時制約。提供者固有でよい                                                 |
| 「まず plan を読む、最後に validate を実行する」程度の入口 | 各 agent の薄いラッパー                  | SSOT から生成して drift を防ぐ（`.claude/rules` と `.github/instructions` の関係と同じ） |

skill へ切り出してよいのは最後の行だけで、それも SSOT の断片を各 agent 形式へ写す薄い入口に限る。rulebook の内容や手順そのものを skill へ移すと、提供者ごとに複製ができ、grade の外へ知識が漏れる。

### 1.5. 主張の検証方法

「plan で十分」は測定できる。同じタスクを (a) plan のみ、(b) plan + agent 固有 skill で実行し、grade のスコアと finding 数、実行時間、トークン量を比較する。grade パイプラインと exec の evidence が既にあるため、自前のハーネスで回せる。差が出た場合は「skill が必要」ではなく、「plan の該当情報が遅延ロードできていない」か「CLI 化すべき手順が文章のまま」のどちらかである可能性が高く、plan / CLI 側で吸収する。

## 2. 背景・文脈

- 2026-09-17 に、SpecDojo が skills などの agent 固有機能へ頼らず plan・result・git 履歴で agent ワークフローを構築している方向性の妥当性について、オーケストレーターとの対話で分析した内容を記録したもの。
- 判断材料は、`data-flow-pdca` の refine（qwen）と refine-2（codex-expert）の結果、PJR-VQB5 の agent 別 grade 比較、および直近 1 週間の exec 失敗の内訳。

## 3. フォローアップ

- plan の長さと参照方式（埋め込みかパス参照か）を定期的に確認し、遅延ロード性を保つ。
- plan 本文で文章として説明している繰り返し手順があれば、`specdojo` サブコマンドまたは npm script へ落とす候補として洗い出す。
- 必要になれば、上記 1.5 の比較実験を todo として起票する。

## 4. 関連ドキュメント

- [[specdojo:specdojo-philosophy]]
- [[prj-0001:pjr-vqb5-agent-grade-comparison]]
- [[prj-0001:pjr-6pd7-cdfd-overview]]
