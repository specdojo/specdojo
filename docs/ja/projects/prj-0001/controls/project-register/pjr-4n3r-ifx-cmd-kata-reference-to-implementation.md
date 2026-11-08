---
specdojo:
  id: prj-0001:pjr-4n3r-ifx-cmd-kata-reference-to-implementation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:35:12Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-HMV6
  approach: rulebook-maintenance
  targets:
    - specdojo:ifx-cmd-rulebook
---

# PJR-4N3R 外部 I/F（コマンド）（ifx-cmd）の型を、実装と同じことを書かない形に手入れする

## 1. 概要

外部 I/F（コマンド）の型を手入れする。引数・オプションの表は持たずコマンドリファレンスを参照し、入出力の約束（終了コード・作るファイル・副作用）に絞る

## 2. 入力

- 方針（indie が決定、2026-11-08）: 引数・オプションの表は持たずコマンドリファレンスを参照し、入出力の約束（終了コード・作るファイル・副作用）に絞る。
- rulebook にあわせて ifx-cmd-recipe・ifx-cmd-sample・ifx-cmd-template も揃える。

## 3. 完了条件

- [[specdojo:ifx-cmd-rulebook]] に、次の規則を書いている。
  - 引数・オプションの表は持たず、正本を参照する。SpecDojo 自身のコマンドならコマンドリファレンス、SpecDojo が起動する外部の CLI（AI provider CLI など）なら、その起動を定める設定（`exec-defaults.yaml` の `command_template`）と [[specdojo:exec-config-guide]] を正本とする。
  - 文書には、入出力の約束（渡すもの・受け取るもの・終了コードの意味・作るファイル・副作用・失敗の扱い）を書く。
- `ifx-cmd-recipe`・`ifx-cmd-sample`・`ifx-cmd-template` を新しい規則に合わせている。
- 型の変更に合わせて schema（`docs/specdojo/schemas/v1/`）を変える必要があれば変えている。その場合も、今の形で書かれた既存の文書が引き続き検査を通る（後方互換）。schema を変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 規則と sample の書き方で迷った点や、決めきれない点は `_UNDECIDED_` で残さず executor が決め、決めた内容と理由を個票の対応結果に書いている。型の確定（PJR-RZ9Q）で人が判断する材料にする。
- 成果物の文書（`docs/ja/product/` 配下）は作らず、ほかの種類の型も変えていない。ただし、この型を参照している別の型の記述（例: 関連する型の「〜との関係」の節）が食い違う場合は、その箇所だけを直している。
- CHANGELOG の未公開の版の節に型の変更を書き、公開済みの版の節を変えていない。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                                                                             | 担当     | 状態 | メモ                                                 |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ---- | ---------------------------------------------------- |
| 1   | 今の rulebook と `ifx-cmd-recipe`・`ifx-cmd-sample`・`ifx-cmd-template` を読み、実装・schema・リファレンスと重なる記述を洗い出す | executor | done | 引数・オプション表の再掲や各属性の重複を洗い出し完了 |
| 2   | rulebook に参照の規則を書き、`ifx-cmd-recipe`・`ifx-cmd-sample`・`ifx-cmd-template` を揃える                                     | executor | done | 正本参照規則および入出力の約束（6要素）に手入れ完了  |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                                                                                       | executor | done | 全検査通過、決定事項と理由を記載完了                 |

## 5. 対応結果

### 実施内容

- `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md` を改訂し、引数・オプションの表は持たず正本（SpecDojo コマンドならコマンドリファレンス、AI provider CLI 等なら `.specdojo/exec-defaults.yaml` の `command_template` と `exec-config-guide.md`、外部 CLI なら公式ドキュメント）を参照（`command.reference`）する規則に変更しました。
- 仕様書には入出力の約束（渡すもの・受け取るもの・終了コードの意味・作るファイル・副作用・失敗の扱い）に特化して記述する本文要件・記述ガイド・禁止事項を整備しました。
- `docs/ja/specdojo/samples/ifx-cmd-sample.yaml` および `docs/ja/specdojo/templates/ifx-cmd-template.yaml` を新規則に合わせ、引数表を廃止して正本参照、`files`（入力・出力ファイル）、`side_effects`、終了カテゴリ `rate_limit` を反映しました。
- `docs/ja/specdojo/recipes/ifx-cmd-recipe.md` を新規則・rulebook に合わせて手順・各要素の書き方・良い例/悪い例・レビュー観点を改訂しました。
- `yaml-pages build` を実行し、表示用ページ `docs/ja/specdojo/samples/generated/ifx-cmd-sample.md` および `docs/ja/specdojo/templates/generated/ifx-cmd-template.md` を最新 YAML から再生成しました。
- `docs/ja/specdojo/references/deliverables-reference.md` の `ifx-cmd` の主な内容の記述を新規則（正本参照、入出力ファイル、副作用など）に更新しました。
- `CHANGELOG.md` の `## [Unreleased]` の `### 変更` に本タスクの型変更内容を追記しました。

### 成果物

- `docs/specdojo/schemas/v1/ifx-cmd.schema.yaml`
- `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md`
- `docs/ja/specdojo/recipes/ifx-cmd-recipe.md`
- `docs/ja/specdojo/samples/ifx-cmd-sample.yaml`
- `docs/ja/specdojo/templates/ifx-cmd-template.yaml`
- `docs/ja/specdojo/samples/generated/ifx-cmd-sample.md`
- `docs/ja/specdojo/templates/generated/ifx-cmd-template.md`
- `docs/ja/specdojo/references/deliverables-reference.md`
- `CHANGELOG.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-4n3r-ifx-cmd-kata-reference-to-implementation.md`

### schema を変更したかどうかと理由

`docs/specdojo/schemas/v1/ifx-cmd.schema.yaml` を変更しました。

- **変更理由**:
  1. 新規則で引数・オプション表を廃止し正本参照へ一本化するため、ルートの `required` から `arguments` を除外（optional 化）しました。
  2. 正本への参照先を明記できるよう `command.properties.reference` を追加しました。
  3. 入出力の約束のうち「渡すファイル」「作るファイル」を定義できるよう `files` プロパティ（`inputs`, `outputs`）および `$defs/FileContract` を追加しました。
  4. 「副作用」を定義できるよう `side_effects` プロパティ（ルートおよび `execution.side_effects`）を追加しました。
  5. 終了カテゴリに外部連携で頻出するレート制限を表す `rate_limit` を追加しました（finding F006 解消）。
  6. 先頭メタ項目に `supersedes` を追加しました（finding F003 解消）。
- **後方互換性**:
  - `arguments` を `required` から外したのみで、`properties.arguments` のスキーマ定義自体は残しているため、従来の引数定義を含む既存文書も引き続き検査を通過します。
  - さらに、旧文書で使われうる `positional`, `config`, `position` キーを許容するようスキーマ側を補完しているため、過去の形式の文書に対する後方互換性が完全に維持されます。

### 規則と sample の書き方で executor が決めた内容と理由（PJR-RZ9Q への判断材料）

1. **`command.reference` の配置**:
   - 決定: 正本参照先をルートキーではなく `command` オブジェクトのプロパティ（`command.reference`）として配置しました。
   - 理由: 実行可能ファイル（`executable`）や目的（`purpose`）と同じコマンド実行体定義のコンテキストに属しており、上位設計書への参照である `based_on` との責務の混同を防ぐためです。
2. **「作るファイル」「渡すファイル」の表現**:
   - 決定: ルートキー `files` を新設し、その配下に `inputs`（渡すファイル配列）と `outputs`（作るファイル配列）を定義する構造を採用しました。
   - 理由: 標準入出力ストリーム（`streams`）とファイル入出力を明確に分離でき、ファイル入出力が存在しないコマンドでは `files` 自体を省略できる柔軟性を持たせるためです。
3. **「副作用」の表現**:
   - 決定: ルートキー `side_effects` を新設（および `execution.side_effects` も許容）し、外部サービスへの登録・変更や環境変化を具体的に書けるようにしました。
   - 理由: 外部 CLI 呼び出しにおいて「何が変わるのか（副作用）」と「再実行しても安全か（冪等性 `execution.idempotency`）」は密接に関わるため、副作用の内容を独立して明記できるようにしました。
4. **終了カテゴリ `rate_limit` の追加**:
   - 決定: `exit_codes[].category` の enum に `rate_limit` を追加しました。
   - 理由: AI provider CLI や外部 API ラッパー CLI ではレート制限（429 相当）が頻発し、一般的な一時失敗（`transient_failure`）と区別して待機バックオフ等の再試行制御を行う実態に即しているためです。
5. **`arguments` の扱い**:
   - 決定: 新形式では `arguments` を書かないことを rulebook で規定し、sample / template からも削除しましたが、schema 上は optional として残しました。
   - 理由: 既存文書や過去資産の後方互換性を 100% 担保しつつ、新しく作成される仕様書では正本参照への一本化を徹底するためです。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[specdojo:ifx-cmd-rulebook]]
- 後続: [[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
