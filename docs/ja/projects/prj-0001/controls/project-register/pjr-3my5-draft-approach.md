---
specdojo:
  id: prj-0001:pjr-3my5-draft-approach
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  registered_at: "2026-10-28T22:21:43Z"
  derived_from:
    - PJR-65DS
---

# PJR-3MY5 draft approach を設け、fully-guided を磨き込み専用・宣言された参照に改める

## 1. 概要

文脈で任された範囲を調べて下書きする draft を追加し、fully-guided の plan・review 雛形を磨き込み専用にして参照範囲に `based_on`・入力・`brief` を加える

## 2. 完了条件

- approach に `draft` を追加し、`register add` / `update` の `--approach`、schedule の task、plan の生成、組み合わせの検証が `draft` を受け付ける。成果物を対象にする approach として扱い、kata 文書を対象にすると拒否する。
- plan 雛形 `xep-draft-template.md` を新設する。参照範囲は、rulebook・recipe・sample・template、`depends_on` 成果物、対象成果物の frontmatter の `based_on`、`project_context`、個票の `入力`、カタログの `brief`、成果物内の文脈、外部の情報（出典つき）とする。
- `draft` では、文脈で任された範囲に限り「根拠のない具体化の禁止」を外し、調べて値を決めてよいと plan に書く。選んだ値は成果物で「提案」と分かる形で示し、出典と選定理由を result に残すよう求める。任されていない範囲は従来どおり `_TODO_` / `_ASSUMPTION_` で残す。
- `fully-guided` の plan 雛形（`xep-fully-guided-template.md`）と review 雛形（`xrp-fully-guided-template.md`）を磨き込み専用に整理し、参照範囲を「宣言された文書だけ」に改める。今の範囲に、対象成果物の frontmatter の `based_on`、個票の `入力`、カタログの `brief` を加える。`入力` と `brief` は後続の項目で値が入るため、本項目では差し込み口を設け、値が無いときは「なし」と出す。
- ryu-guide の approach の表と図に `draft` を加え、`fully-guided` の説明を磨き込み専用の内容にそろえる。exec-operation-guide の approach の列挙にも `draft` を加える。
- 単体テストで、`draft` の plan の生成（参照範囲と具体化の許可の文言）、`fully-guided` の plan に `based_on` が載ること、`draft` と kata 文書の組み合わせの拒否を確かめる。
- `CHANGELOG.md` の `## [Unreleased]` 節（無ければ `## [0.5.0]` の上に作る）に追記する。`0.5.0` と公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と `handoff` に書く。

## 3. 作業内容

| No  | 作業                                              | 担当     | 状態 | メモ                                                                                  |
| --- | ------------------------------------------------- | -------- | ---- | ------------------------------------------------------------------------------------- |
| 1   | approach の値と検証に `draft` を追加する          | executor | done | 共通型・CLI パース・plan/result 復元・strategy 復元・schema・成果物対象検証へ追加     |
| 2   | `xep-draft-template.md` を新設する                | executor | done | 参照範囲、委任された範囲の調査・選定、提案表示と出典・選定理由の記録を定義            |
| 3   | fully-guided の plan・review 雛形を改める         | executor | done | 既存成果物の磨き込み専用とし、宣言された参照に `based_on`・入力・`brief` を追加       |
| 4   | ryu-guide・exec-operation-guide・テストを更新する | executor | done | 表・図・列挙と Unreleased を更新。register・schedule・plan・schema の回帰テストを追加 |

## 4. 対応結果

- `draft` を成果物用 approach として追加した。`register add` / `update`、schedule の task / phase、plan / result の approach 復元で扱える。カタログなしの成果物にも既存の解決経路を適用し、kata 文書の指定は成果物との種別不一致で拒否する。
- `xep-draft-template.md` を新設した。rulebook / recipe / sample / template、`depends_on`、対象成果物の `based_on`、`project_context`、個票の入力、カタログの `brief`、成果物内の文脈、出典つき外部情報を参照範囲とした。具体化の許可は文脈で任された範囲に限定し、選定値を「提案」と表示して出典・選定理由・反映した元の指示を result に記録する。
- fully-guided の edit / review 雛形を、宣言された参照だけを用いた既存成果物の磨き込み専用に統一した。対象成果物が未作成または文脈だけの場合は、下書きが必要なことを記録して draft へ申し送る。template を読み込まない既存の磨き込み方針を review 側にもそろえた。
- 設計判断: `based_on` は対象成果物のメタ情報から読み、宣言された ID のまま plan に提示する。カタログの `depends_on` や `project_context` から新しい根拠関係を推測・追加しないためである。未作成・未宣言なら「なし」と表示する。
- 設計判断: 個票の入力とカタログの `brief` は、edit / review の共通生成処理に `_REGISTER_INPUT_` / `_DELIVERABLE_BRIEF_` の差し込み口を設け、この段階では「なし」を渡す。値の保存・抽出は後続項目の責務とし、未実装の CLI・カタログフィールドを本項目で先取りしない。
- 設計判断: draft を型の整備状況から自動選択する規則や自動生成 profile は追加しない。[[prj-0001:pjr-65ds-deliverable-context-draft-approach]] の段階分担に従い、本項目は明示された task / phase の受け付けまでとし、雛形・人による文脈記入を含む profile は後続項目へ委ねる。既存 profile の型から draft を除外することで、新しい approach を受け付けつつ従来の自動導出を維持した。
- ryu-guide の表・図・参照原則と exec-operation-guide の列挙を更新した。`CHANGELOG.md` に Unreleased を新設し、公開済みの 0.5.0 以下の節は変更していない。
- 単体テストを追加・拡張した。draft の register add / update、kata 指定拒否、register / schedule plan の生成、具体化許可・提案・根拠記録の文言、fully-guided edit / review の `based_on` と空の入力・`brief`、未作成・根拠未宣言、strategy phase の復元と schema の受け付けを対象とした。
- 検証: 変更した 23 ファイルの Prettier 整形、対象 Markdown の検査、変更した schema 2 件の JSON Schema 2020-12 メタスキーマ検証、catalog 検証、register build、`git diff --check` が成功した。catalog 検証には未作成成果物の警告があるがエラーはない。型検査・TypeScript / frontmatter / Markdown lint・schema 検証・単体 / 統合テストの 7 件は pipeline 指示に従い親 runner が実施し、evidence に追記する。
- 申し送り: 後続項目では入力・`brief` の値を差し込み口へ接続し、文脈記入から draft を経る schedule profile を追加する。register / exec の変更を含むため、統合後は運用メモに従い PJR-JSEY で実 CLI の動作を確認する。保護された設定の変更は不要であり、変更案もない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
