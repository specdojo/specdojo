---
specdojo:
  id: prj-0001:pjr-981v-kata-coding-rules-instructions
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
  registered_at: "2026-11-15T13:17:54Z"
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
- 型の grade（`grade run --target kata`）は orchestrator が統合の後に流す。executor は grade を実行せず、作業内容の「型を grade する」の行を open のまま残し、理由をメモに書く。grade を流せないことを未完了の理由にしない（2026-11-17、1 回目の実行が grade を流せず止まったため改めた）。
- 2 回目の実行（2026-11-17）: orchestrator の型の grade（run `grade-981v-20261117`）で、rulebook が needs-work（score 78）、sample と template は pass だった。次を直す。
  - F003・F009（major）: Frontmatter の表で `specdojo.rulebook` を「推奨」としているのを「必須」にし、値を `specdojo:cdr-rulebook` と明示する。ドキュメントメタ情報標準と `deliverable-frontmatter.schema.yaml` に合わせる。
  - F010: rulebook の禁止事項の方針と `cdr-sample` の禁止事項・導入文の書き方を合わせる。F011: 「Next.js の上の TypeScript」を、言語に枠組みの規則を足す関係が伝わる表現にする。
  - ほかの minor（F001・F002・F004〜F008・F012・F013）は、直すかどうかを executor が決め、理由を個票の対応結果に書く。章や確認項目を足して文書を大きくするより、既存の記載の言い換え・統合で済むものを優先する（PJR-0T83）。
  - 型の grade は今回も orchestrator が統合の後に流す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ                                                                                                      |
| --- | ----------------------------------------------- | ---- | ---- | --------------------------------------------------------------------------------------------------------- |
| 1   | rulebook を作る（正本とラッパーの作り方を含む） | ARC  | done | `cdr-rulebook` を作成し、観点の `document_kinds` と成果物リファレンスへ登録した                           |
| 2   | sample・template を作る                         | ARC  | done | `cdr-sample`（TypeScript・Next.js）と `cdr-template` を作成した                                           |
| 3   | 型を grade する                                 | ARC  | open | 完了条件どおり executor は grade を実行しない。`grade run --target kata` は orchestrator が統合の後に流す |

## 5. 対応結果

実施内容と成果物:

- [[specdojo:cdr-rulebook]] を作成した。正本の置き場所（`.github/instructions/<言語>.instructions.md`）、環境別のラッパー（Claude Code の `.claude/rules/<言語>.md` の `@` 読み込み、`AGENTS.md` の参照節、`GEMINI.md` の `@` 読み込み）の作り方、本文の必須章、実装の方針を `tsd`・設計の段に任せることを書いた。
- [[specdojo:cdr-sample]]（駄菓子屋きぬやの TypeScript・Next.js）と [[specdojo:cdr-template]] を作成し、rulebook の frontmatter で宣言した。
- `pm-review-viewpoints.yaml` の `vp-ba-business-value` の `exclude` と `vp-arc-single-responsibility` の `confirmed_default` へ `specdojo:cdr-rulebook` を追加した。成果物リファレンスに「実装」の節を足し、以降の節番号を繰り下げた。

executor が決めた点と理由:

- 接頭辞は `cdr`（Coding Rules）とした。成果物のファイル名は `<言語>.instructions.md` で接頭辞を持たないため、型の識別だけに使う短い名前にした。成果物の `id` は `.` を使えないため `<言語>-instructions` とした。
- `deliverable_type` は `architecture` とした。技術スタックの定義（`tsd`）と同じ技術の決まりの系統に置くのが近いため。
- recipe は `not-needed` とした。入力は `tsd` とリポジトリの設定（`package.json`・lint 設定）で、問いで集める情報がないため。
- 正本の frontmatter は、トップレベルに Copilot の `applyTo`、`specdojo:` 配下に SpecDojo の項目を置く形にした。template の `frontmatter_template` に `applyTo: _APPLY_TO_` を兄弟キーとして置き、生成物のトップレベルへ展開する。
- 成果物カタログには、グループの `base_path` を `/.github/instructions` にして正本を登録し、ラッパーは載せない。
- `vp-ba-business-value` は、規約が業務価値ではなく実装の書き方を扱うため除外した。`vp-arc-single-responsibility` は既定（適用する）のままとした。

残課題:

- `grade run --target kata` による grade（作業内容の 3）は、完了条件どおり orchestrator が統合の後に流し、pass を確認する。
- prj-0001 の既存の `.github/instructions/typescript.instructions.md` は `applyTo` が `{src,tools,tests,scripts}/**/*.ts`、ラッパーの `.claude/rules/typescript.md` は `paths` が `{src,tools}/**/*.ts` で、rulebook の「適用範囲を同じ glob にする」規則とずれている。また既存の正本には `specdojo:` の frontmatter がない。本タスクの対象外のため変更せず、型に合わせる対応を別の登録簿項目で扱うことを提案する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-sj3q-implementation-phase-kata]]
