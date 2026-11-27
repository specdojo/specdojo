---
specdojo:
  id: prj-0001:pjr-zfca-exec-release-force-orchestrator-idle-claim
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
  registered_at: "2026-11-26T22:16:41Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-E189
---

# PJR-ZFCA exec release の --force を、動いていない run の claim に限ってオーケストレーターに許す

## 1. 概要

PJR-E189 の決定（候補 A）を実装する。specdojo-orchestrator の --force は、claim を持つ run が動いていないと CLI が確かめられるときだけ通し、判定できないときは断る。--reset-worktree と --all-blocked は利用者の承認を得て使う運用のまま。

## 2. 入力

- PJR-E189 で候補 A を採った（indie、2026-11-26）
- いまの CLI は、--force を人の actor のときだけ通す（src/exec/events.ts の canOverrideCrossActor）
- 2026-11-26 に、opus-executor が claim したまま止まった review 9 件と imp-interface-140 を、indie が --force で戻した
- 担当 DEV・期限 2026-12-31 は indie の指示（2026-11-26）

## 3. 完了条件

- `exec release --force` を、actor が `specdojo-orchestrator` のときも、次の条件をすべて満たす場合に通す（PJR-E189 の候補 A）。
  - claim を持つ run が動いていないと CLI が確かめられる。判定には、その task の run の lock・記録した PID・`src/exec/stop-request.ts` の `isProcessAlive` など、既にある手段を使う。どの手段で何を見るかは executor が決め、理由を個票の対応結果に書く。
  - 判定できない（lock や PID の記録がない、読めないなど）ときは、今と同じく断る。断るときのメッセージに、動いているか判定できなかった理由と、人が `--force` で戻せることを書く。
  - run が動いていると判定したときは断り、その run の PID と task を示す。
- 人の actor の `--force` の動きは変えない。`specdojo-orchestrator` 以外の agent の actor は、今と同じく `--force` を通さない。
- `--reset-worktree` と `--all-blocked` は、`specdojo-orchestrator` が使う場合も今の扱いを変えない（利用者の承認を得て使う運用のまま。CLI で止める必要はない）。
- `exec release` を `specdojo-orchestrator` が `--force` で通した場合は、イベントの記録から、オーケストレーターが動いていない run の claim を戻したと分かる（理由の文など）。
- 単体テストで、動いていない run の claim を `specdojo-orchestrator` の `--force` で戻せること、動いている run と判定できない run では断ることを確かめている。
- コマンドリファレンスとオーケストレーターの運用の説明（`docs/ja/specdojo/` の該当箇所）に、この条件を書いている。配布するオーケストレーターの本文（`.agents/`）は保護された設定のため変えず、変更案を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
