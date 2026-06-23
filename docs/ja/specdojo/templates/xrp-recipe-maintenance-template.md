_FRONTMATTER_

# Review Plan: _TASK_ID_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

- `name`: _DELIVERABLE_NAME_
- `depends_on`: _DELIVERABLE_DEPENDS_ON_
- `overview`: _DELIVERABLE_OVERVIEW_
- `path`: `_DELIVERABLE_PATH_`
- `rulebook`: `_RULEBOOK_REF_`
- `result`: `_RESULT_REF_`

## 3. レビュー観点

<!-- markdownlint-disable MD055 MD056 -->
| ID | ロール | viewpoint_id | 確認基準 |
|---|---|---|---|
_REVIEW_VIEWPOINT_ROWS_
<!-- markdownlint-enable MD055 MD056 -->

_REVIEW_VIEWPOINT_DETAILS_

## 4. 進め方

確認の向きを「成果物 → recipe」に切り替え、対象成果物に紐づく recipe の見直し内容が妥当かを確認する。根拠となる成果物・review result・対象領域の慣行は、いずれも実際に読み込んだうえで照合する。読み込まずに記憶や推測で代替しない。レビューでは recipe を編集するのではなく、見直し内容が妥当かを照合する。

1. 見直し対象の recipe を読み込み、改訂後の問い・観点・深掘り手順・レビュー観点を把握する。
2. 複数の成果物・review result・対象領域の慣行と照らし、それらが良い内容の作成に役立つものになっているかを確認する。
3. 見直し内容が [[recipe-authoring-standard]]（章立て・記述ルール・禁止事項の正本）に従っているか確認する。
4. rulebook と記述が矛盾していないか確認する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo-reference-materials-guide]] の「参考資料メンテナンスの進め方」を参照する。本タスクの実行に必要な recipe メンテナンス確認の方針は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- 見直しの根拠とできる成果物・review result が不足し、改訂の妥当性を判定できない場合は、観点を unclear のまま放置せず、その事実と判断を review result の `参考資料との整合確認` セクションに記録する。
- 根拠不足のまま改訂が正当化できない箇所は findings に挙げる。

### 4.2. 判断根拠の記録

確認の根拠とした成果物・review result と判断根拠を review result に残す。記録先は次のとおり。

- レビュー観点ごとの pass / fail / unclear 判定と根拠: review result の `レビュー観点別結果` セクション（各 `RVP-NNN`）。
- 根拠とした成果物・review result、改訂内容の妥当性判断、矛盾時に rulebook を正とした箇所: review result の `参考資料との整合確認` セクション。
- 検出した問題点・指摘事項: review result の `findings` セクション。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。result には各 RVP の `### RVP-NNN（ロール: viewpoint_id）` と `確認基準` が展開済みなので、`result` / `evidence` / `notes` を埋める。
3. `evidence` の参照は `[[id]]` 形式（Obsidian wikilink）で記載する。行番号アンカー（`#L12-L18` など）や絶対パスは使わない。位置の補足が必要な場合は `evidence` 本文で述べる。
4. fail / unclear、または recommendation が revise / reject でも、レビュー結果を記録できた場合は正常終了する（終了コード 0）。

## 6. 異常終了の条件

- 対象ファイル不明・依存未解決・result 更新不能など、レビュー自体を完了できない場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- agent 自身は claim / complete / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

_COMMON_CONVENTIONS_
