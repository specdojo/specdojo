---
specdojo:
  id: prj-0001:xep-jbr-grade-kata-941d96b2e3ed
  type: exec-plan
  rulebook: none
  task_id: JBR-grade-kata-941d96b2e3ed
  name: "実践の型の品質評価"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-grade-kata
  run_id: JBR-grade-kata-941d96b2e3ed
  owner: ARC
  paths:
    - docs/ja/specdojo/rulebooks
    - docs/ja/specdojo/recipes
    - docs/ja/specdojo/samples
    - docs/ja/specdojo/templates
---

# Job Plan: 実践の型の品質評価

## 1. このRunで行うこと

runner が記録した command evidence の終了コードと、stdout に出力された
`results.tsv` から次を判断して報告する。

- 終了コード75（rate limit）または中断で未完了の段が残っているか。残る場合は同じ
  `--run-id` で再開できる状態かを確認する。
- `failed` の段があるか。ある場合は rate limit、agent 側の失敗、`grade apply` の
  忠実性検証による拒否のいずれかへ切り分ける。
- 3段目が実行されなかった文書について、閾値未満と2段目の失敗のどちらが理由か。
- verdict と score の分布に、3段目の閾値の見直しを要する偏りがあるか。

選択された文書が0件の場合は no-op と判断する。判断できない事象は推測で埋めず、
観測した事実と未確認の範囲を分けて報告する。

## 2. Job Run

- `job_id`: job-grade-kata
- `run_id`: JBR-grade-kata-941d96b2e3ed
- `scheduled_at`: 2026-09-10T15:00:00.000Z
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/JBR-grade-kata-941d96b2e3ed-result.md`

入力:

```json
{
  "period": "2026-W37",
  "kind": "all",
  "limit": 10,
  "changed_only": true,
  "ungraded": true
}
```

## 3. 対象成果物

- -

対象パス:

- `docs/ja/specdojo/rulebooks`
- `docs/ja/specdojo/recipes`
- `docs/ja/specdojo/samples`
- `docs/ja/specdojo/templates`

### 3.1. 決定論的コマンド

runner が次の解決済みコマンドを agent の sandbox 外で直接実行する。

```sh
npm run build
tools/grade/run-per-document.sh --run-id JBR-grade-kata-941d96b2e3ed --kind all --limit 10 --changed-only=true --ungraded=true
cat logs/grade/runs/per-document/JBR-grade-kata-941d96b2e3ed/results.tsv
```

コマンドが成功した場合だけ、上記の判断を reporter agent が evidence に基づいて行う。

## 4. 完了手順

1. 指示と入力に従って対象成果物を更新する。
2. 必要な整形・静的検査を実行する。
3. resultの必須セクションを記入し、`_TODO_`を残したまま終了しない。

## 5. 異常終了の条件

- 入力不足、対象不明、検査未解消の場合は異常終了する。
- agent自身はJob Runの状態やcheckpointを変更しない。runnerが終了結果を反映する。

## 共通: 記法・成果物規約

この規約は、生成される全 exec plan に共通で適用される。result の完了条件、他文書を参照する際のリンク記法、成果物の状態（status）の扱いを統一する。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 成果物に変更が不要と判断した場合でも、result の記入は省略しない。変更不要と判断した理由と根拠を result に記入してから完了する。
- result が未記入・プレースホルダのまま終了コード 0 で終了すると、runner は成果物未完了（block）として扱い、タスクはやり直しになる。完了前に result の記入漏れがないことを必ず確認する。
- result の frontmatter は scaffold 済みの構造を正本とする。`id` / `task_id` / `mode` / `project_id` / `plan_ref` / `agent` / `execution` / `approach` / `targets` はキーの追加・削除・改名をせず、scaffold された値のまま維持する。見出し構成（`# Edit Result` などの H1、`## 1.` 以降の章立て）も独自の構成に置き換えない。埋めるのは本文セクションの `_TODO_` プレースホルダの中身だけである。`status` と `completed_at` は完了処理（runner 側）が更新するため、自分で書き換えない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- plan に「プロジェクトコンテキスト」章がある場合、そこに挙がる文書はプロジェクト共通の前提を読むための参照であり、成果物 frontmatter の `based_on` へ転記しない。参照して得た前提は本文の記述内容へ反映する。
- 成果物 frontmatter の `based_on` に書けるのは、その成果物の `depends_on` の推移閉包に含まれる先行成果物だけである。閉包外の ID を書くと `catalog validate` が「`based_on` が `depends_on` の推移閉包に含まれていません」としてエラーになり、コミットがブロックされる。`based_on` を増やす必要が生じた場合は、自分で転記せず、根拠不足として result に記録する。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 編集・書き込みが作業ディレクトリ外（`external_directory`）として拒否された場合、原因はパス指定の誤り（誤った絶対パス・ディレクトリ名の取り違え）である。bash の heredoc などへ回避的に切り替えず、相対パスに直したうえで同じ編集ツールで再実行する。
- 整形・静的検査は、この plan の完了手順または本共通規約で明示されたコマンドを実行する。変更対象に必要な test、build、schema 検証は、plan に個別記載がなくても実行してよい。同じ test script では対象限定と全件を同一 executor run 内で連続実行せず、どちらか一方に絞る。下表、plan、またはプロジェクト標準が全件 test を求める場合は、全件を1回だけ実行して対象限定の実行を省く。この制約は executor が sandbox 内で実行する test script の回数に対するものであり、親検証に設定された ID のコマンドは対象外である（親 runner が別途実行する）。実行したコマンド・対象・結果は result に記録する。
- executor / reporter pipeline で親 runner の検証が設定されている場合、executor は設定済み ID に対応するコマンドを sandbox 内で実行せず、executor 終了後に親 runner が固定許可リストから実行して evidence へ追記する。`validate-schema` は `npm run validate:schema`、`test-unit` は `npm run test:unit`、`test-integration` は `npm run test:integration` に対応する。executor は親検証と同じコマンドの対象限定版も追加せず、二重実行しない。
- Markdown 成果物を編集した後は、`npx prettier --write <対象ファイル>` で整形し、`npx markdownlint <対象ファイル>` で静的検査を実施する。検査でエラーが出た場合は修正してから完了とする。
- 終了する前に、コミット時に実行される検査（pre-commit 相当）を先回りで実行し、失敗をすべて修正してから完了する。コミット時に初めて失敗が判明すると commit がブロックされ、成果物の内容が完成していてもタスクは block になる。
- 実行対象は、変更したファイルの種別で判断する。下表のうち、変更したファイルが該当する行の検査をすべて実行する。該当行がない場合は追加の検査は不要である。ただし親検証に設定された ID のコマンドは下表よりも優先し、executor は実行しない。下表に同じコマンドが挙がっていても、親 runner の実行に委ねる。
- 検査コマンドの正本はリポジトリの hook 設定（`lefthook.yml` など）である。下表と設定が食い違う場合は設定側に合わせ、実行したコマンドと結果を result に記録する。`specdojo` コマンドは、リポジトリで定められた起動方法（`npx tsx src/specdojo.ts <subcommand>` など）で実行する。

| 変更したファイル                                                                                       | 実行する検査                                                                                                                          |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `*.md`                                                                                                 | `npx prettier --write <対象ファイル>`、`npx markdownlint <対象ファイル>`                                                              |
| `*.ts` / `*.js` / `*.json` / `*.yaml` / `*.yml`                                                        | `npx prettier --write <対象ファイル>`                                                                                                 |
| `src/`、`tests/`、`scripts/`、`tools/`、`tsconfig*.json`                                               | `npm run typecheck`                                                                                                                   |
| `src/`、`tests/`、`docs/ja/specdojo/templates/`、`docs/ja/specdojo/exec-templates/`、`vitest.config.*` | pipeline executor は `npm run test:unit`、それ以外は `npm test`（`test-unit` が親検証に設定されている場合は executor では実行しない） |
| `docs/ja/projects/` 配下                                                                               | `specdojo catalog validate`                                                                                                           |
| `dct-*.yaml`                                                                                           | `specdojo catalog build`                                                                                                              |
| `pjr-index.md`                                                                                         | `specdojo register build`                                                                                                             |
| `sch-*.yaml`                                                                                           | `specdojo exec refresh`                                                                                                               |
| `docs/` 配下                                                                                           | `specdojo index build`                                                                                                                |
