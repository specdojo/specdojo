---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-assumptions-constraints-dependencies-sample-130-20261126t023102z-9c57864d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-assumptions-constraints-dependencies-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-assumptions-constraints-dependencies-sample-130/T-KATA-REVIEW-ALL-prj-assumptions-constraints-dependencies-sample-130-20261126T023102Z-9c57864d/plan.md
  started_at: "2026-11-26T02:31:13.139Z"
  completed_at: "2026-11-26T02:39:09.665Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-assumptions-constraints-dependencies-sample
    - specdojo:prj-assumptions-constraints-dependencies-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、前提・制約・依存関係の sample に文の直しを 5 件入れた。意味と判断に要る背景・制約・例外は変えていない。
- prettier 整形、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は成功した。他の検査は変更種別に当てはまらず `not_applicable` だった。
- 判断が要る指摘が 1 件ある（R3-6、「見直しの契機」の主語）。sample の事実を推測で決めないため、本文には反映していない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | 冒頭 | `PJR` の略語に初出で正式名がない。 | 「プロジェクト登録簿（PJR）の個票 `PJR-KN01`」にした。 | W8 | - |
| R3-2 | R3 | 3. 依存関係 | 「それだけで」の指す先が一つに決まらず、表の前に何の表かを示す 1 文がない。 | 「根拠であることだけを理由に依存先へ挙げない」に置き換え、「作業の開始・継続に要る依存先と、その受領・成立条件を次に示す。」を足した。 | W4、`sample-authoring-standard` の表の前の 1 文 | - |
| R3-3 | R3 | 4. 影響評価と対応方針 | 表の前に何の表かを示す 1 文がない。 | 「前提・制約・依存の変化の種別ごとに、最初に確認することと一次対応・対応方針を次に示す。」を足した。 | `sample-authoring-standard` の表の前の 1 文 | - |
| R3-4 | R3 | 4. 影響評価と対応方針 | 「A02」「C03」「D04」のような略記が、ID の正式表記と混ざっている。 | 「ACD-A01・ACD-A02」「ACD-C02・ACD-C03」「ACD-D01〜ACD-D04」にそろえた。 | W8、`vp-ux-language-consistency` | - |
| R3-5 | R3 | 5. 監視・変更管理 | 「見直しの契機」の文が、読点 8 つ以上で長い。 | 週次の見直しと「次のいずれかが起きた時も見直す」に分け、契機を列挙にした。 | W3 | - |
| R3-6 | R3 | 5. 監視・変更管理 | 「見直しの契機」に、誰が見直すかの主語がない。 | -。所有者の列から開発担当が見直すと読めるが、sample の事実を推測で決めないため、主語を足していない。足す場合は「開発担当（`PM`）が」とする案がある。 | W1 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-assumptions-constraints-dependencies-sample.md`: 文の読みやすさを直した。冒頭で PJR の正式名を初出に示した。依存関係と影響評価の表の前に、何の表かを示す 1 文を足した。ID の略記を ACD- 付きの正式表記にそろえた。見直しの契機の長い 1 文を、週次の見直しと列挙に分けた。

## 3. 申し送り

- R3-6 は「要判断」の印を付けた。見直しの主語を足すかどうかは、人が判断する。
- R3-1: R3 / 冒頭 / `PJR` の略語に初出で正式名がない / 「プロジェクト登録簿（PJR）の個票 `PJR-KN01`」にした / W8 / -
- R3-2: R3 / 3. 依存関係 / 「それだけで」の指す先が一つに決まらず、表の前に何の表かを示す 1 文がない / 「根拠であることだけを理由に依存先へ挙げない」に置き換え、「作業の開始・継続に要る依存先と、その受領・成立条件を次に示す。」を足した / W4、`sample-authoring-standard` の表の前の 1 文 / -
- R3-3: R3 / 4. 影響評価と対応方針 / 表の前に何の表かを示す 1 文がない / 「前提・制約・依存の変化の種別ごとに、最初に確認することと一次対応・対応方針を次に示す。」を足した / `sample-authoring-standard` の表の前の 1 文 / -
- R3-4: R3 / 4. 影響評価と対応方針 / 「A02」「C03」「D04」のような略記が ID の正式表記と混ざっている / 「ACD-A01・ACD-A02」「ACD-C02・ACD-C03」「ACD-D01〜ACD-D04」にそろえた / W8、`vp-ux-language-consistency` / -
- R3-5: R3 / 5. 監視・変更管理 / 「見直しの契機」の文が読点 8 つ以上で長い / 週次の見直しと「次のいずれかが起きた時も見直す」に分け、契機を列挙にした / W3 / -
- R3-6: R3 / 5. 監視・変更管理 / 「見直しの契機」に誰が見直すかの主語がない / - / W1。所有者の列から開発担当が見直すと読めるが、sample の事実を推測で決めないため主語を足していない。足す場合は「開発担当（`PM`）が」とする案 / 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

plan に展開された grade と condense の finding はなかった。そのため、kata-guide の R3 の観点と文章のチェック項目（W1〜W10）、`sample-authoring-standard` を根拠に、sample の文だけを直した。rulebook の構成と必須項目、各表の内容は変えていない。frontmatter の `status` も据え置いた。
