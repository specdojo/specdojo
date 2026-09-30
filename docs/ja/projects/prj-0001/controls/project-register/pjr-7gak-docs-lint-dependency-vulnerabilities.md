---
specdojo:
  id: prj-0001:pjr-7gak-docs-lint-dependency-vulnerabilities
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-30T12:06:40Z"
---

# PJR-7GAK docs-lint の依存の脆弱性への対応

## 1. 概要

docs-lint に残る high 6 件・moderate 3 件（markdownlint-cli 0.48 経由の markdown-it・smol-toml・js-yaml、remark-lint-frontmatter-schema 経由の json-schema-ref-parser・ajv・minimatch・yaml）を、markdownlint-cli 0.49 への更新と上流の対応状況の確認で解消する（v0.3.0）

## 2. 完了条件

- docs-lint（`packages/docs-lint`）の `npm audit --omit=dev --package-lock-only` が報告する 9 件（high 6 件、moderate 3 件）について、脆弱な版を持ち込む依存の経路、修正版の有無、解消に必要な変更を 1 件ずつ調べ、対応結果に表で記録する。
- `markdownlint-cli` を 0.49 以降に上げると解消するものと、その場合に docs-lint の設定・コード・出力に変更が要るかを、変更履歴（CHANGELOG・リリースノート）から確かめて記録する。
- `remark-lint-frontmatter-schema` 経由のもの（`@apidevtools/json-schema-ref-parser`、`ajv`、`minimatch`、`yaml` など）について、新しい版や代替で解消できるか、上流の対応待ちかを記録する。
- `package.json` と `package-lock.json` は agent が変更できない設定のため変更しない。必要な依存の変更（パッケージ名・版の範囲・理由）は result の申し送りに書き、orchestrator が反映して検証する。
- 依存の更新に合わせてコードや設定の変更が必要な場合は、その変更を行い、既存の単体テストが通る。
- 上流の対応待ちで残るものは、`CHANGELOG.md` の v0.3.0 の「既知の問題」に追記されている。

## 3. 作業内容

| No  | 作業                                              | 担当         | 状態 | メモ                               |
| --- | ------------------------------------------------- | ------------ | ---- | ---------------------------------- |
| 1   | 9 件の経路・修正版・解消方法の調査と記録          | DEV          | open | exec run で agent が行う           |
| 2   | 必要なコード・設定の変更と CHANGELOG の既知の問題 | DEV          | open | exec run で agent が行う           |
| 3   | `package.json`・lockfile の更新と検証             | orchestrator | open | 申し送りに従い orchestrator が行う |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-6tka-deps-in-range-update-dotenv18]]
- [[prj-0001:pjr-xmma-docs-site-puppeteer25-mermaid12]]
