---
specdojo:
  id: prj-0001:xer-t-glossary-gl-setup-080-20261111t202654z-e0ab3108
  type: exec-result
  task_id: T-GLOSSARY-gl-setup-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-GLOSSARY-gl-setup-080/T-GLOSSARY-gl-setup-080-20261111T202654Z-e0ab3108/plan.md
  started_at: "2026-11-11T20:26:55.196Z"
  completed_at: "2026-11-11T20:37:41.727Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - gl-setup
  condense_records:
    - location: gl-setup.yaml:63、tm-member の notes 第1文
      category: repetition
      action: delete
      reason: メンバーを実行主体、ロールを責務・判断権限・専門性とする各 definition に同じ区別があるため削除。名簿の分離・合成と人間の判断・最終承認責任は維持した。
      cause:
        type: document
    - location: gl-setup.yaml:238、tm-rate-limit-detection の notes「実行基盤別に上書きでき」
      category: repetition
      action: delete
      reason: tm-provider-override の notes が障害検出の上書きを説明しているため削除。同用語への関連付け、設定項目との対応、失敗への対応方針、schema 参照は維持した。
      cause:
        type: document
    - location: gl-setup.yaml:255、tm-rate-limit-policy の notes「実行基盤別に上書きできる」
      category: repetition
      action: delete
      reason: tm-provider-override の notes が利用枠制限時の方針の上書きを説明しているため削除。設定項目との対応、自動選択・指名実行・CLI 指定の区別、適用条件の参照は維持した。
      cause:
        type: document
    - location: gl-setup.yaml:79、tm-agent-member の notes
      category: canonical-restatement
      action: retain
      reason: '`mode`・`stage_role`・業務ロールの区別と、pipeline・単一 agent フローで使う条件は実行者選択の判断に必要。条件の詳細を列挙せず既存の参照を維持した。'
      cause:
        type: document
    - location: gl-setup.yaml:196、tm-provider-override の notes
      category: canonical-restatement
      action: retain
      reason: 指定項目全体の置換、省略時の共通値利用、起動テンプレートと変数には共通値がないという例外は上書きの意味を判断するために必要。組合せ条件は引き続き schema を正本とした。
      cause:
        type: document
    - location: gl-setup.yaml:255、tm-rate-limit-policy の notes 第2文以降
      category: canonical-restatement
      action: retain
      reason: クリティカルパス内外の動作差、指名実行の `pinned`、CLI の明示指定は適用場面を区別するために必要。実行方法ごとの詳細条件は schema と設定ガイドの参照を維持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 用語集（導入と設定）`docs/ja/product/010-business-specs/060-glossary/gl-setup.yaml` の冗長さを整理しました。
- `tm-member`、`tm-rate-limit-detection`、`tm-rate-limit-policy` の各 `notes` において、他の用語定義と重複していた説明を3か所削除しました。
- 一方で、判断基準となる制約、例外、および `schema` への参照などの必須情報は維持し、意味的な欠落がないことを確認しています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-setup.yaml`: 重複していた説明（メンバーとロールの区別、および実行基盤別の上書き設定に関する記述）を削除し、冗長さを整理しました。

## 3. 申し送り

- 適用外の検証: `npx markdownlint docs/ja/product/010-business-specs/060-glossary/gl-setup.yaml`（executor の変更は YAML のみで、Markdown ファイルの変更がない。）
- 適用外の検証: `npm run validate:history-links`（executor は履歴ファイル、plan、result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更対象は docs/ja/product/ 配下であり、docs/ja/projects/ 配下の成果物変更がない。）

## 4. 進め方と実践の型の適用

対象文書内の繰り返し記述（`repetition`）を洗い出し、意味を維持したまま不要な重複箇所を削除する `condense` アプローチを採用しました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `gl-setup.yaml:63、tm-member の notes 第1文` | `repetition` | `delete` | `メンバーを実行主体、ロールを責務・判断権限・専門性とする各 definition に同じ区別があるため削除。名簿の分離・合成と人間の判断・最終承認責任は維持した。` | `document` |
| `gl-setup.yaml:238、tm-rate-limit-detection の notes「実行基盤別に上書きでき」` | `repetition` | `delete` | `tm-provider-override の notes が障害検出の上書きを説明しているため削除。同用語への関連付け、設定項目との対応、失敗への対応方針、schema 参照は維持した。` | `document` |
| `gl-setup.yaml:255、tm-rate-limit-policy の notes「実行基盤別に上書きできる」` | `repetition` | `delete` | `tm-provider-override の notes が利用枠制限時の方針の上書きを説明しているため削除。設定項目との対応、自動選択・指名実行・CLI 指定の区別、適用条件の参照は維持した。` | `document` |
| `gl-setup.yaml:79、tm-agent-member の notes` | `canonical-restatement` | `retain` | `` `mode`・`stage_role`・業務ロールの区別と、pipeline・単一 agent フローで使う条件は実行者選択の判断に必要。条件の詳細を列挙せず既存の参照を維持した。 `` | `document` |
| `gl-setup.yaml:196、tm-provider-override の notes` | `canonical-restatement` | `retain` | `指定項目全体の置換、省略時の共通値利用、起動テンプレートと変数には共通値がないという例外は上書きの意味を判断するために必要。組合せ条件は引き続き schema を正本とした。` | `document` |
| `gl-setup.yaml:255、tm-rate-limit-policy の notes 第2文以降` | `canonical-restatement` | `retain` | ``クリティカルパス内外の動作差、指名実行の `pinned`、CLI の明示指定は適用場面を区別するために必要。実行方法ごとの詳細条件は schema と設定ガイドの参照を維持した。`` | `document` |
