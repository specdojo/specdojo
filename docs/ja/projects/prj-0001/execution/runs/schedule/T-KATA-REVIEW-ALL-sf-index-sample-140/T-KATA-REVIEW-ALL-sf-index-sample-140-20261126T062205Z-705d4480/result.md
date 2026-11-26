---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sf-index-sample-140-20261126t062205z-705d4480
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sf-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sf-index-sample-140/T-KATA-REVIEW-ALL-sf-index-sample-140-20261126T062205Z-705d4480/plan.md
  started_at: "2026-11-26T06:22:16.562Z"
  completed_at: "2026-11-26T06:29:10.389Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sf-index-sample
    - specdojo:sf-index-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として sf-index-sample の主張16件を、cdfd-overview・prj-overview・prj-scope・sf-sample・bps-sample・uis-sample・rulebook・schema と突き合わせた。
- 不一致は1件だった。「システム化機能一覧」の表の後の注記が、つけ販売の回復条件の正本を sf-sample としていた。sf-sample はつけ販売（`P-04`）を対象外としているため、この記述は誤りだった。
- この1件を sample の54行目で直した。確かめの表は executor の最終応答にある。このレポートの evidence には含まれていない。
- runner の検査では、lint-md-changed、lint-fm-changed、lint-mermaid、lint-d2、test-docs、validate-schema が passed だった。
- executor が実行しなかった `npm run lint:md` は、親 runner の結果を正とする。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | docs/ja/specdojo/samples/sf-index-sample.md 54行目（「システム化機能一覧」の表の後の注記） | 販売とつけ販売の両方について、回復条件の正本を sf-sample としていた。sf-sample の22行目はつけ販売（`P-04`）を対象外としており、記述が事実と食い違っていた。 | 正本とするのを店頭商品販売の回復条件だけに改め、つけ販売の回復条件は未定（`Q-03`）と直した。 | sf-sample.md の対象外の行を grep で読み取った。 | 修正済み |
| 2 | R4 正しさ | docs/ja/specdojo/samples/sf-sample.md 15行目・139行目 | 上位一覧を `sf-index`（未作成）としているが、sf-index-sample は既にあり、事実と食い違う。F004 と同じ件である。 | sf-sample 側で sf-index-sample への参照に直す案。この段では編集していない。 | executor の突き合わせ。sf-sample.md の該当行と、sf-index-sample が存在することを照合した。 | R5（整合）へ申し送り |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sf-index-sample.md`: 「システム化機能一覧」の表の後の注記を直した。回復条件の正本を sf-sample とするのは店頭商品販売の分だけに限った。sf-sample が対象外とするつけ販売の回復条件は、未定（`Q-03`）と改めた。差分は1行の変更。

## 3. 申し送り

- grade の F001〜F004 は、この段（R4）の観点ではないため扱っていない。executor の整理では、F001（`vp-pm-control-reporting`）は kata のレビューで使わない観点、F002（`vp-dev-change-impact`）と F004（`vp-qe-kata-conformance`）は R5、F003（`vp-qe-omissions-consistency`）は R2 の観点である。
- F003 については、機能構成表に「`Q-02` で未決」と既に書いてあり、解消済みに見えるというのが executor の所見である。
- 指摘: 「システム化機能一覧」の表の後の注記が、販売とつけ販売の両方について回復条件の正本を [[specdojo:sf-sample]] としていた。sf-sample の22行目はつけ販売（`P-04`）を対象外とするため、正本とするのを店頭商品販売の回復条件だけに改め、つけ販売の回復条件は未定（`Q-03`）と直した。確かめ方は sf-sample.md の対象外の行を grep で読み取った。
- 指摘（相手側を直す案）: docs/ja/specdojo/samples/sf-sample.md の15行目と139行目は上位一覧を `sf-index`（未作成）としているが、sf-index-sample は既にあり事実と食い違う。sf-sample 側で [[specdojo:sf-index-sample]] への参照に直す案。grade の F004 と同じ件で、R5（整合）に任せる。
- 確かめの表のうち確かめられなかった主張: 「販売管理 CLI を接点に含めない」は正本のない仮定で、共通サンプル文脈とは食い違わない。「個別仕様が成果物カタログに未登録」を確かめるには、適用先のプロジェクトの成果物カタログが要る。
- grade の F001〜F004 は R4 の観点ではないので扱っていない。F001（`vp-pm-control-reporting`）は kata のレビューで使わない観点。F002（`vp-dev-change-impact`）と F004（`vp-qe-kata-conformance`）は R5、F003（`vp-qe-omissions-consistency`）は R2 の観点。F003 は機能構成表に「`Q-02` で未決」と既に書いてあり、解消済みに見える。

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の事実主張を schema・各 sample・rulebook と突き合わせた。誤りは1件で、sf-sample.md の対象外の行を読み取って裏づけ、最小の差分で直した。確かめられなかった主張は2件ある。「販売管理 CLI を接点に含めない」は正本のない仮定で、共通サンプル文脈とは食い違わない。「個別仕様が成果物カタログに未登録」は、適用先の成果物カタログがないため確かめていない。frontmatter の `status` は `draft` のまま据え置いた。
