_FRONTMATTER_

# Edit Plan: _TASK_ID_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

- `name`: _DELIVERABLE_NAME_
- `depends_on`: _DELIVERABLE_DEPENDS_ON_
- `overview`: _DELIVERABLE_OVERVIEW_
- `path`: `_DELIVERABLE_PATH_`
- `result`: `_RESULT_REF_`

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **_OWNER_ROLE_LABEL_**
- 責務: _OWNER_ROLE_NOTE_

このロールが重視するレビュー観点:

_OWNER_ROLE_VIEWPOINTS_

## 4. 進め方

参照の向きを「成果物 → template」に切り替え、対象成果物に紐づく template を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行は、いずれも実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

1. 見直し対象の template を読み込み、現状の章構成の骨組みとプレースホルダの配置・網羅性を把握する。
2. 複数の成果物・review result・対象領域の慣行を根拠に、それらが成果物作成の開始点として適切かを見直す。
3. 成果物間で共通する定型部分は雛形の本文に取り込み、成果物ごとに内容が異なる部分は `_TODO_` などのプレースホルダとして配置する。
4. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

見直した template は [[template-authoring-standard]]（構成・プレースホルダ規約・禁止事項の正本）に従う。rulebook / recipe / sample と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo-reference-materials-guide]] の「参考資料メンテナンスの進め方」を参照する。本タスクの実行に必要な template メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- 見直しの根拠とできる成果物・review result が不足し、template の改訂が妥当か判断できない場合は、その事実と判断を result の `参考資料の活用` セクションに記録する。
- 根拠不足のまま推測で template を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の template が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `参考資料の活用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って template を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`参考資料の活用` セクションを記入する。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

_COMMON_CONVENTIONS_
