---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-ifx-index-060-20261113t200735z-b971249c
  type: exec-result
  task_id: T-KATA-WAVE-1-ifx-index-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-ifx-index-060/T-KATA-WAVE-1-ifx-index-060-20261113T200735Z-b971249c/plan.md
  started_at: "2026-11-13T20:07:40.070Z"
  completed_at: "2026-11-13T20:26:24.160Z"
  agent: sol-executor
  execution: agent
  approach: template-maintenance
  targets:
    - ifx-index
    - specdojo:ifx-index-template
---

# Edit Result

## 1. 実施内容

- 外部システムI/F一覧の `template` を、改訂後の `rulebook` が定義する必須記入領域および構造に同期させました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/ifx-index-template.yaml`: 改訂 `rulebook` の要求に従い、管理担当・承認、公開判断、異常時の未完了結果、IFごとの確認者と合意対象、未決事項の解消条件・判断時点・影響・保留範囲、および `Schedule`・管理記録への導線をコメント記入欄として追加し、構造を最適化しました。

## 3. 申し送り

- reporter 記載用: 変更ファイルは docs/ja/specdojo/templates/ifx-index-template.yaml。管理担当・承認と公開判断、異常時の未完了結果、IF ごとの確認者と合意対象、未決事項の解消条件・判断時点・影響・保留範囲、Schedule・管理記録への導線をコメントの記入欄として補った。
- 判断根拠: ifx-index-rulebook の本文要件・記述ガイド、template-authoring-standard、document-metadata-standard、既存 recipe・sample、適用先の product/020-external-interface-specs/ifx-index.yaml を照合した。rulebook-authoring-standard、PJR-2GD6、vp-arc-conciseness も確認し、値域・構文・詳細設計は正本へ委譲した。plan の finding はなし。既存 grade サイドカーは旧版 rulebook の評価として参照し、変更していない。
- recipe は境界の抽出・契約分割・未決事項の整理手順に必要、template は YAML キーと必須コメント領域の開始点に必要と判断した。rulebook frontmatter の既存 ID 宣言を維持した。rulebook は完成例を sample に分離済みで、章番号・判断基準・良い例と悪い例を備える。既存 YAML sample は3連携と管理への引き継ぎを含むため維持した。4文書ともサイドバー登録済みで、新規文書はない。
- 検証補足: template 自体への初回の明示 schema 検証は、template 固有メタ情報と未置換値で失敗した。実装を確認し、既存の validate=false reason=template に従う modeline 検査へ切り替えて成功した。さらに `metadata_template` を平坦化し、既存 sample の値で記入した一時 YAML を成果物 schema で検証して成功した。一時ファイルは削除済み。result の記入は reporter に委ねる。
- 適用外の検証: `npx markdownlint`（変更ファイルは YAML のみ。）
- 適用外の検証: `npm run validate:catalog`（executor による docs/ja/projects/ 配下の変更なし。）
- 適用外の検証: `npm run validate:history-links`（executor による履歴ファイルの変更なし。）

## 4. 進め方と実践の型の適用

改訂された `rulebook` の本文要件および記述ガイドを正本とし、`template` の YAML キー構造と必須コメント領域を同期させました。具体的に、管理体制（担当・承認）、公開判断、異常時対応、合意事項、未決事項の解消条件、および関連文書への導線といった必須項目を補完し、`template-authoring-standard` および `document-metadata-standard` に準拠させました。また、詳細な値域や構文については正本である `rulebook` へ委譲し、冗長性を排除しました。
