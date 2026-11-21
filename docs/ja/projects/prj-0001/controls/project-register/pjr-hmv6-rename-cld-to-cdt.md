---
specdojo:
  id: prj-0001:pjr-hmv6-rename-cld-to-cdt
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:30:11Z"
  completed_at: "2026-11-08T02:03:42Z"
  conclusion: 分類一覧の略号を cdt にし、cdt の rulebook・sample・カタログのテンプレートを正本とした。古い cld の 3 件は非推奨の案内として残し、prj-0001 のカタログと参照を cdt に揃えた
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-V6RB
---

# PJR-HMV6 分類一覧の略号を cld から cdt に変える

## 1. 概要

分類一覧（Classification List）の略号 cld が概念クラス図の ccd と紛れるため、code table の cdt に変える。公開済みの kata ID は経路 B で新しい ID に切り替え、古い ID は非推奨として残す

## 2. 入力

- 略号は cdt にする（indie が決定、2026-11-08）。prj-0001 には cld の成果物も schedule のタスクもまだない。

## 3. 完了条件

- 新しい `specdojo:cdt-rulebook`・`specdojo:cdt-sample` と、カタログのテンプレート `dct-data-model-cdt-template.yaml` を作って正本にし、frontmatter（YAML は対応する項目）の `supersedes` に古い ID を書いている。中身は古い cld の型を引き継ぎ、略号・ID・見出しの表記だけを cdt に変えている。中身の手入れは PJR-7FXC で行うため、ここでは変えない。
- 古い `cld-rulebook`・`cld-sample`・`dct-data-model-cld-template.yaml` は削除せず、`status: deprecated` にして、移る先への案内だけに縮めている（[[specdojo:id-and-file-naming-standard]] の経路 B）。v0.7.0 までに公開した ID を利用者のカタログが参照している可能性があるためである。
- prj-0001 のカタログ `dct-data-model-cld.yaml` を `dct-data-model-cdt.yaml` にし、5 件の `local_id` と `path` を `cdt-*` にしている。成果物も schedule のタスクもまだないため、古い項目は残さない。`cdt-register-type` の `overview` を、今の登録項目の種別 8 種類（issue・decision・todo・question・risk・change-request・note・epic）に直している。
- ガイド・標準・rulebook・sample・template・カタログの索引など、cld を参照している文書を cdt に直している。古い略号は、移行を説明する箇所だけに残している。
- 実行記録（`execution/runs/`）・登録簿の個票とイベント・CHANGELOG の公開済みの版の節は、履歴なので変えていない。
- `src/`・`tests/` に cld を扱う処理や期待値があれば直し、なければ変えていない。
- CHANGELOG の未公開の版の節に、略号の変更と古い ID が非推奨になったことを書いている。
- `specdojo index build`・`specdojo catalog validate --project prj-0001`・`npm run lint:md`・`npm run validate:schema`・`npm run docs:build` が通っている。

## 4. 作業内容

| No  | 作業                                                          | 担当 | 状態 | メモ                                                                         |
| --- | ------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------------- |
| 1   | cld を参照している文書と設定を洗い出す                        | DEV  | done | docs、templates、packages/docs-site、tests、defaults を特定                  |
| 2   | 新しい cdt の型とカタログを作り、古い型を非推奨の案内に縮める | DEV  | done | cdt-rulebook、cdt-sample、dct-data-model-cdt-template を作成し旧型を非推奨化 |
| 3   | 参照を cdt に直し、CHANGELOG を書いて検査を流す               | DEV  | done | カタログ、標準、リファレンス、サイドバー等を更新し検証完了                   |

## 5. 対応結果

### 実施内容

1. **新しい cdt の型の新設と旧 cld 型の非推奨化**:
   - `docs/ja/specdojo/rulebooks/cdt-rulebook.md` を作成（`id: specdojo:cdt-rulebook`、`supersedes: [specdojo:cld-rulebook]`）。見出しと略号表記を `cdt`（Code Table）に更新。
   - `docs/ja/specdojo/rulebooks/cld-rulebook.md` を `status: deprecated` に更新し、後継の `specdojo:cdt-rulebook` への案内および経路 B に基づく移行方針に縮小。
   - `docs/ja/specdojo/samples/cdt-sample.md` を作成（`id: specdojo:cdt-sample`、`supersedes: [specdojo:cld-sample]`）。
   - `docs/ja/specdojo/samples/cld-sample.md` を `status: deprecated` に更新し、`specdojo:cdt-sample` への案内に縮小。
   - `docs/ja/specdojo/templates/dct-data-model-cdt-template.yaml` を作成（`id: specdojo:dct-data-model-cdt-template`、`supersedes: [specdojo:dct-data-model-cld-template]`、deliverable `cdt-_TERM_`）。
   - `docs/ja/specdojo/templates/dct-data-model-cld-template.yaml` を `status: deprecated` に更新し、新テンプレートへの案内に縮小。
   - `docs/specdojo/schemas/v1/dct.schema.yaml` に `supersedes`（任意配列）を定義。

2. **prj-0001 カタログの移行**:
   - `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cld.yaml` を削除し、`dct-data-model-cdt.yaml` を作成。
   - 5 件の成果物の `local_id`・`path`・`rulebook` を `cdt-*`（`cdt-register-type`, `cdt-deliverable-kind`, `cdt-exec-mode`, `cdt-routine-action-kind`, `cdt-role`）に更新。
   - `cdt-register-type` の `overview` を、現行の登録項目種別 8 種類（issue・decision・todo・question・risk・change-request・note・epic）の分類一覧に改訂。

3. **参照文書・設定の更新**:
   - `docs/ja/specdojo/standards/id-and-file-naming-standard.md`: 分類一覧の略号・プレフィックスを `cdt-`、推奨例を `cdt-product` に更新。
   - `docs/ja/specdojo/references/deliverables-reference.md`: 業務データ辞書 / 分類一覧のリンク先を `cdt-rulebook.md`、推奨ファイル名を `cdt-<term>` に更新。
   - `docs/ja/specdojo/references/directory-layout-reference.md`: ディレクトリ例を `cdt-product-category.md` に更新。
   - `docs/ja/sample-gcs-product/010-業務仕様/020-業務データ辞書/README.md`: 分類一覧（CDT）のルールリンクを `cdt-rulebook.md` に更新。
   - `packages/docs-site/.vitepress/sidebar-config.ts`: `rulebook`, `sample`, `templateYaml` のエントリを `cdt` に更新。
   - `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`: `specdojo:cdt-rulebook` を `confirmed_default` に追加。
   - `docs/ja/projects/prj-0001/timeline/tml-index.yaml`: `cld` の記述を `cdt` に更新。

4. **scaffold・テストの対応**:
   - `src/catalog/scaffold.ts` および `src/catalog/plan.ts`: テンプレート読み込み時に `status === "deprecated"` のテンプレートを除外するよう改訂。
   - `tests/src/catalog/merge.test.ts`: 期待値およびフィクスチャを `cld` から `cdt` に更新。

5. **CHANGELOG の記録**:
   - `CHANGELOG.md` の `[Unreleased]` -> `### 変更` に略号の変更と旧 ID 非推奨化を記録。

### 成果物

- `docs/ja/specdojo/rulebooks/cdt-rulebook.md`
- `docs/ja/specdojo/rulebooks/cld-rulebook.md`
- `docs/ja/specdojo/samples/cdt-sample.md`
- `docs/ja/specdojo/samples/cld-sample.md`
- `docs/ja/specdojo/templates/dct-data-model-cdt-template.yaml`
- `docs/ja/specdojo/templates/dct-data-model-cld-template.yaml`
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cdt.yaml`
- `docs/specdojo/schemas/v1/dct.schema.yaml`
- `docs/ja/specdojo/standards/id-and-file-naming-standard.md`
- `docs/ja/specdojo/references/deliverables-reference.md`
- `docs/ja/specdojo/references/directory-layout-reference.md`
- `docs/ja/sample-gcs-product/010-業務仕様/020-業務データ辞書/README.md`
- `packages/docs-site/.vitepress/sidebar-config.ts`
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- `docs/ja/projects/prj-0001/timeline/tml-index.yaml`
- `src/catalog/scaffold.ts`
- `src/catalog/plan.ts`
- `tests/src/catalog/merge.test.ts`
- `CHANGELOG.md`

### 残課題・申し送り

- `npm run docs:build` は、コンテナ環境のメモリ上限（4GB heap）により VitePress レンダリング処理で OOM となるため、`pm-orchestrator-playbook.md` 5.2 節の指示に基づきホスト側で実行・確認する（`requires_human`）。
- 後続タスク `PJR-7FXC` にて、新設した `specdojo:cdt-rulebook` および `specdojo:cdt-sample` の中身（schema enum / TypeScript union 参照化）の手入れを実施する。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 規範: [[specdojo:id-and-file-naming-standard]]
- 後続: [[prj-0001:pjr-7fxc-cdt-kata-reference-to-implementation]]
