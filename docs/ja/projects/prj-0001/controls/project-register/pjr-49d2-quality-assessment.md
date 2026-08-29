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

さらに、人が直接ファイルを編集した場合は exec task を経由しないため review が起動せず、品質劣化を検知する経路が存在しない。継続的に品質を観測する手段が要る。

`specdojo grade` を追加し、品質を定期的に評価して結果を対象文書の Frontmatter へ記録する。評価観点は grade 専用に定義せず、正本を viewpoint 定義に一本化する。grade と review は同じ観点集合を、違う時間軸と深さで評価する関係とする。観点を分けると、grade が pass とした項目を review が fail と判定する食い違いが起き、基準が二重管理になるためである。

評価対象は kata（rulebook / recipe / sample / template）と成果物の両方とする。実装は kata を先行させる。

## 2. 完了条件

- `specdojo grade` が追加され、対象種別（kata / 成果物）を指定して実行できる。
- 評価観点の正本が viewpoint 定義に一本化され、grade 専用の軸が存在しない。
- 冗長性・簡潔性の観点が viewpoint として追加されている。
- viewpoint に判定層と継続評価の可否が宣言され、grade が継続評価対象の観点だけを評価する。
- ルーブリックが category 単位で定義され、grade と review が同じ基準で判定する。
- スコアが category 別と総合で算出される。
- review result の判定（pass / fail / unclear）とルーブリックの level の対応が定義されている。
- 評価結果が Frontmatter へ冪等に上書きされ、再実行しても履歴が増えない。
- 要修正箇所が本文の `specdojo:finding` コメントとして該当箇所の直前に挿入される。
- Frontmatter の findings 件数と本文コメント数の不一致を検出する検証が存在する。
- routine から定期実行できる。
- agent 判定層が、前回評価以降に変更があった文書だけを対象にできる。
- 観点の正本が共通集合として定まり、kata 用の観点を参照できる（PJR-KCE0 の成果を前提とする）。
- bootstrap および `<kind>-maintenance` approach の plan から findings を参照して修正できる。
- grade 結果を approach 決定の `facts` として取り込める。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                               | 担当   | 状態 | メモ                                                    |
| --- | ---------------------------------- | ------ | ---- | ------------------------------------------------------- |
| 1   | 観点の一本化設計                   | ARC    | open | grade 専用軸を廃止し viewpoint 定義へ集約する           |
| 2   | 冗長性・簡潔性の観点追加           | ARC    | open | 既存 viewpoint に存在しない唯一の観点                   |
| 3   | viewpoint への評価属性の追加       | ARC    | open | 判定層と継続評価の可否を宣言する                        |
| 4   | category 単位ルーブリックの定義    | ARC    | open | grade と review が共有する 0-4 の level 基準            |
| 5   | スコア算出と review 判定の対応定義 | ARC    | open | category 別集約、総合スコア、pass/fail/unclear との写像 |
| 6   | grade の Frontmatter schema 拡張   | ARC    | open | 共通 schema へ置くか種別別 schema へ置くかを含めて判断  |
| 7   | finding コメント記法の確定         | ARC    | open | 記法、配置制約、Markdown 以外の成果物の扱い             |
| 8   | 決定的層の実装                     | _TODO_ | open | 機械判定可能な観点の評価と冗長性の代理指標              |
| 9   | agent 判定層と差分検知の実装       | _TODO_ | open | 前回評価以降に変更のあった文書だけを対象にする          |
| 10  | routine 対応                       | _TODO_ | open | action kind を追加するか job として定義するかを判断する |
| 11  | review への grade 結果の受け渡し   | _TODO_ | open | 同じ観点 ID で突き合わせ、再確認の二度手間を避ける      |
| 12  | kata への一括適用と閾値検証        | _TODO_ | open | ばらつきの実態把握と合格閾値の確定                      |
| 13  | approach 決定の facts への取り込み | _TODO_ | open | schema 拡張と収集処理。PJR-JFTC と歩調を合わせる        |

### 3.1. 観点の一本化

当初は grade 専用に7軸を設計したが、既存 viewpoint と突き合わせた結果、その大半が言い換えであることが分かった。

| 当初の軸            | 対応する既存 viewpoint                               |
| ------------------- | ---------------------------------------------------- |
| `completeness`      | `vp-qe-done-criteria`、`vp-qe-omissions-consistency` |
| `reference`         | `vp-arc-document-structure`                          |
| `coherence`         | `vp-qe-omissions-consistency`                        |
| `cross-consistency` | `vp-arc-cross-document-consistency`                  |
| `specificity`       | `vp-qe-verifiability`                                |
| `conciseness`       | 該当なし。viewpoint として追加する                   |

新たに必要なのは冗長性・簡潔性の観点だけである。agent が生成した文書は冗長になりやすく、既存観点はこれを捉えていない。観点の id は `vp-arc-conciseness` のように既存の命名に合わせる。

grade 専用の軸体系は作らない。観点を分けると同一文書に対して異なる判定が並立し、どちらを正とするか判別できなくなる。

観点の正本は SpecDojo 共通の観点集合とし、プロジェクトは差分（追加・上書き・無効化）を宣言して継承する。レビュー観点は本来プロジェクト横断で共通であり、プロジェクト固有なのは例外的な追加分に限られるためである。kata 用の観点も特定プロジェクトに属さないため共通側へ置く。共通化と継承の仕組みそのものは PJR-KCE0 で扱い、本項目はその結果として定まる観点集合を前提とする。

### 3.2. 評価可能性の宣言

観点が同じでも、継続的に評価できるものとできないものがある。`vp-po-purpose-alignment`（目的整合）や `vp-ba-business-value`（業務価値）は役割としての主観的判断を要するため、毎回機械的に評価しても意味を持たない。一方で文書構造や冗長性は継続評価に適する。

viewpoint 定義に評価属性を追加し、grade が扱う範囲を宣言で決める。

```yaml
- id: vp-arc-document-structure
  role: ARC
  category: architecture
  title: 文書構造・配置・命名
  check: frontmatter、ID、ファイル名、配置、見出し、リンクが文書体系と整合しているか。
  default_severity: major
  evaluation: deterministic # deterministic | agent | human
  continuous: true # grade が継続評価する対象か
```

観点集合は一つで、grade は継続評価対象の部分集合を評価し、review は全観点を判定する。

### 3.3. 判定基準とスコア

判定基準も観点側に持たせ、grade と review が同じルーブリックを使う。基準を共有することで、grade の結果と review の判定が原理的に食い違わなくなる。

観点は 20 件以上あるため、ルーブリックは category 単位で定義し、viewpoint が継承する形を第一候補とする。`pm-review-viewpoints.yaml` には既に category が定義されており、スコアの集約単位としてもそのまま使える。

生の点数を agent に直接答えさせると同一文書でも判定がぶれ、経時比較が成立しない。agent 判定は 0-4 の離散レベルで行い、`score = level × 25` へ写像する。決定的判定は充足率から算出する。

| level | 意味       | 判定基準                                       |
| ----- | ---------- | ---------------------------------------------- |
| 4     | 良好       | 指摘なし、または info のみ                     |
| 3     | 軽微な課題 | minor のみ。実務上そのまま使える               |
| 2     | 要改善     | major あり。誤用・誤読を招く箇所がある         |
| 1     | 不十分     | major が複数、または観点の目的をほぼ果たさない |
| 0     | 不成立     | critical あり。その観点で文書が機能していない  |

冗長性の観点における具体基準を例として示す。

| level | 冗長性・簡潔性の基準                                       |
| ----- | ---------------------------------------------------------- |
| 4     | 各章が固有情報を持ち、削れる段落がない                     |
| 3     | 冗長な前置きが数箇所あるが、規範の読み取りに支障がない     |
| 2     | 上位文書の引き写しや同一内容の反復が章単位で存在する       |
| 1     | 相当部分が一般論・反復で占められ、固有の内容を探すのが困難 |
| 0     | 実質的な内容がほぼなく、冗長な散文だけで構成されている     |

スコアと finding は相互に拘束する。根拠のない点数を排除するため、level を 3 以下にする場合は根拠となる finding の提示を必須とし、severity は level の上限を制限する。severity は viewpoint の `default_severity` を起点とする。

| severity   | 意味                             | スコアへの影響            |
| ---------- | -------------------------------- | ------------------------- |
| `critical` | 規範として誤り、必須要素が不成立 | その観点を level 0 に固定 |
| `major`    | 誤用・誤読を招く、要求に違反     | level 上限を 2 に制限     |
| `minor`    | 改善が望ましいが実害は小さい     | level 上限を 3 に制限     |
| `info`     | 提案・気づき                     | 影響しない                |

総合スコアは category 別スコアの重み付き平均とする。重みは対象種別ごとに変える。verdict はスコアから独立させ、finding severity から決める。

```text
category_score = 該当 viewpoint の score の平均
total          = Σ(weight_category × category_score)
verdict        = critical > 0                  → fail
                 major > 0 または total < 70   → needs-work
                 上記以外                      → pass
```

合格閾値 70 は仮置きであり、kata への一括適用の結果を見て確定する。

review result の判定は現在 pass / fail / unclear であるため、level との対応を定める必要がある。review を level で記録する形へ寄せるか、写像規則を定義するかは設計判断とする。

### 3.4. 評価結果の記録

評価結果は対象文書の Frontmatter に記録する。ルーブリックのバージョンを併記しないと、スコアの変化が品質改善によるものか基準改定によるものか判別できないため必須とする。

```yaml
specdojo:
  grade:
    rubric: grade-rubric-v1
    verdict: needs-work
    score: 68
    graded_at: 2026-08-29T00:00:00Z
    graded_by: specdojo-grade/claude-opus
    categories:
      architecture: { level: 3, score: 75 }
      consistency: { level: 3, score: 75 }
      quality: { level: 2, score: 50 }
      usability: { level: 2, score: 50 }
    viewpoints:
      vp-arc-document-structure: { level: 3 }
      vp-arc-conciseness: { level: 2 }
      vp-qe-omissions-consistency: { level: 3 }
    findings: { critical: 0, major: 2, minor: 3, info: 1 }
```

記録は冪等とする。再実行時は既存の `grade` を上書きし、履歴を増やさない。定期実行しても文書が肥大せず、常に最新状態だけが残る。判断の履歴が必要な場合は review result が担う。

要修正箇所は指摘対象の直前に独立行の HTML コメントとして挿入する。`rule` には viewpoint の id を書き、review 側と同じ語彙で参照できるようにする。

```markdown
<!-- specdojo:finding id=F1 severity=major rule=vp-qe-omissions-consistency 「禁止事項」表が無い。rulebook の要求章が欠落している。 -->
```

Frontmatter の findings 件数と本文コメント数の一致を検証することで、Frontmatter だけを pass へ書き換えてコメントが残る不整合を検出できる。

### 3.5. grade と review の関係

両者は同じ観点を評価するが、契機と出力の性質が異なる。

| 項目         | grade                       | review                     |
| ------------ | --------------------------- | -------------------------- |
| 契機         | 定期実行（継続監視）        | 成果物の完成時（ゲート）   |
| 対象観点     | 継続評価対象の部分集合      | 全観点                     |
| 出力         | Frontmatter（状態・上書き） | plan / result（履歴）      |
| 冪等性       | あり                        | なし。実行ごとに記録が残る |
| 人の直接編集 | 捕捉できる                  | 捕捉できない               |
| 判断の性質   | 観測                        | 合意形成                   |

review を定期実行に流用できない理由は、plan / result が履歴として蓄積するためである。毎回の実行で result が積み上がると、どれが意味のあるレビューだったのか判別できなくなる。plan / result は合意形成の記録であり、状態のスナップショットではない。

人が直接ファイルを編集した場合は exec task を経由しないため review が起動しない。この空白を grade が埋める。

grade の結果は review の入力として渡す。同じ観点 id で結果を突き合わせられるため、review では grade が判定済みの観点を再確認せず、役割としての主観的判断を要する観点に集中できる。

### 3.6. 修正フローへの接続

grade は評価のみを行い、文書を修正しない。修正は既存の bootstrap および `<kind>-maintenance` approach の exec タスクが担う。

冗長性を観点に加えると、maintenance で必要な情報ごと削られる副作用が生じうる。これを防ぐため、finding には削除案ではなく統合先を書かせ、maintenance の done_criteria に「対応した finding のコメントを削除する」と「再評価で構造・整合の観点が劣化していない」を含める。

### 3.7. approach 決定との関係

approach の決定（`sch-assessment`）は、track 単位で成果物と kata が根拠として使える状態かを判定する。`facts` はコードが収集し agent が編集してはならないという責務分離があるため、機械可読な Frontmatter に記録された grade は事実として `facts` へ取り込める。

```text
specdojo grade
  → 対象文書の Frontmatter へ grade を記録
    → facts 収集がコードで読み取る
      → usability（この資産を根拠にできるか）
        → intent と合わせて recommended_approach を導出
```

grade が代替できるのは `KataJudgment` の 4 つの check のうち `substantive-content`、`internal-consistency`、`standard-alignment` の 3 つである。残る `target-fit` は `facts.kata[].declaration` でほぼ決まる。一方 `intent` は成果物の品質からは導けないため grade では代替できない。この帰結として `sch-assessment` 自体の要否が論点となり、PJR-JFTC で判断する。

### 3.8. 未決の論点

- review result の判定と level の対応。review を level で記録する形へ寄せるか、pass / fail / unclear との写像規則を定めるか。
- routine からの起動方法。action kind を追加するか、job として定義するか。
- Markdown 以外の成果物の扱い。`target_format: yaml` の成果物は `#` コメントで記録できるが、JSON はコメントを書けない。サイドカーファイルへ落とすか対象外とするかを決める。
- HTML コメントが VitePress ビルド、prettier、markdownlint を通ることの確認。表セル内など配置によっては構造を壊すため、独立行のみに限定する規約が必要になる。
- 定期実行のコスト。文書 ID インデックスは 1400 件を超える。決定的層は全件に適用できるが、agent 判定層は前回評価以降に変更があった文書へ限定する必要がある。変更検知の基準（内容ハッシュ、更新日時、Git 差分）を決める。
- agent 判定層の再現性の測定方法。同一文書を複数回評価したときのレベル差を許容範囲として定義する。
- grade により usability が決定論化された結果、`sch-assessment` を廃止できるか。判断は PJR-JFTC で行う。

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-kce0-review-viewpoints-inheritance]]: 観点を共通集合として定義し継承する仕組み。観点の正本が定まることが本項目の前提。
- [[prj-0001:pjr-jftc-sch-assessment-retirement]]: sch-assessment の廃止可否を判断する TODO。本項目の設計確定が着手の前提。
- [[specdojo:review-guide]]: review の観点体系と plan / result の運用。観点の正本を共有する。
- [[specdojo:rulebook-authoring-standard]]: rulebook の判定根拠となる規範。
- [[specdojo:sample-authoring-standard]]: sample の判定根拠となる規範。
- [[specdojo:recipe-authoring-standard]]: recipe の判定根拠となる規範。
- [[specdojo:template-authoring-standard]]: template の判定根拠となる規範。
- [[specdojo:document-metadata-standard]]: Frontmatter へ grade を追加する際の規約。
- [[specdojo:exec-operation-guide]]: maintenance approach の実行フローとの接続先。
- [[specdojo:routine-operation-guide]]: 定期実行の設定先。
