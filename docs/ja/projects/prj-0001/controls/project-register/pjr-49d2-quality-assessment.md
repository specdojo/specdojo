---
specdojo:
  id: prj-0001:pjr-49d2-quality-assessment
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-29T00:15:15Z"
  due_on: "2026-09-30"
  register_events:
    - v: 1
      id: reg_5a502849368e4319a6ed07318995a8e7
      ts: "2026-08-29T00:15:15Z"
      action: add
      actor: manual
      from_status: null
      to_status: open
      reason: item added
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: rulebook/sample/recipe/template の品質評価コマンドを設計・実装する
        - field: description
          from: ""
          to: authoring standard 準拠度を評価する specdojo コマンドを追加する。評価軸は completeness / reference / specificity / conciseness / coherence / cross-consistency / context の7軸とし、冗長性の排除・簡潔性・論理矛盾の排除を明示的に含める。スコアは軸別に 0-4 のルーブリックレベルで判定して 0-100 へ写像し、種別ごとの重み付き平均で総合スコアを出す。verdict はスコアと独立に finding severity から決める。評価結果は frontmatter の specdojo.assessment、要修正箇所は本文の specdojo:finding コメントに記録し、bootstrap / *-maintenance approach で agent が解消するフローに接続する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-29"
        - field: due
          from: ""
          to: "2026-09-30"
---

# PJR-49D2 rulebook/sample/recipe/template の品質評価コマンドを設計・実装する

## 1. 概要

rulebook / sample / recipe / template には agent が機械的に生成したものが含まれ、品質にばらつきがある。既存の `lint:md` / `lint:fm` / `validate:schema` は形式のみを検証するため、内容品質のばらつきは検出できない。

authoring standard および成果物 rulebook への準拠度を評価する `specdojo grade` コマンドを追加する。評価軸は共通コア5軸（completeness / reference / specificity / conciseness / coherence）と種別固有軸で構成し、agent が生成した文書に出やすい冗長性・論理矛盾を明示的な軸として含める。スコアは軸別に 0-4 のルーブリックレベルで判定して 0-100 へ写像し、種別ごとの重み付き平均で総合スコアを出す。verdict はスコアと独立に finding severity から決める。

評価結果は対象文書の Frontmatter `specdojo.grade` に、要修正箇所は本文の `specdojo:finding` コメントに記録する。修正は評価コマンドでは行わず、bootstrap および `<kind>-maintenance` approach の exec タスクで agent が解消する。

評価対象は kata（rulebook / recipe / sample / template）と成果物の両方とする。実装は kata を先行させ、成果物は後続フェーズで展開する。

## 2. 完了条件

- `specdojo grade` が追加され、対象種別（kata / 成果物）を指定して実行できる。
- 共通コア5軸と種別固有軸について 0-4 のレベル基準が rubric 定義ファイルとして存在し、種別ごとの重みを設定できる。
- rubric は種別別に分かれており、completeness の判定根拠を種別ごとに切り替えられる。
- 評価結果が対象文書の Frontmatter `specdojo.grade` へ記録され、schema 検証を通る。
- 要修正箇所が本文の `specdojo:finding` コメントとして該当箇所の直前に挿入される。
- Frontmatter の findings 件数と本文コメント数の不一致を検出する検証が存在する。
- bootstrap および `<kind>-maintenance` approach の plan から findings を参照して修正できる。
- 修正後の再評価で completeness が劣化していないことを確認する手順が文書化されている。
- grade 結果を readiness 評価の `facts` として取り込める。
- 既存の kata へ一括適用し、ばらつきの実態と閾値の妥当性を把握できている。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                   | 担当   | 状態 | メモ                                                       |
| --- | -------------------------------------- | ------ | ---- | ---------------------------------------------------------- |
| 1   | 評価軸とルーブリックの確定             | ARC    | open | 共通コア5軸と種別固有軸のレベル基準を rubric 定義へ落とす  |
| 2   | スコア算出仕様の確定                   | ARC    | open | 軸別スコア、種別別の重み、総合スコア、verdict 判定         |
| 3   | grade の Frontmatter schema 拡張       | ARC    | open | 共通 schema へ置くか種別別 schema へ置くかを含めて判断する |
| 4   | finding コメント記法の確定             | ARC    | open | 記法、配置制約、Markdown 以外の成果物の扱い                |
| 5   | 決定的層の実装（kata 先行）            | _TODO_ | open | completeness / reference の算出と冗長性の代理指標          |
| 6   | agent 判定層の実装（kata 先行）        | _TODO_ | open | exec と同様に agent を起動し findings を生成する           |
| 7   | maintenance フローへの接続             | _TODO_ | open | plan への findings 供給と修正後の再評価                    |
| 8   | kata への一括適用と閾値検証            | _TODO_ | open | ばらつきの実態把握と合格閾値の確定                         |
| 9   | readiness の facts への grade 取り込み | _TODO_ | open | schema 拡張と収集処理。PJR-JFTC と歩調を合わせる           |
| 10  | 成果物への展開                         | _TODO_ | open | 種別固有軸の追加と段階適用。共通コア5軸の確定後            |

### 3.1. コマンドと記録形式

コマンド名は `specdojo grade` とし、対象種別は引数で指定する。readiness 評価が成果物と kata の両方を対象にしている以上、その入力となる品質評価も両方を対象にする必要があるため、名前に `kata` を含めない。

```sh
specdojo grade run --kind kata
specdojo grade run --kind deliverable --project prj-0001
specdojo grade report --project prj-0001
specdojo grade check
```

Frontmatter キーは `specdojo.grade` とする。`assessment` は readiness 評価が使う語であり、混同を避ける。

### 3.2. 評価軸

共通コア5軸はどの対象にも適用し、種別固有軸を追加する。冗長性と論理矛盾は agent が生成した文書で特に問題になるため、対象を問わず評価する。

| 軸                  | 判定層          | kata での基準               | 成果物での基準                   |
| ------------------- | --------------- | --------------------------- | -------------------------------- |
| `completeness`      | 決定的          | authoring standard の要求章 | 成果物 rulebook と done_criteria |
| `reference`         | 決定的          | 相互参照の解決              | wikilink と上位下位の参照        |
| `specificity`       | agent           | 共通                        | 共通                             |
| `conciseness`       | agent＋代理指標 | 共通                        | 共通                             |
| `coherence`         | agent           | 共通                        | 共通                             |
| `cross-consistency` | agent           | rulebook と sample の整合   | 上位成果物と下位成果物の整合     |
| `context`           | agent           | sample の業務文脈統一       | 適用しない                       |

`completeness` は判定根拠の正本が種別で変わるため、rubric を `kata-rubric-v1` と `deliverable-rubric-v1` に分けて持つ。

決定的層は specdojo 内で完結し、agent 判定層は exec と同様に agent を起動する重い操作として分離する。

`conciseness` の finding ルールは `redundant-restatement`（同一内容の反復）、`standard-duplication`（上位 standard の引き写し）、`filler-prose`（規範を含まない一般論）、`redundant-preamble`（重複する章冒頭説明）、`over-structuring`（情報量に対する過剰な階層・表）とする。

`coherence` の finding ルールは `internal-contradiction`（文書内の規則の食い違い）、`rule-sample-mismatch`（rulebook の規則と sample の実体の矛盾）、`unsatisfiable-rule`（適用条件が矛盾し満たせない規則）、`terminology-drift`（用語の定義と使用のずれ）とする。

### 3.3. 軸別スコアの基準

生の点数を agent に直接答えさせると同一文書でも判定がぶれ、経時比較が成立しない。agent 判定軸は 0-4 の離散レベルをルーブリックで判定させ、`score = level × 25` へ写像する。決定的軸は充足率から算出する。

| level | 意味       | 判定基準                                         |
| ----- | ---------- | ------------------------------------------------ |
| 4     | 良好       | 指摘なし、または info のみ                       |
| 3     | 軽微な課題 | minor のみ。実務上そのまま使える                 |
| 2     | 要改善     | major あり。誤用・誤読を招く箇所がある           |
| 1     | 不十分     | major が複数、または軸の目的をほぼ果たしていない |
| 0     | 不成立     | critical あり。その軸で文書が機能していない      |

軸ごとの具体基準は rubric 定義ファイルに置く。`conciseness` の例を次に示す。

| level | conciseness の基準                                         |
| ----- | ---------------------------------------------------------- |
| 4     | 各章が固有情報を持ち、削れる段落がない                     |
| 3     | 冗長な前置きが数箇所あるが、規範の読み取りに支障がない     |
| 2     | 上位 standard の引き写しや同一内容の反復が章単位で存在する |
| 1     | 相当部分が一般論・反復で占められ、固有の規範を探すのが困難 |
| 0     | 実質的な規範がほぼなく、冗長な散文だけで構成されている     |

スコアと finding は相互に拘束する。根拠のない点数を構造的に排除するため、level を 3 以下にする場合は根拠となる finding の提示を必須とし、severity は level の上限を制限する。

| severity   | 意味                                    | スコアへの影響          |
| ---------- | --------------------------------------- | ----------------------- |
| `critical` | 規範として誤り、必須要素が不成立        | その軸を level 0 に固定 |
| `major`    | 誤用・誤読を招く、standard の要求に違反 | level 上限を 2 に制限   |
| `minor`    | 改善が望ましいが実害は小さい            | level 上限を 3 に制限   |
| `info`     | 提案・気づき                            | 影響しない              |

### 3.4. 総合スコアと verdict

総合スコアは軸別スコアの重み付き平均とする。重みは種別ごとに変える（rulebook は completeness を重く、sample は context と cross-consistency を重くする）。重みは rubric 定義ファイルに置く。

verdict はスコアから独立させ、finding severity から決める。総合スコアが高くても critical が 1 件でもあれば fail とする。

```text
total   = Σ(weight_axis × score_axis)
verdict = critical > 0                  → fail
          major > 0 または total < 70   → needs-work
          上記以外                      → pass
```

合格閾値 70 は仮置きであり、kata への一括適用の結果を見て確定する。

`verdict: needs-work` を検出しても register への自動起票は行わない。既存資産へ一括適用すると大量の項目が生まれ、登録簿が実質的に使えなくなるためである。

### 3.5. 評価結果の記録

評価結果は対象文書の Frontmatter に記録する。rubric のバージョンを併記しないと、スコアの変化が品質改善によるものか基準改定によるものか判別できないため、`rubric` は必須とする。

```yaml
specdojo:
  grade:
    rubric: kata-rubric-v1
    verdict: needs-work
    score: 68
    graded_at: 2026-08-29T00:00:00Z
    graded_by: specdojo-grade/claude-opus
    axes:
      completeness: { level: 3, score: 75 }
      reference: { level: 4, score: 100 }
      specificity: { level: 2, score: 50 }
      conciseness: { level: 2, score: 50 }
      coherence: { level: 3, score: 75 }
      cross_consistency: { level: 3, score: 75 }
      context: { level: 4, score: 100 }
    findings: { critical: 0, major: 2, minor: 3, info: 1 }
```

要修正箇所は指摘対象の直前に独立行の HTML コメントとして挿入する。

```markdown
<!-- specdojo:finding id=F1 severity=major rule=required-section 「禁止事項」表が無い。standard の要求章が欠落している。 -->
```

Frontmatter の findings 件数と本文コメント数の一致を検証することで、Frontmatter だけを pass へ書き換えてコメントが残る不整合を検出できる。

### 3.6. 修正フローへの接続

評価コマンドは評価のみを行い、文書を修正しない。修正は既存の bootstrap および `<kind>-maintenance` approach の exec タスクが担う。

`conciseness` を軸に加えると、maintenance で規範情報ごと削られる副作用が生じうる。これを防ぐため、finding には削除案ではなく統合先を書かせ、maintenance の done_criteria に「対応した finding のコメントを削除する」と「再評価で completeness が劣化していない」を含める。

### 3.7. 既存の評価・レビューとの責務分担

readiness 評価（`sch-assessment`、PJR-JFTC で `sch-readiness` へ改名予定）は、track 単位で成果物と kata が根拠として使える状態かを判定し、`recommended_approach` を導く。品質評価は資産単位で内容品質を測る。両者は評価対象が異なるため分離し、品質評価を readiness の入力とする。

```text
specdojo grade
  → 対象文書の Frontmatter へ grade を記録
    → readiness の facts 収集がコードで読み取る
      → judgment（この資産を根拠にできるか）
        → recommended_approach
```

readiness 評価は `facts` をコードが収集し、agent が編集してはならない責務分離を持つ。grade は機械可読な Frontmatter に記録されるため agent の推測ではなく事実として扱え、`facts` へ取り込める。これにより readiness 判定の再現性が上がり、品質の低い資産を根拠にして成果物まで品質が下がる連鎖を facts の段階で断てる。

exec の review task と `pm-review-viewpoints` は、内容の妥当性（要求の抜け漏れ、トレース欠落）を多観点で判定する。品質評価は文書としての品質を測るものであり、review を置き換えない。両者を混同すると二重のレビュー体制になるため、役割の違いを規範文書へ明記する。

### 3.8. 未決の論点

- Markdown 以外の成果物の扱い。`target_format: yaml` の成果物は `#` コメントで記録できるが、JSON はコメントを書けない。サイドカーファイルへ落とすか対象外とするかを決める。
- HTML コメントが VitePress ビルド、prettier、markdownlint を通ることの確認。表セル内など配置によっては構造を壊すため、独立行のみに限定する規約が必要になる。
- 成果物へ展開する際の実行コスト。文書 ID インデックスは 1399 件あり、全件を agent 判定へ回すのは現実的でない。決定的層を全件へ適用し、閾値未満のみ agent 判定へ送る段階適用を検討する。
- findings を maintenance plan へ埋め込むか、本文コメントを agent に読ませるだけにするか。
- agent 判定層の再現性の測定方法。同一文書を複数回評価したときのレベル差を許容範囲として定義する。

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-jftc-sch-readiness-rename]]: readiness 評価の改名 TODO。facts 連携と歩調を合わせる。
- [[specdojo:rulebook-authoring-standard]]: rulebook の評価基準の正本。
- [[specdojo:sample-authoring-standard]]: sample の評価基準の正本。
- [[specdojo:recipe-authoring-standard]]: recipe の評価基準の正本。
- [[specdojo:template-authoring-standard]]: template の評価基準の正本。
- [[specdojo:document-metadata-standard]]: Frontmatter へ grade を追加する際の規約。
- [[specdojo:exec-operation-guide]]: maintenance approach の実行フローとの接続先。
- [[specdojo:review-guide]]: review との責務分担を確認する。
