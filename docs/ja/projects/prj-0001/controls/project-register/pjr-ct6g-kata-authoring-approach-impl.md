---
specdojo:
  id: prj-0001:pjr-ct6g-kata-authoring-approach-impl
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-22T13:50:38Z"
  block_reason: "agent exited with non-zero code: parent validation failed: lint-fm, typecheck, test-unit"
  derived_from:
    - PJR-V2W5
---

# PJR-CT6G kata を新しく作る approach（rulebook-authoring など）を実装する

## 1. 概要

PJR-V2W5 の決定に従い、rulebook-authoring など 4 つの approach、--target の 1 つ目に新しい kata の id と 2 つ目以降に手本の成果物を書く指定、利用者のリポジトリ単位の kata の名前空間、カタログの undecided の参照の付け替えを実装する

## 2. 完了条件

- v0.4.3 の範囲とする（2026-10-22 に起票、2026-10-23 に利用者が v0.4.3 に含めることを承認）。[[prj-0001:pjr-v2w5-kata-authoring-approach]] の決定内容に従う。
- `APPROACHES` に `rulebook-authoring`・`recipe-authoring`・`sample-authoring`・`template-authoring` を加え、`register add`・`register update` の `--approach` で指定できる。
- `--target` の 1 つ目を新しく作る kata の id、2 つ目以降を手本にする成果物の doc id（任意、カタログにある成果物）とする。1 つ目の id が既にある場合は `<種類>-maintenance` を案内して止め、id の末尾が種類と合わない場合と、2 つ目以降がカタログの成果物でない場合も、起票と実行の時点で止める。
- `exec run --register` は、これらの approach の plan に、従う作り方の規則（`<種類>-authoring-standard`）、手本の成果物、作る kata の置き場所を載せ、手本の成果物そのものは変えないことを条件に入れる。
- 利用者のリポジトリでの kata の名前空間を設定のキーで指定でき（キーの名前と既定は設計で決め、理由を result に書く）、`specdojo:` の id での新しい kata の作成は、本リポジトリ（SpecDojo 自身）以外では止める。利用者の名前空間の kata は利用者のリポジトリだけから解決する。置き場所を決め、`kata list`・`kata show` で表示できる。
- 手本にした成果物のカタログの参照のうち、作った種類のものが `undecided` か未記入なら、同じ実行で新しい kata の id に付け替える。別の kata を指している場合は付け替えず、result の申し送りに書く。
- schedule の approach として使えるようにするかを決め、理由を result に書く。
- [[specdojo:kata-guide]] と、コマンドリファレンス・設定リファレンスに、`bootstrap` との使い分けと使い方を書く。
- 単体テストで、approach と対象の検証、名前空間の検証、カタログの付け替えの条件を確かめる。統合テストで、一時のリポジトリで成果物を手本に rulebook を新しく作り、カタログの参照が付け替わることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- register と exec のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 3. 作業内容

| No  | 作業                                  | 担当 | 状態 | メモ   |
| --- | ------------------------------------- | ---- | ---- | ------ |
| 1   | kata を新しく作る approach を実装する | DEV  | open | v0.4.3 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v2w5-kata-authoring-approach]]
- [[specdojo:kata-guide]]
