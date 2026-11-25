---
specdojo:
  id: prj-0001:xer-pjr-66er-20261125t101516z-52c907cf
  type: exec-result
  task_id: PJR-66ER
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-66ER/pjr-66er-20261125T101516Z-52c907cf/plan.md
  started_at: "2026-11-25T10:15:17.605Z"
  completed_at: "2026-11-25T10:27:16.202Z"
  agent: opus-executor
  block_reason: "parent validation failed: typecheck"
---

# Edit Result

## 1. 実施内容

- リポジトリをまたぐリンクの方式を、project 修飾の doc id のまま書く形に決めた。URL の基点は `external_projects.&lt;alias&gt;.source_url` で宣言する。文書サイトが相手のリポジトリの URL へ解決するよう実装した。
- 検討した案は、本文に完全 URL を書く、`external_projects` の別名を付けた wikilink、doc id のまま書く、相手の文書を取り込む、の 4 つ。別名案は、別名が呼び出し元ごとに違い、移すときに既存のリンクの書き換えが要るため採らなかった。
- 設定の読み込み、schema、設定リファレンス、移行ガイド、テストを更新した。
- runner の検証では `npm run typecheck` が失敗している。原因は `packages/docs-site/.vitepress/external-links.ts` の相対 import の拡張子欠落(TS2835)と、パラメータ `message` の暗黙 any(TS7006)である。ほかの runner 検証は成功または非適用だった。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/project-move-guide.md`: project を別リポジトリへ移す手順に、`external_projects` へ `path`・`project_id`・`source_url` を宣言する手順を追加・更新した。
- `docs/ja/specdojo/references/specdojo-config-reference.md`: `external_projects` の任意項目 `source_url` の説明を追加した。
- `docs/specdojo/schemas/v1/specdojo-config.schema.yaml`: `external_projects` に任意項目 `source_url` を追加した。
- `packages/docs-site/.vitepress/config.mts`: 文書サイトの設定に、別リポジトリの project への wikilink を解決する処理を組み込んだ。
- `packages/docs-site/.vitepress/product-repos.ts`: 外部リポジトリの解決処理を、新設の `external-links.ts` と共用できるように調整した。
- `src/shared/specdojo-config.ts`: `external_projects` の `source_url` を読み込み、検証する処理を追加した。ファイルは 1127 行となり、ESLint の `max-lines` 警告が出ている。
- `tests/src/shared/specdojo-config-external-projects.test.ts`: `source_url` の読み込みと検証のテストを追加した。
- `packages/docs-site/.vitepress/external-links.ts`: 新規。project 修飾の doc id の wikilink を、`source_url` を基点にした相手のリポジトリの URL へ解決する。解決できない場合は警告を出し、`[[...]]` のまま表示する。
- `tests/packages/docs-site/external-links.test.ts`: 新規。`external-links.ts` の解決と、未解決時の警告・表示のテストを追加した。

## 3. 申し送り

- `npm run typecheck` の失敗を直す必要がある。`packages/docs-site/.vitepress/external-links.ts` の import `./product-repos` を `./product-repos.js` にし、パラメータ `message` に型を付ける。executor の evidence には、この失敗への対応は記録されていない。
- 個票に完了条件が無かったため、executor が仮説を立て、個票の完了条件の章に `_ASSUMPTION_` として書いた。仮説でよいか確認が要る。
- `[[prj-0002:...]]` の wikilink は、このリポジトリに 6 種類・17 か所ある。`.specdojo/specdojo.config.json` に prj-0002 の `external_projects` が無いため解決されない。この設定は保護対象なので、移行時に人が宣言する。
- 個票に完了条件が無かったため、executor が仮説を立てて個票の完了条件の章に `_ASSUMPTION_` として書いた。仮説でよいか確認が要る。
- 方式の決定: 案は本文に完全 URL を書く、`external_projects` の別名を付けた wikilink、project 修飾の doc id のまま書く、相手の文書を取り込む、の 4 つ。doc id のまま（`[[prj-0002:pjr-xxxx]]`）を採用し、URL の基点は `external_projects.&lt;alias&gt;.source_url` で宣言する。別名案は、別名が呼び出し元ごとに違い、移すときに既存のリンクの書き換えが要るため採らなかった。
- 保護設定の変更の提案: このリポジトリには `[[prj-0002:...]]` の wikilink が 6 種類・17 か所あるが、`.specdojo/specdojo.config.json` に prj-0002 の `external_projects` が無いため解決されない。prj-0002 を別リポジトリへ移すときに、`path`・`project_id`・`source_url` を人が宣言する（移行ガイドの手順4）。
- CI など相手のリポジトリを checkout しない環境では解決されない（警告を出し `[[...]]` のまま表示）。公開サイトで解決させるには、ビルドの前に相手のリポジトリを `path` の位置へ checkout する。
- VS Code 拡張の wikilink の解決は対象外。要るなら別の項目として起票する。
- `npm run docs:build` での表示の確認は、型の区切りでオーケストレーターがまとめて流すときに行う。
- ESLint の `max-lines` の警告: `src/shared/specdojo-config.ts` が 1,000 行を超えた（1127 行）。ファイルを分ける候補。
- CHANGELOG の文案（区分: 追加）: `feat(docs): external_projects に source_url を宣言すると、別リポジトリの project の doc id の wikilink を文書サイトが相手のリポジトリの URL へ解決する`

## 4. 進め方

個票の入力を前提に、リンクの書き方の選択肢 4 案を比較し、doc id のまま書く方式を採用した。URL の基点は `external_projects.&lt;alias&gt;.source_url` で宣言する。設定の読み込み・schema・文書サイトの解決処理を実装し、リファレンスと移行ガイドへ反映した。executor の単体テスト、prettier、markdownlint、ESLint は成功した。runner の検証は `npm run typecheck` だけが失敗した。
