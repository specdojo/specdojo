---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cnd-specdojo-080-20261114t124202z-f0015345
  type: exec-result
  task_id: T-KATA-WAVE-1-cnd-specdojo-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-cnd-specdojo-080/T-KATA-WAVE-1-cnd-specdojo-080-20261114T124202Z-f0015345/plan.md
  started_at: "2026-11-14T12:42:04.701Z"
  completed_at: "2026-11-14T17:25:50.459Z"
  agent: luna-executor
  execution: agent
  approach: condense
  targets:
    - cnd-specdojo
  condense_records:
    - location: 「C4コンテナ図（Mermaid）」図直後の注記（「矢印は主たる利用・依頼・参照の向きで、応答を含む。」）
      category: figure-prose
      action: retain
      reason: cnd-rulebook.md は、矢印が依頼の方向か情報移動の方向かを注記し、応答を省略する場合も意味が通るようにすることを求めている。この注記は図から読み取れない読み方の規約である。閲覧者を代表として描いていることと、リモート接続経路が仮定であることも判断に必要なため残した。前回の試行での削除は元に戻した。
      cause:
        type: document
    - location: 「Container（コンテナ）」表の後の段落（「サイトの構築・配備を CLI が直接起動するか…」）
      category: table-prose
      action: retain
      reason: 表にない未確定事項（構築・配備を担う主体）と、対象外の範囲（閲覧先から CLI を操作する経路）を示しており、インフラ設計の判断に必要なため残した。
      cause:
        type: document
    - location: 「Data Store（データストア）」表の後の段落（「サイトの静的生成物は正本の派生物で…」）
      category: repetition
      action: retain
      reason: 概要の「正本と生成物を区別する」と重なって見えるが、「閲覧先の編集を正本へ反映する経路は定義しない」という制約を含むため残した。
      cause:
        type: document
    - location: 「コンテナ間・外部依存の検証対象」冒頭の一文（「以下は検証設計への入力であり…」）
      category: unneeded-background
      action: retain
      reason: 検証対象が実施済みのテストや合格の保証ではないという前提を示す。QE が結合テストの対象を判断するときに必要なため残した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書 `docs/ja/product/030-architecture/010-c4/cnd-specdojo.md` の冗長さの確認を行いました。
- 候補として挙げられた図直後の注記、表後の段落、検証対象の前提文などは、いずれも `cnd-rulebook.md` の要求事項や設計上の制約・判断基準を含むため、すべて保持 (`retain`) と判断しました。
- 前回の試行で削除されていた図直後の矢印に関する注記を元に戻した結果、最終的に対象文書への変更は発生しませんでした。

## 2. 変更ファイル

- なし

## 3. 申し送り

- 対象 `cnd-specdojo` は未変更: 冗長さの候補をすべて確認したが、どれも判断に要る注記・制約・前提だった。図直後の矢印の注記は cnd-rulebook.md が求める内容のため、前回の試行での削除を元に戻した。削っても判断情報を失わない箇所がないため変更しない。
- 適用外の検証: `npx prettier --check docs/ja/product/030-architecture/010-c4/cnd-specdojo.md`（今回の作業で最終的に変更した md・ts・js・json・yaml ファイルがないため。）

## 4. 進め方と実践の型の適用

対象文書内の繰り返し、二重説明、図のなぞり文、不要な背景などの候補を洗い出し、`vp-arc-conciseness` および `cnd-rulebook.md` に基づいて精査しました。判断に必要な情報を維持するため、すべての候補を保持し、変更なしとして完了しました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `「C4コンテナ図（Mermaid）」図直後の注記（「矢印は主たる利用・依頼・参照の向きで、応答を含む。」）` | `figure-prose` | `retain` | `cnd-rulebook.md は、矢印が依頼の方向か情報移動の方向かを注記し、応答を省略する場合も意味が通るようにすることを求めている。この注記は図から読み取れない読み方の規約である。閲覧者を代表として描いていることと、リモート接続経路が仮定であることも判断に必要なため残した。前回の試行での削除は元に戻した。` | `document` |
| `「Container（コンテナ）」表の後の段落（「サイトの構築・配備を CLI が直接起動するか…」）` | `table-prose` | `retain` | `表にない未確定事項（構築・配備を担う主体）と、対象外の範囲（閲覧先から CLI を操作する経路）を示しており、インフラ設計の判断に必要なため残した。` | `document` |
| `「Data Store（データストア）」表の後の段落（「サイトの静的生成物は正本の派生物で…」）` | `repetition` | `retain` | `概要の「正本と生成物を区別する」と重なって見えるが、「閲覧先の編集を正本へ反映する経路は定義しない」という制約を含むため残した。` | `document` |
| `「コンテナ間・外部依存の検証対象」冒頭の一文（「以下は検証設計への入力であり…」）` | `unneeded-background` | `retain` | `検証対象が実施済みのテストや合格の保証ではないという前提を示す。QE が結合テストの対象を判断するときに必要なため残した。` | `document` |
