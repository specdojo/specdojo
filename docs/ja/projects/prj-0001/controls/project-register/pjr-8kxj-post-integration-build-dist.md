---
specdojo:
  id: prj-0001:pjr-8kxj-post-integration-build-dist
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-17T22:57:37Z"
  due_on: "2026-11-30"
---

# PJR-8KXJ exec run の統合の後に、src が変わったら dist を自動で作り直す

## 1. 概要

src を変える項目の統合の後に dist が古くなり次の run が止まるため、exec-defaults の pipeline に統合後の処理（post_integration）を許可リストの ID で指定できるようにし、build-dist を流す。

## 2. 入力

- 利用者の提案（2026-11-18）: dist を自動で作り直す処理は postprocess 等で指定する
- orchestrator の調べ（2026-11-18）: `parent_validations` は固定 ID の許可リストと paths で、executor の後・統合の前に親が流す。dist が src より古いことは src/shared/dist-freshness.ts が検出して run を止めるだけで、orchestrator が統合のたびに npm run build を手で挟んでいる
- 利用者の決定（2026-11-18）: `pipeline.post_integration` に ID（最初は build-dist = npm run build）と paths を書き、統合した変更が paths に当たるときだけ、親が exec のロックを持ったまま流す。失敗しても統合は戻さず、失敗を記録して次の run は dist-freshness の判定で止める。exec-defaults.yaml と package.json は保護された設定のため、反映は変更案として個票に書き、利用者の承認のもと feature ブランチで行う

## 3. 完了条件

- `exec-defaults.yaml` の `pipeline.post_integration` に、統合の後に親が流す処理を ID と `paths` で指定できるようにする。ID は `parent_validations` と同じく固定の許可リストで決め、最初は `build-dist`（`npm run build`）だけとする。任意のコマンドや引数は受け付けない。
- 処理は、統合した変更が `paths` に当たるときだけ、親が exec のロックを持ったまま、統合の commit の後に流す。同時に流れる run と重ならない。
- 失敗しても統合は戻さない。失敗を run の記録と出力に残し、次の run は `src/shared/dist-freshness.ts` の判定で止まる。成功・失敗・流さなかった理由（`paths` に当たらない）が run の記録で分かる。
- 設定の読み込み（未知の ID・型の誤り）、`paths` の判定、成功と失敗の扱いを単体テストで確かめる。
- prj-0001 の `exec-defaults.yaml` に `build-dist` を足す変更案（`paths` は `src/**` と `tsconfig*.json` を目安とする）を個票の対応結果に書く。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- 設計の変更を関係する文書（`docs/ja/specdojo/references/command-reference.md`・exec の設計書など）へ反映する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | `post_integration` の設定と許可リストを足す             | ARC  | open | -    |
| 2   | 統合の後に親が流す処理と、失敗時の記録を実装する        | ARC  | open | -    |
| 3   | 単体テストと文書を足し、`exec-defaults.yaml` の案を書く | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-1565-orchestration-queue]]
