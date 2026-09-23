---
specdojo:
  id: prj-0001:pjr-q3w9-gastown-design-philosophy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-23T22:45:39Z"
---

# PJR-Q3W9 Gas Town との設計思想の対比と理解の負債

## 1. メモ

競合比較（[[prj-0001:pjr-36qg-competitive-landscape-and-release]]）は機能の対応を扱う。本 note は設計思想の対比と、そこから生じる「理解の負債」という論点を記録する。位置づけの判断（[[prj-0001:pjr-e8tt-initial-release-positioning]]）を見直すときの材料とする。

調査は 2026-09-24 時点である。

### 1.1. Gas Town の思想

公式の説明で使われる語がそのまま特徴を表す。

| 概念                      | 内容                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| Dark Factory              | 自律 agent が背後で動き、人は監督する                                    |
| Wanted Board（Wasteland） | 共有の仕事掲示板。agent が投稿し、agent が claim する                    |
| 規模                      | Gas Town は数十、Gas City は数百の並行 agent                             |
| 人の役割                  | 「agents read and write the ledger; humans audit it」                    |
| 品質                      | stamps（多次元の証明）。信頼性や創造性を評価し、移譲可能な評判を蓄積する |

task を起票して依存関係で並列に流す思想である。beads の依存グラフと `bd ready` が土台になる。

### 1.2. 理解の負債という論点

task を細かく割って多数の agent で並列に進めると、人が全体像を把握できなくなるのではないか、という懸念がある。

Gas Town はこれに無自覚ではない。明示的に答えを用意している。

> Naming the parts the way a mechanic would makes the system legible — both to the humans running it and to the agents working inside it.

命名と記録の透明性で legibility を担保し、人は個々の作業を追わず台帳を監査する。**人が全部理解することを最初から諦めている**設計であり、放置の結果ではなく意図的な選択である。

それでも構造的な弱さが 2 つある。

- **beads が解くのは agent の記憶であって人の理解ではない。** 公式の説明は "A memory upgrade for your coding agent" で、agent がセッションをまたいで忘れる問題を埋める。人が全体像を把握する問題は対象外である。
- **依存グラフは順序を決めるが整合性を保証しない。** 「A の後に B」は表現できても「A と B が同じ設計思想に沿っているか」は表現できない。細かく割るほど、個々は正しいが全体として筋が通らない状態になりやすい。review を agent が行えば、agent が agent をレビューする閉じた輪になり人の理解は増えない。

一方、反論も成り立つ。すべてを理解する必要はなく、人間の大規模開発でも全員が全体を理解してはいない。型とテストが契約を守れば中身を読まずに使える。理解の所在がコードから issue グラフと台帳へ移る、という見方もできる。したがって「必ず破綻する」とは言えず、**どこまで持つかが未知**という段階である。

### 1.3. SpecDojo の二面性

当初「Gas Town は並列、SpecDojo は 1 件ずつ承認を挟む」と整理したが、これは誤りである。SpecDojo には 2 つの経路がある。

|          | register 経路        | schedule 経路                        |
| -------- | -------------------- | ------------------------------------ |
| 起点     | 気づいたことを起票   | 成果物カタログ → timeline → schedule |
| 順序判定 | 無し（人が決める）   | CPM で ready 判定                    |
| 実行     | 1 件ずつ、承認を挟む | `--auto --parallel --loop` で無人    |
| 人の役割 | 承認                 | 計画と review                        |

`rtn-exec-cycle.yaml` は `parallel: 2` / `loop: true` / `max_rounds: 100` を cron で回す定義を持つ。人は介在しない。**schedule 経路は Gas Town と同じ方向**である。

### 1.4. 差は並列性ではなく仕事の発生源と人の関与点

|            | Gas Town                                            | SpecDojo（schedule 経路）                             |
| ---------- | --------------------------------------------------- | ----------------------------------------------------- |
| 仕事の発生 | Wanted Board へ agent が投稿し、agent が claim する | 成果物カタログから計画される                          |
| 単位       | task（任意の粒度）                                  | 成果物 × フェーズ（done_criteria と rulebook を持つ） |
| 順序の根拠 | 依存グラフ（agent が張る）                          | CPM（人が設計した timeline と catalog から導出）      |
| 完了の判定 | gates / tests / stamps                              | done_criteria + review 観点                           |

Gas Town は**創発的**である。agent が仕事を見つけて掲示板へ投稿し、別の agent が拾う。SpecDojo は**計画的**である。何を作るかを人がカタログで宣言し、そこから機械的にタスクが導出される。SpecDojo で並列に流れるのは、人が「これを作る」と決めた成果物だけであり、agent がタスクを増やすことはない。

人の関与点も異なる。SpecDojo は事前（計画）に重心があり、Gas Town は事後（監査）にある。

| 観点         | Gas Town              | SpecDojo                                                   |
| ------------ | --------------------- | ---------------------------------------------------------- |
| 並列実行     | 中核。数十〜数百      | 持つが中核ではない。既定は 1                               |
| 仕事の発生源 | agent（Wanted Board） | 人（成果物カタログ）                                       |
| 人の関与点   | 台帳の監査（事後）    | 計画（事前）と review（事後）、register なら承認（実行時） |
| 理解の拠り所 | 台帳の legibility     | 成果物文書と grade                                         |

### 1.5. SpecDojo にも同じ負債がある

負債の置き場所を変えているだけで、消してはいない。

schedule 経路で夜間に無人実行すれば、翌朝には知らない変更が入る。構造は Gas Town と同じである。`--loop --max_rounds 100` を無人で回せば、レビューされない成果物が積み上がる。実際 `rtn-exec-cycle` は `enabled: false` のままで、本プロジェクトでも常用していない。

違いは 2 点ある。

- **生成物が文書である。** コードは読まなければ分からないが、成果物は人が読むために書かれた文書であり、差分を読むこと自体が理解の回復になる。
- **grade で劣化が測られる。** 無人実行で品質が落ちれば score と findings に出る。Gas Town の理解の負債は破綻するまで指標に現れにくい。

ただし文書の維持負担そのものが SpecDojo の負債である。[[prj-0001:pjr-36qg-competitive-landscape-and-release]] は「劣位」に体系の維持負担を挙げており、kata の要修正は 58%（[[prj-0001:pjr-2w38-sample-quality-observation]]）である。**文書が腐れば、文書を正本とする設計の根拠が崩れる。**

### 1.6. 観測として残す判断

どちらが正しいかは決められない。速度が要る場面、仕様が明確な場面では Gas Town が勝つ。判断が要る場面、長く保守する場面では承認と計画を挟む方式が効く。優劣ではなく何を最適化するかの違いである。

本 note は判断を下さず、対比を記録するに留める。位置づけを見直すときに、誤った対比（逐次 vs 並列）へ戻らないための記録とする。

## 2. 背景・文脈

利用者から「Gas Town は task をどんどん起票して依存関係で多数の agent が一気に進める思想か。理解の負債が積み上がって最終的に管理できない仕組みになるのではないか」という問いがあり、調査して整理した。

その過程で「SpecDojo も schedule に落とせば並列実行できるので二面性がある」という指摘を受け、当初の対比が誤りであることが判明した。訂正を含めて記録する。

## 3. フォローアップ

- `rtn-exec-cycle` を有効化する場合、無人実行した成果物をいつ誰が読むかを決める必要がある。決めずに回すと Gas Town と同じ負債を抱える。
- [[prj-0001:pjr-2zvs-grade-review-integration]] の決定（review フェーズで grade を実行し verdict を合成する）は、この負債への対処として働く。無人実行の成果物が review を経る経路が確立される。
- 位置づけ（[[prj-0001:pjr-e8tt-initial-release-positioning]]）では、並列実行を差別化として主張しない。中核ではなく、Gas City に規模で先行されている。

## 4. 関連ドキュメント

- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]
- [[prj-0001:pjr-e8tt-initial-release-positioning]]
- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-2w38-sample-quality-observation]]
- `docs/ja/projects/prj-0001/routines/rtn-exec-cycle.yaml`
- <https://yegge.ai/gastown>
