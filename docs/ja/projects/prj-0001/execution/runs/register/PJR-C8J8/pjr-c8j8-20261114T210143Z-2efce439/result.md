---
specdojo:
  id: prj-0001:xer-pjr-c8j8-20261114t210143z-2efce439
  type: exec-result
  task_id: PJR-C8J8
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-C8J8/pjr-c8j8-20261114T210143Z-2efce439/plan.md
  started_at: "2026-11-14T21:02:57.415Z"
  completed_at: "2026-11-14T21:24:20.859Z"
  agent: opus-executor
  block_reason: "parent validation failed: typecheck"
---

# Edit Result

## 1. 実施内容

- 文書サイトの型のメニュー（rulebook, recipe, sample, template）を、`docs/ja/specdojo/` 配下の型文書から自動生成するように変更した。
- `sidebar-config.ts` に手動で記述していたメニュー定義を削除し、新しく作成した `sidebar-kata.ts` を通じて動的に生成する仕組みに移行した。
- メニューの構成情報を保持する `sidebar-kata-config.ts` を新たに導入した。
- `tests/packages/docs-site/sidebar-kata.test.ts` を作成・更新し、生成されたメニューが正しいルールに従っていることを検証可能にした。
- サンプルのメニュー構成において、『運用』セクションのグループ化を変更し、個別の sample が `opd`・`opr` の下に並ぶ形式に調整した。

## 2. 変更ファイル

- `packages/docs-site/.vitepress/config.mts`: `sidebar-config.ts` の代わりに `sidebar-kata.ts` を読み込むように変更。
- `packages/docs-site/.vitepress/sidebar-config.ts`: 手動による型メニューの定義を削除。
- `tests/packages/docs-site/sidebar-kata.test.ts`: 自動生成されたメニューの正当性を検証するためのテストコードを追加。
- `packages/docs-site/.vitepress/sidebar-kata-config.ts`: 追加、+322 / -0 行
- `packages/docs-site/.vitepress/sidebar-kata.ts`: 追加、+483 / -0 行

## 3. 申し送り

- 設定ファイルは YAML ではなく TypeScript (`packages/docs-site/.vitepress/sidebar-kata-config.ts`) にした。`@specdojo/docs-site` に YAML パーサーがなく、この sandbox では `npm install` で依存を追加できなかったため。frontmatter は、型の文書が使う形（字下げした `key: value`、`- item` の並び、`[a, b]`）だけを読む小さな関数で読む。
- rulebook の `recipe`・`sample`・`template` が `undecided`・`not-needed`・空の場合は、リンク先が無いのでその種類の項目を作らない。
- 今のメニューとの差分: サンプルの『運用』で『運用方針・設計』『運用手順』のグループが無くなり、個別の sample は `opd`・`opr` の項目の下に子として並ぶ。『全体構成』の表示名は『運用方針・設計 全体構成』『運用手順 全体構成』になった。ほかのメニューは変更前と完全に一致した（`tmp/compare-all.mts` で比較）。
- `pm-decision-log-template` は frontmatter にもファイル名にも rulebook への手がかりが無いため、設定の `attach` で `dec` に付けた。`agent-members-template` と `exec-human-finalize-recipe` は設定の `menu` にファイル名で置いた。
- schedule の変更案: `sch-strategy-kata-wave-1.yaml` の各段の説明にある『新しく作った型の文書…`sidebar-config.ts` の型のメニューにも足す…』の 1 文を消し、`sch-track-kata-wave-1.yaml` を再生成する。`kata-wave-1` が流れている間に書き換えると走っているタスクとぶつかるため、本タスクでは変えていない。本対応が `develop` へ入った後に orchestrator が行う。
- CHANGELOG.md は変えていない。個票の『CHANGELOG に書く事項』に 2 点書いた（メニューの自動生成、サンプルの運用の並び替え）。
- dev サーバーの起動中に足した型がメニューに出るのは、設定を読み直した後（再起動後）になる。手書きメニューのときと同じ扱い。
- 設定ファイルは YAML ではなく TypeScript（packages/docs-site/.vitepress/sidebar-kata-config.ts）にした。@specdojo/docs-site に YAML パーサーがなく、この sandbox では npm install で依存を追加できなかったため。YAML に移す場合は docs-site の `dependencies` に yaml を足す必要がある。frontmatter は、型の文書が使う形（字下げした key: value、- item の並び、[a, b]）だけを読む小さな関数で読む。
- 今のメニューとの差分: サンプルの『運用』で『運用方針・設計』『運用手順』のグループが無くなり、個別の sample は opd・opr の項目の下に子として並ぶ。『全体構成』の表示名は『運用方針・設計 全体構成』『運用手順 全体構成』になった。ほかのメニューは変更前と完全に一致した（tmp/compare-all.mts で比較）。
- `pm-decision-log-template` は frontmatter にもファイル名にも rulebook への手がかりが無いため、設定の `attach` で dec に付けた。`agent-members-template` と `exec-human-finalize-recipe` は設定の `menu` にファイル名で置いた。
- schedule の変更案: sch-strategy-kata-wave-1.yaml の各段の説明にある『新しく作った型の文書…sidebar-config.ts の型のメニューにも足す…』の 1 文を消し、sch-track-kata-wave-1.yaml を再生成する。kata-wave-1 が流れている間に書き換えると走っているタスクとぶつかるため、本タスクでは変えていない。本対応が develop へ入った後に orchestrator が行う。
- 適用外の検証: `npx eslint packages/docs-site/.vitepress/sidebar-kata.ts packages/docs-site/.vitepress/sidebar-kata-config.ts packages/docs-site/.vitepress/sidebar-config.ts`（The ESLint config and lint:ts do not cover packages/docs-site/.vitepress; the test file is covered by parent lint-ts）

## 4. 進め方

まず、`sidebar-config.ts` から型に関する手動定義を削除し、新たに `sidebar-kata.ts` と `sidebar-kata-config.ts` を導入して、`docs/ja/specdojo/` の各型文書を走査して動的にメニューを構築するロジックを実装した。`sidebar-kata-config.ts` には、カテゴリ名や `deliverable_type` のマッピング、ラベルの上書き設定を記述している。その後、`tests/packages/docs-site/sidebar-kata.test.ts` を用いて、自動生成されたメニューが意図した構造になっているかを確認した。最後に、`config.mts` のインポート構成を更新した。
