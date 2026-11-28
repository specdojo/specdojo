---
specdojo:
  id: prj-0001:xer-t-kata-review-all-trc-requirements-to-tests-sample-140-20261125t135722z-a0e47cd1
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-140/T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-140-20261125T135722Z-a0e47cd1/plan.md
  started_at: "2026-11-25T13:57:31.053Z"
  completed_at: "2026-11-25T14:24:28.416Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:trc-requirements-to-tests-sample
    - specdojo:trc-requirements-to-tests-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、trc sample の事実を正本（prj-success-criteria-and-acceptance-criteria-sample、stc-sample、tsp-index-sample）と突き合わせ、食い違いを直した。
- 母集団に SC-07・SC-09・AC-05 の 3 行を `未着手` で追加し、母集団を 11 件、サマリを未着手 6・合計 11 に直した。
- 対象外を SC-02〜SC-06・SC-08・SC-10 に直した。
- 母集団外の参照の表に stc-sample の TR-06・TR-07 を足し、件数を 6 にした。
- 性能試験の方針の説明を、tsp-index-sample が性能を総合テストの出口条件に入れている事実に合わせて直した。
- ギャップと対応方針に SC-09・AC-02・AC-05 をまとめた行（`atc-stock-credit-check`）と SC-07 の行を足し、取消の行の判定条件を直した。
- F001 の対象列は、この版ですでに各項目に要求文書 ID が付き、区切りもそろっていたため解消済みで、追加の修正はしていない。
- 検証は prettier 整形、markdownlint、runner の lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、test:docs、validate:schema がすべて成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md`: 母集団に SC-07・SC-09・AC-05 を追加して 11 件にし、サマリと対象外を正本に合わせた。母集団外の参照に stc の TR-06・TR-07 を足して 6 件にした。性能試験の方針の記述を tsp-index-sample と整合させた。ギャップと対応方針に `atc-stock-credit-check` の行と SC-07 の行を足し、取消の行の判定条件を直した。

## 3. 申し送り

- 性能を分冊 `trc-requirements-to-tests-performance` で扱う方針は、共通サンプル文脈の中で置いた仮定であり、採るかどうかは人が決める。
- ギャップと対応方針の SC-07 の直し方は、正本の裏付けがない対応方針なので、人が確かめる。
- 変更履歴の生成元の版（`4f9e2c1`・`b83d0a7`）は架空の版で正本がなく、確かめられなかった。
- [R4/vp-qe-verifiability] 母集団が prj-success-criteria-and-acceptance-criteria-sample の初期受入の必須（SC-01・SC-07・SC-09・AC-01〜AC-05）と合わず SC-07・SC-09・AC-05 が欠けていた。3 行を `未着手` として足し、母集団を 11 件、サマリを未着手 6・合計 11 に直した。
- [R4/vp-arc-technical-constraints] 対象外の SC-02〜SC-06 を正本どおり SC-02〜SC-06・SC-08・SC-10 に直した。
- [R4/vp-qe-verifiability] 「性能試験は受入判断に使わず 1 ケースだけ測る方針（tsp）」は、性能（`SAC-PERF-01`〜`04`）を総合テストの出口条件に入れている tsp-index-sample と食い違っていた。性能は分冊 `trc-requirements-to-tests-performance` で扱う、単体テストは要求項目でなくモジュールを確かめる段階、という理由に直した。分冊に分ける方針は共通サンプル文脈の中で置いた仮定であり、採るかどうかは人が決める。
- [R4/vp-dev-testability] stc-sample の TR-06・TR-07（`sac-sample` の `SAC-PERF-02`・`SAC-PERF-01`）が母集団外の参照の表に漏れていたので 2 行足し、件数を 6 に直した。
- [R4] ギャップと対応方針に SC-09・AC-02・AC-05 をまとめた行（`atc-stock-credit-check`）と SC-07 の行を足し、取消の行の判定条件を「母集団が 12 件になる」に直した。SC-07 の直し方は正本の裏付けがない対応方針なので、人が確かめる。
- [F001] ギャップと対応方針の対象列は、この版ではすでに各項目に要求文書 ID が付き、区切りも コンマと空白（「,」の後に空白） にそろっていた（解消済み）。
- 確かめられない主張: 変更履歴の生成元の版（`4f9e2c1`・`b83d0a7`）は架空の版で正本がないため、確かめの対象外とした。
- 適用外の検証: `npm run validate:history-links`（変更したのは samples 配下の sample だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の主張（母集団の項目、対象外、母集団外の参照、サマリ件数、性能試験の方針）を正本の sample と突き合わせ、誤りを直した。確かめられなかった主張は、生成元の版だけである。F001 は前の段で解消済みと確認した。rulebook と矛盾する変更はしておらず、frontmatter の `status` は `draft` のまま据え置いた。
