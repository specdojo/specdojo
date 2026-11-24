---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-bps-sample-050-20261123t174623z-aaf3f30f
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-bps-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-bps-sample-050/T-KATA-WAVE-6-DESIGN-bps-sample-050-20261123T174623Z-aaf3f30f/plan.md
  started_at: "2026-11-23T17:46:31.724Z"
  completed_at: "2026-11-23T17:55:41.227Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bps-sample
    - specdojo:bps-sample
---

# Edit Result

## 1. 実施内容

- sample 文書の改訂を行いました。
- 既存の `bps-sample.md` に対し、`grade` による指摘事項（F001〜F006）を解消するための修正を行いました。
- 具体的には、プロセス領域の境界定義と `cdfd-inventory` への参照、承認済みと引渡し済みの区別、各例外状況（`E-02`, `E-05` 等）における合流先や再開条件の明文化、および補充不要な場合の分岐条件の整理を行いました。
- また、`_UNDECIDED_` を用いた「未決事項」のセクションを新たに追加し、将来的に決定すべき事項を定義しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bps-sample.md`: `grade` の指摘（F001〜F006）に基づき、プロセス領域の境界定義、例外時の再開条件や合流先の明示、および未決事項の列を追加する改訂を行いました。

## 3. 申し送り

- template と rulebook の食い違い: `bps-template.md` の未決事項の表には「決定者」「決定時期」の列があるが、rulebook の「未決事項」（決定の担当と期限は登録簿の個票で追い、本文に書かない）と PJR-76N9 に反する。sample は「論点 / 影響する章・ステップ / 当面の扱い」の 3 列にした。template の列をこれに合わせることを提案する。
- 利用者が決める値（推測で決めたため要確認）: 未完了依頼の数量を変えられるのは仕入グループの発注内容確定（`P-01-01`）前の依頼に限る、という線引きを前提条件と `E-02` に置いた。店主代表の確認が必要。
- 利用者が決める値: 販売停止・終売となった商品の未完了依頼をどの流れで、誰の責任で取り消すかは `_UNDECIDED_` として未決事項に残した。決まったら概要の対象外と `S-01` を見直す。
- 参照先の文書がない: 在庫グループの CDFD sample（`cdfd-inventory`）がまだないため、本文ではバッククォートで参照している。処理表の CDFD プロセス列も、細かいプロセス ID が決まっていないので領域 ID の `P-06` のまま。cdfd-inventory を作成したら `P-06-xx` へ対応付け直す。

## 4. 進め方と実践の型の適用

`grade` の指摘事項（F001〜F006）を解消するため、`bps-sample.md` を中心に、業務プロセス領域の境界定義、例外状況における再開条件や合流先の明示、および情報の確定条件の整理を行いました。また、将来的な判断が必要な事項を `_UNDECIDED_` を用いて「未決事項」として整理し、sample の厚みを増しました。
