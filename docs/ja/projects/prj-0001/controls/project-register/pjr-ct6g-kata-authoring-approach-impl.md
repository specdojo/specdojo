---
specdojo:
  id: prj-0001:pjr-ct6g-kata-authoring-approach-impl
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-22T13:50:38Z"
  derived_from:
    - PJR-V2W5
---

# PJR-CT6G kata を新しく作る approach（rulebook-authoring など）を実装する

## 1. 概要

PJR-V2W5 の決定に従い、rulebook-authoring など 4 つの approach、--target の 1 つ目に新しい kata の id と 2 つ目以降に手本の成果物を書く指定、利用者のリポジトリ単位の kata の authority、カタログの undecided の参照の付け替えを実装する

## 2. 完了条件

- v0.4.3 の範囲とする（2026-10-22 に起票、2026-10-23 に利用者が v0.4.3 に含めることを承認）。[[prj-0001:pjr-v2w5-kata-authoring-approach]] の決定内容に従う。
- `APPROACHES` に `rulebook-authoring`・`recipe-authoring`・`sample-authoring`・`template-authoring` を加え、`register add`・`register update` の `--approach` で指定できる。
- `--target` の 1 つ目を新しく作る kata の id、2 つ目以降を手本にする成果物の doc id（任意、カタログにある成果物）とする。1 つ目の id が既にある場合は `<種類>-maintenance` を案内して止め、id の末尾が種類と合わない場合と、2 つ目以降がカタログの成果物でない場合も、起票と実行の時点で止める。
- `exec run --register` は、これらの approach の plan に、従う作り方の規則（`<種類>-authoring-standard`）、手本の成果物、作る kata の置き場所を載せ、手本の成果物そのものは変えないことを条件に入れる。
- 利用者のリポジトリでの kata の authority を設定のキーで指定でき（キーの名前と既定は設計で決め、理由を result に書く）、`specdojo:` の id での新しい kata の作成は、本リポジトリ（SpecDojo 自身）以外では止める。利用者 authority の kata は利用者のリポジトリだけから解決する。置き場所を決め、`kata list`・`kata show` で表示できる。
- 追加（2026-10-23、オーケストレーターの確認で判明。PJR-V2W5 の P2 の名前空間を、規則の用語にそろえる）: 利用者の kata の所有元を表す設定のキーと文書の言葉を、規則（[[specdojo:id-and-file-naming-standard]]・[[specdojo:practice-system-composition-guide]]）の用語の「authority」にそろえる。設定のキーは `kata_namespace` ではなく `kata_authority` とし、ガイド・リファレンス・テスト・CHANGELOG の「名前空間」の言葉も authority にそろえる。authority の形式（英小文字・数字・ハイフン、`prj-` で始めない、`specdojo` を使わない）を設定の検証で確かめる。
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

- `rulebook-authoring`・`recipe-authoring`・`sample-authoring`・`template-authoring` を追加し、register の起票時と実行時に新規 kata ID、種類別の末尾、重複、手本成果物を検証するようにした。
- リポジトリ全体の設定キーを `kata_authority`、利用者 kata の配置を `docs/ja/kata/{rulebooks,recipes,samples,templates}/` とした。既定値は元リポジトリのディレクトリ名を正規化した値とし、worktree でも同じ authority を保つ。project 単位ではなくリポジトリ単位で共有でき、同梱の `specdojo:` kata と衝突しないためである。設定値は英小文字・数字・ハイフンに限定し、`prj-` で始まる値と `specdojo` を拒否する。
- authoring plan に執筆標準、新規配置、読み取り専用の手本、`undecided`・未記入だけを更新する参照条件を載せた。既存参照と `not-needed` は上書きせず result へ申し送る。
- `kata list`・`kata show` が利用者 authority の kata を解決できるようにし、ガイド、コマンド・設定リファレンス、執筆標準、CHANGELOG を更新した。
- authoring は register 専用とした。Schedule の成果物単位 target では「新規 kata ID + 0 件以上の手本」を区別できないため、strategy profile は用意せず plan 生成時に拒否する。
- 単体テストに approach・対象・authority・解決規則・plan 契約を追加し、統合テストに一時リポジトリでの rulebook 新規作成とカタログ参照更新を追加した。実装上の残課題はない。統合後の完了確認は PJR-JSEY で行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v2w5-kata-authoring-approach]]
- [[specdojo:kata-guide]]
