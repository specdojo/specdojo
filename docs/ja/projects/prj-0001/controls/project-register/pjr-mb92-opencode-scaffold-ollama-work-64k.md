---
specdojo:
  id: prj-0001:pjr-mb92-opencode-scaffold-ollama-work-64k
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-25T08:41:08Z"
  due_on: "2026-10-31"
  derived_from:
    - PJR-2ASZ
---

# PJR-MB92 OpenCode scaffold に Ollama 接続設定と work-64k モデル設定を補う

## 1. 課題内容

scaffold が ollama-local の接続設定を生成せず、provider が見つからない。接続・モデル設定を補い、gemma・qwen は原則 `*-work-64k` を使う。派生タグ作成と既存環境の修正手順を整える。

## 2. 影響範囲

| 観点         | 影響                                                        |
| ------------ | ----------------------------------------------------------- |
| スコープ     | OpenCode の配布設定・scaffold・名簿の雛形・検証・利用ガイド |
| スケジュール | 2026-10-31 期限                                             |
| コスト       | _TODO_                                                      |
| 品質         | `ollama-local` の設定不足を解消し、モデル指定を整合させる   |
| 関係者       | DEV                                                         |

## 3. 対応方針

| 項目     | 内容                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------- |
| 原因     | 名簿と agent は `ollama-local` を参照するが、配布テンプレートは接続設定の `opencode.json` を含めていない |
| 対応策   | 接続・モデル設定を scaffold で用意し、gemma・qwen は原則 `*-work-64k` を使用する                         |
| 依存事項 | Ollama の接続先と派生モデルの準備が必要。環境固有の値は推測で確定しない                                  |
| 完了条件 | 下記の検証条件を満たす                                                                                   |

- 空のリポジトリで OpenCode の scaffold を実行し、`ollama-local` の接続・モデル設定が用意されることを確認する。
- 配布する名簿・agent・接続設定のモデル ID を整合させ、gemma・qwen は原則 `*-work-64k` を使う。例外が必要な場合は理由を対応結果と報告の `handoff` に記録する。
- `*-work-64k` の派生タグ作成手順と、接続先の設定手順、既存環境の修正手順を記載する。派生タグを公式配布タグとして扱わない。
- 既存の接続設定や名簿を既定で上書きしないことを確認する。
- scaffold・init の関連テスト、型検査、lint を通し、親の検証を通す。
- CHANGELOG は `Unreleased` に記載し、公開済みの版は変更しない。
- 保護された設定の変更が必要な場合、案を個票の対応結果と報告の `handoff` に残し、利用者の承認のもとで反映する。
- 実施内容と検証結果を対応結果へ記録する。実接続の確認ができない場合は残る確認事項を明記する。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]
- [[specdojo:command-reference]]
- [[prj-0001:pjr-2asz-init-gemma-reporter-26b]]
