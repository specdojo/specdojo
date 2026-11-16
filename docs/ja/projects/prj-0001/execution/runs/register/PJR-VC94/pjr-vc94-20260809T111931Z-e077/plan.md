---
specdojo:
  id: prj-0001:xep-pjr-vc94-20260809t111931z-e077
  type: exec-plan
  rulebook: none
  task_id: PJR-VC94
  name: "検証とテストを個票正本の構成へ更新する"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
---

# Edit Plan: PJR-VC94 検証とテストを個票正本の構成へ更新する

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-VC94「検証とテストを個票正本の構成へ更新する」に対応する。

PJR-ES57 の分割6。表専用スキーマの廃止に伴う検証経路の付け替えと、移行後の挙動を検証するテストを整備する。

## 2. 対象項目

- `id`: PJR-VC94
- `type`: todo
- `priority`: high
- `owner`: ARC
- `due`: 2026-08-31
- `登録簿`: `docs/ja/projects/prj-0001/controls/project-register/pjr-index.md`
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-vc94-update-validation-and-tests.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/pjr-vc94-20260809T111931Z-e077-result.md`

## 3. 進め方

1. 登録簿の該当行と個票（存在する場合）を読み、目的・完了条件・制約を把握する。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、その仮説を result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。
5. 判断に迷う箇所は _TODO_ / _ASSUMPTION_ で残し、根拠と次のアクションを result に書く。

## 4. 完了手順

1. 「進め方」に従って対応を完了する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result に実施内容・変更ファイル・申し送りを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。
4. 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。状態遷移（review / close など）は runner と人間が行う。

## 5. 異常終了の条件

- 前提不足・対象ファイル不明・静的検査未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は登録簿の状態を変更せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・成果物規約

この規約は、生成される全 exec plan に共通で適用される。result の完了条件、他文書を参照する際のリンク記法、成果物の状態（status）の扱いを統一する。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 成果物に変更が不要と判断した場合でも、result の記入は省略しない。変更不要と判断した理由と根拠を result に記入してから完了する。
- result が未記入・プレースホルダのまま終了コード 0 で終了すると、runner は成果物未完了（block）として扱い、タスクはやり直しになる。完了前に result の記入漏れがないことを必ず確認する。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- plan に「プロジェクトコンテキスト」章がある場合、そこに挙がる文書はプロジェクト共通の前提を読むための参照であり、成果物 frontmatter の `based_on` へ転記しない。参照して得た前提は本文の記述内容へ反映する。
- 成果物 frontmatter の `based_on` に書けるのは、その成果物の `depends_on` の推移閉包に含まれる先行成果物だけである。閉包外の ID を書くと `catalog validate` が「`based_on` が `depends_on` の推移閉包に含まれていません」としてエラーになり、コミットがブロックされる。`based_on` を増やす必要が生じた場合は、自分で転記せず、根拠不足として result に記録する。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 編集・書き込みが作業ディレクトリ外（`external_directory`）として拒否された場合、原因はパス指定の誤り（誤った絶対パス・ディレクトリ名の取り違え）である。bash の heredoc などへ回避的に切り替えず、相対パスに直したうえで同じ編集ツールで再実行する。
- 整形・静的検査は、この plan の完了手順または本共通規約で明示されたコマンドを実行する。変更対象に必要な test、build、schema 検証は、plan に個別記載がなくても実行してよい。対象を限定できる場合は対象限定の手順を優先し、プロジェクト標準または変更内容から全体 test / build が必要な場合は実行してよい。実行したコマンド・対象・結果は result に記録する。
- Markdown 成果物を編集した後は、`npx prettier --write <対象ファイル>` で整形し、`npx markdownlint <対象ファイル>` で静的検査を実施する。検査でエラーが出た場合は修正してから完了とする。
- 終了する前に、コミット時に実行される検査（pre-commit 相当）を先回りで実行し、失敗をすべて修正してから完了する。コミット時に初めて失敗が判明すると commit がブロックされ、成果物の内容が完成していてもタスクは block になる。
- 実行対象は、変更したファイルの種別で判断する。下表のうち、変更したファイルが該当する行の検査をすべて実行する。該当行がない場合は追加の検査は不要である。
- 検査コマンドの正本はリポジトリの hook 設定（`lefthook.yml` など）である。下表と設定が食い違う場合は設定側に合わせ、実行したコマンドと結果を result に記録する。`specdojo` コマンドは、リポジトリで定められた起動方法（`npx tsx src/specdojo.ts <subcommand>` など）で実行する。

| 変更したファイル                                                   | 実行する検査                                                             |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `*.md`                                                             | `npx prettier --write <対象ファイル>`、`npx markdownlint <対象ファイル>` |
| `*.ts` / `*.js` / `*.json` / `*.yaml` / `*.yml`                    | `npx prettier --write <対象ファイル>`                                    |
| `src/`、`tests/`、`scripts/`、`tools/`、`tsconfig*.json`           | `npm run typecheck`                                                      |
| `src/`、`tests/`、`docs/ja/specdojo/templates/`、`vitest.config.*` | `npm test`                                                               |
| `docs/ja/projects/` 配下                                           | `specdojo catalog validate`                                              |
| `dct-*.yaml`                                                       | `specdojo catalog build`                                                 |
| `pjr-index.md`                                                     | `specdojo register build`                                                |
| `sch-*.yaml`                                                       | `specdojo exec refresh`                                                  |
| `docs/` 配下                                                       | `specdojo index build`                                                   |
