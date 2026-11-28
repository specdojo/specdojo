---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdt-sample-120-20261125t161934z-c2d2af1c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdt-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdt-sample-120/T-KATA-REVIEW-ALL-cdt-sample-120-20261125T161934Z-c2d2af1c/plan.md
  started_at: "2026-11-25T16:19:44.515Z"
  completed_at: "2026-11-26T10:45:12.944Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdt-sample
    - specdojo:cdt-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `cdt-sample` を見直し、章の移動を 2 件行った。分類定義の共通段落を章の直後へ移し、判断境界の具体例を棚札タグの管理の前へ移した。
- 章の順と必須の章（概要・分類定義・値の業務的意味と使い分け・関連仕様との関係）は cdt-rulebook の本文要件と一致し、欠けている章はなかった。
- grade の F001（vp-ops-operability）は R1 の版で解消済みで、R2 の観点の範囲外のため本文は変更していない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 2. 分類定義（元は 2.3. 棚札タグの末尾） | 三つの属性名の位置づけ（データ構造を定義しない・本書が正本・棚札タグの値一覧を置かない）は三軸すべてにかかるのに、2.3. 棚札タグの小節の末尾にあり、棚札タグだけの補足に読める。 | 段落を「2. 分類定義」の直後、2.1. の前へ移した。 | vp-arc-document-structure | - |
| R2-2 | R2 | 3. 値の業務的意味と使い分け（判断境界の具体例・棚札タグの管理） | 判断境界の具体例は商品区分・取扱区分の組み合わせだけを示すのに、動的分類の 3.3. 棚札タグの管理の後にあり、固定の分類の選定条件から具体例への流れが途切れていた。 | 「判断境界の具体例」を 3.3.、「棚札タグの管理」を 3.4. にした（章の移動と番号の振り直し。本文は変えていない。章名での参照「棚札タグの管理」は変わらない）。 | vp-arc-document-structure | - |
| R2-3 | R2 | 全体（本文構成） | 章の順と必須の章（概要・分類定義・値の業務的意味と使い分け・関連仕様との関係）は cdt-rulebook の「本文要件」と一致し、欠けている章はない。template は not-needed なので突き合わせの対象外。 | - | vp-arc-document-structure、vp-qe-omissions-consistency | - |
| R2-4 | R2 | 3.2.2. 区分を変更する場合 | grade の F001（vp-ops-operability：区分を変えたときの棚札の貼り替えの責任者）は、R1 の版で店番担当が適用日までに貼り替える記述が入り、解消している。vp-ops-operability は kata-guide で kata の段のレビューに使わない観点で、R2 の範囲外なので本文は変えていない。この箇条は長いが、文の分割は R3 に任せる。 | - | kata-guide「kata の観点の組」 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdt-sample.md`: 「2. 分類定義」で、三つの属性名の位置づけの段落を 2.3. 棚札タグの末尾から章の直後（2.1. の前）へ移した。「3. 値の業務的意味と使い分け」では、判断境界の具体例を 3.3. に、棚札タグの管理を 3.4. に入れ替えて番号を振り直した。本文は変えていない。

## 3. 申し送り

- R2 の範囲では本文の文言は変えていない。F001 の元になった箇条は長いが、文の分割は R3 に任せる。
- R2-1: R2 / 2. 分類定義（元は 2.3. 棚札タグの末尾） / 三つの属性名の位置づけ（データ構造を定義しない・本書が正本・棚札タグの値一覧を置かない）は三軸すべてにかかるのに、2.3. 棚札タグの小節の末尾にあり、棚札タグだけの補足に読める / 段落を「2. 分類定義」の直後、2.1. の前へ移した / vp-arc-document-structure / -
- R2-2: R2 / 3. 値の業務的意味と使い分け（判断境界の具体例・棚札タグの管理） / 判断境界の具体例は商品区分・取扱区分の組み合わせだけを示すのに、動的分類の 3.3. 棚札タグの管理の後にあり、固定の分類の選定条件から具体例への流れが途切れていた / 「判断境界の具体例」を 3.3.、「棚札タグの管理」を 3.4. にした（章の移動と番号の振り直し。本文は変えていない。章名での参照「棚札タグの管理」は変わらない） / vp-arc-document-structure / -
- R2-3: R2 / 全体（本文構成） / 章の順と必須の章（概要・分類定義・値の業務的意味と使い分け・関連仕様との関係）は cdt-rulebook の「本文要件」と一致し、欠けている章はない。template は not-needed なので突き合わせの対象外 / - / vp-arc-document-structure、vp-qe-omissions-consistency / -
- R2-4: R2 / 3.2.2. 区分を変更する場合 / grade の F001（vp-ops-operability：区分を変えたときの棚札の貼り替えの責任者）は、R1 の版で店番担当が適用日までに貼り替える記述が入り、解消している。vp-ops-operability は kata-guide で kata の段のレビューに使わない観点で、R2 の範囲外なので本文は変えていない。この箇条は長いが、文の分割は R3 に任せる / - / kata-guide「kata の観点の組」 / -

## 4. 進め方と実践の型の適用

根拠は cdt-rulebook の本文要件と、kata-guide の R2（構成）の観点（vp-arc-document-structure、vp-qe-omissions-consistency）。R1 の版を読み、R1 の指摘は繰り返していない。章の順は rulebook と一致したため維持し、分類定義の共通段落の位置と判断境界の具体例の位置だけを直した。template は not-needed のため突き合わせの対象外とした。F001 は R1 で解消済みで、vp-ops-operability は kata の段のレビューに使わない観点のため、R2 では扱わなかった。rulebook など sample 以外は変更していない。
