---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sf-index-sample-150-20261126t095842z-67d8adcb
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sf-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sf-index-sample-150/T-KATA-REVIEW-ALL-sf-index-sample-150-20261126T095842Z-67d8adcb/plan.md
  started_at: "2026-11-26T09:58:52.931Z"
  completed_at: "2026-11-26T10:07:54.534Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sf-index-sample
    - specdojo:sf-index-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `sf-index-sample` を見直した。個別仕様 `sf-sample` との相互参照の未照合を、未決事項 `Q-01` に明記した（F004）。
- 未決事項の表の後に、再照合のきっかけと影響先を 1 段落で追加した（F002）。きっかけは BPS・画面・個別仕様の作成・改訂、機能の追加・廃止・統合である。影響先は一覧行・機能構成、機能分割・コンポーネント設計、画面・実装、業務データ辞書、店番の操作手順、テスト対象である。本システムは生成処理を持たないため、生成処理は影響先から外した。
- F003 は前の段で「承認とするかシステムで拒否するかは `Q-02` で未決」と追記済みのため、今回は変更していない。
- F001（PJR への引継ぎ先・担当）は kata の段のレビューから外す観点のため扱っていない。
- 相手側 `sf-sample` を直す案が 1 件ある（`status` が ready のため人の判断が必要）。
- 検証では、executor が実行した prettier と markdownlint が成功した。runner が実行した `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 4. 未決事項（`Q-01`） | 個別仕様の `specdojo:sf-sample` は上位一覧を `sf-index`（未作成）とし、`SF-POS-01` との対応を未確定としている。本例の `Q-01` には、この食い違いの記載がなかった。 | `Q-01` の論点に `sf-sample` 側の未確定を足した。当面の扱いには「上位一覧は本一覧の `SF-POS-01` とみなし、同仕様の `Q-01` の解消時に相互参照を確定する」を足した。 | vp-qe-kata-conformance（grade F004） | - |
| R5-2 | R5 | 4. 未決事項 | 再照合のきっかけが BPS・画面の作成時だけだった。機能の追加・廃止・統合や仕様改訂のときに、機能 ID から辿る影響先がなかった。 | 表の後に、きっかけと影響先を 1 段落で足した。本システムは生成処理を持たないため、生成処理を影響先から外す理由も書いた。 | vp-dev-change-impact（grade F002）、sf-index-rulebook の「未決事項」 | - |
| R5-3 | R5 | 3. システム化機能一覧（個別仕様の列）と `sf-sample` の「目的と概要」 | 相手側の `sf-sample` は上位一覧を `sf-index`（未作成）と仮置きしたままで、`sf-index-sample` と往復できない。 | 相手側の `docs/ja/specdojo/samples/sf-sample.md` の 15 行目を `[[specdojo:sf-index-sample\|システム化機能一覧（全体構成）]]` への参照に変える。あわせて、その `Q-01` から `sf-index` の対応という論点を外す。本タスクでは変更していない。`sf-sample` は `status` が ready のため、人が判断する。 | - | 要判断 |
| R5-4 | R5 | 2. 機能構成（つけの行） | 上限超過時の販売可否が、人の判断として確定済みと読める。 | 前の段で「承認とするかシステムで拒否するかは `Q-02` で未決」が追記済みのため、変更していない。 | vp-qe-omissions-consistency（grade F003） | - |
| R5-5 | R5 | 4. 未決事項 | grade F001（PJR への引継ぎ先・担当）は、R5 の観点ではない。 | - | vp-pm-control-reporting。kata-guide「kata の観点の組」の除外表 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sf-index-sample.md`: 未決事項 `Q-01` に、`sf-sample` が上位一覧を未作成と仮置きしている食い違いを追記した。当面の扱いには、`SF-POS-01` とみなして `sf-sample` 側の `Q-01` 解消時に相互参照を確定すると書いた。表の後には、再照合のきっかけと影響先（一覧行・機能構成、機能分割・コンポーネント設計、画面・実装、業務データ辞書、店番の操作手順、テスト対象）の段落を追加した。表の列幅も整形した。

## 3. 申し送り

- `sf-sample` は `status` が ready のため、相手側の修正（R5-3 の案）は変更せず、人の判断に委ねた。
- grade の F001 は、kata-guide の「kata の観点の組」で kata の段のレビューから外す観点のため扱っていない。必要なら別の段か管理記録側で扱う。
- R5-1: R5 / 4. 未決事項（Q-01） / 個別仕様の specdojo:sf-sample は上位一覧を `sf-index`（未作成）とし SF-POS-01 との対応を未確定としているが、本例の Q-01 にその食い違いがなかった / Q-01 の論点に sf-sample 側の未確定を、当面の扱いに『上位一覧は本一覧の SF-POS-01 とみなし、同仕様の Q-01 の解消時に相互参照を確定する』を足した / vp-qe-kata-conformance（grade F004） / -
- R5-2: R5 / 4. 未決事項 / 再照合のきっかけが BPS・画面の作成時だけで、機能の追加・廃止・統合や仕様改訂のときに機能 ID から辿る影響先がなかった / 表の後に、きっかけ（BPS・画面・個別仕様の作成・改訂、機能の追加・廃止・統合）と影響先（一覧行・機能構成、機能分割・コンポーネント設計、画面・実装、業務データ辞書、店番の操作手順、テスト対象）を 1 段落足し、生成処理は持たないため外す理由も書いた / vp-dev-change-impact（grade F002）、sf-index-rulebook の「未決事項」 / -
- R5-3: R5 / 3. システム化機能一覧（個別仕様の列）と sf-sample の「目的と概要」 / 相手側の sf-sample は上位一覧を `sf-index`（未作成）と仮置きしたままで、sample の sf-index-sample と往復できない / - / 相手側 docs/ja/specdojo/samples/sf-sample.md の 15 行目を [[specdojo:sf-index-sample|システム化機能一覧（全体構成）]] への参照に変え、その Q-01 から sf-index の対応という論点を外す案。sf-sample は status ready なので人が判断する / 要判断
- R5-4: R5 / 2. 機能構成（つけの行） / 上限超過時の販売可否が人の判断として確定済みと読める（grade F003） / -（前の段で『承認とするかシステムで拒否するかは Q-02 で未決』が追記済みのため変更なし） / vp-qe-omissions-consistency / -
- R5-5: R5 / 4. 未決事項 / grade F001（vp-pm-control-reporting: PJR への引継ぎ先・担当）は kata-guide の「kata の観点の組」で kata の段のレビューから外す観点のため扱わない / - / kata-guide『kata の観点の組』の除外表 / -

## 4. 進め方と実践の型の適用

根拠にしたのは、grade の finding（F001〜F004）、`sf-index-rulebook` の「未決事項」、kata-guide の「kata の観点の組」、相手側の `sf-sample` である。F004 と F002 は sample 側を修正して解消した。F003 は前の段で解消済みのため維持した。F001 は kata のレビューから外す観点のため見送り、理由は handoff に記した。相手側 `sf-sample` の修正は、sample 側だけを直す方針に従って案の提示にとどめた。
