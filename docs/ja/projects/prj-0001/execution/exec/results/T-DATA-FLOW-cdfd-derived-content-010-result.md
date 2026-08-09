---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-derived-content-010
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-derived-content-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-derived-content-010-plan.md
  started_at: "2026-08-09T21:15:00.790Z"
  completed_at: "2026-08-09T21:24:00.238Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: retrofit
  targets:
    - prj-0001:cdfd-derived-content
---

# Edit Result

## 1. 実施内容

対象成果物が存在しなかったため、判断は「新設」とした。指定された実装エビデンス四件を全行確認し、先行 CDFD、プロジェクトコンテキスト、成果物カタログの done_criteria、CDFD rulebook と照合して `P-08 派生生成` の現行フローを作成した。

- `deliverable scaffold` を人が編集する成果物本体の一度限りの材料化、`exec refresh`・`catalog build`・`register build`・`yaml-pages build`・`index build` を再生成可能な派生処理として区別した。
- 一括 `build` の既定順を `exec` → `catalog` → `register` → `yaml-pages` → `index` とし、先行処理失敗時は後続を起動しない経路を表と図で対応させた。
- 個票 Frontmatter・本文から、登録項目一覧、状態別、優先度別、担当者別、type 別の各ビューへ展開する関係を記載した。
- 成果物本体、生成マーカーを持つ YAML 表示ページ、直接編集不可の派生ビュー・索引について、再生成時の上書き境界を分離した。
- 正本不足、検証失敗、部分生成失敗、ID 重複、生成先競合、陳腐化について、停止範囲と再実行経路を主要例外として定義した。
- 指定エビデンスで確認できない `watch` の詳細と、不要生成物の削除方針は推測せず未決事項にした。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-derived-content.md`（新設）
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-derived-content-010-result.md`

検証結果:

- `npx prettier --write docs/ja/product/010-business-specs/010-data-flow/cdfd-derived-content.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-derived-content-010-result.md`: 成功。
- `npx markdownlint docs/ja/product/010-business-specs/010-data-flow/cdfd-derived-content.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-derived-content-010-result.md`: 成功。
- `npx remark docs/ja/product/010-business-specs/010-data-flow/cdfd-derived-content.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-derived-content-010-result.md --quiet --frail`: 成功。
- `npx tsx src/specdojo.ts catalog validate`: sandbox が IPC socket の listen を許可しないため、起動前に `EPERM` で停止した。代替の `node --import tsx src/specdojo.ts catalog validate` は終了コード 0 で、全 8 カタログが `OK`。未作成の別成果物に関する既存 warning のみだった。
- `npx tsx src/specdojo.ts index build`: 同じ `EPERM` で起動前に停止した。代替の `node --import tsx src/specdojo.ts index build` は終了コード 0 で、`.specdojo/doc-index.json` に 1022 entries を生成した。
- `npm run docs:build:mermaid`: `tsx` の IPC socket 制約で起動前に停止した。代替の `node --import tsx tools/docs/src/gen-mermaid-svg.ts` は Chromium sandbox の起動制約で、変更対象ではない先行文書の最初の図を描画する前に停止した。この検査は pre-commit の必須対象ではなく、対象 Markdown の構文検査は上記 `markdownlint` と `remark` で完了した。
- `git diff --check`: 成功。

## 3. 申し送り

### 3.1. 未反映の乖離

| ID     | 分類               | 乖離                                                                                                                                                                                                                    | 今回の判断                                                                                                                                   | 変更候補                                                                                                                                   |
| ------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `G-01` | 未確認             | done_criteria は一括 `build/watch` の起動関係を要求するが、`watch` 実装は evidence_refs に含まれない。既存コマンド文書の scope 一覧には `yaml-pages` がなく、`src/build-command.ts` の一括 build とは列挙が一致しない。 | `watch` は変更検知から対象 build を起動する意図だけを成果物へ保持し、監視対象、順序、失敗後の継続、`yaml-pages` 参加を `U-01` とした。       | `watch` 実装を別の調査対象として承認し、コマンド文書・done_criteria・一括 build と scope を整合させる。                                    |
| `G-02` | 現在動作と目的の差 | `src/doc-index.ts` は読み取り不能・解析不能ファイルを収集対象から黙って除外し、`src/yaml-pages.ts` は現存する対象だけを生成して不要ページを削除しない。指定エビデンスには生成物の鮮度記録や古い生成物の自動検知がない。 | 陳腐化時は派生物から正本へ書き戻さず、再生成結果と差分を確認する経路を `E-07` に置いた。自動削除・検知方式は実装から推測せず `U-02` にした。 | 解析不能入力を warning / error にする鮮度検証と、孤立した生成物を検出する check または安全な prune を別タスクで設計する。                  |
| `G-03` | 現在動作の制約     | `src/catalog-generate.ts` は YAML ファイルまたは成果物単位のエラーを収集しながら他対象の生成を続けるため、呼び出し側の終了判定次第では一部だけが書き込まれた状態になる。                                                | 部分生成を集合全体の完了とみなさず、生成済み・未生成を区別して失敗 scope を再実行する `E-02`・`E-03` を定義した。                            | `deliverable scaffold` のコマンド入口で `errors` が一件でもあれば非ゼロ終了し、written / skipped / errors を明示する契約を維持・検証する。 |
| `G-04` | 文書の不整合       | [[prj-0001:pjr-0068-auto-generate\|PJR-0068]] は `item_status` が `done` だが、完了条件・作業内容・対応結果に未記入プレースホルダが残り、`watch` の承認済み詳細を根拠にできない。                                       | 結論欄の「watch コマンドを追加」とコマンド文書を存在意図の根拠に限定し、詳細仕様には採用しなかった。                                         | PJR-0068 の完了根拠を復元するか、後継 PJR で現行 `watch` の責務と scope を決定する。                                                       |

### 3.2. 未確認範囲

- `watch` の実装パス、監視対象、debounce、失敗後の継続、scope ごとの起動先は evidence_refs 外のため未確認。
- `catalog build`、`register build`、`exec refresh` の内部処理は evidence_refs 外である。各処理の概念的な入出力・例外は先行 CDFD、rulebook、既存決定記録を根拠とし、今回の実装調査では再確認していない。
- `src/catalog-generate.ts` が返す `written` / `skipped` / `errors` を CLI 入口がどの終了コードへ変換するかは、列挙外コードを読まず未確認とした。
- `src/doc-index.ts` が出力対象ファイルを完全置換する一方、出力先の既存ファイルが書き込み不能な場合や書き込み中断時の原子性は未確認。
- ファイルシステム、VitePress、Git ignore、外部 watcher の障害時に、生成物の鮮度をどの永続情報で判定するかは未確認。

## 4. 進め方と実践の型の適用

`retrofit` として、実装エビデンスを現在動作、先行 CDFD・プロジェクトコンテキスト・決定記録を意図、成果物カタログを完了目的、rulebook を構造・記法の基準として分離した。対象成果物が未作成だったため新設し、実装と意図が一致する編集境界と一括生成順を反映し、根拠不足または乖離は成果物の未決事項と本 result に残した。

実際に参照した実装エビデンスと抽出した現在動作:

| 実装パス                  | 抽出した現在動作                                                                                                                                                                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/build-command.ts`    | scope は `exec`、`catalog`、`register`、`yaml-pages`、`index`、`all`。一括時はこの順に適用可能な step を同期実行し、非ゼロ終了で即時停止する。`exec`・`catalog`・`register` は project 構成の対応パスがある場合だけ適用し、`yaml-pages`・`index` は常に候補となる。`deliverable scaffold` は一括処理に含まれない。         |
| `src/catalog-generate.ts` | `dct-*.yaml` を列挙し、`kind: work` かつ path を持つ成果物をテンプレートまたは最小雛形から生成する。既存ファイルは既定で skip し、明示的な上書き時だけ置換する。カタログ・成果物単位のエラーを蓄積し、他対象を続行するため部分生成が起こり得る。                                                                           |
| `src/doc-index.ts`        | Markdown の namespaced Frontmatter ID、YAML top-level / `x-spec-meta` ID、設定されたネスト ID を収集し、言語 scope を考慮した索引を JSON へ全体出力する。同一 scope の重複と neutral / localized の混在は例外にする。`.` 始まり、`generated`、既定 skip directory を走査せず、一般の読み取り・解析失敗は収集から除外する。 |
| `src/yaml-pages.ts`       | 文書索引をメモリ上で収集し、`docs/ja/`・`docs/en/` の対象 YAML ごとに同階層の `generated/<name>.md` を生成する。正本を示す注記と生成マーカーを付け、同内容は未書き込み、マーカーのない既存ページは skip する。対象外になった古いページの削除処理はない。                                                                   |

`specdojo:cdfd-rulebook` の必須構成に従って、目的と適用範囲、プロセス一覧、Mermaid 図、主要例外、領域外委譲、確認者別受入条件を記載した。`specdojo:cdfd-mermaid-rulebook` に従い、一つの業務目的を一プロセスノードとし、イベント・正本・外部主体を形状で分け、すべてのエッジへ情報ラベルを付けた。プロジェクトコンテキストからは、人と AI Agent が同じ正本を参照できること、手作業と継続負荷を減らすこと、人間が主要判断を担うことだけを判断軸として反映し、`based_on` には追加していない。
