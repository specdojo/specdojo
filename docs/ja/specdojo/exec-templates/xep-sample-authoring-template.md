_FRONTMATTER_

# Edit Plan: _TASK_ID_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 新しく作る実践の型

- id: `_AUTHORING_KATA_ID_`
- kind: `_AUTHORING_KATA_KIND_`
- path: `_AUTHORING_KATA_PATH_`
- 記述標準: [[_AUTHORING_STANDARD_ID_|執筆標準]]（`_AUTHORING_STANDARD_PATH_`）
- result: `_RESULT_REF_`

手本にする既存成果物:

_AUTHORING_EXEMPLARS_

手本の成果物は読み取り専用であり、成果物そのものを変更しない。手本がない場合は、記述標準と対象領域の慣行だけを根拠に実践の型を作る。

## 3. 進め方

1. 記述標準と手本の成果物を実際に読み、複数の成果物に再利用できる規則・問い・完成例・雛形を抽出する。
2. `_AUTHORING_KATA_PATH_` に `_AUTHORING_KATA_ID_` を持つ `_AUTHORING_KATA_KIND_` を新規作成する。frontmatter の `status` は `draft` とし、`ready` へ変更しない。
3. 手本の内容を丸写しせず、プロジェクト固有の値を一般化する。手本同士が矛盾する場合は、共通部分と差異を分け、判断できない点を result の申し送りへ記録する。
4. 手本ごとに、作った種類の参照が `undecided` または未記入なら `_AUTHORING_KATA_ID_` へ更新する。rulebook は成果物カタログの `rulebook`、recipe / sample / template は成果物が参照する rulebook frontmatter の同名フィールドを正本とする。
5. 参照がすでに別の kata を指す場合は上書きせず、その成果物 ID・既存参照・新しい kata ID を result の申し送りへ記録する。`not-needed` も意図的な判断として上書きしない。
   recipe / sample / template の作成時に、手本の rulebook 自体が `undecided`・未記入・`not-needed` で参照先を記録できない場合は、別種の kata を同時作成せず、付け替え不能として result へ記録する。
6. 新しい kata と参照の更新だけを変更対象とし、手本の成果物本文は変更しない。

## 4. 完了手順

1. 新しい実践の型と、条件を満たす参照の更新を完了する。
2. 共通規約に従って必要な整形・静的検査を実行する。
3. result に実施内容、変更ファイル、手本、一般化した内容、参照を更新しなかった理由を記録する。

## 5. 異常終了の条件

- 新しい id が既に存在する、対象種別と id の末尾が一致しない、手本を解決できない、または検査が未解消の場合は異常終了する。
- 手本の成果物本文へ変更が生じた場合は元に戻し、解消できなければ異常終了する。
- agent 自身は登録簿の状態を変更しない。

_COMMON_CONVENTIONS_
