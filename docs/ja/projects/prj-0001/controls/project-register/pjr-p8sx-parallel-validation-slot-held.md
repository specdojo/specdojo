---
specdojo:
  id: prj-0001:pjr-p8sx-parallel-validation-slot-held
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  registered_at: "2026-11-25T09:21:32Z"
---

# PJR-P8SX 並列実行で親の検証の枠が、他タスクの統合に止められて長く占有される

## 1. 課題内容

`exec run --auto --parallel 4` で全件レビュー（PJR-0BGE）を流すと、1 件のタスクがちょうど 4 分おきにしか終わらず、並列度を上げても速くならない。

- 親の検証の枠（`parent_validation_concurrency: 1`）を 1 件が約 4 分持ち続ける。内訳は `validate-schema` が毎回約 190 秒、`lint-md-changed` などの lint が約 40 秒（`parent-validation-metrics.jsonl`、2026-11-25 01:54〜03:33 の 25 件）。
- 同じ `npm run validate:schema` の各段を task の worktree で直接流すと、合わせて約 5 秒で終わる。親のリポジトリで流しても約 23 秒。
- 同じ時間帯に、他のタスクの統合の commit が約 53 秒おきに 3 回ずつ並ぶ（commit の hook の時間）。
- 見立て: 1 つのプロセスで並べて流すため、他のタスクの統合（spawnSync の git commit と hook）がイベントループを止め、検証の子プロセスが終わっても runner が気づくのが遅れて、枠を手放せない。PJR-6690 で直したパイプ詰まりと同じ種類の残り。見立ては計測で確かめる。

## 2. 入力

- 利用者の判断（2026-11-25）: 全件レビューの区切りまでは設定も runner も変えずに流し、原因は issue として起票して後で直す

## 3. 影響範囲

- 並列実行の処理量が、1 時間に約 15 件で頭打ちになる。全件レビュー（515 件）では、agent に余裕があっても残りに 1 日以上かかる。
- 並列度を上げると統合の回数が増え、かえって遅くなるおそれがある。
- 親の検証を使う exec run のすべて（register・track）にかかわる。

## 4. 対応方針

- 全件レビューの区切りまでは設定も runner も変えずに流す（利用者の判断、2026-11-25）。
- 枠を持っている間の時間を計測で分ける（子プロセスの実際の時間と、runner が気づくまでの遅れ）。
- 遅れが確かめられたら、統合などの同期の処理が検証の終わりの検出を止めないように直す。直し方は executor に決めさせ、理由を個票の対応結果に書かせる。
- 直した後に `exec run --auto --parallel 4` を流し、検証の時間が直接流した場合と近くなることを確かめてから close する。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
