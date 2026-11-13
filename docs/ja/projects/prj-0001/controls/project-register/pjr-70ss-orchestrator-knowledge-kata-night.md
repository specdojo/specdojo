---
specdojo:
  id: prj-0001:pjr-70ss-orchestrator-knowledge-kata-night
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-13T14:07:54Z"
  commit_type: docs
  commit_scope: orchestrator
---

# PJR-70SS オーケストレーターの本体と運用メモに、型の整備と夜間の実行の知見を書き足す

## 1. 概要

どのプロジェクトでも同じ振る舞いは specdojo-orchestrator の本体に、prj-0001 だけの運用は運用メモに書き足す

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 完了条件

- どのプロジェクトでも同じ振る舞いを、`.agents/specdojo-orchestrator.agent.md` に書き足す変更案を作っている。この本体は保護された設定のため executor は変えず、変更案（差分）を個票の対応結果と報告の `handoff` に書く。書き足す知見は次のとおり。
  - 型を整える schedule では、review の段とは別に、型そのもの（rulebook と sample の組）を grade して確かめる。
  - 裏で完了を待つときは、ログの文字列ではなく、終了コードや lock のファイルで判定する。ログを grep で読む場合はバイナリとして扱われないようにする。
  - 実行中の run が残した状態のファイルを、自分の commit に混ぜない。
  - 人の確定のタスクも claim と complete で記録し、確定したら成果物の `status` を ready に上げる。直すために確定を開き直すときは、`exec reopen` してから直す。
  - strategy の YAML を道具で書き直したときは、`task_suffix` などの文字列が数値に変わっていないかを schema のテストで確かめる。
- prj-0001 だけの運用を、[[prj-0001:pm-orchestrator-playbook]] に書き足している。
  - codex 2 本・agy 2 本の並べ方（`providers.<name>.max_concurrency` と `priority`）と、agy-opus と argon の使い分け。
  - 使用量の上限のときの代わり（sol → argon、sol-review → agy-opus-review）。
  - 文書サイトのビルドはメモリを多く使うため、並べた run と重ねない。
  - grade は一度に 1 本しか流せない。
  - 負荷で統合テストが時間切れになったら、手元で同じテストを流し直してから `--resume` する。
  - 0:00 の夜間の routine は、別の run が lock を持っていると skip され、流し直されない。夜に手で長い run を流すときは、routine とぶつからないかを先に確かめる。
  - 夜間の job の中で作られた子の run は、日中の `--resume` で plan が見つからないことがある。その場合の扱い（PJR-50CF が直るまでの回避策）。
- 回避策として書く項目には、直す側の登録簿の項目（PJR-J0VS・ZZVE・KVWH・50CF・97KE・36PW・5QJ5・V0FQ・52EE・5F1Y・7KXW・SW7T）を添え、直ったら消せるようにしている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更（オーケストレーターの本体の変更）を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                        | 担当         | 状態 | メモ |
| --- | ----------------------------------------------------------- | ------------ | ---- | ---- |
| 1   | 運用メモを書き足し、本体の変更案を書く                      | executor     | open | -    |
| 2   | 本体の変更案を feature ブランチで反映し、ラッパーを作り直す | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
