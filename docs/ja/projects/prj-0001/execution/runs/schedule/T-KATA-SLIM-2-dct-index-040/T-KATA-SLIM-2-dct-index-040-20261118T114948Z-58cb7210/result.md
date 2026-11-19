---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-dct-index-040-20261118t114948z-58cb7210
  type: exec-result
  task_id: T-KATA-SLIM-2-dct-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-dct-index-040/T-KATA-SLIM-2-dct-index-040-20261118T114948Z-58cb7210/plan.md
  started_at: "2026-11-18T11:50:01.641Z"
  completed_at: "2026-11-19T10:59:34.028Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:dct-index
    - specdojo:dct-index-rulebook
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/rulebooks/dct-index-rulebook.md` から共通の運用記述を外し、メタ情報標準への参照に置き換えることで簡潔化した。
- 空白を除いた文字数を 6269 文字から 4981 文字（約 79.5%）に削減した。
- finding F001 に対し、template と `min_size` を用いて規模を比較する方法を記述し対応した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/dct-index-rulebook.md`: 共通の運用（役割、`status` 管理、承認、改訂・廃止手順、品質検査、未決事項管理、不要な用語定義および共通禁止事項）を削除し、正本への参照に置き換えた。また、章名「位置づけと用語定義」を内容に合わせて「位置づけ」に変更した。

## 3. 申し送り

- 章名の変更: 「位置づけと用語定義」を「位置づけ」に改めた。用語の表は本文要件の言い直しで、生成物の対応は「全体方針」「ファイル命名・ID規則」に既にあるため削り、残る用語定義は domain の論理単位の 1 項目だけになったので章名を内容に合わせた。result に記録が必要。
- rulebook-schema-enums の照合のため、ルート項目の表に status の enum 値（draft / ready / deprecated）を残した。値の意味の説明はメタ情報標準の参照に任せている。他の rulebook でも共通の運用を外すときに enum 値まで消すと validate:schema が失敗するため、型を簡潔にする一覧に「schema の enum 値の列挙は残す」を足すことを提案する。
- 「ドメイン項目」のキーの順序の記述は、禁止事項に理由付きで同じ内容があるため本文から削った。
- recipe・template・sample には変更が要る点は見つからなかった（recipe は not-needed）。
- 対象 `prj-0001:dct-index` は未変更: plan が成果物本体を変えないと定めており、dct-index.yaml は根拠として読んだだけである
- 適用外の検証: `npm run validate:schema:file`（変更した成果物は Markdown の rulebook だけで、YAML ファイルを変更していない）
- 適用外の検証: `npm run validate:history-links`（自分で変更した履歴蓄積ファイル（plan・result・個票）がない）

## 4. 進め方と実践の型の適用

plan の「このフェーズで行うこと」に従い、`dct-index-rulebook.md` から共通運用記述を排除し、`docs/ja/specdojo/standards/document-metadata-standard.md` 等の正本を参照する形式に改訂した。また、finding F001 の指摘に基づき規模比較の手順を追記し、`rulebook-schema-enums` 検査を通過させるため `status` の enum 値を維持した。
