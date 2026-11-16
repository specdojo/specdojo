---
specdojo:
  id: prj-0001:xer-t-glossary-gl-setup-010-20261111t174145z-a57241d5
  type: exec-result
  task_id: T-GLOSSARY-gl-setup-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-GLOSSARY-gl-setup-010/T-GLOSSARY-gl-setup-010-20261111T174145Z-a57241d5/plan.md
  started_at: "2026-11-11T17:41:46.621Z"
  completed_at: "2026-11-11T17:57:17.518Z"
  agent: sol-executor
  execution: agent
  approach: retrofit
  targets:
    - gl-setup
---

# Edit Result

## 1. 実施内容

- 「導入と設定」の用語集として `docs/ja/product/010-business-specs/060-glossary/gl-setup.yaml` を新設し、30個の用語の定義・別名・分類および関係性を整理しました。
- 実装エビデンスである 5 つの schema ファイルを調査し、稼働構成、agent および人の名簿、ロール、実行既定（provider 等）の現在の動作を確認して反映しました。
- 名簿の分離（人/agent）や、別名と実体・モデルの関係など、既存の PJR などの決定事項との一致を確認済みです。
- 一方で、実行既定 schema の説明文における旧参照の残留や、回復方針に関するガイドと実装の乖離など、一部に未反映の乖離があることを確認し、これらを後続の検討課題として記録しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-setup.yaml`: 用語集（導入と設定）を新設し、実装エビデンスに基づいた 30 用語の定義・分類・関係を記述しました。

## 3. 申し送り

- 判断は新設。対象ファイルが存在せず、カタログに配置先と完了条件が定義されていたため。変更ファイルは `docs/ja/product/010-business-specs/060-glossary/gl-setup.yaml` のみ。共通・計画・実行領域の既存概念は再登録せず参照し、人間の最終判断責任を保持した。
- 参照済み実装エビデンス: `docs/specdojo/schemas/v1/specdojo-config.schema.yaml`。リポジトリ共通設定とプロジェクト設定、人・agent 名簿への参照、プロダクトリポジトリと外部プロジェクト参照の区別を確認し反映した。
- 参照済み実装エビデンス: `docs/specdojo/schemas/v1/agent-members.schema.yaml`。agent の識別名、別名、実行基盤、モデル、推論強度、能力、習熟度、優先度、無効化と段の役割を確認した。`docs/specdojo/schemas/v1/pm-members.schema.yaml` は人間専用の名簿、`docs/specdojo/schemas/v1/pm-roles.schema.yaml` は採用ロールのコード・名称を定義することを確認した。
- 参照済み実装エビデンス: `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`。共通実行設定、基盤別の項目単位の上書き、起動コマンドと変数、難易度別振り分け、障害検出・回復・再試行・同時実行上限を確認した。条件は用語の関係として短く示し、詳細は schema へ委ねた。
- 一致: 名簿の分離は PJR-2T63、別名と実体・モデルの関係は PJR-YK1C と照合できた。初期導入でカタログを必須としない意図は PJR-G5AB とガイドに基づき反映した。初期導入 CLI の現在動作は指定 schema だけでは確認不能であり、実動作確認済みとは扱わない。
- 未反映の乖離・文書修正候補: 実行既定 schema の説明に分離前の `pm-members[].provider` 参照が残る。人と組織の定義標準にも人の名簿へ agent を置く例と、`roles` を任意とする表記があり、人間専用・`roles` 必須の schema と一致しない。用語集は承認済みの名簿分離を保持し、根拠文書・schema は編集していない。
- 未反映の乖離・後続調査候補: 実行既定 schema は critical と non-critical で回復方針を分ける一方、exec 設定ガイドは再試行を両方へ適用すると説明する。また `try_next` 時の `retry` 必須は説明文だけで条件付き制約になっていない。用語集では適用対象を断定せず、後続で承認意図と実装を照合し、文書・schema・実装の修正先を判断する。
- 未確認範囲: 指定5パスはすべて読めた。CLI の実行、名簿合成・別名解決・起動変数展開・回復処理のコード、参照先共通 schema の列挙値、外部基盤への接続は調査対象外。reporter は本報告の判断・調査結果・乖離・未確認範囲を指定 result に記録する。親 runner の検証は委任済み。
- 適用外の検証: `npm run validate:catalog`（executor の変更は product 配下の用語集のみで、docs/ja/projects/ 配下を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票や既存の plan・result を変更していない。）

## 4. 進め方と実践の型の適用

retrofit
