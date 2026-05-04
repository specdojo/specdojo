---
name: upsert-all-instructions-samples
description: '`docs/ja/specdojo/guidelines/docs-contents-guide.md` を正として、対象となる instruction / sample を 1 件ずつ独立に作成・更新し、最後に結果を集計する Skill です。'
---

# SKILL: upsert-all-instructions-samples

`docs/ja/specdojo/guidelines/docs-contents-guide.md` の「推奨ファイル名」を正として、
対象となる instruction / sample を **1 件ずつ独立に** 作成・更新し、最後に結果を集計する Skill です。

この Skill の責務は **対象抽出・順序固定・個別実行・集計** です。
**各対象の内容判断と更新は、必ず対象ごとに独立して行い、1 ファイルずつ実行した場合と同じ厳密さを保つこと。**

## 使いどころ

- docs-contents-guide の更新に合わせて、instruction / sample を全体同期したいとき
- 追加されたドキュメント種別の instruction / sample をまとめて生成したいとき
- 命名・構成の抜け漏れを一括で検出して是正したいとき

## 呼び出す既存資産（必須）

- 対象定義（SSOT）: `docs/ja/specdojo/guidelines/docs-contents-guide.md`
- instruction 更新: `@file:.github/skills/rulebook-to-instruction/SKILL.md`
- sample 更新: `@file:.github/skills/rulebook-to-sample/SKILL.md`
- 個別ステップの詳細（instruction / sample）は各 Skill 定義を正とする。

## 基本方針

- この Skill はバッチ処理を行うが、**判断は常に対象ごとに独立**して行う。
- **前の対象で得た判断・省略・推測を次の対象へ持ち越してはならない。**
- **複数対象をまとめて判断・更新してはならない。**
- 各対象について、必要な一次情報と参照資産を確認し、**1 件ずつ結果を確定してから**次へ進む。
- 1 件ごとの処理厳密さは、instruction / sample を対象単位で個別に実行した場合と同等でなければならない。

## 引数仕様

- 引数なしの場合は docs-contents-guide の全対象を処理する。
- 引数ありの場合は、対象の絞り込みとして扱う（短縮名 / `-rulebook.md` 付き / 相対 / 絶対を許容）。
- 複数指定可（スペース区切り / 改行区切り / カンマ区切り）。
- 同一対象の重複指定は 1 件に正規化する。

## 対象抽出ルール（docs-contents-guide 準拠）

`推奨ファイル名` 列から対象を抽出し、次の規則で rulebook ターゲット名へ正規化する。

1. 単一名（例: `imp-business`）
   - ターゲット: `imp-business`
2. カンマ列挙（例: `mip-index`, `mip-<term>`）
   - 各要素を個別対象として扱う
3. `*-index` と `*-<term>` の両方がある系列
   - ターゲット: `<prefix>-index` と `<prefix>` の 2 件
   - 例: `utc-index`, `utc-<term>` → `utc-index`, `utc`
4. `*-<term>` のみがある系列
   - ターゲット: `<prefix>`
   - 例: `br-<term>` → `br`
5. `<...>` を含むプレースホルダは具体 ID ではないため、上記 3/4 の系列規則で変換する

補足:

- `推奨ファイル名` が `/` で終わるディレクトリ（例: `020-product-change/010-as-is/`）の場合は、instruction / sample を生成しない。
- docs-contents-guide に記載されていても、運用対象外と明示されたものがある場合は対象単位でスキップする。

## 実行手順（固定順）

1. docs-contents-guide から対象セットを抽出し、正規化する
2. 対象を名前順で固定する（再現性確保）
3. 各対象について、以下を **独立に** 実行する
   1. 対象名を確定する
   2. docs-contents-guide の該当根拠を確認する
   3. 対応する rulebook の存在を確認する
   4. `rulebook-to-instruction` をその対象のみに対して実行する
   5. instruction の結果をその場で確定して記録する
   6. `rulebook-to-sample` をその対象のみに対して実行する
   7. sample の結果をその場で確定して記録する
4. 途中失敗があっても、残り対象の処理を継続する
5. 全対象の個別処理が終わった後にのみ、`npm run -s lint:md` を実行する

## 対象ごとの処理ルール

- 各対象は **1 件ずつ** 処理すること。
- ある対象の処理中は、その対象以外を同時に判断しないこと。
- **前の対象で見た構成や差分を理由に、次の対象の確認を省略してはならない。**
- 各対象の処理順は **`rulebook-to-instruction` → `rulebook-to-sample`** に固定する。
- instruction と sample は、その対象について **個別に結果を確定してから** 次の対象へ進む。
- 既存ファイルがある場合は差分アップサートを優先し、全置換を避ける。
- ある対象で失敗しても全体処理は停止しない（fail-soft）。
- 対応する rulebook が存在しない対象は、対象単位で failed または skipped として記録する。
- 失敗や不確実性はその対象のみに閉じ込め、他対象の処理基準を緩めてはならない。
- lint は最終検証であり、対象ごとの厳密な確認の代替ではない。

## 禁止事項

- docs-contents-guide 以外を一次情報として対象追加しない。
- rulebook 自体は本 Skill の更新対象に含めない。
- 章構成・必須項目・禁止事項は各個別 Skill の定義を正とする。
- 複数対象をまとめて推測・一括判断しない。
- 類似して見える対象について、未確認のまま同じ内容を機械的に流用しない。
- 対象ごとの結果確定前に、複数対象分をまとめて後から判定しない。

## 出力形式

### 1. 実行前

- 対象件数
- 対象一覧（実行順）

### 2. 対象ごとの結果

各対象ごとに必ず以下を記録する。

- `target`: `<target-name>`
- `instruction`: updated / created / skipped / failed
- `sample`: updated / created / skipped / failed
- `changed_files`: 変更ファイルがあれば列挙
- `reason`: skipped / failed の場合は理由を簡潔に記載

### 3. 最終結果

- 対象件数（総数 / 更新 / 新規 / スキップ / 失敗）
- 変更ファイル一覧
- 失敗対象一覧
- 未処理対象一覧（途中中断時のみ）
- lint 結果

## 注意事項

- 途中中断時は、未処理対象と失敗対象を分けて記録する。
- 精度を優先し、対象ごとの独立確認を崩してまで処理速度を優先しないこと。
