---
specdojo:
  id: prj-0001:pjr-ykyk-scaffold-fallback-deliverable-type
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: easy
  registered_at: "2026-10-31T00:27:20Z"
  derived_from:
    - PJR-S23T
---

# PJR-YKYK template のない rulebook の雛形の type を deliverable_type にする

## 1. 概要

`deliverable scaffold` の一括生成と `--target` の両方で、template のない rulebook の最小の雛形の `type` を rulebook の `deliverable_type` にし、宣言がない場合は `project` のままにする。

## 2. 入力

- template: not-needed の rulebook（tsd-rulebook など）の雛形は src/catalog/generate.ts の fallbackMarkdown・fallbackYaml で type: project になり、rulebook の `deliverable_type`（tsd は architecture）と合わないため docs-lint の frontmatter-deliverable-type が警告し、--frail の lint:fm で落ちる
- PJR-65DS の流れは雛形を作ってすぐ commit するため、この不一致で止まる

## 3. 完了条件

- template のない rulebook の雛形（Markdown の `fallbackMarkdown` と YAML の `fallbackYaml`）で、`type` を rulebook の frontmatter の `deliverable_type` にする。rulebook は既存の `findTemplate` と同じ解決（npm package と eject 済みの kata）で読む。
- rulebook がない、読めない、または `deliverable_type` を宣言していない場合は、今と同じ `type: project` にする。
- `deliverable scaffold` の一括生成（`--dct` あり・なし）と `--target` の両方に効くことを、単体テストで確かめる。テストには、`deliverable_type` を宣言した rulebook と宣言しない rulebook の両方を含める。
- tsd-rulebook を指定して作った雛形が、docs-lint の `frontmatter-deliverable-type` で警告にならないことを確かめ、結果を本個票の対応結果に書く。
- template のある rulebook の雛形の扱いは変えない。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流して通し、親の検証も通る。
- 保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                             | 担当     | 状態 | メモ |
| --- | ------------------------------------------------ | -------- | ---- | ---- |
| 1   | 最小の雛形の `type` を `deliverable_type` にする | executor | done | -    |
| 2   | 単体テストと CHANGELOG を足して検証を流す        | executor | done | -    |

## 5. 対応結果

- 実施内容:
  - `src/catalog/generate.ts` に `resolveRulebookPath` および `resolveDeliverableType` を追加し、template のない rulebook の雛形生成（`fallbackMarkdown`、`fallbackYaml`）で `type` を rulebook の frontmatter の `deliverable_type` に設定するように変更した。rulebook がない・読めない・`deliverable_type` が未宣言の場合は従来どおり `type: project` にフォールバックする。
  - `tests/src/catalog/generate.test.ts` に、一括生成（`--dct` あり・なし）において `deliverable_type` 宣言あり・なしの rulebook に対する雛形生成テストを追加した。
  - `tests/src/deliverable/scaffold.test.ts` に、`--target`（カタログ登録成果物および catalog-less 成果物の両方）において `deliverable_type` 宣言あり・なしの rulebook に対する雛形生成テストを追加した。
  - `specdojo:tsd-rulebook`（`deliverable_type: architecture`、`template: not-needed`）を指定して生成した雛形について、`@specdojo/docs-lint` の `frontmatter-deliverable-type` による検証を実施し、警告・エラーが 0 件となりパスすることを確認した。
  - `CHANGELOG.md` の `## [Unreleased]` 節に本改修の記録を追記した。
- 成果物:
  - `src/catalog/generate.ts`
  - `tests/src/catalog/generate.test.ts`
  - `tests/src/deliverable/scaffold.test.ts`
  - `CHANGELOG.md`
  - `docs/ja/projects/prj-0001/controls/project-register/pjr-ykyk-scaffold-fallback-deliverable-type.md`
- 残課題:
  - なし。保護された設定の変更も不要。

## 6. 関連ドキュメント

- [[prj-0001:pjr-s23t-deliverable-scaffold-target]]
- [[prj-0001:pjr-6a2b-context-draft-guides]]
