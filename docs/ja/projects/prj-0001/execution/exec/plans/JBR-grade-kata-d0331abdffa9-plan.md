---
specdojo:
  id: prj-0001:xep-jbr-grade-kata-d0331abdffa9
  type: exec-plan
  rulebook: none
  task_id: JBR-grade-kata-d0331abdffa9
  name: "実践の型の品質評価"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-grade-kata
  run_id: JBR-grade-kata-d0331abdffa9
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
- `failed` の段があるか。ある場合は rate limit、agent 側の失敗、`grade apply` が
  executor の marker を機械変換できず拒否したもの（executor を1回再実行しても
  解消しなかったもの）のいずれかへ切り分ける。
- Run が `partial` の場合は、`passed` の文書が1件以上あり、各 `failed` の文書と
  失敗段が pipeline state に記録されて次の Run の `--incomplete` で選択できるかを確認する。
- `retry_exhausted` の文書があるか。ある場合は失敗段と連続失敗回数を示し、人手での
  原因解消または state の再開判断を促す。
- agy 単段の verdict と score の分布に、評価設定の見直しを要する偏りがあるか。

選択された文書が0件の場合は no-op と判断する。判断できない事象は推測で埋めず、
観測した事実と未確認の範囲を分けて報告する。

## 2. Job Run

- `job_id`: job-grade-kata
- `run_id`: JBR-grade-kata-d0331abdffa9
- `scheduled_at`: 2026-10-22T20:00:00.000Z
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/JBR-grade-kata-d0331abdffa9-result.md`

入力:

```json
{
  "period": "2026-W43",
  "kind": "all",
  "limit": 15,
  "dependency_changed": true,
  "rulebook_changed": true,
  "unreviewed": true,
  "changed_only": true,
  "ungraded": true,
  "incomplete": true,
  "rubric_outdated": true
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
if npm run build; then
  :
else
  build_status=$?
  printf 'grade prerequisite build failed: exit_code=%s\n' "$build_status" >&2
  exit 1
fi
if tools/grade/run-per-document.sh --run-id JBR-grade-kata-d0331abdffa9 --stages 1 --stage-1-executor agy-expert-executor --kind all --limit 15 --dependency-changed=true --rulebook-changed=true --unreviewed=true --changed-only=true --ungraded=true --incomplete=true --rubric-outdated=true; then
  cat logs/grade/runs/per-document/JBR-grade-kata-d0331abdffa9/results.tsv
else
  grade_status=$?
  cat logs/grade/runs/per-document/JBR-grade-kata-d0331abdffa9/results.tsv
  if [ "$grade_status" -eq 2 ]; then
    printf 'grade pipeline partial: run_id=%s exit_code=%s\n' 'JBR-grade-kata-d0331abdffa9' "$grade_status" >&2
  else
    printf 'grade pipeline failed: run_id=%s exit_code=%s\n' 'JBR-grade-kata-d0331abdffa9' "$grade_status" >&2
  fi
  exit "$grade_status"
fi
```

コマンドが成功または設定済みの部分成功になった場合、上記の判断を reporter agent が evidence に基づいて行う。

## 4. 完了手順

1. 指示と入力に従って対象成果物を更新する。
2. 必要な整形・静的検査を実行する。
3. resultの必須セクションを記入し、`_TODO_`を残したまま終了しない。

## 5. 異常終了の条件

- 入力不足、対象不明、検査未解消の場合は異常終了する。
- agent自身はJob Runの状態やcheckpointを変更しない。runnerが終了結果を反映する。

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
