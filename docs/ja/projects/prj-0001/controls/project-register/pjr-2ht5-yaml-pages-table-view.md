---
specdojo:
  id: prj-0001:pjr-2ht5-yaml-pages-table-view
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-17T22:38:22Z"
  due_on: "2026-11-30"
---

# PJR-2HT5 YAML が正本の文書を、VitePress で表＋YAML 正本（折りたたみ）の形で表示する

## 1. 概要

業務データ辞書・ロール定義・メンバー定義などの表示用ページが YAML の丸写しになっているため、用語集と同じく表と折りたたんだ YAML 正本の形にする

## 2. 入力

- 利用者の要望（2026-11-18）: 業務データ辞書・ロール定義・メンバー定義は VitePress で YAML をそのまま HTML にした形で表示される。用語集のように表＋YAML 正本（折りたたみ）にしたい。ほかの YAML が正本の文書も洗い出して対応する
- orchestrator の洗い出し（2026-11-18）: 表示用ページ 223 件のうち、表＋折りたたみは用語集・ifx-index・dct テンプレートだけで、ほかは YAML の丸写し（src/docs/yaml-pages.ts の renderYamlPage）
- 対象の候補: bdd（bdd-register-entry・bdd-sample）、pm-roles（本番・sample）、pm-members（本番・sample）、pm-review-viewpoints（project・defaults）、ifx-cmd（ifx-cmd-ai-provider-cli・ifx-cmd-sample）、ifx-file-agent-evidence、tml（tml-index・tml-sample）、dct カタログのインスタンス 9 件と dct-sample・dct-index-sample、sch-milestones
- 対象外の案: grade の判定基準・job・routine・schedule の track/strategy/defaults/assessment、schema、YAML の template、OpenAPI/AsyncAPI の sample（ifx-api-sample・ifx-msg-sample）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
