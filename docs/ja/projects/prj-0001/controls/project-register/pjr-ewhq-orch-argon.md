---
specdojo:
  id: prj-0001:pjr-ewhq-orch-argon
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-02T23:07:23Z"
  due_on: "2026-11-30"
---

# PJR-EWHQ Antigravity の orchestrator に Gemini 4 Argon の起動スクリプトを足す

## 1. 概要

specdojo init と config scaffold が Antigravity 用に配る起動スクリプトに orch:argon と orch:argon:work（gemini-4-argon-medium、worktree argon-work）を足し、このリポジトリの package.json にも同じスクリプトを足す。orch:flash は残す

## 2. 入力

- agy に Gemini 4 Argon が追加され、agy models で gemini-4-argon-high・gemini-4-argon-medium・gemini-4-argon-low を確かめた（agy 1.4.12、2026-11-03）
- 利用者は、orchestrator を性能の良い argon で npm run orch:argon と npm run orch:argon:work から立ち上げたい。配る雛形にも反映する案 B を選んだ（2026-11-03）
- 強さは medium とする。orch:sol は -m gpt-6.1-sol で、.codex/config.toml の `model_reasoning_effort` = medium が効いており、argon も medium にそろえる。性能が足りなければ high に変える（2026-11-03 の対話で合意）
- worktree は argon-work とする。orch:flash:work は agy-work を使っており、同じ名前だと同時に立ち上げたときに worktree を取り合う
- 雛形では orch:argon を足し、orch:flash は残す（既存の利用者の手順を壊さないため。orchestrator の推奨）

## 3. 完了条件

- `specdojo init` と `specdojo config scaffold` が Antigravity 用に配る起動スクリプトに、`orch:argon` と `orch:argon:work` が加わっている。`orch:argon` は `orch:flash` と同じ書き方（`orchestrator launch --provider antigravity`、`--add-dir`、入口の指示の渡し方）で、モデルは `gemini-4-argon-medium` とする。`orch:argon:work` は `tools/worktree/open-agent-worktree.sh` で worktree `argon-work` に立ち上げる
- 既存の `orch:flash` と `orch:flash:work` は変えず、残す。ほかの provider のスクリプトも変えない
- 単体テスト（`tests/src/shared/provider-scaffold.test.ts`、`tests/src/commands/init.test.ts` など、既存の orch のスクリプトを確かめているもの）で、`orch:argon` と `orch:argon:work` が配られることを確かめる
- README の provider と起動スクリプトの表に `orch:argon` を足す。CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない
- このリポジトリのルートの `package.json` は保護されたファイルのため executor は変えない。足すべき 2 行の案を個票の対応結果に書き、報告の `handoff` にも書く。反映は統合の後に orchestrator が利用者の承認のもとで行う（承認済み）
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の検証が通る
- 統合の後に、orchestrator がルートの `package.json` に 2 行を足し、`npm run orch:argon` と `npm run orch:argon:work` で立ち上がることを利用者が terminal で確かめる（executor の作業ではない）

## 4. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ |
| --- | ----------------------------------------------------- | ---- | ---- | ---- |
| 1   | 配る雛形に orch:argon と orch:argon:work を足す       | ARC  | open | -    |
| 2   | テスト・README・CHANGELOG を合わせる                  | ARC  | open | -    |
| 3   | ルートの package.json の案を対応結果と handoff に書く | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- `README.md`
- `templates/` の Antigravity 用の雛形
