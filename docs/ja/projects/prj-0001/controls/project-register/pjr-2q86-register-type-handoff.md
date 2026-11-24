---
specdojo:
  id: prj-0001:pjr-2q86-register-type-handoff
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T01:52:50Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T03:46:35Z"
  conclusion: register に種類 handoff を足した。章は引き継ぎ元と先・有効な承認の範囲・進行中・判断待ち・注意点で、exec と夜の実行の対象から外し、一覧に受け取り待ちの handoff を分けて出す view を足した
  derived_from:
    - PJR-5RY7
  depends_on:
    - PJR-5RY7
  commit_type: feat
  commit_scope: register
---

# PJR-2Q86 register に新しい種類 handoff を足す

## 1. 概要

PJR-5RY7 の決定のとおり、受け取ったら close する種類 handoff を足す。template・pjr-rulebook・一覧と view・exec と夜の実行の除外を含む

## 2. 入力

<!-- 対話で得た前提・制約・委任範囲を記録する。完了・回答の判定条件とは分ける。 -->

-

## 3. 完了条件

- register に新しい種類 `handoff` を足す（PJR-5RY7 の決定）。状態は open と done で、終わりの状態は done とする。`register add --type handoff` と `register close` が使える。
- 個票の template を足し、章は PJR-5RY7 の「決定内容」の表のとおり（引き継ぎ元と先・有効な承認の範囲・進行中・判断待ち・注意点）にする。
- `pjr-rulebook` の type 別の扱いに `handoff` を足す（いつ起票し、いつ close するか、判断待ちを `question` として別に起票すること）。
- `exec run --register` と夜の実行（`orchestrator night`）の対象から外す（note・epic と同じ扱い）。外したことを単体テストで確かめる。
- 一覧と view（`register build` の生成物）に `handoff` が出る。開いている handoff を一目で見つけられるようにする（例: 状態ごとの view）。
- register の schema（type の enum など）を直し、既存の個票の検査が通ることを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`CLAUDE.md`・`AGENTS.md` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 関連する設計・ガイド・CLI リファレンスを直す。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`・`npm run validate:schema` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                                           | 担当 | 状態 | メモ                                                                  |
| --- | ---------------------------------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------------- |
| 1   | type `handoff` と状態の制限（`open` / `done`）を CLI と schema に足す                          | DEV  | done | `src/register/item.ts`・`core.ts`・`update.ts`、register-item schema  |
| 2   | 個票の template `pjr-handoff-template.md` を足す                                               | DEV  | done | 章は PJR-5RY7 の決定内容の表のとおり                                  |
| 3   | `pjr-rulebook` の type 別の扱いに `handoff` を足す                                             | DEV  | done | 本文構成・終端基準・例外的な追跡終了・生成一覧の表                    |
| 4   | 生成ビュー `generated/pjr-handoffs.md` を足し、一覧の派生ビューの案内と docs-site の目次に足す | DEV  | done | template `pjr-handoffs-template.md`、`pjr-index-template.md`、sidebar |
| 5   | exec と夜の実行から外れることを単体テストで確かめる                                            | DEV  | done | 既存の許可リストで外れる。テストに `handoff` を足した                 |
| 6   | 登録簿運用ガイド・CLI リファレンス・設定リファレンス・クイックスタートを直す                   | DEV  | done | -                                                                     |
| 7   | 静的検査と単体テストを通す                                                                     | DEV  | done | 関係する単体テストを実行。全件と lint・typecheck は親の検証で流す     |

## 5. 対応結果

### 5.1. 実施内容

- `VALID_TYPES` に `handoff` を足し、種類ごとに取りうる状態の表 `ITEM_TYPE_ALLOWED_STATUSES`（`handoff` は `open` と `done`）と、書き込み前に止める `assertStatusAllowedForType` を足した。`register add` は起票前（`validateFields`）、状態遷移と `register update` は `applyItemUpdate` の入口で検査する。`register close` は既定で `done` にする。
- register-item schema の `ItemType` に `handoff` を足し、`item_type: handoff` のとき `item_status` を `open` / `done` に限る条件を足した。
- 個票の template `pjr-handoff-template.md`（引き継ぎ元と先・有効な承認の範囲・進行中・判断待ち・注意点・関連ドキュメント）を足した。
- `register build` が `generated/pjr-handoffs.md` を生成するようにし、受け取り待ち（`open`）と受け取り済み（`done`）を分けて表示する。template は `pjr-handoffs-template.md`。
- `exec run --register`（`registerItemCategory`）と夜の実行（`selectApprovedNightItems`）は許可リストで選ぶため、コードの変更なしで `handoff` は外れる。外れることを単体テストに足した。
- commit type の既定の対応に `handoff: docs` を足した。
- `pjr-rulebook`・登録簿運用ガイド（「セッションの引き継ぎを handoff で受け渡す」の節を新設）・CLI リファレンス・設定リファレンス・クイックスタートを直した。

### 5.2. 決めた点と理由

- `handoff` の状態は `open` と `done` だけに限り、`start` / `wait` / `review` / `reject` / `defer` と `close --status decided` を個票・event を書く前にエラーにした。理由: PJR-5RY7 は状態を「受け取り待ち」と「受け取った」の 2 つと決めており、例外終端を許すと「開いている handoff = まだ読まれていない引き継ぎ」が崩れるため。読まれずに古くなった引き継ぎも、次に読んだ主体が close する。
- 開いている handoff の見つけ方は、状態別ビューへの追加ではなく専用の生成ビュー `generated/pjr-handoffs.md` にした。理由: 状態別ビューの `open` にはほかの種類が混ざり、一目で見つけにくいため。
- 実行対象の判定は既存の許可リストのままにし、`handoff` を足す変更はしなかった。理由: 新しい種類は既定で外れる作りで、除外の表を別に持つと二重管理になるため。
- `reopen` は他の種類と同じく `open` へ戻せる（`in-progress` などを指定すると状態の制限でエラーになる）。

### 5.3. CHANGELOG に書く事項

- 区分: Added
- 文案: `register` に新しい種類 `handoff` を追加。セッションや LLM を切り替えるときの引き継ぎを起票し、受け取ったら `register close` で `done` にする。状態は `open` と `done` だけで、`exec run --register` と `orchestrator night` の対象外。`register build` が受け取り待ちと受け取り済みの一覧 `generated/pjr-handoffs.md` を生成する。

### 5.4. 残課題

- 進行中と判断待ちを組み立てて起票する `specdojo orchestrator handoff` と、playbook・オーケストレーターの指示の修正は、PJR-5RY7 の後続のもう 1 件の todo で扱う。
- 保護された設定の変更は不要だった。

## 6. 関連ドキュメント

- [[prj-0001:pjr-5ry7-register-handoff-type|PJR-5RY7 handoff の決定]]
- [[specdojo:pjr-rulebook|プロジェクト登録簿 作成ルール]]
- [[specdojo:pjr-handoff-template|handoff の個票 template]]
- [[specdojo:pjr-handoffs-template|handoff の一覧 template]]
- [[specdojo:register-operation-guide|登録簿運用ガイド]]
- [[specdojo:command-reference|CLIコマンドリファレンス]]
