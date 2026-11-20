---
specdojo:
  id: specdojo:dct-rulebook
  type: rulebook
  deliverable_type: project
  status: draft
  target_format: yaml
  sample: specdojo:dct-sample
---

# 成果物カタログ（ドメイン別）作成ルール

Deliverables Catalog (Domain) Documentation Rulebook

ドメイン別成果物カタログ（`dct-<domain>.yaml`）に、成果物の `local_id`・`kind`・`depends_on`・配置先・`done_criteria` を machine-readable に一覧化し、スケジュール展開・レビュー計画生成・トレーサビリティの基礎とするためのルールを定める。構造の詳細は `docs/specdojo/schemas/v1/dct.schema.yaml` を SSOT とし、本ルールは schema で表せない運用方針を補う。

## 1. 全体方針

- カタログはメタ情報（ID・種別・依存・配置先・概要・完了条件）の管理に専念し、個別成果物の本文は各成果物ファイルを正とする。
- 漏れ・重複・所在不明を防ぐため、プロジェクトで発生するすべての成果物をいずれかのドメインカタログに記載する。
- 共通事項は `dct-index` の「共通ルール」を SSOT とし、本ルールと成果物で再定義しない。
- 実践の型の構成: template はドメインごとの `dct-<domain>-template.yaml`（物理分割時は `dct-<domain>-<part>-template.yaml`）で、`catalog scaffold` が `domain` から選ぶ。1 つの ID しか持てない frontmatter の `template` では表せないため宣言しない。
- 共通の運用: 役割の割り当ては適用先のメンバー定義に、`status` の昇格と承認、改訂と廃止、未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従い、本書と成果物で言い直さない。文書の整形・lint はリポジトリの検証で扱う。

## 2. 位置づけ

```mermaid
flowchart LR
  DCT_IDX["dct-index<br>成果物カタログ索引"]
  DCT_DOM["dct-&lt;domain&gt;.yaml<br>ドメイン別成果物カタログ"]
  ART["成果物本体<br>&lt;local_id&gt;.md 等"]

  DCT_IDX --> DCT_DOM --> ART

  classDef target stroke-width:4px
  class DCT_DOM target
```

`dct-index` の索引から各カタログを参照し、成果物本体は `base_path` と各成果物の `path` から解決する。

## 3. ファイル命名・ID規則

### 3.1. ファイル命名規約

- ファイル名は `dct-<domain>.yaml` とし、`<domain>` は `domain` キーの値と一致させる（例: `dct-project-management.yaml`）。
- 1 ドメインを物理分割する場合は `dct-<domain>-<part>.yaml` とし、各ファイルの `domain` は分割前の `<domain>` を保つ。`<part>` は分割軸を表す kebab-case とし、成果物種別で分割する場合は成果物 ID の接頭辞を用いる（例: `dct-data-model-bdd.yaml`・`dct-data-model-cdsd.yaml` はいずれも `domain: data-model`）。判断基準は `物理分割（1 ドメイン複数ファイル）` を参照する。
- テンプレートは `dct-<domain>-template.yaml`（物理分割時は `dct-<domain>-<part>-template.yaml`）とし、`type: template` で記述する。scaffold で `dct-<domain>-<part>.yaml` に展開され、`catalog build` で同一 `domain` としてマージされる。

### 3.2. ID・識別子規約

- `id` は `type: project` では `<project-id>:dct-<domain>`、テンプレートでは `dct-<domain>-template` とする。物理分割時は末尾に `-<part>` を付ける（例: `prj-0001:dct-data-model-bdd`、`specdojo:dct-data-model-bdd-template`）。
- `domain` は kebab-case で、先頭は英小文字または数字、最大 63 文字とする。
- `project_id` は `type: project` で必須とし、配置先プロジェクト ID と一致させる。
- `local_id` は `type: project` では英小文字・数字・ハイフンのみとし、プロジェクト内で一意にする。
- 反復作成する成果物は、ファミリーを表す固定の `local_id` と実体 ID の規則を表す `instance_id_pattern` を分ける（`反復成果物` を参照）。

## 4. 推奨メタ項目

YAML 成果物のため、ファイル先頭のトップレベルキーとして記載する。

| キー         | 説明                                                        | 必須           |
| ------------ | ----------------------------------------------------------- | -------------- |
| `id`         | 成果物 ID（例: `prj-0001:dct-project-definition`）          | ○              |
| `type`       | `project` / `template`                                      | ○              |
| `status`     | `draft` / `ready` / `deprecated`                            | ○              |
| `title`      | ドキュメント名。表示ページの見出しになる                    | ○              |
| `rulebook`   | `specdojo:dct-rulebook`                                     | ○              |
| `part_of`    | 親となる `dct-index` の `id`（配列）                        | 任意           |
| `project_id` | プロジェクト ID（例: `prj-0001`）                           | ○（`project`） |
| `domain`     | ドメイン識別子。ファイル名 `dct-<domain>.yaml` と一致させる | ○              |
| `base_path`  | ドメインの既定ディレクトリ。先頭 `/` の絶対パスで記載する   | 任意           |

## 5. 本文構成（標準テンプレ）

### 5.1. ルート構造

ルートは「推奨メタ項目」のキーと、グループ（章）の配列 `groups`（必須）で構成する。`type: project` では、成果物がまだない領域を空配列 `[]` で表せる。

### 5.2. `groups[]`（グループ）

各グループは Markdown カタログの章に対応する。葉グループは `deliverables` を、親グループは子 `groups` を持ち、両方を同時に持たない。schema（`anyOf`）は両方を持つ構造も受理するため、この境界はレビューで確認する。

| フィールド     | 必須 | 内容                                              |
| -------------- | ---- | ------------------------------------------------- |
| `name`         | 任意 | 章タイトル（例: `管理計画`）                      |
| `base_path`    | 任意 | グループの配置先ディレクトリ                      |
| `note`         | 任意 | グループへの補足（例: `WBSへの落とし込み対象外`） |
| `groups`       | 条件 | 子グループの配列（親グループ）                    |
| `deliverables` | 条件 | 成果物エントリの配列（葉グループ）                |

### 5.3. `deliverables[]`（成果物エントリ）

| フィールド            | 必須        | 内容                                                          |
| --------------------- | ----------- | ------------------------------------------------------------- |
| `local_id`            | ○           | 成果物の論理名（例: `prj-overview`）                          |
| `instance_id_pattern` | 任意        | 反復成果物の実体 ID 規則（例: `pjr-{sequence}-{term}`）       |
| `name`                | ○           | 業務ユーザーが理解できる日本語名                              |
| `kind`                | ○           | `work` / `control` / `generated`                              |
| `depends_on`          | 任意        | 直接依存する成果物の `local_id` 配列。なければ `[]`           |
| `overview`            | ○           | 成果物の目的を 1 文で記述                                     |
| `brief`               | 任意        | 成果物の外から継続して渡す前提（技術スタックや制約など）      |
| `path`                | ○（`work`） | 成果物のファイルパス                                          |
| `rulebook`            | 任意        | rulebook の完全 ID、未判断は `undecided`、不要は `not-needed` |
| `evidence_refs`       | 任意        | `retrofit` で読む非成果物エビデンス                           |
| `done_criteria`       | ○（`work`） | 完了条件の配列                                                |
| `note`                | 任意        | 構造化フィールドで表せない補足                                |

### 5.4. `evidence_refs[]`（非成果物エビデンス）

| フィールド | 必須 | 内容                                                       |
| ---------- | ---- | ---------------------------------------------------------- |
| `kind`     | ○    | エビデンス種別。現在は `implementation` のみ               |
| `path`     | ○    | リポジトリルート相対のファイルまたは限定されたディレクトリ |
| `purpose`  | ○    | この参照から確認する現在動作・制約                         |

### 5.5. `done_criteria[]`（完了条件）

| フィールド  | 必須 | 内容                                                                                |
| ----------- | ---- | ----------------------------------------------------------------------------------- |
| `text`      | ○    | 成果物が満たすべき検証可能な条件                                                    |
| `roles`     | ○    | 条件を確認するロールコード配列（`PO`・`PM`・`BA`・`ARC`・`DEV`・`QE`・`UX`・`OPS`） |
| `viewpoint` | ○    | 主たるレビュー観点 ID（`pm-review-viewpoints.yaml` の `vp-*`）                      |

## 6. 記述ガイド

### 6.1. グループ構成

- `type: project` で `groups` を `[]` にするのは、対象領域に成果物がまだない場合に限る。`groups` の省略や配列以外の値は認めない。テンプレートには 1 つ以上のグループを定義する。
- サブドメインに分かれない場合は、単一の葉グループに `deliverables` を並べる（平坦型）。
- サブドメインが 2 つ以上ある場合は、親グループの `groups` 配下に `name`・`base_path`・`deliverables` を持つ子グループを並べる（章分割型）。

### 6.2. `kind`（種別）

- `work`: スケジュール展開対象。成果物を実際に作成する作業に対応し、`path` と `done_criteria` が必須。
- `control`: プロジェクト管理・統制文書。スケジュール展開対象外。
- `generated`: 自動生成・派生成果物。スケジュール展開対象外で、`rulebook` が記載されていても実践の型を適用しない（`kind` から導出する）。

計画成果物は生成方法ではなくライフサイクルで区別する。

- 人または agent が判断して更新する `dct-index`、`dct-plan-<domain>`、`sch-strategy-<track>`、`sch-defaults` は `work` とする。
- `sch-track-<track>` と `sch-milestones` は strategy から再生成できるため `generated` とし、生成元の `sch-strategy-<track>` を `depends_on` に宣言する。テンプレートでも同じとする。
- 計画成果物を所有するトラック自身の `sch-strategy` は、自己生成の循環を避けるため `control` とするか、そのトラックの scope 外へ置く。
- 全体計画は登録簿の epic を正本とする（[[specdojo:register-operation-guide|登録簿運用ガイド]]）。非推奨の `tml-index` は新しく登録せず、移行時に旧エントリと不要な依存を外す。
- `dct-<domain>.yaml` 自身と `generated/` 配下の表示用生成物は、二重管理を避けるため登録しない。
- トラック別の strategy・track の `local_id` は、対象 epic の範囲のカタログを人間が確認し、`catalog-planning` の子 todo を完了させてから追加する。未着手トラックの分を先行登録しない。

### 6.3. `depends_on`

- 依存がない場合は空配列 `[]` とする。
- 参照先は同一カタログまたは他ドメインカタログの `local_id` とし、ファイルパスや URL を混在させない。
- 反復成果物は、`instance_id_pattern` ではなく固定の `local_id` を参照する。

### 6.4. 実践の型の要否宣言

- カタログは成果物と rulebook の対応だけを `rulebook` に宣言し、recipe / sample / template の要否と所在は参照先 rulebook の frontmatter を正本とする。
- `rulebook` には実在する rulebook の完全 ID を記載する。要否未判断は `undecided`、不要は `not-needed`、省略は必要だが未整備を表す。`catalog validate` は完全 ID の実在を検証する。
- `rulebook: none` は成果物本体のメタ情報で「準拠 rulebook なし」を表す値であり、カタログでは使わない。
- recipe / sample / template の `undecided` は未整備として扱い、`not-needed` は欠落とみなさず `*-maintenance` の対象にも含めない。要否を再検討する場合は、先に rulebook frontmatter を更新する。

### 6.5. `evidence_refs`

- `approach: retrofit` の edit / review plan に「実装エビデンス」として展開される調査入力である。`depends_on` のような成果物間の根拠・実行順序や、`based_on` のような文書 ID 参照には使わない。
- `path` は先頭スラッシュなしのリポジトリルート相対パスとする。`catalog validate` が存在と同一成果物内の重複を検証する。
- `path` は責務単位に限定し、`src`・`tools`・`docs`・リポジトリルートのような広い範囲を指定しない。状態遷移・判定・検証の本体を含むファイルを参照し、入口が re-export だけなら転送先をたどる（`catalog validate` は re-export だけのファイルを警告する）。
- `purpose` はファイル名の言い換えではなく、入出力・状態遷移・例外など、その参照から何を確認するかを記載する。
- 実装エビデンスは読み取り専用であり、plan の `targets`、worktree の変更許可範囲、commit 許可リストへ追加しない。

### 6.6. `base_path` と `path` の解決

- 先頭が `/` のパスはリポジトリルートからの絶対パス、先頭が `/` でないパスは最も近い祖先（グループまたはドメイン）の解決済み `base_path` に連結する相対パスとして解決する。
- ドメインの `base_path` は絶対パス（先頭 `/`）で記載する。schema が先頭 `/` を必須とする。
- 解決結果は先頭スラッシュなし・POSIX 区切りのリポジトリルート相対パスを正準形とし、dct ビュー・exec plan・doc-index など下流の表記に先頭 `/` を残さない。

### 6.7. `done_criteria`

- `work` 成果物には 1 件以上の完了条件を記載する。
- `text` は「確認できること」「識別できること」など検証可能な形で書き、前提や指示ではなく成果物が達成した振る舞い・状態を記載する。
- `roles` には条件を確認する責務を持つロールコードだけを記載し、`viewpoint` には `vp-*` の ID を 1 つ記載する。

### 6.8. 反復成果物

- `local_id` にはファミリーを表す固定の kebab-case を使い、実体 ID の規則は `instance_id_pattern` に分ける（例: `pjr-{sequence}-{term}`、`pr-{yyyy}-{mm}-{dd}`）。
- プレースホルダは小文字を波括弧で囲み、固定語はハイフンで連結する。

### 6.9. テンプレート固有項目

- `min_size`（`small` / `medium` / `large`）は規模に応じた取捨選択のための項目で、`type: template` だけに書く。scaffold 時に除去される。schema は `type: project` でも受理するため、レビューで確認する。
- テンプレートでは `local_id` や `part_of` にアンダースコアで囲んだプレースホルダ（例: `_PROJECT_ID_:dct-index`）を使用できる。

### 6.10. 業務領域テンプレートの反復方針（`_TERM_` の使い分け）

- `local_id` に `_TERM_` を含む項目（例: `cdfd-_TERM_`）は、パターンA（複数業務領域）を既定とする。業務領域ごと（例: 販売/調達/会計）に項目を複製し、`_TERM_` を各領域の略称へ置き換える。
- 対象業務が単一で、局面・処理内容ごとに複数項目へ分割する場合はパターンB（単一領域・複数項目）とし、`_TERM_` を使わず項目ごとに固定の `local_id` と `done_criteria` を記載する。実例は `prj-0001:dct-data-flow` である。
- どちらのパターンでも項目数に上限はない。テンプレートの 1 件は書式サンプルであり、必要な数だけ記載する。

### 6.11. 物理分割（1 ドメイン複数ファイル）

- 反復要素が多く単一ファイルが肥大化するドメインは、論理ドメインを保ったまま `dct-<domain>-<part>.yaml` へ物理分割してよい。`catalog build` は同一 `domain` のファイルをファイル名の昇順でマージし、`dct-<domain>.md` を 1 つ生成する。
- 同一階層の名前付き group は `name` の完全一致で 1 章へ結合する。章の位置と `base_path`・`note`・`min_size` は最初に現れた group の値を採用し、`deliverables` はファイル名昇順・定義順で追記する。同名の子 `groups` にも再帰的に適用する。名前が異なる group は別章とし、無名 group はファイル名昇順で見出しなしで連結する。
- 同名 group の `base_path` と、同一 `domain` の各ファイルの `project_id`・`base_path` は一致させる。章の並びを制御したい場合は `<part>` の命名で順序を表す。
- 分割ファイル間で `local_id` が重複するとマージがエラーになる。`id`・`title` 等のメタ情報はファイル名昇順で先頭のファイルの値を採用するため、分割しても一貫させる。

### 6.12. 成果物カタログ判定計画（`dct-plan-<domain>.yaml`）

- 上流成果物からどの成果物インスタンスが必要かを agent が判定した結果は、`dct-plan-<domain>.yaml` に保存する。構造の SSOT は `docs/specdojo/schemas/v1/dct-plan.schema.yaml` とする。
- 配置先は成果物カタログディレクトリ配下の `plans/` とし、`catalog validate` / `catalog build` の対象と混同しないよう `dct-*.yaml` と同じ階層に置かない。`generated/` の派生ビューとは異なり、バージョン管理対象の正本である。
- 書くのは、必要な成果物インスタンス・placeholder 値・採用しない候補・未確定事項・判定根拠・確度に限る。`groups`・`base_path`・`done_criteria` などのカタログ構造はテンプレートとジェネレーターの責務であり、複製しない。
- `iteration_pattern` はパターンAを `pattern-a`、パターンBを `pattern-b` とする。`pattern-a` では placeholder ごとに値と根拠を `variables` へ書き、`local_id` を展開結果と一致させる。`pattern-b` では `variables` を使わず固定の `local_id` を記載する。
- 上流成果物から根拠を得られない placeholder・要否・名称・依存関係は確定させず、`open_questions` に理由と次のアクションを残す。
- 入力は epic の `domains` が示す対象ドメインの上流成果物とし、関係する data-flow 成果物をすべて含める。data-flow がないドメインでは入力文書を明示する。既存カタログがあれば基準線として含め、既存 `local_id` を落とす場合は `exclusions` に理由を残す。
- 既存の判定計画は再判定時に差分をレビューし、上書きは `--force` で明示する。判定計画の存在だけで、カタログの内容確認や `catalog-planning` の完了を代替しない。

### 6.13. 判定計画からの決定論的生成

- 判定計画からの生成は `catalog scaffold --plan --domain <domain>` を使い、`--var` は併用しない。placeholder 値は根拠付きの `variables` を正本とする。
- `min_size`・placeholder 展開・`part_of`・`domain`・`base_path`・group 構造・物理分割は scaffold と共通の処理で適用する。
- blocking な `open_questions`、未解決 placeholder、重複 `local_id`、存在しない `depends_on`、schema 違反が 1 件でもあれば、その domain のファイルを書き込まない。
- 差分は `--dry-run` で確認し、内容の異なる既存ファイルの上書きには `--force` を要する。
- 生成されたカタログの `status` は template に従い `draft` のままとし、人間の内容確認を経て `catalog-planning` の完了を記録する。

### 6.14. `brief`・`overview`・`done_criteria` の使い分けと YAML アンカー

- `overview`: 成果物の目的・責務を 1 文で書く。カタログの表示ページの一覧に載り、ドメインの俯瞰に用いる。
- `brief`: 採用する技術スタック、アーキテクチャ上の制約、設計・選定方針など、成果物の外から継続して渡す前提を書く。schedule・register の plan に「前提」として展開され、未指定なら載らない。
- `done_criteria`: 「`done_criteria`」の記述ガイドに従う。
- 複数の成果物で前提を共有する場合は、同一ファイル内で YAML のアンカー（`&anchor`）を定義し、各 `brief` からエイリアス（`*anchor`）で参照する。

## 7. 禁止事項

| 禁止事項                                                                 | 理由                                                            |
| ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| 成果物の詳細本文（仕様・手順・構成図など）をカタログに記載する           | 詳細は成果物本体に集約するため                                  |
| `kind` を `work` / `control` / `generated` 以外に拡張する                | スケジュール展開・レビュー生成の前提が崩れるため                |
| 同一 `local_id` を複数ドメインのカタログに重複して記載する               | トレーサビリティとスケジュール展開が破綻するため                |
| 1 つのグループに `groups` と `deliverables` を両方持たせる               | 親グループと葉グループの境界が曖昧になるため                    |
| `type: project` に `min_size` を書く                                     | scaffold 後の項目であり、規模による取捨選択の結果と食い違うため |
| `evidence_refs.path` に広すぎる範囲や re-export だけのファイルを指定する | 調査範囲を限定できず、判定・検証の本体が漏れるため              |
| 実在しない実践の型 ID、またはカタログで `rulebook: none` を使う          | 未判断・未整備・不要・参照切れを機械的に区別できないため        |
| `dct-plan-<domain>.yaml` にカタログ構造や自由文の判断メモを書く          | ジェネレーターが機械的に扱えず責務境界が崩れるため              |
| 根拠のない placeholder 値や成果物を判定計画で確定させる                  | 推測がそのままカタログへ流れ込むため                            |
| 判定計画がある domain を `--var` 付きの通常 scaffold で再生成する        | 根拠付きの判定結果と生成入力が分岐するため                      |
| 本ルールや成果物ファイルでスキーマ定義を再掲・上書きする                 | `dct.schema.yaml` を SSOT とするため                            |
