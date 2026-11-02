---
specdojo:
  id: prj-0001:xep-pjr-gq14-20261102t145228z-4a6820a3
  type: exec-plan
  rulebook: none
  task_id: PJR-GQ14
  name: "ユースケース別ガイドを具体的なプロダクト作成の対話フローに改訂する"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: BA
---

# Edit Plan: PJR-GQ14 ユースケース別ガイドを具体的なプロダクト作成の対話フローに改訂する

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-GQ14「ユースケース別ガイドを具体的なプロダクト作成の対話フローに改訂する」に対応する。

use-case-guide.md を LP・Next.js の Web サービス・Unity のゲームという作りたいもの別に再構成し、相談から成果物作成・検証・運用までの対話フローを示す。PJR-RTD5 の用途別ひな型は提供後に使い方を追記する。

## 2. 対象項目

- `id`: PJR-GQ14
- `type`: todo
- `priority`: medium
- `owner`: BA
- `due`: 2026-11-30
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-gq14-use-case-product-conversation-flow.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/pjr-gq14-20261102T145228Z-4a6820a3-result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 初回改訂の実物確認で現行仕様との不整合を確認した（2026-11-02、specdojo-orchestrator）。repos は名前をキーにした辞書ではなく name/path を持つ要素の配列。schedule build は --track、exec run --worktree は --register または --task 等の実行対象を明示する。ガイド内の引数不足の例を現行 --help と設定リファレンスに照合して修正する。register add 例には日本語タイトルに対応する --topic と具体的な --description、必要な --input、記帳用 --by specdojo-orchestrator と --commit を入れ、初期 commit と SpecDojo 側の develop ブランチ・設定 commit の前提を Quick Start へ適切につなぐ。
- 同じ完了条件の範囲で、仕様書が ready になれば Hero 等の実装タスクが自動生成されるという説明を修正する。文書カタログを schedule に展開する経路と、宣言済みプロダクトの実装 todo を register から実行する経路を区別し、生成されていない TSK-LP-01 等を実在する task ID として扱わない。コミット・統合は executor ではなく runner が実施し、統合先は承認済み設定に従う。検証はプロダクト側に設定・準備されたものだけを実行可能とし、main への自動統合や typecheck 等の自動実施を無条件に約束しない。人の判断と agent による finalize 操作を混同せず、ready 昇格を AI が一律に禁止されるという記述は現行ガイドに照合する。`dct-*` カタログと成果物文書 ID を混同しない。Next.js 例の同じ todo の重複を除き、例の担当・期限・技術採択は架空の合意例と明示する。
- LP・Next.js・Unity のケース別対話と共通運用への導線は維持する。PJR-RTD5 は LP、次に Next.js + Cloudflare の方針決定であり、スターター提供済みや Unity スターターの採用確定を仮定しない。公開ガイドは prj-0001 の内部個票がない利用者にも読めるようにし、内部の追跡は対応結果へ記録する。実際のプロダクト・保護設定は変更しない。Quick Start の同種の誤記は PJR-V5AZ で修正するため、共通手順はそこへリンクし、use-case-guide.md では同じ誤りを繰り返さない。

## 3. 進め方

1. 個票（存在する場合）を読み、目的・完了条件・制約を把握する。登録簿の一覧は大きいため読まない。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、記録する。pipeline では個票の対応結果と executor の報告の `handoff` に書き、result を直接書ける実行形式では result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。
5. 個票の完了条件が result への記載を求める場合、pipeline の executor は個票の対応結果と報告の `handoff` の両方に書く。reporter と runner が result の申し送りへ反映する。executor は result を直接編集しない。
6. 判断に迷う箇所は _TODO_ / _ASSUMPTION_ で残し、根拠と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。

### grade result から展開された finding

- なし

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

## 4. 完了手順

1. 「進め方」に従って対応を完了する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result に実施内容・変更ファイル・申し送りを記入する。pipeline では executor は実施内容・変更ファイル・検証結果を報告し、申し送りを `handoff` に記載する。reporter と runner が result を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。
4. 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。状態遷移（review / close など）は runner と人間が行う。

## 5. 異常終了の条件

- 前提不足・対象ファイル不明・静的検査未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は登録簿の状態を変更せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・成果物規約

作業を始める前に、共通の規約の詳細 `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` を読み、その内容に従う。次の箇条書きは、そのうち守らないと失敗に直結する要点である。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 検査を実行する前に、リポジトリの `package.json`、`.specdojo/specdojo.config.json`、hook 設定（`lefthook.yml` など）を読み、本共通規約の詳細にある検査表の適用条件で、実行する検査を決める。
- 適用条件を満たさない検査は実行せず、executor evidence の validations に `not_applicable` と非適用の理由を `reason` へ記録する。適用される検査が 1 つもない場合も同じく、該当する検査ごとに `not_applicable` と理由を記録する。
- `not_run` は、適用される検査を実行できたのに実行しなかった場合だけに使う。runner は `not_run` を検証失敗として扱い、タスクを先へ進めない。
- `pipeline.parent_validations` に設定された検査は executor evidence の validations に含めなくてよい。executor が同じ検査を `not_run` または `not_applicable` として含めても、同じリポジトリで実行した親 runner の結果を正とする。
