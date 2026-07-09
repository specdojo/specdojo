_FRONTMATTER_

# Edit Plan: _PJR_ID_ _PJR_TITLE_

## 1. このタスクで行うこと

プロジェクト登録簿の項目 _PJR_ID_「_PJR_TITLE_」に対応する。

_PJR_DESCRIPTION_

## 2. 対象項目

- `id`: _PJR_ID_
- `type`: _PJR_TYPE_
- `priority`: _PJR_PRIORITY_
- `owner`: _PJR_OWNER_
- `due`: _PJR_DUE_
- `登録簿`: `_PJR_INDEX_PATH_`
- `個票`: _PJR_TICKET_REF_
- `result`: `_RESULT_REF_`

## 3. 進め方

1. 登録簿の該当行と個票（存在する場合）を読み、目的・完了条件・制約を把握する。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、その仮説を result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。
5. 判断に迷う箇所は `_TODO_` / `_ASSUMPTION_` で残し、根拠と次のアクションを result に書く。

## 4. 完了手順

1. 「進め方」に従って対応を完了する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result に実施内容・変更ファイル・申し送りを記入する。これはタスク完了に必須であり、`_TODO_` を残したまま終了しない（詳細は共通規約を参照）。
4. 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。状態遷移（review / close など）は runner と人間が行う。

## 5. 異常終了の条件

- 前提不足・対象ファイル不明・静的検査未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は登録簿の状態を変更せず、終了コードと標準エラー出力で runner に結果を返す。

_COMMON_CONVENTIONS_
