---
specdojo:
  id: prj-0001:pjr-ebtz-vp-arc-cross-document-consistency-target-kata-conformance
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-09-25T13:09:50Z"
---

# PJR-EBTZ vp-arc-cross-document-consistency の突き合わせ先を target 別に絞り kata-conformance との境界を定める

## 1. 概要

`vp-arc-cross-document-consistency` は `grade_targets` を指定していないため、kata と成果物の両方へ 6 つの突き合わせ先（成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物）を宣言している。grade 対象の 86% は kata であり、**kata はカタログに 1 件も登録されていない**。宣言した突き合わせ先が適用できないため、agent は判定対象を kata 内部の整合へ差し替えており、`vp-qe-kata-conformance` と重複している。

## 2. 事実

### 2.1. kata はカタログに登録されていない

| 項目                       | 値         |
| -------------------------- | ---------- |
| grade 対象のうち kata      | 260（86%） |
| grade 対象のうち成果物     | 43         |
| カタログに登録された成果物 | 199        |
| **そのうち kata 相当**     | **0**      |

`dct-*.yaml` は成果物を列挙する。rulebook、recipe、sample、template は 1 件も含まれない。

### 2.2. finding の 77% は宣言した突き合わせ先を見ていない

198 件の finding を突き合わせ先の語で数えた。

| 突き合わせ先         | 言及した finding |
| -------------------- | ---------------- |
| 生成物               | 14               |
| 成果物カタログ       | 11               |
| Schedule             | 8                |
| 組織定義             | 7                |
| RACI                 | 5                |
| メンバー定義         | 0                |
| **いずれも言及なし** | **153（77%）**   |

言及のない finding は kata 内部の整合を指している。

```text
Frontmatter の定義表に `rulebook` 項目が欠落しており、`opr-template.md` の定義と矛盾している
サンプルのH1におけるルールブックへのリンク先が、実際のファイル名と不整合である
IDの正規表現が、サンプルのID形式と矛盾している
```

### 2.3. vp-qe-kata-conformance と重複している

`vp-qe-kata-conformance` の `check` は「rulebook、recipe、sample、template が種別ごとの責務を守り、相互参照と対象成果物への適用方法が矛盾なく定義されているか」である。上記の finding はこの定義に該当する。

| 項目                                                | 件数 |
| --------------------------------------------------- | ---- |
| 両観点が同時に finding を出した成果物               | 98   |
| うち `vp-arc-cross-document-consistency` の finding | 135  |
| うち `vp-qe-kata-conformance` の finding            | 143  |

### 2.4. 適用できない規準を宣言すると agent が差し替える

[[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]] は「`check` が規準を供給すれば照合型になる」ことを示した。本件はその裏返しである。**適用できない突き合わせ先を宣言すると、agent は判定を放棄せず、自分で別の対象に差し替える。** 宣言と実際の判定が乖離し、`evaluation` の区分も finding の解釈も成立しなくなる。

## 3. 完了条件

- kata に対する `vp-arc-cross-document-consistency` の扱いが決まっている。適用しないか、kata 向けの突き合わせ先を書き分けるかを選択している。
- `vp-qe-kata-conformance` との責務境界が `check` に明示されている。`vp-arc-single-responsibility` が `vp-arc-conciseness` との境界を書いている形に倣う。
- 変更後に grade を試行し、finding の重複が解消していることを確認している。
- finding 総数の減少が意図した範囲であることを確認している。重複の解消による減少と、検出漏れによる減少を区別する。
- 宣言した突き合わせ先が判定に使われているかを確認する手段が用意されている。乖離を再発させない。

## 4. 対応の候補

| 案  | 内容                                                            | 影響                                                        |
| --- | --------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | `grade_targets: [deliverable]` を指定し、kata を対象外にする    | 最小変更。kata の内部整合は `vp-qe-kata-conformance` が担う |
| 2   | kata 用の突き合わせ先を `check` へ書き分ける                    | 正確だが `check` が長くなる。重複の恐れが残る               |
| 3   | 突き合わせ先を構造化フィールドとして宣言し、target 別に指定する | 再発を防げる。schema の変更を伴う                           |

案 1 を推す。kata 内部の整合は `vp-qe-kata-conformance` の定義であり、責務を分けるのが自然である。ただし案 1 では kata が**カタログ以外の突き合わせ**（組織定義、生成物）からも外れるため、その必要性を確認する。

## 5. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                  |
| --- | ------------------------------------------------------ | ---- | ---- | ------------------------------------- |
| 1   | kata に必要な突き合わせ先が実際にあるかを確認する      | ARC  | done | 組織定義、生成物との整合は必要        |
| 2   | 対応の候補から方針を決定する                           | ARC  | done | 案 1 と kata 観点への責務移管を採用   |
| 3   | `vp-qe-kata-conformance` との責務境界を `check` へ書く | QE   | done | 両観点の `check` に境界を明記         |
| 4   | grade を試行し finding の重複解消を確認する            | QE   | done | 既存 finding 付き kata で plan を確認 |
| 5   | 宣言と判定の乖離を検出する手段を検討する               | ARC  | done | finding の突き合わせ根拠を必須化      |

## 6. 対応結果

- 案 1 を採用し、`vp-arc-cross-document-consistency` に `grade_targets: [deliverable]` を設定した。成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物との照合は成果物だけを対象とする。
- 実行時点の grade result を再集計したところ、kata 260 件のうち `vp-arc-cross-document-consistency` の finding を持つものは 109 件、`vp-qe-kata-conformance` の finding を持つものは 195 件、両方を持つものは 98 件だった。ARC 側 finding 147 件のうち、組織定義や生成物との照合を必要とする例があるため、これらを kata の対象外とはせず `vp-qe-kata-conformance` の責務として `check` に明記した。
- 両観点の `check` に境界を対称に記載した。Kata の内部・相互・適用先との整合は `vp-qe-kata-conformance`、成果物と 6 つの突き合わせ先との整合は `vp-arc-cross-document-consistency` が担う。
- `vp-arc-cross-document-consistency` の finding に、突き合わせ先の文書 ID またはパスと、双方の相反する記述を示すよう `check` と `evidence` で必須化した。宣言した突き合わせ先が実際の判定に使われたかを grade result から監査できる。
- 変更後に、両観点の finding を持つ `specdojo:pm-raci-recipe` を kata として grade plan 生成した。生成 plan には `vp-qe-kata-conformance` が含まれ、`vp-arc-cross-document-consistency` は含まれないことを確認した。これにより、再評価後の kata で両観点の重複は構造上 0 件となる。現行 sidecar の ARC 側 147 finding が減少するのは target 除外による意図した変化であり、検出すべき kata の不整合は QE 観点で継続して判定する。grade result サイドカーは本タスクで直接編集せず、次回の再評価で更新する。

## 7. 関連ドキュメント

- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- [[prj-0001:pjr-z47x-grade-changed-only]]
- [[prj-0001:pjr-dkx8-vp-arc-conciseness-vp-ux-user-flow-check]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml`
