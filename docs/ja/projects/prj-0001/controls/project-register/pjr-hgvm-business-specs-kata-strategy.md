---
specdojo:
  id: prj-0001:pjr-hgvm-business-specs-kata-strategy
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  registered_at: "2026-11-09T22:17:20Z"
  completed_at: "2026-11-09T22:38:07Z"
  conclusion: business-specs-kata の strategy と track を作った。sf・cdt・ccd・bdd・ifx-cmd は improve-kata で rulebook・sample（ifx-cmd は recipe・template も）の maintenance、bes・br は bootstrap-kata-set で作り直し、最後に人が型一式を確定する（bootstrap-finalize）。各段の説明に標準の章立てと中身の厚さの指示を書いた
  derived_from:
    - PJR-T88P
  approach: strategy-planning
  targets:
    - track:business-specs-kata
---

# PJR-HGVM 業務仕様の型の schedule（business-specs-kata）を作る

## 1. 概要

sf・cdt・ccd・bdd・ifx-cmd の型の手入れと、bes・br の型の作り直し、人による型の確定の段を持つ sch-strategy-business-specs-kata.yaml を作り、schedule build する

## 2. 入力

- 対象の型と扱い（indie が承認、2026-11-10）: 手入れ = sf-rulebook・cdt-rulebook・ccd-mermaid-rulebook・bdd-rulebook・ifx-cmd-rulebook と各 sample（ifx-cmd は recipe・template も）。作り直し = bes-rulebook・br-rulebook と各 sample。
- 各段の説明に書く指示: rulebook-authoring-standard の章立て、サンプルの章の外出し、##〜#### の見出しの連番、記述ガイドに章ごとの判断の基準と良い例・悪い例、clis-sample 程度の厚さの sample、recipe と template の要否の判断。実装と同じことを書かない方針（PJR-2GD6）は保つ。

## 3. 完了条件

- `docs/ja/projects/prj-0001/schedule/sch-strategy-business-specs-kata.yaml` を、`schedule strategy generate --project prj-0001 --track business-specs-kata` で作っている（書き込む前に `--dry-run` で差分を確かめる）。
- 手入れの 5 種類（sf・cdt・ccd・bdd・ifx-cmd）は、`intent: improve-kata` などで、rulebook と sample（ifx-cmd は recipe と template も）の maintenance の段を作っている。
- 作り直しの 2 種類（bes・br）は、今の代表の文書（`bes-task-ready-selected`・`br-task-selection-strategy`）を手本に、型を起こし直す段を作っている。今の仕組み（`bootstrap` は全部の型が使える状態を対象にできない、など）で作れない場合は、作れない理由と、代わりに register の todo にする案を個票の対応結果に書き、その 2 種類は strategy に含めない。
- 最後に、人が型を確定する段（`confirm-with-kata-set` など）を作っている。
- 各段の `description` に、次の指示を書いている。
  - [[specdojo:rulebook-authoring-standard]] の章立てに合わせる。rulebook にサンプルの章を置かず、完成例は sample に外出しする。
  - `##` から `####` の見出しに連番を付ける。
  - 記述ガイドに、章ごとの判断の基準と、良い例・悪い例を書く。
  - sample は、[[specdojo:clis-sample]] 程度の厚さの完成例にする。
  - recipe と template の要否を決め、frontmatter に書く。
  - 実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保つ。
- `schedule build --project prj-0001 --track business-specs-kata` で track を作り、ほかの track の strategy・track と、`sch-milestones.yaml` のうち business-specs-kata と関係のない項目を変えていない。
- 段の並びと intent を選んだ理由を、個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `specdojo exec validate --project prj-0001 --schedule-only`・`npm run validate:schema`・`npm run lint:md` が通っている。
- schedule のタスクの実行（`exec run --auto`）はこの項目では行わない。

## 4. 作業内容

| No  | 作業                                                                            | 担当  | 状態 | メモ                                                                                     |
| --- | ------------------------------------------------------------------------------- | ----- | ---- | ---------------------------------------------------------------------------------------- |
| 1   | 対象の型の grade と、使える intent を確かめ、`--dry-run` で strategy を生成する | Codex | done | 7 代表を選択。bes・br は bootstrap を導出できることを確認                                |
| 2   | 各段の説明に指示を書き、strategy と track を作る                                | Codex | done | 32 タスク、10 マイルストーン。主担当 ARC、ゲート管理 PM                                  |
| 3   | 検査を流し、段の並びと intent の理由を対応結果に書く                            | Codex | done | schedule・個別 schema・catalog の検証済み。全体 schema・Markdown lint は親 runner が実施 |

## 5. 対応結果

### 5.1. scope と主担当

[[prj-0001:sch-strategy-business-specs-kata|業務仕様の型の整備戦略]] と、そこから build した [[prj-0001:sch-track-business-specs-kata|業務仕様の型の整備タスク]] を作成した。

既存 strategy は無く、親 [[prj-0001:pjr-t88p-business-specs-kata]] の `domains`（data-model・business-model・system-functions・external-interface-specs）を起点とした。親に `depends_on` は無い。互換用 [[prj-0001:tml-index]] より epic を優先し、dashboard の domain による物理分割カタログの検出と、既存 26 カタログを確認した。今回の承認範囲に合わせ、次の 7 カタログの各 1 件を `scope.catalogs[].local_ids` で選択し、`include_kinds: [work]` とした。

| カタログ                       | 選択した代表                 |
| ------------------------------ | ---------------------------- |
| `dct-data-model-bdd`           | `bdd-register-entry`         |
| `dct-data-model-ccd`           | `ccd-project-planning`       |
| `dct-data-model-cdt`           | `cdt-register-type`          |
| `dct-business-model-bes`       | `bes-task-ready-selected`    |
| `dct-business-model-br`        | `br-task-selection-strategy` |
| `dct-system-functions`         | `sf-task-execution`          |
| `dct-external-interface-specs` | `ifx-cmd-ai-provider-cli`    |

一覧用の型、bps・cdsd・stsd、他ドメインの文書は対象外。カタログと `tml-index.yaml` は変更していない。型の構造整合を担う [[prj-0001:pm-roles|ロール一覧]] の ARC を全 7 件の主担当として `owner_rules` に明示した。`done_criteria.roles` は主担当の根拠にしていない。ゲート・ドメイン完了は PM、人の型確定は ARC を兼務する indie が担当する。agent の編集は sol-executor、review は sol-review-executor を各段に指定した。

### 5.2. grade と intent の判断

`collectApproachFacts` で、宣言・実在・内容ハッシュを含めて有効な保存済み grade を確認し、`deriveApproaches` で導出を確認した。

- sf・cdt・ccd・bdd・ifx-cmd は `intent: improve-kata`、`kata_target: rulebook`。全件で rulebook と sample が実在し、ifx-cmd は recipe・template も実在する。maintenance は grade の pass を前提とせず、対象が `not-needed` でないことから選択できるため、有効な grade の無い型を推測で pass にしていない。
- bes は rulebook が `needs-work`、sample が `fail`。br は rulebook が `needs-work`、sample が `pass`。両者とも `intent: bootstrap-kata-set`、`bootstrap_scope: [rulebook, sample]` とした。少なくとも rulebook が利用可能ではないため、「対象がすべて利用可能」の禁止条件に該当せず、bootstrap を導出できた。除外や代替 todo の起票は不要である。
- bes・br の recipe・template は現状 `undecided`。必須の作り直し範囲は rulebook・sample とし、追加の型の要否は bootstrap の作業で判断させる。

### 5.3. 段の並びと依存関係

| 対象              | 段の並び                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| sf・cdt・ccd・bdd | rulebook-maintenance → sample-maintenance → review → 型一式の確定（human）                                             |
| ifx-cmd           | rulebook-maintenance → recipe-maintenance → sample-maintenance → template-maintenance → review → 型一式の確定（human） |
| bes・br           | bootstrap → refine → condense → review → 型一式の確定（human）                                                         |

先に記述規範を決め、作成手順と完成例、雛形を整合させてから確認する順とした。bes・br は現在の代表を手本に型を起こし直し、代表の必要最小限の補正・磨き込み・冗長さ整理を経て整合を確認する。実装の再掲を避けるため、生成時の bootstrap profile の `retrofit-review-pass` は `review-pass` に変更した。

標準 generator は 1 成果物に 1 intent・1 maintenance 種別を割り当てるため、生成した strategy に sample と ifx-cmd の recipe・template の専用段を追加した。重複する task ID を避けるため suffix を rulebook `040`、recipe `045`、sample `050`、template `060` に分けた。最終段は全系統で `execution: human`、`approach: bootstrap-finalize` とし、`confirm-with-kata-set` と同じ型一式の確認を行わせる。各成果物に intent を重複宣言せず、maintenance と確定を同じ系列に置いている。

全系統の初回整備が終わるゲートと全 7 review の完了ゲートを置き、人の確定は後者を待つ。scope 内のカタログ依存である bdd → cdt・ccd は初回整備完了までの依存として保持し、全体ゲートをまたぐ循環を避けた。scope 外の未作成成果物を今回の新規作成タスクに展開していない。

すべての段の `description` に、標準の章立て、サンプル章の外出し、`##`〜`####` の連番、章別の判断基準と良い例・悪い例、clis-sample 相当の完成例、recipe・template の要否の frontmatter 宣言、PJR-2GD6 の方針を記載した。YAML sample は文章量でなく内容の充実度を合わせる。review と human の段ではこれらを確認基準とする。

### 5.4. 生成・検証結果

1. scope・intent・owner の入力宣言を用意し、`node --import tsx src/specdojo.ts schedule strategy generate --project prj-0001 --track business-specs-kata --gate-owner PM --milestone-owner PM --force --dry-run` の差分を確認した（標準 profile で 25 タスク・10 マイルストーン）。
2. 同じコマンドから `--dry-run` を外して strategy を生成し、上記の専用段・指示・agent 指定を加えた。`schedule build --project prj-0001 --track business-specs-kata --dry-run` を確認してから build した。最終生成は `node --import tsx src/specdojo.ts schedule build --project prj-0001 --track business-specs-kata --force`（32 タスク）。
3. build はプロジェクト全体のマイルストーンを再構築するため、既存 planning の 4 項目に対象外の差分が出た。その 4 項目を元の内容へ戻し、[[prj-0001:sch-milestones]] は従来の全項目を保持して本 track の 10 項目のみ追加した。他 track の strategy・track は変更していない。
4. `node --import tsx src/specdojo.ts exec refresh --project prj-0001`、`node --import tsx src/specdojo.ts exec validate --project prj-0001 --schedule-only`、schedule 3 ファイルの `npm run validate:schema:file`、`node --import tsx tools/catalog-validate-if-configured.mjs` は成功した。schedule 検証の旧タスク ID の履歴警告、catalog 検証の既存参照・未作成文書の警告は対象外として保持した。
5. Prettier による整形、`npm run validate:history-links`、`node --import tsx src/specdojo.ts register build --project prj-0001`、`git diff --check` は成功した。生成タスクと strategy の一致、全 7 件の intent・owner 網羅、全段の指示、人の確定のゲート依存、既存マイルストーンの不変も確認した。全体の `npm run validate:schema`・`npm run lint:md` など、指定された親検証は executor では重複実行せず、親 runner の結果を正とする。

### 5.5. 引き継ぎ

- strategy の単純な再生成は、追加した maintenance の段・各段の指示・agent 指定を標準 profile に戻す。今後も `--force --dry-run` の差分を確認し、本項の意図を保って必要な追加段を再適用してから build する。
- schedule build を再実行すると、既存 planning の `M-PLANNING-planning`、`G-PLANNING-first-pass`、`G-PLANNING-refine-pass`、`G-PLANNING-review-pass` の差分が再び出る。今回と無関係なため planning の strategy・track は直していない。別作業で整合を確認するまでは、本 track 以外の項目を保持する。
- 型確定後の business-specs-reps の磨き込み以降の再実行と代表の人による確定は、親 epic に従って別作業で行う。本項では `exec run --auto`、claim・complete 等の状態遷移、型や代表の実編集は実施していない。
- 使用量の上限時の切替は親 epic に従い、編集を argon-executor、review を agy-opus-review-executor として実行時に指定する。保護された設定の変更は不要。

### 5.6. CHANGELOG に書く事項

なし。prj-0001 内部の作業計画の追加であり、配布する型・CLI の利用者向け動作は本項で変更していない。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-t88p-business-specs-kata]]
- 規範: [[specdojo:schedule-design-guide]]、[[specdojo:rulebook-authoring-standard]]
- 前例: [[prj-0001:pjr-stm9-business-specs-reps-strategy]]
