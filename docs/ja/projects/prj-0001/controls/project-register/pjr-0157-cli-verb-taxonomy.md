---
specdojo:
  id: prj-0001:pjr-0157-cli-verb-taxonomy
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-08-31"
  completed_at: "2026-08-07T12:00:00Z"
  conclusion: 生成系動詞を整理し破壊的リネームを実施。exec build→exec refresh、catalog generate→deliverable scaffold(独立サブコマンド)へ改名し、schedule buildは据え置き。用語標準をguideへ明文化、コード・lefthook・docs・tests・schemaを更新、旧名はエラー化。全819テスト成功。オーケストレーターSSOT+4ラッパーも同期済み。
  register_events:
    - v: 1
      id: reg_395ecd7947d97f5ba29a5163a49624fa
      ts: "2026-08-07T02:25:18Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "chore(register): PJR-0157をdoneでクローズ"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: CLI生成系動詞の用語整理と破壊的リネーム
        - field: description
          from: ""
          to: CLI の生成系動詞が多義・重複しており、とくに `exec build`（揮発的な実行状態の算出）と `catalog build`（派生ビュー生成）で `build` が別レイヤに並び、`catalog scaffold`（カタログ生成）と `catalog generate`（成果物本体生成）も語と意味が対応していない。生成系動詞を `scaffold`（起点）/ `build`（派生物）/ `refresh`（揮発状態）/ `run`（実行）の4語へ整理し、用語標準を明文化したうえで、破壊的リネームを一括で実施する（未公開プロジェクトのためエイリアスは設けない）。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 10e97c369f69d47515dea8c0df226b21427cc03d
    - v: 1
      id: reg_43020ebd6f2606648beb89af2a6b00eb
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: done
        - field: description
          from: CLI の生成系動詞が多義・重複しており、とくに `exec build`（揮発的な実行状態の算出）と `catalog build`（派生ビュー生成）で `build` が別レイヤに並び、`catalog scaffold`（カタログ生成）と `catalog generate`（成果物本体生成）も語と意味が対応していない。生成系動詞を `scaffold`（起点）/ `build`（派生物）/ `refresh`（揮発状態）/ `run`（実行）の4語へ整理し、用語標準を明文化したうえで、破壊的リネームを一括で実施する（未公開プロジェクトのためエイリアスは設けない）。
          to: exec build→exec refresh、catalog generate→deliverable scaffoldへ改名し、生成系動詞(scaffold/build/refresh/run)の用語標準を明文化する
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-08-31"
        - field: conclusion
          from: "-"
          to: 生成系動詞を整理し破壊的リネームを実施。exec build→exec refresh、catalog generate→deliverable scaffold(独立サブコマンド)へ改名し、schedule buildは据え置き。用語標準をguideへ明文化、コード・lefthook・docs・tests・schemaを更新、旧名はエラー化。全819テスト成功。オーケストレーターSSOT+4ラッパーも同期済み。
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_395ecd7947d97f5ba29a5163a49624fa
    - v: 1
      id: reg_4ecc661794bb46ce9d16271dd6cd6af8
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-08-07"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_43020ebd6f2606648beb89af2a6b00eb
---

# PJR-0157 CLI生成系動詞の用語整理と破壊的リネーム

## 1. 概要

exec build→exec refresh、catalog generate→deliverable scaffoldへ改名し、生成系動詞(scaffold/build/refresh/run)の用語標準を明文化する

CLI の生成系動詞が多義・重複しており、とくに `exec build`（揮発的な実行状態の算出）と `catalog build`（派生ビュー生成）で `build` が別レイヤに並び、`catalog scaffold`（カタログ生成）と `catalog generate`（成果物本体生成）も語と意味が対応していない。生成系動詞を `scaffold`（起点）/ `build`（派生物）/ `refresh`（揮発状態）/ `run`（実行）の4語へ整理し、用語標準を明文化したうえで、破壊的リネームを一括で実施する（未公開プロジェクトのためエイリアスは設けない）。

## 2. 完了条件

- 生成系動詞の用語標準（`scaffold`/`build`/`refresh`/`run` の定義・判定軸・object 一覧）が SSOT として明文化されている。
- `exec build` が `exec refresh` に改名され、旧名は残さない（ヘルプ・出力・docs すべて更新）。
- `catalog generate` が `deliverable scaffold`（独立サブコマンド・object 明示）に改名され、旧名は残さない。
- `schedule build` は据え置き（strategy → sch-track の committed 派生物生成として `build` を維持）。
- コード・`lefthook.yml` の hook 名（`exec-build`）・`build-command.ts` の umbrella 連鎖・スクリプト・docs・tests のすべての参照が新名へ更新されている。
- `npm run build` / `lint:ts` / `lint:md` / `validate:catalog` / `npm test` が成功する。
- 旧名（`exec build` / `catalog generate`）を実行するとエラーになる（残存参照がない）。

## 3. 作業内容

| No  | 作業                                                                              | 担当 | 状態 | メモ                                                         |
| --- | --------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------ |
| 1   | 用語標準を明文化（`scaffold`/`build`/`refresh`/`run` の定義・判定軸・現行対応表） | ARC  | open | 新規 standard または `cli-overview-guide` に節追加           |
| 2   | `exec build` → `exec refresh` の実装（コマンド定義・ヘルプ・出力文言）            | ARC  | open | `src/exec-*.ts`。staleness 警告文言も更新                    |
| 3   | `catalog generate` → `deliverable scaffold`（独立サブコマンド）へ改名             | ARC  | open | `src/catalog-generate.ts` ほか。object を deliverable に明示 |
| 4   | `lefthook.yml` の `exec-build` hook・`build-command.ts` の umbrella 連鎖を更新    | ARC  | open | hook 名と subArgs/label                                      |
| 5   | docs 一括更新（command-reference・各 guide・quick-start・kata 等）                | ARC  | open | `exec refresh` / `deliverable scaffold` へ                   |
| 6   | tests 更新（`exec build`/`catalog generate` 参照を新名へ）                        | ARC  | open | `tests/**`                                                   |
| 7   | 検証（`npm run build` / `lint:ts` / `lint:md` / `validate:catalog` / `npm test`） | ARC  | open | 旧名の残存参照が無いことを grep で確認                       |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:waza-guide]]
- [[specdojo:schedule-design-guide]]
- `docs/ja/specdojo/references/command-reference.md`
- `src/build-command.ts`
- `src/exec-schedule.ts`
- `src/catalog-generate.ts`
- `lefthook.yml`
