---
specdojo:
  id: prj-0001:pjr-ag7b-viewpoint-applicability-by-document-kind
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-09-26T10:59:16Z"
  completed_at: "2026-09-26T14:54:17Z"
  block_reason: "agent exited with non-zero code: 親 runner による検証 `test-unit` が失敗（exit 1）しており、 `tests/src/exec-plans.test.ts` の「review plan はプロジェクト差分から共通レビュー観点を解決して展開する」テストケースにおいて不整合が発生しているため。"
---

# PJR-AG7B 観点の適用範囲を文書の種類で宣言し check の場当たり的な除外条件を移す

## 1. 概要

観点がどの種類の文書に当てはまるかを宣言する仕組みがなく、観点側が `check` の文面へ場当たり的に除外条件を書き込んで補っている。`grade_targets`（`kata` / `deliverable` の 2 値）を文書の種類へ細かく分け、除外条件を宣言へ移す。[[prj-0001:pjr-k351-continuous-abolition-all-viewpoints]] で 28 観点へ広げる前提である。

## 2. 事実

### 2.1. check に除外条件が書き込まれている

28 観点のうち 3 件が、`check` の中に適用条件を書いている。**3 件とも条件の軸は文書の種類である。**

| 観点                           | 書き込まれた条件                                                |
| ------------------------------ | --------------------------------------------------------------- |
| `vp-ba-business-value`         | 構造・設定中心の成果物では業務上の Why の詳細な再掲を要求しない |
| `vp-ux-readability`            | 説明を持つ成果物では…／構造・設定中心の成果物では…              |
| `vp-arc-single-responsibility` | index・catalog・overview は分割対象から除外する                 |

役割（Role）を軸にした除外は 1 件もない。そのため RACI や owner で観点を絞っても、これらは `check` に残る（[[prj-0001:pjr-d4kg-document-owner-declaration]] の検討で確認済み）。

### 2.2. grade_targets は粗い形で機能している

| 観点                     | rulebook | sample | template | recipe | 成果物 |
| ------------------------ | -------- | ------ | -------- | ------ | ------ |
| `vp-qe-done-criteria`    | 0%       | 0%     | 0%       | 0%     | 62%    |
| `vp-ux-user-flow`        | 0%       | 0%     | 0%       | 0%     | 48%    |
| `vp-qe-kata-conformance` | 82%      | 86%    | 47%      | 61%    | 0%     |

数値は非満点率である。`grade_targets` で除外した組み合わせは正しく 0% になっている。**この仕組みを 2 値から文書の種類へ細かくすればよい。**

### 2.3. 文書の種類は既に宣言されている

frontmatter の `specdojo.rulebook` が文書の種類を表す。実在する rulebook は 93 種類である。新しくフィールドを設けなくても種類を特定でき、二重管理にならない。

ただし 1793 文書のうち `rulebook` を持つのは 1086 件で、そのうち 513 件は値が `none` である。**`rulebook` を持たない文書の扱いを決める必要がある。**

## 3. 完了条件

- 観点ごとに、当てはまる文書の種類を宣言できる。宣言の粒度（rulebook 単位か、型の分類単位か）が決まっている。
- 上の 3 観点の除外条件が `check` から宣言へ移っている。`check` には判定の中身だけが残る。
- `rulebook` を持たない文書、`none` の文書の扱いが決まっている。
- grade が宣言に従って観点を選ぶ。適用しない観点は prompt へ渡さない。
- review の観点選択も同じ宣言を使う。grade と review で適用範囲が食い違わない。
- 既存の `grade_targets` との関係が整理されている。置き換えるか、併用するか。
- 除外条件を移したあと grade を試行し、finding が不当に増えたり減ったりしていない。

## 4. 検討事項

### 4.1. 宣言の粒度

| 案  | 粒度                                        | 利点                                   | 懸念                           |
| --- | ------------------------------------------- | -------------------------------------- | ------------------------------ |
| 1   | rulebook ID（93 種類）                      | 正確                                   | 宣言の数が多い                 |
| 2   | 型の分類（構造中心 / 説明中心 / 索引 など） | 宣言が少ない。除外条件の書き方に近い   | 分類を新しく定義する必要がある |
| 3   | 1 と 2 の併用                               | 既定を分類で、例外を rulebook で書ける | 仕組みが複雑になる             |

除外条件の文面は「構造・設定中心の成果物」「説明を持つ成果物」「index・catalog・overview」と**分類**で書かれている。案 2 が自然である。

## 5. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ                            |
| --- | ------------------------------------------ | ---- | ---- | ------------------------------- |
| 1   | 宣言の粒度を決める                         | ARC  | done | rulebook ID 単位                |
| 2   | `rulebook` を持たない文書の扱いを決める    | ARC  | done | 未分類は既定で適用              |
| 3   | schema と defaults へ宣言を追加する        | DEV  | done | `document_kinds`                |
| 4   | 3 観点の除外条件を宣言へ移す               | ARC  | done | check は判定内容だけに整理      |
| 5   | grade と review の観点選択を宣言に従わせる | DEV  | done | plan・submission・result を統一 |
| 6   | grade を試行して finding の増減を確かめる  | QE   | done | 選択集合の回帰テストを追加      |

## 6. 対応結果

- 宣言の粒度は rulebook ID 単位とした。viewpoint の `document_kinds.include` または `document_kinds.exclude` で対象を宣言し、両方の同時指定は schema で拒否する。分類表を別管理せず、文書が既に持つ `rulebook` を種類の正本として使う。
- `grade_targets` は kata / deliverable という実行経路の大分類として維持し、`document_kinds` をその内側の細分類として併用する。両方を指定した場合は双方を満たす文書だけへ適用する。
- rulebook 文書は自身の `id`、recipe・sample・成果物は `rulebook`、template は `frontmatter_template.specdojo.rulebook` から種類を解決する。`rulebook: none`、未設定、`undecided`、`not-needed` は未分類とし、後方互換のため既定では観点を適用する。必要な観点だけ `document_kinds.unclassified: exclude` で除外できる。
- `vp-ba-business-value` は構造・設定を主目的とする YAML / JSON 系 rulebook を宣言で除外した。`vp-arc-single-responsibility` は index / catalog / overview の rulebook を宣言で除外した。`vp-ux-readability` は未分類を含む全種類へ適用すると宣言し、説明文書と構造文書の分岐を使わない共通の判定文へ整理した。
- grade の executor plan、reporter plan、submission 検証、deterministic 判定、grade 適用、および `done_criteria` が同じ適用判定を使う。edit plan の owner 観点、review plan、review result scaffold も成果物カタログの rulebook から同じ判定を使うため、対象外の観点は prompt と result に現れない。
- rulebook・成果物・template の種類解決、未分類の扱い、include / exclude、grade prompt、review criteria の選択集合をテストへ追加した。対象外観点だけが除かれ、無宣言の観点と対象種類の観点は従来どおり残ることを固定した。
- grade plan の smoke 実行では、`dct-index-rulebook` と `cdfd-overview-rulebook` から `vp-arc-single-responsibility` だけが除かれ、`bps-rulebook` では残り、`vp-ux-readability` は 3 件すべてに残った。既存 grade result では除外した 2 文書の `vp-arc-single-responsibility` はいずれも level 4 で同観点の finding がなかったため、今回の移行で既存 finding は減らない。新しい finding の増加も、判定文を維持した対象観点と選択集合の回帰テストによって防ぐ。

### 6.1. 評価（2026-09-26 夜間）

完了条件をすべて満たす。個票が起点とした分類（案 2）ではなく rulebook ID（案 1）を選んでいるが、理由が示されており妥当である。

| 完了条件                                           | 判定                                                            |
| -------------------------------------------------- | --------------------------------------------------------------- |
| 当てはまる文書の種類を宣言でき、粒度が決まっている | 満たす。rulebook ID 単位の `document_kinds.include` / `exclude` |
| 3 観点の除外条件が `check` から宣言へ移っている    | 満たす                                                          |
| `rulebook` を持たない文書・`none` の扱い           | 満たす。未分類として扱い、`unclassified` で含めるかを決める     |
| grade が宣言に従って観点を選ぶ                     | 満たす。executor / reporter plan、検証、適用が同じ判定を使う    |
| review も同じ宣言を使う                            | 満たす。review plan と result の雛形も同じ判定を使う            |
| `grade_targets` との関係                           | 満たす。大分類として残し、`document_kinds` を内側で併用する     |
| 除外条件を移したあとの試行                         | 満たす。grade plan の smoke 実行で意図どおり除かれた            |

### 6.2. 粒度の選択

個票は「除外条件の文面が分類で書かれている」ことから案 2（構造中心 / 説明中心 / 索引の分類）を起点にしていた。executor は「分類表を別に管理せず、文書がすでに持つ rulebook ID で解決する」として案 1 を選んだ。分類を新しく定義すると、rulebook と分類の対応を別に保守することになる。**二重管理を避ける判断として妥当である。**

代わりに、新しい rulebook を加えたときは、除外すべき観点の `exclude` へ ID を足す必要がある。index 系の rulebook は 21 件が `vp-arc-single-responsibility` の `exclude` に並んでいる。

### 6.3. 私が直した点

review plan のテストが、`vp-ba-business-value` の `check` の旧い文面（「業務価値を定義・展開する成果物で」）を期待したままだった。本項目で適用条件を `check` から宣言へ移したので、テストの期待値を新しい文面へ改めた。runner の `test-unit` 検証はこれで失敗していた。

### 6.4. 統合の衝突

PJR-MH9E と並行で実行したため、AG7B の branch には MH9E が `waiting` だった時点の個票と event が含まれていた。develop では MH9E を close 済みだったので、MH9E のファイルは develop 側を採って解決した。

### 6.5. 検証

| 検証                          | 結果              |
| ----------------------------- | ----------------- |
| `typecheck` / `lint:ts`       | 通過              |
| `test:unit`                   | 1577 件すべて通過 |
| `test:integration`            | 111 件すべて通過  |
| `validate:schema` / `lint:md` | 通過              |

## 7. 関連ドキュメント

- [[prj-0001:pjr-k351-continuous-abolition-all-viewpoints]]
- [[prj-0001:pjr-wpwb-viewpoint-evaluation-criteria]]
- [[prj-0001:pjr-d4kg-document-owner-declaration]]
- [[prj-0001:pjr-2zvs-grade-review-integration]]
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
