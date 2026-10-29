---
specdojo:
  id: prj-0001:pjr-jrsy-context-marker
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-10-28T22:22:03Z"
  derived_from:
    - PJR-65DS
  depends_on:
    - PJR-3MY5
---

# PJR-JRSY 成果物の文脈の目印 `_CONTEXT_` を設ける

## 1. 概要

`_CONTEXT_` の書き方を規約に加え、draft が反映後に消して result へ写し、finalize と lint で残りを検出する

## 2. 完了条件

- 記述の規約（`.github/instructions/markdown.instructions.md` と、斜体の目印を定める standard）で、`_CONTEXT_` を目印の許可リストに加え、段落の先頭に `_CONTEXT_:` と書くこと、文書全体にかかる指示は先頭の章に書くことを定める。
- `draft` の plan 雛形に、`_CONTEXT_` の指示を本文へ反映したら目印を消し、元の指示を result に写すことを書く。`fully-guided` の plan 雛形には、`_CONTEXT_` が残っていれば反映せずに論点として result に残すことを書く。
- `finalize` / `bootstrap-finalize` の確認チェックリストに、`_CONTEXT_` が残っていないことを加える。
- 文書の lint で `_CONTEXT_` の残りを検出する。`status: ready` の文書では error、それ以外は warning とする（検出を置く場所は executor が決める）。
- 単体テストで、`_CONTEXT_` の検出（ready で error、draft で warning）と、plan 雛形・チェックリストへの反映を確かめる。
- `CHANGELOG.md` の `## [Unreleased]` 節（無ければ `## [0.5.0]` の上に作る）に追記する。`0.5.0` と公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と `handoff` に書く。

## 3. 作業内容

| No  | 作業                                                               | 担当     | 状態 | メモ                                                                             |
| --- | ------------------------------------------------------------------ | -------- | ---- | -------------------------------------------------------------------------------- |
| 1   | 規約に `_CONTEXT_` を加える                                        | executor | done | Markdown 指示と共通標準・各記述標準を更新                                        |
| 2   | draft・fully-guided の plan と finalize のチェックリストを更新する | executor | done | 元の指示の記録、未反映指示の申し送り、確定時の差し戻しを明記                     |
| 3   | lint での検出とテストを追加する                                    | executor | done | `remark-md-content` に検出を追加し、検出・plan・チェックリストの単体テストを整備 |

## 4. 対応結果

- `.github/instructions/markdown.instructions.md` と [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] の「文脈の目印」に、斜体の許可リスト、段落先頭の `_CONTEXT_:`、文書全体の指示を先頭の章に置く規約を記載した。個別の guide / standard / recipe / rulebook / philosophy 記述標準の許可リストも整合させた。
- `xep-draft-template.md` は既存の削除・転記ルールを補強し、元の指示と反映箇所の対を残すこと、pipeline では executor の `handoff` を介して result へ写すことを明記した。`xep-fully-guided-template.md` は残った指示を反映・削除せず、論点として記録して draft へ申し送るようにした。
- `xer-human-finalize-template.md` と `xer-human-bootstrap-finalize-template.md` に未反映の指示がないことのチェックを追加し、[[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]] と [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]] に残存時の差し戻しを明記した。
- 設計判断: 共通の記法はメタ情報標準に集約した。lint は既存の `remark-md-content` から `context-marker.ts` を呼び、content schema の対象外でも検出する。既存の remark 設定と公開 entry point をそのまま利用でき、追加の設定変更を要しないためである。`specdojo.status` が `ready` の場合のみ error、それ以外は warning とした。
- 設計判断: 実際の段落先頭の斜体 `_CONTEXT_:` を検出対象とし、インラインコード・コードブロック・表・見出し・文中の説明は除外した。指示と記法の説明・result に写した引用を混同しないためである。リストと引用の内部の段落も検査する。元の指示を result に写すときはコードで引用する規約とした。
- `tests/packages/docs-lint/context-marker.test.ts` に重大度、状態未指定、frontmatter 不在・不正、複数指示、誤検出防止、指示削除後の検出解消を追加した。既存の plan 生成テストと human result 生成テストに両 approach・両チェックリストの確認を追加した。
- `CHANGELOG.md` の `Unreleased` に PJR-JRSY を追記した。保護された設定の変更案や未解決の設計判断はない。
- 検証: 変更した Markdown / TypeScript の Prettier 整形と `git diff --check` が成功した。hook と同じ `node --import tsx tools/catalog-validate-if-configured.mjs` は終了コード 0 で成功した（変更対象外のカタログに、未配置の成果物を参照する既存警告あり）。YAML の変更はないため、個別の `validate:schema:file` は適用外とした。
- 親検証: `lint-ts`・`lint-fm`・`lint-md`・`test-integration`・`validate-schema`・`typecheck`・`test-unit` は executor 内では実行せず、終了後の親 runner へ委ねる。追加テストも親 runner の `test-unit` で実行する。
- 申し送り: `lint:fm` は既存の `--frail` により warning でも失敗する。下書き中に warning のみ確認したい場合は `--frail` を付けずに remark を実行する。親 runner の 7 件の実行結果を result に記録すること。

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
