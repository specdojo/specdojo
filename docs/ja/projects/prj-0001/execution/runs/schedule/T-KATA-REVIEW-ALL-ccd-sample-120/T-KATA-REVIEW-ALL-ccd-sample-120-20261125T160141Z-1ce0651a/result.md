---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ccd-sample-120-20261125t160141z-1ce0651a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ccd-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ccd-sample-120/T-KATA-REVIEW-ALL-ccd-sample-120-20261125T160141Z-1ce0651a/plan.md
  started_at: "2026-11-25T16:01:50.770Z"
  completed_at: "2026-11-25T16:12:25.480Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:ccd-sample
    - specdojo:ccd-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）のレビューとして `docs/ja/specdojo/samples/ccd-sample.md` を見直した。1章の小節 1.1 と 1.2 を統合し、目的の段落と箇条書き 3 項目に再構成した。
- 2〜5章は rulebook の本文構成（図、関連表と整合性条件、辞書対応、未解決事項の順）に沿っており、前提から結論の順に読めるため維持した。CCD の template は not-needed のため、rulebook のみと照合した。
- grade の F001 と F002 は、現行版の `based_on` に `specdojo:bdd-sample` があるため解消済みと確認した。顧客辞書は未作成のため `based_on` に含めていない。
- 検証は、executor の `npx prettier --check` と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。ts、integration、typecheck などは変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 1. 目的と適用範囲（旧 1.2. 識別と辞書の境界） | 1 段落だけの小節 1.2 が、1.1 の辞書参照の項目と同じ論点（対象範囲と辞書の境界）を別の小節に分けており、粒度が細かすぎる。さらに末尾の一文が 4章・5章の内容を先回りして言い直している。 | 1.2 の「図には主キーだけを示し、販売単価・数量などの定義は同辞書とその参照先を正本とする」を 1.1 の 2 項目めの末尾へ移し、4章を先回りする一文を削った。小節が 1 つだけになるため 1.1 の見出しもなくし、1章を目的の段落と箇条書き 3 項目にした。 | vp-arc-document-structure（rulebook の本文構成「目的と適用範囲」の内容・受入条件） | 要判断 |
| R2-2 | R2 | 2. 概念クラス図〜5. 未解決事項 | 章の順と表・本文の配置は rulebook の本文構成（図、関連表と整合性条件、辞書対応、未解決事項）と合っており、前提から結論の順に読める。CCD の template は not-needed のため、rulebook だけと照合した。 | - | vp-arc-document-structure、vp-qe-omissions-consistency | - |
| R2-3 | R2 | frontmatter（`based_on`） | grade の F001・F002（`based_on` に `specdojo:bdd-sample` がない）は、現行版に `specdojo:bdd-sample` があり解消済みである。 | - | vp-qe-omissions-consistency、vp-qe-kata-conformance（CCD rulebook の「推奨 Frontmatter 項目」） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ccd-sample.md`: 1章の小節 1.1 と 1.2 を統合した。1.2 にあった「図には主キーだけを示し、販売単価・数量などの定義は同辞書とその参照先を正本とする」を 1.1 の 2 項目めの末尾へ移した。4章を先回りする一文は削った。小節が 1 つだけになるため見出しをなくし、1章を目的の段落と箇条書き 3 項目にした。差分は 1 行追加、7 行削除。

## 3. 申し送り

- R2-1 は「要判断」の印を付けた。1.1 の見出し「対象領域と扱う時点」は、扱う時点を示す目印にもなる。選ばなかった案は、1.2 だけを 1.1 に統合して 1.1 の見出しを残す構成である。これは小節が 1 つだけ残るため採らなかった。
- R2-1: R2 / 1. 目的と適用範囲（旧 1.2. 識別と辞書の境界） / 1 段落だけの小節 1.2 が 1.1 の辞書参照の項目と同じ論点（対象範囲と辞書の境界）を別の小節に分けており、粒度が細かすぎる。さらに末尾の一文が 4章・5章の内容を先回りして言い直している / 1.2 の『図には主キーだけを示し、販売単価・数量などの定義は同辞書とその参照先を正本とする』を 1.1 の 2 項目めの末尾へ移し、4章を先回りする一文を削った。小節が 1 つだけになるため 1.1 の見出しもなくし、1章を目的の段落と箇条書き 3 項目にした / vp-arc-document-structure（rulebook の本文構成『目的と適用範囲』の内容・受入条件） / 要判断（迷った理由: 1.1 の見出し『対象領域と扱う時点』は扱う時点を示す目印にもなる。選ばなかった案: 1.2 だけを 1.1 に統合して 1.1 の見出しを残す。小節が 1 つだけ残る構成になるため採らなかった）
- R2-2: R2 / 2. 概念クラス図〜5. 未解決事項 / 章の順・表と本文の配置は rulebook の本文構成（図→関連表と整合性条件→辞書対応→未解決事項）と合っており、前提から結論の順に読める。CCD の template は not-needed のため、rulebook だけと照合した / - / vp-arc-document-structure、vp-qe-omissions-consistency / -
- R2-3: R2 / frontmatter（`based_on`） / grade の F001・F002（`based_on` に specdojo:bdd-sample がない）は、現行版に specdojo:bdd-sample があり解消済み / - / vp-qe-omissions-consistency、vp-qe-kata-conformance（CCD rulebook の『推奨 Frontmatter 項目』） / -

## 4. 進め方と実践の型の適用

sample-maintenance の R2（構成）として、rulebook の本文構成「目的と適用範囲」の内容と受入条件を正として章の粒度と配置を照合した。粒度が細かすぎた 1章の小節を統合し、2〜5章は構成が合っているため維持した。F001 と F002 は `based_on` の `specdojo:bdd-sample` により解消済みと確認した。rulebook など sample 以外は変更していない。
