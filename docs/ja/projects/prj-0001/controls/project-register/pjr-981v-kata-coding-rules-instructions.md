---
specdojo:
  id: prj-0001:pjr-981v-kata-coding-rules-instructions
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T13:17:54Z"
  block_reason: "executor reported incomplete: コーディング規約の型（`cdr`）の rulebook・sample・template を作り、観点定義と成果物リファレンスに登録し、個票の対応結果を書いた。完了条件の `grade run --target kata` は sandbox で agent CLI を起動できないため未実施。"
  derived_from:
    - PJR-SJ3Q
  commit_type: docs
  commit_scope: kata
---

# PJR-981V 実装の段の型として、agent 向けのコーディング規約（言語別の instructions）の型を作る

## 1. 概要

rulebook・sample・template を初期整備し、正本と環境別のラッパーの作り方を定める

## 2. 入力

- PJR-SJ3Q の結論（indie が 2026-11-15 に決定）: 実装の段の型は、agent 向けのコーディング規約（言語別の instructions）の 1 種類だけにする。実装の設計書は置かない
- 手本は prj-0001 の .github/instructions/typescript.instructions.md と vitest.instructions.md。正本は .github/instructions/`<言語>.instructions.md`、環境別（.claude/rules、AGENTS.md など）は薄いラッパーにする

## 3. 完了条件

- 型の rulebook・sample・template を作り、成果物カタログの型として使える（frontmatter で sample・template を宣言する）。recipe の要否も決めて宣言する。
- rulebook に、正本の置き場所（`.github/instructions/<言語>.instructions.md`）と、環境別の薄いラッパー（`.claude/rules/*.md` の `@` 読み込み、`AGENTS.md` からの参照など）の作り方を書いている。
- 中身は最低限に絞る: 基本方針・モジュールと import・型・エラー処理・命名・テストと検証のコマンド・禁止事項。手本は prj-0001 の `typescript.instructions.md`・`vitest.instructions.md`。
- 実装の方針（使う言語・ライブラリ）は技術スタックの定義（tsd）と設計の段の文書に任せ、この型では扱わないことを書いている。
- sample は共通サンプル文脈（駄菓子屋）の言語で 1 つ作り、ほかの言語・枠組み（Next.js、Unity の C# など）でも同じ型から作れる。
- 型を `grade run --target kata` で grade し、pass である。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | rulebook を作る（正本とラッパーの作り方を含む） | ARC  | open | -    |
| 2   | sample・template を作る                         | ARC  | open | -    |
| 3   | 型を grade する                                 | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-sj3q-implementation-phase-kata]]
