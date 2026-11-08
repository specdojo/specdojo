---
specdojo:
  id: prj-0001:pjr-vmxk-clis-kata-bootstrap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T06:48:18Z"
  derived_from:
    - PJR-2GD6
    - PJR-RMMM
  approach: rulebook-authoring
  targets:
    - specdojo:clis-rulebook
  sources:
    - specdojo:uis-rulebook
    - specdojo:uis-sample
---

# PJR-VMXK CLI 仕様（clis）の型を新しく作る

## 1. 概要

SpecDojo 自身の CLI を利用者から見た仕様を書く新しい種類 clis の rulebook と sample を作る。PJR-0YNQ で uis に足した CLI の部分を土台にし、コマンドリファレンスを参照して操作の流れ・出力の要点・終了とエラーと次の手に絞る

## 2. 入力

- PJR-RMMM（indie が決定、2026-11-08）: CLI を新しい種類 clis（CLI Specification）に分け、uis は GUI の画面仕様だけにする。
- clis は SpecDojo 自身の CLI を利用者から見た仕様で、SpecDojo が起動する外部の CLI との約束である ifx-cmd とは分ける。

## 3. 完了条件

- `docs/ja/specdojo/rulebooks/clis-rulebook.md`（`specdojo:clis-rulebook`）と `docs/ja/specdojo/samples/clis-sample.md`（`specdojo:clis-sample`）を作っている。[[specdojo:rulebook-authoring-standard]] の章立てに従い、rulebook にサンプルの章を置かず、frontmatter の `sample` で sample を宣言している。recipe と template の要否を決め、frontmatter に書いている。
- rulebook に、次の規則を書いている。
  - clis は SpecDojo 自身の CLI のコマンド群を、利用者から見た仕様として書く。SpecDojo が起動する外部の CLI との約束（ifx-cmd）とは分ける。
  - 引数・オプションの表と使い方の詳細は書かず、コマンドリファレンスを参照する。
  - 文書には、利用目的、操作の流れ（どのコマンドからどのコマンドへ進むか）、出力と作るファイルの要点、終了コードとエラー表示と利用者の次の手を書く。
- PJR-0YNQ で `uis-rulebook`・`uis-sample` に足した CLI の部分を土台にし、CLI に合わない GUI の章（画面の表示項目・遷移など）は持ち込んでいない。
- `clis-sample` は、駄菓子屋の販売管理システムの CLI のコマンド群を題材にした完成例である。
- ID の命名の標準・成果物のリファレンス・文書サイトの sidebar・レビューの観点の設定など、種類の一覧を持つ文書と設定に clis を足している。保護された設定に当たるものは executor が変えず、変更案を個票の対応結果と報告の `handoff` に書いている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている（PJR-PJYJ で人が判断する材料にする）。
- uis の型と、prj-0001 のカタログは変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `specdojo index build`・`npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                   | 担当     | 状態 | メモ                                                                      |
| --- | ---------------------------------------------------------------------- | -------- | ---- | ------------------------------------------------------------------------- |
| 1   | uis の型の CLI の部分とコマンドリファレンスを読み、clis の規則を決める | executor | done | 操作の流れ・コマンド参照・出力要点・終了コード・次の手の構成を策定        |
| 2   | clis の rulebook と sample を作り、種類の一覧に足す                    | executor | done | `clis-rulebook.md`・`clis-sample.md` を作成し命名標準・サイドバー等に追加 |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                             | executor | done | 全検証を通過、executor 決定事項・CHANGELOG 文案・残課題を記録完了         |

## 5. 対応結果

### 5.1. 実施内容

1. **CLI 仕様（`specdojo:clis-rulebook`）の新規作成**:
   - `docs/ja/specdojo/rulebooks/clis-rulebook.md` を作成した。
   - SpecDojo 自身およびシステム自身の CLI コマンド群について、利用者（オペレーター・開発者・業務ユーザー）視点での仕様書を書くためのルールを策定した。
   - 外部ツールをシステムが呼び出す外部コマンド連携仕様（`ifx-cmd`）とは明確に区別した。
   - コマンド引数・オプションの詳細な構文表は持たず、正本であるコマンドリファレンスを参照する原則を規定した。
   - 利用目的、操作の流れ（どのコマンドからどのコマンドへ進むか）、出力と生成ファイルの要点、終了コードとエラー表示、および利用者の次の手に絞って記述する本文要件・記述ガイド・禁止事項を整備した。
   - uis から CLI に合わない GUI 固有の章（画面の表示項目、画面遷移、レイアウトなど）を排除し、CLI に最適化した章構成とした。
   - `[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]` に準拠し、rulebook 内にサンプルの章は置かず、Frontmatter の `sample` で `specdojo:clis-sample` を宣言した。`recipe` および `template` は `not-needed` と判断した。
2. **完成サンプル（`specdojo:clis-sample`）の新規作成**:
   - `docs/ja/specdojo/samples/clis-sample.md` を作成した。
   - 駄菓子屋きぬやの販売管理システムの CLI コマンド群（`sales start`, `sales add`, `sales total`, `sales complete`, `sales cancel`）を題材にした完成例を作成した。
   - Mermaid フローチャートと順序付きリストによる操作の流れ、コマンドリファレンス参照、標準出力と生成ファイル（一時セッション・販売実績・レシート）の要点、終了コード体系（0〜3）、および代表的なエラー表示と利用者の次の手（回復アクション）を網羅した。
3. **種類の一覧を持つ文書と設定への反映**:
   - ID 命名標準（`docs/ja/specdojo/standards/id-and-file-naming-standard.md`）: 14.2 表に `clis-`（CLI仕様）を追加した。
   - 成果物リファレンス（`docs/ja/specdojo/references/deliverables-reference.md`）: 2.1.4 ユーザーインターフェースモデルに `[CLI仕様](../rulebooks/clis-rulebook.md)` を追加した。
   - 文書サイトサイドバー設定（`packages/docs-site/.vitepress/sidebar-config.ts`）: インターフェースモデル配下に `rulebook("CLI仕様", "clis")` および `sample("CLI仕様", "clis")` を追加した。
   - レビュー観点設定（`docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`）: `vp-po-business-goal-alignment` および `vp-arc-single-responsibility` の `confirmed_default` に `specdojo:clis-rulebook` を追加した。
4. **CHANGELOG 文案の作成**:
   - `CHANGELOG.md` 自体は変更せず、利用者に影響する変更内容を「5.6. CHANGELOG に書く事項」に区分と文案で記録した。

### 5.2. 成果物

- [[specdojo:clis-rulebook]]: `docs/ja/specdojo/rulebooks/clis-rulebook.md`
- [[specdojo:clis-sample]]: `docs/ja/specdojo/samples/clis-sample.md`
- [[specdojo:id-and-file-naming-standard]]: `docs/ja/specdojo/standards/id-and-file-naming-standard.md`
- [[specdojo:deliverables-reference]]: `docs/ja/specdojo/references/deliverables-reference.md`
- 文書サイトサイドバー設定: `packages/docs-site/.vitepress/sidebar-config.ts`
- レビュー観点設定: `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`
- 個票: `docs/ja/projects/prj-0001/controls/project-register/pjr-vmxk-clis-kata-bootstrap.md`

### 5.3. スキーマ（schema）変更の要否と理由

- **スキーマ変更なし**: CLI仕様（clis）は Markdown 形式（`target_format: markdown`）の成果物であり、`docs/specdojo/schemas/v1/` に専用の YAML/JSON スキーマは不要である。Frontmatter の `type` はインターフェースモデルの成果物分類である `ui` 固定とし、共通スキーマ `deliverable-frontmatter.schema.yaml` および `rulebook-frontmatter.schema.yaml` にそのまま適合するため、スキーマ変更および後方互換性への影響はない。

### 5.4. 規則と sample の書き方で executor が決めた内容と理由（PJR-PJYJ への判断材料）

1. **`recipe` と `template` の要否**:
   - 決定: Frontmatter で `recipe: not-needed`、`template: not-needed` と決定した。
   - 理由: CLI仕様はコマンド群の業務目的に応じてフローや出力の構造が大きく異なり、定型的な template や機械的な recipe による固定化は不要であり、rulebook の章要件と sample（完成例）を参照して柔軟に作成するのが最適であるため。
2. **本文見出し構成の決定**:
   - 決定: 概要、利用目的と対象ユーザー、操作の流れ、操作とコマンド参照、出力と生成ファイルの要点、終了コードとエラー表示・利用者の次の手、メモ / 将来課題の全7章とした。
   - 理由: uis の「画面の表示項目」「遷移」などの GUI 概念を排除し、完了条件で要求された「利用目的」「操作の流れ」「出力と作るファイルの要点」「終了コードとエラー表示と利用者の次の手」を直接的かつ過不足なく表現できる章立てとしたため。
3. **生成・更新ファイルの要点を独立節として明記**:
   - 決定: 標準出力だけでなく、作成・更新されるファイル（一時セッションファイル、正本レコード、レシート控え等）のライフサイクルと要点を必須要件とした。
   - 理由: CLI 操作では標準出力と並んでファイルシステムの副作用（ファイルの生成・状態更新）が極めて重要であり、仕様として明文化することでファイル配置や永続化の設計不備を防ぐため。
4. **終了コード体系の標準化**:
   - 決定: 0（正常終了）、1（ユーザー入力エラー）、2（セッション状態エラー）、3（システム・環境エラー）の区分を例示・標準化した。
   - 理由: スクリプトや CI から CLI を呼び出す際、終了コードによる分岐が不可欠であり、エラー事象と終了コードの対応を仕様化することが運用品質を高めるため。

### 5.5. 保護された設定の変更案（handoff）

- **変更提案なし**: 保護された設定（`.specdojo/`・`package.json`・`.agents/` など）の中に種類一覧を保持している設定ファイルはなく、変更提案はない。

### 5.6. CHANGELOG に書く事項

- **区分**: 追加
- **行の文案**:
  - CLI 仕様（clis）の型を新設し、コマンドリファレンスを参照して操作の流れ・出力と生成ファイル要点・終了コード・エラー表示と利用者の次の手を記述する rulebook と sample を追加（`specdojo:clis-rulebook`, `specdojo:clis-sample`）

### 5.7. 残課題・申し送り

- uis の型および prj-0001 のカタログは完了条件に従い変更していない。後続タスク（[[prj-0001:pjr-pjyj-clis-uis-kata-confirm]]）にて、uis からの CLI 記述の分離確認、および必要な場合のカタログ反映・実成果物への適用を判断する。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-rmmm-uis-kata-confirm]]
- 土台: [[specdojo:uis-rulebook]]、[[specdojo:uis-sample]]
- 後続: [[prj-0001:pjr-pjyj-clis-uis-kata-confirm]]
