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

2 回目の実行（grade run `grade-981v-20261117` の指摘への対応）:

- F003・F009: Frontmatter の表で `specdojo.rulebook` を必須（○）にし、値 `specdojo:cdr-rulebook` を残した。
- F010: rulebook の禁止事項の要件を「破ると被害の大きい書き方と理由を表で書く。表に書いた禁止は本文の章で繰り返さない」に改め、sample の本文から表と重なる禁止（小数の金額、クライアントからの DB 接続の import、`as` の強制、ログへの個人情報、`@ts-ignore`）を外した。sample の導入文から版（Next.js 14・TypeScript 5）を外した（sample の F006 も同じ指摘）。
- F011: 「言語の規則に枠組みの規則を足す場合（TypeScript に Next.js の規則を足すなど）」に言い換えた。
- 直した minor（既存の行の言い換え・追記で済むもの）:
  - F004: 「正本」「ラッパー」の定義の箇条を削り、Copilot が `applyTo` で直接読むことを位置づけの表へ統合した。
  - F005: 適用範囲の分け方の行に、範囲が重なる場合は狭い方の正本に追加の規則だけを書き、広い方と矛盾させないことを足した。
  - F002・F006: `specdojo.supersedes` の行に、旧正本を `deprecated` にし同じ変更でラッパーと `AGENTS.md` の参照を付け替えることを足した。
  - F001・F012: Frontmatter の節の既存の段落に、`ready` にする条件（検証コマンドが実行でき、ラッパーで正本の読み込みを確かめた後）を 1 文で足した。
  - F007: ラッパーの規則の箇条に、環境ごとに対象のファイルで正本が読み込まれ、対象外では読み込まれないことを確かめる 1 行を足した。
  - F008: `型` を省けるのは動的型の言語で型ヒントも使わない場合に限ると明記した。
  - F013: ラッパーの節の導入文に、DEV が正本を直し ARC が設定・コマンドとの整合とラッパーの追従を確かめる分担を書いた。
- sample・template（どちらも pass）の minor も、1 行の修正で済むものを直した: template のエラー処理に「例外の握りつぶしの禁止」欄を追加、sample の相対 import の例を「2 階層以上」に修正、ESLint の規則の参照に設定ファイル名を付けて `import type` の再掲をやめた、単体テストの失敗時に仕様変更で期待値を直す条件を足した、統合テストの失敗時に CI の失敗を直せない場合の報告を足した。
- 直さなかった点: なし。章や確認項目の表を新設せず、すべて既存の行・段落の言い換えと追記で対応した（PJR-0T83）。

残課題:

- `grade run --target kata` による grade（作業内容の 3）は、完了条件どおり orchestrator が統合の後に流し、2 回目の修正で pass になるかを確認する。
- prj-0001 の既存の `.github/instructions/typescript.instructions.md` は `applyTo` が `{src,tools,tests,scripts}/**/*.ts`、ラッパーの `.claude/rules/typescript.md` は `paths` が `{src,tools}/**/*.ts` で、rulebook の「適用範囲を同じ glob にする」規則とずれている。また既存の正本には `specdojo:` の frontmatter がない。本タスクの対象外のため変更せず、型に合わせる対応を別の登録簿項目で扱うことを提案する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-sj3q-implementation-phase-kata]]
