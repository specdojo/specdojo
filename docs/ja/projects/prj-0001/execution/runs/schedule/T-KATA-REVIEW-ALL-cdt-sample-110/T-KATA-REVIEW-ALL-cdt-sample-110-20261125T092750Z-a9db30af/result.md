---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdt-sample-110-20261125t092750z-a9db30af
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdt-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdt-sample-110/T-KATA-REVIEW-ALL-cdt-sample-110-20261125T092750Z-a9db30af/plan.md
  started_at: "2026-11-25T09:28:00.449Z"
  completed_at: "2026-11-25T09:45:07.386Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdt-sample
    - specdojo:cdt-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）として `cdt-sample` を確認し、文書づくりの役割分担にあたる記述を業務の利用者と判断の記述に置き換えた。また、商品区分の表示名が分類名と同じであることを足した。
- F001 は本文で既に解消済みで、kata レビューでは使わない観点（`vp-ops-operability`）のため R1 では変更していない。
- 検証は prettier、markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` がいずれも成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdt-sample.md`: 概要の「主担当ロール」（文書づくりの役割分担）を「利用者と判断」に置き換え、店主代表と家族利用者代表の使い方を書いた。3.1. 商品区分の選定の表の後に、表示名が分類名と同じである旨を 1 文足した。差分は 3 行追加、1 行削除。

## 3. 申し送り

- R1 の指摘は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R1-1 | R1 | 1. 概要 / 主担当ロール | 文書づくりの役割分担（BA が判断境界を整理し、QE が境界事例を確認する）が書かれており、Sample 記述標準の禁止事項に当たる。rulebook の要件「誰がどの判断に使うか」は業務の利用者として残す必要がある。 | 「利用者と判断: 店主代表が区分の意味と各商品の分類を決める。家族利用者代表は仕入れや店番で区分を参照し、決められた補充方針に沿って補充する。」に置き換えた。 | `vp-qe-kata-conformance`（Sample 記述標準、`cdt-rulebook` の概要の要件） | - | | R1-2 | R1 | 3.1. 商品区分の選定 | スタンドアロン定義で 3 区分とも表示名が分類名と同じだが、rulebook が求める「表示名が分類名と同じならその旨を示す」記述がない。 | 表の後に「商品区分の表示名は分類名と同じとする。」を足した。 | `vp-qe-kata-conformance`、`vp-po-purpose-alignment` | - | | R1-3 | R1 | 3.2.2. 区分を変更する場合 | F001（棚札の貼り替えの責任）は、本文の「店番担当は店頭の棚札表示を新しい取扱区分に合わせて貼り替える」で既に解消している。kata-guide の「kata の観点の組」では `vp-ops-operability` を kata のレビューで使わないため、R1 の指摘にしない。 | 変更なし | kata-guide「kata の観点の組」 | - | | R1-4 | R1 | 3.2.2. 区分を変更する場合 | 商品ごとの区分の変更手続きは、rulebook のスタンドアロン定義で必ず書く内容の外にある。ただし業務目的の「棚札の表記ゆれ防止」と「季節商品を定番と同じ基準で補充する誤りの防止」に直接寄与するため残した。選ばなかった案は、節を消して変更時の扱いを商品台帳の運用へ委ねること。これだと変更時の棚札・発注点の扱いが失われ、判断材料が欠けるため採らなかった。 | 変更なし | `vp-arc-single-responsibility`、`vp-po-purpose-alignment` | 要判断 |
- R1-1: R1 / 1. 概要 / 「主担当ロール」に文書づくりの役割分担（BA が判断境界を整理し、QE が境界事例を確認する）が書かれており、Sample 記述標準の禁止事項に当たる。一方で rulebook の概要の要件『誰がどの判断に使うか』は業務の利用者として残す必要がある / 「利用者と判断: 店主代表が区分の意味と各商品の分類を決める。家族利用者代表は仕入れや店番で区分を参照し、決められた補充方針に沿って補充する。」に置き換えた / `vp-qe-kata-conformance`（Sample 記述標準の記述ガイドと禁止事項、cdt-rulebook の本文要件の概要） / -
- R1-2: R1 / 3.1. 商品区分の選定 / スタンドアロン定義で 3 区分とも表示名が分類名と同じなのに、rulebook の『値の業務的意味と使い分けの要件』が求める『表示名が分類名と同じならその旨を示す』記述がない / 表の後に「商品区分の表示名は分類名と同じとする。」を足した / `vp-qe-kata-conformance`、`vp-po-purpose-alignment` / -
- R1-3: R1 / 3.2.2. 区分を変更する場合 / grade の F001（`vp-ops-operability`、棚札の貼り替えの責任）は、本文の『取扱区分の変更適用日までに、店番担当は店頭の棚札表示を新しい取扱区分に合わせて貼り替える』で既に解消している。kata-guide の『kata の観点の組』で `vp-ops-operability` は kata のレビューでは使わないとしているため、R1 の指摘としては扱わない / - / kata-guide『kata の観点の組』、`vp-ops-operability` は使わない / -
- R1-4: R1 / 3.2.2. 区分を変更する場合 / 商品ごとの区分の変更手続きは、rulebook のスタンドアロン定義で必ず書く内容（値・名前・成立条件・重なり時の優先）の外にある。ただし業務目的の『棚札の表記ゆれ防止』と『季節商品を定番と同じ基準で補充する誤りの防止』に直接寄与するため残した / - / `vp-arc-single-responsibility`、`vp-po-purpose-alignment`。選ばなかった案: 節を消して変更時の扱いを商品台帳の運用へ委ねる。変更時の棚札・発注点の扱いが失われ、業務目的の判断材料が欠けるため採らなかった / 要判断

## 4. 進め方と実践の型の適用

sample-maintenance の進め方で、参照の向きを「成果物 → sample」に切り替えて `cdt-sample` を見直した。根拠にしたのは、`cdt-rulebook` の本文要件、Sample 記述標準、kata-guide の R1 の定義と「kata の観点の組」である。rulebook と矛盾する記述はなかった。rulebook の要件を満たすため、表示名の同一性を足し、役割分担の記述を業務の利用者の記述に直した。F001 は本文で解消済みと確認し、R1 の観点に当たらないため変更していない。区分変更の節（3.2.2.）は残したが、要判断として申し送った。根拠不足で見送った finding はない。
