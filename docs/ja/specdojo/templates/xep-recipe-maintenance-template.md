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

**done_criteria:**

_DONE_CRITERIA_ITEMS_

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **_OWNER_ROLE_LABEL_**
- 責務: _OWNER_ROLE_NOTE_

このロールが重視するレビュー観点:

_OWNER_ROLE_VIEWPOINTS_

## 4. 進め方

- 参照の向きを「成果物 → recipe」に切り替えて進める。
- 対象成果物に紐づく recipe を「見直す対象」として扱う。
- 複数の成果物、review result、対象領域の慣行を根拠に、問い・観点・深掘り手順・レビュー観点が良い内容の作成に役立っているかを見直す。
- 成果物で繰り返し不足する内容や review で繰り返し指摘される箇所があれば、それを引き出す問い・観点を recipe に追加する。
- rulebook と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。
- 見直しの根拠とした成果物・記録を result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って recipe を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
