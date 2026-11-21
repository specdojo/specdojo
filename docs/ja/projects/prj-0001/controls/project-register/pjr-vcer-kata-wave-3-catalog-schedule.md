---
specdojo:
  id: prj-0001:pjr-vcer-kata-wave-3-catalog-schedule
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-21T06:08:04Z"
  derived_from:
    - PJR-ABY4
---

# PJR-VCER 第 3 波の kata ドメインと strategy・schedule を用意する（試験の型 13 種類）

## 1. 概要

dct-kata.yaml を作って試験の型 13 種類の sample を成果物として載せ、kata-wave-3 の strategy と schedule を作る

## 2. 入力

- PJR-6998 の決定（2026-11-21、indie）: kata ドメイン（dct-kata.yaml、`base_path` /docs/ja/specdojo、グループ samples）に sample を kind: work の成果物として載せ、`local_id` は `<name>-sample`、rulebook は対応の型。代表は sample そのもの（駄菓子屋の共通の文脈）
- 2026-11-21 の試し（trial/prj-0001/kata-sample-catalog、commit せず捨てた）: dct-kata.yaml に tsp-index-sample と utc-sample を載せ、dct-index.yaml に domain kata を足すと、catalog validate・catalog build・index build・exec plan --deliverable utc-sample が通った。plan の targets は sample の frontmatter の ID（specdojo:utc-sample）になった
- PJR-ABY4 の範囲: 段は rulebook を簡潔に → sample を厚く → 簡潔さの確認（condense） → review → 人の確定。template は PJR-WYTX で扱う
- 2026-11-21 から opus で型の grade をし直している（run id regrade-kata-2026-11-21）。結果は docs/ja/projects/prj-0001/execution/grade/results/`specdojo.<name>-rulebook.yaml` と `specdojo.<name>-sample.yaml`
- agy（Antigravity）は使わない（PJR-5V0T）

## 3. 完了条件

- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml` を作り、`dct-index.yaml` に domain `kata` を足す。試験の型 13 種類（tsp-index・utc-index・utc・itc-index・itc・stc-index・stc・etc-index・etc・atc-index・atc・trc-requirements-to-tests・imp-test）の sample を、`kind: work`・`local_id: <name>-sample`・`rulebook: specdojo:<name>-rulebook` の成果物として載せる。
- 各成果物の `done_criteria` は、型に共通の条件（rulebook の章立てと必須の表に沿う、sample の作成標準と共通のサンプル文脈に沿う、rulebook の禁止事項に当たらない）を基本にし、型に固有の条件を足す。固有の条件は、grade のし直しの結果（`execution/grade/results/specdojo.<name>-rulebook.yaml` と `specdojo.<name>-sample.yaml` の findings）から、型ごとに大きい指摘を拾って書く。grade の結果がまだ無い型は、共通の条件だけにして対応結果に書く。
- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-wave-3.yaml` を作り、`schedule build --track kata-wave-3` で `sch-track-kata-wave-3.yaml` を生成する。track は手で編集しない。
- 段は PJR-ABY4 の範囲に従う（rulebook を簡潔に → sample を厚く → condense → review → 人の確定）。recipe のある型は、rulebook に合わせて recipe を直す段を足す。template の段は入れない（PJR-WYTX で扱う）。成果物が sample そのものなので、sample を整える段と成果物を磨く段が同じファイルを触る。どちらの approach で組むかは executor が決め、`exec plan --track kata-wave-3` の dry-run で、各段の plan の対象と手本が食い違わないことを確かめて対応結果に書く。
- 段ごとの agent は strategy の `phase_overrides[].agent` で決める。edit の段は `opus-executor`、review の段は `sol-review-executor`、reporter は `gemma26-reporter`、人の確定は利用者とする。agy の member は使わない。
- 先行の track の前例（`sch-strategy-kata-wave-1.yaml`・`sch-strategy-kata-slim-2.yaml`）の書き方に合わせる。
- この項目では schedule のタスクを実行しない。
- `npm run validate:schema`（strategy と track の YAML の `task_suffix` などの文字列が数値に変わっていないことを含む）・`npx specdojo catalog validate`・`npx specdojo exec validate`・`npm run lint:md` が通り、親の検証が通る。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に、利用者に影響が無いことを書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。

## 4. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ |
| --- | ------------------------------------------------- | ---- | ---- | ---- |
| 1   | `dct-kata.yaml` と `dct-index.yaml` の domain     | DEV  | open | -    |
| 2   | 13 種類の `done_criteria` を grade の結果から書く | DEV  | open | -    |
| 3   | strategy を作り、track を生成する                 | DEV  | open | -    |
| 4   | plan の dry-run で段の組み方を確かめる            | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
