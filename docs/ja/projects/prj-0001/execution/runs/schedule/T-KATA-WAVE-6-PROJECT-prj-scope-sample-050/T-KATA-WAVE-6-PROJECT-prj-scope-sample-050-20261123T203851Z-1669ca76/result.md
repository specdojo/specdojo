---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-prj-scope-sample-050-20261123t203851z-1669ca76
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-prj-scope-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-prj-scope-sample-050/T-KATA-WAVE-6-PROJECT-prj-scope-sample-050-20261123T203851Z-1669ca76/plan.md
  started_at: "2026-11-23T20:39:01.494Z"
  completed_at: "2026-11-23T20:46:57.068Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-scope-sample
    - specdojo:prj-scope-sample
---

# Edit Result

## 1. 実施内容

- sample 文書 `docs/ja/specdojo/samples/prj-scope-sample.md` を、共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くしました。
- grade の指摘事項（F001〜F008）に基づき、スコープ変更の影響評価に関する記述、関係者の定義、対象期間の判定基準、業務範囲とシステムの整合性、H1 直後の導入文、役割の表記ゆれ、および略語（DEC）の補足を実施しました。
- 利用者が決定すべき事項（初期リリース日やオフライン時の扱いなど）を `_UNDECIDED_` として適切に残しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-scope-sample.md`: 共通サンプルとしての厚みを出すため、H1 直後の導入文の追加、対象業務への「廃棄」の追加、スコープ変更時の影響評価に関する詳細な記述、関係者の定義（店主代表、`PO`、`BA`）の整理、および判定基準（`SC-02` への参照）を追記しました。また、略語「DEC」を「決定記録（DEC）」へと補足しました。

## 3. 申し送り

- 利用者が決める値として残したもの: 初期リリースの具体的な日付（`_UNDECIDED_`、初期リリースの計画で決定）、オフライン時の運用を初期スコープに含めるか（`_UNDECIDED_`）、初期リリースと2週間の判定を繁忙期の前に終えるという前提（`_ASSUMPTION_`、プロジェクト概要に合わせた）。
- 第1章の関係者表と第6章の承認者の行は、文書の役割の割り当てではなく、スコープ変更の判断者というスコープの中身として PO/BA を書いた（PJR-76N9 の対象外と判断）。
- rulebook に合わせて直すべき点はない。
- 利用者が決める値として残したもの: 初期リリースの具体的な日付（`_UNDECIDED_`、初期リリースの計画で決定）、オフライン時の運用を初期スコープに含めるか（`_UNDECIDED_`）、初期リリースと2週間の判定を繁忙期の前に終えるという前提（`_ASSUMPTION_`、プロジェクト概要に合わせた）。

## 4. 進め方と実践の型の適用

rulebook に基づき、`docs/ja/specdojo/samples/prj-scope-sample.md` を「駄菓子屋のプロジェクト」という文脈における完成例として補強しました。grade の指摘内容を解消するため、影響評価の項目、役割（`PO`, `BA`）の定義、成功基準の判定基準、業務範囲の整合性、および文書の構造（導入文の有無）を修正しました。未決定事項については `_UNDECIDED_` を用いて示しています。
